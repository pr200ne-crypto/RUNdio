"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, Play, MapPin, Clock, Ruler, Settings2 } from "lucide-react";

function PlanConfirmContent() {
  const searchParams = useSearchParams();
  const routeId = searchParams.get("routeId");
  const poiId = searchParams.get("poiId");
  const poiName = searchParams.get("poiName");

  const [route, setRoute] = useState<any>(null);
  const [poi, setPoi] = useState<any>(null);

  useEffect(() => {
    if (routeId) {
      fetch("/data/routes.json")
        .then((res) => res.json())
        .then((data) => setRoute(data.find((r: any) => r.id === routeId)));
    }
    if (poiId) {
      // APIから取得したPOIの場合はURLパラメータから名前を取得して仮のPOIオブジェクトを作成
      if (poiName) {
        setPoi({
          id: poiId,
          name: decodeURIComponent(poiName),
          description: "Google Places API から取得した施設"
        });
      } else {
        // フォールバック: ローカルデータから検索
        fetch("/data/pois.json")
          .then((res) => res.json())
          .then((data) => setPoi(data.find((p: any) => p.id === poiId)));
      }
    }
  }, [routeId, poiId, poiName]);

  if (!route || !poi) return <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold bg-slate-50">読み込み中...</div>;

  return (
    <main className="flex flex-col min-h-screen max-w-md mx-auto bg-slate-50 text-slate-800 pb-24">
      <header className="p-4 flex items-center bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <Link href={`/plan/poi?routeId=${routeId}`} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-500 transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="flex-1 text-center font-black text-lg tracking-tight">計画の確認</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 p-6 space-y-6">
        {/* Route Summary */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Ruler size={16} />
            </div>
            <h2 className="text-sm font-bold text-slate-500">コース</h2>
          </div>
          <div className="text-2xl font-black text-slate-900 mb-1">{route.name}</div>
          <div className="text-blue-600 font-bold text-lg">{(route.distance / 1000).toFixed(1)} <span className="text-sm">km</span></div>
        </section>

        {/* POI Summary */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <MapPin size={16} />
            </div>
            <h2 className="text-sm font-bold text-slate-500">チェックポイント</h2>
          </div>
          <div className="text-xl font-black text-slate-900 mb-2">{poi.name}</div>
          <div className="text-sm font-medium text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-2xl">
            {poi.description}
          </div>
        </section>

        {/* Settings Summary */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Settings2 size={16} />
            </div>
            <h2 className="text-sm font-bold text-slate-500">番組設定</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-50">
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <Clock size={18} className="text-slate-400" />
                <span>通知間隔</span>
              </div>
              <span className="text-sm font-bold bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full">1.0 km ごと</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <Play size={18} className="text-slate-400" />
                <span>音声モード</span>
              </div>
              <span className="text-sm font-bold bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full">標準（ラジオ風）</span>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent z-20">
        <div className="max-w-md mx-auto">
          <Link
            href={`/run?routeId=${routeId}&poiId=${poiId}&poiName=${encodeURIComponent(poi.name)}`}
            className="flex items-center justify-center w-full py-5 bg-blue-600 text-white rounded-full font-black text-xl shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] hover:bg-blue-700"
          >
            <Play size={24} fill="currentColor" className="mr-2" />
            番組をスタート！
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function PlanConfirmPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400 font-bold bg-slate-50">読み込み中...</div>}>
      <PlanConfirmContent />
    </Suspense>
  );
}
