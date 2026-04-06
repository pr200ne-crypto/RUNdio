# エージェント引き継ぎ：RUNdio デモ音声パイプライン（NotebookLM / ElevenLabs）

**目的**: 別エージェントが **文脈なし**で音声まわりを継続できるようにする。  
**前提ハンドオフ**: まず [`AGENT_HANDOFF.md`](./AGENT_HANDOFF.md) と [`continuation-checkpoint-2026-04-04.md`](./continuation-checkpoint-2026-04-04.md) を読む。  
**版**: 1.0（2026-04-04）

---

## 1. 方針（合意済み）

| 項目 | 内容 |
|------|------|
| アプリからのリアルタイム生成 | **しない**。課題コスト・構成の都合で、**事前生成した音声ファイル**（mp3 等）をデモでイベント再生する。 |
| 「ラジオっぽさ」 | **サービス画面のビジュアルで無理に再現しない**方針がユーザー合意。ラジオ感は **台本・音声**側で担保（プロンプトで指示）。 |
| Web デモの実装場所 | `demo-implementation/`（Next.js 15）。音声は `public/audio/`。距離キューは `lib/demo-audio.ts`（マイルストーン km、プレースホルダーはビープ）。 |
| NotebookLM | Audio Overview は **要約・解説寄り**になりやすく、ユーザー体感では「ラジオ感」が出にくい。代替として **ElevenLabs Eleven v3 / Text to Dialogue** を推奨ルートとしてドキュメント化済み。 |

---

## 2. ファイル一覧（`docs/prompts/`）

| ファイル | 役割 |
|----------|------|
| [`notebooklm_demo_audio_scenario_prompts.md`](./prompts/notebooklm_demo_audio_scenario_prompts.md) | NotebookLM 用。**§2** をソース、**§3** をカスタム指示。ラジオ体裁・オープニング・音声のみスコープ（UI 指示禁止）を **版 1.2** で明文化済み。 |
| [`elevenlabs_rundio_dialogue_master_prompt.md`](./prompts/elevenlabs_rundio_dialogue_master_prompt.md) | ElevenLabs 向けの **説明・§A システムプロンプト（コードブロック）**・タグ表・チェックリスト。**版 1.1**。 |
| [`elevenlabs_rundio_dialogue_UPLOAD.txt`](./prompts/elevenlabs_rundio_dialogue_UPLOAD.txt) | **ソースアップロード用**の平文。ChatGPT プロジェクト / NotebookLM ソースなど **貼り付け欄が短い・長文をファイルで渡したい**ときに使う。 |
| [`elevenlabs_rundio_dialogue_PASTE_UNDER1000JP.txt`](./prompts/elevenlabs_rundio_dialogue_PASTE_UNDER1000JP.txt) | **約 470 字**の超圧縮要約。**1000 字制限の欄**用（※本来は「台本を書く AI」向け。ElevenLabs の短い欄用ではない）。 |

---

## 3. 作業フロー（推奨：ElevenLabs）

1. **台本生成**  
   - `elevenlabs_rundio_dialogue_UPLOAD.txt` を ChatGPT / Claude / Gemini の**ソースまたはシステム指示**に載せる。  
   - または `elevenlabs_rundio_dialogue_master_prompt.md` の **§A**（コードブロック内）をコピーする。  
   - 出力させるのは **`Speaker 1:` / `Speaker 2:` 形式の連続台本のみ**（章見出し行なし、ナレーション説明なし）。

2. **ElevenLabs**  
   - ログイン後 **Text to Speech** 系画面で **モデル Eleven v3** を選択。  
   - **Dialogue / マルチスピーカー**に相当するモードがあれば選択。  
   - **広い本文入力欄**に、手順 1 で得た台本を貼る。  
   - **Speaker 1 / 2 に別々の声**を割り当て、生成して mp3 を書き出す。  
   - **注意**: 画面によって **短い「説明・指示」欄（例: 1000 字制限）**があるが、そこは別用途。**長い台本は大きいテキスト欄**に貼る。指示書（UPLOAD.txt 全文）を ElevenLabs に貼るのは誤り（TTS が読み上げようとするのは「セリフ」）。

3. **デモ結合**  
   - ファイルを `demo-implementation/public/audio/` に配置（分割なら `opening.mp3` / `km3.mp3` 等）。  
   - `lib/demo-audio.ts` のマイルストーンとファイル名を整合させる。

---

## 4. 技術メモ（Eleven v3）

- **Text to Dialogue は v3 のみ**（公式ドキュメント）。  
- 感情・間: **英語の角括弧 audio tags**（例: `[warmly]` `[giggling]` `[pause]`）。**SSML break は使わない**。  
- 長文は **分割生成 → 結合**が安全。  
- 公式: [Text to Dialogue](https://elevenlabs.io/docs/capabilities/text-to-dialogue) · [Prompting Eleven v3](https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices#prompting-eleven-v3)

---

## 5. フロント（触るときの注意）

- ホームは **シンプル**（`AppHeader` + 導線）。ユーザー要望により **放送局風の重いオープニング UI は採用しない**（試作後に撤回済み）。  
- 地図は Leaflet + OSM、`RunMapLoader` で `dynamic(..., { ssr: false })`。走行画面は `RunActiveClient` を同様に遅延読み込み。

---

## 6. 再開プロンプト例（ユーザーが新チャットに貼る用）

```text
@docs/AGENT_HANDOFF.md と @docs/AGENT_HANDOFF_AUDIO_ELEVENLABS.md を読んで RUNdio の音声まわりを継続して。
ElevenLabs 用台本の改善、public/audio との連携、または notebooklm / elevenlabs のプロンプト修正が必要なら docs/prompts/ 内の該当ファイルだけ編集して。
```

---

**メンテ**: プロンプトやフローを変えたら、本書の「ファイル一覧」「フロー」「版」を同期すること。
