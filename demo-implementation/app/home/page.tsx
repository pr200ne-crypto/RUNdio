import Link from "next/link";
import { Play, Map as MapIcon, Settings, History } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen p-4 max-w-md mx-auto bg-background">
      <header className="py-8 text-center">
        <h1 className="text-4xl font-extrabold text-primary mb-2">RUNdio</h1>
        <p className="text-sm text-muted-foreground">ラン×レディオ：あなただけのランニング用ラジオ</p>
      </header>

      <div className="flex-1 flex flex-col gap-6 justify-center">
        <Link 
          href="/plan/route"
          className="flex flex-col items-center justify-center p-8 bg-primary text-primary-foreground rounded-3xl shadow-xl active:scale-95 transition-transform"
        >
          <Play size={48} fill="currentColor" className="mb-4 text-accent" />
          <span className="text-xl font-bold">ランを開始する</span>
          <span className="text-xs opacity-70 mt-1">今日の番組を組み立てよう</span>
        </Link>

        <div className="grid grid-cols-2 gap-4">
          <Link 
            href="/history"
            className="flex flex-col items-center p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-md active:scale-95 transition-transform"
          >
            <History className="mb-2 text-primary dark:text-slate-300" />
            <span className="font-semibold">履歴</span>
          </Link>
          <Link 
            href="/settings"
            className="flex flex-col items-center p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-md active:scale-95 transition-transform"
          >
            <Settings className="mb-2 text-primary dark:text-slate-300" />
            <span className="font-semibold">設定</span>
          </Link>
        </div>
      </div>

      <footer className="py-6 text-center text-xs text-muted-foreground">
        © 2026 RUNdio Project
      </footer>
    </main>
  );
}
