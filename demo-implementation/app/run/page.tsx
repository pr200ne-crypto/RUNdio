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
    <main className="flex flex-col min-h-screen max-w-md mx-auto bg-primary text-primary-foreground p-6">
      <header className="py-4 flex justify-between items-center mb-8">
        <button onClick={() => router.back()} className="p-2 -ml-2" disabled={isFinishing}>
          <ChevronLeft />
        </button>
        <div className="flex items-center bg-white/10 px-4 py-2 rounded-full">
          <div className={cn("w-2 h-2 rounded-full mr-2", isRunning ? "bg-green-400 animate-pulse" : "bg-yellow-400")} />
          <span className="text-xs font-bold uppercase tracking-widest">
            {isFinishing ? "Saving..." : isRunning ? "Running" : "Paused"}
          </span>
        </div>
        <button onClick={() => setIsAudioOn(!isAudioOn)} className="p-2 -mr-2" disabled={isFinishing}>
          {isAudioOn ? <Volume2 /> : <VolumeX />}
        </button>
      </header>

      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-12">
        <div className="space-y-2">
          <div className="text-sm font-medium opacity-60 uppercase tracking-widest">経過時間</div>
          <div className="text-7xl font-mono font-bold tracking-tighter">{formatTime(elapsedSeconds)}</div>
        </div>

        <div className="grid grid-cols-2 gap-12 w-full">
          <div className="space-y-1">
            <div className="text-xs font-medium opacity-60 uppercase tracking-widest">距離</div>
            <div className="text-4xl font-bold">{(distanceMeters / 1000).toFixed(2)} <span className="text-lg">km</span></div>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-medium opacity-60 uppercase tracking-widest">現在のペース</div>
            <div className="text-4xl font-bold">{currentPace} <span className="text-lg">/km</span></div>
          </div>
        </div>

        <div className="w-full bg-white/10 p-6 rounded-3xl flex items-center space-x-4">
          <div className="bg-accent p-3 rounded-2xl">
            <MapPin size={24} className="text-white" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold opacity-60 uppercase tracking-widest">次は</div>
            <div className="font-bold">代々木湯 (3.0 km 地点)</div>
          </div>
        </div>
      </div>

      <div className="py-10 flex justify-center items-center space-x-8">
        {!isFinishing ? (
          <>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="w-20 h-20 flex items-center justify-center bg-white text-primary rounded-full shadow-xl active:scale-95 transition-all"
            >
              {isRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
            
            <button
              onClick={handleFinish}
              className="w-16 h-16 flex items-center justify-center bg-red-500 text-white rounded-full shadow-xl active:scale-95 transition-all"
            >
              <Square size={24} fill="currentColor" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="animate-spin" size={48} />
            <span className="text-sm font-bold">保存中...</span>
          </div>
        )}
      </div>
    </main>
  );
}

export default function RunActivePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RunActiveContent />
    </Suspense>
  );
}
