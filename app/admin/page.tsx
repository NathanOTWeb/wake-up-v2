"use client";

import dynamic from "next/dynamic";

const TinaAdminPage = dynamic(() => import("./AdminPage"), { ssr: false });

export default function AdminPage() {
  return <TinaAdminPage />;
}