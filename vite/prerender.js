import { createServer } from "vite";

// Fills each page's <!--ssr:name--> placeholder with that page rendered by
// src/entry-server.jsx, so every page is readable before (or without) any
// JavaScript. Dev uses the running dev server; a build starts a private one
// just to load the renderer, and closes it when the build is done.
export default function prerender({ entry }) {
  let server = null;
  let own = false;

  return {
    name: "prerender",
    configureServer(dev) {
      server = dev;
    },
    transformIndexHtml: {
      order: "pre",
      async handler(html) {
        if (!html.includes("<!--ssr:")) return html;
        if (!server) {
          // No file watcher and no dependency scan: either keeps the process
          // alive after the build, and a build needs neither.
          server = await createServer({
            server: { middlewareMode: true, hmr: false, ws: false, watch: null },
            optimizeDeps: { noDiscovery: true, include: [] },
            appType: "custom",
            logLevel: "error",
          });
          own = true;
        }
        const { render } = await server.ssrLoadModule(entry);
        return html.replace(/<!--ssr:([\w/-]+)-->/g, (_, page) => render(page));
      },
    },
    async closeBundle() {
      if (own) await server.close();
      server = null;
      own = false;
    },
  };
}
