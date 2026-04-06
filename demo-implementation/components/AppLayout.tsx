"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Map, History, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // LPや認証関連のページではボトムナビゲーションを非表示にする
  const isLpOrAuth = pathname?.startsWith("/lp") || pathname?.startsWith("/auth");

  // 走行中画面はボトムナビゲーションを非表示にする
  const isRunActive = pathname?.startsWith("/run") && pathname !== "/run/complete";

  const hideBottomNav = isLpOrAuth || isRunActive;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center sm:p-4 md:p-8">
      {/* PC向けの背景装飾 */}
      <div className="hidden sm:block fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* スマホサイズのコンテナ */}
      <div className="relative w-full max-w-md bg-white sm:rounded-[2.5rem] sm:shadow-2xl sm:border-8 sm:border-slate-800 overflow-hidden flex flex-col h-[100dvh] sm:h-[844px]">
        
        {/* コンテンツエリア */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar relative bg-slate-50">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
              className="min-h-full flex flex-col"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ボトムナビゲーション */}
        {!hideBottomNav && (
          <nav className="shrink-0 bg-white border-t border-slate-100 px-6 py-3 flex items-center justify-between pb-safe z-50 relative">
            <NavItem href="/home" icon={<Home size={24} />} label="ホーム" active={pathname === "/home"} />
            <NavItem href="/plan/route" icon={<Map size={24} />} label="計画" active={pathname?.startsWith("/plan")} />
            <NavItem href="/history" icon={<History size={24} />} label="履歴" active={pathname?.startsWith("/history")} />
            <NavItem href="/settings" icon={<Settings size={24} />} label="設定" active={pathname?.startsWith("/settings")} />
          </nav>
        )}
      </div>
    </div>
  );
}

function NavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link href={href} className={cn("flex flex-col items-center gap-1 transition-colors", active ? "text-blue-600" : "text-slate-400 hover:text-slate-600")}>
      <div className={cn("p-1 rounded-xl transition-all", active && "bg-blue-50")}>
        {icon}
      </div>
      <span className="text-[10px] font-bold">{label}</span>
    </Link>
  );
}
