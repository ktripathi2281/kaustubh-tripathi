// A certificate seal: a guilloche band (interlaced sine rings, the security
// pattern of banknotes and diplomas) generated in code and plotted like the
// plates, an inscription around the rim, and the official badge at its centre.

import { usePlotPhase, plotClass, t } from "./Plot.jsx";
import { line } from "../lib/random.js";

const C = 120;
const TAU = Math.PI * 2;

// One ring whose radius rises and falls `waves` times around the circle.
// Copies are phase-shifted so their crossings weave a lattice.
function band({ r0, amp, waves, copies, amp2 = 0, waves2 = 0, steps = 720 }) {
  return Array.from({ length: copies }, (_, k) => {
    const phase = (TAU * k) / copies;
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * TAU;
      const r = r0 + amp * Math.sin(waves * a + phase) + amp2 * Math.sin(waves2 * a);
      pts.push([C + Math.cos(a) * r, C + Math.sin(a) * r]);
    }
    return line(pts);
  });
}

// Clockwise circle starting at the top, so rim text reads outward.
const ringPath = (r) => `M${C} ${C - r}A${r} ${r} 0 1 1 ${C} ${C + r}A${r} ${r} 0 1 1 ${C} ${C - r}`;

const RIM = 101;

export default function Seal({ id, inscription, badge, pattern, label }) {
  const { ref, phase } = usePlotPhase();
  const strands = band(pattern);
  const rimLength = TAU * RIM - 4;

  return (
    <div ref={ref} className={`${plotClass(phase)} seal`}>
      <svg viewBox="0 0 240 240" role="img" aria-label={label}>
        <defs>
          <path id={`rim-${id}`} d={ringPath(RIM)} />
        </defs>

        {[116, 111, 95, 59].map((r, i) => (
          <circle
            key={r}
            cx={C}
            cy={C}
            r={r}
            className="p ink-soft"
            strokeWidth={i === 0 ? 0.8 : 0.45}
            pathLength="1"
            transform={`rotate(-90 ${C} ${C})`}
            style={t(i * 0.15, 1.4)}
          />
        ))}

        {strands.map((d, k) => (
          <path key={k} d={d} className="p ink-soft" strokeWidth="0.4" pathLength="1" style={t(0.5 + k * 0.12, 2.2)} />
        ))}

        <g className="seal-rim fade" style={t(1.4)}>
          <text className="seal-text">
            <textPath href={`#rim-${id}`} textLength={rimLength} lengthAdjust="spacing">
              {inscription.toUpperCase()}
            </textPath>
          </text>
        </g>

        <image href={badge} x={C - 51} y={C - 51} width="102" height="102" className="fade" style={t(2)} />
      </svg>
    </div>
  );
}
