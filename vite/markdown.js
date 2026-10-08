import { marked } from "marked";
import { parse } from "../src/lib/frontmatter.js";

// Essays are written in Markdown (content/essays/*.md) and turned into HTML
// here, at build time, so the browser never needs a Markdown parser.
// Importing an essay gives { meta, html, words }.
export default function markdown() {
  return {
    name: "essay-markdown",
    enforce: "pre",
    transform(source, id) {
      if (!id.endsWith(".md")) return null;
      const { meta, body } = parse(source);
      // Each file opens with its own title and italic subtitle so it reads well
      // on its own; the page sets those in its header instead.
      const text = body.replace(/^\s*#\s.+\n+\*[^\n]+\*\n/, "");
      const html = marked
        .parse(text)
        .replace(/<a href="(https?:)/g, '<a target="_blank" rel="noreferrer" href="$1');
      const words = text.split(/\s+/).filter(Boolean).length;
      return { code: `export default ${JSON.stringify({ meta, html, words })};`, map: null };
    },
  };
}
