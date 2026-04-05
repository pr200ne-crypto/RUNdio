import Link from "next/link";
import { Play, History, Settings, ChevronRight, User, Activity, Flame, Award } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 pb-24 relative">
      {/* Header */}
      <header className="pt-12 pb-6 px-6 bg-white rounded-b-[2.5rem] shadow-sm relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-slate-400 overflow-hidden">
              <User size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Good Morning</p>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                ランナーさん
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/settings" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
              <Settings size={20} />
            </Link>
          </div>
        </div>
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50/50 p-4 rounded-2xl flex flex-col items-center justify-center border border-blue-100/50">
            <Activity size={18} className="text-blue-500 mb-1" />
            <span className="text-xs font-bold text-slate-500 mb-0.5">今週</span>
            <div className="text-lg font-black text-slate-900 tabular-nums">12.4<span className="text-[10px] font-bold text-slate-400 ml-0.5">km</span></div>
          </div>
          <div className="bg-orange-50/50 p-4 rounded-2xl flex flex-col items-center justify-center border border-orange-100/50">
            <Flame size={18} className="text-orange-500 mb-1" />
            <span className="text-xs font-bold text-slate-500 mb-0.5">連続</span>
            <div className="text-lg font-black text-slate-900 tabular-nums">3<span className="text-[10px] font-bold text-slate-400 ml-0.5">日</span></div>
          </div>
          <div className="bg-purple-50/50 p-4 rounded-2xl flex flex-col items-center justify-center border border-purple-100/50">
            <Award size={18} className="text-purple-500 mb-1" />
            <span className="text-xs font-bold text-slate-500 mb-0.5">ペース</span>
            <div className="text-lg font-black text-slate-900 tabular-nums">5'45"</div>
          </div>
        </div>
      </header>

      {/* Main Action (FAB style) */}
      <div className="px-6 py-10 flex justify-center">
        <Link
          href="/plan/route"
          className="relative group flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-blue-600 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse" />
          <div className="relative w-48 h-48 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full flex flex-col items-center justify-center text-white shadow-2xl shadow-blue-600/30 border-4 border-white active:scale-95 transition-all duration-300">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2 backdrop-blur-md">
              <Play fill="white" size={32} className="ml-2" />
            </div>
            <span className="font-black tracking-widest text-lg">START</span>
            <span className="text-[10px] font-bold text-blue-100 mt-1">ランを計画する</span>
          </div>
        </Link>
      </div>

      {/* Recent Activity Carousel */}
      <div className="pl-6 mb-8">
        <div className="flex items-center justify-between pr-6 mb-4">
          <h3 className="font-black text-slate-900 text-lg tracking-tight">最近のラン</h3>
          <Link href="/history" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center">
            すべて見る <ChevronRight size={14} />
          </Link>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 pr-6 no-scrollbar snap-x">
          {[
            { id: 1, date: "昨日", time: "32:14", name: "隅田川テラスコース", distance: "5.2" },
            { id: 2, date: "3日前", time: "28:45", name: "皇居外周コース", distance: "5.0" },
            { id: 3, date: "1週間前", time: "21:10", name: "代々木公園周回", distance: "3.5" }
          ].map((run) => (
            <Link key={run.id} href="/history" className="snap-center shrink-0 w-64 bg-white rounded-3xl p-5 shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all active:scale-[0.98]">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">{run.date}</div>
                <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">{run.time}</div>
              </div>
              <h4 className="font-bold text-slate-800 mb-4 truncate">{run.name}</h4>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">距離</div>
                  <div className="text-2xl font-black text-slate-900 leading-none">{run.distance}<span className="text-xs font-bold text-slate-500 ml-0.5">km</span></div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
