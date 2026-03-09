interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorMessageProps) {
  return (
    <div
      style={{
        backgroundColor: "#FFF5F5",
        border: "1px solid #FECACA",
        borderRadius: "12px",
        padding: "20px 24px",
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        maxWidth: "600px",
      }}
    >
      {/* Icon */}
      <div style={{ color: "#DC2626", flexShrink: 0, paddingTop: "2px" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          style={{ width: "20px", height: "20px" }}
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {/* Text */}
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 600, color: "#991B1B", fontSize: "14px" }}>{title}</p>
        <p style={{ color: "#7F1D1D", fontSize: "13px", marginTop: "4px" }}>{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              marginTop: "10px",
              fontSize: "13px",
              fontWeight: 500,
              color: "#DC2626",
              background: "none",
              border: "1px solid #FECACA",
              borderRadius: "6px",
              padding: "5px 12px",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
