import type { Collection } from "tinacms";
import { sectionTemplates } from "../templates";

/**
 * Secondary pages (the "See How" page and any that follow). One JSON file
 * per page under content/pages/; the filename is the route — method.json
 * serves /method. Each page is a title plus a reorderable `sections` blocks
 * list drawn from the same templates the home page uses.
 */
const Page: Collection = {
  label: "Pages",
  name: "page",
  path: "content/pages",
  format: "json",
  ui: {
    router: ({ document }) => `/${document._sys.filename}`,
  },
  fields: [
    {
      type: "string",
      name: "title",
      label: "Title",
      required: true,
      description: "Used for the browser tab / SEO. Not shown on the page itself.",
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
          description: "e.g. /media/power-is-within-you.mp4",
        },
        { type: "string", name: "poster", label: "Poster image URL" },
      ],
    },
    {
      type: "object",
      name: "sections",
      label: "Page Sections",
      list: true,
      ui: {
        itemProps: (item: any) => ({
          label: item?.heading || item?._template || "Section",
        }),
      } as any,
      templates: sectionTemplates,
    },
  ],
};

export default Page;
