import { BAND, horizon } from "../lib/ridge.js";

// One scene's horizon, in one layout. The SVG covers the strip the line can
// reach, with x in % of the width and y in svh from the scene's level,
// stretched to fit the screen, with a stroke that keeps its width: the whole
// line, as shown without JavaScript. src/page.js then re-plots it in pixels
// from its seed, so the stroke can be drawn as a fraction of its length.
export default function InkLine({ seed, layout, end = 100 }) {
  const { d } = horizon(seed, layout, end);
  return (
    <svg
      className={`ink ink--${layout}`}
      viewBox={`0 ${BAND[0]} 100 ${BAND[1] - BAND[0]}`}
      preserveAspectRatio="none"
      data-seed={seed}
      data-layout={layout}
      data-end={end}
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} />
    </svg>
  );
}

// A scene's horizon for both layouts (styles.css shows the one that fits),
// with anything that sits on the line, such as a seal.
export function Horizon({ seed, end, children }) {
  return (
    <div className="level">
      <InkLine seed={seed} layout="wide" end={end?.wide} />
      <InkLine seed={seed} layout="narrow" end={end?.narrow} />
      {children}
    </div>
  );
}
