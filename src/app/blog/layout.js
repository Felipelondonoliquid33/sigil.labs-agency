export const metadata = {
  title: "Blog | SIGIL LABS",
  description:
    "Artículos interactivos de SIGIL LABS: investigación con datos, contada como experiencia web inmersiva.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | SIGIL LABS",
    description:
      "Artículos interactivos de SIGIL LABS: investigación con datos, contada como experiencia web inmersiva.",
    url: "https://www.sigillabs.agency/blog",
    siteName: "SIGIL LABS",
    type: "website",
    images: [{ url: "/blog/generacion-rebusque/og.jpg", width: 1200, height: 630, alt: "SIGIL LABS Blog" }],
  },
};

export default function BlogLayout({ children }) {
  return children;
}
