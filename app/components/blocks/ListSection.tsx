// @ts-nocheck
"use client";

import { tinaField } from "tinacms/dist/react";

type Item = { text?: string };
type Group = { lead?: string; items?: Item[] };

type Block = {
  heading?: string;
  intro?: string;
  introEmphasis?: string;
  groups?: Group[];
  closing?: string;
  closingEmphasis?: string;
  scripture?: string;
  scriptureRef?: string;
  cta?: { label?: string; href?: string };
  background?: "default" | "gold";
};

/**
 * A heading, one or more (optionally labelled) checklists, and a closing
 * statement. Full-width heading with a gold rule; checklists render in a
 * two-column grid on wider viewports. Flows to its content height.
 */
export default function ListSection({
  data,
  index,
  block,
}: {
  data: any;
  index: number;
  block: Block;
}) {
  const path = (field: string) => `home.sections.${index}.${field}`;
  const groups = block.groups || [];

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

  return (
    <section className={`wu-list-section${block.background === "gold" ? " is-gold" : ""}`}>
      <div className="wu-list-inner">
        <h2 className="wu-list-heading" data-tina-field={tinaField(data, path("heading"))}>
          {(block.heading || "").split("\n").map((line, li, arr) => (
            <span key={li}>
              {line}
              {li < arr.length - 1 && <br />}
            </span>
          ))}
        </h2>

        {block.intro && (
          <p className="wu-list-intro" data-tina-field={tinaField(data, path("intro"))}>
            {renderRich(block.intro, block.introEmphasis)}
          </p>
        )}

        {groups.map((g, gi) => (
          <div
            className={`wu-list-group${
              gi === groups.length - 1 && block.scripture ? " has-rule" : ""
            }`}
            key={gi}
          >
            {g.lead && (
              <p
                className="wu-list-lead"
                data-tina-field={tinaField(data, `${path("groups")}.${gi}.lead`)}
              >
                {g.lead}
              </p>
            )}
            <ul className="wu-checklist">
              {(g.items || []).map((it, ii) => (
                <li
                  key={ii}
                  data-tina-field={tinaField(data, `${path("groups")}.${gi}.items.${ii}.text`)}
                >
                  {it.text}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {block.closing && (
          <p className="wu-list-closing" data-tina-field={tinaField(data, path("closing"))}>
            {renderRich(block.closing, block.closingEmphasis)}
          </p>
        )}

        {block.scripture && (
          <p className="wu-list-scripture">
            <span data-tina-field={tinaField(data, path("scripture"))}>{block.scripture}</span>
            {block.scriptureRef && (
              <span className="wu-scripture-ref">
                {" "}
                — <span data-tina-field={tinaField(data, path("scriptureRef"))}>{block.scriptureRef}</span>
              </span>
            )}
          </p>
        )}

        {block.cta?.label && (
          <div className="wu-list-cta">
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
