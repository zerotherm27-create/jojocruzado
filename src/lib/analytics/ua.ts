import "server-only";
import { UAParser } from "ua-parser-js";
import { isBot as isKnownBot } from "ua-parser-js/bot-detection";

export type ParsedVisitor = {
  deviceType: "mobile" | "tablet" | "desktop" | "unknown";
  os: string | null;
  browser: string | null;
};

const DEVICE_TYPES = new Set(["mobile", "tablet", "desktop"]);

export function parseUserAgent(userAgent: string): ParsedVisitor {
  const { device, os, browser } = UAParser(userAgent);

  return {
    // ua-parser-js leaves device.type undefined for a plain desktop UA
    // (there's no "desktop" token to match) -- everything else it does
    // classify is mobile/tablet/wearable/etc., so undefined means desktop.
    deviceType: device.type
      ? DEVICE_TYPES.has(device.type)
        ? (device.type as "mobile" | "tablet" | "desktop")
        : "unknown"
      : "desktop",
    os: os.name ?? null,
    browser: browser.name ?? null,
  };
}

// Backstop only -- see src/app/api/site/visit/route.ts. Since visits are a
// JS-executed beacon rather than a server-log line or <img> pixel, most
// crawlers never call it at all; ua-parser-js/bot-detection's isBot() and a
// missing User-Agent catch the rest.
const CRAWLER_BACKSTOP = /bot|crawl|spider|slurp|curl|wget|headless|python-requests/i;

export function isBot(userAgent: string): boolean {
  return isKnownBot(userAgent) || CRAWLER_BACKSTOP.test(userAgent);
}
