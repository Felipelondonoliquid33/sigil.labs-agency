/* page.jsx is a client component, so it cannot export metadata. Without this
   file the route inherited the /services layout, whose canonical points at a
   URL that returns 404 + noindex: Google was being told not to index it. */
const PATH = "/services/agentic-products";
const TITLE = "AI Agents for Business: WhatsApp Automation | SIGIL LABS";
const DESCRIPTION =
  "Custom AI agents that answer on WhatsApp, qualify leads, build quotes and reports from your data, and answer from your documents. SIGIL LABS, Bogotá.";
const IMAGE = {
  url: "/showcase/opt/sigil_labs_updated_hero.webp",
  width: 1200,
  height: 630,
  alt: "SIGIL LABS AI agents",
};

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: PATH,
    languages: { en: PATH, es: `/es${PATH}`, "x-default": PATH },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PATH,
    siteName: "SIGIL LABS",
    type: "website",
    images: [IMAGE],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [IMAGE.url] },
};

export default function AgenticProductsLayout({ children }) {
  return children;
}
