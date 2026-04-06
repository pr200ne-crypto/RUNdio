import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { DemoFooter } from "@/components/DemoFooter";

export default function RunCompletePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] dark:bg-[#020617]">
      <AppHeader title="完了（S-06）" />
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-8 text-center">
        <p className="text-lg font-semibold text-slate-900 dark:text-white">
          おつかれさまでした
        </p>
        <div className="font-mono text-xl tabular-nums text-teal-600 dark:text-teal-400">
          10.1 km &nbsp; 58:20 &nbsp; 5&apos;46&quot;/km
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          （固定デモ値 — 実走連携は未接続）
        </p>
        <div className="max-w-sm rounded-xl border border-slate-200 bg-white p-4 text-left text-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="font-medium text-slate-800 dark:text-slate-100">
            次の提案
          </p>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            明日は短めのリカバリーがおすすめです。同じルートで入浴施設まで足を伸ばすのもアリです。
          </p>
        </div>
        <div className="flex w-full max-w-sm flex-col gap-2">
          <Link
            className="rounded-xl bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600"
            href="/"
          >
            ホーム
          </Link>
          <Link
            className="rounded-xl border border-slate-300 py-3 text-slate-700 dark:border-slate-600 dark:text-slate-200"
            href="/plan/route"
          >
            詳細（計画からやり直し）
          </Link>
        </div>
      </main>
      <DemoFooter />
    </div>
  );
}
