// @ts-nocheck
"use client";

import { tinaField } from "tinacms/dist/react";
import { useReveal } from "./useReveal";

type Tier = {
  badge?: string;
  name?: string;
  subtitle?: string;
  popular?: boolean;
  idealFor?: string;
  features?: string[];
  priceInFull?: string;
  paymentOptions?: string[];
};

type Block = {
  heading?: string;
  tiers?: Tier[];
  cta?: { label?: string; href?: string };
  closing?: string;
  closingEmphasis?: string;
  background?: "default" | "gold";
  animate?: boolean;
};

// Split `text` on newlines into lines, gold-highlighting `emphasis` — matches
// FrameworkSection's renderRich.
function renderRich(text: string, emphasis?: string) {
  return (text || "").split("\n").map((line, li) => {
    const parts =
      emphasis && line.includes(emphasis)
        ? line.split(emphasis).reduce<any[]>((acc, seg, si) => {
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
}

/**
 * A heading with a gold rule, a row of tier cards (badge / name / subtitle,
 * who it's for, a feature list, pricing options; one card can be flagged
 * "most popular"), an optional button, and an optional closing statement.
 * Serves V6 section 8 "Choose Your Path" (as a home/method teaser) and the
 * full /pricing breakdown. With `animate`, the heading fades up, then the
 * tiers stagger in, then the button, then the closing line.
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

              {t.idealFor && (
                <p
                  className="wu-tier-ideal-for"
                  data-tina-field={tinaField(
                    data,
                    `${path("tiers")}.${ti}.idealFor`
                  )}
                >
                  {t.idealFor}
                </p>
              )}

              {t.features && t.features.length > 0 && (
                <ul
                  className="wu-tier-features"
                  data-tina-field={tinaField(
                    data,
                    `${path("tiers")}.${ti}.features`
                  )}
                >
                  {t.features.map((f, fi) => (
                    <li key={fi}>{f}</li>
                  ))}
                </ul>
              )}

              {(t.priceInFull || (t.paymentOptions && t.paymentOptions.length > 0)) && (
                <div className="wu-tier-price">
                  {t.priceInFull && (
                    <span
                      className="wu-tier-price-full"
                      data-tina-field={tinaField(
                        data,
                        `${path("tiers")}.${ti}.priceInFull`
                      )}
                    >
                      {t.priceInFull}
                    </span>
                  )}
                  {t.paymentOptions && t.paymentOptions.length > 0 && (
                    <ul
                      className="wu-tier-payment-options"
                      data-tina-field={tinaField(
                        data,
                        `${path("tiers")}.${ti}.paymentOptions`
                      )}
                    >
                      {t.paymentOptions.map((p, pi) => (
                        <li key={pi}>{p}</li>
                      ))}
                    </ul>
                  )}
                </div>
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

        {block.closing && (
          <p
            className="wu-paths-closing"
            data-tina-field={tinaField(data, path("closing"))}
          >
            {renderRich(block.closing, block.closingEmphasis)}
          </p>
        )}
      </div>
    </section>
  );
}
