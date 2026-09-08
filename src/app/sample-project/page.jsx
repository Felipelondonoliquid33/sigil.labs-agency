import { permanentRedirect } from "next/navigation";

export default async function LegacyProjectPage({ searchParams }) {
  const params = await searchParams;
  const project = params?.project || "pacifista";
  permanentRedirect(`/work/${project}`);
}
