import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Plate from "./Plates.jsx";
import { projects } from "../data.js";

// `essay` comes from content/essays/<slug>.md, turned into HTML at build
// time by vite/markdown.js. Behind its opening, very light, is the drawing
// for its project (components/Plates.jsx).
export default function EssayPage({ essay, slug }) {
  const { meta, html, words } = essay;
  const minutes = Math.max(1, Math.round(words / 230));
  const id = meta.plate || slug;
  const project = projects.find((p) => p.id === id);

  return (
    <>
      <a href="#essay" className="skip-link">
        Skip to the essay
      </a>
      <Header home={false} />

      <main className="essay" id="essay">
        <Plate id={id} />
        <article aria-labelledby="essay-title">
          <header className="essay-head">
            <p className="label">
              Essay {meta.number} · {meta.project}
            </p>
            <h1 id="essay-title">{meta.title}</h1>
            {meta.subtitle && <p className="essay-sub">{meta.subtitle}</p>}
            <p className="label">
              {meta.with && <>With {meta.with} · </>}
              {minutes} min read
              {meta.status && <> · {meta.status}</>}
            </p>
          </header>

          <div className="essay-body" dangerouslySetInnerHTML={{ __html: html }} />

          <footer className="essay-end">
            <a href="/">Back to the works</a>
            {project && <a href={`/#${project.id}`}>{project.name}, in the works</a>}
          </footer>
        </article>
      </main>
      <Footer home={false} />
    </>
  );
}
