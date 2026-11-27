import { notFound } from "next/navigation";
import CaseStory from "../CaseStory";
import { caseStories } from "../data";

const SITE_URL = "https://www.sigillabs.agency";

export function generateStaticParams() {
  return Object.keys(caseStories).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const story = caseStories[(await params).slug];
  if (!story) return {};
  const url = `/cases/${story.slug}`;
  return {
    title: story.seoTitle,
    description: story.seoDescription,
    alternates: { canonical: url, languages: { en: url, es: `/es${url}`, "x-default": url } },
    openGraph: { title: story.seoTitle, description: story.seoDescription, url, siteName: "SIGIL LABS", type: "article" },
  };
}

export default async function CasePage({ params }) {
  const story = caseStories[(await params).slug];
  if (!story) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.seoDescription,
    url: `${SITE_URL}/cases/${story.slug}`,
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
