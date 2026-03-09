import { ActivityItem } from "@/lib/api";

const typeConfig: Record<
  ActivityItem["type"],
  { color: string; bg: string; label: string }
> = {
  query: { color: "#2772CE", bg: "#EFF4FC", label: "QUERY" },
  insert: { color: "#059669", bg: "#ECFDF5", label: "INSERT" },
  update: { color: "#F59E0B", bg: "#FFFBEB", label: "UPDATE" },
  delete: { color: "#DC2626", bg: "#FFF5F5", label: "DELETE" },
  schema: { color: "#7C3AED", bg: "#F5F3FF", label: "SCHEMA" },
};

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface RecentActivityProps {
  items: ActivityItem[];
}

export default function RecentActivity({ items }: RecentActivityProps) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #E6EAED",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "18px 24px",
          borderBottom: "1px solid #E6EAED",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#1F2324" }}>
            Recent Activity
          </h2>
          <p style={{ fontSize: "12px", color: "#5A5E63", marginTop: "2px" }}>
            Latest database operations
          </p>
        </div>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#2772CE",
            backgroundColor: "#EFF4FC",
            padding: "4px 10px",
            borderRadius: "99px",
          }}
        >
          Live
        </span>
      </div>

      {/* Items */}
      <div>
        {items.map((item, i) => {
          const tc = typeConfig[item.type];
          return (
            <div
              key={item.id}
              style={{
                padding: "14px 24px",
                borderBottom: i < items.length - 1 ? "1px solid #F0F2F4" : "none",
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
              }}
            >
              {/* Badge */}
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: tc.color,
                  backgroundColor: tc.bg,
                  padding: "3px 7px",
                  borderRadius: "5px",
                  flexShrink: 0,
                  marginTop: "1px",
                  letterSpacing: "0.04em",
                }}
              >
                {tc.label}
              </span>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#1F2324",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.description}
                </p>
                <p style={{ fontSize: "12px", color: "#5A5E63", marginTop: "2px" }}>
                  <span style={{ fontWeight: 500 }}>{item.table}</span>
                  {" · "}
                  <span>{item.user}</span>
                </p>
              </div>

              {/* Time */}
              <span
                style={{
                  fontSize: "12px",
                  color: "#9EA6AD",
                  flexShrink: 0,
                  marginTop: "1px",
                }}
              >
                {timeAgo(item.timestamp)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
