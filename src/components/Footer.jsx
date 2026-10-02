import Horizon from "../art/Horizon.jsx";
import { profile, projects, essays } from "../data.js";

const year = new Date().getFullYear();

function Icon({ name }) {
  if (name === "github") {
    return (
      <svg viewBox="0 0 16 16" width="19" height="19" aria-hidden="true">
        <path
          fill="currentColor"
          d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
        />
      </svg>
    );
  }
  if (name === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2.5" />
        <path d="M8 10.5V17M12 17v-6.5M12 13.3c0-1.7 1.1-2.8 2.5-2.8S17 11.5 17 13.3V17" strokeLinecap="round" />
        <circle cx="8" cy="7.4" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (name === "resume") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M6 3h8.5L19 7.5V21H6z" strokeLinejoin="round" />
        <path d="M14 3v5h5M9 12h7M9 15.5h7M9 19h4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3.6 7l8.4 6 8.4-6" strokeLinejoin="round" />
    </svg>
  );
}

// The site's foot: who this is, every way into the catalogue, and a last
// drawing, a stippled horizon, plotted underneath.
export default function Footer({ home = true }) {
  const base = home ? "" : "/";
  const columns = [
    {
      title: "Works",
      links: projects.map((p) => ({ label: p.name, href: `${base}#${p.id}` })),
    },
    {
      title: "Reading",
      links: [
        ...essays.map((e) => ({ label: e.title, href: `/essays/${e.slug}/` })),
        { label: "Statement", href: `${base}#statement` },
        { label: "Certificates", href: `${base}#certificates` },
        { label: "Chronology", href: `${base}#chronology` },
      ],
    },
  ];
  const icons = [
    { name: "github", label: "GitHub", href: profile.github, external: true },
    { name: "linkedin", label: "LinkedIn", href: profile.linkedin, external: true },
    { name: "mail", label: `Write to ${profile.email}`, href: `mailto:${profile.email}`, letter: true },
    { name: "resume", label: "Résumé, PDF", href: profile.resume, external: true },
  ];
  const ext = (external) => (external ? { target: "_blank", rel: "noreferrer" } : {});

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <a href={home ? "#top" : "/"} className="footer-brandmark">
            <span className="footer-kt" aria-hidden="true">
              K<span>·</span>T
            </span>
            <span className="footer-name">{profile.name}</span>
          </a>
          <p className="footer-line">Software &amp; AI engineer in {profile.location}. Open to software and AI engineering roles.</p>
          <ul className="footer-icons">
            {icons.map((i) => (
              <li key={i.name}>
                <a href={i.href} aria-label={i.label} title={i.label} {...ext(i.external)} {...(i.letter && { "data-letter": "" })}>
                  <Icon name={i.name} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav className="footer-cols" aria-label="Footer">
          {columns.map((col) => (
            <div key={col.title} className="footer-col">
              <h2 className="mono">{col.title}</h2>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} {...ext(l.external)}>
                      {l.label}
                      {l.external && (
                        <span className="arrow" aria-hidden="true">
                          ↗
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="footer-base">
        <div className="footer-bottom">
          <p>
            © {year} {profile.name}
          </p>
          <p>
            <a href={profile.source} target="_blank" rel="noreferrer">
              Plotted in your browser. Read the instructions
              <span className="arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          </p>
        </div>
        <Horizon />
      </div>
    </footer>
  );
}
