# エージェント向け最終ハンドオフ (2026-04-05)

このドキュメントは、RUNdio プロジェクトを次のエージェントへ引き継ぐための最新要約です。

## 1. 現在の優先順位
ユーザーが明示した優先順位は以下です。

1. **UI/UX ブラッシュアップ**
2. **Google Maps 連携**
3. **Vercel デプロイ**

補足:
- **NotebookLM 音声組み込みは対象外**。ユーザーの指示で除外済み。
- LP はまだ仕上げ途中だが、ユーザーから「LPはあとで修正するからいいとして googlemap との連携進めろ」と指示あり。

## 2. 現在の状態
- **プロダクト名**: `RUNdio`
- **主要機能**:
  - Supabase Auth による認証
  - ルート選択 (`/plan/route`)
  - 立ち寄り先選択 (`/plan/poi`)
  - 走行画面 (`/run/*`)
  - 履歴画面 (`/history`)
- **正規LPルート**: `/lp`
- **デモ/比較用LP**: `/lp-b4` はまだ残っている
- **認証後の挙動**:
  - 未ログインで保護画面へ行くと `/lp` にリダイレクト
  - ログイン済みで `/lp` へ行くと `/home` にリダイレクト

## 3. LP の現状
- `app/lp/page.tsx` は `/lp-b4` をベースに大きく再設計済み
- 現在の方向性:
  - 実写写真ベース
  - ブルー/ホワイト基調
  - **カードデザインは使わない**
  - 常時アニメーション禁止
  - `framer-motion` の `FadeIn` のみ使用
- ユーザーのフィードバック:
  - 説明が多すぎるのは不評
  - センター揃え希望
  - `POI` という語はわかりにくいため、LPでは `立ち寄り先` / `立ち寄りスポット` に言い換え済み
- LP はまだ未確定。あとで再度ブラッシュアップ予定

## 4. Google Maps 連携の現状
### 実装済み
- `Leaflet` 依存の画面を、Google Maps ベースの共通コンポーネントへ差し替えた
- 新規コンポーネント:
  - `demo-implementation/components/GoogleMapCanvas.tsx`

### 差し替え済み画面
- `demo-implementation/app/plan/route/page.tsx`
  - ルート表示を Google Maps に変更
- `demo-implementation/app/plan/poi/page.tsx`
  - ルート + 立ち寄り先マーカー表示を Google Maps に変更
- `demo-implementation/app/lp/page.tsx`
  - Google Maps のプレビューセクションを追加

### 現在の仕様
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` が未設定でもページ自体は壊れない
- APIキー未設定時は地図エリアに案内メッセージを表示する
- 現時点では静的データ (`public/data/routes.json`, `public/data/pois.json`) を Google Maps 上に描画しているだけ
- **Directions API / Places API / 実検索連携は未着手**

## 5. 環境変数
`demo-implementation/.env.local.example` は更新済み。

必要な環境変数:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

補足:
- 実際に Google Maps を表示するには `.env.local` に `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` を追加する必要がある
- Vercel にも同じ環境変数を設定すること

## 6. このセッションで重要だった変更
### 既存変更の確認
- `components/mobile-frame.tsx`
  - `pathname === "/lp"` から `pathname.startsWith("/lp")` に変更済み
  - LP系パスでモバイルフレームをバイパス
- `app/providers.tsx`
  - `SessionProvider` 削除済み
  - このプロジェクトは Supabase Auth を使用
- `next.config.ts`
  - `images.unsplash.com` を `remotePatterns` に追加済み

### 今回の追加/更新
- `app/lp/page.tsx`
  - LP再構成
  - Google Maps プレビューセクション追加
- `app/plan/route/page.tsx`
  - Leaflet -> Google Maps
- `app/plan/poi/page.tsx`
  - Leaflet -> Google Maps
- `components/GoogleMapCanvas.tsx`
  - Google Maps の共通描画コンポーネント追加
- `.env.local.example`
  - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` を追記
- `package.json`
  - `@react-google-maps/api` を追加

## 7. 技術メモ
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Auth / DB**: Supabase (`@supabase/ssr`)
- **Google Maps**: `@react-google-maps/api`
- **dev サーバー**: `npm run dev` (ポート `3040`)
- **ビルド**: ルートの `npm run build` は `demo-implementation` をビルド
- **Tailwind**: v4 インストール済みだが設定は従来形式のまま

## 8. 注意点
- `auth.ts` / `app/api/auth/[...nextauth]/route.ts` は残っているが、実運用は Supabase Auth
- Next.js + Turbopack の dev サーバーが、ときどき `.next` の一時ファイルで壊れることがある
  - 症状: `/lp` などで `500`
  - 対処: dev サーバー再起動で復旧することが多い
- LP は大きく触っている途中なので、ユーザー好みへの再調整前提

## 9. 次のエージェントへの具体タスク
1. **Google Maps API キーの実設定**
   - `demo-implementation/.env.local` に `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` を追加
   - 実ブラウザで `/plan/route`, `/plan/poi`, `/lp` の地図表示を確認

2. **Google Maps の本格連携**
   - `Places API` を使って立ち寄り先候補を実データ化
   - 必要なら `Directions API` でルート計算を Google 側に寄せる
   - 現在の `public/data/routes.json`, `public/data/pois.json` 依存を段階的に削減

3. **LP の再調整**
   - テキスト量、余白、写真選定、セクション密度の再チューニング
   - OGP / metadata の整備

4. **他画面の UI 統一**
   - `/home`
   - `/plan/*`
   - `/run/*`
   - `/history`

5. **Vercel デプロイ**
   - 環境変数3つを設定して本番公開

## 10. 確認済み事項
このセッションで以下は確認済み:
- `ReadLints` で関連ファイルの lint 問題なし
- `npm run build` 成功
- `http://localhost:3040/lp` が `200`
- `http://localhost:3040/plan/route` が `200`

## 11. 重要ファイル
- `FINAL_AGENT_HANDOFF.md`
- `AGENT_HANDOFF_LP_REDESIGN.md`
- `demo-implementation/app/lp/page.tsx`
- `demo-implementation/app/plan/route/page.tsx`
- `demo-implementation/app/plan/poi/page.tsx`
- `demo-implementation/components/GoogleMapCanvas.tsx`
- `demo-implementation/.env.local.example`
