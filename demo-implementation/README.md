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

## 旧サンプル（Clerk + middleware）

Clerk 連携の `proxy.ts` と `auth-helpers` は **`_legacy/`** に退避しています。0.2 デモでは未使用。Supabase クライアント用の `lib/supabase/` は将来用に同梱（環境変数未設定でも本デモの画面は動作します）。
