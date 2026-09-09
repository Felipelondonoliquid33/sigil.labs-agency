"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Agentic "decision network" for the Agentic AI service. A layered neural
// graph in SIGIL ink with signal pulses that flow left-to-right toward a
// single decision core — reads as autonomy resolving into a clear decision.
// Editorial + monochrome, one restrained cyan accent. SVG + GSAP, no WebGL.

const VW = 480;
const VH = 400;
const LAYERS = [
  { x: 66, ys: [130, 200, 270] },
  { x: 196, ys: [96, 165, 234, 304] },
  { x: 326, ys: [96, 165, 234, 304] },
  { x: 430, ys: [200] }, // decision core
];

// Deterministic nodes + edges (each layer fully connects to the next).
const NODES = LAYERS.flatMap((layer, li) =>
  layer.ys.map((y, ni) => ({ id: `${li}-${ni}`, x: layer.x, y, layer: li, index: ni }))
);
const EDGES = [];
for (let li = 0; li < LAYERS.length - 1; li++) {
  LAYERS[li].ys.forEach((y1, a) => {
    LAYERS[li + 1].ys.forEach((y2, b) => {
      // Thin out the densest middle layer for a cleaner read.
      if (li === 1 && (a + b) % 2 === 1) return;
      EDGES.push({ x1: LAYERS[li].x, y1, x2: LAYERS[li + 1].x, y2, layer: li });
    });
  });
}
const PULSE_COUNT = 9;

export default function AgenticField({ phase = 0, className }) {
  const host = useRef(null);

  useEffect(() => {
    const root = host.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const ctx = gsap.context(() => {
      if (!reduced.matches) {
        // Signal pulses travel along edges toward the decision core.
        const pulses = gsap.utils.toArray("[data-pulse]", root);
        pulses.forEach((pulse, i) => {
          const assign = () => {
            const e = EDGES[(Math.random() * EDGES.length) | 0];
            gsap.set(pulse, { attr: { cx: e.x1, cy: e.y1 }, opacity: 0 });
            gsap.to(pulse, {
              attr: { cx: e.x2, cy: e.y2 },
              duration: 0.9 + Math.random() * 0.9,
              ease: "power1.inOut",
              delay: Math.random() * 0.6,
              keyframes: { opacity: [0, 1, 1, 0] },
              onComplete: assign,
            });
          };
          gsap.delayedCall(i * 0.25, assign);
        });

        // Nodes breathe softly.
        gsap.to("[data-node]", {
          scale: 1.18,
          transformOrigin: "center center",
          duration: 2.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          stagger: { each: 0.12, from: "random" },
        });

        // Decision core glow.
        gsap.to("[data-core-glow]", {
          scale: 1.4,
          opacity: 0.5,
          transformOrigin: "center center",
          duration: 1.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      // Subtle cursor parallax on the whole graph.
      const gx = gsap.quickTo("[data-graph]", "x", { duration: 1, ease: "power3.out" });
      const gy = gsap.quickTo("[data-graph]", "y", { duration: 1, ease: "power3.out" });
      const onMove = (e) => {
        if (reduced.matches) return;
        const r = root.getBoundingClientRect();
        gx(((e.clientX - r.left) / r.width - 0.5) * 22);
        gy(((e.clientY - r.top) / r.height - 0.5) * 18);
      };
      const onLeave = () => { gx(0); gy(0); };
      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerleave", onLeave);
      root._cleanup = () => {
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerleave", onLeave);
      };
    }, host);

    return () => {
      host.current?._cleanup?.();
      ctx.revert();
    };
  }, []);

  // Highlight the layer tied to the active tab (Structure/Connections/Interface/Intelligence).
  useEffect(() => {
    const root = host.current;
    if (!root) return;
    root.querySelectorAll("[data-node]").forEach((n) => {
      n.style.setProperty("--active", Number(n.dataset.layer) === phase % 4 ? 1 : 0);
    });
  }, [phase]);

  return (
    <div ref={host} className={className} aria-hidden="true">
      <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" height="100%" style={{ display: "block", overflow: "visible", color: "#040507" }}>
        <g data-graph>
          {/* edges */}
          <g stroke="currentColor" fill="none">
            {EDGES.map((e, i) => (
              <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} strokeWidth="1" strokeOpacity={0.12 + e.layer * 0.03} />
            ))}
          </g>

          {/* signal pulses */}
          <g fill="#00f0ff">
            {Array.from({ length: PULSE_COUNT }).map((_, i) => (
              <circle key={i} data-pulse cx="0" cy="0" r="2.6" opacity="0" />
            ))}
          </g>

          {/* nodes */}
          <g>
            {NODES.filter((n) => n.layer < 3).map((n) => (
              <circle
                key={n.id}
                data-node
                data-layer={n.layer}
                cx={n.x}
                cy={n.y}
                r={4}
                fill="currentColor"
                style={{
                  fillOpacity: "calc(0.55 + var(--active, 0) * 0.45)",
                  stroke: "#00f0ff",
                  strokeOpacity: "var(--active, 0)",
                  strokeWidth: 1.5,
                }}
              />
            ))}
          </g>

          {/* decision core */}
          <g>
            <circle data-core-glow cx={LAYERS[3].x} cy={200} r="26" fill="#00f0ff" opacity="0.16" />
            <circle cx={LAYERS[3].x} cy={200} r="12" fill="none" stroke="#00f0ff" strokeWidth="1.5" strokeOpacity="0.9" />
            <circle cx={LAYERS[3].x} cy={200} r="6" fill="#040507" />
          </g>
        </g>
      </svg>
    </div>
  );
}
