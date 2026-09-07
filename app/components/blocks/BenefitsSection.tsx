// @ts-nocheck
"use client";

import { tinaField } from "tinacms/dist/react";
import { useReveal } from "./useReveal";

type Block = {
  heading?: string;
  benefits?: string[];
  scripture?: string;
  scriptureRef?: string;
  background?: "default" | "gold";
  animate?: boolean;
};

/**
 * A heading with a gold rule, a two-column grid of one-line benefit cards
 * (one column on narrow screens), and an optional scripture. Serves V6
 * section 7 "What You Get". With `animate`, the heading fades up, then the
 * cards slide in from their own side — left column from the left, right
 * column from the right (and on a single-column layout they alternate) —
 * then the scripture fades in.
 */
export default function BenefitsSection({
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
  const items = block.benefits || [];

  const { ref: sectionRef, shown } = useReveal(block.animate);

  const className = [
    "wu-benefits-section",
    block.background === "gold" && "is-gold",
    block.animate && "wu-anim",
    block.animate && shown && "is-shown",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section ref={sectionRef} className={className}>
      <div className="wu-benefits-inner">
        <h2
          className="wu-benefits-heading"
          data-tina-field={tinaField(data, path("heading"))}
        >
          {(block.heading || "").split("\n").map((line, li, arr) => (
            <span key={li}>
              {line}
              {li < arr.length - 1 && <br className="wu-hbr" />}
            </span>
          ))}
        </h2>

        <ul
          className="wu-benefits-grid"
          data-tina-field={tinaField(data, path("benefits"))}
        >
          {items.map((it, ii) => (
            <li className="wu-benefit-item" key={ii}>
              {it}
            </li>
          ))}
        </ul>

        {block.scripture && (
          <p className="wu-benefits-scripture">
            <span data-tina-field={tinaField(data, path("scripture"))}>
              {block.scripture}
            </span>
            {block.scriptureRef && (
              <span className="wu-scripture-ref">
                {" "}
                —{" "}
                <span data-tina-field={tinaField(data, path("scriptureRef"))}>
                  {block.scriptureRef}
                </span>
              </span>
            )}
          </p>
        )}
      </div>
    </section>
  );
}
