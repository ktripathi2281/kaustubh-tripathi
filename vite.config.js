import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The build date shown as the sheet's revision. scripts/build.js sets it once,
// so the client bundle and the prerendered HTML always agree.
const buildDate = process.env.BUILD_DATE || new Date().toISOString().slice(0, 10);

// Each page is its own HTML entry, so essays get real URLs (/essays/kavach/).
// 404.html is what Vercel serves for any address that matches no file.
// cards.html (the link-preview images) is left out: it is a dev-only page.
// The SSR build (scripts/build.js) renders the same pages to static HTML.
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  define: {
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
  build: isSsrBuild
    ? {}
    : {
        rollupOptions: {
          input: {
            main: "index.html",
            kavach: "essays/kavach/index.html",
            leetcode: "essays/leetcode/index.html",
            notfound: "404.html",
          },
        },
      },
}));
