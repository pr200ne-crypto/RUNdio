import Link from "next/link";
import { Play, History, Settings, ChevronRight, User } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 pb-12 max-w-md mx-auto shadow-2xl relative">
      {/* Header */}
      <header className="pt-12 pb-8 px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
              <Play fill="white" size={14} className="text-white ml-0.5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">RUNdio</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 overflow-hidden">
            <User size={20} />
          </div>
        </div>
        
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            こんにちは、ランナーさん 👋
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            今日のコンディションはいかがですか？
          </p>
        </div>
      </header>

      {/* Main Action */}
      <div className="px-6 mb-8">
        <Link
          href="/plan/route"
          className="relative block w-full bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-600/20 overflow-hidden group hover:bg-blue-700 transition-all active:scale-[0.98]"
        >
          {/* Decorative background element */}
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
          <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-blue-400/20 rounded-full blur-xl" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-5 backdrop-blur-md border border-white/10 shadow-inner">
              <Play fill="white" size={32} className="ml-2 text-white" />
            </div>
            <h2 className="text-2xl font-black mb-2 tracking-tight">ランを計画する</h2>
            <p className="text-blue-100 text-sm font-medium">
              ルートと番組をカスタマイズして出発
            </p>
          </div>
        </Link>
      </div>

      {/* Secondary Actions */}
      <div className="px-6 grid grid-cols-2 gap-4 mb-10">
        <Link
          href="/history"
          className="group bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center gap-3 hover:border-blue-200 hover:shadow-md transition-all active:scale-[0.98]"
        >
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
            <History size={24} />
          </div>
          <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">アクティビティ</span>
        </Link>
        <Link
          href="/settings"
          className="group bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center gap-3 hover:border-blue-200 hover:shadow-md transition-all active:scale-[0.98]"
        >
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
            <Settings size={24} />
          </div>
          <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">設定</span>
        </Link>
      </div>

      {/* Recent Activity Snippet */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">最近のラン</h3>
          <Link href="/history" className="text-xs font-bold text-blue-600 hover:text-blue-700">
            すべて見る
          </Link>
        </div>
        
        <Link href="/history" className="block bg-white rounded-3xl p-5 shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all active:scale-[0.98]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex flex-col items-center justify-center text-blue-600">
              <span className="text-lg font-black leading-none">5.2</span>
              <span className="text-[10px] font-bold mt-0.5">km</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800 mb-1">隅田川テラスコース</h4>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <span>昨日</span>
                <span className="w-1 h-1 rounded-full bg-slate-200" />
                <span>32:14</span>
                <span className="w-1 h-1 rounded-full bg-slate-200" />
                <span>6'12"/km</span>
              </div>
            </div>
            <div className="text-slate-300">
              <ChevronRight size={20} />
            </div>
          </div>
        </Link>
      </div>
    </main>
  );
}
