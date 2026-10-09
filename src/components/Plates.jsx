import { arrow, box, circle, polar, r1 } from "../lib/draw.js";
import { noise1, rng } from "../lib/random.js";

// A large drawing behind each essay's opening, set very light: the picture at
// the heart of the project, redrawn in ink after the images made for the works,
// with none of their words, numbers or ornaments. Lines of text are only their
// rhythm (`words`). Each item is a stroke ("line", "fine", "faint", "bold") or
// a filled shape ("fill"), with the step it is drawn at (styles.css, Plates).

const W = 1200;
const H = 675;
const START = 200; // ms after the page loads
const STEP = 70; // ms between steps

const ink = (kind, d, step, t = 800) => ({ kind, d, step, t });

// A line of words as strokes, `width` long.
function words(r, x, y, width, gap = 9) {
  let d = "";
  for (let at = x; at < x + width - 10; ) {
    const w = Math.min(x + width - at, 14 + r() * 44);
    d += `M${r1(at)} ${r1(y)}h${r1(w)}`;
    at += w + gap;
  }
  return d;
}

// A rectangle turned by `deg` about its centre: a sheet of paper, askew.
function sheet(cx, cy, w, h, deg) {
  const a = (deg * Math.PI) / 180;
  const corner = ([x, y]) => `${r1(cx + x * Math.cos(a) - y * Math.sin(a))} ${r1(cy + x * Math.sin(a) + y * Math.cos(a))}`;
  const [hw, hh] = [w / 2, h / 2];
  return `M${corner([-hw, -hh])}L${corner([hw, -hh])}L${corner([hw, hh])}L${corner([-hw, hh])}Z`;
}

// Kavach: words in many languages, spoken or typed, gathered into one case
// file, and ten steps in order beside it, with clocks on the deadlines.
function kavach() {
  const r = rng(11);
  const items = [];
  const wave = [];
  for (let i = 0; i < 40; i++) {
    const h = 6 + Math.sin((i / 39) * Math.PI) * (12 + r() * 44);
    wave.push(`M${r1(96 + i * 6)} ${r1(166 - h / 2)}v${r1(h)}`);
  }
  items.push(ink("line", box(56, 122, 304, 88, 44), 0, 1000), ink("fine", wave.join(""), 0.8, 900));
  for (let i = 0; i < 5; i++) {
    const y = 250 + i * 62;
    items.push(ink(i < 3 ? "line" : "faint", box(76, y, 264, 44, 22), 1.6 + i * 0.5, 600));
    items.push(ink("faint", words(r, 100, y + 22, 140 + r() * 60), 2 + i * 0.5, 500));
  }
  items.push(ink("line", "M360 166C420 166 406 300 458 300", 4, 700));

  items.push(ink("faint", sheet(628, 352, 320, 450, -5), 4.6, 1200), ink("faint", sheet(628, 352, 320, 450, 3), 5, 1200));
  items.push(ink("line", box(468, 127, 320, 450, 4), 5.4, 1200));
  items.push(ink("line", "M612 96V150a11 11 0 0 0 22 0V86a15 15 0 0 0 -30 0V146", 6, 600));
  items.push(ink("bold", "M496 176h104", 6.4, 400), ink("faint", "M496 198h150", 6.6, 400));
  items.push(ink("line", `${box(734, 162, 26, 30, 5)}M747 170v14M740 177h14`, 6.8, 300));
  items.push(ink("fine", "M496 226H760", 7, 500));
  for (let k = 0; k < 3; k++) {
    const x = 496 + k * 92;
    items.push(ink("faint", `M${x} 254h44`, 7.2 + k * 0.2, 300), ink("line", `M${x} 276h${54 + r() * 18}`, 7.3 + k * 0.2, 300));
  }
  items.push(ink("fine", "M496 304H760", 7.8, 500));
  for (let k = 0; k < 4; k++) {
    const y = 338 + k * 44;
    items.push(ink("line", `${box(496, y - 12, 18, 22, 3)}M501 ${y}h8`, 8 + k * 0.3, 300));
    items.push(ink("faint", words(r, 528, y, 150 + r() * 30), 8.2 + k * 0.3, 400));
    items.push(ink("faint", box(722, y - 9, 36, 18, 4), 8.3 + k * 0.3, 300));
  }
  const bars = [];
  for (let x = 652, k = 0; x < 760; k++) {
    bars.push(`M${x} 524v26`);
    x += [3, 5, 4, 7, 3, 6][k % 6];
  }
  items.push(ink("fine", bars.join(""), 9.6, 500));

  const tx = 878;
  items.push(ink("faint", `M${tx} 118V586`, 10, 1300));
  for (let i = 0; i < 10; i++) {
    const y = 118 + i * 52;
    items.push(ink(i === 0 ? "fill" : "line", circle(tx, y, 8), 10.4 + i * 0.35, 300));
    items.push(ink(i < 6 ? "line" : "faint", words(r, tx + 32, y, 110 + r() * 90), 10.6 + i * 0.35, 400));
  }
  for (const i of [2, 3, 5]) {
    const [x, y] = [1150, 118 + i * 52];
    items.push(ink("line", `${circle(x, y, 13)}M${x} ${y}V${y - 8}M${x} ${y}H${x + 6}`, 14.6 + i * 0.3, 500));
  }
  return items;
}

// DeepResearch: documents, each threaded to the centre, and an answer whose
// lines cite them, with the sources it cites beneath.
function deepresearch() {
  const r = rng(23);
  const items = [];
  const [nx, ny] = [560, 338];
  for (let i = 0; i < 5; i++) {
    const y = 104 + i * 100;
    items.push(ink(i < 4 ? "line" : "faint", box(70, y, 244, 78, 8), i * 0.5, 800));
    items.push(ink("line", `${box(92, y + 20, 28, 36, 3)}M100 ${y + 34}h12M100 ${y + 43}h12`, 0.5 + i * 0.5, 400));
    items.push(ink("faint", `${words(r, 140, y + 32, 150)}${words(r, 140, y + 52, 110)}`, 0.7 + i * 0.5, 500));
    items.push(ink("line", `M314 ${y + 39}C428 ${y + 39} 432 ${ny} ${nx - 48} ${ny}`, 3 + i * 0.3, 900));
  }
  items.push(ink("line", circle(nx, ny, 48), 5, 900), ink("faint", circle(nx, ny, 32), 5.4, 700));
  items.push(ink("line", `M${nx - 14} ${ny - 10}h28M${nx - 14} ${ny}h28M${nx - 14} ${ny + 10}h18`, 5.8, 400));
  items.push(ink("line", `M${nx + 48} ${ny}H664`, 6.4, 400), ink("line", arrow(668, ny, 0, 10), 6.8, 200));

  items.push(ink("line", box(684, 84, 470, 508, 12), 7, 1200));
  items.push(ink("line", box(708, 108, 422, 52, 26), 7.8, 800));
  items.push(ink("line", `${circle(738, 133, 9)}M745 140l8 8`, 8.2, 300));
  items.push(ink("faint", words(r, 766, 134, 280), 8.4, 500));
  items.push(ink("line", `${circle(1102, 134, 15)}M1095 134h13M1103 128l6 6l-6 6`, 8.6, 400));
  let y = 204;
  for (let i = 0; i < 9; i++) {
    const w = i === 3 ? 170 : 250 + r() * 120;
    items.push(ink("line", words(r, 708, y, w), 9.2 + i * 0.35, 500));
    if ([1, 4, 6, 8].includes(i)) {
      const x = r1(708 + w + 10);
      items.push(ink("line", `M${x + 6} ${y - 9}h-6v18h6M${x + 18} ${y - 9}h6v18h-6`, 9.6 + i * 0.35, 250));
      items.push(ink("fill", circle(x + 12, y, 2.2), 9.8 + i * 0.35));
    }
    y += i === 3 ? 42 : 28;
  }
  for (let k = 0; k < 3; k++) {
    const x = 708 + k * 144;
    items.push(ink("faint", box(x, 470, 128, 92, 8), 13 + k * 0.4, 600));
    items.push(ink("line", `M${x + 16} 492h20`, 13.3 + k * 0.4, 250));
    items.push(ink("faint", `${words(r, x + 16, 516, 96)}${words(r, x + 16, 536, 70)}`, 13.5 + k * 0.4, 400));
  }
  return items;
}

// Loop Detector: four steps going round, the same arc again and again, and a
// mark where the loop is caught; beside it, the same lines, repeated.
function loopdetector() {
  const r = rng(37);
  const items = [];
  const c = [420, 340];
  const R = 196;
  items.push(ink("faint", circle(c[0], c[1], R + 34), 0, 1600), ink("faint", circle(c[0], c[1], 118), 0.6, 1400));
  const at = [-90, 0, 90, 180];
  at.forEach((deg, i) => {
    const [x, y] = polar(c, R, deg);
    items.push(ink("line", box(x - 86, y - 34, 172, 68, 12), 2 + i * 0.4, 700));
    items.push(ink("line", box(x - 66, y - 15, 22, 30, 3), 2.3 + i * 0.4, 300));
    items.push(ink("line", words(r, x - 30, y - 6, 96), 2.5 + i * 0.4, 400));
    items.push(ink("faint", words(r, x - 30, y + 12, 64), 2.6 + i * 0.4, 400));
  });
  for (let i = 0; i < 4; i++) {
    const [a0, a1] = [at[i] + 25, at[i] + 65];
    const [x0, y0] = polar(c, R, a0);
    const [x1, y1] = polar(c, R, a1);
    items.push(ink(i === 1 ? "bold" : "line", `M${r1(x0)} ${r1(y0)}A${R} ${R} 0 0 1 ${r1(x1)} ${r1(y1)}`, 4.4 + i * 0.6, 700));
    items.push(ink(i === 1 ? "bold" : "line", arrow(x1, y1, ((a1 + 90) * Math.PI) / 180, 13), 4.9 + i * 0.6, 200));
  }
  const [mx, my] = polar(c, R + 58, 45);
  items.push(ink("line", circle(mx, my, 26), 7.6, 500), ink("bold", `M${r1(mx)} ${r1(my - 13)}v15`, 8, 200), ink("fill", circle(mx, my + 11, 2.8), 8.2));
  items.push(ink("faint", circle(c[0], c[1], 14), 8.4, 400));

  items.push(ink("line", box(772, 96, 388, 372, 14), 9, 1100), ink("fine", "M772 136H1160", 9.6, 600));
  [796, 814, 832].forEach((x, i) => items.push(ink("line", circle(x, 116, 5), 9.8 + i * 0.1, 200)));
  const lines = [100 + r() * 60, 80 + r() * 50, 150 + r() * 40, 210];
  for (let g = 0; g < 3; g++) {
    lines.forEach((w, k) => {
      const y = 170 + g * 94 + k * 20;
      items.push(ink("faint", `M796 ${y}h34`, 10.2 + g * 0.9 + k * 0.15, 200));
      items.push(ink(k === 3 ? "line" : "faint", words(rng(41 + k), 846, y, w), 10.3 + g * 0.9 + k * 0.15, 400));
    });
  }
  items.push(ink("line", "M1112 164h12V446h-12M1124 305h14", 13.4, 800));
  items.push(ink("fill", circle(800, 522, 7), 14), ink("faint", words(r, 822, 522, 300), 14.2, 600));
  return items;
}

// LeetCode Agent Tracker: three agents (a planner, a tutor, a reviewer) joined
// into one session, the work they share, and a few weeks of practice.
function leetcode() {
  const r = rng(53);
  const items = [];
  [330, 620, 910].forEach((x, i) => {
    items.push(ink("line", box(x, 64, 250, 166, 12), i * 0.5, 900));
    const [ix, iy] = [x + 28, 90];
    const icon = [
      `${box(ix, iy, 30, 38, 4)}M${ix + 8} ${iy + 13}h14M${ix + 8} ${iy + 21}h14M${ix + 8} ${iy + 29}h9`,
      `${box(ix, iy, 42, 28, 9)}M${ix + 10} ${iy + 28}l-2 10l11 -10M${ix + 11} ${iy + 14}h20`,
      `M${ix + 12} ${iy + 6}l-12 13l12 13M${ix + 34} ${iy + 6}l12 13l-12 13M${ix + 27} ${iy + 2}l-8 34`,
    ][i];
    items.push(ink("line", icon, 0.4 + i * 0.5, 500));
    items.push(ink("bold", `M${x + 28} 162h${110 + r() * 30}`, 0.8 + i * 0.5, 400));
    items.push(ink("faint", `${words(r, x + 28, 190, 194)}${words(r, x + 28, 210, 150)}`, 1 + i * 0.5, 500));
  });
  items.push(ink("line", "M455 230V266Q455 288 477 288H731", 3, 700));
  items.push(ink("line", "M745 230V274", 3.2, 400));
  items.push(ink("line", "M1035 230V266Q1035 288 1013 288H759", 3.4, 700));
  items.push(ink("line", circle(745, 288, 14), 4, 400), ink("fill", circle(745, 288, 5), 4.3));
  items.push(ink("line", box(615, 318, 260, 44, 22), 4.6, 600), ink("line", words(r, 662, 340, 166), 5, 400));
  items.push(ink("line", "M745 362V404", 5.4, 300), ink("line", arrow(745, 410, Math.PI / 2, 10), 5.6, 200));

  items.push(ink("line", box(330, 420, 830, 290, 14), 6, 1200), ink("fine", "M330 454H1160", 6.4, 700));
  [354, 370, 386].forEach((x, i) => items.push(ink("line", circle(x, 437, 4), 6.5 + i * 0.1, 200)));
  for (let k = 0; k < 4; k++) {
    const y = 482 + k * 34;
    items.push(ink("faint", `${box(354, y, 14, 14, 3)}M378 ${y + 7}h${44 + r() * 22}`, 7 + k * 0.2, 300));
  }
  items.push(ink("bold", "M472 494h210", 7.4, 400));
  for (let k = 0; k < 5; k++) items.push(ink("faint", words(r, 472, 528 + k * 22, 220 + r() * 36), 7.6 + k * 0.2, 400));
  items.push(ink("line", box(760, 474, 378, 201, 8), 8, 900));
  [0, 1, 2, 2, 2, 1, 2, 3, 1].forEach((indent, k) => {
    const x = 790 + indent * 26;
    items.push(ink(k % 3 === 0 ? "line" : "faint", words(r, x, 500 + k * 19, Math.min(1112 - x, 110 + r() * 140)), 8.4 + k * 0.15, 300));
  });
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 7; col++) {
      const done = r() < 0.42;
      items.push(ink(done ? "fill" : "faint", box(72 + col * 30, 452 + row * 30, 20, 20, 3), 9 + (row * 7 + col) * 0.05, 200));
    }
  }
  return items;
}

// Tollgate: requests from several clients run up a road through a raised
// barrier, and fan out from the far end to the providers; the reply comes
// back down the road in pieces. A road barrier, not a shrine gate.
function tollgate() {
  const r = rng(71);
  const items = [];
  const vp = [600, 200];
  // The road, narrowing towards the far end; x of either edge at height y.
  const edge = (x0, y) => r1(x0 + (vp[0] - x0) * ((H - y) / (H - vp[1])));
  items.push(ink("line", `M300 ${H}L${edge(300, 232)} 232`, 0, 1200), ink("line", `M900 ${H}L${edge(900, 232)} 232`, 0.2, 1200));
  // The lane markings shorten with distance: each one a fixed share of the
  // way left to the far end.
  const lane = [];
  for (let y = 668; y - vp[1] > 40; y -= (y - vp[1]) * 0.2) lane.push(`M600 ${r1(y)}V${r1(y - (y - vp[1]) * 0.12)}`);
  items.push(ink("bold", lane.join(""), 1, 900));

  // The barrier: a booth beside the road, a post, and the arm, raised.
  items.push(ink("line", box(812, 316, 140, 18, 3), 2, 500), ink("line", box(824, 334, 116, 166, 4), 2.3, 800));
  items.push(ink("faint", box(842, 356, 80, 58, 5), 2.8, 500), ink("fine", "M792 500H972", 2.6, 500));
  items.push(ink("bold", "M796 500V448", 3.2, 300), ink("line", circle(796, 440, 9), 3.4, 300));
  const a = (-24 * Math.PI) / 180;
  const along = (d, off) => [796 - d * Math.cos(a) + off * Math.sin(a), 440 + d * Math.sin(a) + off * Math.cos(a)].map(r1);
  const [p0, p1, p2, p3] = [along(12, -7), along(400, -7), along(400, 7), along(12, 7)];
  items.push(ink("line", `M${p0}L${p1}L${p2}L${p3}Z`.replaceAll(",", " "), 3.8, 900));
  const stripes = [];
  for (let d = 50; d < 390; d += 46) {
    const [s0, s1] = [along(d, 7), along(d + 14, -7)];
    stripes.push(`M${s0[0]} ${s0[1]}L${s1[0]} ${s1[1]}`);
  }
  items.push(ink("line", stripes.join(""), 4.6, 600));

  // The clients, joining the road at its near end.
  for (let i = 0; i < 3; i++) {
    const y = 470 + i * 66;
    items.push(ink("line", box(40, y, 170, 50, 10), 5.4 + i * 0.4, 600));
    items.push(ink("line", box(58, y + 15, 20, 20, 4), 5.6 + i * 0.4, 300), ink("faint", words(r, 92, y + 25, 98), 5.7 + i * 0.4, 400));
    // Each joins the road in its own order, so the three never cross.
    const [ex, ey] = [440 + i * 14, 590 + i * 24];
    items.push(ink("faint", `M210 ${y + 25}C300 ${y + 25} 340 ${ey} ${ex} ${ey}`, 6.2 + i * 0.4, 700));
  }
  // The providers, from the far end.
  for (let i = 0; i < 4; i++) {
    const y = 40 + i * 78;
    items.push(ink("line", `M${vp[0] + 8} ${vp[1] + 26}C700 ${vp[1] + 26} 860 ${y + 26} 974 ${y + 26}`, 8 + i * 0.4, 900));
    items.push(ink("line", arrow(980, y + 26, 0, 10), 8.6 + i * 0.4, 200));
    items.push(ink("line", box(992, y, 176, 52, 10), 9 + i * 0.4, 600));
    items.push(ink("line", circle(1020, y + 26, 11), 9.2 + i * 0.4, 300), ink("faint", words(r, 1044, y + 26, 100), 9.3 + i * 0.4, 400));
  }
  return items;
}

// Ride Radar: a contour map with a river, the group's route with three
// riders on it, rings around one calling for help, and one rider's trail
// breaking off where the signal went, to their last known position.
function rideradar() {
  const r = rng(89);
  const n = noise1(r);
  const items = [];
  [
    [300, 214, 6],
    [800, 150, 5],
    [1030, 540, 4],
  ].forEach(([cx, cy, rings], p) => {
    // One shape for the rise, each ring a larger copy with a little wobble of
    // its own, never enough to cross the next: contours don't cross.
    const shape = (t) => n(p * 60 + 2.4 * Math.cos(t)) + n(p * 60 + 31 + 2.4 * Math.sin(t));
    for (let k = 1; k <= rings; k++) {
      let d = "";
      for (let j = 0; j <= 48; j++) {
        const t = (j / 48) * Math.PI * 2;
        const rr = (24 + 28 * k) * (1 + 0.16 * shape(t)) + 5 * n(p * 60 + 90 + k * 7 + 1.6 * Math.cos(t) + 1.6 * Math.sin(t));
        d += `${j ? "L" : "M"}${Math.round(cx + rr * 1.3 * Math.cos(t))} ${Math.round(cy + rr * Math.sin(t))}`;
      }
      items.push(ink(k === rings ? "faint" : "fine", d, p * 0.8 + k * 0.3, 1100));
    }
  });
  for (const shift of [0, 18]) {
    let d = "";
    for (let x = -10; x <= W + 10; x += 24) d += `${x < 0 ? "M" : "L"}${x} ${Math.round(600 - x * 0.16 + 20 * n(x / 110 + 9) + shift)}`;
    items.push(ink("faint", d, 2.4, 1400));
  }

  items.push(ink("bold", "M30 470C150 452 220 380 330 388S520 330 600 356S760 428 860 362S990 296 1060 282", 4, 1600));
  [
    [330, 388],
    [600, 356],
    [860, 362],
  ].forEach(([x, y], i) => items.push(ink("line", circle(x, y, 18), 6 + i * 0.4, 400), ink("fill", circle(x, y, 7), 6.2 + i * 0.4)));
  [48, 80, 112].forEach((rr, i) => items.push(ink("faint", circle(600, 356, rr), 7.4 + i * 0.4, 700)));

  const dashes = [];
  for (let s = 0; s < 1; s += 0.1) {
    const at = (t) => [1060 + 40 * t + 30 * t * t, 282 - 76 * t - 40 * t * t];
    const [a, b] = [at(s), at(s + 0.05)];
    dashes.push(`M${r1(a[0])} ${r1(a[1])}L${r1(b[0])} ${r1(b[1])}`);
  }
  items.push(ink("line", dashes.join(""), 8.6, 700), ink("line", circle(1134, 160, 14), 9.4, 400), ink("faint", circle(1134, 160, 26), 9.7, 500));
  items.push(ink("line", "M70 628H330M70 620V636M200 622V634M330 620V636", 10.2, 600));
  return items;
}

// Skill Barter: two people, what each offers and wants, and the trade between
// them; beneath, its four steps: find, connect, agree, learn.
function skillbarter() {
  const r = rng(97);
  const items = [];
  [170, 730].forEach((x, i) => {
    const y = 110;
    items.push(ink("line", box(x, y, 300, 450, 12), i * 0.6, 1000));
    const [cx, cy] = [x + 72, y + 82];
    items.push(ink("line", circle(cx, cy, 46), 0.5 + i * 0.6, 600));
    items.push(ink("line", `${circle(cx, cy - 12, 15)}M${cx - 27} ${cy + 32}Q${cx} ${cy + 2} ${cx + 27} ${cy + 32}`, 0.8 + i * 0.6, 500));
    items.push(ink("bold", `M${x + 136} ${y + 72}h${80 + r() * 30}`, 1 + i * 0.6, 400), ink("faint", words(r, x + 136, y + 100, 120), 1.2 + i * 0.6, 400));
    const pills = (y0, widths, step) => {
      let at = x + 30;
      let row = y0;
      widths.forEach((w, k) => {
        if (at + w > x + 274) [at, row] = [x + 30, row + 44];
        items.push(ink("line", box(at, row, w, 32, 16), step + k * 0.2, 400));
        at += w + 12;
      });
    };
    items.push(ink("faint", `M${x + 30} ${y + 176}h70`, 1.5 + i * 0.6, 300));
    pills(y + 194, [70, 100, 118], 1.7 + i * 0.6);
    items.push(ink("faint", `M${x + 30} ${y + 304}h62`, 2.4 + i * 0.6, 300));
    pills(y + 322, [104, 92], 2.6 + i * 0.6);
    items.push(ink(i ? "bold" : "faint", box(x + 30, y + 388, 240, 40, 8), 3 + i * 0.6, 500));
  });

  const c = [600, 335];
  items.push(ink("faint", "M600 64V592", 4, 1400), ink("faint", circle(c[0], c[1], 98), 4.4, 1000), ink("line", circle(c[0], c[1], 52), 4.8, 800));
  [200, 340, 20, 160].forEach((deg, k) => {
    const [x, y] = polar(c, 98, deg);
    items.push(ink("fill", circle(x, y, 5), 5.4 + k * 0.2));
  });
  [130, 205, 465, 540].forEach((y, k) => items.push(ink("fill", circle(600, y, 4), 5.6 + k * 0.2)));
  items.push(ink("bold", "M576 321H622", 6, 300), ink("bold", arrow(626, 321, 0, 11), 6.3, 200));
  items.push(ink("bold", "M624 349H578", 6.5, 300), ink("bold", arrow(574, 349, Math.PI, 11), 6.8, 200));

  items.push(ink("faint", "M300 632H900", 7.4, 900));
  [300, 500, 700, 900].forEach((x, k) => {
    items.push(ink("line", circle(x, 632, 22), 7.8 + k * 0.4, 400));
    const icon = [
      `${circle(x - 3, 629, 8)}M${x + 3} 635l7 7`,
      `M${x - 9} 626h16M${x + 3} 622l4 4l-4 4M${x + 9} 638h-16M${x - 3} 634l-4 4l4 4`,
      `M${x - 8} 633l5 5l11 -12`,
      `M${x - 8} 641v-8M${x} 641v-14M${x + 8} 641v-20`,
    ][k];
    items.push(ink("line", icon, 8 + k * 0.4, 300));
  });
  return items;
}

const PLATES = { kavach, deepresearch, loopdetector, leetcode, tollgate, rideradar, skillbarter };

export default function Plate({ id }) {
  const draw = PLATES[id];
  if (!draw) return null;
  return (
    <svg className="plate" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
      {draw().map(({ kind, d, step, t }, i) => (
        <path
          key={i}
          className={`p-${kind}`}
          d={d}
          pathLength={kind === "fill" ? undefined : 1}
          style={{ "--d": `${Math.round(START + step * STEP)}ms`, "--t": `${t}ms` }}
        />
      ))}
    </svg>
  );
}
