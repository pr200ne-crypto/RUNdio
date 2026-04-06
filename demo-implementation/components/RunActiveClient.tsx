"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { DemoFooter } from "@/components/DemoFooter";
import { RunMap } from "@/components/RunMap";
import { createDistanceAudioCuePlayer } from "@/lib/demo-audio";
import { PRESET_ROUTE } from "@/lib/demo-route";
import {
  createPseudoRunSession,
  formatDuration,
  formatPace,
} from "@/lib/pseudo-run";
import { polylineLengthMeters } from "@/lib/route-length";

const DEMO_PACE_SEC_PER_KM = 310; // 5'10"/km 相当（固定シード）

export function RunActiveClient() {
  const routeLengthM = useMemo(
    () => polylineLengthMeters(PRESET_ROUTE),
    [],
  );
  const [distanceM, setDistanceM] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const sessionRef = useRef<ReturnType<typeof createPseudoRunSession> | null>(
    null,
  );
  const audioRef = useRef(createDistanceAudioCuePlayer());

  useEffect(() => {
    const session = createPseudoRunSession({
      routeLengthM,
      paceSecPerKm: DEMO_PACE_SEC_PER_KM,
      onTick: (s) => {
        setDistanceM(s.distanceM);
        setElapsedMs(s.elapsedMs);
        setPaused(s.paused);
        setFinished(s.finished);
        audioRef.current.onDistanceM(s.distanceM);
      },
    });
    sessionRef.current = session;
    session.start();
    return () => session.stop();
  }, [routeLengthM]);

  const paceDisplay = formatPace(DEMO_PACE_SEC_PER_KM);
  const km = (distanceM / 1000).toFixed(1);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-slate-900 dark:bg-[#020617] dark:text-slate-100">
      <AppHeader backHref="/plan/confirm" backLabel="計画へ" title="走行中" />
      <main className="flex flex-1 flex-col gap-4 px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link
            className="text-sm text-orange-600 hover:underline dark:text-orange-400"
            href="/"
          >
            ホーム
          </Link>
          <button
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium dark:border-slate-600 dark:bg-slate-900"
            onClick={() => sessionRef.current?.setPaused(!paused)}
            type="button"
          >
            {paused ? "再開" : "一時停止"}
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-center font-mono text-3xl tabular-nums tracking-tight">
            {formatDuration(elapsedMs)}
          </p>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            経過時間
          </p>
          <p className="mt-3 text-center font-mono text-2xl tabular-nums text-teal-600 dark:text-teal-400">
            {km} km
          </p>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            距離（擬似）
          </p>
          <p className="mt-2 text-center font-mono text-lg tabular-nums">
            {paceDisplay}
          </p>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            現在ペース（固定デモ）
          </p>
        </div>

        <p className="text-center text-sm text-slate-600 dark:text-slate-300">
          ▶ 音声: オン（3 / 6 / 9 km でキュー。mp3 未配置時はビープ）
        </p>

        <RunMap heightPx={220} route={PRESET_ROUTE} />

        {finished ? (
          <Link
            className="block rounded-xl bg-orange-500 py-3 text-center font-semibold text-white hover:bg-orange-600"
            href="/run/complete"
          >
            終了して完了へ
          </Link>
        ) : (
          <Link
            className="block rounded-xl border border-slate-300 py-3 text-center text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
            href="/run/complete"
          >
            デモ用: 途中で完了画面へ
          </Link>
        )}
      </main>
      <DemoFooter />
    </div>
  );
}
