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
        {
          type: "string",
          name: "description",
          label: "Description (single line)",
          description: "A short phrase. Leave empty and use Points for a list.",
        },
        {
          type: "string",
          name: "points",
          label: "Points (list)",
          list: true,
          description: "One line each; shown as a list. Overrides Description.",
        },
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
    {
      type: "boolean",
      name: "animate",
      label: "Animate entries in",
      description: "Fade the cards in one by one (then the closing line) when the section scrolls into view.",
    },
  ],
};

/**
 * A heading over a two-column grid of one-line benefit cards, plus an
 * optional scripture and an optional button. V6 section 7 "What You Get".
 */
export const benefitsSection: Template = {
  name: "benefitsSection",
  label: "Benefits Section",
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
      name: "benefits",
      label: "Benefits",
      list: true,
      description: "One line each; laid out in a two-column grid.",
    },
    { type: "string", name: "scripture", label: "Scripture (optional)" },
    { type: "string", name: "scriptureRef", label: "Scripture reference (optional)" },
    {
      type: "object",
      name: "cta",
      label: "Button (optional)",
      fields: [
        { type: "string", name: "label", label: "Label" },
        { type: "string", name: "href", label: "Link URL" },
      ],
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
    {
      type: "boolean",
      name: "animate",
      label: "Animate entries in",
      description: "Heading fades up, then the cards slide in from their side, then the scripture, then the button — on scroll into view.",
    },
  ],
};

/**
 * A heading over a row of pricing/path tier cards (badge, name, subtitle;
 * one can be flagged "most popular"), plus an optional button. V6 section 8
 * "Choose Your Path".
 */
export const pathsSection: Template = {
  name: "pathsSection",
  label: "Paths / Tiers Section",
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
      type: "object",
      name: "tiers",
      label: "Tiers",
      list: true,
      ui: {
        itemProps: (t: any) => ({ label: t?.name || t?.badge || "Tier" }),
      },
      fields: [
        { type: "string", name: "badge", label: "Badge (e.g. SILVER)" },
        { type: "string", name: "name", label: "Name" },
        { type: "string", name: "subtitle", label: "Subtitle" },
        { type: "boolean", name: "popular", label: "Highlight as most popular" },
        {
          type: "string",
          name: "accent",
          label: "Color accent (optional)",
          description: "Tints the card's border/badge/price to match the tier's metal.",
          options: [
            { value: "silver", label: "Silver" },
            { value: "gold", label: "Gold" },
            { value: "platinum", label: "Platinum" },
          ],
        },
        {
          type: "string",
          name: "idealFor",
          label: "Who it's for (optional)",
          description: "One line, e.g. \"For men who need structure, direction, and entry into discipline.\"",
        },
        {
          type: "string",
          name: "features",
          label: "What they get (optional)",
          list: true,
          description: "One line each.",
        },
        {
          type: "string",
          name: "priceInFull",
          label: "Price — pay in full (optional)",
          description: "e.g. \"$997 – $1,200\"",
        },
        {
          type: "string",
          name: "paymentOptions",
          label: "Other payment options (optional)",
          list: true,
          description: "One line each, e.g. \"$350–400/mo (3 months)\".",
        },
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
    { type: "string", name: "closing", label: "Closing line (optional)", ui: { component: "textarea" } },
    { type: "string", name: "closingEmphasis", label: "Closing — word/phrase to highlight gold (optional)" },
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
      type: "boolean",
      name: "animate",
      label: "Animate entries in",
      description: "Heading fades up, then the tiers, then the button, then the closing line — on scroll into view.",
    },
  ],
};

/**
 * A founder bio: photo beside a name/intro, a short struggles list, a
 * pull-quote, one or more scripture citations, and a closing statement.
 * V6 section 11 "Meet The Founder".
 */
export const founderSection: Template = {
  name: "founderSection",
  label: "Founder Section",
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
      name: "headingSmall",
      label: "Heading — phrase to render smaller (optional)",
      description: "e.g. \"AKA\" — rendered in a <small> tag within the heading.",
    },
    {
      type: "image",
      name: "photo",
      label: "Photo 1",
      description: "Floats left near the top of the text.",
    },
    {
      type: "image",
      name: "photo1B",
      label: "Photo 1 — second image (optional)",
      description: "Crossfades with Photo 1 in the same spot, every 2s.",
    },
    {
      type: "image",
      name: "photo1C",
      label: "Photo 1 — third image (optional)",
      description: "Crossfades with Photo 1 in the same spot, every 2s.",
    },
    {
      type: "string",
      name: "intro",
      label: "Intro paragraph (optional)",
      ui: { component: "textarea" },
      description: "Shown above the struggles list.",
    },
    {
      type: "string",
      name: "struggles",
      label: "Struggles (list)",
      list: true,
      description: "One line each, e.g. \"Lack of direction\".",
    },
    {
      type: "string",
      name: "afterList",
      label: "Paragraph after the list (optional)",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "quote",
      label: "Pull-quote (optional)",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "afterQuote",
      label: "Paragraph after the quote (optional)",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "afterQuoteEmphasis",
      label: "Emphasised phrase (paragraph after quote)",
      description: "A phrase within that paragraph to render in gold.",
    },
    {
      type: "object",
      name: "scriptures",
      label: "Scriptures",
      list: true,
      ui: {
        itemProps: (s: any) => ({ label: s?.ref || s?.text || "Scripture" }),
      },
      fields: [
        { type: "string", name: "text", label: "Text" },
        { type: "string", name: "ref", label: "Reference" },
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
    {
      type: "boolean",
      name: "animate",
      label: "Animate entries in",
      description: "Fade the content in on scroll into view.",
    },
  ],
};

/**
 * A click/hover-to-play video in a bordered viewer box (same visual
 * treatment as founderSection's photo) — silent until the viewer starts
 * it, then a final call-to-action (heading, subtext, buttons, logo) fades
 * in over the box once the clip ends. V6 section 12 "Final Call To
 * Action" + the footer lionhead, surfaced once the video finishes.
 */
export const videoRevealSection: Template = {
  name: "videoRevealSection",
  label: "Video Reveal Section",
  fields: [
    { type: "string", name: "video", label: "Video URL" },
    { type: "string", name: "poster", label: "Poster image URL (optional)" },
    {
      type: "string",
      name: "revealHeading",
      label: "Reveal heading",
      description: "Shown once the video finishes playing.",
    },
    {
      type: "string",
      name: "revealSubtext",
      label: "Reveal subtext",
      ui: { component: "textarea" },
      description: "Use a line break for the second line.",
    },
    {
      type: "string",
      name: "revealSubtextEmphasis",
      label: "Emphasised word/phrase (subtext)",
    },
    {
      type: "object",
      name: "ctas",
      label: "Buttons",
      list: true,
      ui: {
        itemProps: (c: any) => ({ label: c?.label || "Button" }),
      },
      fields: [
        { type: "string", name: "label", label: "Button Label" },
        { type: "string", name: "href", label: "Link URL" },
        { type: "boolean", name: "primary", label: "Primary Button" },
      ],
    },
    { type: "image", name: "logo", label: "Logo (shown below the buttons)" },
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

export const sectionTemplates: Template[] = [
  listSection,
  frameworkSection,
  benefitsSection,
  pathsSection,
  founderSection,
  videoRevealSection,
];
