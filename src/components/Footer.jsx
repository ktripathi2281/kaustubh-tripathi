import { Horizon } from "./InkLine.jsx";
import Letter from "./Letter.jsx";
import { NameSeal, VerticalLabel } from "./marks.jsx";
import { essays, profile, projects } from "../data.js";
import { ja } from "../ja.js";

// The last line ends here, at the name seal, above the stippled ridges: this
// far across, in % (styles.css sets the seal at the same --end).
const END = { wide: 76, narrow: 80 };
const year = new Date().getFullYear();

function Ext({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

// The foot of the page, mounted like the foot of a hanging scroll: a double
// rule, how to get in touch, every way into the site, and the line's end.
export default function Footer({ home = true }) {
  const base = home ? "" : "/";
  const [user, domain] = profile.email.split("@");

  return (
    <footer className="site-footer" id="contact" tabIndex={-1} aria-labelledby="contact-title">
      <div className="footer-inner">
        <section className="head foot-contact" aria-labelledby="contact-title">
          <VerticalLabel text={ja.contact} />
          <div className="text">
            <h2 className="label" id="contact-title">
              Contact
            </h2>
            <a className="email" href={`mailto:${profile.email}`}>
              {user}
              <wbr />@{domain}
            </a>
            <p className="availability">{profile.availability}</p>
            <ul className="links">
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
            <Letter />
          </div>
        </section>

        <nav className="foot-cols" aria-label="Site">
          <div className="head">
            <VerticalLabel text={ja.works} />
            <div>
              <h2 className="label">Works</h2>
              <ul className="foot-list">
                {projects.map((p) => (
                  <li key={p.id}>
                    <a href={`${base}#${p.id}`}>{p.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="head">
            <VerticalLabel text={ja.reading} />
            <div>
              <h2 className="label">Reading</h2>
              <ul className="foot-list">
                {essays.map((e) => (
                  <li key={e.slug}>
                    <a href={`/essays/${e.slug}/`}>{e.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </div>

      <div className="foot-end">
        <p className="foot-meta label">
          <span>
            © {year} {profile.name}
          </span>
          <a href={profile.source} target="_blank" rel="noreferrer" aria-label="Source of this site">
            Source
          </a>
        </p>
        <Horizon seed={2281} end={END}>
          <NameSeal />
        </Horizon>
        {/* The sun sets behind the hills, under cherry trees in blossom. */}
        <div className="ridges" aria-hidden="true">
          <div className="ridges-sky">
            <canvas className="ridges-sun" />
          </div>
          <canvas className="ridges-land" />
        </div>
      </div>
    </footer>
  );
}
