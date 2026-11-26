import { workProjectIds } from "@/data/workProjectIds";
import { blogPosts } from "@/data/blogPosts";

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
  ];
  const projectRoutes = workProjectIds.map((slug) => `/work/${slug}`);
  const blogRoutes = blogPosts.map((post) => `/blog/${post.slug}`);

  return [...staticRoutes, ...projectRoutes, ...blogRoutes].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: "2026-09-08",
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/work" ? 0.9 : 0.7,
  }));
}
