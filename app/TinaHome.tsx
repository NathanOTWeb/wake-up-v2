// @ts-nocheck
"use client";

import { useMemo } from "react";
import { useTina, tinaField } from "tinacms/dist/react";
import Hero from "./components/Hero";
import Nav from "./components/Nav";

const HOME_QUERY = `
query home($relativePath: String!) {
  home(relativePath: $relativePath) {
    ... on Document { _sys { filename } id }
    ...HomeParts
  }
}
`;

const HOME_VARIABLES = { relativePath: "index.json" };

export default function TinaHome({ initialData }: { initialData: any }) {
  // useTina memoizes its internal processedData on the identity of `data`;
  // a fresh `{ home: initialData }` literal every render makes its effect
  // re-run and setData forever ("Maximum update depth exceeded"). Keep it stable.
  const tinaData = useMemo(() => ({ home: initialData }), [initialData]);

  const { data } = useTina({
    query: HOME_QUERY,
    variables: HOME_VARIABLES,
    data: tinaData,
  });

  const hero = data?.home?.hero || {};
  const nav = data?.home?.nav || {};

  return (
    <>
      <Nav links={nav.links} />
      <section id="section1" style={{
        // Fill the screen but let content set the height if it ever needs more.
        // dvh tracks the mobile URL-bar collapse; every inner size is fluid on
        // both axes (vw + dvh) so the whole card fits without scrolling at the
        // common phone/tablet/laptop sizes. Top padding clears the 70px nav.
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "clamp(0.75rem, 3dvh, 2rem)",
        padding: "clamp(4.75rem, 9dvh, 6.5rem) 1.5rem clamp(1.25rem, 5dvh, 4rem)",
        boxSizing: "border-box",
        backgroundColor: "var(--bg-color, #fffff0)",
        textAlign: "center",
      }}>
        {hero.logo && (
          <img
            data-tina={tinaField(data, "home.hero.logo") as any}
            src={hero.logo}
            alt="WAKE UP Logo"
            style={{
              width: "clamp(96px, 16vmin, 200px)",
              height: "auto",
              flexShrink: 0,
            }}
          />
        )}
        <div className="section-content" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "clamp(0.6rem, 2.4dvh, 1.4rem)",
          width: "100%",
          maxWidth: "640px",
        }}>
          <h1
            data-tina={tinaField(data, "home.hero.title") as any}
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
              fontWeight: 700,
              color: "var(--text-dark, #1a1a1a)",
              margin: 0,
              letterSpacing: "0.05em",
            }}
          >
            {hero.title}
          </h1>
          <p
            data-tina={tinaField(data, "home.hero.subtitle") as any}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(0.95rem, 2.2vw, 1.2rem)",
              color: "var(--text-medium, #444444)",
              maxWidth: "600px",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {hero.subtitle}
          </p>
          <div style={{
            margin: 0,
            fontFamily: "Cinzel, serif",
            fontSize: "clamp(0.95rem, 2.3vw, 1.2rem)",
            lineHeight: 1.5,
            color: "var(--text-dark, #1a1a1a)",
          }}>
            {(hero.taglines || []).map((t: any, i: number) => (
              <span key={i}>
                {t.text}
                {i < (hero.taglines || []).length - 1 && <br />}
              </span>
            ))}
          </div>
          <p style={{
            fontFamily: "Merriweather, serif",
            fontStyle: "italic",
            fontSize: "clamp(0.8rem, 1.7vw, 1.05rem)",
            color: "var(--text-light, #666666)",
            maxWidth: "500px",
            margin: 0,
            lineHeight: 1.5,
          }}>
            <span data-tina={tinaField(data, "home.hero.scripture") as any}>
              {hero.scripture}
            </span>
            {hero.scriptureRef && (
              <span style={{ marginLeft: "0.5rem" }}>
                — <span data-tina={tinaField(data, "home.hero.scriptureRef") as any}>{hero.scriptureRef}</span>
              </span>
            )}
          </p>
          <div style={{
            display: "flex",
            gap: "clamp(0.6rem, 2vw, 1rem)",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "clamp(0.25rem, 1dvh, 0.5rem)",
          }}>
            {(hero.ctas || []).map((cta: any, i: number) => (
              <a
                key={i}
                href={cta.href}
                data-tina={tinaField(data, `home.hero.ctas.${i}.href`) as any}
                style={{
                  fontFamily: "Cinzel, serif",
                  fontSize: "clamp(0.9rem, 1.6vw, 1rem)",
                  fontWeight: 600,
                  padding: "clamp(0.6rem, 1.6vh, 0.8rem) clamp(1.4rem, 4vw, 2rem)",
                  borderRadius: "4px",
                  textDecoration: "none",
                  backgroundColor: cta.primary ? "var(--primary-color, #d4af37)" : "transparent",
                  color: cta.primary ? "var(--text-dark, #1a1a1a)" : "var(--primary-color, #d4af37)",
                  border: `2px solid var(--primary-color, #d4af37)`,
                  transition: "all 0.3s ease",
                }}
              >
                <span data-tina={tinaField(data, `home.hero.ctas.${i}.label`) as any}>{cta.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}