"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import styles from "./cases.module.css";
import { SCENES } from "./sceneRegistry";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const fmt = (n, plain) => (plain ? String(n) : n.toLocaleString("en-US"));

export default function CaseStory({ story }) {
  const root = useRef(null);
  const host = useRef(null);
  const canvas = useRef(null);
  const chapterRef = useRef(story.chapters[0].id);
  const [active, setActive] = useState(0);
  useLenis(() => ScrollTrigger.update());

  useGSAP(
    () => {
      const el = root.current;
      const q = (s, scope = el) => Array.from(scope.querySelectorAll(s));
      q("[data-chapter]").forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 58%",
          end: "bottom 58%",
          onToggle: (self) => {
            if (!self.isActive) return;
            chapterRef.current = story.chapters[i].id;
            setActive(i);
          },
        });
      });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
      const counters = q("[data-count]");

      q("[data-rise]").forEach((h) => {
        gsap.fromTo(
          h.querySelectorAll("[data-word]"),
          { yPercent: 115 },
          { yPercent: 0, duration: 1.05, ease: "power4.out", stagger: 0.05, scrollTrigger: { trigger: h, start: "top 86%", once: true } }
        );
      });
      q("[data-fade]").forEach((p) => {
        gsap.fromTo(p, { opacity: 0 }, { opacity: 1, duration: 1, delay: 0.2, scrollTrigger: { trigger: p, start: "top 88%", once: true } });
      });
      // Figures count up once; the server HTML already holds the real value.
      counters.forEach((node) => {
        const target = Number(node.dataset.count);
        const plain = node.dataset.plain === "true";
        if (plain || target === 0) return;
        const box = { v: 0 };
        node.textContent = "0";
        gsap.to(box, {
          v: target,
          duration: 1.4,
          ease: "power3.out",
          onUpdate: () => (node.textContent = fmt(Math.round(box.v), plain)),
          scrollTrigger: { trigger: node, start: "top 88%", once: true },
        });
      });
      q("[data-step]").forEach((step, i) => {
        gsap.fromTo(step, { x: -28, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, delay: i * 0.08, ease: "expo.out", scrollTrigger: { trigger: step, start: "top 90%", once: true } });
      });
      return () => counters.forEach((n) => (n.textContent = fmt(Number(n.dataset.count), n.dataset.plain === "true")));
    },
    { scope: root }
  );

  useEffect(() => {
    const hostEl = host.current;
    const canvasEl = canvas.current;
    if (!hostEl || !canvasEl) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let scene = null;
    let raf = 0;
    let running = false;
    let onScreen = false;
    let cancelled = false;
    let last = 0;
    let start = 0;
    let ro = null;

    const tick = (now) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      scene.frame(dt, (now - start) / 1000, chapterRef.current);
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

    SCENES[story.scene]().then((create) => {
      if (cancelled) return;
      try {
        scene = create(canvasEl, { reduced });
      } catch {
        hostEl.dataset.ready = "false";
        return;
      }
      start = performance.now();
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
  }, [story.scene]);

  const words = (text) =>
    text.split(" ").map((w, i, all) => (
      <span key={`${w}-${i}`}>
        <span className={styles.mask}>
          <span data-word>{w}</span>
        </span>
        {i < all.length - 1 ? " " : ""}
      </span>
    ));

  const chapter = story.chapters[active];

  return (
    <main ref={root} className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroMeta}>
          <a href="/cases">← All case studies</a>
          <span>{story.eyebrow}</span>
        </div>
        <p className={styles.client}>{story.client}</p>
        <h1 data-rise>{words(story.title)}</h1>
        <div className={styles.heroBottom}>
          <p className={styles.lead}>{story.lead}</p>
          <dl>
            {story.facts.map((f) => (
              <div key={f.k}>
                <dt>{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className={styles.journey}>
        <div className={styles.stageCol}>
          <div className={styles.stage}>
            <div ref={host} className={styles.stageInner} aria-hidden="true">
              <canvas ref={canvas} />
            </div>
            <div className={styles.hud} aria-hidden="true">
              <span>{chapter.label}</span>
              <span>
                0{active + 1} / 0{story.chapters.length}
              </span>
              <i style={{ transform: `scaleX(${(active + 1) / story.chapters.length})` }} />
            </div>
          </div>
        </div>

        <div className={styles.chapters}>
          {story.chapters.map((c, i) => (
            <section key={c.id} className={styles.chapter} data-chapter data-on={active === i}>
              <p className={styles.eyebrow}>
                <span>0{i + 1}</span>
                {c.label}
              </p>
              <h2 data-rise>{words(c.title)}</h2>
              <p className={styles.body} data-fade>{c.body}</p>
              <ul className={styles.metrics}>
                {c.metrics.map((m) => (
                  <li key={m.label}>
                    <strong>
                      {m.prefix}
                      <b data-count={m.value} data-plain={m.plain ? "true" : "false"}>{fmt(m.value, m.plain)}</b>
                      {m.to}
                    </strong>
                    <span>{m.label}</span>
                  </li>
                ))}
              </ul>
              {c.note && <p className={styles.note}>{c.note}</p>}
            </section>
          ))}
        </div>
      </div>

      <section className={styles.method}>
        <p className={styles.methodEyebrow}>{story.method.eyebrow}</p>
        <h2 data-rise>{words(story.method.title)}</h2>
        <p className={styles.methodBody} data-fade>{story.method.body}</p>
        <ol>
          {story.method.steps.map((s, i) => (
            <li key={s.t} data-step>
              <span>0{i + 1}</span>
              <h3>{s.t}</h3>
              <p>{s.b}</p>
            </li>
          ))}
        </ol>
      </section>

      <nav className={styles.exit} role="navigation" aria-label="Continue">
        <a href={story.next.href}>{story.next.label} ↗</a>
        {story.work ? <a href={story.work.href}>{story.work.label} ↗</a> : <a href="/cases">All case studies ↗</a>}
        <a href="/contact">Start a project ↗</a>
      </nav>
    </main>
  );
}
