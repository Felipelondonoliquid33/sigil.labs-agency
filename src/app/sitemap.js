import { workProjectIds } from "@/data/workProjectIds";

const SITE_URL = "https://www.sigillabs.agency";

export default function sitemap() {
  const staticRoutes = [
    "",
    "/work",
    "/studio",
    "/stories",
    "/contact",
    "/services/creative-engineering",
    "/services/agentic-ai-systems",
    "/services/interactive-web-experiences",
  ];
  const projectRoutes = workProjectIds.map((slug) => `/work/${slug}`);

  return [...staticRoutes, ...projectRoutes].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: "2026-09-08",
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/work" ? 0.9 : 0.7,
  }));
}
