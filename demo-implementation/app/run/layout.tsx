import Link from "next/link";
import { SignOutButton } from "@/components/SignOutButton";

export default function RunLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link href="/home" className="app-logo">
          RUNdio
        </Link>
        <span className="app-run-badge">走行</span>
        <SignOutButton />
      </header>
      {children}
    </div>
  );
}
