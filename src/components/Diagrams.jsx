import { arrow, circle, polar, r1 } from "../lib/draw.js";
import { rng } from "../lib/random.js";

// A small ink diagram for each project: how it works, drawn in the same line
// as the horizons, with a few words. Every one is built from the project's own
// README or the résumé, and draws itself stroke by stroke as its scene
// arrives (styles.css, Diagrams). Each item is a stroke ("line", "faint",
// "grid", "bold"), a filled "dot", or a "label", with the step it is drawn at.

const W = 360;
const H = 220;
const START = 250; // ms after the scene arrives
const STEP = 110; // ms between steps

// Two curves between a and b, bowed apart: a lens. One curve: an arc.
function bow(a, b, k) {
  const [mx, my] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const len = Math.hypot(dx, dy);
  return [mx - (dy / len) * k, my + (dx / len) * k];
}
const arc = (a, b, k) => {
  const c = bow(a, b, k);
  return `M${r1(a[0])} ${r1(a[1])}Q${r1(c[0])} ${r1(c[1])} ${r1(b[0])} ${r1(b[1])}`;
};
const lens = (a, b, k) => `${arc(a, b, k)}${arc(b, a, k)}`;

const label = (x, y, text, step, anchor) => ({ kind: "label", x, y, text, step, anchor });
const dot = (cx, cy, r, step) => ({ kind: "dot", cx: r1(cx), cy: r1(cy), r, step });

// Kavach: words in any of 22 languages, by voice or text, gather into one case
// file, then ten steps in order, with clocks on the deadlines.
function kavach() {
  const r = rng(11);
  const items = [];
  const c = [120, 104];
  for (let i = 0; i < 7; i++) {
    const y = r1(24 + i * 26 + (r() - 0.5) * 8);
    items.push({ kind: "faint", d: `M10 ${y}C62 ${y} 80 ${c[1]} ${c[0] - 7} ${c[1]}`, step: i * 0.4, t: 700 });
  }
  items.push({ kind: "line", d: circle(c[0], c[1], 7), step: 3.4, t: 500 });
  const x0 = 148;
  const dx = 22.6;
  items.push({ kind: "line", d: `M${c[0] + 7} ${c[1]}H${r1(x0 + 9 * dx)}`, step: 4.4, t: 900 });
  for (let i = 0; i < 10; i++) {
    const x = x0 + i * dx;
    items.push(i === 0 ? dot(x, c[1], 3.6, 5 + i * 0.35) : { kind: "line", d: circle(x, c[1], 3.6), step: 5 + i * 0.35, t: 280 });
  }
  for (const i of [1, 3, 6]) {
    const x = r1(x0 + i * dx);
    const y = c[1] - 24;
    items.push({ kind: "faint", d: `M${x} ${c[1] - 5}V${y + 7}`, step: 9 + i * 0.3, t: 250 });
    items.push({ kind: "line", d: `${circle(x, y, 6.5)}M${x} ${y}V${y - 4}M${x} ${y}H${x + 3.5}`, step: 9.3 + i * 0.3, t: 450 });
  }
  items.push(
    label(10, 214, "22 languages, by voice or text", 2),
    label(x0 - 4, c[1] + 28, "ten steps, in order", 8),
    label(r1(x0 + 3.5 * dx), c[1] - 42, "deadlines", 11, "middle")
  );
  return {
    label: "Diagram: words in 22 languages, by voice or text, gather into one case file, followed by ten steps in order, some with deadlines.",
    items,
  };
}

// DeepResearch: twenty passages retrieved, reranked to five; each line of the
// answer cites one of them, and each is checked.
function deepresearch() {
  const r = rng(23);
  const items = [];
  const found = Array.from({ length: 20 }, (_, i) => [r1(24 + r() * 32), r1(14 + i * 9.2)]);
  const keep = [2, 6, 9, 13, 17];
  const kept = keep.map((_, k) => [150, 44 + k * 30]);
  found.forEach(([x, y], i) => {
    items.push(dot(x, y, 2, i * 0.08));
    if (!keep.includes(i)) items.push({ kind: "faint", d: `M${x + 5} ${y}L${r1(94)} ${r1(y + (104 - y) * 0.22)}`, step: 2 + i * 0.05, t: 380 });
  });
  keep.forEach((i, k) => {
    const [fx, fy] = found[i];
    const [kx, ky] = kept[k];
    items.push({ kind: "line", d: `M${fx + 5} ${fy}C100 ${fy} 112 ${ky} ${kx - 5} ${ky}`, step: 2.6 + k * 0.3, t: 600 });
    items.push(dot(kx, ky, 3, 3.6 + k * 0.3));
  });
  [
    [78, 300, 1],
    [110, 316, 2],
    [142, 284, 4],
  ].forEach(([y, end, k], i) => {
    const [, ky] = kept[k];
    items.push({ kind: "faint", d: `M155 ${ky}C182 ${ky} 188 ${y} 210 ${y}`, step: 5.6 + i * 0.6, t: 450 });
    items.push({ kind: "line", d: `M214 ${y}H${end}`, step: 6 + i * 0.6, t: 500 });
    items.push({ kind: "line", d: `M${end + 7} ${y - 6}h-2v12h2M${end + 13} ${y - 6}h2v12h-2`, step: 6.5 + i * 0.6, t: 250 });
    items.push({ kind: "line", d: `M${end + 22} ${y}l3.5 3.5l7 -8`, step: 8.6 + i * 0.4, t: 250 });
  });
  items.push(label(18, 214, "top 20", 1), label(122, 214, "reranked to 5", 4), label(214, 172, "cited, then checked", 8));
  return {
    label: "Diagram: twenty retrieved passages are reranked to five; each line of the answer cites one of them and is checked.",
    items,
  };
}

// Loop Detector: edit, run tests, the same failure, round and round; and the
// way out, Rethink.
function loopdetector() {
  const c = [156, 112];
  const items = [50, 60, 70].map((rr, i) => ({ kind: i < 2 ? "faint" : "line", d: circle(c[0], c[1], rr), step: i * 1.6, t: 1100 }));
  const nodes = [-90, 30, 150].map((deg) => polar(c, 70, deg));
  nodes.forEach(([x, y], i) => items.push(dot(x, y, 3.6, 4.8 + i * 0.3)));
  [-30, 90, 210].forEach((deg, i) => {
    const [x, y] = polar(c, 70, deg);
    items.push({ kind: "line", d: arrow(x, y, ((deg + 90) * Math.PI) / 180), step: 5.4 + i * 0.3, t: 200 });
  });
  items.push(
    { kind: "line", d: `M${c[0]} 42C196 42 236 52 300 58`, step: 7, t: 700 },
    { kind: "line", d: arrow(300, 58, 0.09), step: 8, t: 200 },
    label(c[0], 30, "edit", 5, "middle"),
    label(r1(nodes[1][0] + 10), r1(nodes[1][1] + 18), "run tests", 5.3),
    label(r1(nodes[2][0] - 10), r1(nodes[2][1] + 18), "same failure", 5.6, "end"),
    label(c[0], c[1] + 4, "×5", 6, "middle"),
    label(306, 62, "rethink", 8.2)
  );
  return {
    label: "Diagram: edit, run tests, the same failure, going round and round, with a way out labelled rethink.",
    items,
  };
}

// LeetCode Agent Tracker: the planner reaches out to four read-only tools, up
// to eight times, then hands back a seven-day plan.
function leetcode() {
  const r = rng(31);
  const p = [64, 96];
  const tools = [-48, -16, 16, 48].map((deg) => polar(p, 104, deg));
  const items = [dot(p[0], p[1], 5, 0)];
  tools.forEach(([x, y], i) => items.push({ kind: "line", d: circle(x, y, 4), step: 0.4 + i * 0.2, t: 300 }));
  [1, 0, 2, 1, 3, 2, 1, 3].forEach((t, k) => {
    const end = polar(p, 98, [-48, -16, 16, 48][t]);
    items.push({ kind: "line", d: lens(p, end, r1(9 + r() * 9)), step: 1.4 + k * 0.55, t: 520 });
  });
  const week = [224, 96];
  items.push({ kind: "line", d: `M${p[0] + 6} ${p[1]}H${week[0] + 6 * 19}`, step: 6.4, t: 800 });
  for (let d = 0; d < 7; d++) {
    const x = week[0] + d * 19;
    items.push({ kind: "line", d: `M${x} ${week[1]}V${week[1] - 12}`, step: 7.2 + d * 0.2, t: 200 });
  }
  items.push(
    label(p[0] - 12, p[1] + 4, "planner", 0.4, "end"),
    label(174, 130, "4 read-only tools", 1),
    label(18, 208, "up to 8 turns", 4),
    label(week[0], week[1] - 22, "a 7-day plan", 7.6)
  );
  return {
    label: "Diagram: the planner reaches out to four read-only tools, up to eight times, and returns a seven-day plan.",
    items,
  };
}

// Tollgate: requests from several clients pass the gate to a provider, and the
// reply streams back piece by piece; budgets will be held, then settled.
function tollgate() {
  const items = [];
  [48, 92, 136].forEach((y, i) => items.push({ kind: "faint", d: `M10 ${y}C70 ${y} 100 112 140 112`, step: i * 0.4, t: 650 }));
  items.push(
    { kind: "line", d: "M148 150H168M158 150V96", step: 1.8, t: 400 },
    { kind: "line", d: "M146 102L158 98L238 70", step: 2.4, t: 450 },
    { kind: "line", d: "M140 112H321", step: 3, t: 700 },
    { kind: "line", d: circle(329, 112, 8), step: 4.2, t: 400 }
  );
  for (let j = 0; j < 8; j++) {
    const x = 316 - j * 18;
    items.push({ kind: "line", d: `M${x} 134h-11`, step: 5 + j * 0.35, t: 160 });
  }
  items.push(
    { kind: "line", d: arrow(167, 134, Math.PI), step: 7.9, t: 200 },
    { kind: "faint", d: "M110 180V192M110 186H250M250 180V192", step: 8.4, t: 500 },
    { kind: "bold", d: "M110 186H198", step: 9.2, t: 500 },
    label(10, 30, "OpenAI-compatible", 0.5),
    label(329, 92, "provider", 4.4, "middle"),
    label(206, 154, "streamed back", 6),
    label(110, 210, "budget: held, then settled (planned)", 9)
  );
  return {
    label: "Diagram: requests from several clients pass a raised gate to a provider, and the reply streams back in pieces; budgets are to be held, then settled.",
    items,
  };
}

// Ride Radar: riders' trails converge on a checkpoint across a map grid; one
// stops, at their last known position.
function rideradar() {
  const items = [];
  [40, 100, 160, 220, 280, 340].forEach((x, i) => items.push({ kind: "grid", d: `M${x} 8V212`, step: i * 0.12, t: 500 }));
  [40, 100, 160].forEach((y, i) => items.push({ kind: "grid", d: `M8 ${y}H352`, step: 0.4 + i * 0.12, t: 500 }));
  const cp = [286, 62];
  items.push({ kind: "line", d: circle(cp[0], cp[1], 10), step: 1.4, t: 400 }, dot(cp[0], cp[1], 3, 1.6));
  const trails = [
    ["M18 198C60 180 90 150 120 130S200 96 246 82", [246, 82]],
    ["M64 212C90 172 150 170 170 142S230 104 264 92", [264, 92]],
    ["M128 212C150 186 196 176 214 150", [214, 150]],
    ["M222 212C240 182 268 150 278 114", [278, 114]],
  ];
  trails.forEach(([d, [x, y]], i) => {
    items.push({ kind: "line", d, step: 2.2 + i * 0.5, t: 900 }, dot(x, y, 4, 4.4 + i * 0.5));
  });
  items.push(
    { kind: "line", d: "M12 118C50 110 70 92 100 81", step: 3, t: 700 },
    { kind: "line", d: circle(104, 80, 4.5), step: 4.6, t: 300 },
    { kind: "faint", d: circle(104, 80, 10), step: 5.2, t: 400 },
    label(cp[0], 40, "checkpoint", 1.8, "middle"),
    label(40, 60, "last known position", 5.4),
    label(222, 172, "live", 5)
  );
  return {
    label: "Diagram: riders' trails converge on a checkpoint across a map grid; one rider's trail stops at their last known position.",
    items,
  };
}

// Skill Barter: you, your city around you, and people in it and beyond; a
// mutual match is a lens between you, one-way interest a single arc. Mutual
// matches come first and, among them, your own city: that one is bold.
function skillbarter() {
  const you = [118, 112];
  const items = [{ kind: "grid", d: circle(you[0], you[1], 80), step: 0.5, t: 900 }];
  const people = [
    [44, 150, "mutual", true],
    [62, -48, "one-way"],
    [76, 66, "mutual"],
    [96, -122, "one-way"],
    [100, 14, "mutual"],
    [150, -12, "one-way"],
    [186, 22, "mutual"],
  ];
  people.forEach(([dist, deg, kind, nearest], i) => {
    const at = polar(you, dist, deg);
    const k = r1(Math.max(6, dist * (dist > 120 ? 0.1 : 0.16)));
    items.push(
      { kind: nearest ? "bold" : "line", d: kind === "mutual" ? lens(you, at, k) : arc(at, you, k), step: 2 + i * 0.45, t: 520 },
      dot(at[0], at[1], 3.2, 2.4 + i * 0.45)
    );
  });
  items.push(
    dot(you[0], you[1], 4.5, 1.6),
    label(you[0], you[1] - 14, "you", 1.6, "middle"),
    label(170, 52, "one-way", 3),
    label(150, 198, "mutual", 3.6),
    label(18, 212, "your city first", 5)
  );
  return {
    label: "Diagram: you, with your city drawn around you and people inside it and beyond; mutual matches are joined by a lens, one-way interest by a single arc, and a mutual match in your own city is drawn bold.",
    items,
  };
}

const DIAGRAMS = { kavach, deepresearch, loopdetector, leetcode, tollgate, rideradar, skillbarter };

export default function Diagram({ id }) {
  const make = DIAGRAMS[id];
  if (!make) return null;
  const { label: description, items } = make();
  return (
    <div className="diagram">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={description}>
        {items.map((it, i) => {
          const style = { "--d": `${Math.round(START + it.step * STEP)}ms`, "--t": `${it.t ?? 600}ms` };
          if (it.kind === "dot") return <circle key={i} className="d-dot" cx={it.cx} cy={it.cy} r={it.r} style={style} />;
          if (it.kind === "label")
            return (
              <text key={i} className="d-label" x={it.x} y={it.y} textAnchor={it.anchor} style={style}>
                {it.text}
              </text>
            );
          return <path key={i} className={`d-${it.kind}`} d={it.d} pathLength="1" style={style} />;
        })}
      </svg>
    </div>
  );
}
