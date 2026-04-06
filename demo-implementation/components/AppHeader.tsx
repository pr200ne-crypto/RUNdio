"use client";

import Link from "next/link";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";

type Props = {
  title: string;
  backHref?: string;
  backLabel?: string;
};

function clerkPublishablePresent() {
  const k = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return typeof k === "string" && k.length > 0;
}

function AppHeaderPlain({ title, backHref, backLabel = "戻る" }: Props) {
  return (
    <header className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
      {backHref ? (
        <Link
          className="shrink-0 text-sm text-orange-600 hover:underline dark:text-orange-400"
          href={backHref}
        >
          ◀ {backLabel}
        </Link>
      ) : null}
      <h1 className="min-w-0 flex-1 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        {title}
      </h1>
    </header>
  );
}

function AppHeaderWithClerk({ title, backHref, backLabel = "戻る" }: Props) {
  const { isSignedIn, isLoaded } = useAuth({
    treatPendingAsSignedOut: true,
  });

  return (
    <header className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
      {backHref ? (
        <Link
          className="shrink-0 text-sm text-orange-600 hover:underline dark:text-orange-400"
          href={backHref}
        >
          ◀ {backLabel}
        </Link>
      ) : null}
      <h1 className="min-w-0 flex-1 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        {title}
      </h1>
      <div className="flex shrink-0 items-center gap-2">
        {!isLoaded ? (
          <span className="h-8 w-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
        ) : isSignedIn ? (
          <UserButton
            appearance={{
              variables: { colorPrimary: "#f97316" },
            }}
          />
        ) : (
          <SignInButton mode="modal">
            <button
              type="button"
              className="rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-orange-600"
            >
              ログイン
            </button>
          </SignInButton>
        )}
      </div>
    </header>
  );
}

export function AppHeader(props: Props) {
  if (!clerkPublishablePresent()) {
    return <AppHeaderPlain {...props} />;
  }
  return <AppHeaderWithClerk {...props} />;
}
