import { workProjectIds } from "@/data/workProjectIds";
import { blogPosts } from "@/data/blogPosts";
import { caseStories } from "./cases/data";

const SITE_URL = "https://www.sigillabs.agency";

export default function sitemap() {
  const staticRoutes = [
    "",
    "/work",
    "/studio",
    "/stories",
    "/contact",
    "/blog",
    "/services/creative-engineering",
    "/services/agentic-ai-systems",
    "/services/interactive-web-experiences",
    "/services/agentic-enablement",
    "/services/agentic-products",
    "/es/services/agentic-products",
    "/cases",
    ...Object.keys(caseStories).map((slug) => `/cases/${slug}`),
    "/es/cases",
    ...Object.keys(caseStories).map((slug) => `/es/cases/${slug}`),
  ];
  const projectRoutes = workProjectIds.map((slug) => `/work/${slug}`);
  const blogRoutes = blogPosts.map((post) => `/blog/${post.slug}`);

  /* Pages with their own change date, so search engines see what is new. */
  const updated = Object.fromEntries(
    ["/services/agentic-products", "/es/services/agentic-products", "/", "/cases", "/es/cases", ...Object.keys(caseStories).flatMap((s) => [`/cases/${s}`, `/es/cases/${s}`])].map((route) => [route, "2026-11-26"])
  );

  return [...staticRoutes, ...projectRoutes, ...blogRoutes].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: updated[route] || "2026-09-08",
    changeFrequency: route === "" || updated[route] ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/work" || updated[route] ? 0.9 : 0.7,
  }));
}
