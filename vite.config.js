import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Each page is its own HTML entry, so essays get real URLs (/essays/kavach/).
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        kavach: "essays/kavach/index.html",
      },
    },
  },
});
