import { StrictMode, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { drawHorizon } from "./art/landscape.js";
import { profile } from "./data.js";
import { parse } from "./lib/frontmatter.js";
import "./styles.css";
import "./cards.css";

// The link-preview images in public/og/, one per page, drawn with the footer's
// horizon. A dev-only page: run `npm run dev`, open /cards.html, and capture
// each card at 2× (Chrome DevTools: select a .share-card, "Capture node
// screenshot") as public/og/<id>.png.
const sources = import.meta.glob("../content/essays/*.md", { query: "?raw", import: "default", eager: true });
const essays = Object.entries(sources).map(([path, source]) => ({
  slug: path.match(/([\w-]+)\.md$/)[1],
  meta: parse(source).meta,
}));

function Landscape() {
  const canvas = useRef(null);
  useEffect(() => drawHorizon(canvas.current), []);
  return <canvas ref={canvas} className="card-horizon" aria-hidden="true" />;
}

function Card({ id, byline, children }) {
  return (
    <section className="share-card" id={`card-${id}`}>
      <div className="card-top">
        <span className="monogram">
          K<span>·</span>T
        </span>
        {byline && <span className="mono">{profile.name}</span>}
        <span className="mono card-url">{profile.site.replace(/^https?:\/\//, "")}</span>
      </div>
      {children}
      <Landscape />
    </section>
  );
}

function Cards() {
  return (
    <main className="cards">
      <Card id="home">
        <div className="card-home">
          <h1 className="card-name">
            <span>{profile.first}</span>
            <span className="card-last">{profile.last}</span>
          </h1>
          <dl className="card-facts">
            <div>
              <dt className="mono">Practice</dt>
              <dd>{profile.role}</dd>
            </div>
            <div>
              <dt className="mono">Based in</dt>
              <dd>{profile.location}, India</dd>
            </div>
            <div>
              <dt className="mono">Status</dt>
              <dd>{profile.availability}</dd>
            </div>
          </dl>
        </div>
      </Card>

      {essays.map(({ slug, meta }) => (
        <Card key={slug} id={slug} byline>
          <div className="card-essay">
            <p className="mono card-kicker">
              Essay {meta.number} · {meta.project}
            </p>
            <h1 className="card-title">{meta.title}</h1>
            <p className="card-sub">{meta.subtitle}</p>
          </div>
        </Card>
      ))}
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Cards />
  </StrictMode>
);
