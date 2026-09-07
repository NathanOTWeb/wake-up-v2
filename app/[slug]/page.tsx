import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchTinaHome, fetchTinaPage, listPageSlugs } from "@/lib/tina";
import TinaPage from "../TinaPage";

// Only the JSON files that exist under content/pages/ are valid routes;
// anything else 404s instead of hitting the dynamic renderer.
export const dynamicParams = false;

export function generateStaticParams() {
  return listPageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchTinaPage(slug);
  return { title: data?.title || "WAKE UP" };
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [data, home] = await Promise.all([fetchTinaPage(slug), fetchTinaHome()]);

  if (!data) notFound();

  return (
    <TinaPage
      initialData={data}
      relativePath={`${slug}.json`}
      navLinks={home?.nav?.links || []}
      navLogo={home?.hero?.logo || ""}
    />
  );
}
