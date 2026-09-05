"use client";

import { TinaCloudProvider, TinaAdmin } from "tinacms";
import tinacmsConfig from "@/tina/config";

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
        // TinaCMS's live preview is iframe-based, not a directly-rendered
        // React component -- it calls this with { url, iframeRef }, where
        // `url` is the real site path (from the collection's ui.router)
        // to load. The actual live-editing behavior comes from that page
        // itself calling useTina() (see app/page.tsx / TinaHome.tsx),
        // which detects it's running inside this iframe and switches to
        // reflecting edits in real time.
        preview={({ url, iframeRef }: any) => (
          <iframe
            ref={iframeRef}
            src={url}
            title="Live Preview"
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        )}
      />
    </TinaCloudProvider>
  );
}