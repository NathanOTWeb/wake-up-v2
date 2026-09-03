import fs from "fs";
import path from "path";

export async function fetchTinaHome() {
  // Try TinaCMS GraphQL API first
  if (process.env.NEXT_PUBLIC_TINA_CLIENT_ID) {
    try {
      const response = await fetch(
        `https://content.tinajs.io/content/${process.env.NEXT_PUBLIC_TINA_CLIENT_ID}/${process.env.NEXT_PUBLIC_TINA_BRANCH || process.env.HEAD || 'main'}/home`,
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
        return data.data?.home?.document || null;
      }
    } catch (e) {
      // Fall through to local JSON
    }
  }

  // Fallback: read local JSON
  try {
    const jsonPath = path.join(process.cwd(), "content/home/index.json");
    const raw = fs.readFileSync(jsonPath, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to fetch home content:", e);
    return null;
  }
}