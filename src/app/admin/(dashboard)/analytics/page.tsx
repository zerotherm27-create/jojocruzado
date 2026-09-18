import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import { createServiceRoleClient } from "@/lib/supabase/client";
import AnalyticsTimeSeriesChart from "@/components/admin/AnalyticsTimeSeriesChart";
import {
  RANGE_OPTIONS,
  buildTimeSeries,
  isRangeKey,
  sinceFor,
  topEntries,
  trafficSource,
  type RangeKey,
} from "@/lib/analytics/aggregate";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

const EVENT_WINDOW_DAYS = 30;
// Aggregated in JS below rather than via a SQL view/RPC -- fine at this
// site's traffic level; if these tables ever grow past a few thousand
// rows/window, move the counting into a Postgres view instead of raising
// these caps.
const EVENT_ROW_LIMIT = 5000;
const SESSION_ROW_LIMIT = 20000;
const PAGEVIEW_ROW_LIMIT = 20000;
const BREAKDOWN_LIMIT = 8;

type EventRow = { event_type: string; path: string | null; referrer: string | null };
type SessionRow = {
  created_at: string;
  duration_seconds: number;
  page_count: number;
  device_type: string | null;
  os: string | null;
  browser: string | null;
  country: string | null;
  referrer: string | null;
};
type PageviewRow = { path: string | null; occurred_at: string };

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

function BarList({
  title,
  rows,
  emptyLabel,
}: {
  title: string;
  rows: { value: string; count: number }[];
  emptyLabel: string;
}) {
  const max = rows.length > 0 ? rows[0].count : 0;
  return (
    <div className={styles.card}>
      <h3 className={styles.rowTitle} style={{ marginBottom: 8 }}>
        {title}
      </h3>
      {rows.length === 0 ? (
        <div className={styles.empty}>{emptyLabel}</div>
      ) : (
        <div>
          {rows.map((row) => (
            <div key={row.value} className={styles.barRow}>
              <span className={styles.barLabel}>{row.value}</span>
              <span className={styles.barTrack}>
                <span
                  className={styles.barFill}
                  style={{ width: max > 0 ? `${(row.count / max) * 100}%` : 0 }}
                />
              </span>
              <span className={styles.barCount}>{row.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  await requireAdmin();

  const { range: rawRange } = await searchParams;
  const range: RangeKey = isRangeKey(rawRange) ? rawRange : "7d";

  const now = new Date();
  const since = sinceFor(range, now);
  const sinceIso = since.toISOString();
  const eventsSinceIso = new Date(Date.now() - EVENT_WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const supabase = createServiceRoleClient();

  const [{ data: eventRows }, { count: leadCount }, { data: sessionRows }, { data: pageviewRows }] =
    await Promise.all([
      supabase
        .from("analytics_events")
        .select("event_type, path, referrer")
        .gte("created_at", eventsSinceIso)
        .limit(EVENT_ROW_LIMIT),
      supabase
        .from("funnel_leads")
        .select("id", { count: "exact", head: true })
        .eq("source", "chatbot")
        .gte("created_at", eventsSinceIso),
      supabase
        .from("site_sessions")
        .select("created_at, duration_seconds, page_count, device_type, os, browser, country, referrer")
        .gte("created_at", sinceIso)
        .limit(SESSION_ROW_LIMIT),
      supabase
        .from("site_pageviews")
        .select("path, occurred_at")
        .gte("occurred_at", sinceIso)
        .limit(PAGEVIEW_ROW_LIMIT),
    ]);

  const events = (eventRows ?? []) as EventRow[];
  const pageViewEvents = events.filter((e) => e.event_type === "page_view");
  const chatOpened = events.filter((e) => e.event_type === "chat_opened").length;
  const chatMessagesSent = events.filter((e) => e.event_type === "chat_message_sent").length;
  const topReferrers = topEntries(
    pageViewEvents.map((e) => e.referrer),
    10,
  );

  const sessions = (sessionRows ?? []) as SessionRow[];
  const pageviews = (pageviewRows ?? []) as PageviewRow[];

  const sessionCount = sessions.length;
  const pageviewCount = pageviews.length;
  const avgDurationSeconds =
    sessionCount > 0 ? sessions.reduce((sum, s) => sum + s.duration_seconds, 0) / sessionCount : 0;
  const bouncedCount = sessions.filter((s) => s.page_count === 1).length;
  const bounceRate = sessionCount > 0 ? (bouncedCount / sessionCount) * 100 : 0;

  const timeSeries = buildTimeSeries(
    range,
    sessions.map((s) => ({ created_at: s.created_at })),
    pageviews.map((p) => ({ occurred_at: p.occurred_at })),
    since,
    now,
  );

  const topPages = topEntries(
    pageviews.map((p) => p.path),
    10,
  );
  const deviceBreakdown = topEntries(
    sessions.map((s) => s.device_type),
    BREAKDOWN_LIMIT,
  );
  const osBreakdown = topEntries(
    sessions.map((s) => s.os),
    BREAKDOWN_LIMIT,
  );
  const browserBreakdown = topEntries(
    sessions.map((s) => s.browser),
    BREAKDOWN_LIMIT,
  );
  const countryBreakdown = topEntries(
    sessions.map((s) => s.country),
    BREAKDOWN_LIMIT,
  );
  const trafficBreakdown = topEntries(
    sessions.map((s) => trafficSource(s.referrer)),
    BREAKDOWN_LIMIT,
  );

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Analytics</h1>
        <div className={styles.rangeToggle}>
          {RANGE_OPTIONS.map((option) => (
            <Link
              key={option.key}
              href={`/admin/analytics?range=${option.key}`}
              className={option.key === range ? styles.rangePillActive : styles.rangePill}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>
      <p className={styles.fileHint} style={{ marginBottom: 24 }}>
        Session data is derived from your host&apos;s geo headers and a device/browser parse of the
        User-Agent — no IP address is ever stored. See{" "}
        <code>supabase/migrations/0014_site_sessions_and_pageviews.sql</code>.
      </p>

      <div className={styles.statGrid}>
        <div className={styles.statTile}>
          <div className={styles.statValue}>{sessionCount}</div>
          <div className={styles.statLabel}>Visitors</div>
        </div>
        <div className={styles.statTile}>
          <div className={styles.statValue}>{pageviewCount}</div>
          <div className={styles.statLabel}>Pageviews</div>
        </div>
        <div className={styles.statTile}>
          <div className={styles.statValue}>{formatDuration(avgDurationSeconds)}</div>
          <div className={styles.statLabel}>Avg. session duration</div>
        </div>
        <div className={styles.statTile}>
          <div className={styles.statValue}>{bounceRate.toFixed(0)}%</div>
          <div className={styles.statLabel}>Bounce rate</div>
        </div>
      </div>

      <div className={styles.chartCard}>
        <h2 className={styles.rowTitle} style={{ marginBottom: 4 }}>
          Sessions &amp; pageviews
        </h2>
        <AnalyticsTimeSeriesChart data={timeSeries} />
      </div>

      <div className={styles.breakdownGrid}>
        <BarList title="Top pages" rows={topPages} emptyLabel="No pageviews yet." />
        <BarList title="Traffic sources" rows={trafficBreakdown} emptyLabel="No visits yet." />
        <BarList title="Device type" rows={deviceBreakdown} emptyLabel="No visits yet." />
        <BarList title="Browser" rows={browserBreakdown} emptyLabel="No visits yet." />
        <BarList title="Operating system" rows={osBreakdown} emptyLabel="No visits yet." />
        <BarList
          title="Countries"
          rows={countryBreakdown}
          emptyLabel="No location data yet (absent in local dev)."
        />
      </div>

      <div className={styles.sectionGap}>
        <div className={styles.pageHeader}>
          <h2 className={styles.title}>Chatbot funnel</h2>
        </div>
        <p className={styles.fileHint} style={{ marginBottom: 24 }}>
          Last {EVENT_WINDOW_DAYS} days, from the separate event log in{" "}
          <code>supabase/migrations/0013_analytics_events.sql</code>.
        </p>
        <div className={styles.statGrid}>
          <div className={styles.statTile}>
            <div className={styles.statValue}>{chatOpened}</div>
            <div className={styles.statLabel}>Chat opened</div>
          </div>
          <div className={styles.statTile}>
            <div className={styles.statValue}>{chatMessagesSent}</div>
            <div className={styles.statLabel}>Chat messages sent</div>
          </div>
          <div className={styles.statTile}>
            <div className={styles.statValue}>{leadCount ?? 0}</div>
            <div className={styles.statLabel}>Leads from chat</div>
          </div>
        </div>

        <h3 className={styles.rowTitle} style={{ marginBottom: 8 }}>
          Top page-view referrers
        </h3>
        {topReferrers.length === 0 ? (
          <div className={styles.empty}>No referrer data yet -- most visits likely came direct.</div>
        ) : (
          <div className={styles.list}>
            {topReferrers.map((referrer) => (
              <div key={referrer.value} className={styles.row}>
                <div className={styles.rowBody}>
                  <div className={styles.rowTitle}>{referrer.value}</div>
                </div>
                <div className={styles.rowMeta}>{referrer.count} visits</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
