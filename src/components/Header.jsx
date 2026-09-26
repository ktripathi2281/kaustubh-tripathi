import { useEffect, useState } from "react";

const nav = [
  { id: "plates", label: "Plates" },
  { id: "statement", label: "Statement" },
  { id: "chronology", label: "Chronology" },
  { id: "enquiries", label: "Enquiries" },
];

function readTheme() {
  const set = document.documentElement.dataset.theme;
  if (set) return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function Header() {
  const [theme, setTheme] = useState(readTheme);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable; the theme still applies for this visit */
    }
    setTheme(next);
  }

  const nextLabel = theme === "dark" ? "Day" : "Night";

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="header-inner">
        <a href="#top" className="monogram" aria-label="Kaustubh Tripathi, back to top">
          K<span>·</span>T
        </a>
        <nav aria-label="Primary">
          <ul className="nav-list">
            {nav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          {nextLabel}
        </button>
      </div>
    </header>
  );
}
