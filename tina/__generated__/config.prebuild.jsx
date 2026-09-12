// tina/config.tsx
import { defineConfig } from "tinacms";

// tina/templates.ts
var listSection = {
  name: "listSection",
  label: "List Section",
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading",
      required: true,
      ui: { component: "textarea" },
      description: "Add a line break to control where the heading wraps."
    },
    {
      type: "string",
      name: "intro",
      label: "Intro paragraph (optional)",
      ui: { component: "textarea" },
      description: "Shown above the lists. Line breaks render as new lines."
    },
    {
      type: "string",
      name: "introEmphasis",
      label: "Emphasised phrase (intro)",
      description: "A phrase within the intro to render in gold."
    },
    {
      type: "object",
      name: "groups",
      label: "List Groups",
      list: true,
      ui: {
        itemProps: (g) => ({
          label: g?.lead || g?.items?.[0]?.text || "Group"
        })
      },
      fields: [
        { type: "string", name: "lead", label: "Lead-in line (optional)" },
        {
          type: "object",
          name: "items",
          label: "Items",
          list: true,
          ui: { itemProps: (i) => ({ label: i?.text }) },
          fields: [{ type: "string", name: "text", label: "Text" }]
        }
      ]
    },
    {
      type: "string",
      name: "closing",
      label: "Closing statement",
      ui: { component: "textarea" },
      description: "Use a line break for the second line."
    },
    {
      type: "string",
      name: "closingEmphasis",
      label: "Emphasised phrase",
      description: "A phrase within the closing statement to render in gold."
    },
    { type: "string", name: "scripture", label: "Scripture (optional)" },
    { type: "string", name: "scriptureRef", label: "Scripture reference (optional)" },
    {
      type: "string",
      name: "background",
      label: "Background",
      options: [
        { value: "default", label: "Ivory" },
        { value: "gold", label: "Pale gold" }
      ]
    },
    {
      type: "object",
      name: "cta",
      label: "Button (optional)",
      fields: [
        { type: "string", name: "label", label: "Label" },
        { type: "string", name: "href", label: "Link URL" }
      ]
    }
  ]
};
var frameworkSection = {
  name: "frameworkSection",
  label: "Framework Section",
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading",
      required: true,
      ui: { component: "textarea" },
      description: "Add a line break to control where the heading wraps."
    },
    {
      type: "string",
      name: "intro",
      label: "Intro paragraph (optional)",
      ui: { component: "textarea" },
      description: "Shown above the entries. Line breaks render as new lines."
    },
    {
      type: "string",
      name: "introEmphasis",
      label: "Emphasised phrase (intro)",
      description: "A phrase within the intro to render in gold."
    },
    {
      type: "object",
      name: "items",
      label: "Entries",
      list: true,
      ui: {
        itemProps: (i) => ({
          label: [i?.marker, i?.title].filter(Boolean).join(" \xB7 ") || "Entry"
        })
      },
      fields: [
        {
          type: "string",
          name: "marker",
          label: "Marker",
          description: "The letter or numeral shown large in gold (W, A, K\u2026 or I, II, III\u2026)."
        },
        { type: "string", name: "title", label: "Title" },
        {
          type: "string",
          name: "description",
          label: "Description (single line)",
          description: "A short phrase. Leave empty and use Points for a list."
        },
        {
          type: "string",
          name: "points",
          label: "Points (list)",
          list: true,
          description: "One line each; shown as a list. Overrides Description."
        },
        {
          type: "string",
          name: "scriptureRef",
          label: "Scripture reference (optional)"
        }
      ]
    },
    {
      type: "string",
      name: "closing",
      label: "Closing statement (optional)",
      ui: { component: "textarea" },
      description: "Use a line break for the second line."
    },
    {
      type: "string",
      name: "closingEmphasis",
      label: "Emphasised phrase",
      description: "A phrase within the closing statement to render in gold."
    },
    {
      type: "string",
      name: "background",
      label: "Background",
      options: [
        { value: "default", label: "Ivory" },
        { value: "gold", label: "Pale gold" }
      ]
    },
    {
      type: "boolean",
      name: "animate",
      label: "Animate entries in",
      description: "Fade the cards in one by one (then the closing line) when the section scrolls into view."
    }
  ]
};
var benefitsSection = {
  name: "benefitsSection",
  label: "Benefits Section",
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading",
      required: true,
      ui: { component: "textarea" },
      description: "Add a line break to control where the heading wraps."
    },
    {
      type: "string",
      name: "benefits",
      label: "Benefits",
      list: true,
      description: "One line each; laid out in a two-column grid."
    },
    { type: "string", name: "scripture", label: "Scripture (optional)" },
    { type: "string", name: "scriptureRef", label: "Scripture reference (optional)" },
    {
      type: "object",
      name: "cta",
      label: "Button (optional)",
      fields: [
        { type: "string", name: "label", label: "Label" },
        { type: "string", name: "href", label: "Link URL" }
      ]
    },
    {
      type: "string",
      name: "background",
      label: "Background",
      options: [
        { value: "default", label: "Ivory" },
        { value: "gold", label: "Pale gold" }
      ]
    },
    {
      type: "boolean",
      name: "animate",
      label: "Animate entries in",
      description: "Heading fades up, then the cards slide in from their side, then the scripture, then the button \u2014 on scroll into view."
    }
  ]
};
var pathsSection = {
  name: "pathsSection",
  label: "Paths / Tiers Section",
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading",
      required: true,
      ui: { component: "textarea" },
      description: "Add a line break to control where the heading wraps."
    },
    {
      type: "object",
      name: "tiers",
      label: "Tiers",
      list: true,
      ui: {
        itemProps: (t) => ({ label: t?.name || t?.badge || "Tier" })
      },
      fields: [
        { type: "string", name: "badge", label: "Badge (e.g. SILVER)" },
        { type: "string", name: "name", label: "Name" },
        { type: "string", name: "subtitle", label: "Subtitle" },
        { type: "boolean", name: "popular", label: "Highlight as most popular" },
        {
          type: "string",
          name: "idealFor",
          label: "Who it's for (optional)",
          description: 'One line, e.g. "For men who need structure, direction, and entry into discipline."'
        },
        {
          type: "string",
          name: "features",
          label: "What they get (optional)",
          list: true,
          description: "One line each."
        },
        {
          type: "string",
          name: "priceInFull",
          label: "Price \u2014 pay in full (optional)",
          description: 'e.g. "$997 \u2013 $1,200"'
        },
        {
          type: "string",
          name: "paymentOptions",
          label: "Other payment options (optional)",
          list: true,
          description: 'One line each, e.g. "$350\u2013400/mo (3 months)".'
        }
      ]
    },
    {
      type: "object",
      name: "cta",
      label: "Button (optional)",
      fields: [
        { type: "string", name: "label", label: "Label" },
        { type: "string", name: "href", label: "Link URL" }
      ]
    },
    { type: "string", name: "closing", label: "Closing line (optional)", ui: { component: "textarea" } },
    { type: "string", name: "closingEmphasis", label: "Closing \u2014 word/phrase to highlight gold (optional)" },
    {
      type: "string",
      name: "background",
      label: "Background",
      options: [
        { value: "default", label: "Ivory" },
        { value: "gold", label: "Pale gold" }
      ]
    },
    {
      type: "boolean",
      name: "animate",
      label: "Animate entries in",
      description: "Heading fades up, then the tiers, then the button, then the closing line \u2014 on scroll into view."
    }
  ]
};
var sectionTemplates = [
  listSection,
  frameworkSection,
  benefitsSection,
  pathsSection
];

// tina/collection/home.tsx
var Home = {
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
      return void 0;
    }
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
          fields: [{ type: "string", name: "text", label: "Line" }]
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
            { type: "boolean", name: "primary", label: "Primary Button" }
          ]
        }
      ]
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
            { type: "string", name: "href", label: "Link URL" }
          ]
        }
      ]
    },
    {
      type: "object",
      name: "sections",
      label: "Page Sections",
      list: true,
      // itemProps is valid at runtime for a templated blocks list; the shipped
      // Collection types don't model it, hence the cast.
      ui: {
        itemProps: (item) => ({
          label: item?.heading || item?._template || "Section"
        })
      },
      templates: [listSection]
    }
  ]
};
var home_default = Home;

// tina/collection/page.tsx
var Page = {
  label: "Pages",
  name: "page",
  path: "content/pages",
  format: "json",
  ui: {
    router: ({ document }) => `/${document._sys.filename}`
  },
  fields: [
    {
      type: "string",
      name: "title",
      label: "Title",
      required: true,
      description: "Used for the browser tab / SEO. Not shown on the page itself."
    },
    {
      type: "object",
      name: "intro",
      label: "Intro video",
      description: "Plays once, centred over the page, on load. Leave the URL empty for no intro.",
      fields: [
        {
          type: "string",
          name: "src",
          label: "Video URL",
          description: "e.g. /media/power-is-within-you.mp4"
        },
        { type: "string", name: "poster", label: "Poster image URL" }
      ]
    },
    {
      type: "object",
      name: "sections",
      label: "Page Sections",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.heading || item?._template || "Section"
        })
      },
      templates: sectionTemplates
    }
  ]
};
var page_default = Page;

// tina/config.tsx
var config = defineConfig({
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  branch: process.env.NEXT_PUBLIC_TINA_BRANCH || process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main",
  token: process.env.TINA_TOKEN,
  media: {
    tina: {
      publicFolder: "public",
      mediaRoot: "uploads"
    }
  },
  build: {
    publicFolder: "public",
    outputFolder: ".tina/admin",
    basePath: ""
  },
  schema: {
    collections: [home_default, page_default]
  }
});
var config_default = config;
export {
  config_default as default
};
