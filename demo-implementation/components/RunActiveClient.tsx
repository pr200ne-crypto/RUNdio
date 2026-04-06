"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import GoogleMapCanvas from "@/components/GoogleMapCanvas";
import { milestoneLabelAtKm } from "@/lib/demo-audio";
import { pointAlongRoute, type LatLngTuple } from "@/lib/route-path";

const AUDIO_URL = "/audio/rundio-companion.mp3";
const TARGET_KM = 10;
const DEMO_DURATION_SEC = 180;

function formatTime(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type JsonRoute = {
  id: string;
  name: string;
  coordinates: LatLngTuple[];
};

export default function RunActiveClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeId = searchParams.get("routeId");

  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [audioStatus, setAudioStatus] = useState("");
  const [routeCoords, setRouteCoords] = useState<LatLngTuple[]>([]);
  const [routeName, setRouteName] = useState<string | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!routeId) {
      setRouteCoords([]);
      setRouteName(null);
      return;
    }
    setRouteLoading(true);
    fetch("/data/routes.json")
      .then((res) => res.json())
      .then((data: JsonRoute[]) => {
        const found = data.find((r) => r.id === routeId);
        setRouteCoords(found?.coordinates ?? []);
        setRouteName(found?.name ?? null);
      })
      .catch(() => {
        setRouteCoords([]);
        setRouteName(null);
      })
      .finally(() => setRouteLoading(false));
  }, [routeId]);

  const distanceKm = started
    ? Math.min(TARGET_KM, (elapsedSec / DEMO_DURATION_SEC) * TARGET_KM)
    : 0;

  const progressAlongRoute = started
    ? Math.min(1, distanceKm / TARGET_KM)
    : 0;

  const runnerPosition = useMemo(() => {
    if (routeCoords.length === 0) return null;
    return pointAlongRoute(routeCoords, progressAlongRoute);
  }, [routeCoords, progressAlongRoute]);

  const mapMarkers = useMemo(() => {
    if (!runnerPosition) return [];
    return [
      {
        id: "runner",
        position: runnerPosition,
        title: started ? "いまここ" : "スタート",
        selected: true,
      },
    ];
  }, [runnerPosition, started]);

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
      a.addEventListener("error", () => {
        setAudioStatus("音声読み込みエラー: " + (a.error?.message || "不明"));
      });
      a.addEventListener("ended", () => {
        setAudioStatus("再生完了");
      });

      a.play()
        .then(() => {
          setAudioStatus("再生中");
        })
        .catch((e: Error) => {
          setAudioStatus("再生エラー: " + e.message);
        });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setAudioStatus("Audio生成エラー: " + msg);
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
      {routeId && (
        <div className="h-[min(38vh,260px)] w-full shrink-0 border-b border-white/10 bg-slate-950">
          {routeLoading ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm font-medium">
              コースを読み込み中…
            </div>
          ) : routeCoords.length > 0 ? (
            <GoogleMapCanvas
              className="h-full w-full"
              defaultCenter={routeCoords[0]}
              defaultZoom={14}
              routeCoordinates={routeCoords}
              markers={mapMarkers}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm text-center px-4">
              コースデータが見つかりません
            </div>
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center items-center text-center px-6 space-y-10 min-h-0">
        {routeName && (
          <p className="text-sm font-bold text-slate-400 tracking-tight">{routeName}</p>
        )}
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
