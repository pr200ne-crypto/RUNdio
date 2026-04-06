import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { DemoFooter } from "@/components/DemoFooter";
import { RunMapLoader } from "@/components/RunMapLoader";
import { PRESET_ROUTE } from "@/lib/demo-route";

export default function PlanRoutePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] dark:bg-[#020617]">
      <AppHeader backHref="/" backLabel="ホーム" title="ルート計画（S-02）" />
      <main className="flex flex-1 flex-col gap-4 px-4 py-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          デモではプリセットの折れ線ルートを使用します（編集は未実装）。
        </p>
        <RunMapLoader route={PRESET_ROUTE} />
        <Link
          className="mt-2 block rounded-xl bg-orange-500 py-3 text-center font-semibold text-white hover:bg-orange-600"
          href="/plan/poi"
        >
          このルートで次へ
        </Link>
      </main>
      <DemoFooter />
    </div>
  );
}
