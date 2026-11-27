"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLanguage } from "../LanguageContext";
import styles from "./agentic-products.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ────────────────────────────────────────────────────────────────────────────
   Work demos — "The work it takes over", shown happening.

   The use-case section above is the world seen from a distance: a model on a
   table. This is the camera going into the screen. One sticky window plays
   three short demos, each scrubbed by scroll so the reader is the playhead:
     01  a lead on WhatsApp, answered, qualified and booked
     02  rows from the CRM assembling themselves into a quote
     03  a question answered from the manual, with the passage lit up
   DOM and SVG only — no WebGL — so it is light and reads on any device.

   Props (from ServiceExperience.renderCapabilities):
     service    the page's service copy (capabilities: { title, text }[])
     direction  the language-resolved direction (outcomes: string[])
     t          the shared UI strings (aiLabels: string[])
   ──────────────────────────────────────────────────────────────────────────── */

const DEMO = {
  en: {
    outcome: "Outcome",
    chat: {
      business: "Your business",
      status: "online",
      timer: "First reply",
      m: [
        "Hi! How much for 50 printed shirts?",
        "Hi Laura. 50 units start at $11 each. Is it for a specific date?",
        "A company event on March 14.",
        "That works. I booked you 15 min with Andrés tomorrow at 10:00 and I am sending the quote now.",
      ],
      card: ["Call booked", "Tomorrow · 10:00 · 15 min · Andrés"],
      chip: "Qualified lead · handed to Andrés with a summary",
    },
    doc: {
      source: "From your CRM and inventory",
      cols: ["Item", "Qty", "Price"],
      rows: [
        ["Cotton shirt", 50, 11],
        ["Two-colour print", 50, 3.5],
        ["Delivery, Bogotá", 1, 25],
      ],
      title: "Quote",
      client: "Laura M. · Company event · Mar 14",
      total: "Total",
      stamp: "Sent · 38 s",
    },
    answer: {
      q: "Can I return a product after 30 days?",
      a: "Yes. You have up to 45 days with proof of purchase, as long as the product is unused.",
      sources: ["Returns policy §4.2", "Customer manual p. 12"],
      doc: "Returns policy · v3",
      passage: "4.2 Returns are accepted within 45 days of purchase, with proof of purchase, for unused products.",
      status: "Source attached · no escalation needed",
    },
  },
  es: {
    outcome: "Resultado",
    chat: {
      business: "Tu negocio",
      status: "en línea",
      timer: "Primera respuesta",
      m: [
        "¡Hola! ¿Cuánto valen 50 camisetas estampadas?",
        "Hola Laura. 50 unidades salen desde $11 c/u. ¿Es para una fecha puntual?",
        "Un evento de empresa el 14 de marzo.",
        "Perfecto. Te agendé 15 min con Andrés mañana a las 10:00 y ya te envío la cotización.",
      ],
      card: ["Llamada agendada", "Mañana · 10:00 · 15 min · Andrés"],
      chip: "Lead calificado · traspasado a Andrés con resumen",
    },
    doc: {
      source: "Desde tu CRM e inventario",
      cols: ["Ítem", "Cant.", "Precio"],
      rows: [
        ["Camiseta de algodón", 50, 11],
        ["Estampado a dos tintas", 50, 3.5],
        ["Envío, Bogotá", 1, 25],
      ],
      title: "Cotización",
      client: "Laura M. · Evento de empresa · 14 mar",
      total: "Total",
      stamp: "Enviada · 38 s",
    },
    answer: {
      q: "¿Puedo devolver un producto después de 30 días?",
      a: "Sí. Tienes hasta 45 días con el comprobante de compra, siempre que el producto no se haya usado.",
      sources: ["Política de devoluciones §4.2", "Manual del cliente p. 12"],
      doc: "Política de devoluciones · v3",
      passage: "4.2 Se aceptan devoluciones dentro de los 45 días posteriores a la compra, con comprobante, para productos sin uso.",
      status: "Fuente adjunta · no requiere escalar",
    },
  },
};

const money = (n) => `$${n.toFixed(2)}`;

/* Pure: running totals of the quote, line by line. */
export function quoteTotals(rows) {
  let sum = 0;
  return rows.map(([, qty, price]) => (sum += qty * price));
}

function ChatScene({ d, active }) {
  return (
    <div className={styles.scene} data-scene-pane="0" data-on={active}>
      <div className={styles.chatHead}>
        <span className={styles.avatar}>S</span>
        <div>
          <b>{d.business}</b>
          <small>
            {d.status}
            <span className={styles.typing} data-typing aria-hidden="true"><i /><i /><i /></span>
          </small>
        </div>
        <span className={styles.timer}>
          {d.timer} <b data-timer>00:00</b>
        </span>
      </div>
      <div className={styles.chatBody}>
        <p className={styles.msgIn} data-m>{d.m[0]}</p>
        <p className={styles.msgOut} data-m>{d.m[1]}</p>
        <p className={styles.msgIn} data-m>{d.m[2]}</p>
        <p className={styles.msgOut} data-m>{d.m[3]}</p>
        <div className={styles.bookCard} data-m>
          <span className={styles.bookIcon} aria-hidden="true">
            <i />
          </span>
          <div>
            <b>{d.card[0]}</b>
            <small>{d.card[1]}</small>
          </div>
        </div>
        <p className={styles.sysChip} data-m>{d.chip}</p>
      </div>
    </div>
  );
}

function DocScene({ d, active }) {
  const totals = quoteTotals(d.rows);
  return (
    <div className={styles.scene} data-scene-pane="1" data-on={active}>
      <div className={styles.docGrid}>
        <div className={styles.sheet}>
          <p className={styles.sheetHead}>{d.source}</p>
          <div className={styles.sheetRow} data-cols>
            {d.cols.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
          {d.rows.map(([item, qty, price]) => (
            <div key={item} className={styles.sheetRow} data-row>
              <i data-row-mark />
              <span>{item}</span>
              <span>{qty}</span>
              <span>{money(price)}</span>
            </div>
          ))}
        </div>
        <div className={styles.quote}>
          <div className={styles.quoteHead}>
            <b>{d.title}</b>
            <span>#2026-118</span>
          </div>
          <p className={styles.quoteClient}>{d.client}</p>
          {d.rows.map(([item, qty, price]) => (
            <div key={item} className={styles.quoteLine} data-line>
              <span>
                {item} <small>× {qty}</small>
              </span>
              <span>{money(qty * price)}</span>
            </div>
          ))}
          <div className={styles.quoteTotal}>
            <span>{d.total}</span>
            <b data-total data-final={totals[totals.length - 1]}>{money(0)}</b>
          </div>
          <span className={styles.stamp} data-stamp>{d.stamp}</span>
        </div>
      </div>
    </div>
  );
}

function AnswerScene({ d, active }) {
  return (
    <div className={styles.scene} data-scene-pane="2" data-on={active}>
      <div className={styles.answerGrid}>
        <div className={styles.thread}>
          <p className={styles.msgIn} data-q>{d.q}</p>
          <div className={styles.reply}>
            <p data-reply>
              {d.a.split(" ").map((w, i) => (
                <span key={`${w}-${i}`} data-w>
                  {w}{" "}
                </span>
              ))}
            </p>
            <div className={styles.chips}>
              {d.sources.map((s, i) => (
                <span key={s} className={styles.chip} data-chip>
                  <b>{i + 1}</b>
                  {s}
                </span>
              ))}
            </div>
          </div>
          <p className={styles.answerStatus} data-status>{d.status}</p>
        </div>
        <div className={styles.page}>
          <p className={styles.pageHead}>{d.doc}</p>
          {[92, 78, 86, 60].map((w, i) => (
            <span key={`a${i}`} className={styles.pageLine} style={{ width: `${w}%` }} />
          ))}
          <p className={styles.passage}>
            <i data-hl />
            <span>{d.passage}</span>
          </p>
          {[88, 70, 82, 54].map((w, i) => (
            <span key={`b${i}`} className={styles.pageLine} style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WorkDemos({ service, direction, t }) {
  const { lang } = useLanguage();
  const D = DEMO[lang] || DEMO.en;
  const caps = service.capabilities;
  const root = useRef(null);
  const [scene, setScene] = useState(0);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return undefined;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const q = (s, scope = el) => Array.from(scope.querySelectorAll(s));
      const pane = (i) => el.querySelector(`[data-scene-pane="${i}"]`);
      const steps = q("[data-demo-step]");

      // Which demo is on screen follows the step being read.
      steps.forEach((step, i) =>
        ScrollTrigger.create({
          trigger: step,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            step.setAttribute("data-active", self.isActive ? "true" : "false");
            if (self.isActive) setScene(i);
          },
        })
      );

      // ── 01 Chat ────────────────────────────────────────────────────────
      const chat = pane(0);
      const timer = chat.querySelector("[data-timer]");
      const clock = { s: 0 };
      const msgs = q("[data-m]", chat);
      const typing = chat.querySelector("[data-typing]");
      const tl0 = gsap.timeline({ paused: true, defaults: { ease: "power2.out", duration: 0.5 } });
      tl0
        .fromTo(msgs[0], { y: 18, opacity: 0 }, { y: 0, opacity: 1 }, 0)
        .fromTo(typing, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.25 }, 0.5)
        .fromTo(clock, { s: 0 }, {
          s: 4,
          duration: 0.6,
          ease: "none",
          onUpdate: () => (timer.textContent = `00:0${Math.round(clock.s)}`),
        }, 0.5)
        .to(typing, { opacity: 0, duration: 0.15 }, 1.1)
        .fromTo(msgs[1], { y: 18, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1 }, 1.15)
        .fromTo(msgs[2], { y: 18, opacity: 0 }, { y: 0, opacity: 1 }, 1.8)
        .fromTo(msgs[3], { y: 18, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1 }, 2.4)
        .fromTo(msgs[4], { x: 40, opacity: 0 }, { x: 0, opacity: 1, ease: "back.out(1.6)" }, 3.0)
        .fromTo(msgs[5], { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, ease: "back.out(2)" }, 3.5);

      // ── 02 Quote ───────────────────────────────────────────────────────
      const doc = pane(1);
      const rows = q("[data-row]", doc);
      const marks = q("[data-row-mark]", doc);
      const lines = q("[data-line]", doc);
      const totalEl = doc.querySelector("[data-total]");
      const totals = quoteTotals(D.doc.rows);
      const sum = { v: 0 };
      const tl1 = gsap.timeline({ paused: true, defaults: { ease: "power3.out", duration: 0.5 } });
      tl1.fromTo(rows, { opacity: 0, x: -16 }, { opacity: 1, x: 0, stagger: 0.12 }, 0);
      rows.forEach((row, k) => {
        const at = 0.7 + k * 0.75;
        tl1
          .fromTo(marks[k], { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: "power2.inOut" }, at)
          .fromTo(lines[k], { opacity: 0, x: -48 }, { opacity: 1, x: 0 }, at + 0.25)
          .to(sum, {
            v: totals[k],
            duration: 0.45,
            ease: "power1.out",
            onUpdate: () => (totalEl.textContent = money(sum.v)),
          }, at + 0.3);
      });
      tl1.fromTo(
        doc.querySelector("[data-stamp]"),
        { opacity: 0, scale: 1.8, rotate: -14 },
        { opacity: 1, scale: 1, rotate: -6, duration: 0.4, ease: "back.out(2.2)" },
        3.1
      );

      // ── 03 Grounded answer ─────────────────────────────────────────────
      const ans = pane(2);
      const tl2 = gsap.timeline({ paused: true, defaults: { ease: "power2.out", duration: 0.5 } });
      const chips = q("[data-chip]", ans);
      tl2
        .fromTo(ans.querySelector("[data-q]"), { y: 18, opacity: 0 }, { y: 0, opacity: 1 }, 0)
        .fromTo(q("[data-w]", ans), { opacity: 0.08 }, { opacity: 1, duration: 0.15, stagger: 0.06 }, 0.5)
        .fromTo(chips[0], { opacity: 0, y: 10 }, { opacity: 1, y: 0, ease: "back.out(2)" }, 1.9)
        .fromTo(ans.querySelector("[data-hl]"), { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, 2.1)
        .fromTo(chips[1], { opacity: 0, y: 10 }, { opacity: 1, y: 0, ease: "back.out(2)" }, 2.6)
        .fromTo(ans.querySelector("[data-status]"), { opacity: 0 }, { opacity: 1 }, 3.1);

      const timelines = [tl0, tl1, tl2];

      if (reduced) {
        timelines.forEach((tl) => tl.progress(1));
      } else {
        // The reader is the playhead: each demo is scrubbed by its own step.
        steps.forEach((step, i) =>
          ScrollTrigger.create({
            trigger: step,
            start: "top 70%",
            end: "bottom 65%",
            scrub: 0.6,
            animation: timelines[i],
          })
        );
        // Step copy: eyebrow and title first, the outcome lands as a receipt.
        steps.forEach((step) => {
          gsap
            .timeline({ scrollTrigger: { trigger: step, start: "top 75%", toggleActions: "play none none none" } })
            .fromTo(step.querySelector("h3"), { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: "expo.out" }, 0)
            .fromTo(step.querySelector("[data-receipt]"), { opacity: 0, rotate: -3, y: 16 }, { opacity: 1, rotate: 0, y: 0, duration: 0.6, ease: "back.out(1.8)" }, 0.35);
        });
      }

      const remeasure = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        cancelAnimationFrame(remeasure);
        // A counter left mid-tween must not freeze on a wrong value.
        timer.textContent = "00:04";
        totalEl.textContent = money(totals[totals.length - 1]);
      };
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true }
  );

  return (
    <div ref={root} className={styles.demos}>
      <div className={styles.screenCol}>
        <div className={styles.screen} aria-hidden="true">
          <div className={styles.screenBar}>
            <span className={styles.screenDots}>
              <i />
              <i />
              <i />
            </span>
            <span className={styles.screenTabs}>
              {caps.map((c, i) => (
                <span key={c.title} data-on={scene === i}>
                  0{i + 1}
                </span>
              ))}
            </span>
            <span className={styles.screenTitle}>{caps[scene]?.title}</span>
          </div>
          <div className={styles.screenBody}>
            <ChatScene d={D.chat} active={scene === 0} />
            <DocScene d={D.doc} active={scene === 1} />
            <AnswerScene d={D.answer} active={scene === 2} />
          </div>
        </div>
      </div>

      <div className={styles.demoSteps}>
        {caps.map((c, i) => (
          <article key={c.title} className={styles.demoStep} data-demo-step={i}>
            <p className={styles.demoEyebrow}>
              <span>0{i + 1}</span>
              {t.aiLabels[i]}
            </p>
            <h3>{c.title}</h3>
            <p className={styles.demoText}>{c.text}</p>
            <p className={styles.receipt} data-receipt>
              <span>{D.outcome}</span>
              {direction.outcomes[i]}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
