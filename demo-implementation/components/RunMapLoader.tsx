"use client";

import dynamic from "next/dynamic";
import type { MapPoi } from "@/lib/map-types";

const RunMapLazy = dynamic(() => import("./RunMap").then((m) => m.RunMap), {
  ssr: false,
  loading: () => (
    <div
      className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
      style={{ height: 280 }}
    >
      地図を読み込み中…
    </div>
  ),
});

type Props = {
  route: [number, number][];
  pois?: MapPoi[];
  className?: string;
  heightPx?: number;
};

/** サーバーコンポーネントから安全に使う（Leaflet はクライアントのみ） */
export function RunMapLoader(props: Props) {
  return <RunMapLazy {...props} />;
}
