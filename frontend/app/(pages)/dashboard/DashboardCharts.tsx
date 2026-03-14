"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ─── Types (mirrored from page.tsx) ─────────────────────────────────────────

export interface DashboardData {
  orders_this_month: number;
  revenue_this_month: number;
  top_customers: { name: string; total: number }[];
  daily_orders: { day: number; orders: number }[];
  monthly_sales: { month_label: string; orders: number; revenue: number }[];
  top_products_by_country: Record<string, { product: string; qty: number }[]>;
  reference_month: string | null;
  today: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
  label,
  prefix = "",
}: {
  active?: boolean;
  payload?: { value: number; name?: string }[];
  label?: string | number;
  prefix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-2 text-sm min-w-[130px]">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-blue-500 font-medium">
          {p.name ? <span className="text-gray-500 mr-1">{p.name}:</span> : null}
          {prefix}
          {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
}

// ─── Daily Orders Chart ───────────────────────────────────────────────────────

export function DailyOrdersChart({
  data,
  delay,
}: {
  data: { day: number; orders: number }[];
  delay: number;
}) {
  return (
    <div
      className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm
                 opacity-0 animate-[fadeSlideUp_0.6s_ease_forwards]
                 hover:shadow-md transition-shadow duration-200"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Daily Orders — This Month
      </h2>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
          barCategoryGap="35%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#eff6ff" }} />
          <Bar
            dataKey="orders"
            fill="#60a5fa"
            radius={[6, 6, 0, 0]}
            isAnimationActive
            animationDuration={800}
            animationEasing="ease-out"
            activeBar={{ fill: "#2563eb" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Top Customers Chart (horizontal) ────────────────────────────────────────

export function TopCustomersChart({
  data,
  delay,
}: {
  data: { name: string; total: number }[];
  delay: number;
}) {
  return (
    <div
      className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm
                 opacity-0 animate-[fadeSlideUp_0.6s_ease_forwards]
                 hover:shadow-md transition-shadow duration-200"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Top Customers Spend — This Month
      </h2>
      {data.length === 0 ? (
        <div className="h-[240px] flex items-center justify-center text-gray-400 text-sm">
          No data available.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
            barCategoryGap="30%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: "#374151" }}
              axisLine={false}
              tickLine={false}
              width={96}
              tickFormatter={(v: string) => (v.length > 13 ? v.slice(0, 12) + "…" : v)}
            />
            <Tooltip
              content={<CustomTooltip prefix="$" />}
              cursor={{ fill: "#eff6ff" }}
            />
            <Bar
              dataKey="total"
              fill="#93c5fd"
              radius={[0, 6, 6, 0]}
              isAnimationActive
              animationDuration={800}
              animationEasing="ease-out"
              activeBar={{ fill: "#3b82f6" }}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// ─── Monthly Sales Chart (last 12 months) ────────────────────────────────────

export function MonthlySalesChart({
  data,
  delay,
}: {
  data: { month_label: string; orders: number; revenue: number }[];
  delay: number;
}) {
  return (
    <div
      className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm
                 opacity-0 animate-[fadeSlideUp_0.6s_ease_forwards]
                 hover:shadow-md transition-shadow duration-200 col-span-1 lg:col-span-2"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Sales — Last 12 Months
      </h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
          barCategoryGap="25%"
          barGap={4}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="month_label"
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            tickFormatter={(v) => v.toLocaleString()}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#eff6ff" }} />
          <Legend
            wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
            formatter={(value) => (value === "orders" ? "Orders" : "Revenue ($)")}
          />
          <Bar
            yAxisId="left"
            dataKey="orders"
            name="orders"
            fill="#60a5fa"
            radius={[4, 4, 0, 0]}
            isAnimationActive
            animationDuration={900}
            animationEasing="ease-out"
            activeBar={{ fill: "#2563eb" }}
          />
          <Bar
            yAxisId="right"
            dataKey="revenue"
            name="revenue"
            fill="#bfdbfe"
            radius={[4, 4, 0, 0]}
            isAnimationActive
            animationDuration={900}
            animationEasing="ease-out"
            activeBar={{ fill: "#93c5fd" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Country Product Chart ────────────────────────────────────────────────────

const COUNTRY_COLORS: Record<string, { fill: string; active: string }> = {
  "Saudi Arabia":   { fill: "#60a5fa", active: "#2563eb" },
  "United Kingdom": { fill: "#34d399", active: "#059669" },
  "USA":            { fill: "#f472b6", active: "#db2777" },
};

export function CountryProductChart({
  country,
  data,
  delay,
}: {
  country: string;
  data: { product: string; qty: number }[];
  delay: number;
}) {
  const colors = COUNTRY_COLORS[country] ?? { fill: "#60a5fa", active: "#2563eb" };

  return (
    <div
      className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm
                 opacity-0 animate-[fadeSlideUp_0.6s_ease_forwards]
                 hover:shadow-md transition-shadow duration-200"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
        Top Products
      </h2>
      <p className="text-xs text-gray-400 mb-4">📍 {country}</p>
      {data.length === 0 ? (
        <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">
          No data available.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 12, left: 0, bottom: 0 }}
            barCategoryGap="30%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 10, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => v.toLocaleString()}
            />
            <YAxis
              type="category"
              dataKey="product"
              tick={{ fontSize: 10, fill: "#374151" }}
              axisLine={false}
              tickLine={false}
              width={110}
              tickFormatter={(v: string) => (v.length > 16 ? v.slice(0, 15) + "…" : v)}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "#f0f9ff" }}
            />
            <Bar
              dataKey="qty"
              name="Qty"
              fill={colors.fill}
              radius={[0, 6, 6, 0]}
              isAnimationActive
              animationDuration={800}
              animationEasing="ease-out"
              activeBar={{ fill: colors.active }}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
