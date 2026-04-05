# エージェント向けハンドオフ（次回再開用）

**最終更新**: 2026-04-04 — `docs/output/system_requirements.md` / `detailed_requirements_specification.md` を **版 0.2（Web デモ・低コスト）** に同期済み。  
**プロジェクトルート（目安）**: フォルダ名 **`RUNdio/`**（リポジトリ直下に `docs/`・`demo-implementation/` がある構成）。旧パス `go!cierge` / `sample_project (1)/sample_project/` は使わない。

このファイルは **別チャット／別エージェント** が文脈なしで再開するための要約である。詳細はリンク先のドキュメントを読むこと。

---

## 1. プロジェクトの性質（必ず読む）

| 項目 | 内容 |
|------|------|
| **目的** | **商業化ではない**。課題・学習・提出用。 |
| **デモ形式** | **PC 上のブラウザ**で開発したサービスを見せる。併せて **AI で作成した説明スライド**で **約 10 分**話す。 |
| **コスト方針** | **有料 API 連携で高額にならないようにする**。課題レベルでは **モックデータ・無料枠・ブラウザ標準機能**を優先する想定。 |
| **クライアント方針** | 「PC ブラウザデモ」が本丸のため、**MVP の主クライアントは Web（例: Next.js）**が自然。**Expo / ネイティブ**は「スマホ実機アプリが課題要件」の場合の話。Expo と Web を混同しないこと。 |

---

## 2. プロダクト概要（RUNdio / ランディオ）

- **サービス名（英語表記）**: **RUNdio**  
- **サービス名（日本語）**: **ランディオ**  
- **キャッチコピー**: **ラン×レディオ：あなただけのランニング用ラジオ**（ラジオ番組のようなトーンで伝える想定）  
- **コンセプト**: 走前に今日の「番組」を組む（ルート・チェックポイント）→ 走中は **あなた専用のランニング用ラジオ**（数値・励まし・オープニング／中盤／終盤など番組的な流れ）→ 走後は振り返りと次回の提案。
- **課題**: ソロランのマンネリ、モチベ維持、走行中の楽しさ。
- **合意した機能の核**:
  - ルート上の距離軸で **条件検索**（MVP は施設カテゴリ **少なくとも 1 つ**、例: 入浴施設）でチェックポイント選定。
  - 走中 **音声**が最重要品質目標（自然な人間的な話し言葉を目指すが、課題デモでは **Web Speech API や短いダミー音声**でも可）。
  - **区切り基準**はユーザーが **距離**または **時間**を選択可能。
  - **Garmin 等は必須にしない**。スマホ単体想定だったが、**提出デモはブラウザ優先**に寄せるなら **疑似ラン／再生デモ**でよい。
  - **Google Fit 等**は詳細未決。**拡張フックだけ**でよい。
- **明示的除外**: **食べログ連動・飲食店紹介**（以前案）は **採用しない**。

---

## 3. 既に存在する成果物（パスはリポジトリルート相対）

### 要件入力（`docs/input/`）

| ファイル | 役割 |
|----------|------|
| `README.md` | プロジェクト概要・ドキュメント索引 |
| `conversation-checkpoint-2026-04-03.md` | 対話での合意事項サマリー |
| `business-requirements.md` | ビジネス要件（[仮] 多い） |
| `user-personas.md` | ペルソナ |
| `product-requirements.md` | プロダクト要件 |
| `user-flows.md` | ユーザーフロー |
| `feature-list.md` | 機能一覧・MoSCoW 風 |
| `mvp-scope.md` | MVP 範囲 |
| `ui-ux-direction.md` | UI/UX 方針 |

### 出力（`docs/output/`）

| ファイル | 役割 |
|----------|------|
| `system_requirements.md` | システム要件定義（版 0.1 ドラフト） |
| `detailed_requirements_specification.md` | 詳細要件定義（テンプレ準拠、版 0.1 ドラフト、Mermaid・API 例あり） |

### プロンプト・テンプレ（`docs/prompts/`, `docs/template/`）

- `regular_prompts/0_bussiness-requirements-prompt.md` … ビジネス要件対話用  
- `regular_prompts/1_system-requirements-prompt.md` … `system_requirements.md` 生成手順  
- `regular_prompts/2_detailed_requirements_prompt.md` … 詳細要件生成手順  
- `regular_prompts/3_generate_detailed_design_files_prompt.md` … **次に進むなら設計ドキュメント**  
- `regular_prompts/4.frontend-implementation-prompt.md` … フロント実装用  
- `template/Requirements_Specification_Template.md` … 詳細要件の型  

### 既存コード（参考）

- `demo-implementation/` … Next.js / Supabase サンプル。**課題デモはここを拡張するか、別ブランチで Web デモを作るかは未決**。

---

## 4. 詳細要件ドキュメントと「課題デモ」のギャップ

`detailed_requirements_specification.md` には **モバイル（RN/ネイティブ）優先**の記述と **有料 Maps/TTS** の候補が **(仮定)** として含まれる。

**次エージェント向け（版 0.2 反映済み）:**

1. **提出形態**: `docs/input/README.md` 先頭にブラウザデモ記載あり。出力要件は **Web MVP** に寄せ **版 0.2** とした。  
2. **API**: `system_requirements.md` / `detailed_requirements_specification.md` に **Leaflet + OSM（帰属遵守）**、**POI は JSON モック** を明記。  
3. **「走行中」デモ**: 実 GPS 必須とせず **タイマー／疑似進行／プログレス** で要件化済み。

---

## 5. 推奨される「次の作業」順序

1. ~~**スコープ宣言を 1 ファイルに固定**~~ — 本ファイル＋ `docs/input/README.md` で固定。  
2. ~~**要件 0.2**~~ — **完了**（Web・低コスト・疑似走行）。  
3. **`3_generate_detailed_design_files_prompt.md` に従い設計書**（画面・API・DB を「モック前提」で簡略化）— **次の実装前ステップ**。  
4. **`demo-implementation` または新規 Next.js ルート**で、**10 分発表用のクリックデモ**を実装。  
5. スライド用に **画面キャプチャ用の安定したデモパス**（シードデータ）を用意。

---

## 6. 再開時にユーザーへ確認するとよいこと（未確定）

- 課題の **必須技術スタック**（Expo 必須か、Web のみでよいか）。  
- **チーム人数**と**提出物**（ソースのみか、デプロイ URL 必須か）。  
- **個人情報・位置情報**を扱うか（モックのみならプライバシー説明が簡潔になる）。

---

## 7. このファイルの使い方（次エージェント向け）

新しいチャットでは、ユーザーに次を貼ってもらうか、最初のメッセージで参照させる:

> `@docs/AGENT_HANDOFF.md` を読み、このプロジェクトを再開してください。

その後 **`docs/output/detailed_requirements_specification.md`** と **`docs/input/mvp-scope.md`** を読み、**課題デモ（ブラウザ・低コスト）**に合わせて差分を提案・実装すること。
