// @ts-nocheck
"use client";

import { tinaField } from "tinacms/dist/react";
import { useReveal } from "./useReveal";

type Scripture = { text?: string; ref?: string };

type Block = {
  heading?: string;
  headingSmall?: string;
  photo?: string;
  photo1B?: string;
  photo1C?: string;
  intro?: string;
  struggles?: string[];
  afterList?: string;
  quote?: string;
  afterQuote?: string;
  afterQuoteEmphasis?: string;
  scriptures?: Scripture[];
  closing?: string;
  closingEmphasis?: string;
  background?: "default" | "gold";
  animate?: boolean;
};

/**
 * A founder bio: photo beside name/intro, a short struggles list, a
 * pull-quote, one or more scripture citations, and a closing statement.
 * V6 section 11 "Meet The Founder".
 */
export default function FounderSection({
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
  const struggles = block.struggles || [];
  const scriptures = block.scriptures || [];

  // Photo 1 can crossfade between 2–3 images every 2s; a single photo just
  // renders as a plain static image (unchanged from before).
  const photo1Slots = [
    { src: block.photo, field: path("photo") },
    { src: block.photo1B, field: path("photo1B") },
    { src: block.photo1C, field: path("photo1C") },
  ].filter((s) => s.src);

  const { ref: sectionRef, shown } = useReveal(block.animate);

  // Split `text` on newlines into <span> lines, gold-highlighting `emphasis`.
  const renderRich = (text: string, emphasis?: string) =>
    (text || "").split("\n").map((line, li) => {
      const parts =
        emphasis && line.includes(emphasis)
          ? line.split(emphasis).reduce<React.ReactNode[]>((acc, seg, si) => {
              if (si > 0) acc.push(<span key={`e${si}`} className="wu-emph">{emphasis}</span>);
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
    "wu-founder-section",
    block.background === "gold" && "is-gold",
    block.animate && "wu-anim",
    block.animate && shown && "is-shown",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section ref={sectionRef} className={className}>
      <div className="wu-founder-inner">
        <h2 className="wu-founder-heading" data-tina-field={tinaField(data, path("heading"))}>
          {(block.heading || "").split("\n").map((line, li, arr) => {
            const small = block.headingSmall;
            const parts =
              small && line.includes(small)
                ? line.split(small).reduce<React.ReactNode[]>((acc, seg, si) => {
                    if (si > 0) acc.push(<small key={`s${si}`} className="wu-heading-small">{small}</small>);
                    acc.push(seg);
                    return acc;
                  }, [])
                : [line];
            return (
              <span key={li}>
                {parts}
                {li < arr.length - 1 && <br />}
              </span>
            );
          })}
        </h2>

        <div className="wu-founder-content">
          {photo1Slots.length === 1 && (
            <img
              className="wu-founder-photo wu-founder-photo1"
              src={photo1Slots[0].src}
              alt=""
              data-tina-field={tinaField(data, photo1Slots[0].field)}
            />
          )}

          {photo1Slots.length > 1 && (
            <div
              className={`wu-founder-photo1 wu-founder-photo1-cycle has-${photo1Slots.length}`}
            >
              {photo1Slots.map((s, si) => (
                <img
                  key={si}
                  className="wu-founder-photo1-img"
                  src={s.src}
                  alt=""
                  style={{ animationDelay: `${-2000 * si}ms` }}
                  data-tina-field={tinaField(data, s.field)}
                />
              ))}
            </div>
          )}

          {block.intro && (
            <p className="wu-founder-intro" data-tina-field={tinaField(data, path("intro"))}>
              {block.intro}
            </p>
          )}

          {struggles.length > 0 && (
            <ul
              className="wu-checklist wu-founder-struggles"
              data-tina-field={tinaField(data, path("struggles"))}
            >
              {struggles.map((s, si) => (
                <li key={si}>{s}</li>
              ))}
            </ul>
          )}

          {block.afterList && (
            <p
              className="wu-founder-para wu-founder-after-list"
              data-tina-field={tinaField(data, path("afterList"))}
            >
              {block.afterList}
            </p>
          )}

          {block.quote && (
            <blockquote className="wu-founder-quote" data-tina-field={tinaField(data, path("quote"))}>
              {block.quote}
            </blockquote>
          )}

          {block.afterQuote && (
            <p
              className="wu-founder-para wu-founder-after-quote"
              data-tina-field={tinaField(data, path("afterQuote"))}
            >
              {renderRich(block.afterQuote, block.afterQuoteEmphasis)}
            </p>
          )}

          {scriptures.length > 0 && (
            <div className="wu-founder-scriptures">
              {scriptures.map((s, si) => (
                <p className="wu-founder-scripture" key={si}>
                  <span data-tina-field={tinaField(data, `${path("scriptures")}.${si}.text`)}>
                    {s.text}
                  </span>
                  {s.ref && (
                    <span className="wu-scripture-ref">
                      {" "}
                      — <span data-tina-field={tinaField(data, `${path("scriptures")}.${si}.ref`)}>{s.ref}</span>
                    </span>
                  )}
                </p>
              ))}
            </div>
          )}

          {block.closing && (
            <p className="wu-founder-closing" data-tina-field={tinaField(data, path("closing"))}>
              {renderRich(block.closing, block.closingEmphasis)}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
