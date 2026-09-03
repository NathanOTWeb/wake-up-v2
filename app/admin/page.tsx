"use client";

import { TinaProvider, TinaAdmin, TinaCMS } from "tinacms";
import tinacmsConfig from "@/tina/config";
import TinaHome from "../TinaHome";
import { useMemo } from "react";

export default function AdminPage() {
  const cms = useMemo(() => {
    return new TinaCMS({
      clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
      isSelfHosted: true,
    });
  }, []);

  return (
    <TinaProvider cms={cms}>
      <TinaAdmin
        config={tinacmsConfig}
        preview={(({ live }: any) => (
          <TinaHome initialData={live || { home: {} }} />
        )) as any}
      />
    </TinaProvider>
  );
}