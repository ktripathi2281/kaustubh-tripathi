import { renderToStaticMarkup } from "react-dom/server";
import App from "./App.jsx";
import EssayPage from "./components/EssayPage.jsx";
import NotFound from "./components/NotFound.jsx";

const essays = import.meta.glob("../content/essays/*.md", { eager: true, import: "default" });

// Renders each page to HTML at build time (and in dev), via vite/prerender.js.
// React runs only here: nothing on the pages needs it in the browser, so they
// ship as plain HTML, with src/page.js adding the motion.
export function render(page) {
  if (page === "home") return renderToStaticMarkup(<App />);
  if (page === "notfound") return renderToStaticMarkup(<NotFound />);
  const slug = page.match(/^essay\/([\w-]+)$/)?.[1];
  const essay = essays[`../content/essays/${slug}.md`];
  if (essay) return renderToStaticMarkup(<EssayPage essay={essay} slug={slug} />);
  throw new Error(`prerender: no page called "${page}"`);
}
