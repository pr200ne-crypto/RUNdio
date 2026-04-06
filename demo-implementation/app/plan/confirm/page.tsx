import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { DemoFooter } from "@/components/DemoFooter";
import { polylineLengthMeters } from "@/lib/route-length";
import { PRESET_ROUTE } from "@/lib/demo-route";

export default function PlanConfirmPage() {
  const routeM = Math.round(polylineLengthMeters(PRESET_ROUTE));

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] dark:bg-[#020617]">
      <AppHeader
        backHref="/plan/poi"
        title="計画確認（S-04）"
      />
      <main className="flex flex-1 flex-col gap-4 px-4 py-4">
        <dl className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">ルート長（概算）</dt>
            <dd className="font-medium tabular-nums">
              {(routeM / 1000).toFixed(1)} km
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">チェックポイント</dt>
            <dd className="font-medium">入浴施設（モック 2 件）</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">音声</dt>
            <dd className="font-medium">番組トラック（デモ: 距離キュー）</dd>
          </div>
        </dl>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          目標ペースは走行画面で固定デモ値（5&apos;10&quot;/km）として表示します。
        </p>
        <Link
          className="mt-auto block rounded-xl bg-teal-500 py-3 text-center font-semibold text-white hover:bg-teal-600"
          href="/run"
        >
          走行を開始
        </Link>
      </main>
      <DemoFooter />
    </div>
  );
}
