// Every essay in content/essays/, keyed by slug: /essays/<slug>/ reads <slug>.md.
const files = import.meta.glob("../../content/essays/*.md", { query: "?raw", import: "default", eager: true });

export const essaySources = Object.fromEntries(
  Object.entries(files).map(([file, source]) => [file.match(/([\w-]+)\.md$/)[1], source])
);
