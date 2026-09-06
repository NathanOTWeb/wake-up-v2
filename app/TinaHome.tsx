// @ts-nocheck
"use client";

import { useMemo } from "react";
import { useTina, tinaField } from "tinacms/dist/react";
import Hero from "./components/Hero";
import Nav from "./components/Nav";
import IntroVideo from "./components/IntroVideo";

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
      <IntroVideo />
      <Nav links={nav.links} />
      {/* Layout + type live in styles.css (.hero-*). Portrait: one centred
          column. Landscape: two halves — logo + title left, the rest right —
          each vertically centred, with the intro video playing uncropped over
          the left half. */}
      <section id="section1">
        <div className="hero-left">
          {hero.logo && (
            <img
              className="hero-logo"
              data-tina={tinaField(data, "home.hero.logo") as any}
              src={hero.logo}
              alt="WAKE UP Logo"
            />
          )}
          <h1 className="hero-title" data-tina={tinaField(data, "home.hero.title") as any}>
            {hero.title}
          </h1>
        </div>

        <div className="hero-right">
          <p className="hero-subtitle" data-tina={tinaField(data, "home.hero.subtitle") as any}>
            {hero.subtitle}
          </p>

          <div className="hero-taglines">
            {(hero.taglines || []).map((t: any, i: number) => (
              <span key={i}>
                {t.text}
                {i < (hero.taglines || []).length - 1 && <br />}
              </span>
            ))}
          </div>

          <p className="hero-scripture">
            <span data-tina={tinaField(data, "home.hero.scripture") as any}>
              {hero.scripture}
            </span>
            {hero.scriptureRef && (
              <span className="hero-scripture-ref">
                — <span data-tina={tinaField(data, "home.hero.scriptureRef") as any}>{hero.scriptureRef}</span>
              </span>
            )}
          </p>

          <div className="hero-ctas">
            {(hero.ctas || []).map((cta: any, i: number) => (
              <a
                key={i}
                className={`hero-cta${cta.primary ? " is-primary" : ""}`}
                href={cta.href}
                data-tina={tinaField(data, `home.hero.ctas.${i}.href`) as any}
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