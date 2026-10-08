import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { noteNumber, profile, projects } from "./data.js";
import { essaySources } from "./lib/essays.js";
import { parse } from "./lib/frontmatter.js";
import "./styles.css";
import "./cards.css";

// The link-preview images in public/og/, one per page, set as small datasheets.
// A dev-only page: run `npm run dev`, open /cards.html (or /cards.html?card=home
// for one card on its own), and capture each 1200×630 card as public/og/<id>.png.
const essays = Object.entries(essaySources).map(([slug, source]) => ({ slug, meta: parse(source).meta }));
const domain = profile.site.replace(/^https?:\/\//, "");

function Card({ id, children }) {
  return (
    <section className="share-card" id={`card-${id}`}>
      <div className="card-sheet">
        <p className="card-strip">
          <span>{profile.name}</span>
          <span>{domain}</span>
        </p>
        {children}
      </div>
    </section>
  );
}

function Home() {
  return (
    <Card id="home">
      <div className="card-row card-title">
        <h1 className="card-name">{profile.name}</h1>
        <p className="card-role">
          {profile.role}
          <br />
          {profile.location}
        </p>
      </div>
      <p className="card-row card-lede">{profile.lede}</p>
      <ol className="card-row card-works">
        {projects.map((p, i) => (
          <li key={p.id}>
            <span>{String(i + 3).padStart(2, "0")}</span> {p.name}
          </li>
        ))}
      </ol>
    </Card>
  );
}

function Essay({ slug, meta }) {
  return (
    <Card id={slug}>
      <div className="card-row card-essay">
        <p className="card-label">
          <span>{noteNumber(slug)}</span>
          <span>Application note · {meta.project}</span>
        </p>
        <h1 className="card-essay-title">{meta.title}</h1>
        <p className="card-sub">{meta.subtitle}</p>
      </div>
    </Card>
  );
}

function Cards() {
  const only = new URLSearchParams(window.location.search).get("card");
  const show = (id) => !only || only === id;
  return (
    <main className={`cards${only ? " cards--one" : ""}`}>
      {show("home") && <Home />}
      {essays.filter((e) => show(e.slug)).map((e) => <Essay key={e.slug} {...e} />)}
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Cards />
  </StrictMode>
);
