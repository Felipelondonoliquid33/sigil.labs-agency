// Cada artículo nuevo = carpeta en public/blog/<slug>/ (con og.jpg y preview-1..3.jpg) + una entrada aquí
// + su regla de rewrite en next.config.mjs. El sitemap y /blog leen esta lista.
export const blogPosts = [
  {
    slug: "generacion-rebusque",
    title: "Generación Rebusque",
    tag: "Interactive article",
    lang: "ES · Colombia",
    date: "2026-11-16",
    readingTime: "25 min",
    excerpt:
      "Work, housing and AI for the generation born in 1991, told as an interactive essay with Colombian data (DANE).",
    tagline: "Nacimos con la promesa de que el futuro era nuestro. Treinta y cinco años después, seguimos rebuscándonos la vida.",
    image: "/blog/generacion-rebusque/og.jpg",
    previews: [
      "/blog/generacion-rebusque/preview-1.png",
      "/blog/generacion-rebusque/preview-2.png",
      "/blog/generacion-rebusque/preview-3.png",
    ],
  },
];
