import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

// Built pages arrive prerendered (scripts/build.js), so React takes over the
// existing markup. The dev server serves an empty root, so render from scratch.
export function mount(node) {
  const root = document.getElementById("root");
  const tree = <StrictMode>{node}</StrictMode>;
  if (root.hasChildNodes()) hydrateRoot(root, tree);
  else createRoot(root).render(tree);
}
