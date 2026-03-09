"use client";

import { useState, useRef, useEffect } from "react";

const SUGGESTIONS = [
  "What is the highest-demand product in this month?",
  "Write the products with less than 10 in the stock",
];

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  showSuggestions?: boolean;
}

export function ChatInput({ onSend, isLoading, showSuggestions = false }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-6">
      {showSuggestions && (
        <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
          {SUGGESTIONS.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSend(suggestion)}
              disabled={isLoading}
              className="text-xs sm:text-sm text-text-secondary bg-white border border-border px-4 py-2 rounded-full hover:bg-bg-subtle hover:text-text-primary transition-colors disabled:opacity-50 shadow-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      <div className="relative flex items-end w-full bg-white/80 backdrop-blur-md border border-border rounded-2xl shadow-sm focus-within:shadow-md focus-within:border-text-active transition-all duration-300">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask the AI analyzer..."
          className="w-full max-h-[200px] py-4 pl-5 pr-14 bg-transparent border-none resize-none focus:outline-none focus:ring-0 text-text-primary text-sm sm:text-base leading-relaxed"
          rows={1}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="absolute right-2 bottom-2 p-2.5 text-white bg-bg-active rounded-xl hover:bg-opacity-90 disabled:bg-bg-subtle disabled:text-text-secondary transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="text-center mt-3 text-xs text-text-secondary">
        AI Analyzer can make mistakes. Verify important data.
      </div>
    </div>
  );
}
