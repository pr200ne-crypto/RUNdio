import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";

export default async function PlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link href="/home" className="app-logo">
          RUNdio
        </Link>
        <nav className="plan-steps">
          <Link href="/plan/route">ルート</Link>
          <span className="plan-sep">·</span>
          <Link href="/plan/poi">チェックポイント</Link>
          <span className="plan-sep">·</span>
          <Link href="/plan/confirm">確認</Link>
        </nav>
        <SignOutButton />
      </header>
      <main className="app-main plan-main">{children}</main>
    </div>
  );
}
