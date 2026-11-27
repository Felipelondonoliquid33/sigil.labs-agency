import Link from "next/link";
import styles from "./cases.module.css";

const COPY = {
  en: { eyebrow: "Case studies", title: "What we built, and how.", other: "Ver en español", base: "/cases", otherHref: "/es/cases" },
  es: { eyebrow: "Casos de éxito", title: "Lo que construimos, y cómo.", other: "View in English", base: "/es/cases", otherHref: "/cases" },
};

export default function CasesIndex({ stories, lang = "en" }) {
  const t = COPY[lang];
  return (
    <main className={`${styles.page} ${styles.indexPage}`} lang={lang}>
      <header>
        <p className={styles.eyebrow}>
          {t.eyebrow} <Link href={t.otherHref} className={styles.langLink}>{t.other} ↗</Link>
        </p>
        <h1>{t.title}</h1>
      </header>
      <ol>
        {Object.values(stories).map((story, i) => (
          <li key={story.slug}>
            <Link href={`${t.base}/${story.slug}`}>
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
