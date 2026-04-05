"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, History as HistoryIcon, Calendar as CalendarIcon, Ruler, Clock, ChevronRight, Play, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface Session {
  id: string;
  distance_meters: number;
  duration_seconds: number;
  created_at: string;
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  useEffect(() => {
    fetch("/api/sessions")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSessions(data);
        }
      })
      .catch((err) => console.error("Error fetching sessions:", err))
      .finally(() => setLoading(false));
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      weekday: "short",
    });
  };
  
  const formatTimeOnly = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="flex flex-col min-h-screen bg-slate-50 text-slate-800 relative pb-20">
      <header className="p-4 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <Link href="/home" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-500 transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="font-black text-lg tracking-tight">アクティビティ</h1>
        </div>
        
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setViewMode("list")}
            className={cn("p-2 rounded-lg transition-all", viewMode === "list" ? "bg-white shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600")}
          >
            <List size={18} />
          </button>
          <button 
            onClick={() => setViewMode("calendar")}
            className={cn("p-2 rounded-lg transition-all", viewMode === "calendar" ? "bg-white shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600")}
          >
            <CalendarIcon size={18} />
          </button>
        </div>
      </header>

      <div className="flex-1 p-6 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
            <div className="animate-spin mb-4 text-blue-600">
              <HistoryIcon size={32} />
            </div>
            <p className="font-bold">読み込み中...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-300">
              <HistoryIcon size={40} />
            </div>
            <div className="space-y-2">
              <p className="font-black text-xl text-slate-900">履歴がありません</p>
              <p className="text-sm font-medium text-slate-500">最初のランニングを開始しましょう！</p>
            </div>
            <Link
              href="/plan/route"
              className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center gap-2 hover:bg-blue-700"
            >
              <Play size={18} fill="currentColor" />
              ランを開始する
            </Link>
          </div>
        ) : viewMode === "calendar" ? (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center py-20 text-slate-400">
            <CalendarIcon size={48} className="mb-4 text-blue-200" />
            <p className="font-bold">カレンダービューは準備中です</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all active:scale-[0.98] group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <CalendarIcon size={14} />
                    </div>
                    {formatDate(session.created_at)}
                  </div>
                  <div className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                    {formatTimeOnly(session.created_at)}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center mb-1">
                      <Ruler size={12} className="mr-1" /> 距離
                    </div>
                    <div className="text-2xl font-black text-slate-900 tabular-nums leading-none">
                      {(session.distance_meters / 1000).toFixed(2)} <span className="text-xs font-bold text-slate-500 ml-0.5">km</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center mb-1">
                      <Clock size={12} className="mr-1" /> タイム
                    </div>
                    <div className="text-2xl font-black text-slate-900 tabular-nums leading-none">
                      {formatTime(session.duration_seconds)}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <div className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">
                    ペース: {(session.duration_seconds / (session.distance_meters / 1000) / 60).toFixed(2).replace(".", "'") + "\""}/km
                  </div>
                  <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
