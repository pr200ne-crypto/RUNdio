# 新エージェント向け引き継ぎ（2026-04-09）

**別チャット・別エージェントがゼロコンテキストで再開する**ための要約。詳細仕様は既存の `AGENT_HANDOFF.md`・要件ドキュメントを読むこと。

---

## 1. まず読む順（最短）

1. 本ファイル（いま読んでいる）
2. [`CANONICAL.md`](./CANONICAL.md) — GitHub / 本番 URL / Supabase / 環境変数
3. [`NEXT_TASKS.md`](./NEXT_TASKS.md) — 残タスクチェックリスト
4. [`AGENT_HANDOFF.md`](./AGENT_HANDOFF.md) — プロジェクト性質・プロダクト概要
5. （必要なら）[`continuation-checkpoint-2026-04-06.md`](./continuation-checkpoint-2026-04-06.md) — 走行・音声・デプロイの経緯

---

## 2. 正規リソース（コピペ用）

| 種別 | URL |
|------|-----|
| GitHub | https://github.com/pr200ne-crypto/RUNdio |
| 本番（Vercel） | https://ru-ndio.vercel.app |
| Supabase ダッシュボード | https://supabase.com/dashboard/project/zxftszupgmkfmgrtxmdg |

---

## 3. ローカルと Git

- **リポジトリのルート**（`git` を叩く場所）:  
  `...\runradio\sample_project\`  
  （`demo-implementation` の一つ上。`git remote` は上記 GitHub。）
- **Next.js アプリのルート**:  
  `sample_project/demo-implementation/`
- **2026-04-09 時点**: 手元 `main` と `origin/main` は **`merge --allow-unrelated-histories` で統合済み**で、**`git push origin main` 成功済み**。以降は通常の `pull` / `push` でよい。

---

## 4. 2026-04-09 までに起きたこと（要約）

### 4.1 ドキュメント

- [`CANONICAL.md`](./CANONICAL.md) … 正規 URL・フォルダ関係・Git 注意・（任意）Clerk
- [`NEXT_TASKS.md`](./NEXT_TASKS.md) … 発表・実装の残タスク
- `README.md`（`sample_project`）… 上記へのリンク

### 4.2 Git マージ（`origin/main` 取り込み）

- リモートは **Clerk** 入りの短い履歴、手元は **Supabase + Google Maps + 伴走 MP3** の長い履歴で **履歴が分岐**していたため、`--allow-unrelated-histories` でマージ。
- **アプリの見た目・主導線**は手元実装を優先:
  - LP（`/lp`）＋ Supabase 認証
  - 計画フロー `/plan/*` の **Google Maps**（`GoogleMapCanvas.tsx`）
  - 走行 **`RunActiveClient`** … `new Audio("/audio/rundio-companion.mp3")` で伴走音声
  - ルート `/` → **`/lp` にリダイレクト**
  - `AppLayout`（スマホ枠 UI）、`layout.tsx` の OG URL は **`https://ru-ndio.vercel.app`**
- **リモートから取り込んだもの**:
  - `@clerk/nextjs`、`/sign-in`・`/sign-up`、`lib/clerk-config.ts`
  - ルート `middleware.ts`（下記で合成）
  - `_legacy/` など補助ファイル（`tsconfig` で `_legacy` は **exclude**）
- **削除したもの**（未使用・依存なしのため）:
  - `components/RunMap.tsx`、`RunMapLoader.tsx`（Leaflet / `react-leaflet` 前提。ビルドを壊すだけだった）

### 4.3 `middleware.ts` の挙動（重要）

- **`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` と `CLERK_SECRET_KEY` が両方ある** → Clerk の `clerkMiddleware`。公開パスに `/`・`/sign-in`・`/sign-up`・**`/lp`・`/auth`** を含める（LP がロックされないようにした）。
- **Clerk 未設定** → `lib/supabase/middleware.ts` の **`updateSession` のみ**（従来の Supabase セッション更新）。
- **注意**: Clerk を本番で有効にすると、**Clerk で保護されたルート**と **Supabase でログインした LP** が混在しうる。**運用はどちらか一方に寄せる**のが安全（現状の主デモは Supabase 側）。

### 4.4 `app/layout.tsx`

- `isClerkConfigured()` が true のときだけ **`ClerkProvider`** でラップ。
- 内側は共通で **`Providers` → `ErrorBoundary` → `AppLayout`**（従来どおり）。

### 4.5 ビルド

- `demo-implementation` で **`npm run build` 成功**（2026-04-09 時点）。
- `lib/supabase/server.ts` に **未使用変数の ESLint Warning** が残る程度（エラーではない）。

### 4.6 その他

- `postcss.config.js` と `postcss.config.mjs` が **両方存在**。現状ビルドは通るが、将来は **一本化**検討可。
- `runradio/__MACOSX/` は ZIP 由来のゴミ。**編集対象のプロンプトは `sample_project/docs/prompts/` 直下**（`._` ファイルは中身ではない）。

---

## 5. 環境変数（名前だけ・値は書かない）

`demo-implementation/.env.local` と Vercel に揃える。例は `.env.local.example`。

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- （任意）`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`、`CLERK_SECRET_KEY`

---

## 6. 主要ファイル（実装を触るとき）

| 領域 | パス（`demo-implementation/` から） |
|------|----------------------------------------|
| ルートレイアウト・OG | `app/layout.tsx` |
| ミドルウェア | `middleware.ts`（ルート）、`lib/supabase/middleware.ts` |
| スマホ枠 UI | `components/AppLayout.tsx` |
| 地図 | `components/GoogleMapCanvas.tsx`、`app/plan/route/page.tsx`、`app/plan/poi/page.tsx` |
| 走行・音声 | `components/RunActiveClient.tsx`、`public/audio/rundio-companion.mp3` |
| Clerk サインイン | `app/sign-in/[[...sign-in]]/page.tsx`、`app/sign-up/[[...sign-up]]/page.tsx` |

---

## 7. 再開プロンプト例（ユーザーが新チャットに貼る用）

```text
@sample_project/docs/HANDOFF_NEXT_AGENT_2026-04-09.md と @sample_project/docs/CANONICAL.md を読んで RUNdio を続けて。
Git のルートは sample_project。アプリは demo-implementation。
```

---

## 8. 更新履歴

- 2026-04-09: 初版（マージ完了・push 済み・Clerk 任意・RunMap 削除・ビルド確認までを記録）
