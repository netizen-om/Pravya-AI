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

  let conversationHistory: { role: "user" | "assistant"; content: string }[] =
    [];
  const interviewQuestions = [
    "First, can you tell me about a challenging project you've worked on and what you learned from it?",
    "How do you handle disagreements with a team member or manager?",
    "Describe your experience with asynchronous programming in JavaScript.",
    "What are your long-term career goals?",
    "Finally, do you have any questions for me about the role or the company?",
  ];
  let currentQuestionIndex = 0;
  let interviewStarted = false;

  socket.on("start-stream", () => {
    console.log("Client requested to start stream.");
    deepgramLive = deepgramClient.listen.live({
      model: "nova-2",
      language: "en-US",
      smart_format: true,
      interim_results: true, // allow faster partials
      endpointing: 120, // more aggressive endpointing
      vad_events: true,
    });

    deepgramLive.on(LiveTranscriptionEvents.Open, () => {
      console.log("Deepgram connection opened.");
      socket.emit("deepgram-ready");

      deepgramLive.on(LiveTranscriptionEvents.Transcript, async (data: any) => {
        const transcript = data.channel.alternatives[0].transcript;
        if (!transcript) return;

        // Only trigger LLM + TTS for finals to avoid thrashing
        if (data.is_final) {
          console.log("User said:", transcript);
          conversationHistory.push({ role: "user", content: transcript });

          console.log(conversationHistory);

          const { textStream } = await streamText({
            model: google("gemini-2.5-flash-lite"),
            system: `You are a friendly interviewer Voice Agent. You have to ask user all the questions mention below one after another. Make sure you take some follow-up from the user when neccesay. You have to start from first question and need to ask all the queation. In each request you'll get all past conversation history with user. Keep cool tone and try to replay short.
            
            User current transcript : ${transcript}

            Interview Questions : ${interviewQuestions}
            `,
            messages: conversationHistory,
          });

          let fullResponse = "";
          for await (const textPart of textStream) {
            fullResponse += textPart;
          }

          if (fullResponse) {
            console.log("AI says:", fullResponse);
            conversationHistory.push({
              role: "assistant",
              content: fullResponse,
            });
            const ttsResponse = await deepgramClient.speak.request(
              { text: fullResponse },
              {
                model: "aura-asteria-en",
                // Request a streaming-friendly container (mp3 works well with MSE in most browsers)
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
          }
        }
      });

      deepgramLive.on(LiveTranscriptionEvents.Close, () =>
        console.log("Deepgram connection closed.")
      );
      deepgramLive.on(LiveTranscriptionEvents.Error, (err: unknown) =>
        console.error("Deepgram Error:", err)
      );
    });
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
    if (deepgramLive) {
      deepgramLive.finish();
    }
  });
});

server.listen(port, () =>
  console.log(`Server is listening on http://localhost:${port}`)
);
