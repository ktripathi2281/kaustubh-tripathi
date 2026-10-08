import { BAND, horizon, inPixels } from "./lib/ridge.js";
import { drawRidges } from "./lib/stipple.js";

// Everything the pages do in the browser. They arrive fully rendered (see
// entry-server.jsx), so this only adds the motion: scenes arriving once, the
// ink line drawing itself, and the stippled ridges. Without JavaScript every
// scene is simply there, with its line drawn whole.

const root = document.documentElement;
const motion = root.classList.contains("motion");
// Where CSS has no scroll timelines, the lines are drawn from here (below).
const byScroll = motion && !CSS.supports?.("animation-timeline: view()");
const clamp = (n) => Math.min(1, Math.max(0, n));

// Addresses from the catalogue design, so links shared before still land.
const ALIASES = { top: "opening", plates: "kavach", statement: "about", certificates: "about", chronology: "about", enquiries: "contact" };
const alias = ALIASES[decodeURIComponent(location.hash.slice(1))];
if (alias) document.getElementById(alias)?.scrollIntoView();

// The ink line, re-plotted in pixels at the screen's real size. As rendered,
// each horizon is stretched to fit, which keeps its stroke even but means its
// length can't be measured: browsers lay out dashes in screen pixels but
// measure `pathLength` in the stretched units. Re-plotted, the stroke can be
// drawn as a fraction of the line (styles.css, [data-px]).
const lines = new ResizeObserver((entries) => {
  for (const { target: svg, contentRect: box } of entries) {
    if (!box.width || !box.height) continue; // the other layout's line, not shown
    const { pts } = horizon(Number(svg.dataset.seed), svg.dataset.layout, Number(svg.dataset.end));
    const path = svg.firstChild;
    svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
    path.setAttribute("d", inPixels(pts, box.width / 100, box.height / (BAND[1] - BAND[0])));
    path.setAttribute("pathLength", "1");
    svg.dataset.px = "";
  }
  if (byScroll) onScroll();
});
document.querySelectorAll(".ink[data-seed]").forEach((svg) => lines.observe(svg));

// The ridges at the foot of the page, drawn again whenever their width changes.
for (const canvas of document.querySelectorAll(".ridges canvas")) {
  let width = 0;
  new ResizeObserver(() => {
    if (canvas.clientWidth === width) return;
    width = canvas.clientWidth;
    drawRidges(canvas);
    canvas.parentElement.classList.add("is-drawn");
  }).observe(canvas);
}

// A scene arrives when 60% of it is in view, or when it fills 60% of the
// screen (a tall scene on a short phone): its text fades in, its seal is
// stamped and, on a phone, its title shows in katakana for a moment.
if (motion) {
  const arrivals = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        const fills = en.intersectionRect.height >= 0.6 * (en.rootBounds?.height || innerHeight);
        if (en.intersectionRatio < 0.6 && !fills) continue;
        en.target.classList.add("is-here");
        arrivals.unobserve(en.target);
      }
    },
    { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] }
  );
  document.querySelectorAll(".scene").forEach((s) => arrivals.observe(s));
}

// Where CSS has no scroll timelines, draw the lines from here: each horizon
// as it rises from the bottom of the screen, complete a little above the
// middle; the last one with the page, complete at its end.
let frame = 0;
function draw() {
  frame = 0;
  for (const svg of document.querySelectorAll(".scene:not(.scene--opening) .ink[data-px]")) {
    const box = svg.getBoundingClientRect();
    if (!box.height || box.top > innerHeight || box.bottom < 0) continue;
    const cover = (innerHeight - box.top) / (innerHeight + box.height);
    svg.firstChild.style.strokeDashoffset = String(1 - clamp(cover / 0.42));
  }
  const end = root.scrollHeight - innerHeight;
  for (const svg of document.querySelectorAll(".site-footer .ink[data-px]")) {
    svg.firstChild.style.strokeDashoffset = String(1 - clamp((scrollY - (end - 0.7 * innerHeight)) / (0.7 * innerHeight)));
  }
}
function onScroll() {
  frame ||= requestAnimationFrame(draw);
}
if (byScroll) {
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
}
