// Production build: the client bundle, then every page rendered to static HTML
// so crawlers and link previews see the content before any JavaScript runs.
// The client then hydrates the same markup.
import { build } from "vite";
import { readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

process.env.BUILD_DATE ||= new Date().toISOString().slice(0, 10);

const out = path.resolve("dist");
const ssrOut = path.resolve(".prerender");

await build();
await build({
  logLevel: "warn",
  build: { ssr: "src/entry-server.jsx", outDir: ssrOut, emptyOutDir: true, copyPublicDir: false },
});

const { pages } = await import(pathToFileURL(path.join(ssrOut, "entry-server.js")).href);

// Preload the two faces the first screen is set in, so the swap from the
// fallback happens before most visitors see it.
const assets = await readdir(path.join(out, "assets"));
const preload = assets
  .filter((f) => /^inter-tight-latin-(400|700)-normal-.*\.woff2$/.test(f))
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join("\n    ");

for (const [file, render] of Object.entries(pages)) {
  const target = path.join(out, file);
  const html = await readFile(target, "utf8");
  if (!html.includes('<div id="root"></div>')) throw new Error(`${file}: no empty #root to fill`);
  const filled = html
    .replace('<div id="root"></div>', () => `<div id="root">${render()}</div>`)
    .replace("</head>", () => `  ${preload}\n  </head>`);
  await writeFile(target, filled);
  console.log(`prerendered ${file}`);
}

await rm(ssrOut, { recursive: true, force: true });
