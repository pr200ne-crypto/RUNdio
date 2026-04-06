const DEFAULT_MILESTONES_KM = [3, 6, 9];

/**
 * NotebookLM 等の mp3 を差し替える前提のプレースホルダ。
 * ファイルが無い・読み込み失敗時は短いビープ（Web Audio）にフォールバック。
 */
export function createDistanceAudioCuePlayer(options?: {
  milestonesKm?: number[];
  src?: string;
}) {
  const milestonesKm = options?.milestonesKm ?? DEFAULT_MILESTONES_KM;
  const src = options?.src ?? "/audio/placeholder.mp3";
  const played = new Set<number>();
  let audioEl: HTMLAudioElement | null = null;
  let ctx: AudioContext | null = null;

  function beep() {
    try {
      if (!ctx) ctx = new AudioContext();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.frequency.value = 880;
      g.gain.value = 0.08;
      o.start();
      setTimeout(() => o.stop(), 120);
    } catch {
      /* ignore */
    }
  }

  function playFile() {
    if (!audioEl) {
      audioEl = new Audio(src);
      audioEl.preload = "auto";
    }
    audioEl.currentTime = 0;
    void audioEl.play().catch(() => {
      beep();
    });
  }

  return {
    /** 累積距離（m）が更新されたときに呼ぶ。閾値 km を跨いだら一度だけ再生 */
    onDistanceM(distanceM: number) {
      const km = distanceM / 1000;
      for (const m of milestonesKm) {
        if (km >= m && !played.has(m)) {
          played.add(m);
          playFile();
        }
      }
    },
    reset() {
      played.clear();
    },
  };
}
