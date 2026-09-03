import { defineConfig } from "tinacms";
import Home from "./collection/home";

const config = defineConfig({
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID!,
  branch: process.env.NEXT_PUBLIC_TINA_BRANCH! || process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF! || process.env.HEAD!,
  token: process.env.TINA_TOKEN!,
  media: {
    tina: {
      publicFolder: "public",
      mediaRoot: "uploads",
    },
  },
  build: {
    publicFolder: "public",
    outputFolder: ".tina/admin",
    basePath: '',
  },
  schema: {
    collections: [Home],
  },
});

export default config;