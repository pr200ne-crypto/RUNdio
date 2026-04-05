"use client";

import { Suspense } from "react";
import RunActiveClient from "@/components/RunActiveClient";

export default function RunPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-bold">Loading...</div>}>
      <RunActiveClient />
    </Suspense>
  );
}
