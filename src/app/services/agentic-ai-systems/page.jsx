import ServicePage from "../ServicePage";

const service = {
  path: "/services/agentic-ai-systems",
  name: "Agentic AI Systems",
  title: "Intelligence that can act.",
  description:
    "Agentic AI systems designed around useful decisions, dependable workflows and interfaces people can actually operate.",
  introTitle: "An agent is only valuable when it changes the work.",
  intro:
    "We design the protocol around the model: inputs, tools, permissions, memory, human checkpoints and observable outcomes. That makes AI feel less like a demo and more like a dependable layer inside a product or operation.",
  capabilities: [
    { title: "System architecture", text: "Map models, tools, data and permissions into a system that can be tested and improved." },
    { title: "Agent interfaces", text: "Give autonomous workflows a clear surface for review, intervention and trust." },
    { title: "Applied intelligence", text: "Move from abstract AI ambition to a focused workflow with a measurable job to do." },
  ],
  projects: [
    { label: "YOAHORRO IA / price intelligence", href: "/work/yoahorro-ia" },
    { label: "SYNAPSIS ACADEMY / adaptive learning", href: "/work/synapsis-academy" },
    { label: "LI4UID CORE WEB / systems-led identity", href: "/work/li4uid-core-web" },
  ],
};

export const metadata = {
  title: "Agentic AI Systems Agency | SIGIL LABS",
  description:
    "Design and development of agentic AI systems, autonomous workflows and human-centered interfaces by SIGIL LABS.",
  alternates: { canonical: service.path },
};

export default function AgenticAISystemsPage() {
  return <ServicePage service={service} />;
}
