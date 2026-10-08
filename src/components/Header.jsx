import { profile } from "../data.js";

const nav = [
  { id: "work", label: "Work" },
  { id: "notes", label: "Notes" },
  { id: "contact", label: "Contact" },
];

// The page's own theme wins over the system's. The button's words come from
// CSS, so the prerendered page and the hydrated one always match.
function toggleTheme() {
  const root = document.documentElement;
  const dark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
  const next = dark ? "light" : "dark";
  root.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* storage unavailable; the theme still applies for this visit */
  }
}

// The running header: whose sheet this is, three ways into it, and the theme.
// On pages other than the home page (`home` false), links lead back to it.
export default function Header({ home = true }) {
  const base = home ? "" : "/";

  return (
    <header className="cell masthead">
      <a href={home ? "#top" : "/"} className="masthead-name">
        {profile.name}
      </a>
      <nav aria-label="Primary" className="masthead-nav">
        <ul>
          {nav.map((item) => (
            <li key={item.id}>
              <a href={`${base}#${item.id}`}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <button type="button" className="theme-toggle" onClick={toggleTheme}>
        <span className="theme-to-dark">
          <span className="visually-hidden">Switch to </span>Dark<span className="visually-hidden"> theme</span>
        </span>
        <span className="theme-to-light">
          <span className="visually-hidden">Switch to </span>Light<span className="visually-hidden"> theme</span>
        </span>
      </button>
    </header>
  );
}
