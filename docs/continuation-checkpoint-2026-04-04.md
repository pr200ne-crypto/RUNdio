# 続き・エージェント向けチェックポイント（2026-04-04）

別チャット／別エージェントが **文脈なしで続き**をするための要約。**まず** [`AGENT_HANDOFF.md`](./AGENT_HANDOFF.md) を読み、本書で差分と「いまの位置」を補足する。

---

## 1. いまの状態（ユーザー作業中含む）

| 項目 | 状態 |
|------|------|
| **プロダクト名** | **RUNdio**（英語）／**ランディオ**（日本語）。キャッチ: **ラン×レディオ：あなただけのランニング用ラジオ** |
| **ブランディング** | **RUNdio** を正式名称とする。コンセプトは「ラジオ番組」軸（コンシェルジュは使わない） |
| **フォルダ** | **GitHub** と同じ構成は [pr200ne-crypto/RUNdio](https://github.com/pr200ne-crypto/RUNdio)（ルート直下に `demo-implementation/`）。手元は **`runradio/sample_project/demo-implementation`** を正とする。別コピーの `RUNdio` は触らない |
| **要件** | **`docs/output/system_requirements.md`** / **`detailed_requirements_specification.md`** は **版 0.2**（Web デモ・Leaflet+OSM・POI モック・疑似走行・低コスト音声） |
| **NotebookLM** | ユーザーが **Audio Overview 作成中**（待ち時間あり）。仕様は下記プロンプトファイル |

---

## 2. NotebookLM デモ音声（この会話で決めたこと）

- **方針**: アプリから NotebookLM API でリアルタイム生成はしない。**事前に生成した会話調音声**（mp3 等）をデモでイベント再生する。
- **マスタープロンプト（ソース＋カスタム指示）**:  
  **`docs/prompts/notebooklm_demo_audio_scenario_prompts.md`**
  - **§2** を NotebookLM のソースにコピー（仕様書ブロック全体）
  - **§3** をチャット等のカスタム指示にコピー
- **生成後の作業（未完了になりうる）**:
  1. 音声ファイルを取得（ダウンロード可ならそれ／不可なら規約の範囲で録音・編集）
  2. 長尺なら **オープニング／3km／6km／チェックポイント／フィニッシュ** などに分割（仕様書の章に対応）
  3. `demo-implementation/public/audio/` 等に配置
  4. 疑似ランの経過距離・時間で `HTMLAudioElement` 等を再生（要件 0.2 と整合）

---

## 3. Audio Overview 待ちのあいだに進められること

優先度は上から。

1. **Next.js 土台** — `demo-implementation/` は断片のみの可能性あり。`create-next-app` 等で App Router プロジェクトを整え、要件 0.2 の画面フロー（ホーム→計画→POI→確認→走行→完了）の **空ルートだけ**先に切る。
2. **モックデータ** — `public/data/pois.json`（入浴カテゴリ）、プリセットルートの座標／Polyline 文字列のたたき台。
3. **地図** — Leaflet + OSM タイル、**帰属表示**（[OpenStreetMap の著作権](https://www.openstreetmap.org/copyright) 等）を README か画面フッタに記載。
4. **疑似ラン** — `requestAnimationFrame` または `setInterval` で距離・経過時間を進めるモジュール、区切り（距離／時間）設定の state。
5. **音声プレースホルダ** — 無音 or 短いビープの mp3 を置き、`playAtKm(3)` のような API を先に定義。NotebookLM 出力が来たら差し替え。
6. **設計の短文化** — `docs/prompts/regular_prompts/3_generate_detailed_design_files_prompt.md` に従い、**モック前提**で画面一覧・シーケンスだけの薄い設計メモを `docs/output/` に追加してもよい（必須は課題次第）。

---

## 4. 次エージェントの推奨タスク順（実装寄り）

1. `README.md`（リポジトリ直下）と `docs/input/README.md` で **RUNdio / 版 0.2** が矛盾していないか確認。  
2. **`detailed_requirements_specification.md`（0.2）** の画面 ID に沿って Web デモを実装。  
3. NotebookLM 音声が揃い次第、`public/audio` に配置して走行画面から再生。  
4. 10 分発表用に **固定シード**（同じクリック順で同じ見え方）を確保。  
5. スライドはユーザー側だが、**キャプチャすべき画面リスト**を `continuation` 末尾に追記してもよい。

---

## 5. 主要ファイル一覧（ルート相対）

| パス | 内容 |
|------|------|
| `README.md` | プロジェクト入口 |
| `docs/AGENT_HANDOFF.md` | ハンドオフ本編 |
| **本ファイル** | 続き用・NotebookLM 待ち・並行作業 |
| `docs/output/system_requirements.md` | システム要件 **0.2** |
| `docs/output/detailed_requirements_specification.md` | 詳細要件 **0.2** |
| `docs/prompts/notebooklm_demo_audio_scenario_prompts.md` | NotebookLM 用マスター仕様 §2・§3 |
| `docs/input/README.md` | 要件入力索引 |
| `demo-implementation/` | Next.js 拡張想定（要整備） |

---

## 6. 再開プロンプト例（ユーザーが新チャットに貼る用）

```text
@docs/AGENT_HANDOFF.md と @docs/continuation-checkpoint-2026-04-04.md を読んで RUNdio を再開して。
要件 0.2 の Web デモ実装を進めて。NotebookLM の音声は後から public/audio に置く前提でプレースホルダ再生でもよい。
```

---

**版**: 1.0（2026-04-04）
