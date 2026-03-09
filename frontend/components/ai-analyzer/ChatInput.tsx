"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        padding: "16px 20px",
        borderTop: "1px solid #E6EAED",
        backgroundColor: "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "10px",
          padding: "8px 12px 8px 16px",
          border: `1.5px solid ${focused ? "#2772CE" : "#E6EAED"}`,
          borderRadius: "14px",
          backgroundColor: "#F8F8F8",
          transition: "border-color 0.15s ease",
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Ask anything about your database… (Enter to send, Shift+Enter for new line)"
          disabled={isLoading}
          rows={1}
          style={{
            flex: 1,
            resize: "none",
            border: "none",
            background: "transparent",
            outline: "none",
            fontSize: "14px",
            color: "#1F2324",
            lineHeight: 1.6,
            fontFamily: "inherit",
            padding: "4px 0",
            maxHeight: "160px",
            overflowY: "auto",
          }}
        />

        <button
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            border: "none",
            backgroundColor:
              !value.trim() || isLoading ? "#E6EAED" : "#2772CE",
            color: !value.trim() || isLoading ? "#9EA6AD" : "#ffffff",
            cursor: !value.trim() || isLoading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background-color 0.15s ease",
          }}
          aria-label="Send message"
        >
          {isLoading ? (
            <LoadingSpinner size={16} color="#9EA6AD" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              style={{ width: 16, height: 16 }}
            >
              <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
            </svg>
          )}
        </button>
      </div>

      <p style={{ fontSize: "11px", color: "#9EA6AD", textAlign: "center", marginTop: "8px" }}>
        AI Analyzer may produce inaccurate information about your data.
      </p>
    </div>
  );
}
