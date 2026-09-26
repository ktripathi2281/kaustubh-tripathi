// Each plate is a generated drawing that encodes how the project actually works.
// Strokes with className "p" are plotted (drawn on) when the plate enters view.
// Each <Part> can be hovered or tapped to read what it represents.

import Plot, { Part, HitLine, HitDot, t } from "./Plot.jsx";
import { rng, noise1, line, angleDiff } from "../lib/random.js";

const TAU = Math.PI * 2;
const dir = (a, r = 1) => [Math.cos(a) * r, Math.sin(a) * r];
const add = (p, q) => [p[0] + q[0], p[1] + q[1]];
const P = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;

function Label({ x, y, children, anchor = "start", red = false, d = 0 }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className={`lbl fade${red ? " lbl-red" : ""}`} style={t(d)}>
      {children}
    </text>
  );
}

/* ------------------------------------------------------------------ */
/* Plate 0 · Model, contained                                          */
/* ------------------------------------------------------------------ */

export const STEPS = 4000;

const model = (() => {
  const cx = 240;
  const cy = 250;
  const R = 150;
  const r = rng(7);
  const n1 = noise1(r);
  const n2 = noise1(r);
  let x = cx;
  let y = cy;
  let a = r() * TAU;
  const pts = [[x, y]];
  for (let i = 0; i < STEPS; i++) {
    a += n1(i * 0.007) * 0.075 + n2(i * 0.045) * 0.06;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.hypot(dx, dy);
    const edge = R * 0.86;
    if (dist > edge) {
      const k = Math.min(1, (dist - edge) / (R - edge));
      a += angleDiff(Math.atan2(-dy, -dx), a) * 0.09 * k;
    }
    x += Math.cos(a) * 2;
    y += Math.sin(a) * 2;
    const d2 = Math.hypot(x - cx, y - cy);
    if (d2 > R) {
      x = cx + ((x - cx) / d2) * R;
      y = cy + ((y - cy) / d2) * R;
    }
    pts.push([x, y]);
  }

  let ticks = "";
  const n = 96;
  for (let i = 0; i < n; i++) {
    const ang = -Math.PI / 2 + (i / n) * TAU;
    const long = i % 12 === 0;
    const p1 = add([cx, cy], dir(ang, R + 16));
    const p2 = add([cx, cy], dir(ang, R + (long ? 28 : 21)));
    ticks += `M${P(p1)}L${P(p2)}`;
  }
  return { cx, cy, R, scribble: line(pts), ticks };
})();

const modelParts = {
  model: {
    name: "The model",
    text: "4,000 random steps. Capable, but never fully predictable.",
  },
  boundary: {
    name: "The boundary",
    text: "Schemas, validation and guardrails. Fixed, measured and deterministic.",
  },
  output: {
    name: "The output",
    text: "The only thing allowed out, and only through the gate.",
  },
};

export function ModelContained({ caption }) {
  const { cx, cy, R, scribble, ticks } = model;
  const gateY = cy + R + 8;
  const start = cy + R * 0.55;
  return (
    <Plot
      viewBox="0 0 480 560"
      caption={caption}
      parts={modelParts}
      label="Generated drawing: a single tangled line held inside a precise circular boundary, with one red line leaving through a gate at the bottom."
    >
      <g className="bg">
        <rect x="18" y="18" width="444" height="524" className="p ink-faint" pathLength="1" style={t(0, 2.2)} />
        <Label x="30" y="36" d={0.4}>
          pl. 0
        </Label>
      </g>
      <Part id="model">
        <circle cx={cx} cy={cy} r={R} className="hit-area" />
        <path d={scribble} className="p ink" strokeWidth="0.45" pathLength="1" style={t(0.2, 6.5)} />
      </Part>
      <Part id="boundary">
        <circle cx={cx} cy={cy} r={R + 18} className="hit-stroke" strokeWidth="26" />
        <circle
          cx={cx}
          cy={cy}
          r={R + 8}
          className="p ink"
          strokeWidth="0.9"
          pathLength="1"
          transform={`rotate(90 ${cx} ${cy})`}
          style={t(0.6, 2.4)}
        />
        <path d={ticks} className="p ink-soft" strokeWidth="0.7" pathLength="1" style={t(1.2, 3)} />
      </Part>
      <Part id="output">
        <HitLine d={`M${cx} ${start}L${cx} 500`} w={16} />
        <circle cx={cx} cy={start} r="3.2" className="fade fill-red" style={t(5.6)} />
        <path d={`M${cx} ${start + 3.2}L${cx} 500`} className="p red" strokeWidth="1.1" pathLength="1" style={t(5.8, 1.6)} />
        <path d={`M${cx - 9} ${gateY}L${cx + 9} ${gateY}`} className="p red" strokeWidth="1.1" pathLength="1" style={t(6.2, 0.4)} />
        <circle cx={cx} cy="500" r="2.6" className="fade fill-red" style={t(7.2)} />
        <Label x={cx + 10} y="503" red d={7.3}>
          output
        </Label>
      </Part>
    </Plot>
  );
}

/* ------------------------------------------------------------------ */
/* Plate I · Kavach                                                    */
/* ------------------------------------------------------------------ */

const ROUTES = [
  ["triage", "Reads the complaint and sorts it into the right track. GPT-5."],
  ["extract", "Pulls out transaction IDs, phone numbers and UPI IDs: regex first, then GPT-5."],
  ["draft", "Drafts the complaint and the letters to police and bank. GPT-5."],
  ["translate", "Carries the case across all 22 scheduled Indian languages. GPT-5."],
  ["transcribe", "Turns a spoken account into text. GPT-4o-transcribe."],
  ["ask", "Answers questions grounded in the citizen's own case. GPT-5-mini."],
];

const kavachParts = {
  ...Object.fromEntries(ROUTES.map(([name, text]) => [name, { name: `Route · ${name}`, text }])),
  casefile: {
    name: "Case file",
    text: "Every route feeds one file of ten ordered steps, each with its deadline tracked.",
  },
  rules: {
    name: "Rules engine",
    text: "The deterministic fallback beside every route. The app still works with no API key.",
  },
  languages: {
    name: "22 hairlines",
    text: "One for each scheduled Indian language the app can speak.",
  },
};

export function KavachPlate({ caption }) {
  const join = [330, 190];
  const ys = ROUTES.map((_, i) => 62 + i * 52);
  const hair = Array.from({ length: 22 }, (_, i) => 26 + (i * 348) / 21);
  let ticks = "";
  for (let k = 0; k < 10; k++) {
    const x = 352 + k * 20;
    ticks += `M${x} 190L${x} ${190 - (k % 2 ? 7 : 12)}`;
  }
  const routeD = (y) => `M104 ${y}C214 ${y} 236 ${join[1]} ${join[0]} ${join[1]}`;
  const rulesD = "M104 356C224 356 244 202 330 202L552 202";

  return (
    <Plot
      viewBox="0 0 600 400"
      caption={caption}
      parts={kavachParts}
      label="Six lines, one per model route, converge into a single line with ten tick marks ending at a case file. A red line runs parallel to it the whole way."
    >
      <Part id="languages">
        {hair.map((y, i) => (
          <g key={y}>
            <HitLine d={`M26 ${y}L574 ${y}`} w={5} />
            <path d={`M26 ${y}L574 ${y}`} className="p ink-faint" strokeWidth="0.45" pathLength="1" style={t(i * 0.03, 1.1)} />
          </g>
        ))}
      </Part>
      {ys.map((y, i) => {
        const [name] = ROUTES[i];
        return (
          <Part key={name} id={name}>
            <HitLine d={routeD(y)} w={11} />
            <rect x="30" y={y - 9} width="80" height="18" className="hit-area" />
            <circle cx="104" cy={y} r="2.6" className="fade fill-ink" style={t(0.5 + i * 0.1)} />
            <Label x="94" y={y + 3} anchor="end" d={0.5 + i * 0.1}>
              {name}
            </Label>
            <path d={routeD(y)} className="p ink" strokeWidth="0.9" pathLength="1" style={t(0.7 + i * 0.12, 1.6)} />
          </Part>
        );
      })}
      <Part id="casefile" lit={ROUTES.map(([name]) => name)}>
        <HitLine d="M330 186L566 186" w={14} />
        <path d="M330 190L552 190" className="p ink" strokeWidth="1.2" pathLength="1" style={t(2.2, 1.3)} />
        <path d={ticks} className="p ink" strokeWidth="0.9" pathLength="1" style={t(2.5, 1.1)} />
        <rect x="552" y="183" width="14" height="14" className="p ink" strokeWidth="1" pathLength="1" style={t(3.3, 0.6)} />
        <Label x="559" y="170" anchor="middle" d={3.5}>
          case file
        </Label>
      </Part>
      <Part id="rules">
        <HitLine d={rulesD} w={10} />
        <rect x="40" y="347" width="70" height="18" className="hit-area" />
        <circle cx="104" cy="356" r="2.6" className="fade fill-red" style={t(3.4)} />
        <Label x="94" y="359" anchor="end" red d={3.4}>
          rules
        </Label>
        <path d={rulesD} className="p red" strokeWidth="1.1" pathLength="1" style={t(3.6, 2.2)} />
      </Part>
    </Plot>
  );
}

/* ------------------------------------------------------------------ */
/* Plate II · LeetCode Agent Tracker                                   */
/* ------------------------------------------------------------------ */

const TOOLS = ["problems", "topics", "readiness", "history"];
const VISITS = [0, 2, 1, 2, 3, 0, 1, 2];

const agentParts = {
  ...Object.fromEntries(
    TOOLS.map((name, i) => {
      const n = VISITS.filter((v) => v === i).length;
      return [
        `tool-${i}`,
        {
          name: `Tool · ${name}`,
          text: `One of four database tools the planner may call. Visited ${n === 1 ? "once" : `${n} times`} in this run.`,
        },
      ];
    })
  ),
  ...Object.fromEntries(
    VISITS.map((n, k) => [
      `loop-${k}`,
      {
        name: `Iteration ${k + 1}`,
        text: `The planner calls ${TOOLS[n]}, reads the result, and decides what to do next.`,
      },
    ])
  ),
  plan: { name: "The plan", text: "Returned after eight iterations, with the reasoning behind every choice." },
  log: { name: "Audit log", text: "Each iteration is recorded with its tool call, reasoning trace and latency." },
};

export function AgentPlate({ caption }) {
  const c = [300, 178];
  const R = 122;
  const angles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];
  const nodes = angles.map((a) => add(c, dir(a, R)));
  const seen = [0, 0, 0, 0];
  const petals = VISITS.map((n, k) => {
    const th = angles[n];
    const v = seen[n]++;
    const w = 0.22 + 0.2 * v;
    // Lean each loop to one side so repeated visits swirl rather than stack.
    const lean = (k % 2 ? 1 : -1) * (0.35 + 0.25 * v);
    const wl = w * (1 + lean);
    const wr = w * (1 - lean);
    const a1 = add(c, dir(th - wl, R * (0.58 + 0.06 * v)));
    const a2 = add(c, dir(th - wl * 0.5, R * 1.08));
    const b2 = add(c, dir(th + wr * 0.5, R * 1.08));
    const b1 = add(c, dir(th + wr, R * (0.58 + 0.06 * v)));
    return `M${P(c)}C${P(a1)} ${P(a2)} ${P(nodes[n])}C${P(b2)} ${P(b1)} ${P(c)}`;
  });
  const labelPos = [
    [nodes[0][0], nodes[0][1] - 13, "middle"],
    [nodes[1][0] + 13, nodes[1][1] + 3, "start"],
    [nodes[2][0], nodes[2][1] + 20, "middle"],
    [nodes[3][0] - 13, nodes[3][1] + 3, "end"],
  ];
  const loopsVisiting = (i) => VISITS.map((n, k) => (n === i ? `loop-${k}` : null)).filter(Boolean);

  return (
    <Plot
      viewBox="0 0 600 400"
      caption={caption}
      parts={agentParts}
      label="Eight looping paths leave a centre point and return, each passing through one of four tool nodes. Below, a red line records eight ticks, one per iteration."
    >
      {petals.map((d, k) => (
        <Part key={k} id={`loop-${k}`}>
          <HitLine d={d} w={8} />
          <path d={d} className="p ink" strokeWidth="0.85" pathLength="1" style={t(0.6 + k * 0.42, 1.2)} />
        </Part>
      ))}
      {nodes.map((p, i) => (
        <Part key={TOOLS[i]} id={`tool-${i}`} lit={loopsVisiting(i)}>
          <HitDot cx={p[0]} cy={p[1]} r={12} />
          <circle cx={p[0]} cy={p[1]} r="5.5" className="p ink" strokeWidth="0.9" pathLength="1" style={t(0.1 + i * 0.1, 0.6)} />
          <Label x={labelPos[i][0]} y={labelPos[i][1]} anchor={labelPos[i][2]} d={0.3 + i * 0.1}>
            {TOOLS[i]}
          </Label>
        </Part>
      ))}
      <Part id="plan" lit={["log"]}>
        <HitDot cx={c[0]} cy={c[1]} r={9} />
        <circle cx={c[0]} cy={c[1]} r="3.4" className="fade fill-ink" style={t(4.3)} />
        <Label x={c[0] + 14} y={c[1] + 20} d={4.4}>
          plan
        </Label>
      </Part>

      <Part id="log">
        <HitLine d="M84 361L480 361" w={12} />
        <Label x="112" y="364" anchor="end" red d={0.5}>
          log
        </Label>
        <path d="M120 361L480 361" className="p red" strokeWidth="1" pathLength="1" style={t(0.5, 3.8)} />
      </Part>
      {VISITS.map((_, k) => {
        const x = 120 + (k + 0.5) * 45;
        return (
          <Part key={k} id={`loop-${k}`} lit={["log"]} focus={false}>
            <rect x={x - 12} y="350" width="24" height="40" className="hit-area" />
            <path d={`M${x} 355L${x} 367`} className="p red" strokeWidth="1" pathLength="1" style={t(1.6 + k * 0.42, 0.3)} />
            <Label x={x} y="384" anchor="middle" red d={1.7 + k * 0.42}>
              {k + 1}
            </Label>
          </Part>
        );
      })}
    </Plot>
  );
}

/* ------------------------------------------------------------------ */
/* Plate III · Skill Barter                                            */
/* ------------------------------------------------------------------ */

const barter = (() => {
  const r = rng(21);
  const pts = [];
  let guard = 0;
  while (pts.length < 40 && guard++ < 8000) {
    const p = [46 + r() * 508, 40 + r() * 320];
    if (pts.every((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) > 44)) pts.push(p);
  }
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  let you = 0;
  pts.forEach((p, i) => {
    if (dist(p, [300, 200]) < dist(pts[you], [300, 200])) you = i;
  });
  const byDist = pts.map((_, i) => i).filter((i) => i !== you).sort((a, b) => dist(pts[a], pts[you]) - dist(pts[b], pts[you]));

  const edges = [];
  const key = (a, b) => (a < b ? `${a}-${b}` : `${b}-${a}`);
  const used = new Set();
  const addEdge = (a, b, kind) => {
    if (used.has(key(a, b))) return;
    used.add(key(a, b));
    edges.push({ a, b, kind });
  };
  addEdge(byDist[1], you, "one");
  addEdge(byDist[3], you, "one");
  pts.forEach((p, i) => {
    if (i === you || edges.length > 30) return;
    const near = pts
      .map((q, j) => [j, dist(p, q)])
      .filter(([j, d]) => j !== i && j !== you && d < 120)
      .sort((a, b) => a[1] - b[1]);
    if (!near.length || r() < 0.2) return;
    addEdge(i, near[0][0], r() < 0.4 ? "mutual" : "one");
    if (near[1] && r() < 0.3) addEdge(i, near[1][0], "one");
  });
  return { pts, you, match: byDist[0], edges };
})();

function arc(A, B, bulge) {
  const dx = B[0] - A[0];
  const dy = B[1] - A[1];
  const m = [(A[0] + B[0]) / 2 - dy * bulge, (A[1] + B[1]) / 2 + dx * bulge];
  return `M${P(A)}Q${P(m)} ${P(B)}`;
}

const barterParts = {
  you: { name: "You", text: "The rings measure distance. Closer matches rank higher." },
  people: { name: "People", text: "Each point is someone offering one skill and looking for another." },
  mutual: { name: "Mutual match", text: "Each person can teach what the other wants to learn." },
  oneway: { name: "One-way interest", text: "One wants what the other teaches, but not the reverse." },
  best: { name: "Your best match", text: "Mutual, and the nearest to you. A trade still needs both of you to agree." },
};

export function BarterPlate({ caption }) {
  const { pts, you, match, edges } = barter;
  const Y = pts[you];
  const firstOf = (kind) => edges.findIndex((e) => e.kind === kind);
  const M = pts[match];
  return (
    <Plot
      viewBox="0 0 600 400"
      caption={caption}
      parts={barterParts}
      label="Scattered points joined by curves: lens shapes for mutual matches, single arcs for one-way interest. Concentric rings surround one point, and its nearest mutual match is drawn in red."
    >
      <Part id="you">
        {[46, 92, 138].map((rad, i) => (
          <g key={rad}>
            <circle cx={Y[0]} cy={Y[1]} r={rad} className="hit-stroke" strokeWidth="7" />
            <circle cx={Y[0]} cy={Y[1]} r={rad} className="p ink-faint" strokeWidth="0.6" pathLength="1" style={t(0.3 + i * 0.25, 1.4)} />
          </g>
        ))}
      </Part>
      <Part id="people">
        {pts.map((p, i) =>
          i === you || i === match ? null : (
            <g key={i}>
              <HitDot cx={p[0]} cy={p[1]} r={7} />
              <circle cx={p[0]} cy={p[1]} r="2.4" className="fade fill-soft" style={t(0.1 + (i % 10) * 0.06)} />
            </g>
          )
        )}
      </Part>
      {edges.map((e, i) => {
        const A = pts[e.a];
        const B = pts[e.b];
        const d = 1.2 + i * 0.14;
        return e.kind === "mutual" ? (
          <Part key={i} id="mutual" focus={i === firstOf("mutual")}>
            <HitLine d={arc(A, B, 0.2)} w={8} />
            <HitLine d={arc(B, A, 0.2)} w={8} />
            <path d={arc(A, B, 0.2)} className="p ink" strokeWidth="0.8" pathLength="1" style={t(d, 1)} />
            <path d={arc(B, A, 0.2)} className="p ink" strokeWidth="0.8" pathLength="1" style={t(d + 0.1, 1)} />
          </Part>
        ) : (
          <Part key={i} id="oneway" focus={i === firstOf("one")}>
            <HitLine d={arc(A, B, 0.16)} w={8} />
            <path d={arc(A, B, 0.16)} className="p ink-soft" strokeWidth="0.6" pathLength="1" style={t(d, 1)} />
            <circle cx={B[0]} cy={B[1]} r="4.2" className="p ink-soft" strokeWidth="0.6" pathLength="1" style={t(d + 0.8, 0.4)} />
          </Part>
        );
      })}
      <Part id="best">
        <HitLine d={arc(Y, M, 0.22)} w={10} />
        <HitLine d={arc(M, Y, 0.22)} w={10} />
        <HitDot cx={M[0]} cy={M[1]} r={8} />
        <path d={arc(Y, M, 0.22)} className="p red" strokeWidth="1.1" pathLength="1" style={t(4, 1.2)} />
        <path d={arc(M, Y, 0.22)} className="p red" strokeWidth="1.1" pathLength="1" style={t(4.2, 1.2)} />
        <circle cx={M[0]} cy={M[1]} r="3" className="fade fill-red" style={t(4.8)} />
      </Part>
      <Part id="you" lit={["best"]} focus={false}>
        <HitDot cx={Y[0]} cy={Y[1]} r={9} />
        <circle cx={Y[0]} cy={Y[1]} r="4" className="fade fill-ink" style={t(0.2)} />
        <Label x={Y[0] + 9} y={Y[1] - 9} d={0.4}>
          you
        </Label>
      </Part>
    </Plot>
  );
}

/* ------------------------------------------------------------------ */
/* Plate IV · Ride Radar                                               */
/* ------------------------------------------------------------------ */

const radar = (() => {
  const r = rng(44);
  const dest = [522, 196];
  const starts = [70, 132, 198, 266, 332];
  const trails = starts.map((sy, k) => {
    const n = noise1(r);
    let p = [64 + r() * 18, sy];
    const pts = [p];
    for (let i = 0; i < 600; i++) {
      const head = Math.atan2(dest[1] - p[1], dest[0] - p[0]) + n(i * 0.045) * 1.05;
      p = add(p, dir(head, 3));
      pts.push(p);
      if (Math.hypot(dest[0] - p[0], dest[1] - p[1]) < 16) break;
    }
    return k === 3 ? pts.slice(0, Math.floor(pts.length * 0.56)) : pts;
  });
  return { dest, trails: trails.map((pts) => ({ d: line(pts), start: pts[0], end: pts[pts.length - 1] })) };
})();

const SOS_RIDER = 3;

const radarParts = {
  ...Object.fromEntries(
    [0, 1, 2, 4].map((k) => [
      `rider-${k}`,
      {
        name: `Rider ${k + 1}`,
        text: "Position, speed and battery shared with the group live, with a trail of up to 1,000 points.",
      },
    ])
  ),
  sos: {
    name: `Rider ${SOS_RIDER + 1} · SOS`,
    text: "One tap sends the alert and a pinned location to everyone in the trip room at once.",
  },
  checkpoint: {
    name: "Checkpoint",
    text: "A typed waypoint on the trip, like fuel, rest or a regroup.",
  },
};

export function RadarPlate({ caption }) {
  const { dest, trails } = radar;
  const grid = [];
  for (let x = 40; x <= 560; x += 40) grid.push(`M${x} 24L${x} 376`);
  for (let y = 40; y <= 360; y += 40) grid.push(`M24 ${y}L576 ${y}`);
  const sos = trails[SOS_RIDER].end;

  return (
    <Plot
      viewBox="0 0 600 400"
      caption={caption}
      parts={radarParts}
      label="Five wandering trails cross a faint map grid toward a shared checkpoint. One trail stops early, marked by red concentric rings."
    >
      <g className="bg">
        {grid.map((d, i) => (
          <path key={d} d={d} className="p ink-faint" strokeWidth="0.45" pathLength="1" style={t(i * 0.025, 1)} />
        ))}
      </g>
      {trails.map((tr, k) => {
        const sosRider = k === SOS_RIDER;
        return (
          <Part key={k} id={sosRider ? "sos" : `rider-${k}`} focus={!sosRider}>
            <HitLine d={tr.d} w={10} />
            <circle cx={tr.start[0]} cy={tr.start[1]} r="3" className="p ink-soft" strokeWidth="0.8" pathLength="1" style={t(0.5 + k * 0.2, 0.4)} />
            <path d={tr.d} className={`p ${sosRider ? "ink-soft" : "ink"}`} strokeWidth="0.9" pathLength="1" style={t(0.8 + k * 0.22, 2.6)} />
            {!sosRider && <circle cx={tr.end[0]} cy={tr.end[1]} r="2.6" className="fade fill-ink" style={t(3.4 + k * 0.22)} />}
          </Part>
        );
      })}
      <Part id="checkpoint">
        <HitDot cx={dest[0]} cy={dest[1]} r={14} />
        <rect x={dest[0] - 7} y={dest[1] - 7} width="14" height="14" className="p ink" strokeWidth="1" pathLength="1" style={t(0.4, 0.8)} />
        <Label x={dest[0]} y={dest[1] - 16} anchor="middle" d={0.6}>
          checkpoint
        </Label>
      </Part>
      <Part id="sos">
        <HitDot cx={sos[0]} cy={sos[1]} r={32} />
        <circle cx={sos[0]} cy={sos[1]} r="3.2" className="fade fill-red" style={t(3.2)} />
        {[11, 20, 31].map((rad, i) => (
          <circle
            key={rad}
            cx={sos[0]}
            cy={sos[1]}
            r={rad}
            className="p red"
            strokeWidth="0.9"
            strokeOpacity={1 - i * 0.28}
            pathLength="1"
            style={t(3.4 + i * 0.25, 0.9)}
          />
        ))}
        <Label x={sos[0] + 36} y={sos[1] + 3} red d={4.2}>
          SOS
        </Label>
      </Part>
    </Plot>
  );
}

export const plateArt = {
  kavach: KavachPlate,
  leetcode: AgentPlate,
  skillbarter: BarterPlate,
  rideradar: RadarPlate,
};
