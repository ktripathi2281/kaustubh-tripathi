# Kaustubh Tripathi · Selected Works

A portfolio set out like a hanging scroll. Warm paper, soft black ink, and one red, kept for the seals and
the setting sun. Each project is a scene. A single ink line runs across each scene like a horizon, level
under its text and rising like a distant ridge beyond it. Read down the page, it wraps from scene to scene
like a line of writing. The line draws itself as each scene scrolls into view and ends, at the foot of the
page, at a seal bearing the name in katakana, above layers of stippled ridges, where cherry trees blossom
and the sun sets behind the hills as the page ends.

The big titles turn to katakana: on hover with a mouse, or once as each scene arrives on a phone. Every
Japanese string on the site is in [`src/ja.js`](src/ja.js) and is either decorative or shown beside its
English.

On the first visit of a session, the page opens with
[`src/components/Intro.jsx`](src/components/Intro.jsx): a drop of ink blooms into rings, as in suminagashi,
the name is written in katakana stroke by stroke, the seal is pressed red, and the paper lifts away. It is
pure CSS animation, skipped by any touch, key or scroll, and never shown when motion is turned off.

React 19 + Vite, plain CSS, no UI or animation libraries. Every page is rendered to static HTML at build
time, so it reads in full without JavaScript; one small script, [`src/page.js`](src/page.js), adds the
motion and sends the letter.

- **Content:** [`src/data.js`](src/data.js) holds all text, links and metadata. Essays, one for each
  project, are Markdown in [`content/essays/`](content/essays/), written from each project's code and docs.
- **Japanese:** [`src/ja.js`](src/ja.js) holds every Japanese string, with its reading.
- **The ink line:** [`src/lib/ridge.js`](src/lib/ridge.js). It is seeded, so every visit draws the same
  line. [`InkLine.jsx`](src/components/InkLine.jsx) re-plots it in pixels once the page runs, so the stroke can
  be drawn as a fraction of its length.
- **The ridges:** [`src/lib/stipple.js`](src/lib/stipple.js), an ordered dither on a canvas, with cherry
  trees in blossom grown from a seed. The sun is stippled on a canvas of its own, clipped to the sky above
  the hills, and sinks behind them as they rise into view.
- **The diagrams:** [`src/components/Diagrams.jsx`](src/components/Diagrams.jsx), one ink drawing per project of
  how it works, built from its README or the résumé. Each draws itself as its scene arrives.
- **The plates:** [`src/components/Plates.jsx`](src/components/Plates.jsx), a large drawing behind each
  essay's opening, set very light. Each redraws the central picture of an image made for that project, in
  the same ink, without its words or numbers.
- **The letter:** [`src/components/Letter.jsx`](src/components/Letter.jsx), a message written on the page
  and delivered by Web3Forms (the public key is in `data.js`) by way of the site's own relay,
  [`api/letter.js`](api/letter.js), since some networks can't reach Web3Forms directly. With JavaScript it
  sends in place, then tries Web3Forms directly, then offers the visitor's mail app; without, it posts to
  the relay as an ordinary form.
- **Styles:** [`src/styles.css`](src/styles.css). The colour tokens are at the top.
- **Type:** Shippori Mincho (names, titles, text and all Japanese) and Zen Kaku Gothic New (small labels),
  both self-hosted in [`src/fonts/`](src/fonts/). The Japanese font holds only the characters in
  `src/ja.js`.
- **Prerendering:** [`vite/prerender.js`](vite/prerender.js) fills each page's `<!--ssr:…-->` placeholder
  from [`src/entry-server.jsx`](src/entry-server.jsx), in dev and in the build.
  [`vite/markdown.js`](vite/markdown.js) turns the essays into HTML at build time.
- **Link previews:** [`cards.html`](cards.html) is a dev-only page that draws the share images in
  `public/og/` at 1200×630.

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run fonts    # rebuild the font subsets after changing src/ja.js
npm run cards    # recapture public/og/*.png (needs the dev server and Chrome or Edge)
```

Deploys to Vercel as a standard Vite project.

## Credits

- The katakana stroke paths in [`src/lib/strokes.js`](src/lib/strokes.js) are adapted from
  [KanjiVG](https://kanjivg.tagaini.net), copyright Ulrich Apel, under
  [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/); that file is shared under the same licence.
- Shippori Mincho and Zen Kaku Gothic New are under the SIL Open Font License; see
  [`src/fonts/`](src/fonts/).
