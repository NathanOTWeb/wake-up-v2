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
        {
          type: "number",
          name: "startHoldSeconds",
          label: "Hold the poster before playing (seconds, optional)",
          description: "Use this if the video opens on text that needs time to read — the poster image holds still before the video starts.",
        },
        {
          type: "number",
          name: "holdSeconds",
          label: "Hold the last frame before fading (seconds, optional)",
          description: "Default is 1.5s if left blank.",
        },
        {
          type: "string",
          name: "mobileFocus",
          label: "Mobile crop focus (optional)",
          description:
            "For a landscape clip cropped to fill portrait phones — which side to keep in frame.",
          options: [
            { value: "center", label: "Center" },
            { value: "left", label: "Left" },
            { value: "right", label: "Right" },
          ],
        },
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
