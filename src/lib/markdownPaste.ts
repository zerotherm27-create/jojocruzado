// Converts a small, deliberately limited subset of markdown (matching exactly
// what the RichTextEditor toolbar and its sanitizeBody() allowlist support:
// h2/h3, bold, italic, links, bullet/numbered lists, blockquotes) into HTML.
// Used only for pasted plain text -- Tiptap's own input rules already handle
// this syntax when typed live, but paste bypasses input rules entirely, so
// without this, pasted "## Heading" or "* item" text stays as literal
// characters instead of becoming real formatting.
// Escaping quotes matters here specifically because inline() later inserts a
// captured URL straight into an href="..." attribute -- without this, a
// literal " in pasted text could break out of that attribute.
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function inline(text: string): string {
  let html = escapeHtml(text);
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/(?:^|(?<=\s))\*([^*\s][^*]*?)\*(?=\s|$)/g, "<em>$1</em>");
  html = html.replace(/(?:^|(?<=\s))_([^_\s][^_]*?)_(?=\s|$)/g, "<em>$1</em>");
  return html;
}

export function markdownLinesToHtml(text: string): string {
  const lines = text.split(/\r?\n/);
  const out: string[] = [];
  let listTag: "ul" | "ol" | null = null;

  function closeList() {
    if (listTag) {
      out.push(`</${listTag}>`);
      listTag = null;
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      closeList();
      continue;
    }

    const h3 = line.match(/^###\s+(.*)/);
    const h2 = !h3 && line.match(/^##\s+(.*)/);
    const quote = line.match(/^>\s+(.*)/);
    const bullet = line.match(/^[*-]\s+(.*)/);
    const numbered = line.match(/^\d+[.)]\s+(.*)/);

    if (h3) {
      closeList();
      out.push(`<h3>${inline(h3[1])}</h3>`);
    } else if (h2) {
      closeList();
      out.push(`<h2>${inline(h2[1])}</h2>`);
    } else if (quote) {
      closeList();
      out.push(`<blockquote><p>${inline(quote[1])}</p></blockquote>`);
    } else if (bullet) {
      if (listTag !== "ul") {
        closeList();
        out.push("<ul>");
        listTag = "ul";
      }
      out.push(`<li>${inline(bullet[1])}</li>`);
    } else if (numbered) {
      if (listTag !== "ol") {
        closeList();
        out.push("<ol>");
        listTag = "ol";
      }
      out.push(`<li>${inline(numbered[1])}</li>`);
    } else {
      closeList();
      out.push(`<p>${inline(line)}</p>`);
    }
  }
  closeList();

  return out.join("");
}
