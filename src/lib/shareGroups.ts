export type ShareGroupLink = { label: string; url: string };

// Format entered in /admin/settings: one "Label | https://..." per line. A
// line with no "|" is kept as a URL-only entry with a generic label -- the
// admin field is plain text, not a structured form, so this stays forgiving
// of stray blank lines and missing labels rather than rejecting them.
export function parseShareGroupLinks(raw: string | null | undefined): ShareGroupLink[] {
  if (!raw) return [];

  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [first, ...rest] = line.split("|");
      const url = (rest.length ? rest.join("|") : first).trim();
      const label = rest.length ? first.trim() : `Group ${index + 1}`;
      return { label, url };
    })
    .filter((entry) => entry.url.length > 0);
}
