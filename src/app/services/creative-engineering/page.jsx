import ServicePage from "../ServicePage";

const service = {
  path: "/services/creative-engineering",
  name: "Creative Engineering",
  title: "Systems with a pulse.",
  description:
    "Creative engineering for ambitious teams that need a digital product to feel as intelligent as the idea behind it.",
  introTitle: "Design is the visible layer of a deeper system.",
  intro:
    "SIGIL LABS connects art direction, interaction design and production-grade frontend engineering. The result is not a decorated interface: it is a resilient digital system with a point of view, a clear narrative and room to evolve.",
  capabilities: [
    { title: "Art direction", text: "A distinct visual language that gives complex products a recognizable signal." },
    { title: "Interface systems", text: "Reusable components, motion rules and responsive foundations built for real teams." },
    { title: "Production craft", text: "Fast, accessible implementation that keeps the ambition intact across devices." },
  ],
  projects: [
    { label: "PACIFISTA / editorial system", href: "/work/pacifista" },
    { label: "LA MAR / commerce experience", href: "/work/la-mar" },
    { label: "LI4UID / digital identity", href: "/work/li4uid" },
  ],
};

export const metadata = {
  title: "Creative Engineering Agency | SIGIL LABS",
  description:
    "SIGIL LABS builds distinctive digital products through art direction, interface systems and production-grade creative engineering.",
  alternates: { canonical: service.path },
};

export default function CreativeEngineeringPage() {
  return <ServicePage service={service} />;
}
