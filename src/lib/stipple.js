import { noise1, rng } from "./random.js";

// The ridges at the foot of the page: layers of distant hills in stippled ink,
// an ordered dither so the whole range is made of single dots on a grid, like
// a plotter stippling a hillside. Far ranges are pale and soft; the nearest is
// darkest. Drawn on a canvas in the page's ink colour.
//
// In the footer the scene goes on (drawRidges' options): cherry trees in
// blossom stand in front of the hills, and the sun sets behind them, on a
// canvas of its own so that it can sink as the page ends (styles.css).

const PITCH = 3; // CSS pixels between dot centres
const DOT = 1.6; // dot size
const PETAL = 2; // blossom dots are a little larger, to hold their colour
const WOOD = 2.2; // and the trees' wood, so it reads as the darkest ink

// 4×4 Bayer matrix: the order in which a cell's dots switch on as it darkens.
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((row) => row.map((v) => (v + 0.5) / 16));

// Far to near: where each range's foot sits (share of the height), how high
// its hills rise, how close together they are, and how dark it reads.
const RIDGES = [
  { base: 0.64, amp: 0.4, freq: 0.0032, tone: 0.16, seed: 5 },
  { base: 0.82, amp: 0.42, freq: 0.0044, tone: 0.28, seed: 9 },
  { base: 1.0, amp: 0.44, freq: 0.0058, tone: 0.44, seed: 14 },
  { base: 1.18, amp: 0.48, freq: 0.0076, tone: 0.7, seed: 22 },
];
const NOISE = RIDGES.map(({ seed }) => {
  const r = rng(seed);
  return [noise1(r), noise1(r), noise1(r)];
});

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// A fixed per-cell wobble, so flat tones don't read as a perfect screen.
const grain = (c, r) => ((((c * 73856093) ^ (r * 19349663)) >>> 0) % 1000) / 1000 - 0.5;

// A canvas sized to its box, in CSS pixels, at up to twice the pixel density.
function prepare(canvas, width, height) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  return ctx;
}

// `a` let into `b` by the share `t`: the seal red, paled for blossom.
function mix(a, b, t) {
  const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const [x, y] = [rgb(a), rgb(b)];
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(" ")})`;
}

// The cells (column, row) within `pad` of a box, clipped to the grid.
function cells(cols, rows, x0, y0, x1, y1, pad, visit) {
  const i0 = Math.max(0, Math.floor((x0 - pad) / PITCH));
  const i1 = Math.min(cols - 1, Math.ceil((x1 + pad) / PITCH));
  const j0 = Math.max(0, Math.floor((y0 - pad) / PITCH));
  const j1 = Math.min(rows - 1, Math.ceil((y1 + pad) / PITCH));
  for (let j = j0; j <= j1; j++) {
    for (let i = i0; i <= i1; i++) visit(i, j, i * PITCH + PITCH / 2, j * PITCH + PITCH / 2);
  }
}

// A cherry tree in blossom, grown from a seed: a short trunk that splits low
// into spreading limbs, each branching on into twigs, with clouds of blossom
// along the outer branches and a few petals falling. Marks its wood and its
// blossom in the two grids, one value per cell.
function cherry(seed, x0, y0, size, lean, grid) {
  const r = rng(seed);
  const { cols, rows, wood, bloom } = grid;

  const branch = (x, y, x1, y1, w0, w1) =>
    cells(cols, rows, Math.min(x, x1), Math.min(y, y1), Math.max(x, x1), Math.max(y, y1), Math.max(w0, w1), (i, j, px, py) => {
      const [dx, dy] = [x1 - x, y1 - y];
      const t = Math.min(1, Math.max(0, ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy || 1)));
      const half = Math.max(PITCH * 0.55, (w0 + (w1 - w0) * t) / 2);
      if (Math.hypot(x + t * dx - px, y + t * dy - py) <= half) wood[j * cols + i] = 1;
    });

  // Denser on its underside, as blossom shades itself.
  const cloud = (cx, cy, rad, tone) =>
    cells(cols, rows, cx - rad, cy - rad, cx + rad, cy + rad, 0, (i, j, px, py) => {
      const d = Math.hypot(px - cx, py - cy) / rad;
      if (d >= 1) return;
      const v = tone * (1 - d * d) * (0.8 + (0.35 * (py - cy)) / rad);
      if (v > bloom[j * cols + i]) bloom[j * cols + i] = v;
    });

  // `angle` is from the vertical, positive to the right. Each branch bends
  // once along its length, and the outer ones spread towards the level.
  const grow = (x, y, angle, length, width, depth) => {
    const bend = (r() - 0.5) * 0.5;
    const xm = x + Math.sin(angle + bend) * length * 0.5;
    const ym = y - Math.cos(angle + bend) * length * 0.5;
    const x1 = xm + Math.sin(angle - bend * 0.6) * length * 0.5;
    const y1 = ym - Math.cos(angle - bend * 0.6) * length * 0.5;
    branch(x, y, xm, ym, width, width * 0.84);
    branch(xm, ym, x1, y1, width * 0.84, width * 0.7);
    if (depth >= 1) {
      for (let k = 0, n = depth === 1 ? 2 : 3 + Math.floor(r() * 3); k < n; k++) {
        cloud(x1 + (r() - 0.5) * length * 1.1, y1 + (r() - 0.62) * length * 0.7, size * (0.05 + r() * 0.06), 0.5 + r() * 0.36);
      }
    }
    if (depth === 4) return;
    const n = depth === 0 ? 4 : r() < 0.35 ? 3 : 2;
    const spread = depth === 0 ? 1.15 : 0.62;
    for (let k = 0; k < n; k++) {
      let a = angle + ((k + 0.5) / n - 0.5) * 2 * spread + (r() - 0.5) * 0.3;
      a += Math.sign(a) * 0.1 * depth;
      a = Math.max(-1.75, Math.min(1.75, a));
      grow(x1, y1, a, length * (0.66 + r() * 0.12), width * 0.62, depth + 1);
    }
  };

  grow(x0, y0, lean, size * 0.3, size * 0.075, 0);

  // Petals on the air, drifting down and away from the tree.
  for (let k = 0; k < 26; k++) {
    const px = x0 + (r() - 0.5 + lean) * size * 1.5;
    const py = y0 - size * (0.05 + r() * 0.5);
    cells(cols, rows, px, py, px, py, 0, (i, j) => (bloom[j * cols + i] = 2));
  }
}

// The sun, low over the hills, in the seal red: where the far hills dip
// lowest between `from` and `to` (shares of the width), two-thirds clear of
// them at rest. Hazy streaks cross its lower half. Its canvas is clipped to
// the sky, so the hills hide whatever has set; `--rise` is how far above rest
// it starts.
function drawSun(canvas, sky, width, height, color, [from, to]) {
  const ctx = prepare(canvas, width, height);
  ctx.fillStyle = color;
  const cols = sky.length;
  const rows = Math.ceil(height / PITCH);

  let low = Math.round(cols * from);
  for (let i = low; i <= Math.round(cols * to); i++) if (sky[i] > sky[low]) low = i;
  const rad = Math.max(30, height * 0.19);
  const [sx, sy] = [low * PITCH + PITCH / 2, sky[low] - 0.35 * rad];

  cells(cols, rows, sx - rad, sy - rad, sx + rad, sy + rad, 0, (i, j, px, py) => {
    const d = Math.hypot(px - sx, py - sy) / rad;
    if (d > 1) return;
    let tone = d > 1 - (PITCH * 1.2) / rad ? 0.92 : 0.6 + 0.2 * (1 - d * d);
    const v = (py - sy) / rad;
    if (Math.abs(v - 0.22) < 0.05 || Math.abs(v - 0.5) < 0.04) tone *= 0.3;
    if (tone + grain(i, j) * 0.06 > BAYER[j & 3][i & 3]) ctx.fillRect(i * PITCH + (PITCH - DOT) / 2, py - DOT / 2, DOT, DOT);
  });

  canvas.style.setProperty("--rise", `${Math.round(rad)}px`);
  const outline = [];
  for (let i = cols - 1; i >= 0; i -= 2) outline.push(`${i * PITCH}px ${Math.round(sky[i])}px`);
  canvas.parentElement.style.clipPath = `polygon(0 0, ${width}px 0, ${outline.join(", ")}, 0 ${Math.round(sky[0])}px)`;
}

export function drawRidges(canvas, { sun, sakura } = {}) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (!width || !height) return;
  const ctx = prepare(canvas, width, height);
  const style = getComputedStyle(canvas);
  const ink = style.getPropertyValue("--ink").trim() || "#1a1a18";
  const seal = style.getPropertyValue("--seal").trim() || "#d3381c";
  const paper = style.getPropertyValue("--paper").trim() || "#f4f1ea";
  ctx.fillStyle = ink;

  const cols = Math.ceil(width / PITCH);
  const rows = Math.ceil(height / PITCH);

  // Each range's crest, per column: broad rolling hills with a little
  // roughness. Narrow screens see the same breadth of hills, compressed.
  const span = Math.max(1, 1100 / width);
  const crest = RIDGES.map((ridge, k) => {
    const [a, b, c] = NOISE[k];
    return Array.from({ length: cols }, (_, i) => {
      const t = i * PITCH * ridge.freq * span;
      const hills = Math.pow(1 - Math.abs(a(t)), 1.25);
      const rolls = 0.5 + 0.5 * b(t * 2.1 + 7);
      const rough = c(t * 9 + 3) * 0.05;
      return height * (ridge.base - ridge.amp * (0.6 * hills + 0.4 * rolls + rough));
    });
  });

  // The trees, each leaning in towards the middle: on a phone, one at the
  // left, clear of the name seal; on wider screens a second, larger, at the
  // right, beyond the seal. The sun sets in the gap they leave.
  const narrow = width < 640;
  const grid = sakura && { cols, rows, wood: new Uint8Array(cols * rows), bloom: new Float32Array(cols * rows) };
  if (grid) {
    const trees = narrow ? [[31, 0.1, 0.98, 0.14]] : [[17, 0.92, 1, -0.16], [31, 0.07, 0.78, 0.18]];
    for (const [seed, at, tall, lean] of trees) cherry(seed, width * at, height + 4, Math.min(height * tall, width * 0.42), lean, grid);
  }

  const petals = [];
  for (let j = 0; j < rows; j++) {
    const y = j * PITCH + PITCH / 2;
    const fade = smoothstep(0, height * 0.32, y); // the band fades in from above
    for (let i = 0; i < cols; i++) {
      const threshold = BAYER[j & 3][i & 3];
      if (grid) {
        const k = j * cols + i;
        const bloom = grid.bloom[k];
        if (bloom > 0 && bloom + grain(i, j) * 0.08 > threshold) {
          petals.push(i, j);
          continue;
        }
        if (grid.wood[k]) {
          if (0.94 > threshold) ctx.fillRect(i * PITCH + (PITCH - WOOD) / 2, y - WOOD / 2, WOOD, WOOD);
          continue;
        }
      }

      let layer = -1;
      for (let k = RIDGES.length - 1; k >= 0; k--) {
        if (y >= crest[k][i]) {
          layer = k;
          break;
        }
      }
      if (layer < 0) continue;

      // Darkest along each crest, thinning into mist below it; the nearest
      // range simply deepens toward the foreground.
      const below = y - crest[layer][i];
      const nearCrest = 1 - smoothstep(0, height * 0.22, below);
      let tone =
        layer === RIDGES.length - 1
          ? RIDGES[layer].tone * (0.75 + (0.45 * below) / height)
          : RIDGES[layer].tone * (0.32 + 0.68 * nearCrest);
      if (below < PITCH * 1.5) tone += 0.16; // a firmer line along each crest

      tone = (tone + grain(i, j) * 0.06) * fade;
      if (tone > threshold) ctx.fillRect(i * PITCH + (PITCH - DOT) / 2, y - DOT / 2, DOT, DOT);
    }
  }

  ctx.fillStyle = mix(seal, paper, 0.5);
  for (let n = 0; n < petals.length; n += 2) {
    ctx.fillRect(petals[n] * PITCH + (PITCH - PETAL) / 2, petals[n + 1] * PITCH + (PITCH - PETAL) / 2, PETAL, PETAL);
  }

  if (sun) {
    // The sky ends at the highest of the hills in each column.
    const sky = Array.from({ length: cols }, (_, i) => Math.min(...crest.map((c) => c[i])));
    drawSun(sun, sky, width, height, seal, narrow ? [0.36, 0.58] : [0.24, 0.44]);
  }
}
