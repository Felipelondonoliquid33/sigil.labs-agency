"use client";

import { trackContactClick, whatsappHref } from "@/lib/analytics";
import styles from "./agentOffer.module.css";

const OFFER = {
  en: {
    eyebrow: "Free diagnosis · 30 minutes",
    title: "Tell us the task that eats your week.",
    body: "In 30 minutes we look at that one task and tell you whether an agent can take it on. If the answer is not yet, we say that too.",
    steps: ["You describe the task", "We look at how it runs today", "You leave with a clear yes or not yet"],
    primary: "Book it on WhatsApp",
    secondary: "or write to us by email",
    message: "Hi SIGIL LABS, I'd like the free 30-minute diagnosis. The task that takes us the most time is: ",
    subject: "Free 30-minute diagnosis",
  },
  es: {
    eyebrow: "Diagnóstico gratis · 30 minutos",
    title: "Cuéntanos la tarea que más tiempo les quita.",
    body: "En 30 minutos revisamos esa tarea y te decimos si un agente puede asumirla. Si la respuesta es que todavía no, también te lo decimos.",
    steps: ["Nos cuentas la tarea", "Revisamos cómo se hace hoy", "Sales con un sí o un todavía no, sin rodeos"],
    primary: "Pedirlo por WhatsApp",
    secondary: "o escríbenos por correo",
    message: "Hola SIGIL LABS, quiero el diagnóstico gratis de 30 minutos. La tarea que más tiempo nos quita es: ",
    subject: "Diagnóstico gratis de 30 minutos",
  },
};

export default function AgentOffer({ lang = "en" }) {
  const t = OFFER[lang] || OFFER.en;
  return (
    <section className={styles.offer} id="diagnostico" aria-labelledby="agent-offer-title">
      <div className={styles.card}>
        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <h2 id="agent-offer-title" className={styles.title}>{t.title}</h2>
        <p className={styles.body}>{t.body}</p>
        <ol className={styles.steps}>
          {t.steps.map((step, i) => <li key={step}><b>0{i + 1}</b>{step}</li>)}
        </ol>
        <div className={styles.actions}>
          <a
            className={styles.primary}
            href={whatsappHref(t.message)}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackContactClick("whatsapp", "agent-offer")}
          >
            {t.primary} ↗
          </a>
          <a
            className={styles.secondary}
            href={`mailto:sigillabsdevs@gmail.com?subject=${encodeURIComponent(t.subject)}`}
            onClick={() => trackContactClick("email", "agent-offer")}
          >
            {t.secondary}
          </a>
        </div>
      </div>
    </section>
  );
}
