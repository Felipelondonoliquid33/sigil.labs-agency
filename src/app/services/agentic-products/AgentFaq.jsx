import styles from "./agentic-products.module.css";

/* Questions people actually type, answered only with what this page already
   promises. Rendered as visible text, plus FAQPage structured data. */
const FAQ = {
  en: {
    eyebrow: "Frequently asked questions",
    title: "AI agents for business, in plain words.",
    items: [
      ["What is an AI agent?", "A program that takes a specific task off someone’s desk, such as answering customers, preparing a quote or assembling a weekly report. It works on your data and inside your rules."],
      ["Can an AI agent answer my customers on WhatsApp?", "Yes. It replies, qualifies the lead against your criteria and books the call inside the channel your customers already use, with the handover to a person built in."],
      ["Can AI create quotes, minutes and reports?", "Yes. Documents are generated from the systems you already run instead of being retyped by hand, and reports can be assembled from several sources."],
      ["Will the agent make things up?", "Support agents answer from your manuals, policies and catalogue, with the source attached to each claim, and escalate to a person when they cannot resolve something."],
      ["How do I know if AI is worth it for my company?", "Start with the audit. In two to three weeks you get a document that says which flows AI can solve, what they cost to run and which to build first. If the answer is none yet, we say that too."],
      ["Do you work with companies outside Bogotá?", "Yes. SIGIL LABS is based in Bogotá, Colombia, and operates globally, in English and Spanish."],
    ],
  },
  es: {
    eyebrow: "Preguntas frecuentes",
    title: "Agentes de IA para empresas, en palabras sencillas.",
    items: [
      ["¿Qué es un agente de IA?", "Un programa que le quita una tarea concreta a una persona, como atender clientes, preparar una cotización o armar el informe semanal. Trabaja con tus datos y dentro de tus reglas."],
      ["¿Un agente de IA puede responder a mis clientes por WhatsApp?", "Sí. Responde, califica el lead con tus criterios y agenda la llamada en el canal que tus clientes ya usan, con el traspaso a una persona incorporado."],
      ["¿La IA puede hacer cotizaciones, actas e informes?", "Sí. Los documentos se generan desde los sistemas que ya usas, sin retipearlos a mano, y los informes se pueden armar desde varias fuentes."],
      ["¿El agente va a inventar respuestas?", "Los agentes de atención responden desde tus manuales, políticas y catálogo, con la fuente adjunta, y pasan el caso a una persona cuando no pueden resolverlo."],
      ["¿Cómo sé si la IA le sirve a mi empresa?", "Empieza por la auditoría. En dos a tres semanas recibes un documento que dice qué procesos resuelve la IA, cuánto cuesta operarlos y cuál construir primero. Si la respuesta es ninguno todavía, también te lo decimos."],
      ["¿Trabajan con empresas fuera de Bogotá?", "Sí. SIGIL LABS está en Bogotá, Colombia, y opera a nivel global, en español e inglés."],
    ],
  },
};

export default function AgentFaq({ lang = "en" }) {
  const t = FAQ[lang] || FAQ.en;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: t.items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
  return (
    <section className={styles.faq}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className={styles.faqEyebrow}>{t.eyebrow}</p>
      <h2>{t.title}</h2>
      <div className={styles.faqList}>
        {t.items.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
