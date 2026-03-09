import { TableInfo } from "@/lib/api";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const schemaColors: Record<string, { text: string; bg: string }> = {
  public: { text: "#2772CE", bg: "#EFF4FC" },
  auth: { text: "#7C3AED", bg: "#F5F3FF" },
  analytics: { text: "#059669", bg: "#ECFDF5" },
};

interface TableInfoCardProps {
  table: TableInfo;
}

export default function TableInfoCard({ table }: TableInfoCardProps) {
  const schemaStyle = schemaColors[table.schema] ?? { text: "#5A5E63", bg: "#E6EAED" };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #E6EAED",
        borderRadius: "12px",
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
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
      {/* Top Row: Name + Schema Badge */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "8px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "#EFF4FC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#2772CE"
                style={{ width: 16, height: 16 }}
              >
                <path
                  fillRule="evenodd"
                  d=".99 5.24A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25l.01 9.5A2.25 2.25 0 0 1 16.76 17H3.26A2.267 2.267 0 0 1 1 14.74l-.01-9.5Zm8.26 9.52v-.625a.75.75 0 0 0-1.5 0v.625a.75.75 0 0 0 1.5 0Zm4.501 0v-.625a.75.75 0 0 0-1.5 0v.625a.75.75 0 0 0 1.5 0Zm-7.752-3.688v-.625a.75.75 0 0 0-1.5 0v.625a.75.75 0 0 0 1.5 0Zm4.25 0v-.625a.75.75 0 0 0-1.5 0v.625a.75.75 0 0 0 1.5 0Zm4.25 0v-.625a.75.75 0 0 0-1.5 0v.625a.75.75 0 0 0 1.5 0Zm-8.5-3.688v-.625a.75.75 0 0 0-1.5 0v.625a.75.75 0 0 0 1.5 0Zm4.25 0v-.625a.75.75 0 0 0-1.5 0v.625a.75.75 0 0 0 1.5 0Zm4.25 0v-.625a.75.75 0 0 0-1.5 0v.625a.75.75 0 0 0 1.5 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#1F2324",
                  fontFamily: "monospace",
                }}
              >
                {table.name}
              </p>
              <p style={{ fontSize: "11px", color: "#5A5E63", marginTop: "1px" }}>
                {table.columnCount} columns
              </p>
            </div>
          </div>
        </div>
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: schemaStyle.text,
            backgroundColor: schemaStyle.bg,
            padding: "3px 8px",
            borderRadius: "5px",
            flexShrink: 0,
            letterSpacing: "0.04em",
          }}
        >
          {table.schema}
        </span>
      </div>

      {/* Description */}
      <p style={{ fontSize: "13px", color: "#5A5E63", lineHeight: 1.5 }}>
        {table.description}
      </p>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
        }}
      >
        {/* Row Count */}
        <div
          style={{
            backgroundColor: "#F8F8F8",
            borderRadius: "8px",
            padding: "10px 12px",
          }}
        >
          <p style={{ fontSize: "11px", color: "#5A5E63", marginBottom: "3px" }}>
            Total Rows
          </p>
          <p style={{ fontSize: "18px", fontWeight: 700, color: "#1F2324" }}>
            {formatNumber(table.rowCount)}
          </p>
        </div>

        {/* Added This Month */}
        <div
          style={{
            backgroundColor: table.rowsAddedThisMonth > 0 ? "#ECFDF5" : "#F8F8F8",
            borderRadius: "8px",
            padding: "10px 12px",
          }}
        >
          <p style={{ fontSize: "11px", color: "#5A5E63", marginBottom: "3px" }}>
            Added This Month
          </p>
          <p
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: table.rowsAddedThisMonth > 0 ? "#059669" : "#1F2324",
            }}
          >
            +{formatNumber(table.rowsAddedThisMonth)}
          </p>
        </div>
      </div>

      {/* Key Column Mean */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px",
          backgroundColor: "#EFF4FC",
          borderRadius: "8px",
        }}
      >
        <div>
          <p style={{ fontSize: "11px", color: "#5A5E63" }}>
            Mean of{" "}
            <span style={{ fontFamily: "monospace", fontWeight: 600, color: "#2772CE" }}>
              {table.keyColumnName}
            </span>
          </p>
        </div>
        <p style={{ fontSize: "16px", fontWeight: 700, color: "#2772CE" }}>
          {table.keyColumnMean.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>

      {/* Footer */}
      <p style={{ fontSize: "11px", color: "#9EA6AD" }}>
        Last updated {timeAgo(table.lastUpdated)}
      </p>
    </div>
  );
}
