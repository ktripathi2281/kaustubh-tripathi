// Paths for drawing in ink, shared by the diagrams (components/Diagrams.jsx)
// and the plates behind the essays (components/Plates.jsx). Every shape is a
// path, so it can be inked stroke by stroke.

export const r1 = (n) => Math.round(n * 10) / 10;

// A circle, drawn clockwise from the top.
export const circle = (cx, cy, r) =>
  `M${r1(cx)} ${r1(cy - r)}A${r} ${r} 0 1 1 ${r1(cx)} ${r1(cy + r)}A${r} ${r} 0 1 1 ${r1(cx)} ${r1(cy - r)}`;

// An arrowhead with its tip at (x, y), pointing along `a` radians.
export const arrow = (x, y, a, s = 6) =>
  `M${r1(x - s * Math.cos(a - 0.45))} ${r1(y - s * Math.sin(a - 0.45))}L${r1(x)} ${r1(y)}L${r1(x - s * Math.cos(a + 0.45))} ${r1(y - s * Math.sin(a + 0.45))}`;

export const polar = ([cx, cy], r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];

// A rectangle with rounded corners, drawn clockwise from the top left.
export function box(x, y, w, h, r = 0) {
  const [x0, y0, x1, y1] = [x, y, x + w, y + h].map(r1);
  if (!r) return `M${x0} ${y0}H${x1}V${y1}H${x0}Z`;
  const a = `A${r} ${r} 0 0 1`;
  return `M${r1(x + r)} ${y0}H${r1(x1 - r)}${a} ${x1} ${r1(y + r)}V${r1(y1 - r)}${a} ${r1(x1 - r)} ${y1}H${r1(x + r)}${a} ${x0} ${r1(y1 - r)}V${r1(y + r)}${a} ${r1(x + r)} ${y0}Z`;
}
