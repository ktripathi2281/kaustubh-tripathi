// Builds the self-hosted fonts in src/fonts/ from the Google Fonts sources.
//
//   npm run fonts
//
// Shippori Mincho: Latin at 400 and 500, plus one Japanese file holding only
// the characters in src/ja.js (the vertical forms that small kana take in
// vertical text come along with them). Zen Kaku Gothic New: Latin at 400.
// The sources (about 20 MB) are cached in node_modules/.cache/fonts.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import subsetFont from "subset-font";
import { ja, numerals, titles } from "../src/ja.js";

const SOURCE = "https://raw.githubusercontent.com/google/fonts/main/ofl";
const cache = new URL("../node_modules/.cache/fonts/", import.meta.url);
const out = new URL("../src/fonts/", import.meta.url);

const range = (from, to) => String.fromCodePoint(...Array.from({ length: to - from + 1 }, (_, i) => from + i));

// Basic Latin, Latin-1 and the common punctuation: quotes, dashes, ellipsis.
const latin = range(0x20, 0x7e) + range(0xa0, 0xff) + range(0x2010, 0x2027) + range(0x2030, 0x203a);
const arrows = range(0x2190, 0x2193);
const japanese = [...new Set([...Object.values(ja), ...Object.values(titles), ...numerals].join(""))].join("");

const fonts = [
  { dir: "shipporimincho", file: "ShipporiMincho-Regular.ttf", out: "shippori-mincho-400-latin.woff2", text: latin },
  { dir: "shipporimincho", file: "ShipporiMincho-Medium.ttf", out: "shippori-mincho-500-latin.woff2", text: latin },
  { dir: "shipporimincho", file: "ShipporiMincho-Medium.ttf", out: "shippori-mincho-500-ja.woff2", text: japanese },
  { dir: "zenkakugothicnew", file: "ZenKakuGothicNew-Regular.ttf", out: "zen-kaku-gothic-new-400-latin.woff2", text: latin + arrows },
];

async function fetchCached(dir, file) {
  const path = new URL(`${dir}-${file}`, cache);
  try {
    return await readFile(path);
  } catch {
    const res = await fetch(`${SOURCE}/${dir}/${file}`);
    if (!res.ok) throw new Error(`${dir}/${file}: HTTP ${res.status}`);
    const data = Buffer.from(await res.arrayBuffer());
    await writeFile(path, data);
    return data;
  }
}

await mkdir(cache, { recursive: true });
await mkdir(out, { recursive: true });

for (const font of fonts) {
  const source = await fetchCached(font.dir, font.file);
  const woff2 = await subsetFont(source, font.text, { targetFormat: "woff2", noHinting: true });
  await writeFile(new URL(font.out, out), woff2);
  console.log(`${font.out.padEnd(38)} ${(woff2.length / 1024).toFixed(1).padStart(6)} KB`);
}

// Both families are under the SIL Open Font License, which travels with the fonts.
for (const [dir, name] of [
  ["shipporimincho", "OFL-ShipporiMincho.txt"],
  ["zenkakugothicnew", "OFL-ZenKakuGothicNew.txt"],
]) {
  await writeFile(new URL(name, out), await fetchCached(dir, "OFL.txt"));
}

console.log(`Japanese glyphs (${[...japanese].length}): ${japanese}`);
