import type { Collection } from "tinacms";

const Home: Collection = {
  label: "Home",
  name: "home",
  path: "content/home",
  format: "json",
  ui: {
    // Tells Tina's visual/live editor which URL on the live site each
    // document corresponds to -- without this it has no way to know what
    // to render in the preview pane, and silently falls back to the
    // form-only editor (no live preview route is ever offered).
    router: ({ document }) => {
      if (document._sys.filename === "index") return "/";
      return undefined;
    },
  },
  fields: [
    {
      type: "object",
      name: "hero",
      label: "Hero Section",
      fields: [
        { type: "image", name: "logo", label: "Logo" },
        { type: "string", name: "title", label: "Title" },
        { type: "string", name: "subtitle", label: "Subtitle" },
        {
          type: "object",
          name: "taglines",
          label: "Taglines",
          list: true,
          fields: [{ type: "string", name: "text", label: "Line" }],
        },
        { type: "string", name: "scripture", label: "Scripture Quote" },
        { type: "string", name: "scriptureRef", label: "Scripture Reference" },
        {
          type: "object",
          name: "ctas",
          label: "Call-to-Action Buttons",
          list: true,
          fields: [
            { type: "string", name: "label", label: "Button Label" },
            { type: "string", name: "href", label: "Link URL" },
            { type: "boolean", name: "primary", label: "Primary Button" },
          ],
        },
      ],
    },
    {
      type: "object",
      name: "nav",
      label: "Navigation",
      fields: [
        {
          type: "object",
          name: "links",
          label: "Nav Links",
          list: true,
          fields: [
            { type: "string", name: "label", label: "Link Label" },
            { type: "string", name: "href", label: "Link URL" },
          ],
        },
      ],
    },
    {
      type: "object",
      name: "sections",
      label: "Page Sections",
      list: true,
      // itemProps is valid at runtime for a templated blocks list; the shipped
      // Collection types don't model it, hence the cast.
      ui: {
        itemProps: (item: any) => ({
          label: item?.heading || item?._template || "Section",
        }),
      } as any,
      templates: [
        {
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
        },
      ],
    },
  ],
};

export default Home;