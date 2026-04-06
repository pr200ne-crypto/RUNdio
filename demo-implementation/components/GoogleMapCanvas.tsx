"use client"

import { useEffect, useMemo, useState } from 'react'
import { GoogleMap, MarkerF, PolylineF, useJsApiLoader } from '@react-google-maps/api'

const GOOGLE_MAPS_LIBRARIES: ("places" | "geometry")[] = ['places', 'geometry']

type LatLngTuple = [number, number]

type MapMarker = {
  id: string
  position: LatLngTuple
  title: string
  selected?: boolean
  onClick?: () => void
}

type GoogleMapCanvasProps = {
  className?: string
  defaultCenter: LatLngTuple
  defaultZoom?: number
  routeCoordinates?: LatLngTuple[]
  markers?: MapMarker[]
}

function isFiniteCoord(lat: unknown, lng: unknown): lat is number {
  return typeof lat === 'number' && typeof lng === 'number' && Number.isFinite(lat) && Number.isFinite(lng)
}

type LatLngLiteral = { lat: number; lng: number }

function toLatLngLiteral(tuple: LatLngTuple): LatLngLiteral | null {
  const [lat, lng] = tuple
  if (!isFiniteCoord(lat, lng)) return null
  return { lat, lng }
}

/** 無効な頂点を除いたパス（Polyline の setPath / 内部 MVCArray 破損を防ぐ） */
function sanitizePath(coords: LatLngTuple[] | undefined): LatLngLiteral[] {
  if (!coords?.length) return []
  const out: LatLngLiteral[] = []
  for (const t of coords) {
    const p = toLatLngLiteral(t)
    if (p) out.push(p)
  }
  return out
}

const TOKYO_DEFAULT: LatLngLiteral = { lat: 35.672, lng: 139.696 }

function literalOrDefault(tuple: LatLngTuple): LatLngLiteral {
  return toLatLngLiteral(tuple) ?? TOKYO_DEFAULT
}

function getMarkerIcon(selected?: boolean) {
  if (typeof window === 'undefined' || !window.google) return undefined

  return {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillColor: selected ? '#2563eb' : '#ffffff',
    fillOpacity: 1,
    strokeColor: '#2563eb',
    strokeOpacity: 1,
    strokeWeight: selected ? 3 : 2,
    scale: selected ? 9 : 7,
  }
}

export default function GoogleMapCanvas({
  className = 'h-full w-full',
  defaultCenter,
  defaultZoom = 14,
  routeCoordinates = [],
  markers = [],
}: GoogleMapCanvasProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
  const routePath = useMemo(() => sanitizePath(routeCoordinates), [routeCoordinates])
  const markerPoints = useMemo(
    () =>
      markers
        .map((marker) => {
          const latLng = toLatLngLiteral(marker.position)
          if (!latLng) return null
          return { ...marker, latLng }
        })
        .filter((m): m is MapMarker & { latLng: LatLngLiteral } => m !== null),
    [markers]
  )

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      clickableIcons: false,
      gestureHandling: 'greedy' as const,
    }),
    []
  )

  const polylineOptions = useMemo(
    () => ({
      strokeColor: '#2563eb',
      strokeOpacity: 0.9,
      strokeWeight: 6,
    }),
    []
  )

  const polylineKey = useMemo(
    () => routePath.map((p) => `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`).join('|'),
    [routePath]
  )

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: GOOGLE_MAPS_LIBRARIES,
  })

  useEffect(() => {
    if (!map || !isLoaded || typeof window === 'undefined' || !window.google) return

    const points = [...routePath, ...markerPoints.map((marker) => marker.latLng)]
    if (points.length === 0) {
      map.setCenter(literalOrDefault(defaultCenter))
      map.setZoom(defaultZoom)
      return
    }

    if (points.length === 1) {
      map.setCenter(points[0])
      map.setZoom(defaultZoom)
      return
    }

    const bounds = new window.google.maps.LatLngBounds()
    points.forEach((point) => bounds.extend(point))
    try {
      map.fitBounds(bounds, 56)
    } catch {
      map.setCenter(points[0])
      map.setZoom(defaultZoom)
    }
  }, [defaultCenter, defaultZoom, isLoaded, map, markerPoints, routePath])

  if (!apiKey) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-100 text-center text-sm text-slate-500`}>
        `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` を設定すると
        <br />
        Google Maps を表示できます。
      </div>
    )
  }

  if (loadError) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-100 text-center text-sm text-slate-500`}>
        Google Maps の読み込みに失敗しました。
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-100 text-sm text-slate-500`}>
        地図を読み込み中...
      </div>
    )
  }

  return (
    <GoogleMap
      mapContainerClassName={className}
      center={literalOrDefault(defaultCenter)}
      zoom={defaultZoom}
      onLoad={(loadedMap) => setMap(loadedMap)}
      options={mapOptions}
    >
      {routePath.length > 0 && (
        <PolylineF
          key={polylineKey}
          path={routePath}
          options={polylineOptions}
        />
      )}

      {markerPoints.map((marker) => (
        <MarkerF
          key={marker.id}
          position={marker.latLng}
          title={marker.title}
          onClick={marker.onClick}
          zIndex={marker.selected ? 100 : 1}
          icon={getMarkerIcon(marker.selected)}
        />
      ))}
    </GoogleMap>
  )
}
