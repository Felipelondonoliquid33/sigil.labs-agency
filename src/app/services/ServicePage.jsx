import styles from "./services.module.css";
import ServiceExperience from "./ServiceExperience";
import { serviceDirections } from "./serviceDirections";
import { projectMedia } from "@/data/projectMedia";

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

      <ServiceExperience
        service={service}
        direction={serviceDirections[service.path.split("/").pop()]}
        projects={service.projects.map((project) => {
          const id = project.href.split("/").pop();
          const [name, discipline] = project.label.split(" / ");
          return { ...project, name, discipline, image: projectMedia[id].cover };
        })}
      />    </main>
  );
}

