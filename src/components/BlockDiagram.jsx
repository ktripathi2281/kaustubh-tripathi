import { useEffect, useRef, useState } from "react";

// A project's flow as a block diagram: an ordered list of outlined boxes joined
// by hairline arrows, so it reads as text too. Driven by `diagram` in data.js.
// Boxes and arrows draw in once, the first time the diagram scrolls into view.

const step = (s) => (typeof s === "string" ? { label: s } : s);
const STAGGER = 0.14; // seconds between one box and the next

function Arrow({ both }) {
  return (
    <span className="flow-link" aria-hidden="true">
      <svg className="flow-arrow" viewBox="0 0 32 10" focusable="false">
        <path
          pathLength="1"
          d={both ? "M5 1 1.5 4.5 5 8M1.5 4.5h29M27 1 30.5 4.5 27 8" : "M0 4.5h30.5M27 1 30.5 4.5 27 8"}
        />
      </svg>
    </span>
  );
}

function Box({ s, n }) {
  return (
    <span className={`flow-box${s.accent ? " is-accent" : ""}`}>
      {n && (
        <span className="flow-no" aria-hidden="true">
          {n}
        </span>
      )}
      <span className="flow-label">{s.label}</span>
      {s.note && <span className="flow-note">{s.note}</span>}
      {s.loop && (
        <span className="flow-note">
          <span className="visually-hidden">Loops back to the previous step, </span>
          {s.loop}
        </span>
      )}
    </span>
  );
}

function Step({ s, i, n }) {
  const d = { "--d": `${i * STAGGER}s` };

  if (s.split) {
    return (
      <li className="flow-step flow-split" style={d}>
        {i > 0 && <Arrow both={s.link === "both"} />}
        <div className="flow-box flow-group">
          <span className="flow-no" aria-hidden="true">
            {n}
          </span>
          {s.label && <span className="flow-label">{s.label}</span>}
          <ul className="flow-branches">
            {s.split.map((branch, b) => (
              <li key={b}>
                <ol className="flow-branch">
                  {branch.map(step).map((t, j) => (
                    <li className="flow-step" key={t.label} style={{ "--d": `${(i + b * 0.5 + j + 0.5) * STAGGER}s` }}>
                      {j > 0 && <Arrow />}
                      <Box s={t} />
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ul>
        </div>
      </li>
    );
  }

  return (
    <li className="flow-step" style={d}>
      {i > 0 && <Arrow both={s.link === "both"} />}
      <Box s={s} n={n} />
    </li>
  );
}

export default function BlockDiagram({ diagram, name }) {
  const ref = useRef(null);
  const [drawn, setDrawn] = useState(false);
  const steps = diagram.steps.map(step);
  // Columns on wide screens: one row for up to six boxes, else two even rows.
  // A branching step takes two columns.
  const slots = steps.reduce((n, s) => n + (s.split ? 2 : 1), 0);
  const cols = slots <= 6 ? slots : Math.ceil(slots / 2);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure
      ref={ref}
      className={`flow${diagram.rail ? " has-rail" : ""}${drawn ? " is-drawn" : ""}`}
      aria-label={`${name}: block diagram`}
    >
      <ol className="flow-steps" style={{ "--cols": cols }}>
        {steps.map((s, i) => (
          <Step key={s.label ?? i} s={s} i={i} n={String(i + 1).padStart(2, "0")} />
        ))}
      </ol>
      {diagram.rail && (
        <p className="flow-rail" style={{ "--d": `${steps.length * STAGGER}s` }}>
          <span className="visually-hidden">Running alongside every step: </span>
          <span className="flow-rail-line" aria-hidden="true" />
          <span className="flow-rail-label">{diagram.rail}</span>
        </p>
      )}
    </figure>
  );
}
