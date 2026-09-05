"use client";

import { TinaCloudProvider, TinaAdmin } from "tinacms";
import tinacmsConfig from "@/tina/config";
import TinaHome from "../TinaHome";

export default function AdminPageInner() {
  return (
    // @ts-expect-error TinaCMS types are stricter than runtime needs
    <TinaCloudProvider
      clientId={process.env.NEXT_PUBLIC_TINA_CLIENT_ID}
      branch={process.env.NEXT_PUBLIC_TINA_BRANCH || "main"}
      schema={tinacmsConfig.schema}
      isLocalClient={false}
    >
      <TinaAdmin
        config={tinacmsConfig}
        preview={({ live }: any) => (
          <TinaHome initialData={live || { home: {} }} />
        )}
      />
    </TinaCloudProvider>
  );
}