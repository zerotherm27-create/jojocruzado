import { requireAdmin } from "@/lib/supabase/admin";
import { createServiceRoleClient } from "@/lib/supabase/client";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

const WINDOW_DAYS = 30;
// Aggregated in JS below rather than via a SQL view/RPC (see the plan note
// in the chatbot follow-up work) -- fine at this site's traffic level; if
// this table ever grows past a few thousand rows/month, move the counting
// into a Postgres view instead of raising this cap.
const ROW_LIMIT = 5000;

type EventRow = { event_type: string; path: string | null; referrer: string | null };

function topEntries(values: (string | null)[], limit: number): { value: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const value of values) {
    if (!value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([value, count]) => ({ value, count }));
}

export default async function AnalyticsPage() {
  await requireAdmin();

  const since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const supabase = createServiceRoleClient();

  const [{ data: eventRows }, { count: leadCount }] = await Promise.all([
    supabase
      .from("analytics_events")
      .select("event_type, path, referrer")
      .gte("created_at", since)
      .limit(ROW_LIMIT),
    supabase
      .from("funnel_leads")
      .select("id", { count: "exact", head: true })
      .eq("source", "chatbot")
      .gte("created_at", since),
  ]);

  const events = (eventRows ?? []) as EventRow[];
  const pageViews = events.filter((e) => e.event_type === "page_view");
  const chatOpened = events.filter((e) => e.event_type === "chat_opened").length;
  const chatMessagesSent = events.filter((e) => e.event_type === "chat_message_sent").length;

  const topPages = topEntries(pageViews.map((e) => e.path), 10);
  const topReferrers = topEntries(
    pageViews.map((e) => e.referrer),
    10,
  );

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Analytics</h1>
      </div>
      <p className={styles.fileHint} style={{ marginBottom: 24 }}>
        Last {WINDOW_DAYS} days. No IP addresses or personal data are collected — see{" "}
        <code>supabase/migrations/0013_analytics_events.sql</code>.
      </p>

      <div className={styles.statGrid}>
        <div className={styles.statTile}>
          <div className={styles.statValue}>{pageViews.length}</div>
          <div className={styles.statLabel}>Page views</div>
        </div>
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

      <div className={styles.pageHeader}>
        <h2 className={styles.title}>Top pages</h2>
      </div>
      {topPages.length === 0 ? (
        <div className={styles.empty}>No page views yet.</div>
      ) : (
        <div className={styles.list} style={{ marginBottom: 32 }}>
          {topPages.map((page) => (
            <div key={page.value} className={styles.row}>
              <div className={styles.rowBody}>
                <div className={styles.rowTitle}>{page.value}</div>
              </div>
              <div className={styles.rowMeta}>{page.count} views</div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.pageHeader}>
        <h2 className={styles.title}>Top referrers</h2>
      </div>
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
    </>
  );
}
