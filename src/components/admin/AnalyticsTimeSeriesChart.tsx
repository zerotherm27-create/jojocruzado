"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "@/app/admin/admin.module.css";

export type TimeSeriesPoint = { date: string; label: string; sessions: number; pageviews: number };

// Hex values mirror src/styles/tokens.css (--accent, --ink-500, --border,
// --ink-900) -- SVG presentation attributes here get set directly by
// recharts rather than through a stylesheet, so CSS custom properties
// aren't reliably resolved; hardcoding keeps the chart on-brand without
// that risk. This site's palette is narrow (navy + one gold accent), so the
// headline series (sessions) gets the accent and the secondary series
// (pageviews) gets a neutral gray, rather than introducing a new hue.
const SESSIONS_COLOR = "#f5a623";
const PAGEVIEWS_COLOR = "#5e6878";
const GRID_COLOR = "#e8ebf0";
const INK_900 = "#111827";
const INK_500 = "#5e6878";

export default function AnalyticsTimeSeriesChart({ data }: { data: TimeSeriesPoint[] }) {
  return (
    <div>
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
            <CartesianGrid stroke={GRID_COLOR} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: INK_500, fontSize: 12, fontFamily: "var(--font-body)" }}
              axisLine={{ stroke: GRID_COLOR }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: INK_500, fontSize: 12, fontFamily: "var(--font-body)" }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip
              contentStyle={{
                border: "1px solid " + GRID_COLOR,
                borderRadius: 10,
                fontFamily: "var(--font-body)",
                fontSize: 13,
              }}
              labelStyle={{ color: INK_900, fontWeight: 600, marginBottom: 4 }}
              itemStyle={{ color: INK_900 }}
            />
            <Line
              type="monotone"
              dataKey="sessions"
              name="Sessions"
              stroke={SESSIONS_COLOR}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="pageviews"
              name="Pageviews"
              stroke={PAGEVIEWS_COLOR}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.chartLegend}>
        <span className={styles.chartLegendItem}>
          <span className={styles.chartLegendSwatch} style={{ background: SESSIONS_COLOR }} />
          Sessions
        </span>
        <span className={styles.chartLegendItem}>
          <span className={styles.chartLegendSwatch} style={{ background: PAGEVIEWS_COLOR }} />
          Pageviews
        </span>
      </div>
    </div>
  );
}
