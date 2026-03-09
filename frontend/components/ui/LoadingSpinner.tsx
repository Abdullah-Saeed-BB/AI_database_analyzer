export default function LoadingSpinner({ size = 24, color = "#2772CE" }: { size?: number; color?: string }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `2px solid ${color}22`,
        borderTopColor: color,
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
        display: "inline-block",
        flexShrink: 0,
      }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
