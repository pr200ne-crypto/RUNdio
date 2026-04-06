/** 概算のルート長（m）— デモ用に折れ線の区間を足し合わせる */
export function polylineLengthMeters(
  points: [number, number][],
): number {
  if (points.length < 2) return 0;
  let m = 0;
  for (let i = 1; i < points.length; i++) {
    m += haversineM(points[i - 1], points[i]);
  }
  return m;
}

function haversineM(a: [number, number], b: [number, number]): number {
  const R = 6371000;
  const φ1 = (a[0] * Math.PI) / 180;
  const φ2 = (b[0] * Math.PI) / 180;
  const Δφ = ((b[0] - a[0]) * Math.PI) / 180;
  const Δλ = ((b[1] - a[1]) * Math.PI) / 180;
  const s =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  return R * c;
}
