import { notFound } from "next/navigation";
import CaseStory from "@/app/cases/CaseStory";
import { caseStoriesEs } from "@/app/cases/data/es";

const SITE_URL = "https://www.sigillabs.agency";

export function generateStaticParams() {
  return Object.keys(caseStoriesEs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const story = caseStoriesEs[(await params).slug];
  if (!story) return {};
  const en = `/cases/${story.slug}`;
  const url = `/es${en}`;
  return {
    title: story.seoTitle,
    description: story.seoDescription,
    alternates: { canonical: url, languages: { en, es: url, "x-default": en } },
    openGraph: { title: story.seoTitle, description: story.seoDescription, url, siteName: "SIGIL LABS", locale: "es_CO", type: "article" },
  };
}

export default async function SpanishCasePage({ params }) {
  const story = caseStoriesEs[(await params).slug];
  if (!story) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    inLanguage: "es",
    headline: story.title,
    description: story.seoDescription,
    url: `${SITE_URL}/es/cases/${story.slug}`,
    about: story.client,
    author: { "@type": "Organization", name: "SIGIL LABS", url: SITE_URL },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CaseStory story={story} />
    </>
  );
}
