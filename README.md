# RUNdio（ランディオ）

- **英語表記（サービス名）**: RUNdio  
- **日本語**: ランディオ  
- **キャッチコピー**: ラン×レディオ：あなただけのランニング用ラジオ

## ドキュメント

- 要件入力の索引: [docs/input/README.md](docs/input/README.md)
- エージェント向けハンドオフ: [docs/AGENT_HANDOFF.md](docs/AGENT_HANDOFF.md)

## 実装（本体）

アプリのソースは **`demo-implementation/` のみ** です。ルートの `docs/` は仕様・ハンドオフ用です。

Cursor で **`RUNdio` フォルダを開いた場合**も、Next.js の編集対象は `demo-implementation/` 配下です（ルートに別コピーの `app/` 等は置かないでください）。

```bash
cd demo-implementation
npm install
npm run dev
```

詳細は [demo-implementation/README.md](demo-implementation/README.md) を参照。
