import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import markdown from "./vite/markdown.js";
import prerender from "./vite/prerender.js";

// Each page is its own HTML entry, so essays get real URLs (/essays/kavach/).
// 404.html is what Vercel serves for any address that matches no file.
// cards.html (the link-preview images) is left out: it is a dev-only page.
export default defineConfig({
  plugins: [react(), markdown(), prerender({ entry: "/src/entry-server.jsx" })],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        kavach: "essays/kavach/index.html",
        deepresearch: "essays/deepresearch/index.html",
        loopdetector: "essays/loopdetector/index.html",
        leetcode: "essays/leetcode/index.html",
        tollgate: "essays/tollgate/index.html",
        rideradar: "essays/rideradar/index.html",
        skillbarter: "essays/skillbarter/index.html",
        notfound: "404.html",
      },
    },
  },
});
