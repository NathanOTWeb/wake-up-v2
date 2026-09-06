// @ts-nocheck
"use client";

import { tinaField } from "tinacms/dist/react";

type Item = { text?: string };

type Block = {
  heading?: string;
  lead?: string;
  items?: Item[];
  closing?: string;
  closingEmphasis?: string;
  scripture?: string;
  scriptureRef?: string;
  background?: "default" | "gold";
};

/**
 * A heading + checklist + closing-statement section. Wider viewports put the
 * heading in a left column and the list/closing on the right (echoes the hero
 * split); narrow viewports stack them. Flows to its content height.
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
  const items = block.items || [];
  const emph = block.closingEmphasis;

  const renderClosing = () =>
    (block.closing || "").split("\n").map((line, li) => {
      const parts =
        emph && line.includes(emph)
          ? line.split(emph).reduce<React.ReactNode[]>((acc, seg, si) => {
              if (si > 0) acc.push(<span key={`e${si}`} className="wu-emph">{emph}</span>);
              acc.push(seg);
              return acc;
            }, [])
          : [line];
      return (
        <span key={li} className="wu-closing-line">
          {parts}
        </span>
      );
    });

  return (
    <section className={`wu-list-section${block.background === "gold" ? " is-gold" : ""}`}>
      <div className="wu-list-inner">
        <h2 className="wu-list-heading" data-tina-field={tinaField(data, path("heading"))}>
          {block.heading}
        </h2>

        {block.lead && (
          <p className="wu-list-lead" data-tina-field={tinaField(data, path("lead"))}>
            {block.lead}
          </p>
        )}

        <ul className="wu-checklist">
          {items.map((it, i) => (
            <li key={i} data-tina-field={tinaField(data, `${path("items")}.${i}.text`)}>
              {it.text}
            </li>
          ))}
        </ul>

        {block.closing && (
          <p className="wu-list-closing" data-tina-field={tinaField(data, path("closing"))}>
            {renderClosing()}
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
      </div>
    </section>
  );
}
