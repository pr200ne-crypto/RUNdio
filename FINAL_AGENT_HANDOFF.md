# エージェント向け最終ハンドオフ (RUNdio プロジェクト)

このドキュメントは、別のエージェントが本プロジェクトを引き継ぐための要約です。

## 1. 現在の状態
- **プロダクト名**: RUNdio（ラン×レディオ）
- **主要機能**: 
  - 認証（Supabase Auth）
  - 計画（ルート・POI選択）
  - 走行（疑似進行・音声実況）
  - 履歴（Supabase DB保存・表示）
- **デモ形態**: PCブラウザ上で動作するが、`MobileFrame` コンポーネントによりスマートフォンアプリのUIを再現。
- **インフラ**: Supabase (DB/Auth) 連携済み。GitHub プッシュ済み。

## 2. 技術スタック & 接続情報
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Leaflet.
- **Backend**: Next.js API Routes (`/api/sessions`).
- **Database/Auth**: Supabase (`@supabase/ssr` 導入済み).
- **環境変数**: `.env.local` に `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` が設定済み。

## 3. 重要なファイルパス
- **実装**: `demo-implementation/`
  - `app/lp/page.tsx`: 認証・LP
  - `app/run/page.tsx`: 走行ロジック・データ保存
  - `app/history/page.tsx`: 履歴表示
  - `components/mobile-frame.tsx`: スマホ枠UI
- **設計・要件**:
  - `docs/input/`: 企画・ビジネス要件
  - `docs/output/`: システム・詳細要件
  - `docs/design/`: 詳細設計（アーキテクチャ、DB、API等）
- **DB**: `supabase/schema.sql` (テーブル定義・RLS)

## 4. 次のエージェントへのタスク
1. **Vercel デプロイ**: 
   - GitHub連携を行い、環境変数を設定して本番URLを発行する。
2. **NotebookLM 音声の組み込み**: 
   - `public/audio/` に音声ファイルを配置し、`app/run/page.tsx` の `speak` 関数または `Audio` タグで再生するように更新する。
3. **Google Maps へのアップグレード**:
   - `Leaflet` を `Google Maps API` に差し替え、ルート沿いの施設検索をリアルタイム化する。
4. **UI/UX のブラッシュアップ**:
   - 走行中のアニメーションや、完了画面の演出（シェア機能など）の強化。

## 5. ユーザーへの確認事項
- Vercel デプロイ用のドメイン名の希望。
- 音声合成（TTS）に ElevenLabs 等の有料APIを導入するかどうか。
