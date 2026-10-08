import { rng } from "./random.js";

// The ink line: one horizon per scene, from the left edge to the right, so
// that read down the page it wraps like a line of writing. x is a percentage
// of the width; y is in svh, measured from the level the scene's text stands
// on. Under the text the line runs level, so the seal sits exactly on it and
// the links sit clear below; past the text it rises and dips like a distant
// ridge, never more than RANGE from that level.
export const RANGE = 8;
// The strip the line's SVG covers, with room for the stroke.
export const BAND = [-(RANGE + 1), RANGE + 1];

// How far across the line stays level (under the text), and how far, in svh,
// its ridge may rise or fall. Phones have text the whole way across, so their
// ridge is lower and starts later.
export const layouts = {
  wide: { level: 50, swell: 7 },
  narrow: { level: 72, swell: 3.5 },
};

const round = (n) => Math.round(n * 100) / 100;
const clamp = (n) => Math.min(RANGE, Math.max(-RANGE, n));

// Monotone cubic through points sorted by x (as d3's curveMonotoneX): it never
// overshoots a point, so level stretches stay level and the line stays in range.
function monotone(pts) {
  const n = pts.length;
  const slope = (i) => (pts[i + 1][1] - pts[i][1]) / (pts[i + 1][0] - pts[i][0]);
  const tangent = pts.map((_, i) => {
    if (i === 0 || i === n - 1) return 0;
    const h0 = pts[i][0] - pts[i - 1][0];
    const h1 = pts[i + 1][0] - pts[i][0];
    const s0 = slope(i - 1);
    const s1 = slope(i);
    const p = (s0 * h1 + s1 * h0) / (h0 + h1);
    return (Math.sign(s0) + Math.sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
  });

  let d = `M${round(pts[0][0])} ${round(pts[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    if (y0 === y1 && !tangent[i] && !tangent[i + 1]) {
      d += `H${round(x1)}`;
      continue;
    }
    const third = (x1 - x0) / 3;
    d += `C${round(x0 + third)} ${round(y0 + third * tangent[i])} ${round(x1 - third)} ${round(y1 - third * tangent[i + 1])} ${round(x1)} ${round(y1)}`;
  }
  return d;
}

// The same line in pixels: `sx` px per unit of x, `sy` px per unit of y, with
// the top of BAND at 0. A monotone cubic scales with its points, so this is
// the identical curve, drawn without any stretching.
export function inPixels(pts, sx, sy) {
  return monotone(pts.map(([x, y]) => [x * sx, (y - BAND[0]) * sy]));
}

// A swell that is 0 at both ends of a stretch and 1 at its crest.
function swellAt(f, crest) {
  const s = f < crest ? Math.sin((Math.PI / 2) * (f / crest)) : Math.sin((Math.PI / 2) * ((1 - f) / (1 - crest)));
  return s * s;
}

const SAMPLES = [0.12, 0.26, 0.4, 0.54, 0.68, 0.8, 0.9];

// Level stretches ({ from, to, y }) joined by seeded ridges. The same seed
// gives the same ridge, so the line is identical on every visit.
export function ridgeLine({ stretches, swell, seed }) {
  const r = rng(seed);
  const pts = [];
  stretches.forEach((s, i) => {
    if (i > 0) {
      const prev = stretches[i - 1];
      const height = (0.45 + r() * 0.55) * swell * (r() < 0.75 ? -1 : 1); // mostly rising, sometimes a dip
      const crest = 0.3 + r() * 0.4;
      const ripple = (r() - 0.5) * 0.5 * swell;
      for (const f of SAMPLES) {
        const ease = f * f * (3 - 2 * f);
        const y = prev.y + (s.y - prev.y) * ease + height * swellAt(f, crest) + ripple * Math.sin(2 * Math.PI * f) * Math.sin(Math.PI * f);
        pts.push([prev.to + (s.from - prev.to) * f, round(clamp(y))]);
      }
    }
    pts.push([s.from, s.y]);
    if (s.to > s.from) pts.push([s.to, s.y]);
  });
  return { d: monotone(pts), pts };
}

// One scene's horizon in a layout: level under the text, then a ridge out to
// the right edge, or to `end` if the line stops there (at the name seal).
export function horizon(seed, layout, end = 100) {
  const L = layouts[layout];
  return ridgeLine({
    seed,
    swell: L.swell,
    stretches: [
      { from: 0, to: Math.min(L.level, end - 20), y: 0 },
      { from: end, to: end, y: 0 },
    ],
  });
}
