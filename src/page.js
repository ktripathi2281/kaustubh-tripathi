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

// The opening (components/Intro.jsx) plays on its own, in CSS. Any touch,
// key or scroll skips it.
if (root.classList.contains("intro-on")) {
  const events = ["pointerdown", "keydown", "wheel", "touchstart"];
  const skip = () => {
    root.classList.add("intro-skip");
    events.forEach((e) => removeEventListener(e, skip, true));
  };
  events.forEach((e) => addEventListener(e, skip, { capture: true, passive: true }));
  document.querySelector(".intro-sheet")?.addEventListener("animationend", (e) => {
    if (e.target === e.currentTarget) events.forEach((ev) => removeEventListener(ev, skip, true));
  });
}

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

// The ridges at the foot of the page, with their trees and setting sun, drawn
// again whenever their width changes.
for (const ridges of document.querySelectorAll(".ridges")) {
  const land = ridges.querySelector(".ridges-land");
  const sun = ridges.querySelector(".ridges-sun");
  let width = 0;
  new ResizeObserver(() => {
    if (land.clientWidth === width) return;
    width = land.clientWidth;
    drawRidges(land, { sun, sakura: true });
    ridges.classList.add("is-drawn");
    if (byScroll) onScroll();
  }).observe(land);
}

// A scene arrives when a third of it is in view, or when it fills a third of
// the screen (a tall scene on a short phone): its text fades in, its seal is
// stamped and, on a phone, its title shows in katakana for a moment.
if (motion) {
  const arrivals = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        const fills = en.intersectionRect.height >= 0.35 * (en.rootBounds?.height || innerHeight);
        if (en.intersectionRatio < 0.35 && !fills) continue;
        en.target.classList.add("is-here");
        arrivals.unobserve(en.target);
      }
    },
    { threshold: [0, 0.15, 0.25, 0.35, 0.5, 0.75, 1] }
  );
  // The points on the Background timeline arrive the same way, one by one.
  document.querySelectorAll(".scene, .tl-item").forEach((s) => arrivals.observe(s));
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
  const last = clamp((scrollY - (end - 0.7 * innerHeight)) / (0.7 * innerHeight));
  for (const svg of document.querySelectorAll(".site-footer .ink[data-px]")) {
    svg.firstChild.style.strokeDashoffset = String(1 - last);
  }
  // The sun sets as the hills rise into view, to rest as the page ends.
  for (const sun of document.querySelectorAll(".ridges-sun")) {
    const hills = sun.closest(".ridges").getBoundingClientRect();
    const risen = clamp((innerHeight - hills.top) / hills.height);
    sun.style.transform = `translateY(${-(1 - risen) * (parseFloat(sun.style.getPropertyValue("--rise")) || 0)}px)`;
  }
}
function onScroll() {
  frame ||= requestAnimationFrame(draw);
}
if (byScroll) {
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
}

// The letter in the footer (components/Letter.jsx), sent in place. It goes
// first by the site's own relay (api/letter.js), then straight to Web3Forms;
// each try gives up after 12 seconds. If neither gets through, the letter is
// offered to the visitor's own mail app, already written.
const letter = document.querySelector("form[data-letter]");

async function post(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(12000),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) throw new Error(json.message || `HTTP ${res.status}`);
}

letter?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = new FormData(letter);
  const status = letter.querySelector(".letter-status");
  const send = letter.querySelector(".letter-send");
  const name = String(form.get("name")).trim();
  const email = String(form.get("email")).trim();
  const regarding = String(form.get("regarding"));
  const message = String(form.get("message")).trim();

  const sent = () => {
    letter.querySelector(".letter-note").textContent = `Thank you, ${name}. I’ll write back to ${email} soon.`;
    letter.classList.add("is-sent");
    letter.querySelector(".letter-done").focus({ preventScroll: true });
  };
  if (form.get("botcheck")) return sent();

  send.disabled = true;
  status.textContent = "Sending…";
  const routes = [
    () => post("/api/letter", { name, email, regarding, message }),
    () =>
      post("https://api.web3forms.com/submit", {
        access_key: letter.dataset.key,
        subject: `${regarding}: a letter from ${name}`,
        from_name: name,
        name,
        email,
        replyto: email,
        regarding,
        message,
      }),
  ];
  for (const route of routes) {
    try {
      await route();
      status.textContent = "";
      return sent();
    } catch {
      // On to the next way.
    }
  }

  // Neither got through: the visitor's own mail app, with the letter in it.
  const mail = `mailto:${letter.dataset.to}?subject=${encodeURIComponent(`${regarding}: a letter from ${name}`)}&body=${encodeURIComponent(`${message}\n\n${name}\n${email}`)}`;
  status.replaceChildren(
    "The letter couldn’t be sent from here just now. Your words are still here: ",
    Object.assign(document.createElement("a"), { href: mail, textContent: "send it from your mail app" }),
    ", or try again."
  );
  send.disabled = false;
});
