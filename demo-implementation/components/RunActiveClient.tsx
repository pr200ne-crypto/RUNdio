"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEMO_AUDIO_PATH,
  milestoneLabelAtKm,
} from "@/lib/demo-audio";
import GoogleMapCanvas from "@/components/GoogleMapCanvas";

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

  const [route, setRoute] = useState<any>(null);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (routeId) {
      fetch("/data/routes.json")
        .then((res) => res.json())
        .then((data) => setRoute(data.find((r: any) => r.id === routeId)));
    }
  }, [routeId]);

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
      audioRef.current?.pause();
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

    const a = audioRef.current;
    if (a) {
      a.currentTime = 0;
      a.volume = 1.0;
      const p = a.play();
      if (p) {
        p.then(() => {
          console.log("Audio playback started successfully");
        }).catch((e) => {
          console.error("Audio play error:", e);
        });
      }
    }
  };

  const handlePauseToggle = () => {
    const a = audioRef.current;
    if (paused) {
      setPaused(false);
      if (a) a.play().catch(() => {});
    } else {
      setPaused(true);
      if (a) a.pause();
    }
  };

  const handleComplete = () => {
    clearTimer();
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.currentTime = 0;
    }
    router.push("/run/complete");
  };

  return (
    <main className="flex flex-col h-full bg-slate-900 text-white overflow-hidden relative">
      <audio ref={audioRef} src={DEMO_AUDIO_PATH} preload="auto" />

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40 z-10 pointer-events-none" />
        <GoogleMapCanvas
          className="h-full w-full opacity-60"
          defaultCenter={route?.coordinates[0] ?? [35.671, 139.695]}
          defaultZoom={14}
          routeCoordinates={route?.coordinates ?? []}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-6 space-y-12">
        <div className="space-y-3">
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">経過時間</div>
          <div className="text-7xl font-mono font-black tracking-tighter tabular-nums text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            {formatTime(elapsedSec)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 w-full max-w-xs mx-auto">
          <div className="flex flex-col items-center">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">距離</div>
            <div className="text-4xl font-black tabular-nums text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]">
              {distanceKm.toFixed(2)}
              <span className="text-lg font-bold text-green-400/70 ml-1">km</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">目標</div>
            <div className="text-4xl font-black tabular-nums text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.3)]">
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

      <div className="relative z-10 py-12 flex flex-col items-center gap-6 px-6">
        {!started ? (
          <button
            type="button"
            onClick={handleStart}
            className="w-full max-w-xs py-4 bg-green-500 text-slate-900 rounded-full font-black text-lg shadow-[0_0_30px_rgba(74,222,128,0.3)] hover:bg-green-400 transition-all active:scale-95"
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
