// @ts-nocheck
"use client";

import React from "react";
import { tinaField } from "tinacms/dist/react";
import { useReveal } from "./useReveal";

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

  // Held hidden until in view + any intro overlay has cleared; then the CSS
  // keyed on .wu-anim / .is-shown staggers the entries in.
  const { ref: sectionRef, shown } = useReveal(block.animate);

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
