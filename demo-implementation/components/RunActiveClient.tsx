"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEMO_AUDIO_PATH,
  milestoneLabelAtKm,
} from "@/lib/demo-audio";

const TARGET_KM = 10;
/** 疑似ランで 10km に到達するまでの秒数（デモ用） */
const DEMO_DURATION_SEC = 180;

function formatTime(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function RunActiveClient() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
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

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (!started || paused) {
      a.pause();
      return;
    }
    void a.play().catch(() => {});
  }, [started, paused]);

  const handleStart = () => {
    setStarted(true);
    setPaused(false);
    setElapsedSec(0);
    const a = audioRef.current;
    if (a) {
      a.currentTime = 0;
      void a.play().catch(() => {});
    }
  };

  const handlePauseToggle = () => {
    setPaused((p) => !p);
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
    <main className="run-client-main">
      <audio ref={audioRef} src={DEMO_AUDIO_PATH} preload="auto" />

      <p style={{ color: "#9aa7b2", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
        走行中（疑似）
      </p>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>伴走ラジオ</h1>

      <div
        style={{
          background: "#1a222c",
          borderRadius: 12,
          padding: "1.25rem",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: "0.25rem" }}>
          {distanceKm.toFixed(2)} km
        </div>
        <div style={{ color: "#9aa7b2", fontSize: "0.9rem" }}>
          目標 {TARGET_KM} km ・ 経過 {formatTime(elapsedSec)}
        </div>
        {segmentLabel && (
          <div style={{ marginTop: "0.75rem", fontSize: "0.85rem", color: "#7eb8da" }}>
            台本の位置（目安）: {segmentLabel}
          </div>
        )}
      </div>

      {!started ? (
        <button
          type="button"
          onClick={handleStart}
          style={{
            width: "100%",
            padding: "1rem",
            fontSize: "1rem",
            fontWeight: 600,
            border: "none",
            borderRadius: 10,
            background: "#2a6fa5",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          スタート（伴走音声を再生）
        </button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <button
            type="button"
            onClick={handlePauseToggle}
            style={{
              padding: "0.85rem",
              fontWeight: 600,
              borderRadius: 10,
              border: "1px solid #3d4f5f",
              background: "#1a222c",
              color: "#e7ecf1",
              cursor: "pointer",
            }}
          >
            {paused ? "再開" : "一時停止"}
          </button>
          <button
            type="button"
            onClick={handleComplete}
            style={{
              padding: "0.85rem",
              fontWeight: 600,
              borderRadius: 10,
              border: "none",
              background: "#3d2a50",
              color: "#e7ecf1",
              cursor: "pointer",
            }}
          >
            終了して完了画面へ
          </button>
        </div>
      )}

      <p style={{ marginTop: "2rem", fontSize: "0.8rem", color: "#6b7883" }}>
        音声は <code style={{ color: "#9aa7b2" }}>{DEMO_AUDIO_PATH}</code>
        。ブラウザの自動再生制限のため、再生は「スタート」操作から始まります。
      </p>

      <p style={{ marginTop: "1rem" }}>
        <Link href="/home" style={{ color: "#7eb8da", fontSize: "0.9rem" }}>
          ホームへ
        </Link>
      </p>
    </main>
  );
}
