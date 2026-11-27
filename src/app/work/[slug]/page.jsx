import { clipDescription } from "@/lib/seo";
import ProjectPage from "@/app/sample-project/project-page";
import { notFound } from "next/navigation";
import { projectDetails } from "@/data/projectDetails";
import { projectMedia } from "@/data/projectMedia";
import { workProjectIds } from "@/data/workProjectIds";

const SITE_URL = "https://www.sigillabs.agency";

export function generateStaticParams() {
  return workProjectIds.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projectDetails[slug] || projectDetails.pacifista;
  const media = projectMedia[slug] || projectMedia.pacifista;
  const imageUrl = new URL(media.cover.src, SITE_URL).toString();
  const pageUrl = `${SITE_URL}/work/${slug}`;
  const description = clipDescription(project.concept);

  return {
    title: `${project.title} | SIGIL LABS`,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `${project.title} | SIGIL LABS`,
      description,
      url: pageUrl,
      siteName: "SIGIL LABS",
      type: "website",
      images: [{ url: imageUrl, width: 1280, height: 720, alt: media.cover.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | SIGIL LABS`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProjectRoute({ params }) {
  const { slug } = await params;
  const project = projectDetails[slug];

  if (!project || !projectMedia[slug]) {
    notFound();
  }

  const media = projectMedia[slug];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.concept,
    url: `${SITE_URL}/work/${slug}`,
    image: new URL(media.cover.src, SITE_URL).toString(),
    creator: { "@type": "Organization", name: "SIGIL LABS" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProjectPage projectId={slug} />
    </>
  );
}
