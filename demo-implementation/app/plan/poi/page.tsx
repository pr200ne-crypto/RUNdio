"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, MapPin, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

import "leaflet/dist/leaflet.css";

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

  const selectedPoi = pois.find((p) => p.id === selectedPoiId);

  return (
    <main className="flex flex-col h-screen max-w-md mx-auto bg-background overflow-hidden">
      <header className="p-4 flex items-center border-b bg-white dark:bg-slate-900">
        <Link href={`/plan/route?routeId=${routeId}`} className="p-2 -ml-2">
          <ChevronLeft />
        </Link>
        <h1 className="flex-1 text-center font-bold">チェックポイント</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 relative">
        {typeof window !== "undefined" && (
          <MapContainer
            center={[35.672, 139.696]}
            zoom={15}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {route && (
              <Polyline
                positions={route.coordinates}
                color="#F97316"
                weight={6}
                opacity={0.5}
              />
            )}
            {pois.map((poi) => (
              <Marker
                key={poi.id}
                position={[poi.lat, poi.lng]}
                eventHandlers={{
                  click: () => setSelectedPoiId(poi.id),
                }}
              />
            ))}
          </MapContainer>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border-t shadow-2xl">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
            付近の入浴施設
          </h2>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {pois.map((poi) => (
              <button
                key={poi.id}
                onClick={() => setSelectedPoiId(poi.id)}
                className={cn(
                  "w-full flex items-center p-3 rounded-xl border-2 text-left transition-all",
                  selectedPoiId === poi.id
                    ? "border-accent bg-accent/5 ring-1 ring-accent"
                    : "border-slate-100 dark:border-slate-800"
                )}
              >
                <div className="flex-1">
                  <div className="font-bold">{poi.name}</div>
                  <div className="text-xs text-muted-foreground">
                    ルートから {poi.distanceFromRoute}m
                  </div>
                </div>
                {selectedPoiId === poi.id && (
                  <Check className="text-accent" size={20} />
                )}
              </button>
            ))}
          </div>
        </div>

        <Link
          href={
            selectedPoiId
              ? `/plan/confirm?routeId=${routeId}&poiId=${selectedPoiId}`
              : "#"
          }
          className={cn(
            "flex items-center justify-center w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold transition-all active:scale-95",
            !selectedPoiId && "opacity-50 pointer-events-none"
          )}
        >
          次へ：計画を確定
          <ChevronRight size={20} className="ml-1" />
        </Link>
      </div>
    </main>
  );
}

export default function PlanPoiPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlanPoiContent />
    </Suspense>
  );
}
