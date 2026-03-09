import { DashboardStats } from "@/lib/api";
import StatCard from "@/components/ui/StatCard";

interface DashboardStatsGridProps {
  stats: DashboardStats;
}

export default function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  const cards = [
    {
      label: "Total Tables",
      value: stats.totalTables,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: 20, height: 20 }}>
          <path fillRule="evenodd" d="M.99 5.24A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25l.01 9.5A2.25 2.25 0 0 1 16.76 17H3.26A2.267 2.267 0 0 1 1 14.74l-.01-9.5Zm8.26 9.52v-.625a.75.75 0 0 0-1.5 0v.625a.75.75 0 0 0 1.5 0Zm4.501 0v-.625a.75.75 0 0 0-1.5 0v.625a.75.75 0 0 0 1.5 0Zm-7.752-3.688v-.625a.75.75 0 0 0-1.5 0v.625a.75.75 0 0 0 1.5 0Zm4.25 0v-.625a.75.75 0 0 0-1.5 0v.625a.75.75 0 0 0 1.5 0Zm4.25 0v-.625a.75.75 0 0 0-1.5 0v.625a.75.75 0 0 0 1.5 0Zm-8.5-3.688v-.625a.75.75 0 0 0-1.5 0v.625a.75.75 0 0 0 1.5 0Zm4.25 0v-.625a.75.75 0 0 0-1.5 0v.625a.75.75 0 0 0 1.5 0Zm4.25 0v-.625a.75.75 0 0 0-1.5 0v.625a.75.75 0 0 0 1.5 0Z" clipRule="evenodd" />
        </svg>
      ),
      subtext: "across 3 schemas",
    },
    {
      label: "Total Rows",
      value: stats.totalRows,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: 20, height: 20 }}>
          <path d="M2 3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2ZM2 7.5h16l-.811 7.71a2 2 0 0 1-1.99 1.79H4.802a2 2 0 0 1-1.99-1.79L2 7.5Z" />
        </svg>
      ),
      trend: "up" as const,
      trendValue: "+23.4K this week",
    },
    {
      label: "Queries Today",
      value: stats.queriesToday,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: 20, height: 20 }}>
          <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 0 0 2 4.25v11.5A2.25 2.25 0 0 0 4.25 18h11.5A2.25 2.25 0 0 0 18 15.75V4.25A2.25 2.25 0 0 0 15.75 2H4.25ZM7 9.25a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5H7Zm0 3.5a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5H7ZM7 6a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5H7Z" clipRule="evenodd" />
        </svg>
      ),
      accentColor: "#7C3AED",
      trend: "up" as const,
      trendValue: "+12% vs. yesterday",
    },
    {
      label: "Active Users",
      value: stats.activeUsers,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: 20, height: 20 }}>
          <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 17a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
        </svg>
      ),
      accentColor: "#059669",
      subtext: "currently online",
    },
    {
      label: "Query Success Rate",
      value: `${stats.querySuccessRate}%`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: 20, height: 20 }}>
          <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
        </svg>
      ),
      accentColor: "#059669",
      trend: "up" as const,
      trendValue: "+0.4%",
    },
    {
      label: "Rows Added This Week",
      value: stats.rowsAddedThisWeek,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: 20, height: 20 }}>
          <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z" clipRule="evenodd" />
        </svg>
      ),
      accentColor: "#F59E0B",
      subtext: "across all tables",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "16px",
      }}
    >
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
