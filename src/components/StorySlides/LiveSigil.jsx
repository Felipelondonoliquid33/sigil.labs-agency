"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Matching cubic topology lets the same physical strokes move between seals.
// The first seal preserves the agency's original Solomonic Circuit geometry.
const seals = [
  {
    upper: "M170 165 C170 115 250 115 250 165 C250 115 330 115 330 165",
    lower: "M180 345 C210 385 250 385 250 345 C250 385 290 385 320 345",
    left: "M110 250 C140 250 170 250 200 250",
    right: "M300 250 C330 250 360 250 390 250",
    nodes: [[170,165,14],[330,165,14],[180,345,12],[320,345,12],[110,250,15],[390,250,15]],
    radius: 50,
  },
  {
    upper: "M150 180 C150 120 210 125 250 170 C290 125 350 120 350 180",
    lower: "M150 320 C150 380 210 375 250 330 C290 375 350 380 350 320",
    left: "M120 250 C155 200 190 210 188 250",
    right: "M312 250 C310 290 345 300 380 250",
    nodes: [[150,180,14],[350,180,14],[150,320,14],[350,320,14],[120,250,15],[380,250,15]],
    radius: 62,
  },
  {
    upper: "M145 175 C180 145 210 145 250 175 C290 145 320 145 355 175",
    lower: "M145 325 C180 355 210 355 250 325 C290 355 320 355 355 325",
    left: "M105 265 C135 195 170 195 200 250",
    right: "M300 250 C330 305 365 305 395 235",
    nodes: [[145,175,12],[355,175,12],[145,325,12],[355,325,12],[105,265,15],[395,235,15]],
    radius: 50,
  },
];

export default function LiveSigil({ index }) {
  const root = useRef(null);
  const initial = seals[0];

  useGSAP(() => {
    const seal = seals[index];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tweens = [];
    const animate = (element, attr) => tweens.push(gsap.to(element, {
      attr, duration: reduced ? 0 : 3.2, ease: "sine.inOut", overwrite: true,
    }));
    ["upper", "lower", "left", "right"].forEach((part) => {
      animate(root.current.querySelector(`[data-stroke="${part}"]`), { d: seal[part] });
    });
    root.current.querySelectorAll("[data-node]").forEach((node, i) => {
      const [cx, cy, r] = seal.nodes[i];
      animate(node, { cx, cy, r });
    });
    animate(root.current.querySelector("[data-eye]"), { r: seal.radius });
    // Stop at the current geometry on interruption so fast navigation stays continuous.
    return () => tweens.forEach((tween) => tween.kill());
  }, { scope: root, dependencies: [index] });

  return (
    <svg ref={root} viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="250" cy="250" r="210" />
        <path d="M250 60 L250 440" />
        {["upper", "lower", "left", "right"].map((part) => <path key={part} data-stroke={part} d={initial[part]} />)}
        <circle data-eye="" cx="250" cy="250" r={initial.radius} />
      </g>
      <g fill="currentColor">
        <circle cx="250" cy="60" r="10" />
        <circle cx="250" cy="440" r="10" />
        <circle cx="250" cy="250" r="18" />
        {initial.nodes.map(([cx, cy, r], i) => <circle key={i} data-node={i} cx={cx} cy={cy} r={r} />)}
      </g>
    </svg>
  );
}

