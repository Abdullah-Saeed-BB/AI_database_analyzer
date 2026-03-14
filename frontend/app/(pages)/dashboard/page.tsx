import { redirect } from "next/navigation";
import { authFetch } from "@/lib/api/authFetch";
import PageDescription from "@/components/ui/PageDescription";
import {
  DailyOrdersChart,
  TopCustomersChart,
  MonthlySalesChart,
  CountryProductChart,
  type DashboardData,
} from "./DashboardCharts";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatRefMonth(refMonth: string | null) {
  if (!refMonth) return "";
  const [year, month] = refMonth.split("-");
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  delay,
}: {
  icon: string;
  label: string;
  value: string;
  delay: number;
}) {
  return (
    <div
      className="bg-white border border-gray-300 rounded-2xl p-5 flex items-center gap-4
                 shadow-sm opacity-0 animate-[fadeSlideUp_0.6s_ease_forwards]
                 hover:shadow-md transition-shadow duration-200"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider truncate">
          {label}
        </p>
        <p className="text-xl font-bold text-gray-800 mt-0.5 truncate">{value}</p>
      </div>
    </div>
  );
}

// ─── Top 3 Customers Card ─────────────────────────────────────────────────────

const MEDALS = ["🥇", "🥈", "🥉"];

function TopCustomersCard({
  customers,
  delay,
}: {
  customers: { name: string; total: number }[];
  delay: number;
}) {
  return (
    <div
      className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm
                 opacity-0 animate-[fadeSlideUp_0.6s_ease_forwards]
                 hover:shadow-md transition-shadow duration-200"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Top Customers This Month
      </h2>
      {customers.length === 0 ? (
        <p className="text-gray-400 text-sm">No data available.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {customers.map((c, i) => (
            <li
              key={c.name}
              className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-150"
            >
              <span className="text-2xl">{MEDALS[i]}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{c.name}</p>
              </div>
              <span className="text-blue-600 font-bold text-sm shrink-0">
                {formatCurrency(c.total)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Page (Server Component — data is fetched before render, no delay) ────────

export default async function DashboardPage() {
  let data: DashboardData;

  try {
    const res = await authFetch("/api/data/stats/dashboard");
    if (res.status === 401) redirect("/login");
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    data = (await res.json()) as DashboardData;
  } catch {
    return (
      <div className="p-8">
        <PageDescription
          title="Dashboard"
          description="View your recent activity and database statistics at a glance."
        />
        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
          Failed to load dashboard data. Please try again later.
        </div>
      </div>
    );
  }

  const COUNTRIES = ["Saudi Arabia", "United Kingdom", "USA"] as const;

  return (
    <>
      {/* Keyframe for card entry animations */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1">
          <PageDescription
            title="Dashboard"
            description="View your recent activity and database statistics at a glance."
          />
          {data.reference_month && (
            <p className="text-xs text-gray-400 pb-1 sm:text-right">
              Showing data for{" "}
              <span className="font-semibold text-blue-500">
                {formatRefMonth(data.reference_month)}
              </span>
            </p>
          )}
        </div>

        {/* ── Stat Cards ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            icon="📦"
            label="Orders This Month"
            value={data.orders_this_month.toLocaleString("en")}
            delay={0}
          />
          <StatCard
            icon="💵"
            label="Revenue This Month"
            value={formatCurrency(data.revenue_this_month)}
            delay={100}
          />
          <StatCard
            icon="📅"
            label="Today"
            value={formatDate(data.today)}
            delay={200}
          />
        </section>

        {/* ── Monthly overview charts ── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DailyOrdersChart data={data.daily_orders} delay={300} />
          <TopCustomersChart data={data.top_customers} delay={400} />
        </section>

        {/* ── Last 12 months sales (full-width) ── */}
        <section className="grid grid-cols-1">
          <MonthlySalesChart data={data.monthly_sales} delay={500} />
        </section>

        {/* ── Top customers detail card ── */}
        <TopCustomersCard customers={data.top_customers} delay={600} />

        {/* ── Top products per country (3 columns) ── */}
        <section>
          <h2
            className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4
                       opacity-0 animate-[fadeSlideUp_0.6s_ease_forwards]"
            style={{ animationDelay: "700ms" }}
          >
            Top Products by Country
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {COUNTRIES.map((country, i) => (
              <CountryProductChart
                key={country}
                country={country}
                data={data.top_products_by_country[country] ?? []}
                delay={750 + i * 80}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
