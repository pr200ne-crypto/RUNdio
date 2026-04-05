import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/home");

  return (
    <main className="login-main">
      <Suspense fallback={<div className="login-card">読み込み中…</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
