import { marked } from "marked";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import BlockDiagram from "./BlockDiagram.jsx";
import { Go, Label, Sublabel } from "./Sheet.jsx";
import { noteNumber, projects } from "../data.js";
import { parse } from "../lib/frontmatter.js";

// An essay set out as an application note: title block, the project's block
// diagram, then the text, its headings numbered like the home page's sections.
export default function EssayPage({ slug, source }) {
  const { meta, body } = parse(source);
  // The file opens with its own title and subtitle so it reads well on its
  // own; the page sets those in the title block instead.
  const text = body.replace(/^\s*#\s.+\n+\*[^\n]+\*\n/, "");
  const html = marked
    .parse(text)
    .replace(/<a href="(https?:)/g, '<a target="_blank" rel="noreferrer" href="$1');
  const minutes = Math.max(1, Math.round(text.split(/\s+/).length / 230));
  // The essay's project: named in its front matter, or the same as its slug.
  const project = projects.find((p) => p.id === (meta.plate || slug));
  const draft = /^draft/i.test(meta.status || "");

  const facts = [
    ["Note", noteNumber(slug)],
    project && ["Project", <a href={`/#${project.id}`}>{project.name}</a>],
    meta.with && ["With", meta.with],
    ["Reading time", `${minutes} min`],
    draft && ["Status", "Draft"],
  ].filter(Boolean);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="page">
        <div className="sheet">
          <Header home={false} />

          <main id="main" className="grid">
            <article className="grid span-12 essay" aria-labelledby="essay-title">
              <header className="cell span-8 essay-title">
                <Label n={noteNumber(slug)} as="p">
                  Application note · {meta.project}
                </Label>
                <h1 id="essay-title">{meta.title}</h1>
                {meta.subtitle && <p className="essay-sub">{meta.subtitle}</p>}
              </header>

              <div className="cell span-4 essay-facts">
                <Sublabel as="p">Parameters</Sublabel>
                <table className="table params">
                  <tbody>
                    {facts.map(([k, v]) => (
                      <tr key={k}>
                        <th scope="row">{k}</th>
                        <td>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {project?.diagram && (
                <div className="cell span-12 essay-diagram">
                  <Sublabel as="p">Block diagram · {project.name}</Sublabel>
                  <BlockDiagram diagram={project.diagram} name={project.name} />
                </div>
              )}

              <div className="cell span-12">
                <div className="essay-body" dangerouslySetInnerHTML={{ __html: html }} />
              </div>

              <footer className="cell span-12 essay-end">
                {project && <Go href={`/#${project.id}`}>{project.name} on the datasheet</Go>}
                <Go href="/#notes">All application notes</Go>
              </footer>
            </article>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}
