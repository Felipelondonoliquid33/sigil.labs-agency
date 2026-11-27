import AgenticProductsView from "@/app/services/agentic-products/AgenticProductsView";

const EN = "/services/agentic-products";
const PATH = `/es${EN}`;
const TITLE = "Agentes de IA y automatización de WhatsApp | SIGIL LABS";
const DESCRIPTION =
  "Agentes de IA a la medida: responden en WhatsApp, califican leads, arman cotizaciones e informes con tus datos y responden desde tus documentos. Bogotá.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH, languages: { en: EN, es: PATH, "x-default": EN } },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PATH,
    siteName: "SIGIL LABS",
    locale: "es_CO",
    type: "website",
    images: [{ url: "/showcase/opt/sigil_labs_updated_hero.webp", width: 1200, height: 630, alt: "Agentes de IA de SIGIL LABS" }],
  },
};

export default function AgenticProductsSpanishPage() {
  return <AgenticProductsView initial="es" />;
}
