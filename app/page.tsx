import { fetchTinaHome } from "@/lib/tina";
import TinaHome from "./TinaHome";

// TinaHome (a client component) calls useTina() with this server-fetched
// data as its starting point. Outside of Tina's live-preview iframe it
// just renders the static data as-is; inside it, useTina() detects the
// editing context and switches to reflecting edits in real time -- that's
// what makes the same page usable both as the real site and as the
// visual editor's live preview (see app/admin/AdminPage.tsx).
export default async function HomePage() {
  const data = await fetchTinaHome();

  return <TinaHome initialData={data} />;
}