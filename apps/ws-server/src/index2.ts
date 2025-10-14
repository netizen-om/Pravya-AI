import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { LiveTranscriptionEvents } from "@deepgram/sdk";
import { streamText } from "ai";
import { toAsyncIterable } from "./lib/asyncIterable";
import { deepgramClient } from "./lib/deepGramClient";
import { google } from "./lib/gemini";

dotenv.config();

// Configuration constants
const CONFIG = {
  SILENCE_THRESHOLD: 2000, // 2 seconds of silence before AI responds
  MIN_RESPONSE_DELAY: 500, // Minimum 500ms delay before AI can respond
  MIN_SPEECH_LENGTH: 20, // Minimum transcript length to consider valid speech
  CONVERSATION_HISTORY_LIMIT: 20, // Maximum conversation history entries
  THINKING_DELAY_MIN: 800, // Minimum thinking delay
  THINKING_DELAY_MAX: 1200, // Maximum thinking delay
};

// Interview questions configuration
const INTERVIEW_CONFIG = {
  questions: [
    "First, can you tell me about a challenging project you've worked on and what you learned from it?",
    "How do you handle disagreements with a team member or manager?",
    "Describe your experience with asynchronous programming in JavaScript.",
    "What are your long-term career goals?",
    "Finally, do you have any questions for me about the role or the company?",
  ],
  systemPrompt: "You are Alex, a friendly, professional, and engaging AI interviewer. Your goal is to assess the candidate while making them feel comfortable. Keep all your responses, including acknowledgements and follow-up questions, very concise and human-like (1-3 sentences). Do not narrate your actions. Create natural transitions instead of saying 'Now for the next question.'",
};

// Helper function to convert stream to buffer
async function streamToBuffer(stream: any): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of toAsyncIterable(stream)) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

// Reusable TTS function
async function generateAndStreamTTS(text: string, socket: any): Promise<void> {
  try {
    console.log("Generating TTS for:", text);
    const ttsResponse = await deepgramClient.speak.request(
      { text },
      {
        model: "aura-asteria-en",
        format: "mp3",
      } as any
    );
    
    const stream = await ttsResponse.getStream();
    if (stream) {
      // Announce a new audio response
      socket.emit("ai-audio-begin", { mimeType: "audio/mpeg" });
      // Stream chunks as they arrive for low latency playback
      for await (const chunk of toAsyncIterable(stream as any)) {
        socket.emit("ai-audio-chunk", Buffer.from(chunk));
      }
      socket.emit("ai-audio-end");
    }
  } catch (error) {
    console.error("Error generating TTS:", error);
    throw error;
  }
}

// Reusable AI response generation function
async function generateAIResponse(
  userMessage: string,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>,
  currentQuestionIndex: number,
  totalQuestions: number
): Promise<string> {
  try {
    // Determine the next instruction for the AI
    let nextInstruction = "";
    if (currentQuestionIndex < totalQuestions) {
      nextInstruction = `Your task is to first acknowledge and respond to the user's answer. If their answer is short, you can ask a relevant follow-up question. When you are ready, smoothly transition to the next predefined question: "${INTERVIEW_CONFIG.questions[currentQuestionIndex]}"`;
    } else {
      nextInstruction = "The interview is now over. Thank the user for their time and say goodbye.";
    }

    // Create messages for API call
    const messagesForApi = [
      { role: "system" as const, content: INTERVIEW_CONFIG.systemPrompt },
      ...conversationHistory,
      { role: "system" as const, content: `(Instruction for this turn: ${nextInstruction})` }
    ];

    console.log("Generating AI response for:", userMessage);
    const { textStream } = await streamText({
      model: google("gemini-2.5-flash-lite"),
      system : INTERVIEW_CONFIG.systemPrompt,
      messages: conversationHistory,
    });

    let fullResponse = "";
    for await (const textPart of textStream) {
      fullResponse += textPart;
    }

    return fullResponse;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
}

// Interview state management class
class InterviewState {
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = [];
  currentQuestionIndex = 0;
  interviewStarted = false;
  
  // Speech detection and timing controls
  lastSpeechTime = 0;
  speechTimeout: NodeJS.Timeout | null = null;
  isUserSpeaking = false;
  pendingTranscript = "";
  isAIResponding = false;

  // Helper function to manage conversation history size
  addToConversationHistory(message: { role: "user" | "assistant"; content: string }): void {
    this.conversationHistory.push(message);
    // Keep only the last N messages to prevent memory issues
    if (this.conversationHistory.length > CONFIG.CONVERSATION_HISTORY_LIMIT) {
      this.conversationHistory = this.conversationHistory.slice(-CONFIG.CONVERSATION_HISTORY_LIMIT);
    }
  }

  // Clear timeouts and reset state
  cleanup(): void {
    if (this.speechTimeout) {
      clearTimeout(this.speechTimeout);
      this.speechTimeout = null;
    }
    this.isUserSpeaking = false;
    this.isAIResponding = false;
    this.pendingTranscript = "";
  }

  // Reset interview state
  reset(): void {
    this.conversationHistory = [];
    this.currentQuestionIndex = 0;
    this.interviewStarted = false;
    this.cleanup();
  }

  // Check if interview is complete
  isInterviewComplete(): boolean {
    return this.currentQuestionIndex >= INTERVIEW_CONFIG.questions.length;
  }

  // Get next question
  getNextQuestion(): string | null {
    if (this.currentQuestionIndex < INTERVIEW_CONFIG.questions.length) {
      return INTERVIEW_CONFIG.questions[this.currentQuestionIndex];
    }
    return null;
  }
}

const app = express();
const server = createServer(app);
const port = 3001;

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  // Reduce per-message overhead and allow larger binary chunks for audio
  perMessageDeflate: {
    threshold: 1024,
  },
  maxHttpBufferSize: 10 * 1024 * 1024,
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  let deepgramLive: any;
  const interviewState = new InterviewState();

  // Helper function to handle AI response with proper timing
  const handleAIResponse = async (transcript: string): Promise<void> => {
    if (interviewState.isAIResponding) {
      console.log("AI is already responding, skipping...");
      return; // Prevent multiple simultaneous responses
    }
    
    interviewState.isAIResponding = true;
    console.log("User said:", transcript);
    interviewState.addToConversationHistory({ role: "user", content: transcript });

    try {
      // Add a natural pause before responding (like a human would think)
      const thinkingDelay = CONFIG.THINKING_DELAY_MIN + 
        Math.random() * (CONFIG.THINKING_DELAY_MAX - CONFIG.THINKING_DELAY_MIN);
      console.log(`Thinking for ${Math.round(thinkingDelay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, thinkingDelay));

      // Generate AI response
      const fullResponse = await generateAIResponse(
        transcript,
        interviewState.conversationHistory,
        interviewState.currentQuestionIndex,
        INTERVIEW_CONFIG.questions.length
      );

      if (fullResponse) {
        console.log("AI says:", fullResponse);
        interviewState.addToConversationHistory({ role: "assistant", content: fullResponse });

        // Increment the index only after the AI has responded
        if (interviewState.currentQuestionIndex < INTERVIEW_CONFIG.questions.length) {
          interviewState.currentQuestionIndex++;
        }

        // Generate and stream TTS
        await generateAndStreamTTS(fullResponse, socket);
      }
    } catch (error) {
      console.error("Error in handleAIResponse:", error);
    } finally {
      interviewState.isAIResponding = false;
    }
  };

  // Helper function to start the interview
  const startInterview = async (): Promise<void> => {
    if (interviewState.interviewStarted) return;
    
    interviewState.interviewStarted = true;
    const firstQuestion = "Hello and welcome to the interview! My name is Alex, and I'll be speaking with you today. Let's start with our first question. " + INTERVIEW_CONFIG.questions[0];
    
    interviewState.addToConversationHistory({ role: "assistant", content: firstQuestion });
    interviewState.currentQuestionIndex = 1; // Set to 1 since we just asked question 0

    // Generate and stream the first question
    await generateAndStreamTTS(firstQuestion, socket);
  };

  socket.on("start-stream", () => {
    console.log("Client requested to start stream.");
    
    // Reset interview state for new session
    interviewState.reset();
    
    deepgramLive = deepgramClient.listen.live({
      model: "nova-2",
      language: "en-US",
      smart_format: true,
      interim_results: true, // allow faster partials
      endpointing: 120, // more aggressive endpointing
      vad_events: true,
    });

    deepgramLive.on(LiveTranscriptionEvents.Open, async () => {
      console.log("Deepgram connection opened.");
      socket.emit("deepgram-ready");

      // Start the interview
      await startInterview();
    });

    deepgramLive.on(LiveTranscriptionEvents.Transcript, (data: any) => {
      const transcript = data.channel.alternatives[0].transcript;
      
      // console.log(`Transcript (${data.is_final ? 'FINAL' : 'INTERIM'}):`, transcript);
      
      // Handle interim results (user is still speaking)
      if (transcript && !data.is_final) {
        interviewState.isUserSpeaking = true;
        interviewState.pendingTranscript = transcript;
        interviewState.lastSpeechTime = Date.now();
        
        // Clear any pending response timeout
        if (interviewState.speechTimeout) {
          clearTimeout(interviewState.speechTimeout);
          interviewState.speechTimeout = null;
        }
        return;
      }
      
      // Handle final results (user finished speaking)
      if (transcript && data.is_final && transcript.length >= CONFIG.MIN_SPEECH_LENGTH) {
        console.log("Final transcript received:", transcript);
        interviewState.lastSpeechTime = Date.now();
        interviewState.pendingTranscript = transcript;
        
        // Clear any existing timeout
        if (interviewState.speechTimeout) {
          clearTimeout(interviewState.speechTimeout);
        }
        
        // Set a timeout to wait for silence before responding
        interviewState.speechTimeout = setTimeout(async () => {
          if (interviewState.pendingTranscript && !interviewState.isAIResponding) {
            console.log("Processing user response after silence...");
            await handleAIResponse(interviewState.pendingTranscript);
            interviewState.pendingTranscript = "";
            interviewState.isUserSpeaking = false;
          }
        }, CONFIG.SILENCE_THRESHOLD);
      }
    });

    // Handle Voice Activity Detection events
    deepgramLive.on(LiveTranscriptionEvents.UtteranceEnd, () => {
      console.log("Utterance ended - user finished speaking");
      interviewState.isUserSpeaking = false;
    });

    deepgramLive.on(LiveTranscriptionEvents.Close, () =>
      console.log("Deepgram connection closed.")
    );
    
    deepgramLive.on(LiveTranscriptionEvents.Error, (err: unknown) =>
      console.error("Deepgram Error:", err)
    );
  });

  socket.on("audio-stream", async (audioChunk: any) => {
    try {
      if (deepgramLive?.getReadyState() === 1) {
        // Ensure we forward raw bytes (handle Blob/ArrayBuffer/Buffer)
        if (audioChunk?.arrayBuffer) {
          const arr = await audioChunk.arrayBuffer();
          deepgramLive.send(Buffer.from(arr));
        } else if (audioChunk instanceof ArrayBuffer) {
          deepgramLive.send(Buffer.from(audioChunk));
        } else if (Buffer.isBuffer(audioChunk)) {
          deepgramLive.send(audioChunk);
        } else {
          // Fallback
          deepgramLive.send(audioChunk);
        }
      }
    } catch (err: unknown) {
      console.error("Error forwarding audio chunk:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    
    // Clean up interview state
    interviewState.cleanup();
    
    if (deepgramLive) {
      deepgramLive.finish();
    }
  });
});

server.listen(port, () =>
  console.log(`Server is listening on http://localhost:${port}`)
);