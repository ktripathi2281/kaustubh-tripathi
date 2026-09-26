import { createContext, useContext, useEffect, useRef, useState } from "react";

const PlotContext = createContext({ active: null, setActive: () => {}, parts: {} });

// Frames a drawing like a mounted print. Strokes "plot" themselves the first
// time the drawing scrolls into view, and again whenever Replot is pressed.
// Hovering (or tapping) a <Part> brings it forward and reads it in the caption.
export default function Plot({ viewBox, label, caption, parts = {}, children }) {
  const ref = useRef(null);
  const [phase, setPhase] = useState("idle"); // idle → plotted; replot: reset → plotted
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (phase !== "idle") return;
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setPhase("plotted");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPhase("plotted");
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [phase]);

  // After a reset has painted with transitions off, plot again.
  useEffect(() => {
    if (phase !== "reset") return;
    let r2;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setPhase("plotted"));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [phase]);

  function replot() {
    setActive(null);
    setPhase("reset");
  }

  const reading = active && parts[active];
  const cls = ["plot", phase === "plotted" && "is-plotted", phase === "reset" && "is-reset", active && "has-focus"]
    .filter(Boolean)
    .join(" ");

  return (
    <PlotContext.Provider value={{ active, setActive, parts }}>
      <figure className="plot-figure">
        <div className="mat">
          <div ref={ref} className={cls}>
            <svg
              viewBox={viewBox}
              role="img"
              aria-label={label}
              preserveAspectRatio="xMidYMid meet"
              onClick={(e) => {
                if (!e.target.closest(".part.is-live")) setActive(null);
              }}
            >
              {children}
            </svg>
          </div>
        </div>
        <figcaption className="plot-caption">
          <p className={`plot-reading${reading ? " is-reading" : ""}`} aria-live="polite">
            {reading ? (
              <>
                <span className="mono">{reading.name}.</span> {reading.text}
              </>
            ) : (
              caption
            )}
          </p>
          <button type="button" className="replot" onClick={replot} aria-label="Replot this drawing">
            Replot <span aria-hidden="true">↺</span>
          </button>
        </figcaption>
      </figure>
    </PlotContext.Provider>
  );
}

// A readable piece of a drawing. Every <Part> with the same id lights up
// together; `lit` lists other part ids that should also light this one.
// Pass focus={false} on repeats of an id so the keyboard reaches it once.
export function Part({ id, lit = [], focus = true, children }) {
  const { active, setActive, parts } = useContext(PlotContext);
  const on = active != null && (active === id || lit.includes(active));
  const live = Boolean(id && parts[id]);
  const clear = () => setActive((a) => (a === id ? null : a));

  const handlers = live
    ? {
        onPointerEnter: (e) => e.pointerType === "mouse" && setActive(id),
        onPointerLeave: (e) => e.pointerType === "mouse" && clear(),
        onClick: () => setActive(id),
        ...(focus && {
          tabIndex: 0,
          role: "button",
          "aria-label": `${parts[id].name}. ${parts[id].text}`,
          onFocus: () => setActive(id),
          onBlur: clear,
        }),
      }
    : {};

  return (
    <g className={`part${live ? " is-live" : ""}${on ? " is-on" : ""}`} {...handlers}>
      {children}
    </g>
  );
}

// Invisible, generous hit areas so thin lines are easy to find with a cursor.
export const HitLine = ({ d, w = 12 }) => <path d={d} className="hit-stroke" strokeWidth={w} />;
export const HitDot = ({ cx, cy, r = 9 }) => <circle cx={cx} cy={cy} r={r} className="hit-area" />;

// Timing helper for a plotted stroke: delay and duration in seconds.
export const t = (d = 0, dur = 1.6) => ({ "--d": `${d}s`, "--t": `${dur}s` });
