// @ts-nocheck
"use client";

import React, { useEffect, useRef, useState } from "react";
import { tinaField } from "tinacms/dist/react";

type Entry = {
  marker?: string;
  title?: string;
  description?: string;
  points?: string[];
  scriptureRef?: string;
};

type Block = {
  heading?: string;
  intro?: string;
  introEmphasis?: string;
  items?: Entry[];
  closing?: string;
  closingEmphasis?: string;
  background?: "default" | "gold";
  animate?: boolean;
};

/**
 * A heading with a gold rule, then a stack of labelled entries — a large gold
 * marker (letter or numeral), a title, either a one-line description or a
 * `points` list, and an optional scripture reference — closing on an optional
 * centred statement. Serves the WAKE UP acronym and the 12-week phases (V6
 * sections 5 & 6). With `animate`, the entries fade in one by one (then the
 * closing line) when the section scrolls into view.
 */
export default function FrameworkSection({
  data,
  index,
  block,
  scope = "page",
}: {
  data: any;
  index: number;
  block: Block;
  scope?: "home" | "page";
}) {
  const path = (field: string) => `${scope}.sections.${index}.${field}`;
  const items = block.items || [];

  // Staggered fade-in: hold the cards hidden until the section is in view
  // AND the intro overlay (if any) has cleared — IntroVideo flags the
  // document with .intro-active while it's on screen. Then CSS animates the
  // cards in one by one (.wu-anim / .is-shown).
  const sectionRef = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!block.animate) return;
    const el = sectionRef.current;
    if (!el) return;

    const root = document.documentElement;
    let inView = typeof IntersectionObserver === "undefined";
    let forced = false;
    let done = false;
    let io: IntersectionObserver | null = null;
    let mo: MutationObserver | null = null;
    let safety = 0;

    const maybeReveal = () => {
      if (done) return;
      if (!forced && (!inView || root.classList.contains("intro-active"))) return;
      done = true;
      setShown(true);
      io?.disconnect();
      mo?.disconnect();
      window.clearTimeout(safety);
    };

    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            inView = true;
            maybeReveal();
          }
        },
        { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
      );
      io.observe(el);
    }

    // Reveal as soon as .intro-active is removed (or if it's already gone).
    mo = new MutationObserver(maybeReveal);
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });

    // Safety net in case the intro flag never clears.
    safety = window.setTimeout(() => {
      forced = true;
      maybeReveal();
    }, 30_000);

    maybeReveal();

    return () => {
      io?.disconnect();
      mo?.disconnect();
      window.clearTimeout(safety);
    };
  }, [block.animate]);

  // Split `text` on newlines into lines, gold-highlighting `emphasis`.
  const renderRich = (text: string, emphasis?: string) =>
    (text || "").split("\n").map((line, li) => {
      const parts =
        emphasis && line.includes(emphasis)
          ? line.split(emphasis).reduce<React.ReactNode[]>((acc, seg, si) => {
              if (si > 0)
                acc.push(
                  <span key={`e${si}`} className="wu-emph">
                    {emphasis}
                  </span>
                );
              acc.push(seg);
              return acc;
            }, [])
          : [line];
      return (
        <span key={li} className="wu-rich-line">
          {parts}
        </span>
      );
    });

  const className = [
    "wu-framework-section",
    block.background === "gold" && "is-gold",
    block.animate && "wu-anim",
    block.animate && shown && "is-shown",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section ref={sectionRef} className={className}>
      <div className="wu-framework-inner">
        <h2
          className="wu-framework-heading"
          data-tina-field={tinaField(data, path("heading"))}
        >
          {(block.heading || "").split("\n").map((line, li, arr) => (
            <React.Fragment key={li}>
              {line}
              {li < arr.length - 1 && (
                <>
                  {" "}
                  {/* a real break on mobile; collapses to the space on
                      desktop, where the heading fits one line */}
                  <br className="wu-hbr" />
                </>
              )}
            </React.Fragment>
          ))}
        </h2>

        {block.intro && (
          <p
            className="wu-framework-intro"
            data-tina-field={tinaField(data, path("intro"))}
          >
            {renderRich(block.intro, block.introEmphasis)}
          </p>
        )}

        <ol className="wu-framework-list">
          {items.map((it, ii) => (
            <li className="wu-framework-item" key={ii}>
              <span
                className="wu-framework-marker"
                data-tina-field={tinaField(data, `${path("items")}.${ii}.marker`)}
              >
                {it.marker}
              </span>
              <div className="wu-framework-details">
                <h3
                  className="wu-framework-title"
                  data-tina-field={tinaField(data, `${path("items")}.${ii}.title`)}
                >
                  {it.title}
                </h3>
                {it.points && it.points.length > 0 ? (
                  <ul
                    className="wu-framework-points"
                    data-tina-field={tinaField(
                      data,
                      `${path("items")}.${ii}.points`
                    )}
                  >
                    {it.points.map((pt, pi) => (
                      <li key={pi}>{pt}</li>
                    ))}
                  </ul>
                ) : it.description ? (
                  <p
                    className="wu-framework-desc"
                    data-tina-field={tinaField(
                      data,
                      `${path("items")}.${ii}.description`
                    )}
                  >
                    {it.description}
                  </p>
                ) : null}
                {it.scriptureRef && (
                  <span
                    className="wu-framework-scripture"
                    data-tina-field={tinaField(
                      data,
                      `${path("items")}.${ii}.scriptureRef`
                    )}
                  >
                    {it.scriptureRef}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>

        {block.closing && (
          <p
            className="wu-framework-closing"
            data-tina-field={tinaField(data, path("closing"))}
          >
            {renderRich(block.closing, block.closingEmphasis)}
          </p>
        )}
      </div>
    </section>
  );
}
