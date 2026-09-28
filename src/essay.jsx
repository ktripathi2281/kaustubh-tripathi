import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import EssayPage from "./components/EssayPage.jsx";
import "./styles.css";

// Every essay page loads this script; the address says which essay it is:
// /essays/<slug>/ reads content/essays/<slug>.md.
const essays = import.meta.glob("../content/essays/*.md", { query: "?raw", import: "default", eager: true });
const slug = window.location.pathname.split("/").filter(Boolean)[1] ?? "";
const source = essays[`../content/essays/${slug}.md`];

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {source ? (
      <EssayPage source={source} plate={slug} />
    ) : (
      <main id="main" className="essay-head">
        <p className="mono essay-kicker">Not found</p>
        <h1>No essay here</h1>
        <p className="essay-sub">
          <a href="/">Return to the catalogue</a>
        </p>
      </main>
    )}
  </StrictMode>
);
