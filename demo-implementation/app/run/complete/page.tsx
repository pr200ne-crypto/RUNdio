"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Trophy, ChevronRight, Home, Share2, Map, Clock, Zap } from "lucide-react";

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
    <main className="flex flex-col min-h-screen max-w-md mx-auto bg-slate-50 text-slate-800">
      <header className="pt-16 pb-8 px-6 text-center">
        <div className="relative inline-flex items-center justify-center w-28 h-28 bg-blue-100 text-blue-600 rounded-full mb-6 shadow-inner">
          <div className="absolute inset-0 bg-blue-600/10 rounded-full animate-ping" />
          <Trophy size={48} className="relative z-10" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">お疲れ様でした！</h1>
        <p className="text-slate-500 font-medium">今日のランニング番組を完走しました。</p>
      </header>

      <div className="flex-1 px-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Map size={20} />
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">距離</div>
            <div className="text-3xl font-black text-slate-900 tabular-nums">
              {(distance / 1000).toFixed(2)}
              <span className="text-sm font-bold text-slate-500 ml-1">km</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Clock size={20} />
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">タイム</div>
            <div className="text-3xl font-black text-slate-900 tabular-nums">
              {formatTime(duration)}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center col-span-2">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Zap size={20} />
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">平均ペース</div>
            <div className="text-3xl font-black text-slate-900 tabular-nums">
              {avgPace}
              <span className="text-sm font-bold text-slate-500 ml-1">/km</span>
            </div>
          </div>
        </div>

        {/* AI Feedback */}
        <section className="relative overflow-hidden bg-blue-600 text-white p-8 rounded-3xl shadow-xl shadow-blue-600/20">
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-300" />
              AIパーソナリティより
            </h2>
            <p className="text-lg font-bold leading-relaxed">
              「今日は素晴らしいペースでしたね！明日は短めのリカバリーランで、体を休めるのがおすすめです。」
            </p>
          </div>
        </section>
      </div>

      <div className="p-6 space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/home"
            className="flex items-center justify-center py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold transition-all active:scale-[0.98] hover:bg-slate-50 hover:border-slate-300 shadow-sm"
          >
            <Home size={20} className="mr-2 text-slate-400" />
            ホーム
          </Link>
          <button
            className="flex items-center justify-center py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold transition-all active:scale-[0.98] hover:bg-slate-50 hover:border-slate-300 shadow-sm"
          >
            <Share2 size={20} className="mr-2 text-slate-400" />
            シェア
          </button>
        </div>
        
        <Link
          href="/plan/route"
          className="flex items-center justify-center w-full py-5 bg-blue-600 text-white rounded-full font-bold text-lg shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] hover:bg-blue-700"
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 font-bold">読み込み中...</div>}>
      <RunCompleteContent />
    </Suspense>
  );
}
