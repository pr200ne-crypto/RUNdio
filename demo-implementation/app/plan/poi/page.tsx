"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Check, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import GoogleMapCanvas from "@/components/GoogleMapCanvas";

interface POI {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  description: string;
  distanceFromRoute: number;
}

interface Route {
  id: string;
  name: string;
  distance: number;
  coordinates: [number, number][];
}

function PlanPoiContent() {
  const searchParams = useSearchParams();
  const routeId = searchParams.get("routeId");

  const [pois, setPois] = useState<POI[]>([]);
  const [selectedPoiId, setSelectedPoiId] = useState<string | null>(null);
  const [route, setRoute] = useState<Route | null>(null);

  useEffect(() => {
    fetch("/data/pois.json")
      .then((res) => res.json())
      .then((data) => setPois(data));

    if (routeId) {
      fetch("/data/routes.json")
        .then((res) => res.json())
        .then((data) => {
          const found = data.find((r: any) => r.id === routeId);
          if (found) setRoute(found);
        });
    }
  }, [routeId]);

  return (
    <main className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 overflow-hidden text-slate-800">
      <header className="p-4 flex items-center bg-white border-b border-slate-100 z-10 shadow-sm">
        <Link href={`/plan/route?routeId=${routeId}`} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-500 transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="flex-1 text-center font-black text-lg tracking-tight">チェックポイント</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 relative">
        <GoogleMapCanvas
          className="h-full w-full"
          defaultCenter={
            selectedPoiId
              ? [pois.find((poi) => poi.id === selectedPoiId)?.lat ?? 35.672, pois.find((poi) => poi.id === selectedPoiId)?.lng ?? 139.696]
              : route?.coordinates[0] ?? [35.672, 139.696]
          }
          defaultZoom={15}
          routeCoordinates={route?.coordinates ?? []}
          markers={pois.map((poi) => ({
            id: poi.id,
            position: [poi.lat, poi.lng] as [number, number],
            title: poi.name,
            selected: selectedPoiId === poi.id,
            onClick: () => setSelectedPoiId(poi.id),
          }))}
        />
        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      <div className="p-6 bg-white rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] relative z-20 flex flex-col max-h-[50vh]">
        <div className="flex items-center gap-2 mb-4 shrink-0">
          <MapPin size={18} className="text-blue-600" />
          <h2 className="font-bold text-slate-900">付近の入浴施設</h2>
        </div>
        
        <div className="space-y-3 overflow-y-auto pb-6 pr-2 custom-scrollbar flex-1">
          {pois.map((poi) => (
            <button
              key={poi.id}
              onClick={() => setSelectedPoiId(poi.id)}
              className={cn(
                "w-full flex items-center p-4 rounded-2xl border-2 text-left transition-all duration-200",
                selectedPoiId === poi.id
                  ? "border-blue-600 bg-blue-50/50 shadow-md shadow-blue-600/10"
                  : "border-slate-100 bg-white hover:border-blue-200"
              )}
            >
              <div className="flex-1">
                <div className={cn(
                  "font-black text-base mb-1",
                  selectedPoiId === poi.id ? "text-blue-700" : "text-slate-800"
                )}>
                  {poi.name}
                </div>
                <div className={cn(
                  "text-xs font-bold",
                  selectedPoiId === poi.id ? "text-blue-500" : "text-slate-400"
                )}>
                  ルートから {poi.distanceFromRoute}m
                </div>
              </div>
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                selectedPoiId === poi.id ? "bg-blue-600 text-white" : "bg-slate-100 text-transparent"
              )}>
                <Check size={14} strokeWidth={3} />
              </div>
            </button>
          ))}
        </div>

        <div className="pt-2 shrink-0">
          <Link
            href={
              selectedPoiId
                ? `/plan/confirm?routeId=${routeId}&poiId=${selectedPoiId}`
                : "#"
            }
            className={cn(
              "flex items-center justify-center w-full py-4 bg-blue-600 text-white rounded-full font-bold text-lg transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20",
              !selectedPoiId && "opacity-50 pointer-events-none bg-slate-300 shadow-none"
            )}
          >
            次へ：計画を確定
            <ChevronRight size={20} className="ml-1" />
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function PlanPoiPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400 font-bold">読み込み中...</div>}>
      <PlanPoiContent />
    </Suspense>
  );
}
