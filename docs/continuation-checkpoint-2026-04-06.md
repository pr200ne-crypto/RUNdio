# RUNdio デモ 引き継ぎチェックポイント（2026-04-06）

> 前回チェックポイント: `docs/continuation-checkpoint-2026-04-04.md`

---

## 1. プロジェクト概要

| 項目 | 内容 |
|------|------|
| アプリ名 | RUNdio（ランディオ） |
| 概要 | ランニング中にAI生成音声ラジオが流れる、パーソナル・ランニング・ラジオアプリ |
| 本番URL | https://ru-ndio.vercel.app/（Vercel プロジェクト `ru-ndio`） |
| リポジトリ | [https://github.com/pr200ne-crypto/RUNdio](https://github.com/pr200ne-crypto/RUNdio)（ブランチ: `main`） |
| フレームワーク | Next.js 15 (App Router, Turbopack) |
| デプロイ | Vercel（`npx vercel --prod --yes` で手動デプロイ） |
| 作業ディレクトリ（例） | `...\runradio\sample_project\demo-implementation\`（**正**は `git remote` が上記 GitHub のクローン） |

---

## 2. 技術スタック

| 技術 | バージョン | 備考 |
|------|-----------|------|
| Next.js | ^15.1.0 | App Router, Turbopack |
| React | ^19.0.0 | |
| TypeScript | ^5.7.0 | |
| Tailwind CSS | **^3.4.19** | v4ではなくv3。postcss.config.jsが必須 |
| Framer Motion | ^12.38.0 | 画面遷移アニメーション |
| Supabase | ^2.101.1 | 認証・DB |
| @react-google-maps/api | ^2.20.8 | Google Maps表示 |
| lucide-react | ^1.7.0 | アイコン |

---

## 3. 環境変数（Vercelに設定済み）

```
NEXT_PUBLIC_SUPABASE_URL=（Supabase Project URL）
NEXT_PUBLIC_SUPABASE_ANON_KEY=（Supabase anon public key）
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=（Google Cloud で発行したキー）
```

**Supabase ダッシュボード**: [プロジェクト zxftszupgmkfmgrtxmdg](https://supabase.com/dashboard/project/zxftszupgmkfmgrtxmdg)。値は **Git にコミットしない**。ローカルでは `demo-implementation/.env.local` に同じキー名で設定する。

---

## 4. ファイル構成（主要ファイル）

```
demo-implementation/
├── app/
│   ├── layout.tsx             # ルートレイアウト（AppLayout適用）
│   ├── page.tsx               # / → /lp にリダイレクト
│   ├── providers.tsx          # Supabase等のProvider
│   ├── lp/
│   │   ├── layout.tsx
│   │   └── page.tsx           # ランディングページ（ログイン/サインアップ/ログアウト）
│   ├── home/
│   │   └── page.tsx           # ホーム画面
│   ├── plan/
│   │   ├── route/page.tsx     # コース選択
│   │   ├── poi/page.tsx       # チェックポイント選択
│   │   └── confirm/page.tsx   # 計画確認 → /run/active へ遷移
│   ├── run/
│   │   ├── page.tsx           # /run → RunActiveClientをSuspenseでラップ
│   │   ├── active/page.tsx    # /run/active → RunActiveClientをSuspenseでラップ
│   │   └── complete/page.tsx  # 走行完了画面
│   ├── history/page.tsx       # 走行履歴
│   └── settings/page.tsx      # 設定・ログアウト
├── components/
│   ├── AppLayout.tsx          # アプリシェル（ボトムナビ・PC向けスマホフレーム）
│   ├── GoogleMapCanvas.tsx    # Google Maps コンポーネント
│   └── RunActiveClient.tsx    # 走行中画面（音声再生・タイマー）
├── lib/
│   ├── demo-audio.ts          # 音声ファイルパス・マイルストーン定義
│   └── utils.ts               # cn()ユーティリティ
├── public/
│   ├── audio/
│   │   └── rundio-companion.mp3  # ElevenLabs生成の伴走音声（要確認: 後述）
│   └── data/
│       ├── routes.json
│       └── pois.json
├── tailwind.config.js
└── postcss.config.js          # ← これがないとVercelでCSSが壊れる
```

---

## 5. 画面・ルート一覧

| ルート | 画面 | 備考 |
|--------|------|------|
| `/` | リダイレクト | → `/lp` |
| `/lp` | ランディングページ | ログイン/サインアップ/Google認証。ログイン済みの場合はホームへ戻る・ログアウトボタンを表示 |
| `/home` | ホーム | START導線、最近の走行（モックデータ）、コース提案 |
| `/plan/route` | コース選択 | Google Maps + ルート一覧 |
| `/plan/poi` | チェックポイント選択 | Google Maps + POI一覧 |
| `/plan/confirm` | 計画確認 | 「番組をスタート！」→ `/run/active` へ遷移 |
| `/run/active` | 走行中画面 | 音声再生・タイマー・距離カウント |
| `/run/complete` | 走行完了 | |
| `/history` | 走行履歴 | |
| `/settings` | 設定 | ログアウトボタン |

---

## 6. AppLayoutの挙動

`components/AppLayout.tsx` がすべてのページをラップする。

- **PCでの表示**: `max-w-md` のスマホ型フレーム（角丸・枠線付き）で中央表示
- **ボトムナビ非表示**: `/lp`、`/auth`、`/run/*`（`/run/complete`を除く）
- **アニメーション**: `framer-motion` の `AnimatePresence` で画面遷移

---

## 7. 音声再生（最重要・長期未解決→現在対応中）

### 音声ファイル
- **パス**: `public/audio/rundio-companion.mp3`
- **内容**: ElevenLabs（Mei - Friendly, Clear and Soft, v3）で生成した伴走ラジオ音声
- **最新ファイル**: `ElevenLabs_2026-04-05T14_33_20_...v3.mp3`（DownloadsフォルダからコピーしてVercelにデプロイ済み）
- **確認方法**: `https://ru-ndio.vercel.app/audio/rundio-companion.mp3` にアクセスして200が返れば存在する

### 再生実装（RunActiveClient.tsx）

**現在の実装方針**: ボタンクリック時に `new Audio(URL)` を生成して即 `.play()` を呼ぶ。

```typescript
const handleStart = () => {
  const a = new Audio("/audio/rundio-companion.mp3");
  a.volume = 1.0;
  audioRef.current = a;
  a.play().then(() => { /* 再生成功 */ }).catch((e) => { /* エラー表示 */ });
};
```

- JSXの `<audio>` タグ・Reactのref経由の再生は使っていない
- `useEffect` 内での自動再生も使っていない
- スタートボタン押下時のみ再生開始（ブラウザのautoplayポリシーをクリアするため）
- 画面上にステータス表示（「読み込み中...」「再生中」「再生エラー: ...」）

### これまでの失敗原因まとめ

| 原因 | 詳細 |
|------|------|
| 音声ファイルが存在しなかった | `public/audio/` ディレクトリが空。コードが `/audio/rundio-companion.mp3` を参照していたが、ファイルが一度もコミットされていなかった |
| `useEffect` と `handleStart` の二重 `.play()` | `started` 状態変化を `useEffect` が検知して2回目の `.play()` を呼び、ブラウザが最初の再生をAbortErrorでキャンセルしていた |
| `/run/page.tsx` の古い実装 | ブラウザの `SpeechSynthesis` APIを使う古い `RunActiveContent` が残っていて、`/run` に遷移するとMP3ではなく合成音声（またはエラー）になっていた |
| `/plan/confirm` のリンク先ミス | 「番組をスタート！」が `/run`（古いページ）を指していた。`/run/active` に修正済み |

---

## 8. 認証

- **Supabase Auth** を使用
- **Google OAuth** を設定済み（Google Cloud ConsoleにリダイレクトURI登録済み）
- `app/lp/page.tsx` でメール/パスワード認証とGoogle認証の両方を実装
- ログイン済みの場合はLP上に「ホームへ戻る」「ログアウト」ボタンを表示
- `/settings/page.tsx` にもログアウトボタンあり
- Supabaseダッシュボードの「Site URL」と「Redirect URLs」は本番URLに設定済み

---

## 9. CSS設定（重要）

Tailwind CSS v4をv3にダウングレード済み。`postcss.config.js` が必須。

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

これがないとVercelでCSSが一切適用されない（過去に発生したバグ）。

---

## 10. デプロイ手順

```powershell
cd "...\runradio\sample_project\demo-implementation"

# 変更をコミット
git add .
git commit -m "変更内容"

# GitHub へ（Vercel が Git 連携なら本番は自動デプロイ）
git push origin main

# 手動で Vercel 本番だけ叩く場合（任意）
# npx vercel --prod --yes
```

GitHub: [pr200ne-crypto/RUNdio](https://github.com/pr200ne-crypto/RUNdio)。本番 URL: [https://ru-ndio.vercel.app](https://ru-ndio.vercel.app)。

---

## 11. 現在の未解決課題

| 課題 | 状態 | 詳細 |
|------|------|------|
| 音声再生 | **対応中** | `new Audio()` 方式に変更してデプロイ済み。ユーザーによる動作確認待ち |
| GoogleMapCanvas の走行画面への統合 | 一時除外 | 音声問題解決後に再統合予定。現在は地図なしのシンプルなUI |

---

## 12. 次のステップ（優先順）

詳細は [`NEXT_TASKS.md`](./NEXT_TASKS.md) を正とする。

1. **音声再生の動作確認** — 本番 [https://ru-ndio.vercel.app](https://ru-ndio.vercel.app) で確認
2. **走行画面にGoogle Mapsを再統合**（任意） — `GoogleMapCanvas` を `RunActiveClient` に戻す
3. **GitHub への push** — `git push origin main` で [pr200ne-crypto/RUNdio](https://github.com/pr200ne-crypto/RUNdio) に反映

---

## 13. 注意事項

- `generate-demo-audio.js`（WAVファイル生成スクリプト）は作業ディレクトリに残っているが、本番では不要。必要に応じて削除する
- `node_modules` はgitignoreされている。`npm install` で復元可能
- ElevenLabsの元ファイルは `C:\Users\OnoguchiKoichi\Downloads\` にある（`ElevenLabs_2026-04-05T14_33_20_...mp3`）
