"use client";

import { useState, useRef, useEffect } from "react";
import { sendAIMessage } from "@/lib/api";
import ChatMessageBubble from "@/components/ai-analyzer/ChatMessage";
import ChatInput from "@/components/ai-analyzer/ChatInput";

interface LocalMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const WELCOME_MESSAGE: LocalMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "👋 Hello! I'm your AI database assistant. I can help you:\n\n• **Query your data** — just describe what you need\n• **Understand table schemas** and relationships\n• **Analyze trends** and generate insights\n• **Write SQL queries** for complex operations\n\nWhat would you like to explore today?",
  timestamp: new Date().toISOString(),
};

const SUGGESTED_PROMPTS = [
  "Show me the top 10 customers by total spend",
  "What is the average order value this month?",
  "Describe the orders table schema",
  "Generate SQL to find products low on stock",
];

export default function AIAnalyzerPage() {
  const [messages, setMessages] = useState<LocalMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    setError(null);

    const userMsg: LocalMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const response = await sendAIMessage(text, history);

      const assistantMsg: LocalMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setError("Failed to get a response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 64px)",
        maxWidth: "860px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* Page Header */}
      <div
        style={{
          padding: "20px 24px 16px",
          borderBottom: "1px solid #E6EAED",
          backgroundColor: "#F8F8F8",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            backgroundColor: "#2772CE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="white"
            style={{ width: 18, height: 18 }}
          >
            <path
              fillRule="evenodd"
              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          <h1 style={{ fontSize: "16px", fontWeight: 700, color: "#1F2324" }}>
            AI Analyzer
          </h1>
          <p style={{ fontSize: "12px", color: "#5A5E63" }}>
            Ask questions about your database in plain English
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollAreaRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 24px 8px",
          backgroundColor: "#F8F8F8",
        }}
      >
        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#2772CE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="white"
                style={{ width: 16, height: 16 }}
              >
                <path
                  fillRule="evenodd"
                  d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div
              style={{
                padding: "12px 16px",
                backgroundColor: "#ffffff",
                border: "1px solid #E6EAED",
                borderRadius: "4px 18px 18px 18px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "4px",
                  alignItems: "center",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "#2772CE",
                      animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
              <style>{`
                @keyframes bounce {
                  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
                  40% { transform: translateY(-5px); opacity: 1; }
                }
              `}</style>
              <span style={{ fontSize: "13px", color: "#5A5E63" }}>Analyzing…</span>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && !isLoading && (
          <div
            style={{
              padding: "10px 14px",
              backgroundColor: "#FFF5F5",
              border: "1px solid #FECACA",
              borderRadius: "8px",
              marginBottom: "12px",
              fontSize: "13px",
              color: "#991B1B",
            }}
          >
            {error}
          </div>
        )}

        {/* Suggested prompts (shown only when only the welcome message is present) */}
        {messages.length === 1 && !isLoading && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginTop: "8px",
            }}
          >
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                style={{
                  padding: "8px 14px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #E6EAED",
                  borderRadius: "99px",
                  fontSize: "13px",
                  color: "#5A5E63",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#EFF4FC";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#2772CE";
                  (e.currentTarget as HTMLButtonElement).style.color = "#2772CE";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ffffff";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#E6EAED";
                  (e.currentTarget as HTMLButtonElement).style.color = "#5A5E63";
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
}
