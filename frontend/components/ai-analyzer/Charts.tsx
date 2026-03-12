"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  LineChart,
  Line,
  Legend,
  Label,
} from "recharts";

// ─────────────────────────────────────────────────────────────────────────────
// SHARED TYPES & UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

type RawData = Record<string, (string | number)[]>;

interface ChartProps {
  data: RawData;
  columns: string[];
}

const PALETTE = [
  "#6366f1", "#f59e0b", "#10b981", "#ef4444", "#3b82f6",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#84cc16",
  "#06b6d4", "#a855f7", "#e11d48", "#0ea5e9", "#22c55e",
];

const CHART_STYLE = {
  fontFamily: "'Courier New', monospace",
  background: "#F8F8F8",
  surface: "#F8F8F8",
  border: "#dbe1e5",
  text: "#5A5E63",
  textBright: "#1F2324",
  grid: "#c1c7cb",
};

function median(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function percentile(arr: number[], p: number): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

function isHighlySkewed(values: number[]): boolean {
  const med = median(values);
  const max = Math.max(...values);
  return med > 0 && max / med > 10;
}

const sharedTooltipStyle = {
  backgroundColor: CHART_STYLE.surface,
  border: `1px solid ${CHART_STYLE.border}`,
  boxShadow: "2px 3px 5px 2px rgba(0, 0, 0, 0.2)",
  borderRadius: "2px",
  color: CHART_STYLE.textBright,
  fontSize: "12px",
};

const ChartWrapper = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div
    style={{
      background: CHART_STYLE.background,
      border: `1px solid ${CHART_STYLE.border}`,
      borderRadius: "12px",
      padding: "24px",
      // fontFamily: CHART_STYLE.fontFamily,
    }}
    className="w-full"
  >
    <h3
      // style={{ color: CHART_STYLE.textBright, marginBottom: "20px", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase" }}
      className="text-text-bright mb-5 text-lg font-medium tracking-wide capitalize text-center"
    >
      {title}
    </h3>
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// BAR CHART
// Rules:
//   - Vertical if categories < 10
//   - Horizontal if categories >= 10
//   - Log scale + highlight top if max/median >> 10 (highly skewed)
// ─────────────────────────────────────────────────────────────────────────────

export function SmartBarChart({ data, columns }: ChartProps) {
  const [catCol, valCol] = columns;
  const categories = (data[catCol] as string[]) ?? [];
  const rawValues = (data[valCol] as number[]) ?? [];

  const isHorizontal = categories.length >= 10;
  const skewed = isHighlySkewed(rawValues);

  // Build chart data; if skewed add "Others" aggregation for bottom categories
  const chartData = useMemo(() => {
    const pairs = categories.map((cat, i) => ({ name: String(cat), value: rawValues[i] ?? 0 }));
    if (skewed && pairs.length > 6) {
      const sorted = [...pairs].sort((a, b) => b.value - a.value);
      const top = sorted.slice(0, 5);
      const othersSum = sorted.slice(5).reduce((s, d) => s + d.value, 0);
      return [...top, { name: "Others", value: othersSum }];
    }
    return pairs;
  }, [categories, rawValues, skewed]);

  const maxValue = Math.max(...chartData.map((d) => d.value));
  const topName = chartData[0]?.name;

  const getColor = (entry: { name: string }) =>
    entry.name === topName && skewed ? "#f59e0b" : entry.name === "Others" ? "#475569" : "#6366f1";

  const yAxisProps = skewed
    ? { scale: "log" as const, domain: ["auto", "auto"], allowDataKey: true }
    : { domain: [0, maxValue * 1.1] };

  if (isHorizontal) {
    return (
      <ChartWrapper title={`${valCol} by ${catCol}`}>
        <ResponsiveContainer width="100%" height={Math.max(300, chartData.length * 32)}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 80, right: 20, top: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLE.grid} horizontal={false} />
            <XAxis
              type="number"
              {...(skewed ? { scale: "log", domain: ["auto", "auto"] } : {})}
              tick={{ fill: CHART_STYLE.text, fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: CHART_STYLE.border }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: CHART_STYLE.text, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={75}
            />
            <Tooltip contentStyle={sharedTooltipStyle} cursor={{ fill: "rgba(99,102,241,0.08)" }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={24}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={getColor(entry)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {skewed && (
          <p style={{ color: CHART_STYLE.text, fontSize: "11px", marginTop: "8px" }}>
            ⚡ Log scale applied · Top category highlighted · Bottom categories collapsed into "Others"
          </p>
        )}
      </ChartWrapper>
    );
  }

  return (
    <ChartWrapper title={`${valCol} by ${catCol}`}>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} margin={{ left: 10, right: 10, top: 10, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLE.grid} vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: CHART_STYLE.text, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: CHART_STYLE.border }}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            {...yAxisProps}
            tick={{ fill: CHART_STYLE.text, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip contentStyle={sharedTooltipStyle} cursor={{ fill: "rgba(99,102,241,0.08)" }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={getColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {skewed && (
        <p style={{ color: CHART_STYLE.text, fontSize: "11px", marginTop: "8px" }}>
          ⚡ Log scale applied · Top category highlighted · Bottom categories collapsed into "Others"
        </p>
      )}
    </ChartWrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PIE / DONUT CHART
// Rules:
//   - Pie if categories < 6
//   - Donut if categories 6–10
//   - Replace small slices (<5% of total) beyond index 5 with "Other"
// ─────────────────────────────────────────────────────────────────────────────

const RADIAN = Math.PI / 180;

function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) {
  if (percent < 0.04) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontFamily={CHART_STYLE.fontFamily}>
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
}

export function SmartPieChart({ data, columns }: ChartProps) {
  const [labelCol, valCol] = columns;
  const labels = (data[labelCol] as string[]) ?? [];
  const rawValues = (data[valCol] as number[]) ?? [];

  const chartData = useMemo(() => {
    const pairs = labels.map((l, i) => ({ name: String(l), value: rawValues[i] ?? 0 }));
    const total = pairs.reduce((s, d) => s + d.value, 0);

    // Collapse slices beyond index 5 if their sum < 5% of total
    if (pairs.length > 5) {
      const top5 = pairs.slice(0, 5);
      const rest = pairs.slice(5);
      const restSum = rest.reduce((s, d) => s + d.value, 0);
      if (restSum / total < 0.05) {
        return [...top5, { name: "Other", value: restSum }];
      }
    }
    return pairs;
  }, [labels, rawValues]);

  const isDonut = chartData.length >= 6;
  const innerR = isDonut ? 70 : 0;

  return (
    <ChartWrapper title={`${valCol} by ${labelCol}`}>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={innerR}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={PieLabel}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={i === chartData.length - 1 && chartData[i].name === "Other" ? "#475569" : PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={sharedTooltipStyle} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ color: CHART_STYLE.text, fontSize: "12px", fontFamily: CHART_STYLE.fontFamily }}
          />
        </PieChart>
      </ResponsiveContainer>
      <p style={{ color: CHART_STYLE.text, fontSize: "11px", marginTop: "4px" }}>
        {isDonut ? "🍩 Donut mode (6–10 categories)" : "🥧 Pie mode (<6 categories)"}
      </p>
    </ChartWrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCATTER CHART
// Rules:
//   - Log scale if max/median >> 10 on x or y
//   - Remove extreme outliers (outside 3 IQR)
// ─────────────────────────────────────────────────────────────────────────────

function removeOutliers(values: number[]): [number, number] {
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = percentile(sorted, 25);
  const q3 = percentile(sorted, 75);
  const iqr = q3 - q1;
  return [q1 - 3 * iqr, q3 + 3 * iqr];
}

export function SmartScatterChart({ data, columns }: ChartProps) {
  const [xCol, yCol] = columns;
  const xRaw = (data[xCol] as number[]) ?? [];
  const yRaw = (data[yCol] as number[]) ?? [];

  const [xMin, xMax] = removeOutliers(xRaw);
  const [yMin, yMax] = removeOutliers(yRaw);

  const chartData = useMemo(
    () =>
      xRaw
        .map((x, i) => ({ x, y: yRaw[i] }))
        .filter((d) => d.x >= xMin && d.x <= xMax && d.y >= yMin && d.y <= yMax),
    [xRaw, yRaw, xMin, xMax, yMin, yMax]
  );

  const logX = isHighlySkewed(xRaw.filter((v) => v > 0));
  const logY = isHighlySkewed(yRaw.filter((v) => v > 0));

  return (
    <ChartWrapper title={`${yCol} vs ${xCol}`}>
      <ResponsiveContainer width="100%" height={340}>
        <ScatterChart margin={{ left: 20, right: 20, top: 20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLE.grid} />
          <XAxis
            type="number"
            dataKey="x"
            name={xCol}
            {...(logX ? { scale: "log", domain: ["auto", "auto"] } : {})}
            tick={{ fill: CHART_STYLE.text, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: CHART_STYLE.border }}
          >
            <Label value={xCol} offset={-10} position="insideBottom" fill={CHART_STYLE.text} fontSize={12} fontFamily={CHART_STYLE.fontFamily} />
          </XAxis>
          <YAxis
            type="number"
            dataKey="y"
            name={yCol}
            {...(logY ? { scale: "log", domain: ["auto", "auto"] } : {})}
            tick={{ fill: CHART_STYLE.text, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          >
            <Label value={yCol} angle={-90} position="insideLeft" fill={CHART_STYLE.text} fontSize={12} fontFamily={CHART_STYLE.fontFamily} />
          </YAxis>
          <Tooltip contentStyle={sharedTooltipStyle} cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={chartData} fill="#6366f1" fillOpacity={0.7} />
        </ScatterChart>
      </ResponsiveContainer>
      <p style={{ color: CHART_STYLE.text, fontSize: "11px", marginTop: "4px" }}>
        {(logX || logY) && `⚡ Log scale on ${[logX && xCol, logY && yCol].filter(Boolean).join(" & ")} · `}
        Outliers beyond 3×IQR removed ({xRaw.length - chartData.length} points clipped)
      </p>
    </ChartWrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LINE CHART
// Rules:
//   - Fill missing periods if time intervals inconsistent
//   - Use bar chart if rows < 3
//   - Smooth (monotone curve) if rows > 1000
// ─────────────────────────────────────────────────────────────────────────────

function fillMissingPeriods(times: string[], values: number[]): { time: string; value: number | null }[] {
  // Detect interval gaps and fill nulls where jumps are > 1.5× median gap
  const parsed = times.map((t) => new Date(t).getTime());
  if (parsed.some(isNaN)) return times.map((t, i) => ({ time: t, value: values[i] }));

  const gaps = parsed.slice(1).map((t, i) => t - parsed[i]);
  const medianGap = median(gaps);

  const result: { time: string; value: number | null }[] = [{ time: times[0], value: values[0] }];
  for (let i = 1; i < parsed.length; i++) {
    const gap = parsed[i] - parsed[i - 1];
    if (gap > 1.5 * medianGap) {
      const steps = Math.round(gap / medianGap) - 1;
      for (let s = 1; s <= steps; s++) {
        const ts = new Date(parsed[i - 1] + s * medianGap).toISOString().split("T")[0];
        result.push({ time: ts, value: null });
      }
    }
    result.push({ time: times[i], value: values[i] });
  }
  return result;
}

export function SmartLineChart({ data, columns }: ChartProps) {
  const [timeCol, valCol] = columns;
  const times = (data[timeCol] as string[]) ?? [];
  const rawValues = (data[valCol] as number[]) ?? [];

  const rowCount = times.length;

  // Rule: use bar if rows < 3
  if (rowCount < 3) {
    const barData = times.map((t, i) => ({ name: String(t), value: rawValues[i] }));
    return (
      <ChartWrapper title={`${valCol} over ${timeCol}`}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLE.grid} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: CHART_STYLE.text, fontSize: 11 }} tickLine={false} axisLine={{ stroke: CHART_STYLE.border }} />
            <YAxis tick={{ fill: CHART_STYLE.text, fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={sharedTooltipStyle} />
            <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
        <p style={{ color: CHART_STYLE.text, fontSize: "11px", marginTop: "4px" }}>
          📊 Bar chart used (fewer than 3 data points)
        </p>
      </ChartWrapper>
    );
  }

  const filled = fillMissingPeriods(times, rawValues);
  const filledCount = filled.filter((d) => d.value === null).length;
  const smooth = rowCount > 1000;

  return (
    <ChartWrapper title={`${valCol} over ${timeCol}`}>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={filled} margin={{ left: 10, right: 20, top: 10, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLE.grid} vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: CHART_STYLE.text, fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: CHART_STYLE.border }}
            interval="preserveStartEnd"
            angle={-30}
            textAnchor="end"
          />
          <YAxis tick={{ fill: CHART_STYLE.text, fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={sharedTooltipStyle} />
          <Line
            type={smooth ? "monotone" : "linear"}
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={2}
            dot={rowCount <= 60}
            activeDot={{ r: 5, fill: "#6366f1" }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <p style={{ color: CHART_STYLE.text, fontSize: "11px", marginTop: "4px" }}>
        {smooth && "〰️ Smoothed (monotone curve, >1000 rows) · "}
        {filledCount > 0 && `🔧 ${filledCount} missing period(s) filled · `}
        {rowCount} data points
      </p>
    </ChartWrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HISTOGRAM
// Rules:
//   - Log scale if 95th percentile >> median
//   - Bin count ≈ sqrt(row_count)
//   - Clip at P99 if extreme outliers
// ─────────────────────────────────────────────────────────────────────────────

function buildHistogram(values: number[], binCount: number, clipAt: number) {
  const clipped = values.filter((v) => v <= clipAt);
  const min = Math.min(...clipped);
  const max = Math.max(...clipped);
  const binWidth = (max - min) / binCount;

  const bins: { bin: string; count: number; rangeStart: number }[] = Array.from({ length: binCount }, (_, i) => ({
    bin: `${(min + i * binWidth).toFixed(1)}`,
    rangeStart: min + i * binWidth,
    count: 0,
  }));

  for (const v of clipped) {
    const idx = Math.min(Math.floor((v - min) / binWidth), binCount - 1);
    bins[idx].count++;
  }
  return bins;
}

export function SmartHistogram({ data, columns }: ChartProps) {
  const [valCol] = columns;
  const rawValues = ((data[valCol] as number[]) ?? []).filter((v) => typeof v === "number" && isFinite(v));

  const rowCount = rawValues.length;
  const binCount = Math.max(5, Math.round(Math.sqrt(rowCount)));
  const p95 = percentile(rawValues, 95);
  const p99 = percentile(rawValues, 99);
  const med = median(rawValues);
  const logScale = p95 > 0 && med > 0 && p95 / med > 10;
  const clippedCount = rawValues.filter((v) => v > p99).length;
  const clipAt = clippedCount > 0 ? p99 : Math.max(...rawValues);

  const bins = useMemo(() => buildHistogram(rawValues, binCount, clipAt), [rawValues, binCount, clipAt]);

  return (
    <ChartWrapper title={`Distribution of ${valCol}`}>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={bins} margin={{ left: 10, right: 10, top: 10, bottom: 30 }} barCategoryGap="1%">
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLE.grid} vertical={false} />
          <XAxis
            dataKey="bin"
            tick={{ fill: CHART_STYLE.text, fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: CHART_STYLE.border }}
            angle={-35}
            textAnchor="end"
            interval={Math.floor(binCount / 8)}
          />
          <YAxis
            {...(logScale ? { scale: "log" as const, domain: ["auto", "auto"] } : {})}
            tick={{ fill: CHART_STYLE.text, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={sharedTooltipStyle}
            formatter={(val: any) => [val, "Count"]}
            labelFormatter={(label) => `From ${label}`}
            cursor={{ fill: "rgba(99,102,241,0.08)" }}
          />
          <Bar dataKey="count" fill="#6366f1" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p style={{ color: CHART_STYLE.text, fontSize: "11px", marginTop: "4px" }}>
        {logScale && "⚡ Log scale (P95/median > 10) · "}
        {clippedCount > 0 && `✂️ ${clippedCount} outlier(s) clipped at P99 (${p99.toFixed(2)}) · `}
        {binCount} bins · {rowCount} values
      </p>
    </ChartWrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT EXPORT — convenience wrapper with all charts
// ─────────────────────────────────────────────────────────────────────────────

export default {
  SmartBarChart,
  SmartPieChart,
  SmartScatterChart,
  SmartLineChart,
  SmartHistogram,
};