"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

// Leaflet is client-side only
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

import "leaflet/dist/leaflet.css";

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
    <main className="flex flex-col h-screen max-w-md mx-auto bg-background overflow-hidden">
      <header className="p-4 flex items-center border-b bg-white dark:bg-slate-900">
        <Link href="/home" className="p-2 -ml-2">
          <ChevronLeft />
        </Link>
        <h1 className="flex-1 text-center font-bold">ルートを選択</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 relative">
        {typeof window !== "undefined" && (
          <MapContainer
            center={[35.671, 139.695]}
            zoom={14}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {selectedRoute && (
              <Polyline
                positions={selectedRoute.coordinates}
                color="#F97316"
                weight={6}
                opacity={0.8}
              />
            )}
          </MapContainer>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border-t shadow-2xl">
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {routes.map((route) => (
            <button
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              className={cn(
                "flex-shrink-0 w-48 p-4 rounded-2xl border-2 text-left transition-all",
                selectedRouteId === route.id
                  ? "border-accent bg-accent/5 ring-1 ring-accent"
                  : "border-slate-100 dark:border-slate-800"
              )}
            >
              <div className="font-bold truncate">{route.name}</div>
              <div className="text-sm text-muted-foreground">
                {(route.distance / 1000).toFixed(1)} km
              </div>
            </button>
          ))}
        </div>

        <Link
          href={selectedRouteId ? `/plan/poi?routeId=${selectedRouteId}` : "#"}
          className={cn(
            "flex items-center justify-center w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold transition-all active:scale-95",
            !selectedRouteId && "opacity-50 pointer-events-none"
          )}
        >
          次へ：チェックポイント選定
          <ChevronRight size={20} className="ml-1" />
        </Link>
      </div>
    </main>
  );
}
