import { getDatabaseTables } from "@/lib/api";
import TableInfoCard from "@/components/explore/TableInfoCard";
import ErrorMessage from "@/components/ui/ErrorMessage";

export const metadata = {
  title: "Explore Data — AI Database Analyzer",
  description: "Browse all database tables and their detailed information",
};

export default async function ExplorePage() {
  let tables = null;
  let error: string | null = null;

  try {
    tables = await getDatabaseTables();
  } catch {
    error = "Failed to load database tables. Please refresh the page to try again.";
  }

  return (
    <div
      style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "32px 32px",
      }}
    >
      {/* Page Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#1F2324",
            letterSpacing: "-0.02em",
          }}
        >
          Explore Data
        </h1>
        <p style={{ fontSize: "14px", color: "#5A5E63", marginTop: "4px" }}>
          Browse all tables in your database — row counts, means, and monthly growth
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      {tables && (
        <>
          {/* Summary bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "12px 16px",
              backgroundColor: "#ffffff",
              border: "1px solid #E6EAED",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            <span style={{ fontSize: "13px", color: "#5A5E63" }}>
              <span style={{ fontWeight: 700, color: "#1F2324" }}>{tables.length}</span>{" "}
              tables found
            </span>
            <span style={{ width: "1px", height: "16px", backgroundColor: "#E6EAED" }} />
            <span style={{ fontSize: "13px", color: "#5A5E63" }}>
              <span style={{ fontWeight: 700, color: "#1F2324" }}>
                {tables.reduce((s, t) => s + t.rowCount, 0).toLocaleString()}
              </span>{" "}
              total rows
            </span>
            <span style={{ width: "1px", height: "16px", backgroundColor: "#E6EAED" }} />
            <span style={{ fontSize: "13px", color: "#5A5E63" }}>
              <span style={{ fontWeight: 700, color: "#059669" }}>
                +{tables.reduce((s, t) => s + t.rowsAddedThisMonth, 0).toLocaleString()}
              </span>{" "}
              rows this month
            </span>
          </div>

          {/* Table Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "16px",
            }}
          >
            {tables.map((table) => (
              <TableInfoCard key={table.id} table={table} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
