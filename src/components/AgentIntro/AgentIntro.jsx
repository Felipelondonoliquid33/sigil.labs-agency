"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import styles from "./AgentIntro.module.css";

/* The agent from the Agentic Products page, introduced on the home page. The
   copy is server-rendered; only the 3D character loads on the client. */
const HeroAgent = dynamic(() => import("@/app/services/agentic-products/HeroAgent"), { ssr: false, loading: () => null });

const JOBS = [
  ["Answers on WhatsApp", "Replies, qualifies and books, with the handover to a person built in."],
  ["Builds documents", "Quotes, minutes and reports from the data you already have."],
  ["Answers with sources", "Support grounded in your manuals and policies."],
];

export default function AgentIntro() {
  return (
    <section className={styles.intro} data-nav-light>
      <p className={styles.eyebrow}>
        <span>New</span> Agentic Products
      </p>
      <h2>
        One less job
        <br />
        per person.
      </h2>
      <div className={styles.body}>
        <div className={styles.copy}>
          <p>
            We build AI agents that take a task off someone’s desk: on your data, inside your rules, and handed over so your team can keep it running.
          </p>
          <ul>
            {JOBS.map(([name, text], i) => (
              <li key={name}>
                <span>0{i + 1}</span>
                <b>{name}</b>
                <small>{text}</small>
              </li>
            ))}
          </ul>
          <Link href="/services/agentic-products" className={styles.cta}>
            Meet your agent <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className={styles.agent}>
          <HeroAgent contained />
          <p aria-hidden="true">Move your cursor — it’s watching.</p>
        </div>
      </div>
    </section>
  );
}
