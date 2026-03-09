"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // 1. Add user message
    const userMessage: Message = { role: "user", content: content.trim() };
    setMessages((prev) => [...prev, userMessage]);
    
    // 2. Set loading state
    setIsLoading(true);

    try {
      // 3. Fake Request (Replace this entire block with a real `fetch` call eventually)
      // Example implementation to look forward to:
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhaG1lZEBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3NzMwNjkwOTh9.-TjbZPwozgchYywtBuJ8oKYfj4fPG6iKPf_Tuj6sscE`,
      }
      const response = await fetch("http://localhost:8000/api/conversations/", { 
         method: 'POST', 
         headers: headers,
         body: JSON.stringify({ prompt: content }) 
      });
      const data = await response.json();
      
      // // Delay simulating network request processing time
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const assistantMessage: Message = {
        role: "assistant",
        content: JSON.stringify(data, null, 2),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message to AI server:", error);
      setMessages((prev) => [
        ...prev, 
        { role: "assistant", content: "Sorry, I encountered an error connecting to the analyzer service." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full relative">
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 md:py-12 scroll-smooth">
        <div className="max-w-3xl mx-auto w-full">
          
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-white border border-border shadow-md rounded-2xl flex items-center justify-center mb-8 rotate-3 hover:rotate-0 transition-transform cursor-pointer">
                <svg className="w-8 h-8 text-text-active" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-text-primary tracking-tight">
                How can I help analyze your data today?
              </h2>
              <p className="text-text-secondary text-base md:text-lg max-w-lg mb-8 leading-relaxed">
                Enter your query below to interact with your database, ask for metrics, or uncover complex relationships with AI.
              </p>
            </div>
          ) : (
            <div className="space-y-2 pb-4">
              {messages.map((msg, index) => (
                <ChatMessage key={index} role={msg.role} content={msg.content} />
              ))}
            </div>
          )}
          
          {isLoading && (
            <div className="w-full flex justify-start mb-6 animate-pulse">
              <div className="max-w-[80%] rounded-2xl px-6 py-5 bg-white border border-border text-text-primary shadow-sm rounded-tl-sm flex items-center gap-2">
                <div className="flex space-x-1.5 items-center justify-center">
                  <div className="h-2 w-2 bg-text-secondary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-text-secondary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-2 w-2 bg-text-secondary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      <div className="bg-linear-to-t from-bg-light via-bg-light to-transparent pt-12 mt-auto">
        <ChatInput 
          onSend={handleSendMessage} 
          isLoading={isLoading} 
          showSuggestions={messages.length === 0}
        />
      </div>
    </div>
  );
}
