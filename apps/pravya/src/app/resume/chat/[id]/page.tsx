"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Send, Copy, Clock, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  latency?: number;
  isStreaming?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

const statusMessages = [
  "Processing request…",
  "Gathering data…",
  "Analyzing input…",
  "Running checks…",
  "Applying logic…",
  "Generating output…",
  "Optimizing results…",
  "Reviewing details…",
  "Formatting content…",
  "Ensuring accuracy…",
  "Finalizing response…",
  "Completing process…",
  "Almost there!",
];

const smartPrompts = [
  "How can I tailor my resume for Meta?",
  // "Which lines feel like filler and should be removed?",
  "Compare my resume against a top 1% candidate",
  "Does my resume feel authentic or over-engineered?",
];

export default function ResumeChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState("llama-3.1-8b-instant");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isStreamingActive, setIsStreamingActive] = useState(false);
  const [streamingContent, setStreamingContent] = useState<{
    [key: string]: string;
  }>({});
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { id: resumeId } = useParams<{ id: string }>();
  const [resumeName, setResumeName] = useState<string>("");
  const [atsScore, setAtsScore] = useState<number>(0);
  const [isDetailsLoading, setIsDetailsLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { theme, setTheme } = useTheme();

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setCurrentStatusIndex((prev) => (prev + 1) % statusMessages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    const fetchResumeDetails = async () => {
      if (!resumeId) return;
      try {
        setIsDetailsLoading(true);
        const res = await fetch("/api/resume/get-resume-detail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeId }),
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch resume details");
        }
        const data = await res.json();
        const fileName: string | undefined = data?.resumeDetails?.fileName;
        const score: number | undefined =
          data?.resumeDetails?.ResumeAnalysis?.atsScore;
        if (fileName) {
          const withoutExt = fileName.replace(/\.[^/.]+$/, "");
          setResumeName(withoutExt);
        }
        if (typeof score === "number") {
          setAtsScore(score);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsDetailsLoading(false);
      }
    };
    fetchResumeDetails();
  }, [resumeId]);

  const streamText = async (
    messageId: string,
    fullText: string,
    onComplete: () => void,
    signal: AbortSignal
  ) => {
    let displayedText = "";
    const delay = 1;

    for (let i = 0; i < fullText.length; i++) {
      console.log("signal.aborted", signal.aborted);
      if (signal.aborted) {
        console.log("UI stream stopped");
        return;
      }

      displayedText += fullText[i];
      setStreamingContent((prev) => ({
        ...prev,
        [messageId]: displayedText,
      }));
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    onComplete();
  };

  const stopResponse = () => {
    setIsProcessing(false);
    setIsStreamingActive(false);
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  };

  const handleSendPrompt = (prompt: string) => {
    if (isProcessing) return;

    setInput(prompt);
    handleSend(prompt);
  };

  const handleSend = async (overrideText?: string) => {
    const textToSend =
      typeof overrideText === "string" ? overrideText.trim() : input.trim();

    if (!textToSend || isProcessing) return;
    // const textToSend = messageText || input.trim();
    // if (!textToSend || isLoading) return;
    if (!resumeId) return;

    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsProcessing(true);
    setIsStreamingActive(false);

    setCurrentStatusIndex(0);

    const startTime = Date.now();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WORKER_URL}/api/v1/resume/chat/${resumeId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: textToSend, model: selectedModel }),
          signal: controller.signal,
        }
      );
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Chat service error");
      }
      const data = await res.json();
      const answer: string =
        data?.answer ?? "I'm sorry, I couldn't generate a response.";

      const latency = Date.now() - startTime;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: answer,
        timestamp: new Date(),
        latency,
        isStreaming: true,
      };

      setMessages((prev) => [...prev, botMessage]);

      setIsProcessing(false);
      setIsStreamingActive(true);
      await streamText(
        botMessage.id,
        answer,
        () => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessage.id ? { ...msg, isStreaming: false } : msg
            )
          );

          setStreamingContent((prev) => {
            const newContent = { ...prev };
            delete newContent[botMessage.id];
            return newContent;
          });

          setIsStreamingActive(false);
        },
        controller.signal // 🔴 SAME AbortSignal
      );
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Request aborted by user");
        return; // swallow it
      }
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string) => {
    toast.success("Copied to clipboard");
    navigator.clipboard.writeText(text);
  };

  const formatLatency = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-950 dark:text-white transition-colors duration-300"
      )}
    >
      {/* Header */}
      <header
        className={cn(
          "flex-shrink-0 border-b transition-colors duration-300",
          "border-neutral-200 dark:border-neutral-800"
        )}
      >
        <div className="relative flex items-center p-4">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "transition-colors",
              "text-neutral-950 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-900"
            )}
            onClick={() => (window.location.href = "/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
            <h1 className="text-lg font-bold tracking-tight">Pravya AI</h1>
            <div
              className={cn(
                "w-16 h-px bg-gradient-to-r from-transparent via-neutral-400 to-transparent mt-1 shadow-sm",
                "shadow-neutral-400/20 dark:shadow-neutral-400/20"
              )}
            />
          </div>
        </div>

        <div className="px-4 pb-3">
          <div
            className={cn(
              "flex items-center justify-between text-xs rounded-lg px-3 py-2 transition-colors",
              "text-neutral-600 bg-neutral-50 border border-neutral-200 dark:text-neutral-400 dark:bg-neutral-900 dark:border-neutral-800"
            )}
          >
            <span>
              Resume:{" "}
              {resumeName
                ? `${resumeName}.pdf`
                : isDetailsLoading
                ? "Loading…"
                : "Unknown"}
            </span>
            <div className="flex items-center space-x-2">
              <span>ATS Score:</span>
              <div className="relative w-6 h-6">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(from 0deg, #10b981 ${
                      atsScore * 3.6
                    }deg, ${theme === "dark" ? "#374151" : "#e5e7eb"} ${
                      atsScore * 3.6
                    }deg)`,
                  }}
                />
                <div
                  className={cn(
                    "absolute inset-0.5 rounded-full flex items-center justify-center",
                    "bg-white dark:bg-neutral-900"
                  )}
                >
                  <span
                    className={cn(
                      "text-[10px] font-medium",
                      "text-neutral-950 dark:text-white"
                    )}
                  >
                    {atsScore}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-full px-6"
            >
              <div className="text-center space-y-8 max-w-2xl w-full">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <h2 className="text-3xl font-bold tracking-tight">
                    Pravya AI
                  </h2>
                  <div
                    className={cn(
                      "w-20 h-px bg-gradient-to-r from-transparent via-neutral-400 to-transparent mx-auto shadow-sm",
                      "shadow-neutral-400/20 dark:shadow-neutral-400/20"
                    )}
                  />
                  <p
                    className={cn(
                      "text-lg",
                      "text-neutral-600 dark:text-neutral-400"
                    )}
                  >
                    Ask anything about your resume.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  <div className="flex space-x-3 max-w-3xl mx-auto">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about your resume..."
                      className={cn(
                        "h-16 rounded-2xl px-6 text-base shadow-lg flex-1 transition-colors",
                        "bg-neutral-100 border-neutral-300 text-neutral-950 placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-400",
                        "dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder:text-neutral-400 dark:focus:ring-neutral-600"
                      )}
                      disabled={isLoading}
                    />
                    <Button
                      onClick={isLoading ? stopResponse : handleSend}
                      className={cn(
                        "h-16 px-6 rounded-2xl shadow-lg font-medium transition-colors",
                        isLoading
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-neutral-950 text-white hover:bg-neutral-800",
                        "disabled:bg-neutral-200 disabled:text-neutral-400",
                        "dark:bg-white dark:text-black dark:hover:bg-neutral-200 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500"
                      )}
                    >
                      {isLoading ? (
                        <Square className="h-5 w-5" /> // STOP icon
                      ) : (
                        <Send className="h-5 w-5" /> // SEND icon
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-center space-x-3 text-xs">
                    <span className="text-neutral-600 dark:text-neutral-500">
                      <Kbd>↵</Kbd> Send
                    </span>
                    <span className="text-neutral-600 dark:text-neutral-500">
                      <Kbd>⇧</Kbd> + <Kbd>↵</Kbd> New line
                    </span>
                    <span className="text-neutral-600 dark:text-neutral-500">
                      <Kbd>/</Kbd> Commands
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-3"
                >
                  <p
                    className={cn(
                      "text-sm",
                      "text-neutral-600 dark:text-neutral-500"
                    )}
                  >
                    Try asking:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {smartPrompts.map((prompt, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSendPrompt(prompt)}
                        className={cn(
                          "px-4 py-2 text-sm rounded-full border transition-colors",
                          "bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-300",
                          "dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700"
                        )}
                        disabled={isLoading}
                      >
                        {prompt}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {messages.length > 0 && (
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex",
                    message.type === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl p-3 max-w-[80%] shadow-lg transition-colors",
                      message.type === "user"
                        ? "bg-neutral-950 text-white dark:bg-neutral-200 dark:text-neutral-950"
                        : "bg-neutral-100 text-neutral-950 border border-neutral-300 dark:bg-neutral-900 dark:text-white dark:border-neutral-700"
                    )}
                  >
                    {message.type === "bot" ? (
                      <div className="relative pt-6">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => (
                              <h1
                                className={cn(
                                  "text-lg font-semibold mb-2",
                                  "text-neutral-950 dark:text-white"
                                )}
                              >
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2
                                className={cn(
                                  "text-lg font-semibold mb-2",
                                  "text-neutral-950 dark:text-white"
                                )}
                              >
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3
                                className={cn(
                                  "text-base font-semibold mb-2",
                                  "text-neutral-950 dark:text-white"
                                )}
                              >
                                {children}
                              </h3>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc pl-5 space-y-1">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal pl-5 space-y-1">
                                {children}
                              </ol>
                            ),
                            code: ({ children, className }) => {
                              const isBlock = className?.includes("language-");
                              return isBlock ? (
                                <div className="relative">
                                  <code
                                    className={cn(
                                      "block font-mono p-3 rounded-xl text-sm overflow-x-auto border",
                                      "bg-neutral-50 border-neutral-300 dark:bg-neutral-950 dark:border-neutral-800"
                                    )}
                                  >
                                    {children}
                                  </code>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn(
                                      "absolute top-2 right-2 h-6 w-6 transition-colors",
                                      "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200",
                                      "dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800"
                                    )}
                                    onClick={() =>
                                      copyToClipboard(children as string)
                                    }
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <code
                                  className={cn(
                                    "font-mono px-2 py-1 rounded text-sm border",
                                    "bg-neutral-50 border-neutral-300 dark:bg-neutral-950 dark:border-neutral-800"
                                  )}
                                >
                                  {children}
                                </code>
                              );
                            },
                            strong: ({ children }) => (
                              <strong className="font-semibold">
                                {children}
                              </strong>
                            ),
                          }}
                        >
                          {streamingContent[message.id] ?? message.content}
                        </ReactMarkdown>

                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-300 dark:border-neutral-700">
                          <span
                            className={cn(
                              "text-xs",
                              "text-neutral-600 dark:text-neutral-500"
                            )}
                          >
                            {message.latency && (
                              <>
                                <div className="flex justify-center items-center gap-1">
                                  <Clock className="h-5 text-white/50" />
                                  <h4 className="text-white/70">
                                    {formatLatency(message.latency)}
                                  </h4>
                                </div>
                              </>
                            )}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-6 w-6 transition-colors",
                              "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200",
                              "dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800"
                            )}
                            onClick={() => copyToClipboard(message.content)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-base">{message.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              {isProcessing && !isStreamingActive && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex justify-start"
                  aria-live="polite"
                >
                  <div
                    className={cn(
                      "rounded-2xl p-4 max-w-[80%] shadow-lg transition-colors",
                      "bg-neutral-100 text-neutral-950 dark:bg-neutral-900 dark:text-white"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              "bg-gradient-to-r from-neutral-950 to-neutral-600 dark:from-white dark:to-neutral-400"
                            )}
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>
                      <motion.p
                        key={currentStatusIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={cn(
                          "text-sm bg-clip-text text-transparent",
                          "bg-gradient-to-r from-neutral-950 to-neutral-600 dark:from-white dark:to-neutral-400"
                        )}
                      >
                        {statusMessages[currentStatusIndex]}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </main>

      {messages.length > 0 && (
        <footer
          className={cn(
            "flex-shrink-0 border-t transition-colors duration-300",
            "border-neutral-200 dark:border-neutral-800"
          )}
        >
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex space-x-3 max-w-5xl mx-auto">
                <Select
                  onValueChange={(value) => setSelectedModel(value)}
                  value={selectedModel}
                >
                  <SelectTrigger
                    className={cn(
                      "h-14 md:h-16 rounded-2xl px-4 text-base shadow-lg w-[180px] transition-colors",
                      "bg-neutral-100 border-neutral-300 text-neutral-950",
                      "dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
                    )}
                  >
                    <SelectValue placeholder="Model" />
                  </SelectTrigger>
                  <SelectContent
                    className={cn(
                      "transition-colors",
                      "bg-white border-neutral-300 text-neutral-950",
                      "dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
                    )}
                  >
                    <SelectItem value="llama-3.1-8b-instant">
                      llama-3.1-8B
                    </SelectItem>
                    <SelectItem value="llama-3.3-70b-versatile">
                      llama-3.3-70B
                    </SelectItem>
                    <SelectItem value="gpt-oss-20b">
                      GPT-OSS-20B
                    </SelectItem>
                    <SelectItem value="groq/compound-mini">
                      GROQ: Compound-Mini
                    </SelectItem>
                    <SelectItem value="gemini-2.5-flash">
                      Gemini-2.5-flash
                    </SelectItem>
                    <SelectItem value="gemini-2.5-flash-lite">
                      Gemini-2.5-flash-lite
                    </SelectItem>
                    <SelectItem value="mistralai/mistral-small-3.1-24b-instruct">
                      Mistral Small 3.1
                    </SelectItem>
                    <SelectItem value="deepseek-r1t">Deepseek-R1T</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your resume..."
                  className={cn(
                    "h-14 md:h-16 rounded-2xl px-4 text-base shadow-lg flex-1 transition-colors",
                    "bg-neutral-100 border-neutral-300 text-neutral-950 placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-400",
                    "dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder:text-neutral-400 dark:focus:ring-neutral-600"
                  )}
                  disabled={isLoading}
                />

                <Button
                  onClick={isLoading ? stopResponse : handleSend}
                  className={cn(
                    "h-16 px-6 rounded-2xl shadow-lg font-medium transition-colors",
                    isLoading
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-neutral-950 text-white hover:bg-neutral-800",
                    "disabled:bg-neutral-200 disabled:text-neutral-400",
                    "dark:bg-white dark:text-black dark:hover:bg-neutral-200 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500"
                  )}
                >
                  {isLoading ? (
                    <Square className="h-5 w-5" /> // STOP icon
                  ) : (
                    <Send className="h-5 w-5" /> // SEND icon
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-3 text-xs">
                <span className="text-neutral-600 dark:text-neutral-500">
                  <Kbd>↵</Kbd> Send
                </span>
                <span className="text-neutral-600 dark:text-neutral-500">
                  <Kbd>⇧</Kbd> + <Kbd>↵</Kbd> New line
                </span>
                <span className="text-neutral-600 dark:text-neutral-500">
                  <Kbd>/</Kbd> Commands
                </span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
