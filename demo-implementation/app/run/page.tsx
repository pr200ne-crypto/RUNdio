"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Pause, Play, Square, Volume2, VolumeX, MapPin, ChevronLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function RunActiveContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const routeId = searchParams.get("routeId");
  const poiId = searchParams.get("poiId");

  const [isRunning, setIsRunning] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [lastAnnouncedKm, setLastAnnouncedKm] = useState(0);
  const [poiAnnounced, setPoiAnnounced] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // 疑似ペース: 1km = 6分 (360秒)
  const paceSecondsPerKm = 360;
  const metersPerSecond = 1000 / paceSecondsPerKm;

  const speak = useCallback((text: string) => {
    if (!isAudioOn || typeof window === "undefined") return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
  }, [isAudioOn]);

  useEffect(() => {
    if (elapsedSeconds === 0) {
      speak("ランディオ、スタートです。今日の番組、最後までお楽しみください！");
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isFinishing) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
        setDistanceMeters((prev) => prev + metersPerSecond);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isFinishing, metersPerSecond]);

  // 音声通知ロジック
  useEffect(() => {
    const currentKm = Math.floor(distanceMeters / 1000);
    if (currentKm > lastAnnouncedKm) {
      setLastAnnouncedKm(currentKm);
      speak(`${currentKm}キロ地点を通過しました。現在のペースは、キロ6分。順調ですね！`);
    }

    // チェックポイント接近 (例: 3km地点で通知)
    if (distanceMeters >= 3000 && !poiAnnounced) {
      setPoiAnnounced(true);
      speak("まもなくチェックポイントの代々木湯に到着します。ゴール後のひとっ風呂、楽しみですね！");
    }
  }, [distanceMeters, lastAnnouncedKm, poiAnnounced, speak]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const currentPace = "6'00\"";

  const handleFinish = async () => {
    if (isFinishing) return;
    setIsFinishing(true);
    setIsRunning(false);
    
    speak("お疲れ様でした！今日のランニング番組、これにて終了です。データを保存しています。");

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route_id: routeId,
          distance_meters: Math.round(distanceMeters),
          duration_seconds: elapsedSeconds,
          poi_id: poiId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save session');
      }

      router.push(`/run/complete?distance=${distanceMeters}&duration=${elapsedSeconds}`);
    } catch (error) {
      console.error('Error saving session:', error);
      // エラー時も完了画面へ（オフライン想定）
      router.push(`/run/complete?distance=${distanceMeters}&duration=${elapsedSeconds}`);
    }
  };

  return (
    <main className="flex flex-col min-h-screen max-w-md mx-auto bg-blue-600 text-white overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-500 to-transparent opacity-50 pointer-events-none" />
      <div className="absolute -right-32 -top-32 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-32 top-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

      <header className="relative z-10 py-6 px-6 flex justify-between items-center">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm" disabled={isFinishing}>
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center bg-white/15 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 shadow-sm">
          <div className={cn("w-2.5 h-2.5 rounded-full mr-2.5 shadow-sm", isRunning ? "bg-green-400 animate-pulse shadow-green-400/50" : "bg-yellow-400")} />
          <span className="text-xs font-bold uppercase tracking-widest">
            {isFinishing ? "Saving..." : isRunning ? "Running" : "Paused"}
          </span>
        </div>
        <button onClick={() => setIsAudioOn(!isAudioOn)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm" disabled={isFinishing}>
          {isAudioOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </header>

      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-6 space-y-12">
        <div className="space-y-3">
          <div className="text-sm font-bold text-blue-200 uppercase tracking-widest">経過時間</div>
          <div className="text-7xl font-mono font-black tracking-tighter tabular-nums drop-shadow-md">
            {formatTime(elapsedSeconds)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 w-full max-w-xs mx-auto">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-lg">
            <div className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-2">距離</div>
            <div className="text-4xl font-black tabular-nums">
              {(distanceMeters / 1000).toFixed(2)}
              <span className="text-lg font-bold text-blue-200 ml-1">km</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-lg">
            <div className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-2">ペース</div>
            <div className="text-4xl font-black tabular-nums">
              {currentPace}
              <span className="text-lg font-bold text-blue-200 ml-1">/km</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-xs mx-auto bg-white/15 backdrop-blur-md p-5 rounded-3xl flex items-center gap-4 border border-white/10 shadow-lg">
          <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
            <MapPin size={24} />
          </div>
          <div className="text-left flex-1 min-w-0">
            <div className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-0.5">次は</div>
            <div className="font-bold text-lg truncate">代々木湯</div>
            <div className="text-sm text-blue-100 font-medium">3.0 km 地点</div>
          </div>
        </div>
      </div>

      <div className="relative z-10 py-12 flex justify-center items-center gap-8">
        {!isFinishing ? (
          <>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={cn(
                "w-24 h-24 flex items-center justify-center rounded-full shadow-2xl transition-all active:scale-95 border-4",
                isRunning 
                  ? "bg-white text-blue-600 border-white hover:bg-blue-50" 
                  : "bg-blue-500 text-white border-blue-400 hover:bg-blue-400"
              )}
            >
              {isRunning ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-2" />}
            </button>
            
            <button
              onClick={handleFinish}
              className="w-16 h-16 flex items-center justify-center bg-white/20 text-white rounded-full shadow-lg backdrop-blur-md border border-white/30 hover:bg-red-500 hover:border-red-400 transition-all active:scale-95 group"
            >
              <Square size={24} fill="currentColor" className="group-hover:scale-110 transition-transform" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-4 bg-white/20 backdrop-blur-md p-8 rounded-3xl border border-white/20">
            <Loader2 className="animate-spin text-white" size={48} />
            <span className="text-sm font-bold tracking-widest uppercase text-white">データを保存中...</span>
          </div>
        )}
      </div>
    </main>
  );
}

export default function RunActivePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-blue-600 text-white font-bold">Loading...</div>}>
      <RunActiveContent />
    </Suspense>
  );
}
