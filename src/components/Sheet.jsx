import { essays, noteNumber } from "../data.js";

// Set at build time (vite.config.js), so every page shows the same revision.
export const BUILD_DATE = __BUILD_DATE__;

// Two-digit section numbers: 1 → "01".
export const no = (n) => String(n).padStart(2, "0");

// The numbered mono label every section starts with, ruled underneath.
export function Label({ n, as: Tag = "h2", id, children }) {
  return (
    <Tag className="label" id={id}>
      {n != null && <span className="label-no">{typeof n === "number" ? no(n) : n}</span>}
      <span>{children}</span>
    </Tag>
  );
}

// A smaller label for a cell inside a section.
export function Sublabel({ as: Tag = "h3", children }) {
  return <Tag className="sublabel">{children}</Tag>;
}

export function Ext({ href, className, children }) {
  return (
    <a href={href} className={className} target="_blank" rel="noreferrer">
      {children}
      <span className="arrow" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}

export function Go({ href, className, children }) {
  return (
    <a href={href} className={className}>
      {children}
      <span className="arrow" aria-hidden="true">
        →
      </span>
    </a>
  );
}

// No. / Name / Type for every project, each row leading to its section.
export function WorksTable({ projects, first, base = "" }) {
  return (
    <table className="table works">
      <thead>
        <tr>
          <th scope="col">No.</th>
          <th scope="col">Name</th>
          <th scope="col">Type</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((p, i) => (
          <tr key={p.id}>
            <td className="works-no">{no(first + i)}</td>
            <td>
              <a href={`${base}#${p.id}`} className="works-link">
                {p.name}
              </a>
            </td>
            <td>{p.kicker}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// The essays, numbered as application notes.
export function NotesList() {
  return (
    <ol className="notes-list">
      {essays.map((e) => (
        <li key={e.slug}>
          <a href={`/essays/${e.slug}/`}>
            <span className="notes-no">{noteNumber(e.slug)}</span>
            <span className="notes-title">{e.title}</span>
            <span className="arrow" aria-hidden="true">
              →
            </span>
          </a>
        </li>
      ))}
    </ol>
  );
}
