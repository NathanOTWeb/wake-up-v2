import type { Collection } from "tinacms";

const Home: Collection = {
  label: "Home",
  name: "home",
  path: "content/home",
  format: "json",
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
  ],
};

export default Home;