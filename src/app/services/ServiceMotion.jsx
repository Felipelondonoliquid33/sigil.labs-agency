"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./services.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ServiceMotion({ capabilities }) {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const cards = Array.from(
        sectionRef.current?.querySelectorAll("[data-service-card]") || []
      );
      if (!cards.length) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(cards, { clearProps: "all" });
      });

      mm.add("(min-width: 801px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(cards, { y: 110, scale: 0.86, opacity: 0.35 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${window.innerHeight * 2.2}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        cards.forEach((card, index) => {
          timeline.to(
            card,
            {
              y: index * -18,
              x: (index - 1) * 24,
              rotation: (index - 1) * 4,
              scale: 1 - index * 0.035,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
            },
            index * 0.28
          );
        });
      });

      mm.add("(max-width: 800px) and (prefers-reduced-motion: no-preference)", () => {
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { y: 32, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 88%", once: true },
            }
          );
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section className={styles.motionSection} ref={sectionRef} aria-label="How SIGIL LABS works">
      <div className={styles.motionIntro}>
        <p className={styles.eyebrow}>THE SIGNAL</p>
        <p>Fast enough to move. Human enough to matter.</p>
      </div>
      <div className={styles.motionStage}>
        {capabilities.map((capability, index) => (
          <article className={styles.motionCard} data-service-card key={capability.title}>
            <span className={styles.cardIndex}>0{index + 1}</span>
            <h3>{capability.title}</h3>
            <p>{capability.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
