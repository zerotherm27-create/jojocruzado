// The one link Jojo reuses and hands to every client for the review form —
// a single shared secret, not a per-client token (confirmed with Jojo: one
// link for everyone, not individual one-time links). Override via env var
// if the default ever needs to be rotated (e.g. it leaks/gets shared
// publicly) without a code change.
export const TESTIMONIAL_SHARE_SLUG =
  process.env.TESTIMONIAL_SHARE_SLUG?.trim() || "share-8f2a1c9d4e7b3f61";
