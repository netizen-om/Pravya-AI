"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MessageCircle, PhoneIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface IconProps {
  className?: string;
}

// The new message structure
interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

// A new component for the "Listening..." animation
const ListeningIndicator = () => {
  return (
    <div className="flex items-center justify-center space-x-1.5 p-2">
      <span className="h-2 w-2 rounded-full bg-white animate-pulse [animation-delay:-0.3s]"></span>
      <span className="h-2 w-2 rounded-full bg-white animate-pulse [animation-delay:-0.15s]"></span>
      <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
    </div>
  );
};

const page = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [messages, setMessages] = useState<
    {
      id: string;
      role: "user" | "assistant";
      text: string;
      interim?: boolean;
    }[]
  >([]);
  const interimUserIdRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Refs to hold socket, media recorder, and media source without causing re-renders
  const socketRef = useRef<Socket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaSourceRef = useRef<MediaSource | null>(null);
  const sourceBufferRef = useRef<SourceBuffer | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const pendingChunksRef = useRef<Uint8Array[]>([]);

  const lastMessage = messages[messages.length - 1];
  const showListeningIndicator =
    lastMessage?.role === "user" && lastMessage?.interim;

  useEffect(() => {
    // Initialize Socket.IO connection
    socketRef.current = io("http://localhost:3001");
    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    // Listen for the "ready" signal from the server
    socket.on("deepgram-ready", () => {
      console.log("Server is ready. Starting recording...");
      setIsReady(true);
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.start(100); // 100ms chunks for lower latency
      }
    });
    // User interim transcript
    socket.on("user-transcript-interim", ({ text }: { text: string }) => {
      const id = interimUserIdRef.current || `u-${Date.now()}`;
      interimUserIdRef.current = id;
      setMessages((prev) => {
        const exists = prev.find((m) => m.id === id);
        if (exists) {
          return prev.map((m) =>
            m.id === id ? { ...m, text, interim: true } : m
          );
        }
        return [...prev, { id, role: "user", text, interim: true }];
      });
    });
    // User final transcript
    socket.on("user-transcript-final", ({ text }: { text: string }) => {
      const id = interimUserIdRef.current || `u-${Date.now()}`;
      interimUserIdRef.current = null;
      setMessages((prev) => {
        const exists = prev.find((m) => m.id === id);
        if (exists) {
          return prev.map((m) =>
            m.id === id ? { ...m, text, interim: false } : m
          );
        }
        return [...prev, { id, role: "user", text, interim: false }];
      });
    });
    // Agent transcript (text that AI will speak)
    socket.on("agent-transcript", ({ text }: { text: string }) => {
      const id = `a-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setMessages((prev) => [...prev, { id, role: "assistant", text }]);
    });
    // Streamed audio begin -> create MediaSource and SourceBuffer
    socket.on("ai-audio-begin", ({ mimeType }: { mimeType: string }) => {
      console.log("AI audio begin", mimeType);
      if (!audioElementRef.current) {
        audioElementRef.current = new Audio();
        audioElementRef.current.autoplay = true;
        document.body.appendChild(audioElementRef.current);
      }
      mediaSourceRef.current = new MediaSource();
      audioElementRef.current.src = URL.createObjectURL(mediaSourceRef.current);
      mediaSourceRef.current.addEventListener("sourceopen", () => {
        try {
          sourceBufferRef.current =
            mediaSourceRef.current!.addSourceBuffer(mimeType);
          // Drain any pending chunks queued before sourceBuffer was ready
          const pending = pendingChunksRef.current;
          pendingChunksRef.current = [];
          for (const chunk of pending) {
            appendChunk(chunk);
          }
        } catch (e) {
          console.error("Failed to create SourceBuffer", e);
        }
      });
    });

    // Streamed audio chunk
    socket.on("ai-audio-chunk", (buf: ArrayBuffer) => {
      const chunk = new Uint8Array(buf);
      appendChunk(chunk);
    });

    // Streamed audio end
    socket.on("ai-audio-end", () => {
      console.log("AI audio end");
      const ms = mediaSourceRef.current;
      if (ms && ms.readyState === "open") {
        try {
          ms.endOfStream();
        } catch {}
      }
      sourceBufferRef.current = null;
      mediaSourceRef.current = null;
    });

    socket.on("interview-finished", () => {
      console.log('✅ Received "interview-finished" signal from server.');
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        mediaRecorderRef.current.stop();
      }
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.src = "";
        audioElementRef.current.remove();
        audioElementRef.current = null;
      }
      setIsRecording(false);
    };
  }, []);

  function appendChunk(chunk: Uint8Array) {
    const sb = sourceBufferRef.current;
    if (!sb) {
      // Buffer until SourceBuffer is ready
      pendingChunksRef.current.push(chunk);
      return;
    }
    // Queue appends; avoid InvalidStateError when updating
    const doAppend = () => {
      try {
        const arrayBuffer = chunk.buffer.slice(
          chunk.byteOffset,
          chunk.byteOffset + chunk.byteLength
        );
        sb.appendBuffer(arrayBuffer as ArrayBuffer);
      } catch (e) {
        // If buffer full or in bad state, retry shortly
        setTimeout(doAppend, 10);
        return;
      }
    };
    if (sb.updating) {
      sb.addEventListener("updateend", function onEnd() {
        sb.removeEventListener("updateend", onEnd);
        doAppend();
      });
    } else {
      doAppend();
    }
  }

  const handleRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      setIsReady(false);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: "audio/webm;codecs=opus",
        });

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0 && socketRef.current) {
            event.data.arrayBuffer().then((arr) => {
              socketRef.current!.emit("audio-stream", arr);
            });
          }
        };

        // Tell the server to get ready
        socketRef.current?.emit("start-stream");
        setIsRecording(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    }
  };

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const userAvatar = "https://placehold.co/40x40/16a34a/ffffff?text=Y";
  const assistantAvatar = "https://placehold.co/40x40/7c3aed/ffffff?text=A";

  const filteredMessages = messages.filter(
    (msg) => !(msg.role === "user" && msg.interim)
  );

  return (
    <>
      <div className="min-h-screen w-full bg-neutral-950 flex items-center p-4">
        <div className="bg-neutral-950 border border-neutral-800 p-2 rou w-full flex flex-col shadow-neutral-900 shadow-2xl">
          <div>
            <h2 className="text-2xl px-4 py-2 pt-4 text-white">
              Senior IT Engineer - Live Interview
            </h2>
            <p className="text-l px-4 py-2 text-white">
              Al Interview session for Fun Ltd
            </p>

            <div className="grid grid-cols-3 gap-3 w-full py-2">
              <div className="w-auto h-[450] bg-neutral-900 rounded-lg">
                <div className="flex flex-col justify-center items-center h-full w-full">
                  <div className="w-[110] h-[110] rounded-full bg-white"></div>
                  <div className="bg-neutral-700 px-5 py-1 rounded-3xl mt-3 text-white">
                    {isRecording
                      ? isReady
                        ? "Listening..."
                        : "Connecting..."
                      : "Idle"}
                  </div>
                </div>
              </div>
              <div className="w-auto h-[450] bg-neutral-900 rounded-lg">
                <div className="flex justify-center items-center h-full w-full">
                  <Image
                    src="/user-avatar.png"
                    width={110}
                    height={110}
                    alt="placerholder"
                    className=" rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="w-auto h-[450] bg-neutral-900 rounded-lg">
                <div className="w-full h-full bg-neutral-900 rounded-lg">
                  <div className="flex flex-col h-full bg-transparent font-sans">
                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto">
                      {messages.length === 0 ? (
                        // ✨ NEW: Placeholder for when the chat is empty
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <MessageCircle className="h-16 w-16 text-neutral-600" />
                          <div className="mt-4 text-neutral-400">
                            <div>Your interview chat will appear here.</div>
                            <div>Click the "Start" button below to begin.</div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-4">
                          {filteredMessages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex items-end gap-3 ${
                                msg.role === "user"
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              {msg.role === "assistant" && (
                                <img
                                  className="w-8 h-8 rounded-full"
                                  src={assistantAvatar}
                                  alt="Assistant's Avatar"
                                />
                              )}
                              <div
                                className={`max-w-xs md:max-w-sm p-3 rounded-2xl ${
                                  msg.role === "user"
                                    ? "bg-slate-200 !text-neutral-900 rounded-br-none z-10"
                                    : "bg-neutral-700 text-white rounded-bl-none" // AI message style
                                }`}
                              >
                                <p className="text-sm">{msg.text}</p>
                              </div>
                              {msg.role === "user" && (
                                <img
                                  className="w-8 h-8 rounded-full"
                                  src={userAvatar}
                                  alt="User's Avatar"
                                />
                              )}
                            </div>
                          ))}
                          {/* ✨ NEW: Conditionally render the listening indicator here ✨ */}
                          {showListeningIndicator && (
                            <div className="flex justify-end pr-12">
                              <div className="text-sm flec flex text-neutral-400 animate-pulse">
                                <ListeningIndicator />
                                Listening...
                              </div>
                            </div>
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full h-[100] justify-center items-center">
            <div>
              <TooltipProvider>
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="destructive"
                        onClick={handleRecording}
                        aria-label="End interview"
                        className="rounded-3xl bg-red-500"
                      >
                        <PhoneIcon className="h-5 w-5 mr-2" />
                        {isRecording ? "Stop" : "Start"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>End Interview</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
