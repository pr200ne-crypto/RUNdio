import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { DemoFooter } from "@/components/DemoFooter";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] dark:bg-[#020617]">
      <AppHeader title="ホーム（S-01）" />
      <main className="flex flex-1 flex-col gap-6 px-4 py-6">
        <div>
          <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            RUNdio
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            ラン×レディオ：あなただけのランニング用ラジオ
          </p>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          要件 0.2 デモ — ルートはプリセット、POI はモック JSON、走行はブラウザ内擬似です。
        </p>
        <div className="flex flex-col gap-3">
          <Link
            className="rounded-xl bg-orange-500 py-3 text-center font-semibold text-white shadow hover:bg-orange-600"
            href="/plan/route"
          >
            今日のランを計画する
          </Link>
          <Link
            className="rounded-xl border border-slate-300 py-3 text-center text-sm font-medium text-slate-700 hover:bg-white dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-900"
            href="/settings"
          >
            設定
          </Link>
        </div>
      </main>
      <DemoFooter />
    </div>
  );
}
