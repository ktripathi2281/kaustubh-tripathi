import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Intro, { REVEAL } from "./components/Intro.jsx";
import { Horizon } from "./components/InkLine.jsx";
import { NumeralSeal, Title, VerticalLabel } from "./components/marks.jsx";
import { certificates, chronology, profile, projects } from "./data.js";
import { ja, numerals, titles } from "./ja.js";

const year = new Date().getFullYear();

function Ext({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

function Opening() {
  return (
    <section
      className="scene scene--opening"
      id="opening"
      tabIndex={-1}
      aria-labelledby="name"
      style={{ "--intro-reveal": `${REVEAL}ms` }}
    >
      <div className="above reveal">
        <div className="head">
          <VerticalLabel text={ja.works} />
          <div className="text">
            <p className="label">
              Selected works · {profile.since}–{year}
            </p>
            <Title as="h1" ja={titles.name} className="name" id="name">
              {profile.name}
            </Title>
            <p className="label">
              {profile.role} · {profile.location}
            </p>
            <p className="sentence">{profile.lede}</p>
          </div>
        </div>
      </div>
      <Horizon seed={101} />
      <div className="below reveal opening-below">
        <ul className="links">
          <li>
            <Ext href={profile.resume}>Résumé</Ext>
          </li>
          <li>
            <a href={`mailto:${profile.email}`}>Email</a>
          </li>
        </ul>
        <p className="label hint">
          Scroll <span aria-hidden="true">↓</span>
        </p>
      </div>
    </section>
  );
}

// The stack and three points, closed until asked for. A native disclosure, so
// it opens without JavaScript and screen readers announce it as expandable.
function Details({ project: p }) {
  return (
    <details className="more">
      <summary className="label">
        <span className="more-label">Details</span>
        <span className="visually-hidden">: {p.name}</span>
      </summary>
      <div className="more-body">
        <dl className="more-facts">
          <div>
            <dt className="label">Built with</dt>
            <dd>{p.stack}</dd>
          </div>
          {p.context && (
            <div>
              <dt className="label">Context</dt>
              <dd>{p.context}</dd>
            </div>
          )}
        </dl>
        <ul className="more-points">
          {p.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </details>
  );
}

function Work({ project: p, n }) {
  return (
    <section className="scene" id={p.id} tabIndex={-1} aria-labelledby={`${p.id}-name`}>
      <div className="above reveal">
        <p className="label">{p.type}</p>
        <Title as="h2" ja={titles[p.id]} className="title" id={`${p.id}-name`}>
          {p.name}
        </Title>
        <p className="summary">{p.summary}</p>
        {p.inProgress && (
          <p className="label status">
            <span className="ja-inline" lang="ja" aria-hidden="true">
              {ja.inProgress}
            </span>
            In progress
          </p>
        )}
        <Details project={p} />
      </div>
      <Horizon seed={211 + n * 37}>
        <NumeralSeal numeral={numerals[n]} />
      </Horizon>
      <div className="below reveal">
        <ul className="links">
          {p.links.map((l) => (
            <li key={l.label}>
              {l.internal ? (
                <a href={l.href}>
                  {l.label}
                  <span className="visually-hidden">: {p.name}</span>
                </a>
              ) : (
                <Ext href={l.href}>
                  {l.label}
                  <span className="visually-hidden">: {p.name}</span>
                </Ext>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Background() {
  return (
    <section className="scene" id="about" tabIndex={-1} aria-labelledby="about-title">
      <div className="above reveal">
        <div className="head">
          <VerticalLabel text={ja.background} />
          <div className="text">
            <h2 className="label" id="about-title">
              Background
            </h2>
            <dl className="rows">
              <div>
                <dt className="label">{certificates[0].issued.slice(-4)}</dt>
                <dd className="certs">
                  {certificates.map((c) => (
                    <Ext key={c.href} href={c.href}>
                      {c.title}
                    </Ext>
                  ))}
                </dd>
              </div>
              {chronology.map((c) => (
                <div key={c.year}>
                  <dt className="label">{c.year}</dt>
                  <dd>{c.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      <Horizon seed={977} />
      <div className="below reveal">
        <ul className="links">
          <li>
            <Ext href={profile.resume}>Résumé</Ext>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <a href="#opening" className="skip-link">
        Skip to the works
      </a>
      <Header />
      <main>
        <Opening />
        {projects.map((p, n) => (
          <Work key={p.id} project={p} n={n} />
        ))}
        <Background />
      </main>
      <Footer />
      <Intro />
    </>
  );
}
