# システムアーキテクチャ設計 (RUNdio)

## 1. 技術スタック
本プロジェクトは、デモデイおよび将来の本番運用を見据え、以下のモダンな技術スタックを採用しています。

| レイヤー | 技術 | 選定理由 |
| :--- | :--- | :--- |
| **フロントエンド** | Next.js 15 (App Router) | 高速なレンダリング、SEO対応、開発効率の高さ。 |
| **言語** | TypeScript | 型安全性の確保によるバグの抑制と保守性の向上。 |
| **スタイリング** | Tailwind CSS | 迅速なUI構築とデザインの一貫性維持。 |
| **バックエンド** | Next.js API Routes | フロントエンドと同一リポジトリでの効率的なAPI開発。 |
| **データベース** | Supabase (PostgreSQL) | RLSによるセキュリティ、リアルタイム性、運用の容易さ。 |
| **認証** | Supabase Auth (SSR) | セッション管理の容易さとSupabase DBとの親和性。 |
| **ホスティング** | Vercel | Next.jsとの最高レベルの親和性と自動デプロイ。 |

## 2. アーキテクチャ概要図
```mermaid
flowchart TB
  subgraph Client [クライアント層]
    Browser[PC Browser]
    subgraph UI [UI 構成]
      LP[Landing Page]
      App[Mobile Frame App]
    end
  end

  subgraph Hosting [ホスティング層]
    Vercel[Vercel Edge / Serverless]
  end

  subgraph Backend [バックエンド層]
    API[Next.js API Routes]
    Middleware[Next.js Middleware]
  end

  subgraph Data [データ層]
    SB_Auth[Supabase Auth]
    SB_DB[(Supabase DB)]
    SB_RLS[RLS Policies]
  end

  subgraph External [外部サービス]
    OSM[OpenStreetMap / Leaflet]
    WebSpeech[Web Speech API]
    GMap[Google Maps API 予定]
  end

  Browser --> LP
  Browser --> App
  LP & App --> Middleware
  Middleware --> API
  API --> SB_Auth
  API --> SB_DB
  SB_DB --- SB_RLS
  App --> OSM
  App --> WebSpeech
```

## 3. コンポーネント設計
Next.js の Server Components と Client Components を適切に使い分け、パフォーマンスとインタラクティブ性を両立させています。

### 階層構造
```mermaid
flowchart TD
  Root[Root Layout] --> Providers[Providers]
  Providers --> MobileFrame[MobileFrame - Client]
  MobileFrame --> Pages[Page Components]
  
  subgraph Common [共通コンポーネント]
    Map[LeafletMap - Client]
    Audio[AudioController - Client]
  end
```

### 主要コンポーネントの方針
- **MobileFrame**: PCブラウザ上でスマホアプリの体験を模倣するための外枠。パスに応じてLP表示とアプリ表示を切り替えます。
- **LeafletMap**: クライアントサイドでのみレンダリングされる動的地図コンポーネント。
- **WebSpeechQueue**: 音声通知を管理するキューシステム。
