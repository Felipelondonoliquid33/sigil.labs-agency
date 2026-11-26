"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import SignalField from "./components/SignalField";
import AgenticField from "./components/AgenticField";
import LiveSigil from "@/components/StorySlides/LiveSigil";
import styles from "./services.module.css";
import { useLanguage } from "./LanguageContext";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* UI strings owned by the shared experience rather than by any single service.
   Pages without a language provider resolve to "en", so the four original
   service pages render exactly as before. */
const UI = {
  en: {
    allServices: "← All services",
    serviceLabel: (n) => `SIGIL LABS / SERVICE ${n}`,
    pointOfView: "01 / The point of view",
    whatWeBring: "02 / What we bring",
    explorePossibilities: "Explore the possibilities",
    selectedWork: "03 / Selected work",
    workingTogether: "04 / Working together",
    path: "A clear path.",
    openMind: "An open mind.",
    haveSomething: "Have something in mind?",
    aiLabels: ["Understand", "Orchestrate", "Act & evaluate"],
    phases: ["Structure", "Connections", "Interface", "Intelligence"],
    next: "Next",
    exploreWork: "Explore selected work",
  },
  es: {
    allServices: "← Todos los servicios",
    serviceLabel: (n) => `SIGIL LABS / SERVICIO ${n}`,
    pointOfView: "01 / El punto de vista",
    whatWeBring: "02 / Lo que aportamos",
    explorePossibilities: "Explora las posibilidades",
    selectedWork: "03 / Trabajo seleccionado",
    workingTogether: "04 / Trabajar juntos",
    path: "Un camino claro.",
    openMind: "Una mente abierta.",
    haveSomething: "¿Tienes algo en mente?",
    aiLabels: ["Entender", "Orquestar", "Actuar y evaluar"],
    phases: ["Estructura", "Conexiones", "Interfaz", "Inteligencia"],
    next: "Siguiente",
    exploreWork: "Explorar trabajo seleccionado",
  },
};

function CapabilityDeck({ service, direction }) {
  const root = useRef(null);
  const [flipped, setFlipped] = useState(null);
  // React adaptation of the showroom's CardTriptychFlip, with real front/back content.
  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tweens = Array.from(root.current.querySelectorAll("[data-flip-inner]")).map((card, i) =>
      gsap.to(card, { rotationY: flipped === i ? 180 : 0, duration: reduced ? 0 : 0.9, ease: "power3.inOut", overwrite: true })
    );
    return () => tweens.forEach((tween) => tween.kill());
  }, { scope: root, dependencies: [flipped] });
  return <div className={styles.deck} ref={root}>
    {service.capabilities.map((item, i) => <button key={item.title} className={styles.flipCard} aria-expanded={flipped === i} onClick={() => setFlipped(flipped === i ? null : i)} aria-label={`${item.title}: ${flipped === i ? "close details" : "explore deliverables"}`}>
      <span data-flip-inner className={styles.flipInner}>
        <span className={styles.cardFront} aria-hidden={flipped === i}>
          <span className={styles.cardTop}><span>0{i + 1} / CAPABILITY</span><span>↗</span></span>
          <span className={styles.cardSigil}><LiveSigil index={i} /></span>
          <span className={styles.cardHeading}>{item.title}</span>
          <span className={styles.cardHint}>Explore the craft <span>+</span></span>
        </span>
        <span className={styles.cardBack} aria-hidden={flipped !== i}>
          <span className={styles.cardTop}>0{i + 1} / THE DELIVERABLE</span>
          <span className={styles.cardHeading}>{item.title}</span>
          <span className={styles.cardText}>{item.text}</span>
          <span className={styles.cardOutcome}>{direction.outcomes[i]}</span>
          <span className={styles.cardHint}>Back to overview <span>−</span></span>
        </span>
      </span>
    </button>)}
  </div>;
}

function IntelligenceFlow({ service, direction, t }) {
  return <div className={styles.flow}>
    <svg className={styles.flowLine} viewBox="0 0 100 800" preserveAspectRatio="none" aria-hidden="true">
      <path d="M50 0 V800" stroke="currentColor" opacity=".15" fill="none" />
      <path data-flow-path d="M50 0 V800" stroke="currentColor" strokeWidth="3" fill="none" />
    </svg>
    {service.capabilities.map((item, i) => <article data-reveal className={styles.flowStep} key={item.title}>
      <span className={styles.flowNode}>0{i + 1}</span>
      <div><p className={styles.eyebrow}>{t.aiLabels[i]}</p><h3>{item.title}</h3><p>{item.text}</p><p className={styles.flowOutcome}>{direction.outcomes[i]}</p></div>
    </article>)}
  </div>;
}

export default function ServiceExperience({ service, direction, projects, extra }) {
  const root = useRef(null);
  const { lang } = useLanguage();
  const t = UI[lang] || UI.en;
  /* A direction may ship its own Spanish copy. When it does not, the English
     copy is used untouched, which is why the four original pages need no edit. */
  const d = (lang === "es" && direction.es) ? { ...direction, ...direction.es } : direction;
  const [phase, setPhase] = useState(direction.mode === "intelligence" ? 0 : 2);
  const [activeCapability, setActiveCapability] = useState(0);
  const lenis = useLenis(() => ScrollTrigger.update());

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(root.current.querySelectorAll("[data-hero-line]"), { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.12, ease: "power4.out" });
      root.current.querySelectorAll("[data-reveal]").forEach((element) => {
        gsap.fromTo(element, { y: 45, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 92%", once: true } });
      });
      const path = root.current.querySelector("[data-flow-path]");
      if (path) {
        const length = path.getTotalLength();
        gsap.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: path.closest("div"), start: "top 65%", end: "bottom 65%", scrub: 1 } });
      }
      // Animated closing CTA: masked line reveal + magnetic arrow on hover.
      const cta = root.current.querySelector("[data-cta]");
      let ctaCleanup;
      if (cta) {
        const ctaLines = cta.querySelectorAll("[data-cta-line]");
        const arrow = cta.querySelector("[data-cta-arrow]");
        gsap.fromTo(ctaLines, { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.12, ease: "power4.out", scrollTrigger: { trigger: cta, start: "top 85%", once: true } });
        gsap.fromTo(arrow, { scale: 0, rotate: -60, autoAlpha: 0 }, { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.9, ease: "back.out(1.7)", scrollTrigger: { trigger: cta, start: "top 85%", once: true } });
        const ax = gsap.quickTo(arrow, "x", { duration: 0.5, ease: "power3.out" });
        const ay = gsap.quickTo(arrow, "y", { duration: 0.5, ease: "power3.out" });
        const lx = gsap.quickTo(ctaLines, "x", { duration: 0.5, ease: "power3.out" });
        const enter = () => { ax(28); ay(-28); lx(20); };
        const leave = () => { ax(0); ay(0); lx(0); };
        cta.addEventListener("pointerenter", enter);
        cta.addEventListener("pointerleave", leave);
        ctaCleanup = () => { cta.removeEventListener("pointerenter", enter); cta.removeEventListener("pointerleave", leave); };
      }
      return () => { ctaCleanup?.(); };
    });
    mm.add("(min-width: 1001px) and (prefers-reduced-motion: no-preference)", () => {
      // FLH home.js fan movement, resized to a bounded hero instead of crossing sections.
      const fans = root.current.querySelectorAll("[data-fan]");
      fans.forEach((card, i) => gsap.to(card, { y: (i === 1 ? -1 : 1) * 65, rotation: (i - 1) * 13, ease: "none", scrollTrigger: { trigger: root.current.querySelector("[data-hero]"), start: "top top", end: "bottom top", scrub: 1.1 } }));
      // Cursor-driven 3D tilt on the interactive project frames (inner layer,
      // independent of the scroll fan transform on the outer frame).
      const tiltCleanups = [];
      root.current.querySelectorAll("[data-tilt]").forEach((el) => {
        gsap.set(el, { transformPerspective: 800, transformOrigin: "center center" });
        const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
        const ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });
        const sc = gsap.quickTo(el, "scale", { duration: 0.5, ease: "power3.out" });
        const move = (e) => {
          const r = el.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 18);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 14);
          sc(1.05);
        };
        const leave = () => { rx(0); ry(0); sc(1); };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        tiltCleanups.push(() => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); });
      });
      // FLH project.js snapshot rail, measured from its actual content.
      const viewport = root.current.querySelector("[data-proof]");
      const rail = root.current.querySelector("[data-proof-rail]");
      const distance = () => Math.max(0, rail.scrollWidth - viewport.clientWidth);
      const tl = gsap.timeline({ scrollTrigger: { trigger: viewport, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true } });
      tl.to(rail, { x: () => -distance(), ease: "none" }, 0)
        .fromTo(root.current.querySelector("[data-proof-progress]"), { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);
      return () => tiltCleanups.forEach((fn) => fn());
    });
    let alive = true;
    document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
    return () => { alive = false; mm.revert(); };
  }, { scope: root });

  const goToWork = () => {
    const target = root.current.querySelector("[data-proof]");
    if (lenis) lenis.scrollTo(target, { immediate: window.matchMedia("(prefers-reduced-motion: reduce)").matches });
    else target.scrollIntoView({ behavior: "auto" });
  };

  return <div ref={root} className={styles.experience} data-service={direction.mode}>
    <section className={styles.hero} data-hero>
      <div className={styles.heroMeta}><a href="/stories">{t.allServices}</a><span>{t.serviceLabel(d.number)}</span></div>
      <h1 className={styles.heroTitle}>{d.lines.map((line) => <span className={styles.lineMask} key={line}><span data-hero-line>{line}</span></span>)}</h1>
      <div className={`${styles.heroVisual} ${styles[direction.mode]}`}>
        {direction.mode === "creative" ? <div className={styles.fan}>
          {projects.map((project, i) => <a data-fan href={project.href} className={styles.fanCard} key={project.href} style={{ "--fan-index": i }}>
            <img src={project.image.src} alt={project.image.alt} fetchPriority={i === 1 ? "high" : "auto"} />
            <span>{project.name}<span>↗</span></span>
          </a>)}
        </div> : <>
          {direction.mode === "intelligence" && <AgenticField phase={phase} className={styles.signalField} />}
          {direction.mode === "interactive" && <div className={styles.spatialFrames}>
            {[projects[0], projects[1]].map((project, i) => <a data-fan className={styles.spatialFrame} key={project.href} href={project.href} style={{ "--fan-index": i }}>
              <span className={styles.spatialInner} data-tilt>
                <img src={project.image.src} alt={project.image.alt} />
                <span>{project.name} ↗</span>
              </span>
            </a>)}
          </div>}
          {direction.mode === "intelligence" && <div className={styles.fieldControls} aria-label={t.exploreWork}>
            {t.phases.map((label, i) => <button key={label} aria-pressed={phase === i} onClick={() => setPhase(i)}>{label}</button>)}
          </div>}
        </>}
      </div>
      <div className={styles.heroBottom}><p className={styles.eyebrow}>{d.caption}</p><p>{service.description}</p><button onClick={goToWork} className={styles.roundLink} aria-label={t.exploreWork}>↓</button></div>
    </section>

    <section className={styles.approach}>
      <p className={styles.eyebrow}>{t.pointOfView}</p>
      <div><h2 data-reveal>{d.approach}</h2><p data-reveal className={styles.approachText}>{service.intro}</p></div>
    </section>

    {extra}

    <section className={styles.capabilities}>
      <div className={styles.sectionHeader}><p className={styles.eyebrow}>{t.whatWeBring}</p><h2 data-reveal>{d.deckTitle}</h2></div>
      {direction.mode === "intelligence" ? <IntelligenceFlow service={service} direction={d} t={t} /> : direction.mode === "creative" ? <CapabilityDeck service={service} direction={d} t={t} /> : <div className={styles.interactionLab}>
        <div className={styles.labVisual}><SignalField phase={activeCapability === 0 ? 2 : activeCapability === 1 ? 3 : 0} className={styles.signalField} /></div>
        <div className={styles.labCopy}>
          <p className={styles.eyebrow}>{t.explorePossibilities}</p>
          <div className={styles.labButtons}>{service.capabilities.map((item, i) => <button key={item.title} aria-pressed={activeCapability === i} onClick={() => setActiveCapability(i)}><span>0{i + 1}</span>{item.title}<span>{activeCapability === i ? "−" : "+"}</span></button>)}</div>
          <div aria-live="polite" className={styles.labDescription}><h3>{service.capabilities[activeCapability].title}</h3><p>{service.capabilities[activeCapability].text}</p><p>{d.outcomes[activeCapability]}</p></div>
        </div>
      </div>}
    </section>

    <section data-proof className={styles.proof} aria-label={t.selectedWork}>
      <div className={styles.proofHeader}><p className={styles.eyebrow}>{t.selectedWork}</p><h2>{d.proofTitle}</h2><span className={styles.eyebrow}>01 — 03</span></div>
      <div data-proof-rail className={styles.proofRail}>{projects.map((project, i) => <a className={styles.projectCard} href={project.href} key={project.href}>
        <div className={styles.projectImage}><img src={project.image.src} alt={project.image.alt} loading="lazy" /></div>
        <div className={styles.projectCaption}><span className={styles.eyebrow}>0{i + 1} / {project.discipline}</span><h3>{project.name}</h3><span className={styles.projectArrow}>↗</span></div>
      </a>)}</div>
      <div className={styles.railProgress} aria-hidden="true"><span data-proof-progress /></div>
    </section>

    <section className={styles.process}>
      <div className={styles.sectionHeader}><p className={styles.eyebrow}>{t.workingTogether}</p><h2 data-reveal>{t.path}<br />{t.openMind}</h2></div>
      <ol>{d.steps.map((step, i) => <li data-reveal key={step}><span>0{i + 1}</span><h3>{step}</h3></li>)}</ol>
    </section>
    <footer className={styles.closing}>
      <p className={styles.eyebrow}>{t.haveSomething}</p>
      <a className={styles.closingLink} href="/contact" data-cta><h2>{d.closing.split("\n").map((line) => <span className={styles.ctaLineMask} key={line}><span data-cta-line>{line}</span></span>)}</h2><span data-cta-arrow>↗</span></a>
      <div className={styles.closingBottom}><span>SIGIL LABS · BOGOTÁ / EVERYWHERE</span><a href={`/services/${d.next}`}>{t.next} / {d.nextName} ↗</a></div>
    </footer>
  </div>;
}
