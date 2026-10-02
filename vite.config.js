import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Each page is its own HTML entry, so essays get real URLs (/essays/kavach/).
// 404.html is what Vercel serves for any address that matches no file.
// cards.html (the link-preview images) is left out: it is a dev-only page.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        kavach: "essays/kavach/index.html",
        leetcode: "essays/leetcode/index.html",
        notfound: "404.html",
      },
    },
  },
});
