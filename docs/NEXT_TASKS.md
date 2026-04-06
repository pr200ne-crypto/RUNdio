# 次のタスク（優先順）

発表・提出に向けたチェックリスト。**上から順**がおすすめ。

## リポジトリ（先に状況確認）

0. [ ] **`git push` が通るか** — `sample_project` で `git fetch origin` → `git log main..origin/main` / `git log origin/main..main` で差分を確認。分岐が大きい場合は [`CANONICAL.md` の Git の注意](./CANONICAL.md#git-の注意ローカルと-github-が食い違うとき) を読む。**force push はしない**。

## 実装・デプロイ

1. [ ] **本番で動線確認** — [https://ru-ndio.vercel.app](https://ru-ndio.vercel.app) で LP → ログイン → 計画 → 走行 → 音声再生まで通す。
2. [ ] **ローカル** — `demo-implementation` で `npm install`、`.env.local` 設定、`npm run dev` で同じ動線。
3. [ ] **GitHub に同期** — `demo-implementation` で `git status` → コミット → `git push origin main`（Vercel が Git 連携なら push で本番更新）。
4. [ ] （任意）**走行画面に地図** — `GoogleMapCanvas` を `RunActiveClient` に戻す。時間がなければデモは計画画面の地図で説明でも可。
5. [ ] **10 分デモ用の固定手順** — クリック順をメモに1本化（毎回同じ画面になるように）。

## 発表資料

6. [ ] スライド骨子（課題 → RUNdio → 画面流れ → デモ → 技術 → まとめ）。
7. [ ] 主要画面のスクショ（LP・ホーム・計画・走行・完了）。
8. [ ] 時間配分（例: 話 6 分 + デモ 3 分 + 質疑 1 分）。

## 参照

- 正規 URL・フォルダの説明: [CANONICAL.md](./CANONICAL.md)
- エージェント向け全体: [AGENT_HANDOFF.md](./AGENT_HANDOFF.md)
