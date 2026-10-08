import { StrictMode, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import InkLine from "./components/InkLine.jsx";
import { NameSeal } from "./components/marks.jsx";
import { profile } from "./data.js";
import { parse } from "./lib/frontmatter.js";
import { drawRidges } from "./lib/stipple.js";
import "./styles.css";
import "./cards.css";

// The link-preview images in public/og/, one per page (1200×630): paper, the
// name, the ink line ending at the name seal, and the ridges under it.
// A dev-only page: with `npm run dev` running, `npm run cards` captures each
// card as public/og/<id>.png. /cards.html shows them all; ?card=<id> shows one.
const sources = import.meta.glob("../content/essays/*.md", { query: "?raw", import: "default", eager: true });
const essays = Object.entries(sources).map(([path, source]) => ({
  slug: path.match(/([\w-]+)\.md$/)[1],
  meta: parse(source).meta,
}));

function Ridges() {
  const canvas = useRef(null);
  useEffect(() => drawRidges(canvas.current), []);
  return (
    <div className="ridges card-ridges" aria-hidden="true">
      <canvas ref={canvas} />
    </div>
  );
}

function Card({ id, children }) {
  return (
    <section className="share-card" id={`card-${id}`}>
      <p className="label card-url">{profile.site.replace(/^https?:\/\//, "")}</p>
      <div className="card-text">{children}</div>
      <div className="level card-level">
        <InkLine seed={2281} layout="wide" end={78} />
        <NameSeal />
      </div>
      <Ridges />
    </section>
  );
}

function Cards() {
  const only = new URLSearchParams(location.search).get("card");
  const cards = [
    {
      id: "home",
      body: (
        <>
          <h1 className="card-name">{profile.name}</h1>
          <p className="label card-sub">
            {profile.role} · {profile.location}
          </p>
        </>
      ),
    },
    ...essays.map(({ slug, meta }) => ({
      id: slug,
      body: (
        <>
          <p className="label">
            Essay {meta.number} · {meta.project}
          </p>
          <h1 className="card-title">{meta.title}</h1>
          <p className="label card-sub">{profile.name}</p>
        </>
      ),
    })),
  ];

  return (
    <main className={`cards${only ? " cards--one" : ""}`}>
      {cards
        .filter((c) => !only || c.id === only)
        .map((c) => (
          <Card key={c.id} id={c.id}>
            {c.body}
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
