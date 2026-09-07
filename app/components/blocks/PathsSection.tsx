// @ts-nocheck
"use client";

import { tinaField } from "tinacms/dist/react";
import { useReveal } from "./useReveal";

type Tier = {
  badge?: string;
  name?: string;
  subtitle?: string;
  popular?: boolean;
};

type Block = {
  heading?: string;
  tiers?: Tier[];
  cta?: { label?: string; href?: string };
  background?: "default" | "gold";
  animate?: boolean;
};

/**
 * A heading with a gold rule, a row of tier cards (badge / name / subtitle,
 * one optionally highlighted as "most popular"), and an optional button.
 * Serves V6 section 8 "Choose Your Path". With `animate`, the heading fades
 * up, then the tiers stagger in, then the button.
 */
export default function PathsSection({
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
  const tiers = block.tiers || [];

  const { ref: sectionRef, shown } = useReveal(block.animate);

  const className = [
    "wu-paths-section",
    block.background === "gold" && "is-gold",
    block.animate && "wu-anim",
    block.animate && shown && "is-shown",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section ref={sectionRef} className={className}>
      <div className="wu-paths-inner">
        <h2
          className="wu-paths-heading"
          data-tina-field={tinaField(data, path("heading"))}
        >
          {(block.heading || "").split("\n").map((line, li, arr) => (
            <span key={li}>
              {line}
              {li < arr.length - 1 && <br className="wu-hbr" />}
            </span>
          ))}
        </h2>

        <ul className="wu-paths-grid">
          {tiers.map((t, ti) => (
            <li
              className={`wu-tier${t.popular ? " is-popular" : ""}`}
              key={ti}
            >
              {t.badge && (
                <span
                  className="wu-tier-badge"
                  data-tina-field={tinaField(data, `${path("tiers")}.${ti}.badge`)}
                >
                  {t.badge}
                </span>
              )}
              {t.name && (
                <h3
                  className="wu-tier-name"
                  data-tina-field={tinaField(data, `${path("tiers")}.${ti}.name`)}
                >
                  {t.name}
                </h3>
              )}
              {t.subtitle && (
                <p
                  className="wu-tier-subtitle"
                  data-tina-field={tinaField(
                    data,
                    `${path("tiers")}.${ti}.subtitle`
                  )}
                >
                  {t.subtitle}
                </p>
              )}
            </li>
          ))}
        </ul>

        {block.cta?.label && (
          <div className="wu-paths-cta">
            <a
              className="wu-cta-link"
              href={block.cta.href || "#"}
              data-tina-field={tinaField(data, path("cta.label"))}
            >
              {block.cta.label}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
