"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

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
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z"/><path d="m22 2-11 11"/>
  </svg>
);

const Paperclip: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
  </svg>
);

const page = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'assistant', content: 'Hey, how is the project going?' },
    { id: 2, role: 'user', content: 'Hey Jane! It\'s going great. We are on track to meet the deadline.' },
    { id: 3, role: 'assistant', content: 'That\'s awesome news! Let me know if you need any help with the UI/UX part.' },
    { id: 4, role: 'user', content: 'Will do! I might need your feedback on the new dashboard design later this week.' },
    { id: 5, role: 'assistant', content: 'Sure, happy to help. Just send it over whenever you are ready.' },
    { id: 6, role: 'user', content: 'Sure, happy to help. Just send it over whenever you are ready.' },
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        role: 'user',
        content: inputValue,
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
      
      // Simulate a reply after a short delay
      setTimeout(() => {
        const replyMessage: Message = {
          id: messages.length + 2, // This might cause key collision if user sends messages fast. A better approach would be uuid.
          role: 'assistant',
          content: 'Thanks for the update!',
        };
        setMessages(prevMessages => [...prevMessages, replyMessage]);
      }, 1500);
    }
  };

  const userAvatar = "https://placehold.co/40x40/16a34a/ffffff?text=Y";
  const assistantAvatar = "https://placehold.co/40x40/7c3aed/ffffff?text=A";

  return (
    <>
      <div className="min-h-screen w-full bg-zinc-950 flex items-center p-4">
        <div className="bg-zinc-900 w-full flex flex-col">
          <h2 className="text-2xl px-4 py-2 pt-4">
            Senior IT Engineer - Live Interview
          </h2>
          <p className="text-l px-4 py-2">Al Interview session for Fun Ltd</p>

          <div className="grid grid-cols-3 gap-3 w-full py-2">
            <div className="w-auto h-[450] bg-zinc-800 rounded-lg">
              <div className="flex justify-center items-center h-full w-full">
                <div className="w-[110] h-[110] rounded-full bg-white"></div>
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
      </div>
    </>
  );
};

export default page;
