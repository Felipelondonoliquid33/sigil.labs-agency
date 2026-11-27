import Link from "next/link";
import { caseStories } from "./data";
import styles from "./cases.module.css";

export const metadata = {
  title: "Case Studies: AI Agents, LMS & Digital Recovery | SIGIL LABS",
  description:
    "Four builds explained step by step: a recovered news archive, a Moodle campus with agent control, LMS automation with AI audit, and approval-gated agents.",
  alternates: { canonical: "/cases" },
};

export default function CasesIndex() {
  return (
    <main className={`${styles.page} ${styles.indexPage}`}>
      <header>
        <p className={styles.eyebrow}>Case studies</p>
        <h1>What we built, and how.</h1>
      </header>
      <ol>
        {Object.values(caseStories).map((story, i) => (
          <li key={story.slug}>
            <Link href={`/cases/${story.slug}`}>
              <span className={styles.indexNum}>0{i + 1}</span>
              <span className={styles.indexName}>{story.client}</span>
              <span className={styles.indexText}>{story.card || story.lead}</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
