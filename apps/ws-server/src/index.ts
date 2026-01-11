import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { LiveTranscriptionEvents } from "@deepgram/sdk";
import { generateObject } from "ai";
import { z } from "zod"; // Zod is used for defining the analysis schema
import { toAsyncIterable } from "./lib/asyncIterable";
import { deepgramClient } from "./lib/deepGramClient";
import { google } from "./lib/gemini";
import { groqClient } from "./lib/groqForAISDK";

dotenv.config();

const app = express();
const server = createServer(app);
const port = 3001;

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  perMessageDeflate: {
    threshold: 1024,
  },
  maxHttpBufferSize: 10 * 1024 * 1024,
});

// Types for better type safety
interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

interface InterviewState {
  currentQuestionIndex: number;
  interviewStarted: boolean;
  conversationHistory: ConversationMessage[];
}

type InterviewAction =
  | "askFollowUpQuestion"
  | "moveToNextQuestion"
  | "endInterview";

interface AIResponse {
  action: InterviewAction;
  followUpQuestion?: string;
  acknowledgement?: string;
  closingStatement?: string;
}

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  let deepgramLive: any;

  // --- STATE MANAGEMENT ---
  const interviewState: InterviewState = {
    currentQuestionIndex: 0,
    interviewStarted: false,
    conversationHistory: [],
  };

  // Speech detection and timing controls
  let lastSpeechTime = 0;
  let speechTimeout: NodeJS.Timeout | null = null;
  let isUserSpeaking = false;
  let pendingTranscript = "";
  let isAIResponding = false;
  let isAgentSpeaking = false;

  // Configuration constants
  const SILENCE_THRESHOLD = 1500; // 2 seconds of silence before AI responds
  const MIN_SPEECH_LENGTH = 10; // Minimum transcript length to consider valid speech
  const THINKING_DELAY_MIN = 800; // Minimum thinking delay
  const THINKING_DELAY_MAX = 1200; // Maximum thinking delay
  let interviewQuestions = [
    "Can you tell me a little about yourself and your professional background?",
    "What are your greatest strengths and weaknesses?",
    "Can you describe a challenging situation you faced at work and how you handled it?",
    "Why are you interested in this position and our company?",
    "Where do you see yourself in the next five years?",
  ];

  // Helper function to clean up speech detection state
  const cleanupSpeechDetection = () => {
    if (speechTimeout) {
      clearTimeout(speechTimeout);
      speechTimeout = null;
    }
    isUserSpeaking = false;
    isAIResponding = false;
    pendingTranscript = "";
  };

  const speak = async (text: string) => {
    if (!text) return;

    isAgentSpeaking = true;
    console.log("AI says:", text);

    socket.emit("agent-transcript", {
      text,
      timestamp: new Date().toISOString(),
    });

    interviewState.conversationHistory.push({
      role: "assistant",
      content: text,
    });

    try {
      const ttsResponse = await deepgramClient.speak.request({ text }, {
        model: "aura-2-juno-en",
        format: "mp3",
      } as any);

      const stream = await ttsResponse.getStream();
      if (stream) {
        socket.emit("ai-audio-begin", { mimeType: "audio/mpeg" });

        // --- FIX STARTS HERE ---
        // We buffer chunks to ensure we aren't sending tiny packets that break MP3 frames
        let buffer = Buffer.alloc(0);
        const CHUNK_SIZE = 4096; // 4KB chunks (good balance of latency vs stability)

        for await (const chunk of toAsyncIterable(stream as any)) {
          buffer = Buffer.concat([buffer, Buffer.from(chunk)]);

          // Only emit if we have enough data
          if (buffer.length >= CHUNK_SIZE) {
            socket.emit("ai-audio-chunk", buffer);
            buffer = Buffer.alloc(0);
          }
        }

        // Emit any remaining data in the buffer
        if (buffer.length > 0) {
          socket.emit("ai-audio-chunk", buffer);
        }
        // --- FIX ENDS HERE ---

        socket.emit("ai-audio-end");
        console.log("Audio stream finished.");
      }
    } catch (error) {
      console.error("Error during Text-to-Speech generation:", error);
      socket.emit("ai-message", { text, timestamp: new Date().toISOString() });
    } finally {
      isAgentSpeaking = false;
    }
  };

  const handleUserResponse = async (transcript: string) => {
    console.log("Handling user response...");

    // Prevent processing if interview hasn't started, transcript is too short, or AI is already responding
    if (
      !interviewState.interviewStarted ||
      transcript.trim().length < MIN_SPEECH_LENGTH ||
      isAIResponding
    ) {
      return;
    }

    isAIResponding = true;

    // Add a natural pause before responding (like a human would think)
    const thinkingDelay =
      THINKING_DELAY_MIN +
      Math.random() * (THINKING_DELAY_MAX - THINKING_DELAY_MIN);
    console.log(`Thinking for ${Math.round(thinkingDelay)}ms...`);
    await new Promise((resolve) => setTimeout(resolve, thinkingDelay));

    // The user's latest message is added to the history here
    interviewState.conversationHistory.push({
      role: "user",
      content: transcript,
    });

    try {
      const lastQuestion =
        interviewQuestions[interviewState.currentQuestionIndex];

      console.log("Generating AI decision...");
      const { object } = await generateObject({
        // model: google("gemini-2.5-flash-lite"),
        model: groqClient("openai/gpt-oss-20b"),
        system: `You are an expert interviewer. Your sole task is to analyze the user's latest response and generate a single, raw JSON object to decide the next action.
               The last question you asked the user was: "${lastQuestion}".
               Analyze the user's latest response and decide the next action by calling the appropriate tool.
               You must choose one of the following actions:
               - askFollowUpQuestion: If the user's answer is too brief, vague, or could be expanded upon
               - moveToNextQuestion: If the user has sufficiently answered the current question
               - endInterview: If all questions have been asked and answered`,

        messages: interviewState.conversationHistory,

        schema: z.object({
          action: z.enum([
            "askFollowUpQuestion",
            "moveToNextQuestion",
            "endInterview",
          ]),
          followUpQuestion: z
            .string()
            .optional()
            .describe(
              "The specific follow-up question to ask (required if action is askFollowUpQuestion)"
            ),
          acknowledgement: z
            .string()
            .optional()
            .describe(
              "Brief acknowledgement of the user's answer (required if action is moveToNextQuestion)"
            ),
          closingStatement: z
            .string()
            .optional()
            .describe(
              "Final closing statement (required if action is endInterview)"
            ),
        }),
      });

      // --- APPLICATION LOGIC EXECUTES THE AI'S DECISION ---
      const { action, followUpQuestion, acknowledgement, closingStatement } =
        object;

      switch (action) {
        case "askFollowUpQuestion": {
          console.log(" AI Decision: Ask a follow-up question");
          if (followUpQuestion) {
            await speak(followUpQuestion);
          } else {
            await speak("Could you please elaborate on that?");
          }
          break;
        }

        case "moveToNextQuestion": {
          console.log("AI Decision: Move to the next question");
          interviewState.currentQuestionIndex++;
          if (interviewState.currentQuestionIndex < interviewQuestions.length) {
            const nextQuestion =
              interviewQuestions[interviewState.currentQuestionIndex];
            const responseText = `${
              acknowledgement || "Thank you for that answer"
            }. My next question is: ${nextQuestion}`;
            await speak(responseText);
          } else {
            await speak(
              `${
                acknowledgement || "Thank you for that answer"
              }. Actually, that was the last question I had. Thank you for your time!`
            );
            console.log("Interview finished. Signaling client to disconnect.");
            socket.emit("interview-finished");
            setTimeout(() => socket.disconnect(true), 2000);
          }
          break;
        }

        case "endInterview": {
          console.log("AI Decision: End the interview");
          await speak(
            closingStatement ||
              "Thank you for your time today. That concludes our interview."
          );
          console.log("Interview finished. Signaling client to disconnect.");
          socket.emit("interview-finished");
          setTimeout(() => socket.disconnect(true), 2000);
          break;
        }

        default: {
          console.warn(`
             Unknown action: ${action}`);
          // Fallback: move to next question
          interviewState.currentQuestionIndex++;
          if (interviewState.currentQuestionIndex < interviewQuestions.length) {
            await speak(
              "I see. Let's move on. " +
                interviewQuestions[interviewState.currentQuestionIndex]
            );
          } else {
            await speak(
              "Okay, thank you for sharing that. That concludes our interview."
            );
          }
          break;
        }
      }
    } catch (error) {
      console.error(" An error occurred in the conversation handler:", error);
      // Provide a fallback response to keep the interview flowing
      try {
        await speak(
          "I apologize, but I encountered an issue. Let's continue with the next question."
        );
        interviewState.currentQuestionIndex++;
        if (interviewState.currentQuestionIndex < interviewQuestions.length) {
          await speak(interviewQuestions[interviewState.currentQuestionIndex]);
        } else {
          await speak("That concludes our interview. Thank you for your time!");
        }
      } catch (fallbackError) {
        console.error(" Error in fallback response:", fallbackError);
        socket.emit(
          "error",
          "An error occurred during the interview. Please try again."
        );
      }
    } finally {
      isAIResponding = false;
    }
  };

  const startInterview = async () => {
    console.log("Interview starting...");
    interviewState.interviewStarted = true;
    const firstQuestion = `Hello! Thank you for joining me today. Let's begin. ${interviewQuestions[0]}`;
    await speak(firstQuestion);
  };

  // --- SOCKET EVENT HANDLERS ---

  socket.on("start-stream", (data: { questions: string[] }) => {
    console.log(" Client requested to start stream.");
    if (data.questions && data.questions.length > 0) {
      interviewQuestions = data.questions;
    } else {
      interviewQuestions = [
        "Can you tell me a little about yourself and your professional background?",
        "What are your greatest strengths and weaknesses?",
        "Can you describe a challenging situation you faced at work and how you handled it?",
        "Why are you interested in this position and our company?",
        "Where do you see yourself in the next five years?",
      ];
    }
    deepgramLive = deepgramClient.listen.live({
      model: "nova-3",
      language: "en-US",
      smart_format: true,
      interim_results: true, // Allow faster partials
      endpointing: 120, // More aggressive endpointing
      vad_events: true,
    });

    deepgramLive.on(LiveTranscriptionEvents.Open, async () => {
      console.log("Deepgram connection opened.");
      socket.emit("deepgram-ready");
      await startInterview(); // Proactively start the interview
    });

    deepgramLive.on(LiveTranscriptionEvents.Transcript, (data: any) => {
      if (isAIResponding || isAgentSpeaking) return;

      const transcript = data.channel.alternatives[0].transcript;

      // Handle interim results (user is still speaking)
      if (transcript && !data.is_final) {
        isUserSpeaking = true;
        console.log("User said (interim):", transcript);

        socket.emit("user-transcript-interim", {
          text: transcript,
          timestamp: new Date().toISOString(),
        });

        // Clear any pending response timeout
        if (speechTimeout) {
          clearTimeout(speechTimeout);
          speechTimeout = null;
        }
        return;
      }

      // Handle final results (user finished speaking a phrase)
      if (
        transcript &&
        data.is_final &&
        transcript.length >= MIN_SPEECH_LENGTH &&
        interviewState.interviewStarted
      ) {
        console.log("Final transcript received:", transcript);

        // Accumulate the transcript instead of replacing it
        pendingTranscript += (pendingTranscript ? " " : "") + transcript;
        console.log("Accumulated transcript:", pendingTranscript);

        lastSpeechTime = Date.now();

        // Clear any existing timeout
        if (speechTimeout) {
          clearTimeout(speechTimeout);
        }

        // Set a timeout to wait for silence before responding
        speechTimeout = setTimeout(async () => {
          if (pendingTranscript && !isAIResponding) {
            console.log("Processing user response after silence...");
            socket.emit("user-transcript-final", {
              text: pendingTranscript,
              timestamp: new Date().toISOString(),
            });
            await handleUserResponse(pendingTranscript);
            pendingTranscript = "";
            isUserSpeaking = false;
          }
        }, SILENCE_THRESHOLD);
      }
    });

    deepgramLive.on(LiveTranscriptionEvents.Close, () =>
      console.log("Deepgram connection closed.")
    );
    deepgramLive.on(LiveTranscriptionEvents.Error, (err: unknown) =>
      console.error("Deepgram Error:", err)
    );

    // Handle Voice Activity Detection events
    deepgramLive.on(LiveTranscriptionEvents.UtteranceEnd, () => {
      console.log("Utterance ended - user finished speaking");
      isUserSpeaking = false;

      // If we have accumulated transcript and no timeout is set, set one now
      if (pendingTranscript && !speechTimeout && !isAIResponding) {
        console.log(
          " Setting timeout after utterance end for:",
          pendingTranscript
        );
        speechTimeout = setTimeout(async () => {
          if (pendingTranscript && !isAIResponding) {
            console.log("Processing user response after utterance end...");
            socket.emit("user-transcript-final", {
              text: pendingTranscript,
              timestamp: new Date().toISOString(),
            });
            await handleUserResponse(pendingTranscript);
            pendingTranscript = "";
            isUserSpeaking = false;
          }
        }, SILENCE_THRESHOLD);
      }
    });
  });

  socket.on("audio-stream", async (audioChunk: any) => {
    if (deepgramLive?.getReadyState() === 1) {
      deepgramLive.send(audioChunk);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);

    // Clean up speech detection state
    cleanupSpeechDetection();

    if (deepgramLive) {
      deepgramLive.finish();
    }
    // Reset interview state for next connection
    interviewState.currentQuestionIndex = 0;
    interviewState.interviewStarted = false;
    interviewState.conversationHistory = [];
  });

  // Add a reset endpoint for manual interview restart
  socket.on("reset-interview", () => {
    console.log("Resetting interview state");

    // Clean up speech detection state
    cleanupSpeechDetection();

    // Reset interview state
    interviewState.currentQuestionIndex = 0;
    interviewState.interviewStarted = false;
    interviewState.conversationHistory = [];
    socket.emit("interview-reset");
  });
});

server.listen(port, () =>
  console.log(`Server is listening on http://localhost:${port}`)
);
