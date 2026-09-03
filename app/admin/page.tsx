import { TinaAdmin } from "tinacms";
import tinacmsConfig from "../../../tina/config";
import TinaHome from "../TinaHome";

export default function AdminPage() {
  return (
    <TinaAdmin
      config={tinacmsConfig}
      preview={(({ live }: any) => (
        <TinaHome initialData={live || { home: {} }} />
      )) as any}
    />
  );
}