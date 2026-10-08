import { useEffect } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Letter from "./components/Letter.jsx";
import Project from "./components/Project.jsx";
import { BUILD_DATE, Ext, Label, NotesList, WorksTable } from "./components/Sheet.jsx";
import { profile, statement, certificates, projects, chronology, materials } from "./data.js";

// Projects start at section 03, after the description and the works table.
const FIRST_PROJECT = 3;
const after = FIRST_PROJECT + projects.length;

// Arriving at /#section: jump again once the fonts have settled the layout,
// so the section lands at the top even if the text above it reflowed.
function useArrivalAnchor() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    document.fonts?.ready.then(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const root = document.documentElement;
      root.style.scrollBehavior = "auto";
      el.scrollIntoView({ block: "start" });
      root.style.scrollBehavior = "";
    });
  }, []);
}

export default function App() {
  useArrivalAnchor();

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="page">
        <div className="sheet" id="top">
          <Header />

          <main id="main" className="grid">
            {/* Title block */}
            <div className="grid span-12 titleblock">
              <div className="cell span-6 tb-name">
                <h1 className="name">{profile.name}</h1>
              </div>
              <div className="cell span-4 tb-role">
                <p className="mono">
                  {profile.role} · {profile.location}
                </p>
              </div>
              <div className="cell span-2 tb-rev">
                <p className="mono">
                  <span className="tb-key">Rev</span> <time dateTime={BUILD_DATE}>{BUILD_DATE}</time>
                </p>
                <p className="mono">
                  <Ext href={profile.resume}>Résumé</Ext>
                </p>
              </div>
            </div>

            {/* 01 */}
            <section className="cell span-6 description" aria-labelledby="description-title">
              <Label n={1} id="description-title">
                General description
              </Label>
              <p className="lede">{profile.lede}</p>
              <p className="mono availability">{profile.availability}</p>
              <ul className="contact-links">
                <li>
                  <a href={`mailto:${profile.email}`}>Email</a>
                </li>
                <li>
                  <Ext href={profile.github}>GitHub</Ext>
                </li>
                <li>
                  <Ext href={profile.linkedin}>LinkedIn</Ext>
                </li>
                <li>
                  <Ext href={profile.resume}>Résumé</Ext>
                </li>
              </ul>
            </section>

            {/* 02 */}
            <section className="cell span-6" id="work" aria-labelledby="work-title">
              <span id="plates" />
              <Label n={2} id="work-title">
                Selected works
              </Label>
              <WorksTable projects={projects} first={FIRST_PROJECT} />
            </section>

            {/* 03 to 09 */}
            {projects.map((p, i) => (
              <Project key={p.id} project={p} n={FIRST_PROJECT + i} />
            ))}

            {/* 10 */}
            <section className="cell span-12" id="statement" aria-labelledby="statement-title">
              <Label n={after} id="statement-title">
                Operating principle
              </Label>
              <p className="lede pull">{statement.pull}</p>
              <div className="prose">
                {statement.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>

            {/* 11 */}
            <section className="cell span-12" id="certificates" aria-labelledby="certificates-title">
              <Label n={after + 1} id="certificates-title">
                Certifications
              </Label>
              <p className="prose section-lead">{certificates.lead}</p>
              <table className="table certs stack-sm">
                <thead>
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Level</th>
                    <th scope="col">Issued</th>
                    <th scope="col">Valid through</th>
                    <th scope="col">Verify</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.items.map((c) => (
                    <tr key={c.id}>
                      <th scope="row" data-label="Title">
                        {c.title}
                      </th>
                      <td data-label="Level">{c.level}</td>
                      <td data-label="Issued">{c.issued}</td>
                      <td data-label="Valid through">{c.validThrough}</td>
                      <td data-label="Verify">
                        <Ext href={c.href}>
                          Credly<span className="visually-hidden">, {c.title}</span>
                        </Ext>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* 12 */}
            <section className="cell span-12" id="specifications" aria-labelledby="specifications-title">
              <Label n={after + 2} id="specifications-title">
                Specifications
              </Label>
              <table className="table specs">
                <tbody>
                  {materials.map(([k, v]) => (
                    <tr key={k}>
                      <th scope="row">{k}</th>
                      <td>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* 13 */}
            <section className="cell span-12" id="chronology" aria-labelledby="chronology-title">
              <Label n={after + 3} id="chronology-title">
                Revision history
              </Label>
              <table className="table history">
                <thead>
                  <tr>
                    <th scope="col">Year</th>
                    <th scope="col">Entry</th>
                  </tr>
                </thead>
                <tbody>
                  {chronology.flatMap((c) =>
                    c.entries.map((e, i) => (
                      <tr key={e.text}>
                        <th scope="row">{i === 0 ? c.year : ""}</th>
                        <td>
                          <p className="history-entry">{e.text}</p>
                          {e.detail && <p className="history-detail">{e.detail}</p>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>

            {/* 14 */}
            <section className="cell span-12" id="notes" aria-labelledby="notes-title">
              <Label n={after + 4} id="notes-title">
                Application notes
              </Label>
              <NotesList />
            </section>

            {/* 15 */}
            <section className="cell span-12" id="contact" aria-labelledby="contact-title">
              <span id="enquiries" />
              <Label n={after + 5} id="contact-title">
                Contact
              </Label>
              <div className="contact">
                <div className="contact-side">
                  <p className="prose">
                    For software or AI engineering roles, or a conversation about backend systems, LLMs and agents, write
                    to
                  </p>
                  <p className="contact-email">
                    <a href={`mailto:${profile.email}`}>{profile.email}</a>
                  </p>
                </div>
                <Letter />
              </div>
            </section>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}
