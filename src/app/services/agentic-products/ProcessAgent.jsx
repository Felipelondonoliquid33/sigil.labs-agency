"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./agentic-products.module.css";

/* ────────────────────────────────────────────────────────────────────────────
   Process agent — the same agent acts out "A clear path. An open mind."

   It stands on the rule above the step in focus and performs it:
     0  name the task        it drops a tag onto the line
     1  measure the cost     it pulls out a tape and follows its tip
     2  build the smallest   it assembles a baby agent, piece by piece
     3  put it on shift      the baby wakes up and both wave
   It tours the steps on its own; hovering a step calls it over.

   Props:
     steps  string[]  the four step titles (already language-resolved)
   ──────────────────────────────────────────────────────────────────────────── */

export default function ProcessAgent({ steps }) {
  const wrap = useRef(null);
  const canvasRef = useRef(null);
  const items = useRef([]);
  const activeRef = useRef(0);
  const hoverRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const wrapEl = wrap.current;
    const canvas = canvasRef.current;
    if (!wrapEl || !canvas) return undefined;
    let cleanup = null;
    let cancelled = false;
    let io = null;
    // three.js is only requested when the section is getting close.
    io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        import("./processScene").then(({ createProcessScene }) => {
          if (cancelled) return;
          cleanup = createProcessScene({ wrapEl, canvas, items, activeRef, hoverRef, setActive, stepCount: steps.length });
        });
      },
      { rootMargin: "60% 0px" }
    );
    io.observe(wrapEl);
    return () => {
      cancelled = true;
      io.disconnect();
      cleanup?.();
    };
  }, [steps.length]);

  return (
    <div ref={wrap} className={styles.processWrap}>
      <canvas ref={canvasRef} className={styles.processCanvas} aria-hidden="true" />
      <ol>
        {steps.map((step, i) => (
          <li
            key={i}
            ref={(el) => (items.current[i] = el)}
            data-on={active === i}
            onPointerEnter={() => (hoverRef.current = i)}
            onPointerLeave={() => (hoverRef.current = null)}
            onClick={() => (hoverRef.current = i)}
          >
            <span>0{i + 1}</span>
            <h3>{step}</h3>
          </li>
        ))}
      </ol>
    </div>
  );
}
