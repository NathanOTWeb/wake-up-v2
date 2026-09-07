import fs from "fs";
import path from "path";

const TINA_BRANCH =
  process.env.NEXT_PUBLIC_TINA_BRANCH || process.env.HEAD || "main";

// Fetch one document from TinaCloud's cached content endpoint, falling back
// to the committed local JSON file when the API is unavailable (offline dev,
// missing env, or a doc not yet indexed). `collection` is the Tina
// collection name; `relativePath` is the file within its `path` (e.g.
// "index.json", "method.json").
async function fetchTinaDoc(collection: string, relativePath: string) {
  if (process.env.NEXT_PUBLIC_TINA_CLIENT_ID) {
    try {
      const response = await fetch(
        `https://content.tinajs.io/content/${process.env.NEXT_PUBLIC_TINA_CLIENT_ID}/${TINA_BRANCH}/${collection}?relativePath=${encodeURIComponent(
          relativePath
        )}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TINA_TOKEN}`,
            "Content-Type": "application/json",
          },
          next: { revalidate: 3600 },
        }
      );
      if (response.ok) {
        const data = await response.json();
        const doc = data.data?.[collection]?.document;
        if (doc) return doc;
      }
    } catch {
      // Fall through to local JSON
    }
  }
  return null;
}

function readLocalJson(relPath: string) {
  try {
    const jsonPath = path.join(process.cwd(), relPath);
    return JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  } catch (e) {
    console.error(`Failed to read local content: ${relPath}`, e);
    return null;
  }
}

export async function fetchTinaHome() {
  return (
    (await fetchTinaDoc("home", "index.json")) ??
    readLocalJson("content/home/index.json")
  );
}

// `slug` is the route segment / filename without extension (e.g. "method").
export async function fetchTinaPage(slug: string) {
  return (
    (await fetchTinaDoc("page", `${slug}.json`)) ??
    readLocalJson(`content/pages/${slug}.json`)
  );
}

// Filenames (without .json) under content/pages/ — the set of valid /[slug]
// routes. Used by generateStaticParams.
export function listPageSlugs(): string[] {
  try {
    const dir = path.join(process.cwd(), "content/pages");
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""));
  } catch {
    return [];
  }
}
