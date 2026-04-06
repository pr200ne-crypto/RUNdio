"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Check, MapPin, Loader2 } from "lucide-react";
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
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [placesError, setPlacesError] = useState<string | null>(null);

  // ルート情報の取得
  useEffect(() => {
    if (routeId) {
      fetch("/data/routes.json")
        .then((res) => res.json())
        .then((data: unknown) => {
          const list = data as Route[];
          const found = list.find((r) => r.id === routeId);
          if (found) setRoute(found);
        });
    }
  }, [routeId]);

  // Google Places API を使って周辺のPOI（銭湯・スパ）を検索
  const searchNearbyPlaces = useCallback(async () => {
    if (!route || !route.coordinates || route.coordinates.length === 0) return;
    if (typeof window === 'undefined' || !window.google) return;

    setLoadingPlaces(true);
    setPlacesError(null);

    try {
      // ルートの中間地点を検索の中心にする
      const midPoint = route.coordinates[Math.floor(route.coordinates.length / 2)];
      const center = new window.google.maps.LatLng(midPoint[0], midPoint[1]);

      // ダミーの地図要素（PlacesServiceの仕様上必要）
      const mapElement = document.createElement('div');
      const map = new window.google.maps.Map(mapElement, { center, zoom: 15 });
      const service = new window.google.maps.places.PlacesService(map);

      const request = {
        location: center,
        radius: 3000, // 3km圏内
        keyword: '銭湯 OR スパ OR 温泉', // ランナー向けの施設
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const fetchedPois: POI[] = results.slice(0, 10).map((place) => {
            // ルート（中間地点）からの直線距離を計算（簡易的）
            const placeLat = place.geometry?.location?.lat() || 0;
            const placeLng = place.geometry?.location?.lng() || 0;
            const dist = window.google.maps.geometry.spherical.computeDistanceBetween(
              center,
              new window.google.maps.LatLng(placeLat, placeLng)
            );

            return {
              id: place.place_id || Math.random().toString(),
              name: place.name || '名称不明',
              category: 'bath',
              lat: placeLat,
              lng: placeLng,
              description: place.vicinity || '住所不明',
              distanceFromRoute: Math.round(dist),
            };
          });

          // 距離順にソート
          fetchedPois.sort((a, b) => a.distanceFromRoute - b.distanceFromRoute);
          setPois(fetchedPois);
        } else {
          setPlacesError("周辺の施設が見つかりませんでした。");
          // フォールバックとしてローカルデータを読み込む
          loadFallbackData();
        }
        setLoadingPlaces(false);
      });
    } catch (err) {
      console.error("Places API error:", err);
      setPlacesError("施設の検索中にエラーが発生しました。");
      loadFallbackData();
      setLoadingPlaces(false);
    }
  }, [route]);

  const loadFallbackData = () => {
    fetch("/data/pois.json")
      .then((res) => res.json())
      .then((data) => setPois(data));
  };

  // Google Maps APIのロードを待ってから検索を実行
  useEffect(() => {
    if (route) {
      // 少し遅延を入れてGoogle Maps APIのロードを待つ
      const timer = setTimeout(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
          searchNearbyPlaces();
        } else {
          // Places APIが使えない環境（APIキー制限など）の場合はフォールバック
          loadFallbackData();
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [route, searchNearbyPlaces]);

  return (
      <main className="flex flex-col flex-1 bg-slate-50 overflow-hidden text-slate-800" style={{ minHeight: 0 }}>
      <header className="p-4 flex items-center bg-white border-b border-slate-100 z-10 shadow-sm">
        <Link href={`/plan/route?routeId=${routeId}`} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-500 transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="flex-1 text-center font-black text-lg tracking-tight">立ち寄り先</h1>
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
          defaultZoom={14}
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
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-blue-600" />
            <h2 className="font-bold text-slate-900">付近の入浴施設</h2>
          </div>
          {loadingPlaces && (
            <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
              <Loader2 size={12} className="animate-spin" />
              検索中...
            </div>
          )}
        </div>
        
        {placesError && pois.length === 0 && !loadingPlaces ? (
          <div className="flex-1 flex items-center justify-center text-sm text-slate-500 font-medium pb-6">
            {placesError}
          </div>
        ) : (
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
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "font-black text-base mb-1 truncate",
                    selectedPoiId === poi.id ? "text-blue-700" : "text-slate-800"
                  )}>
                    {poi.name}
                  </div>
                  <div className={cn(
                    "text-xs font-bold truncate",
                    selectedPoiId === poi.id ? "text-blue-500" : "text-slate-400"
                  )}>
                    {poi.description} (ルートから約 {poi.distanceFromRoute}m)
                  </div>
                </div>
                <div className={cn(
                  "w-6 h-6 ml-3 shrink-0 rounded-full flex items-center justify-center transition-colors",
                  selectedPoiId === poi.id ? "bg-blue-600 text-white" : "bg-slate-100 text-transparent"
                )}>
                  <Check size={14} strokeWidth={3} />
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="pt-2 shrink-0">
          <Link
            href={
              selectedPoiId
                ? `/plan/confirm?routeId=${routeId}&poiId=${selectedPoiId}&poiName=${encodeURIComponent(pois.find(p => p.id === selectedPoiId)?.name || '')}`
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
