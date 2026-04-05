# API 仕様書 (RUNdio)

## 1. 設計原則
- **RESTful API**: リソースに基づいた直感的なエンドポイント設計。
- **認証**: Supabase Auth (JWT) による認証。全てのAPIリクエストは認証済みである必要があります。
- **レスポンス形式**: JSON形式。

## 2. 認証・認可
APIへのアクセスは、Supabaseのクライアントライブラリを通じて行われます。
サーバーサイド（API Routes）では、`cookies()` を使用してセッションを確認します。

## 3. エンドポイント一覧

### 走行セッション管理

#### POST `/api/sessions`
走行セッションの保存を行います。

- **Request Body**:
```json
{
  "route_id": "uuid",
  "distance_meters": 5000,
  "duration_seconds": 1800,
  "poi_id": "bath-001"
}
```

- **Response (200 OK)**:
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "route_id": "uuid",
    "distance_meters": 5000,
    "duration_seconds": 1800,
    "poi_id": "bath-001",
    "created_at": "2026-04-05T12:00:00Z"
  }
]
```

#### GET `/api/sessions`
ログインユーザーの走行履歴を一覧取得します。

- **Response (200 OK)**:
```json
[
  {
    "id": "uuid",
    "distance_meters": 5000,
    "duration_seconds": 1800,
    "created_at": "2026-04-05T12:00:00Z"
  },
  ...
]
```

### ルート管理

#### GET `/api/routes` (将来拡張予定)
利用可能なルート一覧を取得します。

---

## 4. エラーレスポンス
| ステータスコード | 意味 | 原因 |
| :--- | :--- | :--- |
| 401 | Unauthorized | 認証トークンが無効または欠落している。 |
| 400 | Bad Request | リクエストボディの形式が正しくない。 |
| 500 | Internal Server Error | サーバー内部またはデータベースのエラー。 |
