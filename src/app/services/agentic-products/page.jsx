"use client";

import ServiceExperience from "../ServiceExperience";
import { serviceDirections } from "../serviceDirections";
import { LanguageProvider, LanguageToggle, useLanguage } from "../LanguageContext";
import { projectMedia } from "@/data/projectMedia";
import dynamic from "next/dynamic";
import UseCaseSection from "./UseCaseSection";
import WorkDemos from "./WorkDemos";
import styles from "./agentic-products.module.css";
import pageStyles from "../services.module.css";

const PATH = "/services/agentic-products";

/* The hero agent is three.js: loaded on the client only, after first paint. */
const HeroAgent = dynamic(() => import("./HeroAgent"), { ssr: false, loading: () => null });

/* The whole page answers one sentence: one less job per person.
   The hero names the promise, the use cases name the four tasks, the flow shows
   what gets built, the proof shows shifts already running, the process shows how
   a task becomes an agent. Every section is an answer to that same sentence,
   which is what stops the page reading as a pile of independent blocks. */

const SERVICES = {
  en: {
    path: PATH,
    name: "Agentic Products",
    title: "Agents that do a job.",
    description:
      "Agents that answer on WhatsApp, qualify a lead, quote, or assemble the weekly report. Built on your data, inside your rules, and handed over so your team can keep it running.",
    introTitle: "The agent only matters if it takes work off a person.",
    intro:
      "We do not start from the model. We start from the task: who does it today, how long it takes, what it costs when it goes wrong. Then we build the smallest system that removes it, and we document it so the next flow does not need us.",
    capabilities: [
      {
        title: "Conversation on WhatsApp",
        text: "Replies, qualifies and books inside the channel your customers already use, with the handover to a person built in.",
      },
      {
        title: "Documents from data",
        text: "Quotes, minutes and reports generated from the systems you already run, instead of retyped by hand.",
      },
      {
        title: "Grounded answers",
        text: "Support that answers from your manuals, policies and catalogue, with the source attached to every claim.",
      },
    ],
    projects: [
      { label: "PRAXUZ / replacing a manual sales and delivery process", href: "/work/praxuz" },
      { label: "ARCADE PORTFOLIO / real-time systems under constraint", href: "/work/arcade-portfolio" },
      { label: "LI4UID CORE WEB / systems-led identity", href: "/work/li4uid-core-web" },
    ],
  },
  es: {
    path: PATH,
    name: "Productos Agénticos",
    title: "Agentes que hacen un trabajo.",
    description:
      "Agentes que responden en WhatsApp, califican un lead, cotizan o arman el informe semanal. Construidos sobre tus datos, dentro de tus reglas, y entregados para que tu equipo los mantenga.",
    introTitle: "El agente solo importa si le quita trabajo a una persona.",
    intro:
      "No partimos del modelo. Partimos de la tarea: quién la hace hoy, cuánto tarda, cuánto cuesta cuando sale mal. Después construimos el sistema más pequeño que la elimina, y lo documentamos para que el siguiente flujo no nos necesite.",
    capabilities: [
      {
        title: "Conversación en WhatsApp",
        text: "Responde, califica y agenda dentro del canal que tus clientes ya usan, con el traspaso a una persona incorporado.",
      },
      {
        title: "Documentos desde datos",
        text: "Cotizaciones, actas e informes generados desde los sistemas que ya operas, en vez de retipeados a mano.",
      },
      {
        title: "Respuestas con sustento",
        text: "Atención que responde desde tus manuales, políticas y catálogo, con la fuente adjunta a cada afirmación.",
      },
    ],
    projects: [
      { label: "PRAXUZ / reemplazar un proceso manual de venta y entrega", href: "/work/praxuz" },
      { label: "ARCADE PORTFOLIO / sistemas en tiempo real bajo restricción", href: "/work/arcade-portfolio" },
      { label: "LI4UID CORE WEB / identidad dirigida por sistemas", href: "/work/li4uid-core-web" },
    ],
  },
};

/* Shared project mapping — identical to ServicePage, reused here so this page
   keeps the same card behaviour as the other four service pages. */
function resolveProjects(list) {
  return list.map((project) => {
    const id = project.href.split("/").pop();
    const [name, discipline] = project.label.split(" / ");
    return { ...project, name, discipline, image: projectMedia[id].cover };
  });
}

function AgenticProductsContent() {
  const { lang } = useLanguage();
  const service = SERVICES[lang] || SERVICES.en;

  return (
    /* main.page is the shell every other service page uses. Without it this
       route fell back to the dark document theme while its buttons still drew
       light-on-light, which is why it read as a page from another site. */
    <main className={pageStyles.page}>
      <div className={styles.toggleSlot}>
        <LanguageToggle className={styles.toggle} />
      </div>
      <ServiceExperience
        service={service}
        direction={serviceDirections["agentic-products"]}
        projects={resolveProjects(service.projects)}
        extra={<UseCaseSection />}
        renderHeroVisual={() => <HeroAgent />}
        renderCapabilities={({ service: s, direction, t }) => <WorkDemos service={s} direction={direction} t={t} />}
      />
    </main>
  );
}

export default function AgenticProductsPage() {
  return (
    <LanguageProvider>
      <AgenticProductsContent />
    </LanguageProvider>
  );
}
