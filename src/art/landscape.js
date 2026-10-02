import { rng, noise1 } from "../lib/random.js";

// The footer's last drawing: layered ridges and a setting sun, rendered as an
// ordered dither so the whole landscape is made of single dots on a grid,
// like a plotter stippling a hillside. Drawn on a canvas in the page's own ink.
// The link-preview cards (cards.html) draw the same landscape.

const PITCH = 3; // CSS pixels between dot centres
const DOT = 1.7; // dot size

// 4×4 Bayer matrix: the order in which a cell's dots switch on as it darkens.
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((row) => row.map((v) => (v + 0.5) / 16));

// Far to near: where each range's foot sits (share of the height), how high
// its peaks rise, how close together they are, and how dark it reads. The
// nearest range sits mostly below the frame, so only its summits show.
const RIDGES = [
  { base: 0.56, amp: 0.4, freq: 0.0015, tone: 0.24, seed: 3 },
  { base: 0.74, amp: 0.42, freq: 0.0022, tone: 0.42, seed: 8 },
  { base: 0.92, amp: 0.44, freq: 0.0031, tone: 0.64, seed: 13 },
  { base: 1.1, amp: 0.48, freq: 0.0044, tone: 0.92, seed: 21 },
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

export function drawHorizon(canvas) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (!width || !height) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const css = getComputedStyle(document.documentElement);
  const color = {
    near: css.getPropertyValue("--ink").trim() || "#1b1a17",
    far: css.getPropertyValue("--ink-2").trim() || "#45413a",
    sun: css.getPropertyValue("--accent").trim() || "#b3381b",
    haze: css.getPropertyValue("--muted").trim() || "#6c665b",
  };

  const cols = Math.ceil(width / PITCH);
  const rows = Math.ceil(height / PITCH);

  // Each range's crest, per column. "Ridged" noise (one minus the absolute
  // value) folds smooth hills into sharp summits. Narrow screens see the same
  // breadth of terrain, compressed, rather than a sliver of one hillside.
  const span = Math.max(1, 1100 / width);
  const crest = RIDGES.map((ridge, k) => {
    const [a, b, c] = NOISE[k];
    return Array.from({ length: cols }, (_, i) => {
      const t = i * PITCH * ridge.freq * span;
      const peaks = Math.pow(1 - Math.abs(a(t)), 1.6);
      const rolls = 0.5 + 0.5 * b(t * 2.3 + 7);
      const rough = c(t * 9 + 3) * 0.06;
      const profile = 0.66 * peaks + 0.34 * rolls + rough;
      return height * (ridge.base - ridge.amp * profile);
    });
  });

  // The sun sets into the deepest dip of the far ridge on the right-hand
  // side, so it sits in a valley at any width.
  const sunR = Math.max(22, Math.min(width * 0.07, height * 0.2));
  let dip = Math.floor(cols * 0.55);
  for (let i = dip; i < Math.floor(cols * 0.8); i++) if (crest[0][i] > crest[0][dip]) dip = i;
  const sunX = dip * PITCH + PITCH / 2;
  // Never higher than the band's fade, where it would meet the text above.
  const sunY = Math.max(crest[0][dip] - sunR * 0.45, height * 0.3 + sunR * 0.6);
  const dots = { near: [], far: [], sun: [], haze: [] };

  for (let j = 0; j < rows; j++) {
    const y = j * PITCH + PITCH / 2;
    const fade = smoothstep(0, height * 0.3, y); // the band fades in from above
    for (let i = 0; i < cols; i++) {
      const x = i * PITCH + PITCH / 2;
      let layer = -1;
      for (let k = RIDGES.length - 1; k >= 0; k--) {
        if (y >= crest[k][i]) {
          layer = k;
          break;
        }
      }

      let tone;
      let ink;
      if (layer >= 0) {
        const line = crest[layer];
        const below = y - line[i];
        // Darkest along the crest, thinning into valley mist below it; the
        // front range simply deepens toward the foreground.
        const nearCrest = 1 - smoothstep(0, height * 0.24, below);
        tone =
          layer === RIDGES.length - 1
            ? RIDGES[layer].tone * (0.8 + (0.4 * below) / height)
            : RIDGES[layer].tone * (0.38 + 0.62 * nearCrest);
        // Light from the sun's side: slopes falling toward it read lighter.
        const slope = (line[Math.min(cols - 1, i + 1)] - line[Math.max(0, i - 1)]) / (2 * PITCH);
        const facing = x < sunX ? slope : -slope;
        tone -= 0.2 * Math.max(-1, Math.min(1, facing)) * nearCrest;
        if (below < PITCH * 1.5) tone += 0.2; // a firmer line along each crest
        ink = layer >= 2 ? "near" : "far";
      } else {
        const d = Math.hypot(x - sunX, y - sunY) / sunR;
        if (d < 1) {
          tone = 0.62 - 0.22 * d;
          ink = "sun";
        } else {
          tone = 0.06 * (y / height);
          ink = "haze";
        }
      }

      tone = (tone + grain(i, j) * 0.07) * fade;
      if (tone > BAYER[j & 3][i & 3]) dots[ink].push(x - DOT / 2, y - DOT / 2);
    }
  }

  for (const [ink, list] of Object.entries(dots)) {
    ctx.fillStyle = color[ink];
    for (let n = 0; n < list.length; n += 2) ctx.fillRect(list[n], list[n + 1], DOT, DOT);
  }
}
