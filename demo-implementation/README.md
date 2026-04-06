# RUNdio Web デモ（要件 0.2）

Next.js App Router。画面 ID は `docs/output/detailed_requirements_specification.md` の S-01〜S-07 に対応。

## 起動

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開く。

## ルート

| パス | 画面 ID |
|------|---------|
| `/` | home |
| `/plan/route` | plan_route |
| `/plan/poi` | plan_poi |
| `/plan/confirm` | plan_confirm |
| `/run` | run_active |
| `/run/complete` | run_complete |
| `/settings` | settings |

## データ・地図

- POI モック: `public/data/pois.json`
- 音声プレースホルダ: `public/audio/`（`README.txt` 参照）。未配置時は距離キューがビープ音にフォールバック
- 地図: Leaflet + OpenStreetMap（帰属は `DemoFooter`）

## 認証（Clerk / Google 等）

- **`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`** と **`CLERK_SECRET_KEY`** の両方を設定すると、ミドルウェアで `/plan`・`/run`・`/settings` が保護され、ヘッダーにログイン／`UserButton` が出ます。Google ログインは [Clerk Dashboard](https://dashboard.clerk.com) の **User & Authentication → Social connections** で Google を有効化してください。
- どちらか一方でも欠ける場合は認証をオフにしたモードで動作し（本番のフォールバック）、画面はそのまま閲覧できます。

旧サンプル用の `proxy.ts`（命名のみ）相当の処理は **`middleware.ts`** に集約しています。`lib/supabase/auth-helpers.ts` は Clerk＋Supabase 同期用（Service Role 必須）。
