"use client";

import dynamic from "next/dynamic";

const RunActiveClient = dynamic(
  () =>
    import("@/components/RunActiveClient").then((m) => m.RunActiveClient),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-slate-600 dark:bg-[#020617] dark:text-slate-300">
        走行画面を読み込み中…
      </div>
    ),
  },
);

export default function RunActivePage() {
  return <RunActiveClient />;
}
