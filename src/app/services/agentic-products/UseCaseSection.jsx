"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLanguage } from "../LanguageContext";
import { AUDIT_SCAN, auditStepProgress } from "./stageStates";
import styles from "./agentic-products.module.css";

/* three.js is heavy and the stage is desktop-only. next/dynamic keeps it out
   of the route bundle: the section is fully readable before the diorama code
   is even requested, and phones never request it. */
const ScrollCompanion = dynamic(() => import("./ScrollCompanion"), {
  ssr: false,
  loading: () => null,
});

gsap.registerPlugin(ScrollTrigger, useGSAP);


/* Use-case blocks. Copy is intentionally short and verb-first: this has to be
   readable by someone who does not know what an agent is. */
const USE_CASES = {
  en: [
    {
      id: "sell",
      tag: "Sell more",
      title: "The lead goes cold before anyone answers.",
      body: "An agent replies on WhatsApp in seconds, qualifies against your real criteria, and books the call. Your team only talks to people who can actually buy.",
      items: ["Instant reply and qualification", "Quotes followed up automatically", "Dormant clients reactivated with context"],
    },
    {
      id: "serve",
      tag: "Serve better",
      title: "The same question, a hundred times a day.",
      body: "The agent answers from your own manuals, policies and catalogue. It escalates to a person only when it genuinely cannot resolve it, and it hands over with a summary.",
      items: ["Grounded in your documents", "Web, WhatsApp and email in one queue", "Human handover with full context"],
    },
    {
      id: "operate",
      tag: "Operate without friction",
      title: "Quotes, reports and minutes eat the week.",
      body: "Repetitive documents get generated from the data you already have instead of being retyped. Weekly reporting assembles itself from several sources.",
      items: ["Documents generated from data", "Reports assembled across sources", "Alerts when a number leaves range"],
    },
    {
      id: "create",
      tag: "Create faster",
      title: "Everyone on the team uses AI differently.",
      body: "One internal system of agents and skills gives the whole team the same capability, the same criteria and the same controls, instead of five private experiments.",
      items: ["Internal agent and skill system", "Easy tasks routed to cheap models", "Shared quality and review gates"],
    },
  ],
  es: [
    {
      id: "sell",
      tag: "Vender más",
      title: "El lead se enfría antes de que alguien conteste.",
      body: "Un agente responde en WhatsApp en segundos, califica con tus criterios reales y agenda la llamada. Tu equipo solo habla con quien sí puede comprar.",
      items: ["Respuesta y calificación inmediata", "Cotizaciones con seguimiento automático", "Reactivación de clientes dormidos con contexto"],
    },
    {
      id: "serve",
      tag: "Atender mejor",
      title: "La misma pregunta, cien veces al día.",
      body: "El agente responde desde tus propios manuales, políticas y catálogo. Escala a una persona solo cuando de verdad no puede resolverlo, y le pasa el resumen.",
      items: ["Basado en tus documentos", "Web, WhatsApp y correo en una sola bandeja", "Traspaso al humano con todo el contexto"],
    },
    {
      id: "operate",
      tag: "Operar sin fricción",
      title: "Cotizaciones, informes y actas se comen la semana.",
      body: "Los documentos repetitivos se generan desde los datos que ya tienes, en vez de retipearse. El reporte semanal se arma solo desde varias fuentes.",
      items: ["Documentos generados desde datos", "Informes armados de varias fuentes", "Alertas cuando un número se sale del rango"],
    },
    {
      id: "create",
      tag: "Crear más rápido",
      title: "Cada persona del equipo usa la IA distinto.",
      body: "Un sistema interno de agentes y skills le da a todo el equipo la misma capacidad, los mismos criterios y los mismos controles, en vez de cinco experimentos privados.",
      items: ["Sistema interno de agentes y skills", "Tareas fáciles al modelo barato", "Criterios de calidad compartidos"],
    },
  ],
};

const WAYS = {
  en: [
    { tag: "Build", title: "We build it with you", body: "A complete agent or workflow in production. We work alongside your team, with your data and your approval rules.", when: "When you already know what to solve." },
    { tag: "Enable", title: "We teach your team", body: "A diagnostic, one first system built in the open, and the method transferred so the second one is theirs.", when: "When you want the capability, not the dependency." },
    { tag: "Audit", title: "We audit what you already have", body: "We review your processes, tools and AI spend, and return a prioritised plan of where it is actually worth it.", when: "When you are already investing and cannot see the return." },
  ],
  es: [
    { tag: "Build", title: "Lo construimos contigo", body: "Un agente o flujo completo, en producción. Trabajamos junto a tu equipo, con tus datos y tus reglas de aprobación.", when: "Cuando ya sabes qué quieres resolver." },
    { tag: "Enable", title: "Enseñamos a tu equipo", body: "Un diagnóstico, un primer sistema construido en abierto, y el método transferido para que el segundo sea suyo.", when: "Cuando quieres la capacidad, no la dependencia." },
    { tag: "Audit", title: "Auditamos lo que ya tienes", body: "Revisamos tus procesos, herramientas y gasto en IA, y devolvemos un plan priorizado de dónde sí vale la pena.", when: "Cuando ya inviertes y no ves el retorno." },
  ],
};

const AUDIT = {
  en: [
    { n: "01", t: "Process map", b: "Where the time actually goes, with data instead of impressions." },
    { n: "02", t: "Agent candidates", b: "Which flows AI handles well and which would only add noise." },
    { n: "03", t: "Cost and return", b: "What each flow costs to run and what it saves or produces." },
    { n: "04", t: "Prioritised plan", b: "What to build first, what to postpone, what to drop." },
  ],
  es: [
    { n: "01", t: "Mapa de procesos", b: "Dónde se va el tiempo hoy, con datos y no con impresiones." },
    { n: "02", t: "Candidatos a agente", b: "Qué flujos la IA resuelve bien y cuáles solo añadirían ruido." },
    { n: "03", t: "Costo y retorno", b: "Qué cuesta operar cada flujo y qué ahorra o produce." },
    { n: "04", t: "Plan priorizado", b: "Qué construir primero, qué aplazar y qué descartar." },
  ],
};

/* No section number here on purpose: this block is an interstitial chapter, and
   numbering it would collide with the 02/03/04 the shared experience already
   prints for approach, capabilities, proof and process. */
const COPY = {
  en: {
    eyebrow: "Where agents actually pay",
    title: "Four places to start.",
    lead: "Not a catalogue of everything AI could do. Four fronts where an agent already replaces work a person is doing today.",
    waysTitle: "Three ways to work together",
    auditTitle: "Before you invest, know",
    auditLead: "Two to three weeks. You leave with a document that says which flows AI solves in your company, what they cost to run and which one to build first. If the answer is none yet, we say that too.",
  },
  es: {
    eyebrow: "Dónde la IA de verdad paga",
    title: "Cuatro lugares por donde empezar.",
    lead: "No es un catálogo de todo lo que la IA podría hacer. Son cuatro frentes donde un agente ya reemplaza trabajo que hoy hace una persona.",
    waysTitle: "Tres formas de trabajar juntos",
    auditTitle: "Antes de invertir, saber",
    auditLead: "Dos a tres semanas. Sales con un documento que dice qué flujos resuelve la IA en tu empresa, qué cuesta operarlos y cuál construir primero. Si la respuesta es ninguno todavía, también lo decimos.",
  },
};


/* Words wrapped in masks so headlines can rise out of their own baseline. */
function Masked({ text, className = "" }) {
  return text.split(" ").map((word, i, all) => (
    <Fragment key={`${word}-${i}`}>
      <span className={`${styles.mask} ${className}`}>
        <span data-word>{word}</span>
      </span>
      {i < all.length - 1 ? " " : null}
    </Fragment>
  ));
}

const pad = (n) => String(n).padStart(2, "0");

function UseCaseSection() {
  const { lang } = useLanguage();
  const t = COPY[lang];
  const blocks = USE_CASES[lang];
  const ways = WAYS[lang];
  const audit = AUDIT[lang];

  const root = useRef(null);
  const [stageOff, setStageOff] = useState(false);
  const onUnavailable = useCallback(() => setStageOff(true), []);

  /* The stage only exists at wide sizes. Gating the import here (not just
     hiding it in CSS) means phones never download the three.js chunk. */
  const [wide, setWide] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const mq = window.matchMedia("(min-width: 820px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* Choreography. Each kind of element has its own entrance, on purpose:
     - headlines rise word by word out of a mask
     - the place numbers count up to their index, then the title slides in
       from the rail it belongs to
     - hairlines draw, tags snap in, supporting copy only fades
     - the audit readouts rise at different speeds and are then filled by the
       scan, in lockstep with the scanner crossing the diorama
     Everything uses fromTo and is rebuilt when the language changes, then all
     triggers are remeasured, so nothing can stay hidden after translating. */
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return undefined;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const q = (s, scope = el) => Array.from(scope.querySelectorAll(s));

      // The step being read is marked, in every motion mode.
      q("[data-step]").forEach((item) =>
        ScrollTrigger.create({
          trigger: item,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => item.setAttribute("data-active", self.isActive ? "true" : "false"),
        })
      );

      // The audit readouts are filled by the same scroll range as the scanner.
      const readouts = q("[data-readout]");
      const paint = (progress) =>
        readouts.forEach((r, i) => {
          const v = reduced ? 1 : auditStepProgress(progress, i, readouts.length);
          const meter = r.querySelector("[data-meter]");
          const count = r.querySelector("[data-pct]");
          if (meter) meter.style.transform = `scaleX(${v.toFixed(3)})`;
          if (count) count.textContent = `${String(Math.round(v * 100)).padStart(3, "0")}%`;
          r.setAttribute("data-lit", v >= 1 ? "true" : "false");
        });
      const scanEl = el.querySelector("[data-audit-scan]");
      if (scanEl) {
        ScrollTrigger.create({
          trigger: scanEl,
          start: AUDIT_SCAN.start,
          end: AUDIT_SCAN.end,
          onUpdate: (self) => paint(self.progress),
          onRefresh: (self) => paint(self.progress),
        });
      }
      paint(reduced ? 1 : 0);

      if (reduced) {
        const settle = requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => cancelAnimationFrame(settle);
      }

      const once = (trigger, start = "top 78%") => ({ trigger, start, toggleActions: "play none none none" });

      // Headlines: words rise out of their mask.
      q("[data-rise]").forEach((h) => {
        gsap.fromTo(
          q("[data-word]", h),
          { yPercent: 118 },
          { yPercent: 0, duration: 1.15, ease: "power4.out", stagger: 0.07, scrollTrigger: once(h, "top 85%") }
        );
      });

      // Hairlines draw from the left.
      q("[data-draw]").forEach((line) => {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: "expo.out", scrollTrigger: once(line, "top 88%") }
        );
      });

      // Supporting copy only fades: it should never compete with the headline.
      q("[data-fade]").forEach((p) => {
        gsap.fromTo(
          p,
          { opacity: 0 },
          { opacity: 1, duration: 1, delay: 0.25, ease: "power1.out", scrollTrigger: once(p, "top 86%") }
        );
      });

      // Places: the number counts to its index, then the case enters.
      q("[data-place]").forEach((place) => {
        const num = place.querySelector("[data-count]");
        const target = Number(num?.getAttribute("data-value") || 0);
        const tl = gsap.timeline({ scrollTrigger: once(place, "top 72%") });
        if (num) {
          const counter = { v: 0 };
          tl.fromTo(num, { yPercent: 100 }, { yPercent: 0, duration: 0.8, ease: "expo.out" }, 0);
          tl.fromTo(
            counter,
            { v: 0 },
            {
              v: target,
              duration: 0.7,
              ease: "steps(4)",
              onUpdate: () => (num.textContent = pad(Math.max(0, Math.round(counter.v)))),
            },
            0
          );
        }
        tl.fromTo(place.querySelector("[data-tag]"), { xPercent: -30, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.5, ease: "back.out(2)" }, 0.2)
          .fromTo(place.querySelector("h3"), { x: -36, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: "expo.out" }, 0.28)
          .fromTo(place.querySelector("[data-body]"), { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power1.out" }, 0.5)
          .fromTo(q("li", place), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.08 }, 0.62);
      });

      // Ways: tag snaps, title lifts, the "when" line arrives last.
      q("[data-way]").forEach((way) => {
        gsap
          .timeline({ scrollTrigger: once(way, "top 74%") })
          .fromTo(way.querySelector("[data-tag]"), { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2.4)" }, 0.1)
          .fromTo(way.querySelector("h4"), { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.18)
          .fromTo(way.querySelector("[data-body]"), { opacity: 0 }, { opacity: 1, duration: 0.7 }, 0.4)
          .fromTo(way.querySelector("[data-when]"), { x: 18, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 0.6);
      });

      // Audit readouts climb into place at different speeds, scrubbed.
      q("[data-readout]").forEach((r, i) => {
        gsap.fromTo(
          r,
          { y: 70 + i * 45 },
          { y: 0, ease: "none", scrollTrigger: { trigger: scanEl || r, start: "top bottom", end: "top 45%", scrub: 0.8 + i * 0.25 } }
        );
      });

      // Language changes the height of every block: remeasure everything,
      // after this render has finished creating its triggers.
      const remeasure = requestAnimationFrame(() => ScrollTrigger.refresh());

      // A counter left mid-tween by a language switch must read its real value.
      return () => {
        cancelAnimationFrame(remeasure);
        q("[data-count]").forEach((n) => (n.textContent = n.getAttribute("data-value").padStart(2, "0")));
      };
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true }
  );

  return (
    <section ref={root} className={`${styles.useCases} ${stageOff ? styles.stageOff : ""}`}>
      <header className={styles.head} data-stage="overview">
        <div className={styles.headMeta}>
          <p className={styles.eyebrow}>{t.eyebrow}</p>
          <p className={styles.eyebrow}>{pad(blocks.length)} — {pad(ways.length)} — {pad(audit.length)}</p>
          <span className={styles.headRule} data-draw />
        </div>
        <h2 className={styles.title} data-rise>
          <Masked text={t.title} />
        </h2>
        <p className={styles.lead} data-fade>{t.lead}</p>
      </header>

      <div className={styles.journey}>
        <div className={styles.chapters}>
          <div className={styles.places}>
            {blocks.map((b, i) => (
              <article key={b.id} className={styles.place} data-stage={`place-${i}`} data-step data-place>
                <div className={styles.placeIndex}>
                  <span className={styles.numMask}>
                    <span className={styles.placeNum} data-count data-value={String(i + 1)}>{pad(i + 1)}</span>
                  </span>
                  <span className={styles.placeOf}>/ {pad(blocks.length)}</span>
                  <span className={styles.blockTag} data-tag>{b.tag}</span>
                </div>
                <h3>{b.title}</h3>
                <p className={styles.placeBody} data-body>{b.body}</p>
                <ul className={styles.placeItems}>
                  {b.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className={styles.ways}>
            <h3 className={styles.subHead} data-rise>
              <Masked text={t.waysTitle} />
            </h3>
            {ways.map((w, i) => (
              <article key={w.tag} className={styles.way} data-stage={`way-${i}`} data-step data-way>
                <span className={styles.wayLine} data-draw />
                <span className={styles.wayTag} data-tag>{w.tag}</span>
                <div className={styles.wayText}>
                  <h4>{w.title}</h4>
                  <p className={styles.wayBody} data-body>{w.body}</p>
                  <p className={styles.wayWhen} data-when>{w.when}</p>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.audit} data-stage="audit">
            <p className={styles.auditEyebrow}>{pad(audit.length)} / {t.auditTitle}</p>
            <h3 className={styles.auditTitle} data-rise>
              <Masked text={t.auditTitle} />
            </h3>
            <p className={styles.auditLead} data-fade>{t.auditLead}</p>
            <ol className={styles.readouts} data-audit-scan>
              {audit.map((a) => (
                <li key={a.n} className={styles.readout} data-readout data-step>
                  <span className={styles.readoutNum}>{a.n}</span>
                  <div className={styles.readoutText}>
                    <h4>{a.t}</h4>
                    <p>{a.b}</p>
                    <div className={styles.meter}>
                      <span data-meter />
                    </div>
                  </div>
                  <span className={styles.readoutPct} data-pct>000%</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {!stageOff && (
          <div className={styles.stageCol}>
            <div className={styles.stage}>
              {wide && <ScrollCompanion
                scope={root}
                onUnavailable={onUnavailable}
                labels={{
                  place: blocks.map((b) => b.tag),
                  way: ways.map((w) => w.tag),
                  audit: audit.map((a) => a.t),
                }}
                titles={{
                  overview: t.title,
                  place: t.title,
                  way: t.waysTitle,
                  audit: t.auditTitle,
                }}
              />}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export { UseCaseSection };
export default UseCaseSection;
