import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite";

// Fills each page's <!--ssr:name--> placeholder with that page rendered by
// src/entry-server.jsx, so every page is readable before (or without) any
// JavaScript.
//
// In dev, the dev server loads the renderer. In a build, the renderer is
// first compiled on its own, as an SSR bundle in node_modules/.prerender,
// and loaded from there: no server, watcher or cache is left running to keep
// the build from exiting.
export default function prerender({ entry }) {
  let config;
  let server = null;
  let render = null;

  return {
    name: "prerender",
    configResolved(resolved) {
      config = resolved;
    },
    configureServer(dev) {
      server = dev;
    },
    async buildStart() {
      // The SSR build below runs this plugin too; it has nothing to prerender.
      if (config.command !== "build" || config.build.ssr) return;
      const input = resolve(config.root, entry.replace(/^\//, ""));
      const outDir = resolve(config.root, "node_modules/.prerender");
      await build({
        configFile: config.configFile,
        root: config.root,
        logLevel: "warn",
        build: { ssr: input, outDir, emptyOutDir: true, copyPublicDir: false, rollupOptions: { input } },
      });
      ({ render } = await import(pathToFileURL(resolve(outDir, "entry-server.js")).href));
    },
    transformIndexHtml: {
      order: "pre",
      async handler(html) {
        if (!html.includes("<!--ssr:")) return html;
        const renderPage = server ? (await server.ssrLoadModule(entry)).render : render;
        return html.replace(/<!--ssr:([\w/-]+)-->/g, (_, page) => renderPage(page));
      },
    },
  };
}
