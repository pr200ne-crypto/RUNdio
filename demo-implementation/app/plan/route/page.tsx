"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Map as MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import GoogleMapCanvas from "@/components/GoogleMapCanvas";

interface Route {
  id: string;
  name: string;
  distance: number;
  coordinates: [number, number][];
}

export default function PlanRoutePage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/routes.json")
      .then((res) => res.json())
      .then((data) => {
        setRoutes(data);
        if (data.length > 0) setSelectedRouteId(data[0].id);
      });
  }, []);

  const selectedRoute = routes.find((r) => r.id === selectedRouteId);

  return (
    <main className="flex flex-col h-full bg-slate-50 overflow-hidden text-slate-800">
      <header className="p-4 flex items-center bg-white border-b border-slate-100 z-10 shadow-sm">
        <Link href="/home" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-500 transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="flex-1 text-center font-black text-lg tracking-tight">ルートを選択</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 relative">
        <GoogleMapCanvas
          className="h-full w-full"
          defaultCenter={selectedRoute?.coordinates[0] ?? [35.671, 139.695]}
          defaultZoom={14}
          routeCoordinates={selectedRoute?.coordinates ?? []}
        />
        
        {/* Gradient overlay at the bottom of the map to blend with the panel */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      <div className="p-6 bg-white rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] relative z-20">
        <div className="flex items-center gap-2 mb-4">
          <MapIcon size={18} className="text-blue-600" />
          <h2 className="font-bold text-slate-900">おすすめルート</h2>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-6 -mx-6 px-6 no-scrollbar snap-x">
          {routes.map((route) => (
            <button
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              className={cn(
                "snap-center flex-shrink-0 w-64 p-5 rounded-3xl border-2 text-left transition-all duration-200",
                selectedRouteId === route.id
                  ? "border-blue-600 bg-blue-50/50 shadow-md shadow-blue-600/10"
                  : "border-slate-100 bg-white hover:border-blue-200"
              )}
            >
              <div className={cn(
                "font-black text-lg mb-1 truncate transition-colors",
                selectedRouteId === route.id ? "text-blue-700" : "text-slate-800"
              )}>
                {route.name}
              </div>
              <div className={cn(
                "text-sm font-bold flex items-center gap-1",
                selectedRouteId === route.id ? "text-blue-500" : "text-slate-400"
              )}>
                <span className="text-xl">{(route.distance / 1000).toFixed(1)}</span> km
              </div>
            </button>
          ))}
        </div>

        <Link
          href={selectedRouteId ? `/plan/poi?routeId=${selectedRouteId}` : "#"}
          className={cn(
            "flex items-center justify-center w-full py-4 bg-blue-600 text-white rounded-full font-bold text-lg transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20",
            !selectedRouteId && "opacity-50 pointer-events-none bg-slate-300 shadow-none"
          )}
        >
          次へ：チェックポイント選定
          <ChevronRight size={20} className="ml-1" />
        </Link>
      </div>
    </main>
  );
}
