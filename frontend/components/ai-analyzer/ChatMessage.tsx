import { memo } from "react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export const ChatMessage = memo(function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"} mb-6`}>
      <div
        className={`flex max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-4 ${
          isUser
            ? "bg-bg-active text-white rounded-tr-sm shadow-md"
            : "bg-white border border-border text-text-primary shadow-sm rounded-tl-sm ring-1 ring-border/50"
        }`}
      >
        {/* Simple markdown-like rendering handling line breaks */}
        <p className="text-[15px] whitespace-pre-wrap leading-relaxed tracking-wide">
          {content}
        </p>
      </div>
    </div>
  );
});
