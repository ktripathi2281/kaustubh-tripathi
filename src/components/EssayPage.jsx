import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { projects } from "../data.js";

// `essay` comes from content/essays/<slug>.md, turned into HTML at build
// time by vite/markdown.js.
export default function EssayPage({ essay, slug }) {
  const { meta, html, words } = essay;
  const minutes = Math.max(1, Math.round(words / 230));
  const project = projects.find((p) => p.id === (meta.plate || slug));

  return (
    <>
      <a href="#essay" className="skip-link">
        Skip to the essay
      </a>
      <Header home={false} />

      <main className="essay" id="essay">
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
              {/^draft/i.test(meta.status || "") && <> · Draft</>}
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
