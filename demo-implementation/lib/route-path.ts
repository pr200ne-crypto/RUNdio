/** [lat, lng] polyline helpers for run / map UI */

export type LatLngTuple = [number, number]

function haversineKm(a: LatLngTuple, b: LatLngTuple): number {
  const R = 6371
  const dLat = ((b[0] - a[0]) * Math.PI) / 180
  const dLng = ((b[1] - a[1]) * Math.PI) / 180
  const lat1 = (a[0] * Math.PI) / 180
  const lat2 = (b[0] * Math.PI) / 180
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)))
}

function interpolate(a: LatLngTuple, b: LatLngTuple, t: number): LatLngTuple {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
}

/** `t` in [0,1] measured along cumulative geodesic length of the path */
export function pointAlongRoute(coords: LatLngTuple[], t: number): LatLngTuple | null {
  if (coords.length === 0) return null
  if (coords.length === 1) return coords[0]
  const clamped = Math.max(0, Math.min(1, t))
  let total = 0
  const segLens: number[] = []
  for (let i = 0; i < coords.length - 1; i++) {
    const d = haversineKm(coords[i], coords[i + 1])
    segLens.push(d)
    total += d
  }
  if (total <= 0) return coords[0]
  let target = clamped * total
  for (let i = 0; i < segLens.length; i++) {
    const len = segLens[i]
    if (target <= len || i === segLens.length - 1) {
      const segT = len <= 0 ? 0 : Math.min(1, target / len)
      return interpolate(coords[i], coords[i + 1], segT)
    }
    target -= len
  }
  return coords[coords.length - 1]
}
