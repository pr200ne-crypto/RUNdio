"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function MobileFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLp = pathname.startsWith("/lp");

  if (isLp) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 md:p-8">
      {/* PCで見ている人向けの背景装飾 */}
      <div className="hidden md:block absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Smartphone Frame */}
      <div className="relative w-full max-w-[390px] h-[844px] bg-slate-900 rounded-[3.5rem] border-[12px] border-slate-800 shadow-[0_0_80px_rgba(0,0,0,0.3)] overflow-hidden ring-4 ring-slate-200/20 flex flex-col">
        {/* Notch / Dynamic Island area */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-8 bg-slate-800 rounded-b-3xl z-50 flex items-center justify-center">
          <div className="w-12 h-1 bg-slate-700 rounded-full" />
        </div>

        {/* Status Bar simulation */}
        <div className="h-12 bg-transparent flex items-center justify-between px-8 pt-2 z-40 text-[10px] font-bold text-slate-400">
          <span>9:41</span>
          <div className="flex gap-1.5 items-center">
            <div className="w-3 h-3 rounded-sm border border-slate-400" />
            <div className="w-3 h-3 bg-slate-400 rounded-full" />
          </div>
        </div>

        {/* App Content Area */}
        <div className="flex-1 overflow-y-auto bg-background relative custom-scrollbar">
          {children}
        </div>

        {/* Home Indicator */}
        <div className="h-8 bg-transparent flex items-center justify-center z-40">
          <div className="w-32 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
        </div>
      </div>

      {/* PC向けの補足テキスト */}
      <div className="hidden lg:flex flex-col ml-12 max-w-xs space-y-4">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-lg mb-2 text-primary">Mobile Preview</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            このデモは、スマートフォンアプリとしての体験を再現するためにモバイルフレーム内で表示されています。
          </p>
        </div>
        <div className="p-4 text-xs text-slate-400 text-center">
          RUNdio v0.2 Prototype
        </div>
      </div>
    </div>
  );
}
