"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, History as HistoryIcon, Calendar, Ruler, Clock, ChevronRight } from "lucide-react";

interface Session {
  id: string;
  distance_meters: number;
  duration_seconds: number;
  created_at: string;
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="flex flex-col min-h-screen max-w-md mx-auto bg-background p-4">
      <header className="py-4 flex items-center mb-6">
        <Link href="/home" className="p-2 -ml-2">
          <ChevronLeft />
        </Link>
        <h1 className="flex-1 text-center font-bold">走行履歴</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <div className="animate-spin mb-4">
              <HistoryIcon size={32} />
            </div>
            <p>読み込み中...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
              <HistoryIcon size={32} />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-lg">履歴がありません</p>
              <p className="text-sm text-muted-foreground">最初のランニングを開始しましょう！</p>
            </div>
            <Link
              href="/plan/route"
              className="px-6 py-3 bg-primary text-white rounded-xl font-bold active:scale-95 transition-all"
            >
              ランを開始する
            </Link>
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4"
            >
              <div className="flex items-center text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <Calendar size={14} className="mr-1" />
                {formatDate(session.created_at)}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center">
                    <Ruler size={10} className="mr-1" /> 距離
                  </div>
                  <div className="text-xl font-bold">
                    {(session.distance_meters / 1000).toFixed(2)} <span className="text-sm">km</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center">
                    <Clock size={10} className="mr-1" /> タイム
                  </div>
                  <div className="text-xl font-bold">{formatTime(session.duration_seconds)}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-50 dark:border-slate-800 flex justify-end">
                <button className="text-xs font-bold text-accent flex items-center">
                  詳細を見る <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
