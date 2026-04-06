import Link from "next/link";

type Props = {
  title: string;
  backHref?: string;
  backLabel?: string;
};

export function AppHeader({ title, backHref, backLabel = "戻る" }: Props) {
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
      <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        {title}
      </h1>
    </header>
  );
}
