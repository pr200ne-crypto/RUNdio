import Link from "next/link";
import { SignOutButton } from "@/components/SignOutButton";

export default function RunLayout({
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
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold tracking-widest">走行中</span>
        <SignOutButton />
      </header>
      <div className="flex-1 flex flex-col relative">{children}</div>
    </div>
  );
}
