import ServicePage from "../ServicePage";

const service = {
  path: "/services/agentic-enablement",
  name: "Agentic Enablement",
  title: "Teach the team. Keep the system.",
  description:
    "Enterprise consulting for companies that want to run agentic workflows themselves: diagnose where AI actually pays, build the first working system with your team, and leave behind the skills and the harness to keep going without us.",
  introTitle: "Most AI programmes stall because the capability leaves with the consultant.",
  intro:
    "We work the other way around. We map the workflows where AI can carry real work, build one of them alongside your team, and transfer the method — the routing rules, the quality gates, the cost model and the operating habits. You end up owning a system your people can extend, not a dependency on ours.",
  capabilities: [
    {
      title: "Workflow diagnostic",
      text: "Find the two or three workflows where AI changes the outcome, and the ones where it would only add cost and risk. Prioritised, costed and ranked before anything is built.",
    },
    {
      title: "Build the first system together",
      text: "One real workflow, built in the open with your engineers and operators. Not a demo: the thing that goes into production, with your data, your tools and your approval rules.",
    },
    {
      title: "Transfer the method",
      text: "The routing logic, the evaluation gates, the token budget and the written operating habits. Your team ships the second and third workflow without us in the room.",
    },
  ],
  projects: [
    { label: "ARCADE PORTFOLIO / real-time systems under constraint", href: "/work/arcade-portfolio" },
    { label: "PRAXUZ / replacing a manual sales process", href: "/work/praxuz" },
  ],
};

export const metadata = {
  title: "Agentic Enablement & AI Consulting | SIGIL LABS",
  description:
    "Enterprise consulting that teaches your team to build and run agentic AI workflows: workflow diagnostic, co-built first system, and method transfer. SIGIL LABS, Bogotá.",
  alternates: { canonical: service.path },
};

export default function AgenticEnablementPage() {
  return <ServicePage service={service} />;
}
