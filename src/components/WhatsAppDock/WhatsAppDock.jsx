"use client";

import { usePathname } from "next/navigation";
import { trackContactClick, whatsappHref } from "@/lib/analytics";
import styles from "./WhatsAppDock.module.css";

/* The message arrives already written, so the visitor only has to press send,
   and it tells us which page produced the lead. First match wins. */
const MESSAGES = [
  {
    test: /^\/es\/(services\/agentic-products|cases)/,
    label: "Escríbenos por WhatsApp",
    text: "Hola SIGIL LABS, quiero un agente de IA para mi negocio. La tarea que más tiempo nos quita es: ",
  },
  {
    test: /^\/(services\/agentic|cases)/,
    label: "Talk on WhatsApp",
    text: "Hi SIGIL LABS, I'd like an AI agent for my business. The task that takes us the most time is: ",
  },
  {
    test: /./,
    label: "WhatsApp",
    text: "Hola SIGIL LABS, vi su página y quiero hablar de un proyecto: ",
  },
];

export default function WhatsAppDock() {
  const pathname = usePathname() || "/";
  // The contact page already offers every channel.
  if (pathname.startsWith("/contact")) return null;
  const { label, text } = MESSAGES.find((m) => m.test.test(pathname));

  return (
    <a
      className={styles.dock}
      href={whatsappHref(text)}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackContactClick("whatsapp", "dock")}
    >
      <i aria-hidden="true" />
      {label}
    </a>
  );
}
