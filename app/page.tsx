import { fetchTinaHome } from "@/lib/tina";
import Hero from "./components/Hero";
import Nav from "./components/Nav";

export default async function HomePage() {
  const data = await fetchTinaHome();
  const hero = data?.hero || {};
  const nav = data?.nav || {};

  return (
    <>
      <Nav links={nav.links} />
      <Hero hero={hero} />
    </>
  );
}