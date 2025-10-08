"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Send, Copy, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
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
  "What keywords am I missing?",
  "Suggest bullet points for my project",
];

const mockConversations: Conversation[] = [
  {
    id: "1",
    title: "Resume Review Session",
    lastMessage: "Your technical skills section needs improvement...",
    timestamp: new Date(Date.now() - 86400000),
  },
  {
    id: "2",
    title: "Career Transition Advice",
    lastMessage: "Consider highlighting transferable skills...",
    timestamp: new Date(Date.now() - 172800000),
  },
  {
    id: "3",
    title: "Interview Preparation",
    lastMessage: "Practice these behavioral questions...",
    timestamp: new Date(Date.now() - 259200000),
  },
];

export default function ResumeChatbot() {
  const [messages, setMessages] = useState<Message[]>([{
    id: "1",
    type: "user",
    content: "Can you analyze my resume and give feedback?",
    timestamp: new Date("2025-09-08T10:15:00"),
  },
  {
    id: "2",
    type: "bot",
    content: "Sure! Please upload your resume, and I’ll analyze it for skills, experience, and improvements.",
    timestamp: new Date("2025-09-08T10:15:05"),
  },]);
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash"); // default value
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { id: resumeId } = useParams<{ id: string }>();
  const [resumeName, setResumeName] = useState<string>("");
  const [atsScore, setAtsScore] = useState<number>(0);
  const [isDetailsLoading, setIsDetailsLoading] = useState<boolean>(false);

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

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;
    if (!resumeId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setCurrentStatusIndex(0);

    try {
      const res = await fetch(`http://localhost:8000/chat/${resumeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: textToSend, model : selectedModel }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Chat service error");
      }
      const data = await res.json();
      const answer: string =
        data?.answer ?? "I'm sorry, I couldn't generate a response.";

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: answer,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string) => {
    toast.success("Text copyed to clickboard");
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="sticky top-0 z-10 bg-black">
        <div className="flex items-center justify-between p-4">
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-neutral-900"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-80 bg-black border-neutral-800"
            >
              <SheetHeader>
                <SheetTitle className="text-lg font-semibold text-white">
                  Past Conversations
                </SheetTitle>
              </SheetHeader>
              <div className="py-6">
                <div className="space-y-3">
                  {mockConversations.map((conversation) => (
                    <motion.div
                      key={conversation.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 cursor-pointer transition-colors"
                    >
                      <h3 className="font-medium text-white text-sm mb-1">
                        {conversation.title}
                      </h3>
                      <p className="text-neutral-400 text-xs truncate">
                        {conversation.lastMessage}
                      </p>
                      <p className="text-neutral-500 text-xs mt-1">
                        {conversation.timestamp.toLocaleDateString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex flex-col items-center">
            <h1 className="text-lg font-bold tracking-tight text-white">
              Pravya AI
            </h1>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-neutral-400 to-transparent mt-1 shadow-sm shadow-neutral-400/20" />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-neutral-900"
            onClick={() => (window.location.href = "/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="px-4 pb-3">
          <div className="flex items-center justify-between text-xs text-neutral-400 bg-neutral-950 rounded-lg px-3 py-2">
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
                    background: `conic-gradient(from 0deg, #10b981 ${atsScore * 3.6}deg, #374151 ${atsScore * 3.6}deg)`,
                  }}
                />
                <div className="absolute inset-0.5 bg-neutral-950 rounded-full flex items-center justify-center">
                  <span className="text-[10px] font-medium text-white">
                    {atsScore}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6"
            >
              <div className="text-center space-y-8 max-w-2xl w-full">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <h2 className="text-3xl font-bold tracking-tight text-white">
                    Pravya AI
                  </h2>
                  <div className="w-20 h-px bg-gradient-to-r from-transparent via-neutral-400 to-transparent mx-auto shadow-sm shadow-neutral-400/20" />
                  <p className="text-neutral-400 text-lg">
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
                      className="h-16 bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-600 rounded-2xl px-6 text-base shadow-lg flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={() => handleSend()}
                      disabled={!input.trim() || isLoading}
                      className="h-16 px-6 bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 rounded-2xl shadow-lg font-medium"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-center space-x-6 text-xs text-neutral-500">
                    <span>↵ Send</span>
                    <span>⇧+↵ New line</span>
                    <span>/ Commands</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-3"
                >
                  <p className="text-neutral-500 text-sm">Try asking:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {smartPrompts.map((prompt, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSend(prompt)}
                        className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-sm rounded-full border border-neutral-700 transition-colors"
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
                      "rounded-2xl p-3 max-w-[80%] shadow-lg",
                      message.type === "user"
                        ? "bg-[#ECECEC] text-white text-xl"
                        : "bg-neutral-900 text-white relative"
                    )}
                  >
                    {message.type === "bot" ? (
                      <div className="relative pt-6">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => (
                              <h1 className="text-lg font-semibold mb-2">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-lg font-semibold mb-2">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-base font-semibold mb-2">
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
                                  <code className="block bg-neutral-950 border border-neutral-800 font-mono p-3 rounded-xl text-sm overflow-x-auto">
                                    {children}
                                  </code>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 h-6 w-6 text-neutral-400 hover:text-white hover:bg-neutral-800"
                                    onClick={() =>
                                      copyToClipboard(children as string)
                                    }
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <code className="bg-neutral-950 border border-neutral-800 font-mono px-2 py-1 rounded text-sm">
                                  {children}
                                </code>
                              );
                            },
                            strong: ({ children }) => (
                              <strong className="font-semibold text-white">
                                {children}
                              </strong>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-0 right-0 h-6 w-6 text-neutral-400 hover:text-white hover:bg-neutral-800"
                          onClick={() => copyToClipboard(message.content)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <p className=" text-black text-base">{message.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex justify-start"
                  aria-live="polite"
                >
                  <div className="bg-neutral-900 text-white rounded-2xl p-4 max-w-[80%] shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 bg-gradient-to-r from-white to-neutral-400 rounded-full"
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
                        className="text-sm bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent"
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
        <footer className="sticky bottom-0 bg-black border-t border-neutral-800 p-4">
          <div className="space-y-3">
            <div className="flex space-x-3 max-w-5xl mx-auto">
              {/* Select LLM model */}
              <Select onValueChange={(value) => setSelectedModel(value)} value={selectedModel}>
                <SelectTrigger className="h-14 md:h-16 bg-neutral-900 border-neutral-700 text-white rounded-2xl px-4 text-base shadow-lg w-[180px]">
                  <SelectValue placeholder="Model" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-neutral-700 text-white">
                  <SelectItem value="gemini-2.5-flash">gemini-2.5-flash</SelectItem>
                  <SelectItem value="gpt-oss-20b">gpt-oss-20b</SelectItem>
                  <SelectItem value="gpt-oss-120b">gpt-oss-120b</SelectItem>
                  <SelectItem value="mistral-nemo">mistral-nemo</SelectItem>
                  <SelectItem value="deepseek-r1-0528">deepseek-r1-0528</SelectItem>
                  <SelectItem value="deepseek-r1t">deepseek-r1t</SelectItem>
                </SelectContent>
              </Select>

              {/* Input field */}
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your resume..."
                className="h-14 md:h-16 bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-600 rounded-2xl px-4 text-base shadow-lg flex-1"
                disabled={isLoading}
              />

              {/* Send button */}
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="h-14 md:h-16 px-6 bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 rounded-2xl shadow-lg font-medium"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-6 text-xs text-neutral-500">
              <span>↵ Send</span>
              <span>⇧+↵ New line</span>
              <span>/ Commands</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
