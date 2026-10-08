import BlockDiagram from "./BlockDiagram.jsx";
import { Ext, Go, Sublabel, no } from "./Sheet.jsx";

// One project as one datasheet section. A project still in progress gets the
// compact form: no diagram and no application notes until it ships.
export default function Project({ project, n }) {
  const compact = project.status === "In progress";
  const params = project.status ? [...project.meta, ["Status", project.status]] : project.meta;
  const titleId = `${project.id}-title`;

  return (
    <section className={`grid span-12 project${compact ? " is-compact" : ""}`} id={project.id} aria-labelledby={titleId}>
      <div className="cell span-12 project-head">
        <p className="label">
          <span className="label-no">{no(n)}</span>
          <span>{project.kicker}</span>
        </p>
        <div className="project-intro">
          <h2 className="project-name" id={titleId}>
            {project.name}
          </h2>
          <p className="project-desc">{project.description}</p>
        </div>
      </div>

      {!compact && project.diagram && (
        <div className="cell span-8 project-diagram">
          <Sublabel>Block diagram</Sublabel>
          <BlockDiagram diagram={project.diagram} name={project.name} />
        </div>
      )}

      <div className="cell span-4 project-params">
        <Sublabel>Parameters</Sublabel>
        <table className="table params">
          <thead>
            <tr>
              <th scope="col">Parameter</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            {params.map(([k, v]) => (
              <tr key={k}>
                <th scope="row">{k}</th>
                <td>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`cell ${compact ? "span-6" : "span-5"} project-limits`}>
        <Sublabel>Failure modes</Sublabel>
        <dl className="limits">
          <div>
            <dt>What breaks</dt>
            <dd>{project.breaks}</dd>
          </div>
          <div className="limits-holds">
            <dt>What holds</dt>
            <dd>{project.holds}</dd>
          </div>
        </dl>
      </div>

      {!compact && project.notes && (
        <div className="cell span-5 project-notes">
          <Sublabel>Application notes</Sublabel>
          <ol className="ruled-list">
            {project.notes.map((note, i) => (
              <li key={note}>
                <span className="ruled-no" aria-hidden="true">
                  {no(i + 1)}
                </span>
                <span>{note}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="cell span-2 project-links">
        <Sublabel>Links</Sublabel>
        <ul className="link-list">
          {project.links.map((l) => {
            const text = (
              <>
                {l.label}
                <span className="visually-hidden">, {project.name}</span>
              </>
            );
            return <li key={l.href}>{l.internal ? <Go href={l.href}>{text}</Go> : <Ext href={l.href}>{text}</Ext>}</li>;
          })}
        </ul>
      </div>
    </section>
  );
}
