import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/clerk-config";

export default function SignUpPage() {
  if (!isClerkConfigured()) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F8FAFC] px-4 dark:bg-[#020617]">
        <p className="max-w-md text-center text-sm text-slate-600 dark:text-slate-300">
          Clerk が未設定のため新規登録画面は利用できません。
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
      <SignUp
        appearance={{
          variables: { colorPrimary: "#f97316", borderRadius: "12px" },
        }}
      />
    </div>
  );
}
