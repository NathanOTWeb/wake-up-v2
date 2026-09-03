"use client";

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

export default function TinaHome({ initialData }: { initialData: any }) {
  const { data } = useTina({
    query: HOME_QUERY,
    variables: { relativePath: "index.json" },
    data: { home: initialData },
  });

  const hero = data?.home?.hero || {};
  const nav = data?.home?.nav || {};

  return (
    <>
      <Nav links={nav.links} />
      <section id="section1" style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 2rem",
        backgroundColor: "var(--bg-color, #fffff0)",
        textAlign: "center",
      }}>
        {hero.logo && (
          <div style={{ marginBottom: "2rem" }}>
            <img
              data-tina={tinaField(data, "home.hero.logo") as any}
              src={hero.logo}
              alt="WAKE UP Logo"
              style={{ width: "220px", height: "220px" }}
            />
          </div>
        )}
        <div className="section-content">
          <h1
            data-tina={tinaField(data, "home.hero.title") as any}
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontWeight: 700,
              color: "var(--text-dark, #1a1a1a)",
              margin: "0 0 1rem",
              letterSpacing: "0.05em",
            }}
          >
            {hero.title}
          </h1>
          <p
            data-tina={tinaField(data, "home.hero.subtitle") as any}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              color: "var(--text-medium, #444444)",
              maxWidth: "600px",
              margin: "0 auto 1.5rem",
              lineHeight: 1.6,
            }}
          >
            {hero.subtitle}
          </p>
          <div style={{
            margin: "1.5rem 0",
            fontFamily: "Cinzel, serif",
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            lineHeight: 1.8,
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
            fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)",
            color: "var(--text-light, #666666)",
            maxWidth: "500px",
            margin: "0 auto 2rem",
            lineHeight: 1.6,
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
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}>
            {(hero.ctas || []).map((cta: any, i: number) => (
              <a
                key={i}
                href={cta.href}
                data-tina={tinaField(data, `home.hero.ctas.${i}.href`) as any}
                style={{
                  fontFamily: "Cinzel, serif",
                  fontSize: "1rem",
                  fontWeight: 600,
                  padding: "0.75rem 2rem",
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