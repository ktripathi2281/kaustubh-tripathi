import { useEffect, useRef, useState } from "react";

const nav = [
  { id: "plates", label: "Plates", index: "1" },
  { id: "statement", label: "Statement", index: "2" },
  { id: "certificates", label: "Certificates", index: "3" },
  { id: "chronology", label: "Chronology", index: "4" },
  { id: "enquiries", label: "Enquiries", index: "5" },
];

function readTheme() {
  const set = document.documentElement.dataset.theme;
  if (set) return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// On pages other than the catalogue (`home` false), links lead back to it.
export default function Header({ plates = [], email, home = true }) {
  const base = home ? "" : "/";
  const [theme, setTheme] = useState(readTheme);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const openerRef = useRef(null);
  const closeRef = useRef(null);
  const returnFocus = useRef(true);
  const leaveTimer = useRef(null);

  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the contents page is open: lock scroll, close on Escape or when
  // the screen grows wide enough for the inline nav, and manage focus.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.classList.add("contents-open");
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const wide = window.matchMedia("(min-width: 801px)");
    const onWide = (e) => e.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    const opener = openerRef.current;
    return () => {
      root.classList.remove("contents-open");
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
      if (returnFocus.current) opener?.focus({ preventScroll: true });
      returnFocus.current = true;
    };
  }, [open]);

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

  function openContents() {
    clearTimeout(leaveTimer.current);
    returnFocus.current = true;
    if (open) {
      // Reopened while fading out: the open-state effect never unmounted,
      // so restore the scroll lock and focus it would have set.
      document.documentElement.classList.add("contents-open");
      closeRef.current?.focus();
    }
    setLeaving(false);
    setOpen(true);
  }

  // Fade the contents page away, or close it at once if motion is reduced.
  function lift() {
    clearTimeout(leaveTimer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpen(false);
      return;
    }
    setLeaving(true);
    leaveTimer.current = setTimeout(() => {
      setOpen(false);
      setLeaving(false);
    }, 260);
  }

  // Jump to the section while the contents page still covers the screen,
  // then lift it to reveal the page already in place. The jump is instant on
  // purpose: a long smooth scroll started as the scroll lock lifts can be
  // dropped by mobile browsers, which left the page where it was.
  function go(e, id) {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) {
      window.location.href = `/#${id}`;
      return;
    }
    const root = document.documentElement;
    root.classList.remove("contents-open");
    returnFocus.current = false;
    root.style.scrollBehavior = "auto";
    target.scrollIntoView({ block: "start" });
    root.style.scrollBehavior = "";
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    history.replaceState(null, "", `#${id}`);
    lift();
  }

  const nextLabel = theme === "dark" ? "Day" : "Night";

  return (
    <>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="header-inner">
          <a href={home ? "#top" : "/"} className="monogram" aria-label={home ? "Kaustubh Tripathi, back to top" : "Kaustubh Tripathi, the catalogue"}>
            K<span>·</span>T
          </a>
          <nav aria-label="Primary" className="nav-inline">
            <ul className="nav-list">
              {nav.map((item) => (
                <li key={item.id}>
                  <a href={`${base}#${item.id}`}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            ref={openerRef}
            className="contents-toggle"
            aria-expanded={open}
            aria-controls="contents"
            onClick={openContents}
          >
            Contents
          </button>
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

      <div
        id="contents"
        className={`contents${open ? " is-open" : ""}${leaving ? " is-leaving" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Contents"
        hidden={!open}
      >
        <div className="contents-bar">
          <span className="monogram" aria-hidden="true">
            K<span>·</span>T
          </span>
          <button type="button" ref={closeRef} className="contents-close" onClick={lift}>
            Close
          </button>
        </div>

        <nav aria-label="Contents" className="contents-body">
          <p className="mono contents-kicker">Contents</p>
          <ol className="contents-list">
            {nav.map((item, i) => (
              <li key={item.id} style={{ "--i": i }}>
                <a href={`${base}#${item.id}`} onClick={(e) => go(e, item.id)}>
                  <span className="contents-index">§ {item.index}</span>
                  <span className="contents-label">{item.label}</span>
                </a>
                {item.id === "plates" && (
                  <ol className="contents-plates">
                    {plates.map((p) => (
                      <li key={p.id}>
                        <a href={`${base}#${p.id}`} onClick={(e) => go(e, p.id)}>
                          <span className="contents-plate-no">{p.plate}</span>
                          {p.name}
                        </a>
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            ))}
          </ol>
          {email && (
            <p className="contents-foot">
              <a href={`mailto:${email}`} data-letter>
                {email}
              </a>
            </p>
          )}
        </nav>
      </div>
    </>
  );
}
