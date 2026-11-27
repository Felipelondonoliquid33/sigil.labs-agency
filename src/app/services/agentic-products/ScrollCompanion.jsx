"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createDiorama } from "./diorama";
import { AUDIT_SCAN, parseStageKey } from "./stageStates";
import styles from "./agentic-products.module.css";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────────────────────────────────────
   Scroll companion — the sticky stage of the use-case section.

   It mounts the porcelain diorama, reads which chapter step is on screen from
   the `data-stage` markers inside `scope`, and feeds that to the scene. Labels
   are plain DOM, projected from 3D every frame, so they stay crisp, translate
   with the language switch and are anchored to the object they name.

   Props:
     scope      ref to the section root; every selector is scoped to it
     labels     { place: string[4], way: string[3], audit: string[4] }
     titles     { overview, place, way, audit } — chapter names for the HUD
     onUnavailable()  called when the stage cannot mount (no WebGL / narrow)
   ──────────────────────────────────────────────────────────────────────────── */

const COUNTS = { overview: 4, place: 4, way: 3, audit: 4 };

export default function ScrollCompanion({ scope, labels, titles, onUnavailable }) {
  const host = useRef(null);
  const canvasRef = useRef(null);
  const labelRefs = useRef([]);
  const stageRef = useRef({ chapter: "overview", index: -1 });
  const scanRef = useRef(0);
  const [stage, setStage] = useState({ chapter: "overview", index: -1 });

  useEffect(() => {
    const hostEl = host.current;
    const canvas = canvasRef.current;
    const root = scope?.current;
    if (!hostEl || !canvas || !root) return undefined;

    let supports = false;
    try {
      const probe = document.createElement("canvas");
      supports = !!(probe.getContext("webgl2") || probe.getContext("webgl"));
    } catch {
      supports = false;
    }
    if (!supports) {
      onUnavailable?.();
      return undefined;
    }

    let teardown = null;

    const boot = () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let diorama;
      try {
        diorama = createDiorama(canvas, { reduced });
      } catch {
        onUnavailable?.();
        return () => {};
      }

      const resize = () => {
        const r = hostEl.getBoundingClientRect();
        diorama.setSize(r.width, r.height);
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(hostEl);

      // Chapter steps → stage state.
      const triggers = Array.from(root.querySelectorAll("[data-stage]")).map((el) =>
        ScrollTrigger.create({
          trigger: el,
          // On phones the stage covers the top of the screen, so a step takes
          // over lower down.
          start: () => (window.innerWidth < 820 ? "top 72%" : "top 55%"),
          end: () => (window.innerWidth < 820 ? "bottom 72%" : "bottom 55%"),
          onToggle: (self) => {
            if (!self.isActive) return;
            const next = parseStageKey(el.getAttribute("data-stage"));
            stageRef.current = next;
            setStage(next);
          },
        })
      );
      const scanEl = root.querySelector("[data-audit-scan]");
      if (scanEl) {
        triggers.push(
          ScrollTrigger.create({
            trigger: scanEl,
            start: AUDIT_SCAN.start,
            end: AUDIT_SCAN.end,
            onUpdate: (self) => (scanRef.current = self.progress),
            onRefresh: (self) => (scanRef.current = self.progress),
          })
        );
      }

      // Frame loop: only while the stage is on screen and the tab is visible.
      let raf = 0;
      let running = false;
      let onScreen = false;
      let last = performance.now();
      const start = last;

      const tick = (now) => {
        if (!running) return;
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        const s = stageRef.current;
        diorama.frame(dt, (now - start) / 1000, { chapter: s.chapter, index: s.index, scan: scanRef.current });
        const anchors = diorama.labels(s.chapter);
        anchors.forEach((a, i) => {
          const el = labelRefs.current[i];
          if (!el) return;
          el.style.transform = `translate3d(${a.x.toFixed(1)}px, ${a.y.toFixed(1)}px, 0)`;
          el.dataset.hidden = a.visible ? "false" : "true";
          el.dataset.lit = a.lit ? "true" : "false";
        });
        raf = requestAnimationFrame(tick);
      };
      const play = () => {
        if (running || document.hidden || !onScreen) return;
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
      io.observe(hostEl);

      const onVisibility = () => (document.hidden ? pause() : play());
      document.addEventListener("visibilitychange", onVisibility);

      hostEl.dataset.ready = "true";

      return () => {
        pause();
        io.disconnect();
        ro.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        triggers.forEach((tr) => tr.kill());
        diorama.dispose();
        hostEl.dataset.ready = "false";
      };
    };

    teardown = boot();

    return () => {
      if (teardown) teardown();
    };
  }, [scope, onUnavailable]);

  const { chapter, index } = stage;
  const set = chapter === "overview" ? labels.place : labels[chapter] || labels.place;
  const count = COUNTS[chapter] || 4;
  // The audit is one continuous scan, so its counter reads the whole set.
  const shown = chapter === "audit" ? count : Math.max(0, index) + 1;

  return (
    <div
      ref={host}
      className={styles.stageInner}
      data-tone={chapter === "audit" ? "dark" : "light"}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className={styles.stageCanvas} />
      <div className={styles.labels}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            ref={(el) => (labelRefs.current[i] = el)}
            className={styles.label}
            data-on={chapter !== "audit" && index === i ? "true" : "false"}
            data-empty={set[i] ? "false" : "true"}
          >
            <span className={styles.labelInner}>
              <b>0{i + 1}</b>
              {set[i] || ""}
            </span>
          </div>
        ))}
      </div>
      <div className={styles.hud}>
        <span>{titles[chapter] || titles.overview}</span>
        <span>
          {chapter === "overview" ? "00" : `0${shown}`} / 0{count}
        </span>
        <i style={{ transform: `scaleX(${chapter === "overview" ? 0 : shown / count})` }} />
      </div>
    </div>
  );
}
