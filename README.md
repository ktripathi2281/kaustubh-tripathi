# Kaustubh Tripathi · Datasheet

A portfolio set out like a printed spec sheet for an engineer. The whole page sits in one ruled frame on a
12-column grid. Every section opens with a numbered mono label, and each project is a datasheet section: a
parameters table, a block diagram of how it works, what breaks and what holds, application notes and links.

React 19 + Vite, plain CSS, no UI or animation libraries. Every page is prerendered to static HTML at build
time and then hydrated, so the content is there before any JavaScript runs.

- **Content:** [`src/data.js`](src/data.js). All text, links, parameters and diagrams. Essays live in
  [`content/essays/`](content/essays/) and are listed as application notes.
- **Diagrams:** [`src/components/BlockDiagram.jsx`](src/components/BlockDiagram.jsx), driven by each project's
  `diagram` field: an ordered list of boxes, optional branches, and an optional rail that runs under the whole
  flow. Exactly one element per diagram is the accent. Boxes and arrows draw in once when the diagram scrolls
  into view; with reduced motion they are simply there.
- **Styles:** [`src/styles.css`](src/styles.css). Paper, ink and one accent, for light and dark, are at the top.
  The accent always marks the part that holds when something breaks.
- **Type:** Inter Tight (400, 500, 700) and IBM Plex Mono (400, 500), self-hosted through Fontsource.
- **Prerender:** [`scripts/build.js`](scripts/build.js) builds the client, renders each page with
  `react-dom/server`, writes the markup into the built HTML and stamps the build date as the sheet's revision.
- **Link previews:** [`cards.html`](cards.html), a dev-only page, draws the 1200×630 share images in
  `public/og/`. Open `/cards.html?card=home` (or an essay's slug) to see one card alone and capture it again
  after adding an essay.

```bash
npm install
npm run dev      # local dev server
npm run build    # production build with prerendering, to dist/
```

Deploys to Vercel; [`vercel.json`](vercel.json) runs `npm run build` so the prerender step is part of every
deploy.
