# Kaustubh Tripathi · Selected Works

A portfolio set out like an exhibition catalogue. Each project is a numbered plate: a drawing generated in code
that encodes how the system works, mounted beside a museum-style wall label. The drawings plot themselves once,
like a pen plotter, when they scroll into view.

React 19 + Vite, plain CSS, no animation or UI libraries.

- **Content:** [`src/data.js`](src/data.js). All text, links and metadata.
- **Drawings:** [`src/art/plates.jsx`](src/art/plates.jsx). Seeded, so every visit draws the same image.
- **Styles:** [`src/styles.css`](src/styles.css). Colour tokens for light and dark are at the top.
- **Type:** Cormorant Garamond (display), Newsreader (text), IBM Plex Mono (labels).
- **Link previews:** [`cards.html`](cards.html), a dev-only page, draws the share images in `public/og/` with the
  footer's stippled horizon. Capture them again after adding an essay.

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
```

Deploys to Vercel as a standard Vite project.
