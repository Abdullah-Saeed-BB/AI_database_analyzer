import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  accentColor?: string;
}

export default function StatCard({
  icon,
  label,
  value,
  subtext,
  trend,
  trendValue,
  accentColor = "#2772CE",
}: StatCardProps) {
  const trendColor =
    trend === "up" ? "#16A34A" : trend === "down" ? "#DC2626" : "#5A5E63";
  const trendArrow = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #E6EAED",
        borderRadius: "12px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 4px 16px rgba(39, 114, 206, 0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          backgroundColor: `${accentColor}14`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: accentColor,
        }}
      >
        {icon}
      </div>

      {/* Value */}
      <div>
        <div
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#1F2324",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
          }}
        >
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        <div style={{ fontSize: "13px", color: "#5A5E63", marginTop: "4px" }}>
          {label}
        </div>
      </div>

      {/* Trend or Subtext */}
      {(trendValue || subtext) && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {trendValue && (
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: trendColor,
                backgroundColor: `${trendColor}14`,
                padding: "2px 7px",
                borderRadius: "99px",
              }}
            >
              {trendArrow} {trendValue}
            </span>
          )}
          {subtext && (
            <span style={{ fontSize: "12px", color: "#5A5E63" }}>{subtext}</span>
          )}
        </div>
      )}
    </div>
  );
}
