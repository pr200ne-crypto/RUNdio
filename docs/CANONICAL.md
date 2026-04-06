# RUNdio 正規リソース（ソース・オブ・トゥルース）

エージェント・本人ともに、**ここに書いた URL を正**として扱う。古い別名（`demo-implementation.vercel.app` 等）は使わない。

## リポジトリ・デプロイ・バックエンド

| 種別 | 正 |
|------|-----|
| **GitHub** | [https://github.com/pr200ne-crypto/RUNdio](https://github.com/pr200ne-crypto/RUNdio) |
| **本番（Vercel）** | [https://ru-ndio.vercel.app](https://ru-ndio.vercel.app)（プロジェクト名 `ru-ndio`） |
| **Supabase ダッシュボード** | [https://supabase.com/dashboard/project/zxftszupgmkfmgrtxmdg](https://supabase.com/dashboard/project/zxftszupgmkfmgrtxmdg)（プロジェクト ref: `zxftszupgmkfmgrtxmdg`） |

## ローカル作業ディレクトリと Git の関係

- **Git の `origin`** は上記 GitHub と一致させる。`demo-implementation` フォルダで `git remote -v` を確認する。
- **GitHub 上のレイアウト**: リポジトリ**ルート**直下に `demo-implementation/` と `docs/` がある（[README](https://github.com/pr200ne-crypto/RUNdio/blob/main/README.md) どおり）。
- **手元の `runradio`**: `sample_project/demo-implementation/` にクローンや作業コピーがある場合がある。**編集・コミット・push するのは `origin` と同じツリー**（通常は `demo-implementation` がアプリルート）に揃えること。
- デスクトップの **`RUNdio` フォルダ**は別コピーになりうる。**Google Maps 連載のある実装**は `runradio` 側の `sample_project/demo-implementation` を正とする合意がある（重複フォルダは閉じて触らない）。

## 環境変数（値は Git に書かない）

Vercel の Project Settings → Environment Variables と、ローカルの `demo-implementation/.env.local` に揃える。

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase の Project URL（ダッシュボードの API 設定から取得）
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon public key
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — Google Cloud Console で発行

## 更新履歴

- 2026-04-09: 本番 URL を `ru-ndio.vercel.app`、GitHub / Supabase をユーザー指定で固定。
