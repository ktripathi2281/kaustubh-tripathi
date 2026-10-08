import { rng } from "../lib/random.js";
import { strokes } from "../lib/strokes.js";
import { ja } from "../ja.js";

// The opening, played once per visit: a drop of ink falls and blooms into
// rings, as ink floats on water in suminagashi; the name is written inside
// them in katakana, stroke by stroke in its proper order; the seal is pressed
// red; and the paper lifts away to show the page. Any touch, key or scroll
// skips it, and visitors who turn motion off never see it.
//
// It is all CSS animation, timed here and set inline, so nothing waits on
// JavaScript. styles.css (Opening) has the keyframes.

// The timeline, in ms.
const DROP = 150; // the drop starts to fall
const LAND = DROP + 380; // and lands, becoming the first ring
const RING_GAP = 80; // each new ring pushes out the ones before it
const RING_GROW = 1600;
const WRITE = 720; // the first stroke
const STROKE_GAP = 18; // the pen lifting between strokes
const CHAR_GAP = 55; // and moving on to the next character
const MS_PER_UNIT = 0.62; // pen speed, per unit of a 109-unit character box

// The seal, in its own units: two columns of three characters, read from the
// right column down, then the left. Small ゥ sits up and to the right of its
// box, as small kana do in vertical text.
const PAD = 26;
const BOX = 109;
const PITCH = 100;
const SEAL = { width: PAD * 2 + BOX * 2 + 6, height: PAD * 2 + PITCH * 3 + 9 };
const SMALL = { "ゥ": [10, -14] };

function measure(d) {
  // KanjiVG strokes are an M followed by relative cubic curves.
  const nums = d.slice(1).match(/-?\d*\.?\d+/g).map(Number);
  let [x, y] = nums;
  let length = 0;
  for (let i = 2; i + 5 < nums.length; i += 6) {
    const [x1, y1, x2, y2, x3, y3] = nums.slice(i, i + 6).map((n, k) => n + (k % 2 ? y : x));
    let [px, py] = [x, y];
    for (let t = 0.1; t <= 1.001; t += 0.1) {
      const u = 1 - t;
      const qx = u * u * u * x + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3;
      const qy = u * u * u * y + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3;
      length += Math.hypot(qx - px, qy - py);
      [px, py] = [qx, qy];
    }
    [x, y] = [x3, y3];
  }
  return length;
}

// Every stroke of the name, placed in its box and timed in writing order.
const writing = (() => {
  let at = WRITE;
  return [...ja.seal].flatMap((ch, i) => {
    const column = i < 3 ? 1 : 0;
    const [dx, dy] = SMALL[ch] || [0, 0];
    const x = PAD + column * (BOX + 6) + dx;
    const y = PAD + (i % 3) * PITCH - 4 + dy;
    if (i) at += CHAR_GAP;
    return strokes[ch].map((d) => {
      const duration = Math.round(28 + measure(d) * MS_PER_UNIT);
      const stroke = { d, transform: `translate(${x} ${y})`, delay: at, duration };
      at += duration + STROKE_GAP;
      return stroke;
    });
  });
})();

export const STAMP = writing.at(-1).delay + writing.at(-1).duration + 120;
export const REVEAL = STAMP + 480; // the ink lifts, then the paper

// The rings, outermost (the first drop) to innermost: alternately a broad
// band of ink and a fine line, as the drops of ink and clear water alternate
// in suminagashi. The water moves them all together, so they share one
// gentle swirl, stronger toward the outside, and never cross; each adds only
// a tremor of its own. Radii and drift are in seal heights; widths in px.
const RING_COUNT = 13;
const POINTS = 32;
const FLOW = [
  [2, 0.07, 0.6],
  [3, 0.035, 2.1],
  [5, 0.012, 4.4],
];
const round3 = (n) => n.toFixed(3);

// A closed curve through the midpoints of its points, smooth all the way round.
function closed(points) {
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const n = points.length;
  let d = `M${mid(points[n - 1], points[0]).map(round3).join(" ")}`;
  for (let i = 0; i < n; i++) {
    const p = points[i];
    d += `Q${p.map(round3).join(" ")} ${mid(p, points[(i + 1) % n]).map(round3).join(" ")}`;
  }
  return `${d}Z`;
}

const rings = Array.from({ length: RING_COUNT }, (_, i) => {
  const r = rng(77 + i * 13);
  const broad = i % 2 === 0;
  const radius = 1.78 - i * 0.072 + (r() - 0.5) * 0.02;
  const width = broad ? 3 + r() * 7 : 0.8 + r() * 1.6;
  const tone = broad ? 0.28 + r() * 0.22 : 0.16 + r() * 0.16;
  const reach = Math.max(0, radius - 0.8); // 0 at the seal, about 1 at the rim
  const tremor = [4, 6].map((k) => [k, (r() - 0.5) * 0.01, r() * Math.PI * 2]);
  const points = Array.from({ length: POINTS }, (_, n) => {
    const a = (n / POINTS) * Math.PI * 2;
    const flow = FLOW.reduce((s, [k, amp, phase]) => s + amp * reach * Math.sin(k * a + phase), 0);
    const own = tremor.reduce((s, [k, amp, phase]) => s + amp * Math.sin(k * a + phase), 0);
    const rr = 1 + flow + own;
    return [Math.cos(a) * rr * (1 + 0.04 * reach), Math.sin(a) * rr];
  });
  return {
    d: closed(points),
    style: {
      "--r": radius.toFixed(3),
      "--w": width.toFixed(1),
      "--tone": tone.toFixed(2),
      "--turn": `${(6 * reach).toFixed(1)}deg`,
      "--dx": (0.025 * reach).toFixed(3),
      "--dy": (0.015 * reach).toFixed(3),
      animationDelay: `${LAND + i * RING_GAP}ms`,
      animationDuration: `${RING_GROW + (RING_COUNT - i) * 50}ms`,
    },
  };
});

const strokePaths = (className) => (
  <g className={className}>
    {writing.map((s, i) => (
      <path
        key={i}
        d={s.d}
        transform={s.transform}
        pathLength="1"
        style={className === "intro-ink" ? { animationDelay: `${s.delay}ms`, animationDuration: `${s.duration}ms` } : undefined}
      />
    ))}
  </g>
);

export default function Intro() {
  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-sheet" style={{ "--drop": `${DROP}ms`, "--stamp": `${STAMP}ms`, "--reveal": `${REVEAL}ms` }}>
        <div className="intro-bloom">
          {rings.map((ring, i) => (
            <svg key={i} className="intro-ring" viewBox="-1.1 -1.1 2.2 2.2" style={ring.style} focusable="false">
              <path d={ring.d} />
            </svg>
          ))}
          <svg className="intro-drop" viewBox="-1 -1 2 2" focusable="false">
            <circle r="1" />
          </svg>
          <svg className="intro-seal" viewBox={`0 0 ${SEAL.width} ${SEAL.height}`} focusable="false">
            <rect className="intro-outline" x="0.5" y="0.5" width={SEAL.width - 1} height={SEAL.height - 1} />
            <rect className="intro-red" width={SEAL.width} height={SEAL.height} />
            {strokePaths("intro-ink")}
            {strokePaths("intro-paper")}
          </svg>
        </div>
      </div>
    </div>
  );
}
