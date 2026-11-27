import { caseStoriesEs } from "@/app/cases/data/es";
import CasesIndex from "@/app/cases/CasesIndex";

export const metadata = {
  title: "Casos de éxito: agentes de IA y automatización | SIGIL LABS",
  description:
    "Cuatro proyectos explicados paso a paso: agentes de IA con aprobación humana, automatización de LMS, un campus Moodle con tienda y un archivo recuperado.",
  alternates: { canonical: "/es/cases", languages: { en: "/cases", es: "/es/cases", "x-default": "/cases" } },
};

export default function Page() {
  return <CasesIndex stories={caseStoriesEs} lang="es" />;
}
