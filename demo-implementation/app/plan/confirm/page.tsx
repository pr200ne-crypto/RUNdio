"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, Play, MapPin, Clock, Ruler } from "lucide-react";
import { cn } from "@/lib/utils";

function PlanConfirmContent() {
  const searchParams = useSearchParams();
  const routeId = searchParams.get("routeId");
  const poiId = searchParams.get("poiId");

  const [route, setRoute] = useState<any>(null);
  const [poi, setPoi] = useState<any>(null);

  useEffect(() => {
    if (routeId) {
      fetch("/data/routes.json")
        .then((res) => res.json())
        .then((data) => setRoute(data.find((r: any) => r.id === routeId)));
    }
    if (poiId) {
      fetch("/data/pois.json")
        .then((res) => res.json())
        .then((data) => setPoi(data.find((p: any) => p.id === poiId)));
    }
  }, [routeId, poiId]);

  if (!route || !poi) return <div className="p-8 text-center">読み込み中...</div>;

  return (
    <main className="flex flex-col min-h-screen max-w-md mx-auto bg-background p-4">
      <header className="py-4 flex items-center mb-6">
        <Link href={`/plan/poi?routeId=${routeId}`} className="p-2 -ml-2">
          <ChevronLeft />
        </Link>
        <h1 className="flex-1 text-center font-bold">計画の確認</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 space-y-6">
        <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center">
            <Ruler size={14} className="mr-1" /> コース
          </h2>
          <div className="text-xl font-bold mb-1">{route.name}</div>
          <div className="text-muted-foreground">{(route.distance / 1000).toFixed(1)} km</div>
        </section>

        <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center">
            <MapPin size={14} className="mr-1" /> チェックポイント
          </h2>
          <div className="text-xl font-bold mb-1">{poi.name}</div>
          <div className="text-sm text-muted-foreground">{poi.description}</div>
        </section>

        <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center">
            <Clock size={14} className="mr-1" /> 番組設定
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">通知間隔</span>
              <span className="text-sm font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">1.0 km ごと</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">音声モード</span>
              <span className="text-sm font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">標準（ラジオ風）</span>
            </div>
          </div>
        </section>
      </div>

      <div className="py-6">
        <Link
          href={`/run?routeId=${routeId}&poiId=${poiId}`}
          className="flex items-center justify-center w-full py-5 bg-accent text-accent-foreground rounded-2xl font-bold text-lg shadow-lg shadow-accent/20 transition-all active:scale-95"
        >
          <Play size={24} fill="currentColor" className="mr-2" />
          番組をスタート！
        </Link>
      </div>
    </main>
  );
}

export default function PlanConfirmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlanConfirmContent />
    </Suspense>
  );
}
