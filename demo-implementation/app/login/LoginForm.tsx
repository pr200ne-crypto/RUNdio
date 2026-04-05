"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/home";
  const error = searchParams.get("error");
  const [busy, setBusy] = useState(false);

  return (
    <div className="login-card">
      <h1 className="login-title">ログイン</h1>
      <p className="login-lead">
        Google アカウントでサインインして、RUNdio をご利用ください。
      </p>

      {error && (
        <p className="login-error" role="alert">
          認証に失敗しました。もう一度お試しください。
        </p>
      )}

      <button
        type="button"
        className="btn-google"
        disabled={busy}
        onClick={() => {
          setBusy(true);
          void signIn("google", { callbackUrl });
        }}
      >
        <GoogleMark />
        {busy ? "リダイレクト中…" : "Google で続ける"}
      </button>

      <p className="login-note">
        初回ログイン時にアカウントが作成されます。メールアドレスは Google の公開プロフィールに基づきます。
      </p>

      <Link href="/" className="login-back">
        トップへ戻る
      </Link>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
