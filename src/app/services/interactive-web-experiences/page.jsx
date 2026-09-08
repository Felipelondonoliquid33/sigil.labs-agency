import ServicePage from "../ServicePage";

const service = {
  path: "/services/interactive-web-experiences",
  name: "Interactive Web Experiences",
  title: "Interfaces that refuse to sit still.",
  description:
    "Immersive websites and interactive digital experiences where motion, story and technology move as one system.",
  introTitle: "Interaction is part of the meaning.",
  intro:
    "From editorial archives to cinematic product worlds, we use motion and responsive behavior to make information easier to feel, navigate and remember. Every effect has a job: orient, reveal, connect or create momentum.",
  capabilities: [
    { title: "Motion systems", text: "Scroll, transition and hover behaviors shaped into a coherent rhythm instead of isolated tricks." },
    { title: "WebGL direction", text: "Immersive depth and real-time visual layers introduced where they strengthen the experience." },
    { title: "Narrative UX", text: "Content architecture that turns a scroll into a sequence with a beginning, tension and release." },
  ],
  projects: [
    { label: "GSAP MOTION VAULT / motion library", href: "/work/gsap-motion-vault" },
    { label: "EL SUSURRO / digital archive", href: "/work/el-susurro-del-tiempo" },
    { label: "PUENTE DE EQUIDAD / simulation", href: "/work/puente-de-equidad" },
  ],
};

export const metadata = {
  title: "Interactive Web Experiences Agency | SIGIL LABS",
  description:
    "SIGIL LABS creates immersive websites, motion systems and interactive digital experiences with narrative intent.",
  alternates: { canonical: service.path },
};

export default function InteractiveWebExperiencesPage() {
  return <ServicePage service={service} />;
}
