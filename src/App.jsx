import { useEffect } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Letter from "./components/Letter.jsx";
import Seal from "./art/Seal.jsx";
import { ModelContained, plateArt } from "./art/plates.jsx";
import { profile, frontispiece, statement, certificates, projects, chronology, materials } from "./data.js";

const year = new Date().getFullYear();

function Ext({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
      <span className="arrow" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}

function SectionHead({ index, kicker, title }) {
  return (
    <header className="section-head">
      <p className="section-index">
        <span>§ {index}</span>
        {kicker}
      </p>
      <h2>{title}</h2>
    </header>
  );
}

// A credential set out like a certificate: seal, name, and the particulars.
function Certificate({ cert }) {
  return (
    <article className="certificate" aria-labelledby={`cert-${cert.id}`}>
      <Seal
        id={cert.id}
        inscription={cert.inscription}
        badge={cert.badge}
        pattern={cert.pattern}
        label={`Seal for ${cert.title}, ${cert.level}: a generated guilloche band around the official badge.`}
      />
      <p className="cert-no mono">Credential {cert.numeral}</p>
      <h3 className="cert-name" id={`cert-${cert.id}`}>
        {cert.title}
      </h3>
      <p className="cert-level">{cert.level}</p>
      <p className="cert-desc">{cert.description}</p>
      <dl className="cert-meta">
        <div>
          <dt className="mono">Issued</dt>
          <dd>{cert.issued}</dd>
        </div>
        <div>
          <dt className="mono">Valid until</dt>
          <dd>{cert.validThrough}</dd>
        </div>
        <div>
          <dt className="mono">Assessment</dt>
          <dd>Proctored exam</dd>
        </div>
        <div>
          <dt className="mono">Covers</dt>
          <dd>{cert.covers}</dd>
        </div>
      </dl>
      <p className="cert-verify">
        <Ext href={cert.href}>Verify on Credly</Ext>
      </p>
    </article>
  );
}

function Plate({ project, flip }) {
  const Art = plateArt[project.id];
  return (
    <article className={`plate${flip ? " plate--flip" : ""}`} id={project.id}>
      <div className="plate-art">
        <Art
          caption={
            <>
              <span className="mono">On the drawing.</span> {project.drawing}
            </>
          }
        />
      </div>

      <div className="plate-label">
        <p className="plate-no mono">Plate {project.plate}</p>
        <h3 className="plate-title">{project.name}</h3>
        <p className="plate-kicker">{project.kicker}</p>

        <dl className="plate-meta">
          {project.meta.map(([k, v]) => (
            <div key={k}>
              <dt className="mono">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>

        <p className="plate-desc">{project.description}</p>

        <ol className="plate-notes">
          {project.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ol>

        <p className="plate-links">
          {project.links.map((l) =>
            l.internal ? (
              <a key={l.href} href={l.href}>
                {l.label}
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </a>
            ) : (
              <Ext key={l.href} href={l.href}>
                {l.label}
              </Ext>
            )
          )}
        </p>
      </div>
    </article>
  );
}

// Arriving from another page at /#section: the browser looks for the section
// before React has drawn it, so jump once it exists, and again once the fonts
// have settled the layout.
function useArrivalAnchor() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const jump = () => {
      const el = document.getElementById(id);
      if (!el) return;
      const root = document.documentElement;
      root.style.scrollBehavior = "auto";
      el.scrollIntoView({ block: "start" });
      root.style.scrollBehavior = "";
    };
    jump();
    document.fonts?.ready.then(jump);
  }, []);
}

export default function App() {
  useArrivalAnchor();

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header plates={projects} email={profile.email} />

      <main id="main">
        {/* Frontispiece */}
        <section className="hero" id="top" aria-labelledby="hero-name">
          <div className="hero-text">
            <p className="hero-kicker mono">Selected works · 2024 – {year}</p>
            <h1 id="hero-name">
              <span>{profile.first}</span>
              <span className="hero-last">{profile.last}</span>
            </h1>
            <p className="lede">{profile.lede}</p>
            <dl className="hero-facts">
              <div>
                <dt className="mono">Practice</dt>
                <dd>{profile.role}</dd>
              </div>
              <div>
                <dt className="mono">Based in</dt>
                <dd>{profile.location}, India</dd>
              </div>
              <div>
                <dt className="mono">Currently</dt>
                <dd>Product Engineer, TCS</dd>
              </div>
              <div>
                <dt className="mono">Status</dt>
                <dd>
                  <span className="status-dot" aria-hidden="true" />
                  {profile.availability}
                </dd>
              </div>
            </dl>
          </div>

          <div className="hero-art">
            <ModelContained
              caption={
                <>
                  <span className="mono hero-plate-title">
                    {frontispiece.plate} · <em>{frontispiece.title}</em>
                  </span>
                  {frontispiece.caption} <span className="hint">{frontispiece.hint}</span>
                </>
              }
            />
          </div>
        </section>

        {/* Plates */}
        <section className="section" id="plates" aria-labelledby="plates-title">
          <SectionHead index="1" kicker="Selected work" title={<span id="plates-title">Plates</span>} />
          <div className="plates">
            {projects.map((p, i) => (
              <Plate key={p.id} project={p} flip={i % 2 === 1} />
            ))}
          </div>
        </section>

        {/* Statement */}
        <section className="section" id="statement" aria-labelledby="statement-title">
          <SectionHead index="2" kicker="In my own words" title={<span id="statement-title">Statement</span>} />
          <div className="statement">
            <blockquote className="pull">
              <p>{statement.pull}</p>
            </blockquote>
            <div className="statement-body">
              <picture className="portrait">
                <source srcSet="/images/portrait.webp" type="image/webp" />
                <img src="/images/portrait.jpg" alt={`Portrait of ${profile.name}`} width="420" height="420" loading="lazy" />
              </picture>
              <div className="prose">
                {statement.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Certificates */}
        <section className="section" id="certificates" aria-labelledby="certificates-title">
          <SectionHead index="3" kicker="Verified by Anthropic" title={<span id="certificates-title">Certificates</span>} />
          <p className="section-lead">{certificates.lead}</p>
          <div className="certificates">
            {certificates.items.map((c) => (
              <Certificate key={c.id} cert={c} />
            ))}
          </div>
        </section>

        {/* Chronology */}
        <section className="section" id="chronology" aria-labelledby="chronology-title">
          <SectionHead index="4" kicker="Experience & education" title={<span id="chronology-title">Chronology</span>} />
          <ol className="chronology">
            {chronology.map((c) => (
              <li key={c.year} className="chron-row">
                <p className="chron-year">{c.year}</p>
                <ul className="chron-entries">
                  {c.entries.map((e) => (
                    <li key={e.text}>
                      <p className="chron-text">{e.text}</p>
                      {e.detail && <p className="chron-detail">{e.detail}</p>}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <div className="materials">
            <h3 className="mono">Materials &amp; methods</h3>
            <dl>
              {materials.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Enquiries */}
        <section className="section enquiries" id="enquiries" aria-labelledby="enquiries-title">
          <SectionHead index="5" kicker="Roles, collaborations, conversations" title={<span id="enquiries-title">Enquiries</span>} />
          <p className="enq-lead">
            For software or AI engineering roles, or a conversation about backend systems, LLMs and agents, write to
          </p>
          <a className="enq-email" href={`mailto:${profile.email}`} data-letter>
            {profile.email}
          </a>
          <ul className="enq-links">
            <li>
              <Ext href={profile.linkedin}>LinkedIn</Ext>
            </li>
            <li>
              <Ext href={profile.github}>GitHub</Ext>
            </li>
            <li>
              <Ext href={profile.resume}>Résumé, PDF</Ext>
            </li>
          </ul>
        </section>
      </main>

      <Footer />
      <Letter />
    </>
  );
}
