import { caseStories } from "./data";
import CasesIndex from "./CasesIndex";

export const metadata = {
  title: "Case Studies: AI Agents, Automation & Moodle | SIGIL LABS",
  description:
    "Four builds explained step by step: AI agents with human approval, LMS automation with AI audit, a Moodle campus with online store and a recovered archive.",
  alternates: { canonical: "/cases", languages: { en: "/cases", es: "/es/cases", "x-default": "/cases" } },
};

export default function Page() {
  return <CasesIndex stories={caseStories} lang="en" />;
}
