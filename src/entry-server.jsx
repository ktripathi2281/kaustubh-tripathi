import { renderToString } from "react-dom/server";
import App from "./App.jsx";
import EssayPage from "./components/EssayPage.jsx";
import NotFoundPage from "./components/NotFoundPage.jsx";
import { essaySources } from "./lib/essays.js";

// Each built HTML file (relative to dist/) and the markup to fill its #root.
export const pages = {
  "index.html": () => renderToString(<App />),
  "404.html": () => renderToString(<NotFoundPage />),
  ...Object.fromEntries(
    Object.entries(essaySources).map(([slug, source]) => [
      `essays/${slug}/index.html`,
      () => renderToString(<EssayPage slug={slug} source={source} />),
    ])
  ),
};
