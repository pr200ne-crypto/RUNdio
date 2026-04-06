import { readFile } from "fs/promises";
import path from "path";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { DemoFooter } from "@/components/DemoFooter";
import { RunMapLoader } from "@/components/RunMapLoader";
import { PRESET_ROUTE } from "@/lib/demo-route";

type PoiFile = {
  category: string;
  label: string;
  items: {
    id: string;
    name: string;
    lat: number;
    lng: number;
    distanceFromRouteM: number;
  }[];
};

export default async function PlanPoiPage() {
  const raw = await readFile(
    path.join(process.cwd(), "public", "data", "pois.json"),
    "utf8",
  );
  const poisData = JSON.parse(raw) as PoiFile;
  const pois = poisData.items.map((p) => ({
    id: p.id,
    name: p.name,
    lat: p.lat,
    lng: p.lng,
    distanceFromRouteM: p.distanceFromRouteM,
  }));

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] dark:bg-[#020617]">
      <AppHeader
        backHref="/plan/route"
        title="チェックポイント（S-03）"
      />
      <main className="flex flex-1 flex-col gap-4 px-4 py-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          カテゴリ:{" "}
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {poisData.label}
          </span>
        </p>
        <RunMapLoader pois={pois} route={PRESET_ROUTE} />
        <ul className="space-y-2 rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-900">
          {pois.map((p) => (
            <li
              className="flex justify-between gap-2 border-b border-slate-100 pb-2 last:border-0 last:pb-0 dark:border-slate-800"
              key={p.id}
            >
              <span className="font-medium">{p.name}</span>
              <span className="shrink-0 text-slate-500">
                ルートから約 {p.distanceFromRouteM}m
              </span>
            </li>
          ))}
        </ul>
        <Link
          className="block rounded-xl bg-orange-500 py-3 text-center font-semibold text-white hover:bg-orange-600"
          href="/plan/confirm"
        >
          候補を承認して次へ
        </Link>
      </main>
      <DemoFooter />
    </div>
  );
}
