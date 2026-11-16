export const metadata = {
  title: "Interactive Stories | SIGIL LABS Blog",
  description:
    "Long-form research told as immersive web experiences: real data, original storytelling, built to be played, not just read.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Interactive Stories | SIGIL LABS Blog",
    description:
      "Long-form research told as immersive web experiences: real data, original storytelling, built to be played, not just read.",
    url: "https://www.sigillabs.agency/blog",
    siteName: "SIGIL LABS",
    type: "website",
    images: [{ url: "/blog/generacion-rebusque/og.jpg", width: 1200, height: 630, alt: "SIGIL LABS Blog" }],
  },
};

export default function BlogLayout({ children }) {
  return children;
}
