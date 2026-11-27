"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { caseStories } from "./data";
import { caseStoriesEs } from "./data/es";
import { SCENES } from "./sceneRegistry";
import styles from "./showcase.module.css";

/* ────────────────────────────────────────────────────────────────────────────
   Case showcase: the success stories, each one playing live. One stage shows
   the selected case's own 3D scene walking through its chapters; the list
   beside it is plain server-rendered links. It tours the cases by itself until
   the reader takes over.
   Props: lang "en" | "es", title, eyebrow
   ──────────────────────────────────────────────────────────────────────────── */

const SECONDS = 3.4;

const UI = {
  en: { eyebrow: "Success cases", title: "Agents already on shift.", open: "Read the full story", all: "All case studies", step: "Chapter" },
  es: { eyebrow: "Casos de éxito", title: "Agentes ya en turno.", open: "Ver la historia completa", all: "Todos los casos", step: "Capítulo" },
};

const SUMMARY = {
  pacifista: {
    en: ["A lost news archive, recovered", "4,229", "publications back online"],
    es: ["Un archivo periodístico recuperado", "4.229", "publicaciones de vuelta"],
  },
  praxuz: {
    en: ["From chat threads to a campus", "748", "functions agents can operate"],
    es: ["De los chats a un campus", "748", "funciones que operan los agentes"],
  },
  nexus: {
    en: ["LMS automation and AI course audit", "~40", "courses audited by agents"],
    es: ["Automatización LMS y auditoría con IA", "~40", "cursos auditados por agentes"],
  },
  agents: {
    en: ["Our agents wait for a yes", "4", "decoupled agent layers"],
    es: ["Nuestros agentes esperan un sí", "4", "capas de agente desacopladas"],
  },
};

const ORDER = ["praxuz", "nexus", "agents", "pacifista"];

export default function CaseShowcase({ lang = "en", title }) {
  const t = UI[lang] || UI.en;
  const [slug, setSlug] = useState(ORDER[0]);
  const [chapter, setChapter] = useState(0);
  const [near, setNear] = useState(false);
  const root = useRef(null);
  const host = useRef(null);
  const canvas = useRef(null);
  const chapterRef = useRef(caseStories[ORDER[0]].chapters[0].id);
  const taken = useRef(false);
  const visible = useRef(false);
  const story = (lang === "es" ? caseStoriesEs : caseStories)[slug];
  const base = lang === "es" ? "/es/cases" : "/cases";

  const select = (next) => {
    taken.current = true;
    if (next === slug) return;
    setSlug(next);
    setChapter(0);
  };

  // three.js is only requested when the section is getting close.
  useEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    const load = new IntersectionObserver(
      ([e]) => e.isIntersecting && setNear(true),
      { rootMargin: "80% 0px" }
    );
    const watch = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.2 });
    load.observe(el);
    watch.observe(el);
    return () => {
      load.disconnect();
      watch.disconnect();
    };
  }, []);

  useEffect(() => {
    chapterRef.current = story.chapters[Math.min(chapter, story.chapters.length - 1)].id;
  }, [story, chapter]);

  // The tour: through the chapters, then on to the next case.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const id = window.setInterval(() => {
      if (!visible.current || document.hidden) return;
      setChapter((c) => {
        if (c + 1 < story.chapters.length) return c + 1;
        if (!taken.current) setSlug(ORDER[(ORDER.indexOf(story.slug) + 1) % ORDER.length]);
        return 0;
      });
    }, SECONDS * 1000);
    return () => window.clearInterval(id);
  }, [story]);

  useEffect(() => {
    const hostEl = host.current;
    const canvasEl = canvas.current;
    if (!near || !hostEl || !canvasEl) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let scene = null;
    let raf = 0;
    let cancelled = false;
    let ro = null;
    let last = performance.now();
    const start = last;

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (visible.current && !document.hidden) scene.frame(dt, (now - start) / 1000, chapterRef.current);
      raf = requestAnimationFrame(tick);
    };

    SCENES[story.scene]().then((create) => {
      if (cancelled) return;
      try {
        scene = create(canvasEl, { reduced });
      } catch {
        return;
      }
      const size = () => {
        const r = hostEl.getBoundingClientRect();
        scene.setSize(r.width, r.height);
      };
      size();
      ro = new ResizeObserver(size);
      ro.observe(hostEl);
      scene.frame(0.016, 0, chapterRef.current);
      hostEl.dataset.ready = "true";
      raf = requestAnimationFrame(tick);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro?.disconnect();
      // Each case gets its own canvas, so its context can be released for good.
      scene?.dispose(process.env.NODE_ENV === "production");
      hostEl.dataset.ready = "false";
    };
  }, [near, story.scene]);

  const current = story.chapters[Math.min(chapter, story.chapters.length - 1)];

  return (
    <section ref={root} className={styles.showcase} data-proof aria-label={t.eyebrow}>
      <header className={styles.head}>
        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <h2>{title || t.title}</h2>
        <Link href={base} className={styles.all}>{t.all} ↗</Link>
      </header>

      <div className={styles.grid}>
        <ol className={styles.list}>
          {ORDER.map((key, i) => {
            const s = caseStories[key];
            const [name, figure, label] = SUMMARY[key][lang] || SUMMARY[key].en;
            const on = key === slug;
            return (
              <li key={key} data-on={on}>
                <button type="button" onClick={() => select(key)} onPointerEnter={(e) => e.pointerType === "mouse" && select(key)} aria-pressed={on}>
                  <span className={styles.num}>0{i + 1}</span>
                  <span className={styles.name}>
                    <b>{s.client}</b>
                    <small>{name}</small>
                  </span>
                  <span className={styles.figure}>
                    <b>{figure}</b>
                    <small>{label}</small>
                  </span>
                </button>
                <Link href={`${base}/${key}`} className={styles.open}>{t.open} ↗</Link>
                <i aria-hidden="true" />
              </li>
            );
          })}
        </ol>

        <div className={styles.stage}>
          <div ref={host} className={styles.canvasHost} aria-hidden="true">
            {near && <canvas key={slug} ref={canvas} />}
          </div>
          <div className={styles.caption} aria-hidden="true">
            <span>{story.client} / {current.label}</span>
            <strong>{current.title}</strong>
            <div className={styles.dots}>
              {story.chapters.map((c, i) => (
                <i key={c.id} data-on={i <= chapter} />
              ))}
            </div>
          </div>
          <Link href={`${base}/${slug}`} className={styles.stageLink} tabIndex={-1}>{t.open} ↗</Link>
        </div>
      </div>
    </section>
  );
}
