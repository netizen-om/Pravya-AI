"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PhoneIcon, PhoneOff } from "lucide-react";
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

const Send: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="m22 2-11 11" />
  </svg>
);

const Paperclip: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

const page = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "assistant", content: "Hey, how is the project going?" },
    {
      id: 2,
      role: "user",
      content:
        "Hey Jane! It's going great. We are on track to meet the deadline.",
    },
    {
      id: 3,
      role: "assistant",
      content:
        "That's awesome news! Let me know if you need any help with the UI/UX part.",
    },
    {
      id: 4,
      role: "user",
      content:
        "Will do! I might need your feedback on the new dashboard design later this week.",
    },
    {
      id: 5,
      role: "assistant",
      content: "Sure, happy to help. Just send it over whenever you are ready.",
    },
    {
      id: 6,
      role: "user",
      content: "Sure, happy to help. Just send it over whenever you are ready.",
    },
  ]);
  const [inputValue, setInputValue] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Realtime/socket/audio state
  const socketRef = useRef<Socket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isDeepgramReady, setIsDeepgramReady] = useState<boolean>(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>("");
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const mediaSourceRef = useRef<MediaSource | null>(null);
  const sourceBufferRef = useRef<SourceBuffer | null>(null);
  const audioQueueRef = useRef<Uint8Array[]>([]);

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket connection and event bindings
  useEffect(() => {
    const socket = io("http://localhost:3001", {
      transports: ["websocket"],
      reconnection: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => {
      setIsConnected(false);
      setIsDeepgramReady(false);
      setIsStreaming(false);
      stopStreamingAudio();
    });

    socket.on("deepgram-ready", () => setIsDeepgramReady(true));

    socket.on("user-transcript-interim", ({ text }) => setInterimTranscript(text));
    socket.on("user-transcript-final", ({ text }) => {
      setInterimTranscript("");
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, role: "user", content: text },
      ]);
    });

    socket.on("agent-transcript", ({ text }) => {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, role: "assistant", content: text },
      ]);
    });

    socket.on("ai-audio-begin", () => {
      startMediaSource();
      setIsAgentSpeaking(true);
    });
    socket.on("ai-audio-chunk", (chunk: ArrayBuffer) => {
      queueAudioChunk(new Uint8Array(chunk));
    });
    socket.on("ai-audio-end", () => {
      setIsAgentSpeaking(false);
      endMediaSource();
    });

    socket.on("interview-finished", () => {
      stopStreamingAudio();
      setIsStreaming(false);
    });

    return () => {
      stopStreamingAudio();
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  const startStreamingAudio = async () => {
    if (isStreaming) return;
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
        video: false,
      });
      mediaStreamRef.current = mediaStream;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 48000 });
      audioContextRef.current = audioContext;
      const sourceNode = audioContext.createMediaStreamSource(mediaStream);
      sourceNodeRef.current = sourceNode;

      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      processor.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        const down = downsampleBuffer(input, audioContext.sampleRate, 16000);
        const pcm = floatTo16BitPCM(down);
        if (socketRef.current && socketRef.current.connected) {
          socketRef.current.emit("audio-stream", pcm.buffer);
        }
      };

      sourceNode.connect(processor);
      processor.connect(audioContext.destination);

      socketRef.current?.emit("start-stream");
      setIsStreaming(true);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to start mic stream", err);
    }
  };

  const stopStreamingAudio = () => {
    try {
      processorRef.current?.disconnect();
      sourceNodeRef.current?.disconnect();
      audioContextRef.current?.close().catch(() => {});
    } catch {}
    processorRef.current = null;
    sourceNodeRef.current = null;
    audioContextRef.current = null;
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
  };

  const downsampleBuffer = (buffer: Float32Array, sampleRate: number, outSampleRate: number) => {
    if (outSampleRate === sampleRate) return buffer;
    const sampleRateRatio = sampleRate / outSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;
    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0;
      let count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = accum / count;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  };

  const floatTo16BitPCM = (input: Float32Array) => {
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    let offset = 0;
    for (let i = 0; i < input.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return new Int16Array(buffer);
  };

  // AI audio playback using MediaSource API
  const startMediaSource = () => {
    if (!audioElRef.current) return;
    const ms = new MediaSource();
    mediaSourceRef.current = ms;
    audioElRef.current.src = URL.createObjectURL(ms);
    ms.addEventListener("sourceopen", () => {
      try {
        sourceBufferRef.current = ms.addSourceBuffer("audio/mpeg");
      } catch {
        try {
          sourceBufferRef.current = ms.addSourceBuffer("audio/mp4; codecs=\"mp4a.40.2\"");
        } catch {}
      }
      sourceBufferRef.current?.addEventListener("updateend", flushAudioQueue);
      flushAudioQueue();
    });
  };

  const queueAudioChunk = (chunk: Uint8Array) => {
    audioQueueRef.current.push(chunk);
    flushAudioQueue();
  };

  const flushAudioQueue = () => {
    const sb = sourceBufferRef.current;
    if (!sb || sb.updating || audioQueueRef.current.length === 0) return;
    const chunk = audioQueueRef.current.shift()!;
    try {
      sb.appendBuffer(chunk);
      if (audioElRef.current && audioElRef.current.paused) {
        audioElRef.current.play().catch(() => {});
      }
    } catch {}
  };

  const endMediaSource = () => {
    try {
      sourceBufferRef.current?.removeEventListener("updateend", flushAudioQueue);
      if (mediaSourceRef.current && mediaSourceRef.current.readyState === "open") {
        mediaSourceRef.current.endOfStream();
      }
    } catch {}
    sourceBufferRef.current = null;
    mediaSourceRef.current = null;
    audioQueueRef.current = [];
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        role: "user",
        content: inputValue,
      };
      setMessages([...messages, newMessage]);
      setInputValue("");

      // Simulate a reply after a short delay
      setTimeout(() => {
        const replyMessage: Message = {
          id: messages.length + 2, // This might cause key collision if user sends messages fast. A better approach would be uuid.
          role: "assistant",
          content: "Thanks for the update!",
        };
        setMessages((prevMessages) => [...prevMessages, replyMessage]);
      }, 1500);
    }
  };

  const userAvatar = "https://placehold.co/40x40/16a34a/ffffff?text=Y";
  const assistantAvatar = "https://placehold.co/40x40/7c3aed/ffffff?text=A";

  return (
    <>
      <div className="min-h-screen w-full bg-zinc-950 flex items-center p-4">
        <div className="bg-zinc-900 w-full flex flex-col">
          <div>
            <h2 className="text-2xl px-4 py-2 pt-4">
              Senior IT Engineer - Live Interview
            </h2>
            <p className="text-l px-4 py-2">Al Interview session for Fun Ltd</p>

            <div className="grid grid-cols-3 gap-3 w-full py-2">
              <div className="w-auto h-[450] bg-zinc-800 rounded-lg">
                <div className="flex justify-center items-center h-full w-full">
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                    <div className="w-[110] h-[110] rounded-full bg-white" />
                    <audio ref={audioElRef} className="hidden" />
                    <div className="flex gap-2 text-sm">
                      <StatusPill label="Connected" active={isConnected} />
                      <StatusPill label="Deepgram" active={isDeepgramReady} />
                      <StatusPill label="Agent" active={isAgentSpeaking} />
                      <StatusPill label="Streaming" active={isStreaming} />
                    </div>
                    <div className="text-xs text-zinc-300 max-w-xs text-center px-4">
                      {interimTranscript && <div className="italic opacity-80">{interimTranscript}</div>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-auto h-[450] bg-zinc-800 rounded-lg">
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
              <div className="w-auto h-[450] bg-zinc-800 rounded-lg">
                <div className="w-full h-full bg-zinc-800 rounded-lg">
                  <div className="flex flex-col h-full bg-transparent font-sans">
                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto">
                      <div className="flex flex-col space-y-4">
                        {messages.map((msg) => (
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
                                  ? "bg-slate-200 !text-zinc-900 rounded-br-none z-10"
                                  : "bg-zinc-700 text-white rounded-bl-none" // AI message style
                              }`}
                            >
                              <p className="text-sm">{msg.content}</p>
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full h-[100] justify-center items-center">
            <div className="flex gap-3">
              <TooltipProvider>
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="default"
                        onClick={() => startStreamingAudio()}
                        aria-label="Start interview"
                        className="rounded-3xl bg-emerald-500 hover:bg-emerald-600"
                        disabled={!isConnected || isStreaming}
                      >
                        <PhoneIcon className="h-5 w-5 mr-2" />
                        Start
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Start Interview</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
              <TooltipProvider>
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="destructive"
                        onClick={() => { stopStreamingAudio(); setIsStreaming(false); }}
                        aria-label="End interview"
                        className="rounded-3xl bg-red-500"
                        disabled={!isStreaming}
                      >
                        <PhoneIcon className="h-5 w-5 mr-2" />
                        End
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
