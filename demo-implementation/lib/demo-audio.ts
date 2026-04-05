/**
 * 伴走ラジオ（ElevenLabs 生成の単一 MP3）。
 * ファイル名を変えたらここと public/audio/ を揃える。
 */
export const DEMO_AUDIO_FILENAME = "rundio-companion.mp3" as const;

export const DEMO_AUDIO_PATH = `/audio/${DEMO_AUDIO_FILENAME}` as const;

export type DemoAudioMilestone = {
  km: number;
  label: string;
  /** 将来クリップ分割時は各マイルストーンの src を差し替え */
  src: string;
};

/**
 * 現状は 1 本の連続トラックのため、再生は走行開始時に 1 回だけ開始する。
 * マイルストーンは UI 表示・将来の分割音声用。
 */
export const DEMO_AUDIO_MILESTONES: DemoAudioMilestone[] = [
  { km: 0, label: "オープニング〜スタート", src: DEMO_AUDIO_PATH },
  { km: 3, label: "3km 付近", src: DEMO_AUDIO_PATH },
  { km: 6, label: "6km 付近", src: DEMO_AUDIO_PATH },
  { km: 9, label: "チェックポイント接近", src: DEMO_AUDIO_PATH },
  { km: 10, label: "フィニッシュ", src: DEMO_AUDIO_PATH },
];

export function milestoneLabelAtKm(km: number): string | null {
  let best: DemoAudioMilestone | null = null;
  for (const m of DEMO_AUDIO_MILESTONES) {
    if (km + 1e-6 >= m.km && (!best || m.km > best.km)) best = m;
  }
  return best?.label ?? null;
}
