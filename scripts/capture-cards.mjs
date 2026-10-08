// Captures the share cards drawn by cards.html as public/og/<id>.png, 1200×630.
//
//   npm run dev        (in another terminal)
//   npm run cards
//
// Uses an installed Chrome or Edge, headless. Set CHROME to its path if it
// lives somewhere unusual, and DEV_URL if the dev server isn't on :5173.

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const base = process.env.DEV_URL || "http://localhost:5173";
const browsers = [
  process.env.CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const browser = browsers.find((path) => existsSync(path));
if (!browser) throw new Error("No Chrome or Edge found; set CHROME to its path.");

const essays = readdirSync(new URL("../content/essays/", import.meta.url)).map((f) => f.replace(/\.md$/, ""));

for (const id of ["home", ...essays]) {
  const out = fileURLToPath(new URL(`../public/og/${id}.png`, import.meta.url));
  execFileSync(browser, [
    "--headless=new",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--window-size=1200,630",
    "--virtual-time-budget=5000",
    `--screenshot=${out}`,
    `${base}/cards.html?card=${id}`,
  ]);
  console.log(`public/og/${id}.png`);
}
