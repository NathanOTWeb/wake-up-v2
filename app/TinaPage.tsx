// @ts-nocheck
"use client";

import { useMemo } from "react";
import { useTina } from "tinacms/dist/react";
import Nav from "./components/Nav";
import IntroVideo from "./components/IntroVideo";
import ListSection from "./components/blocks/ListSection";
import FrameworkSection from "./components/blocks/FrameworkSection";

// See TinaHome.tsx for why the fragment is referenced but not inlined, and
// why `data` must be a stable reference across renders.
const PAGE_QUERY = `
query page($relativePath: String!) {
  page(relativePath: $relativePath) {
    ... on Document { _sys { filename } id }
    ...PageParts
  }
}
`;

export default function TinaPage({
  initialData,
  relativePath,
  navLinks,
  navLogo,
}: {
  initialData: any;
  relativePath: string;
  navLinks: Array<{ label: string; href: string }>;
  navLogo?: string;
}) {
  const tinaData = useMemo(() => ({ page: initialData }), [initialData]);
  const variables = useMemo(() => ({ relativePath }), [relativePath]);

  const { data } = useTina({
    query: PAGE_QUERY,
    variables,
    data: tinaData,
  });

  const sections = data?.page?.sections || [];
  const intro = data?.page?.intro;

  return (
    <>
      {intro?.src && (
        <IntroVideo src={intro.src} poster={intro.poster} variant="center" />
      )}
      <Nav links={navLinks} logo={navLogo} />
      <main className="wu-page">
        {sections.map((block: any, i: number) => {
          const common = { data, index: i, block, scope: "page" as const };
          switch (block?._template) {
            case "listSection":
              return <ListSection key={i} {...common} />;
            case "frameworkSection":
              return <FrameworkSection key={i} {...common} />;
            default:
              return null;
          }
        })}
      </main>
    </>
  );
}
