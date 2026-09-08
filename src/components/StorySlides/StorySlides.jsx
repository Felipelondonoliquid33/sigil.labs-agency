"use client";

import "./StorySlides.css";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { stories } from "./stories.js";

gsap.registerPlugin(useGSAP);

function ServiceFigure({ service, index }) {
  const figurePaths = [
    "M130 250C130 170 190 100 280 100C370 100 430 170 430 250C430 330 370 400 280 400C190 400 130 330 130 250Z",
    "M280 70C340 70 390 130 390 190C390 240 450 270 420 330C390 390 320 430 260 400C190 365 120 320 140 250C155 195 205 180 205 125C205 95 235 70 280 70Z",
    "M280 75L405 145L405 285L280 425L155 285L155 145Z",
  ];

  return (
    <div className={`service-figure service-figure--${index}`} aria-hidden="true">
      <svg viewBox="0 0 560 500" role="presentation">
        <defs>
          <radialGradient id={`figure-glow-${index}`} cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor={service.accent} stopOpacity="0.48" />
            <stop offset="65%" stopColor={service.accent} stopOpacity="0.08" />
            <stop offset="100%" stopColor={service.accent} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`figure-fill-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={service.accent} stopOpacity="0.9" />
            <stop offset="100%" stopColor="#081018" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <circle className="figure-glow" cx="280" cy="250" r="220" fill={`url(#figure-glow-${index})`} />
        <g className="figure-orbit figure-orbit--outer">
          <ellipse cx="280" cy="250" rx="205" ry="92" fill="none" stroke={service.accent} strokeOpacity="0.35" />
          <ellipse cx="280" cy="250" rx="205" ry="92" fill="none" stroke={service.accent} strokeOpacity="0.16" transform="rotate(62 280 250)" />
        </g>
        <g className="figure-core" key={`${service.name}-${index}`}>
          <path d={figurePaths[index]} fill={`url(#figure-fill-${index})`} stroke={service.accent} strokeWidth="2" />
          <path d={figurePaths[index]} fill="none" stroke="#f1f5f9" strokeOpacity="0.48" strokeWidth="1" transform="translate(10 -8) scale(.94)" />
          <circle cx="280" cy="250" r={index === 1 ? 38 : 28} fill="#040507" stroke="#f1f5f9" strokeOpacity="0.8" />
          <circle cx="280" cy="250" r="7" fill={service.accent} />
        </g>
        <g className="figure-nodes" fill={service.accent}>
          <circle cx="96" cy="250" r="4" />
          <circle cx="464" cy="250" r="4" />
          <circle cx="280" cy="54" r="4" />
          <circle cx="280" cy="446" r="4" />
        </g>
      </svg>
      <span className="figure-label">SIGNAL / 0{index + 1}</span>
    </div>
  );
}

export default function StorySlides() {
  const [activeStory, setActiveStory] = useState(0);
  const storiesRef = useRef(null);
  const active = stories[activeStory];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStory((current) => (current + 1) % stories.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, []);

  useGSAP(
    () => {
      const root = storiesRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(root.querySelectorAll(".manifesto-copy > *, .service-figure"), { clearProps: "all" });
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = root.querySelectorAll(".manifesto-copy > *");
        const figure = root.querySelector(".service-figure");
        const core = root.querySelector(".figure-core");
        const orbit = root.querySelector(".figure-orbit");

        gsap.fromTo(intro, { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.65, stagger: 0.07, ease: "power3.out" });
        gsap.fromTo(figure, { scale: 0.82, rotation: -8, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, duration: 1, ease: "power3.out" });
        gsap.fromTo(core, { scale: 0.72, rotation: 16 }, { scale: 1, rotation: 0, duration: 1.1, ease: "elastic.out(1, 0.65)" });
        gsap.fromTo(orbit, { rotation: -20, scale: 0.8 }, { rotation: 0, scale: 1, duration: 1.2, ease: "power3.out" });
      });

      return () => mm.revert();
    },
    { scope: storiesRef, dependencies: [activeStory] }
  );

  const move = (direction) => {
    setActiveStory((current) => (current + direction + stories.length) % stories.length);
  };

  return (
    <main className="services-manifesto" ref={storiesRef}>
      <div className="manifesto-grid" aria-hidden="true" />
      <header className="manifesto-header">
        <span>Services manifesto</span>
        <span>01 — 03 / SIGIL LABS</span>
      </header>

      <section className={`manifesto-stage manifesto-stage--${activeStory}`} aria-live="polite">
        <div className="manifesto-visual">
          <ServiceFigure service={active} index={activeStory} />
        </div>

        <article className="manifesto-copy">
          <p className="manifesto-kicker">{active.kicker}</p>
          <p className="manifesto-number">0{activeStory + 1} / 03</p>
          <h1>{active.title}</h1>
          <p className="manifesto-description">{active.description}</p>
          <ul className="manifesto-meta">
            {active.meta.map((line) => <li key={line}>{line}</li>)}
          </ul>
          <a className="manifesto-cta" href={active.linkSrc}>
            {active.linkLabel} <span aria-hidden="true">↗</span>
          </a>
        </article>
      </section>

      <nav className="manifesto-nav" aria-label="Service manifesto slides">
        <div className="manifesto-progress">
          {stories.map((story, index) => (
            <button
              type="button"
              className={index === activeStory ? "is-active" : ""}
              key={story.name}
              onClick={() => setActiveStory(index)}
              aria-label={`Show ${story.name}`}
              aria-current={index === activeStory ? "true" : undefined}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <i />
            </button>
          ))}
        </div>
        <div className="manifesto-arrows">
          <button type="button" onClick={() => move(-1)} aria-label="Previous service">←</button>
          <button type="button" onClick={() => move(1)} aria-label="Next service">→</button>
        </div>
      </nav>
    </main>
  );
}
