"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { TESTS, pairPhase } from "./methodPhases";
import styles from "./StudioMethod.module.css";

/* How SIGIL delivers. The principles are the founder's delivery method, in the
   studio's voice; the stages and stop rules come from the backlog → story →
   pair workflow the team builds with. All the copy is in the server HTML; the
   3D stage that acts it out loads on the client when it is close. */

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CHAPTERS = ["backlog", "story", "pair", "check", "stop"];

/* What the stage is showing, under the model. The pair stage is live. */
const CAPTIONS = {
  backlog: "One solid ask, cut into vertical stories",
  story: "One story steps forward and gets signed off",
  pair: "Example tests",
  check: "Fresh eyes inspect what was built",
  stop: "Frozen until a person decides",
};

const PRINCIPLES = [
  {
    title: "Cycles, not vibes.",
    body: "We run short, structured cycles inspired by XP and assisted by AI. Not vibe coding. Every cycle is small enough to verify and clear enough to hand over.",
  },
  {
    title: "Explicit scope.",
    body: "We ship the useful thing first and settle early whatever is expensive to change later. One story at a time, with acceptance criteria you can check and limits written down. Agents and tools produce the prototypes and features. Where the project allows it, automated quality gates and a separate audit check them.",
  },
  {
    title: "Direction, not autopilot.",
    body: "AI writes fast. Speed is not judgement. We direct the delivery and govern the technical work done with AI: we make sure the thing being built is the right thing, and that it holds up when it ships. We review experience, business rules and results before anything is approved.",
  },
];

const STAGES = [
  {
    command: "backlog",
    title: "Cut it into stories.",
    line: "You bring the requirements. We slice and order them.",
    rules: [
      "Each story delivers value on its own, through every layer. No “technical stories”.",
      "One line per story, 10 to 15 at most.",
      "The decisions that are expensive to change are named up front.",
      "We never invent a requirement. If there is a gap, we ask.",
    ],
    out: "A short backlog you can edit.",
  },
  {
    command: "story",
    title: "Agree what “done” means.",
    line: "One story, refined right before we build it.",
    rules: [
      "Acceptance criteria as Given / When / Then: what you get, never how it is coded.",
      "More than three criteria? We check whether it should be split.",
      "A plan of five bullets at most, plus what is out of scope.",
      "Nothing starts until the plan is approved.",
    ],
    out: "A block you can sign off.",
  },
  {
    command: "pair",
    title: "Build it in tested steps.",
    line: "The AI drives. A person navigates and decides.",
    rules: [
      "The list of tests is agreed first. That list is the spec.",
      "Write one test and watch it fail.",
      "Write the minimum code that makes it pass. Nothing extra.",
      "The expected result comes from the criterion, never from the code.",
    ],
    out: "Working software, one green step at a time.",
  },
  {
    command: "check",
    title: "Prove it, then ship it.",
    line: "Green tests are the start of the review, not the end.",
    rules: [
      "What cannot be automated is verified by hand, against the criteria.",
      "Review happens with fresh eyes: whoever wrote it does not grade it.",
      "Refactors only with tests green, never mixed with new features.",
      "Nothing is committed without a person’s approval.",
    ],
    out: "A delivery someone is accountable for.",
  },
];

const STOPS = [
  "A design decision shows up that is not in the plan.",
  "Something nobody asked for looks like a good idea.",
  "Passing would mean changing, skipping or deleting a test.",
  "Two attempts have not reached green.",
  "A step grows past about 50 lines or three files.",
];

export default function StudioMethod() {
  const root = useRef(null);
  const host = useRef(null);
  const canvas = useRef(null);
  const readout = useRef(null);
  const chapterRef = useRef("backlog");
  const [active, setActive] = useState("backlog");
  const [near, setNear] = useState(false);

  useGSAP(
    () => {
      const el = root.current;
      const q = (sel) => Array.from(el.querySelectorAll(sel));
      q("[data-stage-step]").forEach((step) => {
        ScrollTrigger.create({
          trigger: step,
          // On phones the stage covers the top, so a step takes over lower down.
          start: () => (window.innerWidth < 900 ? "top 72%" : "top 55%"),
          end: () => (window.innerWidth < 900 ? "bottom 72%" : "bottom 55%"),
          onToggle: (self) => {
            if (!self.isActive) return;
            chapterRef.current = step.dataset.stageStep;
            setActive(step.dataset.stageStep);
          },
        });
      });
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const play = (trigger, start = "top 84%") => ({ trigger, start, toggleActions: "play none none none" });
      q("[data-principle]").forEach((card, i) => {
        gsap
          .timeline({ scrollTrigger: play(card) })
          .fromTo(card.querySelector("i"), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "expo.out" }, i * 0.14)
          .fromTo(card.querySelector("h3"), { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: "expo.out" }, i * 0.14 + 0.15)
          .fromTo(card.querySelector("p"), { opacity: 0 }, { opacity: 1, duration: 0.8 }, i * 0.14 + 0.4);
      });
      q("[data-rules]").forEach((list) => {
        gsap.fromTo(list.children, { x: -22, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, stagger: 0.09, ease: "power3.out", scrollTrigger: play(list) });
      });
      q("[data-out]").forEach((out) => {
        gsap.fromTo(out, { rotate: -4, y: 18, opacity: 0 }, { rotate: 0, y: 0, opacity: 1, duration: 0.7, ease: "back.out(2)", scrollTrigger: play(out, "top 90%") });
      });
    },
    { scope: root }
  );

  // three.js is only requested when the journey is getting close.
  useEffect(() => {
    const el = host.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        io.disconnect();
      },
      { rootMargin: "100% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const hostEl = host.current;
    const canvasEl = canvas.current;
    if (!near || !hostEl || !canvasEl) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let scene = null;
    let raf = 0;
    let running = false;
    let onScreen = false;
    let cancelled = false;
    let ro = null;
    let last = 0;
    let clock = 0;
    let shown = "";
    let current = "";

    const tick = (now) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      // Each chapter starts its own loop from the beginning.
      if (current !== chapterRef.current) {
        current = chapterRef.current;
        clock = 0;
      }
      clock += dt;
      scene.frame(dt, clock, current);
      if (current === "pair" && readout.current) {
        const { index, green } = pairPhase(reduced ? 0.4 : clock);
        const text = `${green ? "✓ passes" : "✗ failing"} · “${TESTS[index]}”`;
        if (text !== shown) {
          shown = text;
          readout.current.textContent = text;
          readout.current.dataset.state = green ? "green" : "red";
        }
      } else if (shown) {
        shown = "";
      }
      raf = requestAnimationFrame(tick);
    };
    const play = () => {
      if (running || !scene || document.hidden || !onScreen) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) play();
      else pause();
    });
    const onVisibility = () => (document.hidden ? pause() : play());

    import("./methodScene").then(({ createMethodScene }) => {
      if (cancelled) return;
      try {
        scene = createMethodScene(canvasEl, { reduced });
      } catch {
        return;
      }
      ro = new ResizeObserver(() => {
        const r = hostEl.getBoundingClientRect();
        scene.setSize(r.width, r.height);
      });
      ro.observe(hostEl);
      io.observe(hostEl);
      document.addEventListener("visibilitychange", onVisibility);
      hostEl.dataset.ready = "true";
    });

    return () => {
      cancelled = true;
      pause();
      io.disconnect();
      ro?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      scene?.dispose();
    };
  }, [near]);

  const step = CHAPTERS.indexOf(active);

  return (
    <section ref={root} className={styles.method} data-nav-light aria-labelledby="method-title">
      <header className={styles.head}>
        <p className={styles.eyebrow}>Delivery method</p>
        <h2 id="method-title">How the work actually runs.</h2>
        <p className={styles.lead}>No magic prompt and no big reveal at the end. A loop you can read, check and take with you.</p>
      </header>

      <ol className={styles.principles}>
        {PRINCIPLES.map((p, i) => (
          <li key={p.title} data-principle>
            <i aria-hidden="true" />
            <span>0{i + 1}</span>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </li>
        ))}
      </ol>

      <div className={styles.loopHead}>
        <p className={styles.eyebrow}>One story, start to finish</p>
        <p className={styles.loop} aria-label="backlog, then story, then pair, then check, one story at a time">
          backlog <i>→</i> story <i>→</i> pair <i>→</i> check <i>↺</i>
        </p>
      </div>

      <div className={styles.journey}>
        <div className={styles.chapters}>
          <ol className={styles.stages}>
        {STAGES.map((s, i) => (
          <li key={s.command} data-stage-step={s.command} data-on={active === s.command}>
            <p className={styles.command}>
              <span>0{i + 1}</span>/{s.command}
            </p>
            <div className={styles.stageMain}>
              <h3>{s.title}</h3>
              <p>{s.line}</p>
            </div>
            <ul data-rules>
              {s.rules.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <p className={styles.out} data-out>
              <span>Output</span>
              {s.out}
            </p>
          </li>
        ))}
      </ol>

          <div className={styles.stops} data-stage-step="stop">
        <h3>When we stop.</h3>
        <p>Mid-task, without being asked. We stop and put the decision in front of a person when:</p>
            <ol data-rules>
              {STOPS.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>
        </div>

        <div className={styles.stageCol} data-tone={active === "stop" ? "dark" : "light"}>
          <div className={styles.stage}>
            <p className={styles.tracker} aria-hidden="true">
              {CHAPTERS.map((c) => (
                <span key={c} data-on={active === c}>{c}</span>
              ))}
            </p>
            <div ref={host} className={styles.canvasHost} aria-hidden="true">
              <canvas ref={canvas} />
            </div>
            <div className={styles.caption} aria-hidden="true">
              <span>{CAPTIONS[active]}</span>
              {active === "pair" ? <strong ref={readout} key="live" data-state="red">✗ failing · “{TESTS[0]}”</strong> : null}
              <i style={{ transform: `scaleX(${(step + 1) / CHAPTERS.length})` }} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.exit}>
        <Link href="/cases">See it applied in our case studies ↗</Link>
        <Link href="/services/agentic-products">Agentic Products ↗</Link>
      </div>
    </section>
  );
}
