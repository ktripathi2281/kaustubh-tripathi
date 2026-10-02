import { marked } from "marked";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Letter from "./Letter.jsx";
import { plateArt } from "../art/plates.jsx";
import { profile, projects } from "../data.js";

// Split "---\nkey: value\n---\nbody" into its fields and the markdown body.
function parse(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: source };
  const meta = Object.fromEntries(
    match[1]
      .split("\n")
      .map((line) => line.match(/^(\w+):\s*(.*)$/))
      .filter(Boolean)
      .map(([, k, v]) => [k, v.trim()])
  );
  return { meta, body: match[2] };
}

export default function EssayPage({ source, plate }) {
  const { meta, body } = parse(source.replace(/\r\n/g, "\n"));
  // The file opens with its own title and subtitle so it reads well on its
  // own; the page sets those in the header instead.
  const text = body.replace(/^\s*#\s.+\n+\*[^\n]+\*\n/, "");
  const html = marked
    .parse(text)
    .replace(/<a href="(https?:)/g, '<a target="_blank" rel="noreferrer" href="$1');
  const minutes = Math.max(1, Math.round(text.split(/\s+/).length / 230));
  // The essay's plate: named in its front matter, or the same as its slug.
  const plateId = meta.plate || plate;
  const project = projects.find((p) => p.id === plateId);
  const Art = plateArt[plateId];

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header plates={projects} email={profile.email} home={false} />

      <main id="main">
        <article className="essay" aria-labelledby="essay-title">
          <header className="essay-head">
            <p className="mono essay-kicker">
              Essay {meta.number} · {meta.project}
            </p>
            <h1 id="essay-title">{meta.title}</h1>
            {meta.subtitle && <p className="essay-sub">{meta.subtitle}</p>}
            <p className="mono essay-meta">
              {meta.with && <>With {meta.with} · </>}
              {minutes} min read
              {/^draft/i.test(meta.status || "") && <span className="essay-draft">Draft</span>}
            </p>
          </header>

          {Art && project && (
            <div className="essay-plate">
              <Art
                caption={
                  <>
                    <span className="mono">Plate {project.plate}.</span> {project.name}, from the catalogue. Hover over
                    or tap any line to read it.
                  </>
                }
              />
            </div>
          )}

          <div className="essay-body" dangerouslySetInnerHTML={{ __html: html }} />

          <footer className="essay-end">
            <a href={`/#${plateId}`}>Plate {project?.plate} in the catalogue</a>
            <a href="/">Return to the catalogue ↩</a>
          </footer>
        </article>
      </main>

      <Footer home={false} />
      <Letter />
    </>
  );
}
