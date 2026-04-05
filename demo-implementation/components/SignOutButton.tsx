"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/lp");
  };

  return (
    <button type="button" className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors" onClick={handleSignOut}>
      ログアウト
    </button>
  );
}
