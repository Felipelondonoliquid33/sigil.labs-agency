"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLanguage } from "../LanguageContext";
import styles from "./agentic-products.module.css";

/* three.js is heavy, and the artifact is a desktop-only passenger. Loading it
   through next/dynamic keeps it out of the initial bundle: the page is fully
   readable before the lattice code is even requested. */
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

function UseCaseSection() {
  const { lang } = useLanguage();
  const t = COPY[lang];
  const blocks = USE_CASES[lang];
  const ways = WAYS[lang];
  const audit = AUDIT[lang];

  const root = useRef(null);

  /* Each chapter gets a real journey instead of a one-shot fade:
     - the four places are read one by one as the reader scrolls through them
     - the three ways alternate sides so the eye travels down the section
     - the audit steps light up in sequence, like a scan passing over them
     All of it is scrubbed, so scrolling back up plays it in reverse. */
  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    root.current.querySelectorAll("[data-journey]").forEach((chapter) => {
      const items = chapter.querySelectorAll("[data-step]");

      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { y: 52, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      // A progress rail fills as the chapter is read. It gives the section a
      // sense of length, which is what was missing before.
      const rail = chapter.querySelector("[data-rail] span");
      if (rail) {
        gsap.fromTo(
          rail,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: chapter,
              start: "top 65%",
              end: "bottom 65%",
              scrub: 0.6,
            },
          }
        );
      }

      // The active step gets marked, so the reading order is unambiguous.
      if (items.length) {
        items.forEach((item) => {
          ScrollTrigger.create({
            trigger: item,
            start: "top 60%",
            end: "bottom 40%",
            onToggle: (self) => item.setAttribute("data-active", self.isActive ? "true" : "false"),
          });
        });
      }
    });

    // The audit steps are a sequence, so they light up in order rather than
    // all at once: a scan passing over the four columns.
    const auditSteps = root.current.querySelectorAll("[data-audit-step]");
    auditSteps.forEach((step, i) => {
      gsap.fromTo(
        step,
        { opacity: 0.28, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root.current.querySelector("[data-audit]" ),
            start: "top 72%",
            end: "bottom 70%",
            scrub: 0.8,
            onUpdate: (self) => {
              // Reveal step i once the scan has passed its share.
              const gate = (i + 1) / (auditSteps.length + 0.6);
              step.style.setProperty("--lit", self.progress > gate ? "1" : "0");
            },
          },
        }
      );
    });

    if (!reduced) {
      // Gentle parallax on the chapter numbers: they lag behind the copy.
      root.current.querySelectorAll("[data-drift]").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: 12 },
          {
            yPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      });
    }

    // The copy changes length with the language, so every trigger must be
    // remeasured or the later chapters stay invisible.
    ScrollTrigger.refresh();
  }, { scope: root, dependencies: [lang] });

  return (
    <section ref={root} className={styles.useCases}>
      <ScrollCompanion className={styles.companion} />

      <div className={styles.head}>
        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <h2 data-reveal>{t.title}</h2>
        <p className={styles.lead}>{t.lead}</p>
      </div>

      <div className={styles.blocks} data-journey data-companion-start>
        <div className={styles.rail} data-rail aria-hidden="true"><span /></div>
        {blocks.map((b, i) => (
          <article key={b.id} className={styles.block} data-block data-step>
            <div className={styles.blockHead}>
              <span className={styles.blockNum} data-drift>0{i + 1}</span>
              <span className={styles.blockTag}>{b.tag}</span>
            </div>
            <h3>{b.title}</h3>
            <p className={styles.blockBody}>{b.body}</p>
            <ul className={styles.blockItems}>
              {b.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className={styles.ways} data-journey>
        <div className={styles.rail} data-rail aria-hidden="true"><span /></div>
        <h3 className={styles.subHead}>{t.waysTitle}</h3>
        <div className={styles.wayGrid}>
          {ways.map((w) => (
            <article key={w.tag} className={styles.way} data-step>
              <span className={styles.wayTag}>{w.tag}</span>
              <h4>{w.title}</h4>
              <p className={styles.wayBody}>{w.body}</p>
              <p className={styles.wayWhen}>{w.when}</p>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.audit} data-audit>
        <div className={styles.auditHead}>
          <p className={styles.eyebrow}>{t.auditTitle}</p>
          <p className={styles.auditLead}>{t.auditLead}</p>
        </div>
        <div className={styles.auditGrid}>
          {audit.map((a) => (
            <div key={a.n} className={styles.auditStep} data-audit-step>
              <span className={styles.auditNum}>{a.n}</span>
              <h4>{a.t}</h4>
              <p>{a.b}</p>
            </div>
          ))}
        </div>
      </div>

      <span data-companion-end hidden />
    </section>
  );
}

export { UseCaseSection };
export default UseCaseSection;
