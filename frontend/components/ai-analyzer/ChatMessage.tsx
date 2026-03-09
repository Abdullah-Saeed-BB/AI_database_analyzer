import { ChatMessage } from "@/lib/api";

interface ChatMessageProps {
  message: ChatMessage;
}

export default function ChatMessageBubble({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "16px",
        gap: "10px",
        alignItems: "flex-end",
      }}
    >
      {/* Assistant Avatar */}
      {!isUser && (
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
      )}

      {/* Bubble */}
      <div
        style={{
          maxWidth: "72%",
          padding: "12px 16px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
          backgroundColor: isUser ? "#2772CE" : "#ffffff",
          border: isUser ? "none" : "1px solid #E6EAED",
          color: isUser ? "#ffffff" : "#1F2324",
          fontSize: "14px",
          lineHeight: 1.65,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {/* Render code blocks simply */}
        {message.content.split(/(```[\s\S]*?```)/g).map((part, i) => {
          if (part.startsWith("```") && part.endsWith("```")) {
            const code = part.slice(3, -3).replace(/^[a-z]+\n/, "");
            return (
              <pre
                key={i}
                style={{
                  backgroundColor: isUser ? "rgba(255,255,255,0.15)" : "#F8F8F8",
                  borderRadius: "6px",
                  padding: "10px 12px",
                  fontSize: "12px",
                  fontFamily: "monospace",
                  overflowX: "auto",
                  margin: "8px 0",
                  whiteSpace: "pre",
                }}
              >
                {code.trim()}
              </pre>
            );
          }
          return (
            <span key={i} style={{ whiteSpace: "pre-wrap" }}>
              {part
                .split(/(\*\*[^*]+\*\*)/g)
                .map((chunk, j) =>
                  chunk.startsWith("**") && chunk.endsWith("**") ? (
                    <strong key={j}>{chunk.slice(2, -2)}</strong>
                  ) : (
                    chunk
                  )
                )}
            </span>
          );
        })}

        {/* Timestamp */}
        <div
          style={{
            marginTop: "6px",
            fontSize: "11px",
            opacity: 0.6,
            textAlign: isUser ? "right" : "left",
          }}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: "#E6EAED",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="#5A5E63"
            style={{ width: 16, height: 16 }}
          >
            <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
          </svg>
        </div>
      )}
    </div>
  );
}
