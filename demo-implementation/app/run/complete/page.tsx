"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Trophy, ChevronRight, Home, Share2 } from "lucide-react";

function RunCompleteContent() {
  const searchParams = useSearchParams();
  const distance = Number(searchParams.get("distance")) || 0;
  const duration = Number(searchParams.get("duration")) || 0;

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const avgPace = duration > 0 ? (duration / (distance / 1000) / 60).toFixed(2).replace(".", "'") + "\"" : "0'00\"";

  return (
    <main className="flex flex-col min-h-screen max-w-md mx-auto bg-background p-6">
      <header className="py-12 text-center space-y-4">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-accent/10 text-accent rounded-full mb-4">
          <Trophy size={48} />
        </div>
        <h1 className="text-3xl font-extrabold text-primary">お疲れ様でした！</h1>
        <p className="text-muted-foreground">今日のランニング番組を完走しました。</p>
      </header>

      <div className="flex-1 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 text-center">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">距離</div>
            <div className="text-2xl font-bold">{(distance / 1000).toFixed(2)} <span className="text-sm">km</span></div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 text-center">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">タイム</div>
            <div className="text-2xl font-bold">{formatTime(duration)}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 text-center col-span-2">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">平均ペース</div>
            <div className="text-2xl font-bold">{avgPace} <span className="text-sm">/km</span></div>
          </div>
        </div>

        <section className="bg-primary text-primary-foreground p-8 rounded-3xl shadow-xl space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest opacity-60">次回の番組提案</h2>
          <p className="text-lg font-bold leading-snug">
            「今日は素晴らしいペースでしたね！明日は短めのリカバリーランで、体を休めるのがおすすめです。」
          </p>
        </section>
      </div>

      <div className="py-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/home"
            className="flex items-center justify-center py-4 bg-white dark:bg-slate-900 text-primary border border-slate-200 dark:border-slate-800 rounded-2xl font-bold transition-all active:scale-95"
          >
            <Home size={20} className="mr-2" />
            ホーム
          </Link>
          <button
            className="flex items-center justify-center py-4 bg-white dark:bg-slate-900 text-primary border border-slate-200 dark:border-slate-800 rounded-2xl font-bold transition-all active:scale-95"
          >
            <Share2 size={20} className="mr-2" />
            シェア
          </button>
        </div>
        
        <Link
          href="/plan/route"
          className="flex items-center justify-center w-full py-5 bg-accent text-accent-foreground rounded-2xl font-bold text-lg shadow-lg shadow-accent/20 transition-all active:scale-95"
        >
          次の番組を計画する
          <ChevronRight size={20} className="ml-1" />
        </Link>
      </div>
    </main>
  );
}

export default function RunCompletePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RunCompleteContent />
    </Suspense>
  );
}
