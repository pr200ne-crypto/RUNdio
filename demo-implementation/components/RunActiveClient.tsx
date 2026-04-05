"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { milestoneLabelAtKm } from "@/lib/demo-audio";

const AUDIO_URL = "/audio/rundio-companion.mp3";
const TARGET_KM = 10;
const DEMO_DURATION_SEC = 180;

function formatTime(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function RunActiveClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeId = searchParams.get("routeId");

  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [audioStatus, setAudioStatus] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const distanceKm = started
    ? Math.min(TARGET_KM, (elapsedSec / DEMO_DURATION_SEC) * TARGET_KM)
    : 0;

  const reachedGoal = started && distanceKm >= TARGET_KM - 1e-6;
  const segmentLabel = started ? milestoneLabelAtKm(distanceKm) : null;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimer();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [clearTimer]);

  useEffect(() => {
    if (!started || paused || reachedGoal) {
      clearTimer();
      return;
    }
    intervalRef.current = setInterval(() => {
      setElapsedSec((s) => {
        if (s + 1 >= DEMO_DURATION_SEC) {
          clearTimer();
          return DEMO_DURATION_SEC;
        }
        return s + 1;
      });
    }, 1000);
    return clearTimer;
  }, [started, paused, reachedGoal, clearTimer]);

  const handleStart = () => {
    setStarted(true);
    setPaused(false);
    setElapsedSec(0);
    setAudioStatus("読み込み中...");

    try {
      const a = new Audio(AUDIO_URL);
      a.volume = 1.0;
      audioRef.current = a;

      a.addEventListener("canplaythrough", () => {
        setAudioStatus("再生中");
      });
      a.addEventListener("error", (e) => {
        setAudioStatus("音声読み込みエラー: " + (a.error?.message || "不明"));
      });
      a.addEventListener("ended", () => {
        setAudioStatus("再生完了");
      });

      a.play()
        .then(() => {
          setAudioStatus("再生中");
        })
        .catch((e) => {
          setAudioStatus("再生エラー: " + e.message);
        });
    } catch (e: any) {
      setAudioStatus("Audio生成エラー: " + e.message);
    }
  };

  const handlePauseToggle = () => {
    const a = audioRef.current;
    if (paused) {
      setPaused(false);
      if (a) {
        a.play().catch(() => {});
        setAudioStatus("再生中");
      }
    } else {
      setPaused(true);
      if (a) {
        a.pause();
        setAudioStatus("一時停止");
      }
    }
  };

  const handleComplete = () => {
    clearTimer();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    router.push("/run/complete");
  };

  return (
    <main className="flex flex-col min-h-screen bg-slate-900 text-white">
      <div className="flex-1 flex flex-col justify-center items-center text-center px-6 space-y-10">
        {audioStatus && (
          <div className="px-4 py-2 rounded-full bg-white/10 text-xs font-bold text-slate-300">
            {audioStatus}
          </div>
        )}

        <div className="space-y-3">
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">経過時間</div>
          <div className="text-7xl font-mono font-black tracking-tighter tabular-nums text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            {formatTime(elapsedSec)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 w-full max-w-xs mx-auto">
          <div className="flex flex-col items-center">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">距離</div>
            <div className="text-4xl font-black tabular-nums text-green-400">
              {distanceKm.toFixed(2)}
              <span className="text-lg font-bold text-green-400/70 ml-1">km</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">目標</div>
            <div className="text-4xl font-black tabular-nums text-blue-400">
              {TARGET_KM}
              <span className="text-lg font-bold text-blue-400/70 ml-1">km</span>
            </div>
          </div>
        </div>

        {segmentLabel && (
          <div className="w-full max-w-xs mx-auto bg-white/10 backdrop-blur-md p-4 rounded-2xl flex items-center justify-center gap-3 border border-white/20">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
            <div className="font-bold text-sm text-slate-200">
              現在: {segmentLabel}
            </div>
          </div>
        )}
      </div>

      <div className="py-12 flex flex-col items-center gap-6 px-6">
        {!started ? (
          <button
            type="button"
            onClick={handleStart}
            className="w-full max-w-xs py-5 bg-green-500 text-slate-900 rounded-full font-black text-lg shadow-[0_0_30px_rgba(74,222,128,0.3)] hover:bg-green-400 transition-all active:scale-95"
          >
            スタート（伴走音声を再生）
          </button>
        ) : (
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={handlePauseToggle}
              className="w-20 h-20 flex items-center justify-center rounded-full bg-slate-800 text-white border-2 border-slate-700 hover:bg-slate-700 transition-all active:scale-95"
            >
              {paused ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M5 3l14 9-14 9V3z"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              )}
            </button>
            <button
              type="button"
              onClick={handleComplete}
              className="w-20 h-20 flex items-center justify-center rounded-full bg-red-500/20 text-red-500 border-2 border-red-500/50 hover:bg-red-500 hover:text-white transition-all active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"/></svg>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
