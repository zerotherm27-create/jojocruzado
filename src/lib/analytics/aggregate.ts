import "server-only";

// Hardcoded rather than a general timezone system -- this is a single-region
// (Philippines) site, per the "actual business timezone" guidance: build a
// general timezone system only if this ever needs to serve multiple regions.
export const BUSINESS_TIMEZONE = "Asia/Manila";

export type RangeKey = "24h" | "7d" | "30d" | "90d";

export const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
  { key: "24h", label: "24h" },
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
  { key: "90d", label: "90d" },
];

const RANGE_MS: Record<RangeKey, number> = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
  "90d": 90 * 24 * 60 * 60 * 1000,
};

export function isRangeKey(value: string | undefined): value is RangeKey {
  return value === "24h" || value === "7d" || value === "30d" || value === "90d";
}

export function sinceFor(range: RangeKey, now: Date): Date {
  return new Date(now.getTime() - RANGE_MS[range]);
}

export type TimeSeriesPoint = { date: string; label: string; sessions: number; pageviews: number };

const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: BUSINESS_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const dayLabelFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: BUSINESS_TIMEZONE,
  month: "short",
  day: "numeric",
});
// h23 pinned explicitly: en-US's default hour cycle for hour12:false varies
// by ICU version and can format midnight as "24" instead of "00", which
// would sort a whole day's hourly buckets out of order.
const hourKeyFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: BUSINESS_TIMEZONE,
  hourCycle: "h23",
  hour: "2-digit",
});
const hourLabelFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: BUSINESS_TIMEZONE,
  hour: "numeric",
  hour12: true,
});

function dayBucketKey(date: Date): string {
  return dayFormatter.format(date);
}

function hourBucketKey(date: Date): string {
  return `${dayFormatter.format(date)}T${hourKeyFormatter.format(date)}`;
}

/* 24h buckets by hour (a full day of daily buckets would collapse to ~1-2
   bars); 7d/30d/90d bucket by calendar day in BUSINESS_TIMEZONE, per the
   playbook's "bucket in your business's actual timezone" guidance.

   Labels are formatted from the same real Date used to build each bucket's
   key -- never reconstructed by re-parsing the key string later, which
   would run the zone conversion twice and shift hourly labels. */
export function buildTimeSeries(
  range: RangeKey,
  sessions: { created_at: string }[],
  pageviews: { occurred_at: string }[],
  since: Date,
  now: Date,
): TimeSeriesPoint[] {
  const hourly = range === "24h";
  const bucketKey = hourly ? hourBucketKey : dayBucketKey;
  const labelFor = hourly
    ? (date: Date) => hourLabelFormatter.format(date)
    : (date: Date) => dayLabelFormatter.format(date);
  const buckets = new Map<string, { label: string; sessions: number; pageviews: number }>();

  const stepMs = hourly ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  for (let t = since.getTime(); t <= now.getTime(); t += stepMs) {
    const date = new Date(t);
    buckets.set(bucketKey(date), { label: labelFor(date), sessions: 0, pageviews: 0 });
  }

  for (const session of sessions) {
    const bucket = buckets.get(bucketKey(new Date(session.created_at)));
    if (bucket) bucket.sessions += 1;
  }
  for (const pageview of pageviews) {
    const bucket = buckets.get(bucketKey(new Date(pageview.occurred_at)));
    if (bucket) bucket.pageviews += 1;
  }

  return [...buckets.entries()].map(([date, bucket]) => ({ date, ...bucket }));
}

export function topEntries(values: (string | null)[], limit: number): { value: string; count: number }[] {
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

// Traffic source = referrer's hostname, falling back to "Direct" when there's
// no referrer at all (typed URL, bookmark, or a referrer the browser
// stripped). No UTM columns yet (see 0014's migration comment on lead_id),
// so this is the source signal available today.
export function trafficSource(referrer: string | null): string {
  if (!referrer) return "Direct";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "Direct";
  }
}
