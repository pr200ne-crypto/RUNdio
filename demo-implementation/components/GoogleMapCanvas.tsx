"use client"

import { useEffect, useMemo, useState } from 'react'
import { GoogleMap, MarkerF, PolylineF, useJsApiLoader } from '@react-google-maps/api'

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

function toLatLngLiteral([lat, lng]: LatLngTuple) {
  return { lat, lng }
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
  const [map, setMap] = useState<any>(null)
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
  const routePath = useMemo(() => routeCoordinates.map(toLatLngLiteral), [routeCoordinates])
  const markerPoints = useMemo(
    () =>
      markers.map((marker) => ({
        ...marker,
        latLng: toLatLngLiteral(marker.position),
      })),
    [markers]
  )

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: ['places', 'geometry'], // Places API と Geometry ライブラリを追加
  })

  useEffect(() => {
    if (!map || !isLoaded || typeof window === 'undefined' || !window.google) return

    const points = [...routePath, ...markerPoints.map((marker) => marker.latLng)]
    if (points.length === 0) {
      map.setCenter(toLatLngLiteral(defaultCenter))
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
    map.fitBounds(bounds, 56)
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
      center={toLatLngLiteral(defaultCenter)}
      zoom={defaultZoom}
      onLoad={(loadedMap) => setMap(loadedMap)}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        clickableIcons: false,
        gestureHandling: 'greedy',
      }}
    >
      {routePath.length > 0 && (
        <PolylineF
          path={routePath}
          options={{
            strokeColor: '#2563eb',
            strokeOpacity: 0.9,
            strokeWeight: 6,
          }}
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
