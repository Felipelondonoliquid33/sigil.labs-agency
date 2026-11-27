import "./globals.css";
import ClientLayout from "@/client-layout";
import { ViewTransitions } from "next-view-transitions";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata = {
  metadataBase: new URL("https://www.sigillabs.agency"),
  title: "AI Agents, Automation & Web Design in Bogotá | SIGIL LABS",
  description:
    "AI agents for business, WhatsApp automation, AI consulting, Moodle campuses and web design. SIGIL LABS, a studio in Bogotá, Colombia, working globally.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "AI Agents, Automation & Web Design in Bogotá | SIGIL LABS",
    description:
      "AI agents for business, WhatsApp automation, AI consulting, Moodle campuses and web design. SIGIL LABS, a studio in Bogotá, Colombia, working globally.",
    url: "https://www.sigillabs.agency",
    siteName: "SIGIL LABS",
    type: "website",
    images: [{ url: "/showcase/opt/sigil_labs_updated_hero.webp", width: 1200, height: 630, alt: "SIGIL LABS" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Agents, Automation & Web Design in Bogotá | SIGIL LABS",
    description:
      "AI agents for business, WhatsApp automation, AI consulting, Moodle campuses and web design. SIGIL LABS, a studio in Bogotá, Colombia, working globally.",
    images: ["/showcase/opt/sigil_labs_updated_hero.webp"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["ProfessionalService", "Organization"],
  "@id": "https://www.sigillabs.agency/#organization",
  name: "SIGIL LABS",
  legalName: "SIGIL LABS",
  url: "https://www.sigillabs.agency",
  logo: "https://www.sigillabs.agency/favicon.svg",
  image: "https://www.sigillabs.agency/showcase/opt/sigil_labs_updated_hero.webp",
  description:
    "AI agents, WhatsApp and workflow automation, AI consulting, Moodle campuses and interactive web design.",
  knowsAbout: [
    "AI agents", "WhatsApp automation", "AI consulting", "Workflow automation", "Moodle development", "Web design",
    "Agentes de IA", "Automatización con inteligencia artificial", "Consultoría en IA", "Diseño web",
  ],
  telephone: "+57 333 4016876",
  email: "sigillabsdevs@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bogotá",
    addressRegion: "Bogotá D.C.",
    addressCountry: "CO",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 4.711,
    longitude: -74.0721,
  },
  areaServed: [
    { "@type": "Country", name: "Colombia" },
    { "@type": "Country", name: "United States" },
    { "@type": "AdministrativeArea", name: "Latin America" },
  ],
  priceRange: "$$$$",
  sameAs: [
    "https://www.linkedin.com/company/sigil-labs/",
    "https://www.instagram.com/sigil.labs",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "SIGIL LABS Core Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Creative Engineering",
          url: "https://www.sigillabs.agency/services/creative-engineering",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Agentic AI Systems",
          url: "https://www.sigillabs.agency/services/agentic-ai-systems",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Interactive Web Experiences",
          url: "https://www.sigillabs.agency/services/interactive-web-experiences",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Agentic Enablement & AI Consulting",
          url: "https://www.sigillabs.agency/services/agentic-enablement",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Agentic Products & AI Audit",
          url: "https://www.sigillabs.agency/services/agentic-products",
        },
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body>
        <ViewTransitions>
          <ClientLayout>{children}</ClientLayout>
        </ViewTransitions>
        <Analytics />
        {gaMeasurementId ? <GoogleAnalytics gaId={gaMeasurementId} /> : null}
      </body>
    </html>
  );
}
