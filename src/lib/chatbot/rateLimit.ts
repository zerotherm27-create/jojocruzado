/* In-memory sliding-window limiter for the public, unauthenticated /api/chat
   endpoint, which calls a paid API. Best-effort, not a hard global cap: a
   serverless deployment can run multiple instances that don't share this Map,
   so a determined abuser could exceed the nominal limit. Proportionate for
   this site's traffic (a single advisor's personal site, not a product with
   real abuse pressure) — if that changes, swap for a Redis-backed limiter
   (e.g. @upstash/ratelimit) rather than adding complexity here now. */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 15;

const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (bucket.count >= MAX_PER_WINDOW) {
    return false;
  }

  bucket.count += 1;
  return true;
}
