import { useEffect, useRef, useState } from "react";
import { drawHorizon } from "./landscape.js";

// The footer's stippled horizon on a canvas that follows the page's size and theme.
export default function Horizon() {
  const wrap = useRef(null);
  const canvas = useRef(null);
  const [shown, setShown] = useState(false);

  // Draw now, and again whenever the size or the light/dark theme changes.
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    let frame = 0;
    const redraw = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => drawHorizon(el));
    };
    redraw();
    const resize = new ResizeObserver(redraw);
    resize.observe(el);
    const theme = new MutationObserver(redraw);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    scheme.addEventListener("change", redraw);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      theme.disconnect();
      scheme.removeEventListener("change", redraw);
    };
  }, []);

  // Plot it from the bottom up the first time it comes into view.
  useEffect(() => {
    const el = wrap.current;
    if (!el || !("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className={`horizon${shown ? " is-shown" : ""}`} aria-hidden="true">
      <canvas ref={canvas} />
    </div>
  );
}
