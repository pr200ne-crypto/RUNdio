"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import type { MapPoi } from "@/lib/map-types";

export type { MapPoi };

type Props = {
  route: [number, number][];
  pois?: MapPoi[];
  className?: string;
  /** 地図の高さ（px） */
  heightPx?: number;
};

export function RunMap({
  route,
  pois = [],
  className = "",
  heightPx = 280,
}: Props) {
  useEffect(() => {
    const proto = L.Icon.Default.prototype as unknown as {
      _getIconUrl?: string;
    };
    delete proto._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
  }, []);

  const center = route[Math.floor(route.length / 2)] ?? [35.69, 139.7];

  return (
    <div
      className={`relative z-0 w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 ${className}`}
      style={{ height: heightPx }}
    >
      <MapContainer
        center={center}
        className="h-full w-full"
        scrollWheelZoom
        zoom={14}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline
          color="#F97316"
          positions={route}
          weight={5}
        />
        {pois.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]}>
            <Popup>
              <span className="font-medium">{p.name}</span>
              {p.distanceFromRouteM != null ? (
                <span className="block text-xs text-slate-600">
                  ルートから約 {p.distanceFromRouteM}m
                </span>
              ) : null}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
