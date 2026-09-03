// tina/config.tsx
import { defineConfig } from "tinacms";

// tina/collection/home.tsx
var Home = {
  label: "Home",
  name: "home",
  path: "content/home",
  format: "json",
  frontend: {
    router: () => "/"
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
    }
  ]
};
var home_default = Home;

// tina/config.tsx
var config = defineConfig({
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  branch: process.env.NEXT_PUBLIC_TINA_BRANCH || process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || process.env.HEAD,
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
    collections: [home_default]
  }
});
var config_default = config;
export {
  config_default as default
};
