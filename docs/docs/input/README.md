# ランディオ（RUNdio）

**英語表記（サービス名）**: RUNdio

> **ラン×レディオ：あなただけのランニング用ラジオ**

> **別エージェント／次回チャット用の要約**: [`../AGENT_HANDOFF.md`](../AGENT_HANDOFF.md) を先に読むこと（課題提出・ブラウザデモ・低コスト方針を記載）。

## 概要

**RUNdio（ランディオ）**は、走る前のプランニングから走行中の**あなた専用のランニング用ラジオ**、走後の振り返り・次回提案までを一続きで届けるプロダクトの要件入力です。  
**課題提出向け**: 実運用の商業化は前提とせず、**PC ブラウザ上のデモ**＋**約10分のスライド発表**を想定。有料 API は極力使わない方針。

## 解決する課題

一人ランにおける**練習のマンネリ**、**モチベーションの維持**、走っている時間の**楽しさ**。

## ターゲット（たたき台）

ソロで継続的に走るランナー。スマホでアプリを利用し、イヤホンで音声フィードバックを受け取る想定。ウェアラブルは任意。

## 主要機能（要約）

- ルートに沿った**条件検索**（例：ルート前方の施設カテゴリ）によるプランニング支援
- 走行中の**音声フィードバック**（数値・励まし・番組的な流れ・他オーディオとの共存設計）
- **距離／時間**いずれかを選べる**区切り・通知**基準
- 走後の**振り返り**と**次セッションの提案**
- [将来] **Google Fit** 等ヘルスプラットフォーム連携の**拡張余地**

## ドキュメント構成

| ファイル | 内容 |
|----------|------|
| [conversation-checkpoint-2026-04-03.md](./conversation-checkpoint-2026-04-03.md) | 対話の区切りと合意事項のサマリー |
| [business-requirements.md](./business-requirements.md) | ビジネス要件（[仮] 含む） |
| [user-personas.md](./user-personas.md) | ペルソナ |
| [product-requirements.md](./product-requirements.md) | プロダクト要件 |
| [user-flows.md](./user-flows.md) | ユーザーフロー |
| [feature-list.md](./feature-list.md) | 機能一覧・優先度 |
| [mvp-scope.md](./mvp-scope.md) | MVP 範囲 |
| [ui-ux-direction.md](./ui-ux-direction.md) | UI/UX 方針 |

## 次のステップ（詳細要件）

1. 上記 `docs/input` を更新しながら不足を埋める。  
2. ~~`docs/output/system_requirements.md` を作成~~ → **[版 0.2 まで更新済み](../output/system_requirements.md)**（Web デモ・Leaflet/OSM・モック POI・疑似走行）。  
3. ~~`docs/output/detailed_requirements_specification.md` をテンプレートに沿って作成~~ → **[版 0.2 まで更新済み](../output/detailed_requirements_specification.md)**。  
4. **次**: `docs/prompts/regular_prompts/3_generate_detailed_design_files_prompt.md` → `demo-implementation/` でクリックデモ実装。
