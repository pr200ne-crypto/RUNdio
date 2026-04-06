import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/clerk-config";

export default function SignInPage() {
  if (!isClerkConfigured()) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F8FAFC] px-4 dark:bg-[#020617]">
        <p className="max-w-md text-center text-sm text-slate-600 dark:text-slate-300">
          Clerk（ログイン）が未設定です。Vercel とローカルの環境変数に{" "}
          <code className="rounded bg-slate-200 px-1 dark:bg-slate-800">
            NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
          </code>{" "}
          と{" "}
          <code className="rounded bg-slate-200 px-1 dark:bg-slate-800">
            CLERK_SECRET_KEY
          </code>{" "}
          を設定してください。Google ログインは Clerk ダッシュボードの SSO 連携で有効化します。
        </p>
        <Link
          href="/"
          className="rounded-xl bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600"
        >
          ホームへ
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] px-4 py-8 dark:bg-[#020617]">
      <SignIn
        appearance={{
          variables: { colorPrimary: "#f97316", borderRadius: "12px" },
        }}
      />
    </div>
  );
}
