import { noise1, rng } from "./random.js";

// The ridges at the foot of the page: layers of distant hills in stippled ink,
// an ordered dither so the whole range is made of single dots on a grid, like
// a plotter stippling a hillside. Far ranges are pale and soft; the nearest is
// darkest. Drawn on a canvas in the page's ink colour.

const PITCH = 3; // CSS pixels between dot centres
const DOT = 1.6; // dot size

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

export function drawRidges(canvas) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (!width || !height) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = getComputedStyle(canvas).getPropertyValue("--ink").trim() || "#1a1a18";

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

  for (let j = 0; j < rows; j++) {
    const y = j * PITCH + PITCH / 2;
    const fade = smoothstep(0, height * 0.32, y); // the band fades in from above
    for (let i = 0; i < cols; i++) {
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
      if (tone > BAYER[j & 3][i & 3]) ctx.fillRect(i * PITCH + (PITCH - DOT) / 2, y - DOT / 2, DOT, DOT);
    }
  }
}
