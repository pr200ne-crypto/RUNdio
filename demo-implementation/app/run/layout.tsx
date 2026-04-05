import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";

export default async function RunLayout({
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
        <span className="app-run-badge">走行</span>
        <SignOutButton />
      </header>
      {children}
    </div>
  );
}
