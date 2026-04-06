"use client";

import Link from "next/link";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { DemoFooter } from "@/components/DemoFooter";

export default function SettingsPage() {
  const [cueMode, setCueMode] = useState<"distance" | "time">("distance");

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] dark:bg-[#020617]">
      <AppHeader backHref="/" title="設定（S-07）" />
      <main className="flex flex-1 flex-col gap-6 px-4 py-4">
        <section>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            区切り・通知の基準
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            デモでは UI のみ。走行ロジックは距離キュー固定。
          </p>
          <div className="mt-3 flex gap-2">
            <button
              className={`flex-1 rounded-lg border py-2 text-sm font-medium ${
                cueMode === "distance"
                  ? "border-orange-500 bg-orange-50 text-orange-800 dark:bg-orange-950/40 dark:text-orange-200"
                  : "border-slate-200 dark:border-slate-700"
              }`}
              onClick={() => setCueMode("distance")}
              type="button"
            >
              距離
            </button>
            <button
              className={`flex-1 rounded-lg border py-2 text-sm font-medium ${
                cueMode === "time"
                  ? "border-orange-500 bg-orange-50 text-orange-800 dark:bg-orange-950/40 dark:text-orange-200"
                  : "border-slate-200 dark:border-slate-700"
              }`}
              onClick={() => setCueMode("time")}
              type="button"
            >
              時間
            </button>
          </div>
        </section>
        <section>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            音声
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            NotebookLM 等で生成した mp3 は{" "}
            <code className="rounded bg-slate-200 px-1 text-xs dark:bg-slate-800">
              public/audio/
            </code>{" "}
            に配置し、再生ロジックを差し替えます。
          </p>
        </section>
        <section>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            連携（拡張フック）
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Google Fit 等は要件 0.2 では未接続。将来用の UI プレースホルダです。
          </p>
        </section>
        <Link
          className="mt-auto block rounded-xl border border-slate-300 py-3 text-center text-sm font-medium dark:border-slate-600"
          href="/"
        >
          ホームに戻る
        </Link>
      </main>
      <DemoFooter />
    </div>
  );
}
