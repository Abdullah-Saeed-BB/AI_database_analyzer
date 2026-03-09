import { getDashboardStats, getRecentActivity } from "@/lib/api";
import DashboardStatsGrid from "@/components/dashboard/DashboardStatsGrid";
import RecentActivity from "@/components/dashboard/RecentActivity";
import ErrorMessage from "@/components/ui/ErrorMessage";

export const metadata = {
  title: "Dashboard — AI Database Analyzer",
  description: "Overview of your database metrics and recent activity",
};

export default async function DashboardPage() {
  let stats = null;
  let activity = null;
  let statsError: string | null = null;
  let activityError: string | null = null;

  // Fetch stats
  try {
    stats = await getDashboardStats();
  } catch {
    statsError = "Failed to load dashboard statistics. Please try again later.";
  }

  // Fetch recent activity (independent of stats)
  try {
    activity = await getRecentActivity();
  } catch {
    activityError = "Failed to load recent activity. Please try again later.";
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
          Dashboard
        </h1>
        <p style={{ fontSize: "14px", color: "#5A5E63", marginTop: "4px" }}>
          Your database at a glance — live metrics and recent operations
        </p>
      </div>

      {/* Stats Section 
      <section style={{ marginBottom: "28px" }}>
        {statsError ? (
          <ErrorMessage message={statsError} />
        ) : stats ? (
          <DashboardStatsGrid stats={stats} />
        ) : null}
      </section> */}

      {/* Activity Section */}
      <section>
        {activityError ? (
          <ErrorMessage message={activityError} />
        ) : activity ? (
          <RecentActivity items={activity} />
        ) : null}
      </section>
    </div>
  );
}
