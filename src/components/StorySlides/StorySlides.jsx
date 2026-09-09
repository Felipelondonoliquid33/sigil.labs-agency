"use client";

import "./StorySlides.css";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import LiveSigil from "./LiveSigil";
import { stories } from "./stories.js";

gsap.registerPlugin(useGSAP);

// Terminal / matrix decode charset (latin + digits + glyphs).
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>-_/\\[]{}*+=?#";

// Reveals `finalText` left-to-right on `el` while unrevealed chars flicker
// through random glyphs — a terminal-style decode. `finalText` is passed
// explicitly (from data) so a mid-transition revert can never corrupt the
// text the tween lands on. Always settles on the original header.
function scrambleTo(el, finalText, { duration = 1.6, delay = 0, ease = "power1.inOut", flickerMs = 55 } = {}) {
  if (!el || !finalText) return null;
  const len = finalText.length;
  const proxy = { p: 0 };
  // Cache the random glyphs and only re-roll every `flickerMs`, so the
  // decode reads as a smooth, deliberate reveal instead of per-frame noise.
  const cache = new Array(len).fill("");
  let lastRoll = -Infinity;
  const isStatic = (c) => c === " " || c === "—" || c === "/" || c === "|" || c === ".";
  return gsap.to(proxy, {
    p: 1,
    duration,
    delay,
    ease,
    onUpdate() {
      const now = performance.now();
      const reroll = now - lastRoll >= flickerMs;
      if (reroll) lastRoll = now;
      const revealed = Math.floor(proxy.p * len);
      let out = "";
      for (let i = 0; i < len; i++) {
        const c = finalText[i];
        if (i < revealed || isStatic(c)) {
          out += c;
        } else {
          if (reroll || !cache[i]) cache[i] = SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0];
          out += cache[i];
        }
      }
      el.textContent = out;
    },
    onComplete() {
      el.textContent = finalText;
    },
  });
}

function ServiceFigure({ index }) {
  return (
    <div className="service-figure" aria-hidden="true">
      <div className="sigil-mark"><LiveSigil index={index} /></div>
      <span className="figure-label">SIGIL / 0{index + 1}</span>
    </div>
  );
}
export default function StorySlides() {
  const [activeStory, setActiveStory] = useState(0);
  const [paused, setPaused] = useState(false);
  const storiesRef = useRef(null);
  const active = stories[activeStory];

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(() => {
      setActiveStory((current) => (current + 1) % stories.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, [activeStory, paused]);

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
        gsap.fromTo(intro, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.06, ease: "power2.out" });

        // Terminal-style decode only on the main title + the meta bullets.
        // The small kicker/number above the header stay clean (fade only).
        // Slow + throttled = smooth deliberate decode, no glitchy bounce.
        scrambleTo(root.querySelector(".manifesto-copy h1"), active.title, { duration: 1.9, delay: 0.15 });
        root.querySelectorAll(".manifesto-meta li").forEach((li, i) => {
          scrambleTo(li, active.meta[i], { duration: 1.2, delay: 0.5 + i * 0.22 });
        });
      });

      return () => mm.revert();
    },
    { scope: storiesRef, dependencies: [activeStory], revertOnUpdate: true }
  );

  const move = (direction) => {
    setPaused(true);
    setActiveStory((current) => (current + direction + stories.length) % stories.length);
  };

  return (
    <main className="services-manifesto" ref={storiesRef}>
      <div className="manifesto-grid" aria-hidden="true" />
      <header className="manifesto-header">
        <span>Services manifesto</span>
        <span>01 — 03 / SIGIL LABS</span>
      </header>

      <section aria-roledescription="carousel" aria-label="Services" className={`manifesto-stage manifesto-stage--${activeStory}`} aria-live={paused ? "polite" : "off"}>
        <div className="manifesto-visual">
          <ServiceFigure index={activeStory} />
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
              onClick={() => { setPaused(true); setActiveStory(index); }}
              aria-label={`Show ${story.name}`}
              aria-current={index === activeStory ? "true" : undefined}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <i />
            </button>
          ))}
        </div>
        <div className="manifesto-arrows">
          <button className="manifesto-play" type="button" onClick={() => setPaused(!paused)} aria-label={paused ? "Play slideshow" : "Pause slideshow"}>{paused ? "▷" : "Ⅱ"}</button>
          <button type="button" onClick={() => move(-1)} aria-label="Previous service">←</button>
          <button type="button" onClick={() => move(1)} aria-label="Next service">→</button>
        </div>
      </nav>
    </main>
  );
}

