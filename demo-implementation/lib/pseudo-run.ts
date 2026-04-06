export type PseudoRunOptions = {
  /** ルート全長（m） */
  routeLengthM: number;
  /** 擬似ペース（秒/km） */
  paceSecPerKm: number;
  onTick: (state: PseudoRunTick) => void;
};

export type PseudoRunTick = {
  distanceM: number;
  elapsedMs: number;
  paceSecPerKm: number;
  paused: boolean;
  finished: boolean;
};

/**
 * requestAnimationFrame で距離・経過時間を進める（GPS なしデモ用）
 */
export function createPseudoRunSession(opts: PseudoRunOptions) {
  const { routeLengthM, paceSecPerKm, onTick } = opts;
  let distanceM = 0;
  let elapsedMs = 0;
  let paused = false;
  let raf = 0 as number | undefined;
  let lastTs = 0;

  const speedMps = 1000 / paceSecPerKm;

  const tick = (ts: number) => {
    if (paused) {
      lastTs = ts;
      raf = requestAnimationFrame(tick);
      return;
    }
    if (!lastTs) lastTs = ts;
    const dt = ts - lastTs;
    lastTs = ts;
    elapsedMs += dt;
    distanceM = Math.min(routeLengthM, distanceM + (speedMps * dt) / 1000);

    const finished = distanceM >= routeLengthM - 0.01;
    onTick({
      distanceM,
      elapsedMs,
      paceSecPerKm,
      paused,
      finished,
    });

    if (!finished) {
      raf = requestAnimationFrame(tick);
    }
  };

  return {
    start() {
      lastTs = 0;
      raf = requestAnimationFrame(tick);
    },
    stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = undefined;
    },
    setPaused(p: boolean) {
      paused = p;
    },
    reset() {
      distanceM = 0;
      elapsedMs = 0;
      paused = false;
      lastTs = 0;
    },
  };
}

export function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export function formatPace(secPerKm: number): string {
  const m = Math.floor(secPerKm / 60);
  const s = Math.floor(secPerKm % 60);
  return `${m}'${String(s).padStart(2, "0")}"/km`;
}
