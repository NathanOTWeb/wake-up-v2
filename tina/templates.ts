import type { Template } from "tinacms";

/**
 * Section templates shared by the `home` and `page` collections. Both
 * collections expose a reorderable `sections` blocks list; a section shape
 * that either page can use lives here so the two schemas stay in sync and
 * the block components (app/components/blocks/*) render the same data
 * everywhere.
 */

/** A heading, one or more (optionally labelled) checklists, a closing line. */
export const listSection: Template = {
  name: "listSection",
  label: "List Section",
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading",
      required: true,
      ui: { component: "textarea" },
      description: "Add a line break to control where the heading wraps.",
    },
    {
      type: "string",
      name: "intro",
      label: "Intro paragraph (optional)",
      ui: { component: "textarea" },
      description: "Shown above the lists. Line breaks render as new lines.",
    },
    {
      type: "string",
      name: "introEmphasis",
      label: "Emphasised phrase (intro)",
      description: "A phrase within the intro to render in gold.",
    },
    {
      type: "object",
      name: "groups",
      label: "List Groups",
      list: true,
      ui: {
        itemProps: (g: any) => ({
          label: g?.lead || g?.items?.[0]?.text || "Group",
        }),
      },
      fields: [
        { type: "string", name: "lead", label: "Lead-in line (optional)" },
        {
          type: "object",
          name: "items",
          label: "Items",
          list: true,
          ui: { itemProps: (i: any) => ({ label: i?.text }) },
          fields: [{ type: "string", name: "text", label: "Text" }],
        },
      ],
    },
    {
      type: "string",
      name: "closing",
      label: "Closing statement",
      ui: { component: "textarea" },
      description: "Use a line break for the second line.",
    },
    {
      type: "string",
      name: "closingEmphasis",
      label: "Emphasised phrase",
      description: "A phrase within the closing statement to render in gold.",
    },
    { type: "string", name: "scripture", label: "Scripture (optional)" },
    { type: "string", name: "scriptureRef", label: "Scripture reference (optional)" },
    {
      type: "string",
      name: "background",
      label: "Background",
      options: [
        { value: "default", label: "Ivory" },
        { value: "gold", label: "Pale gold" },
      ],
    },
    {
      type: "object",
      name: "cta",
      label: "Button (optional)",
      fields: [
        { type: "string", name: "label", label: "Label" },
        { type: "string", name: "href", label: "Link URL" },
      ],
    },
  ],
};

/**
 * A heading over a stack of labelled entries — each a short marker (a letter
 * or numeral), a title, a one-line description, and an optional scripture
 * reference. Covers the WAKE UP acronym and the 12-week phases.
 */
export const frameworkSection: Template = {
  name: "frameworkSection",
  label: "Framework Section",
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading",
      required: true,
      ui: { component: "textarea" },
      description: "Add a line break to control where the heading wraps.",
    },
    {
      type: "string",
      name: "intro",
      label: "Intro paragraph (optional)",
      ui: { component: "textarea" },
      description: "Shown above the entries. Line breaks render as new lines.",
    },
    {
      type: "string",
      name: "introEmphasis",
      label: "Emphasised phrase (intro)",
      description: "A phrase within the intro to render in gold.",
    },
    {
      type: "object",
      name: "items",
      label: "Entries",
      list: true,
      ui: {
        itemProps: (i: any) => ({
          label: [i?.marker, i?.title].filter(Boolean).join(" · ") || "Entry",
        }),
      },
      fields: [
        {
          type: "string",
          name: "marker",
          label: "Marker",
          description: "The letter or numeral shown large in gold (W, A, K… or I, II, III…).",
        },
        { type: "string", name: "title", label: "Title" },
        { type: "string", name: "description", label: "Description" },
        {
          type: "string",
          name: "scriptureRef",
          label: "Scripture reference (optional)",
        },
      ],
    },
    {
      type: "string",
      name: "closing",
      label: "Closing statement (optional)",
      ui: { component: "textarea" },
      description: "Use a line break for the second line.",
    },
    {
      type: "string",
      name: "closingEmphasis",
      label: "Emphasised phrase",
      description: "A phrase within the closing statement to render in gold.",
    },
    {
      type: "string",
      name: "background",
      label: "Background",
      options: [
        { value: "default", label: "Ivory" },
        { value: "gold", label: "Pale gold" },
      ],
    },
  ],
};

export const sectionTemplates: Template[] = [listSection, frameworkSection];
