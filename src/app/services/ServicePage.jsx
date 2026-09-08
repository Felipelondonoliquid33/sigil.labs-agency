import styles from "./services.module.css";
import ServiceMotion from "./ServiceMotion";

const SITE_URL = "https://www.sigillabs.agency";

export default function ServicePage({ service }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: "SIGIL LABS",
      url: SITE_URL,
    },
    areaServed: ["Bogota", "Colombia", "Worldwide"],
    url: `${SITE_URL}${service.path}`,
  };

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className={styles.hero}>
        <div className={styles.eyebrow}>SIGIL LABS // SERVICES</div>
        <h1>{service.title}</h1>
        <p className={styles.lead}>{service.description}</p>
        <a className={styles.cta} href="/contact">
          Start a protocol <span aria-hidden="true">↗</span>
        </a>
      </section>

      <section className={styles.intro} aria-labelledby="service-intro">
        <p className={styles.eyebrow}>THE APPROACH</p>
        <h2 id="service-intro">{service.introTitle}</h2>
        <p className={styles.body}>{service.intro}</p>
      </section>

      <ServiceMotion capabilities={service.capabilities} />

      <section className={styles.grid} aria-label={`${service.name} capabilities`}>
        {service.capabilities.map((capability, index) => (
          <article className={styles.card} key={capability.title}>
            <span className={styles.cardIndex}>0{index + 1}</span>
            <h3>{capability.title}</h3>
            <p>{capability.text}</p>
          </article>
        ))}
      </section>

      <section className={styles.proof} aria-labelledby="service-proof">
        <div>
          <p className={styles.eyebrow}>SELECTED SIGNALS</p>
          <h2 id="service-proof">Built for movement, not decoration.</h2>
        </div>
        <div className={styles.proofLinks}>
          {service.projects.map((project) => (
            <a href={project.href} key={project.href}>
              <span>{project.label}</span>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.next}>
        <p className={styles.eyebrow}>NEXT MOVE</p>
        <h2>Bring the difficult brief.</h2>
        <a className={styles.cta} href="/contact">
          Contact SIGIL LABS <span aria-hidden="true">↗</span>
        </a>
      </section>
    </main>
  );
}
