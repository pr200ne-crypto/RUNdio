import Link from "next/link";
import { SignOutButton } from "@/components/SignOutButton";

export default function PlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col">
      <header className="bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/home" className="font-extrabold text-blue-600 tracking-tight">
          RUNdio
        </Link>
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <Link href="/plan/route" className="hover:text-blue-600 transition-colors">ルート</Link>
          <span>·</span>
          <Link href="/plan/poi" className="hover:text-blue-600 transition-colors">スポット</Link>
          <span>·</span>
          <Link href="/plan/confirm" className="hover:text-blue-600 transition-colors">確認</Link>
        </nav>
        <SignOutButton />
      </header>
      <main className="flex-1 flex flex-col relative">{children}</main>
    </div>
  );
}
