# Firebase Hosting Test with PostgreSQL

Next.js + Prisma + PostgreSQL (Cloud SQL対応) のサンプルプロジェクト

## 🚀 プロジェクト概要

このプロジェクトは、フロントエンドをFirebase App Hostingでデプロイし、データベースをGoogle Cloud SQLでデプロイする練習用プロジェクトです。

### 技術スタック

- **フロントエンド**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **データベース**: PostgreSQL (Cloud SQL)
- **ORM**: Prisma
- **デプロイ**: Firebase App Hosting (フロントエンド), Google Cloud SQL (データベース)

## 📁 プロジェクト構造

```
firebasehostingtest/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── db-test/route.ts    # データベース接続テスト
│   │   │   ├── users/route.ts      # ユーザー API
│   │   │   └── posts/route.ts      # 投稿 API
│   │   └── page.tsx                # メインページ
│   └── lib/
│       └── prisma.ts               # Prisma クライアント
├── prisma/
│   ├── schema.prisma               # データベーススキーマ
│   └── seed.ts                     # シードデータ
├── .env                            # 環境変数
└── package.json
```

## 🔧 ローカル開発セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. PostgreSQLの準備

#### Dockerを使用する場合:
```bash
# PostgreSQL コンテナを起動
docker run --name postgres-dev \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=firebasehostingtest_dev \
  -p 5432:5432 \
  -d postgres:15
```

#### ローカルPostgreSQLを使用する場合:
```bash
# データベースを作成
createdb firebasehostingtest_dev
```

### 3. 環境変数の設定

`.env`ファイルを編集:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/firebasehostingtest_dev"
```

### 4. データベースのセットアップ

```bash
# Prisma クライアント生成
npm run db:generate

# データベーススキーマをプッシュ
npm run db:push

# シードデータの投入
npm run db:seed
```

### 5. 開発サーバー起動

```bash
npm run dev
```

## ☁️ Cloud SQLへのデプロイ

### 1. Google Cloud Projectの準備

```bash
# Google Cloud CLIでログイン
gcloud auth login

# プロジェクトを設定
gcloud config set project YOUR_PROJECT_ID

# Cloud SQL APIを有効化
gcloud services enable sqladmin.googleapis.com
```

### 2. Cloud SQL インスタンスの作成

```bash
# PostgreSQL インスタンスを作成
gcloud sql instances create firebasehostingtest-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=asia-northeast1 \
  --storage-type=SSD \
  --storage-size=10GB \
  --storage-auto-increase

# データベースを作成
gcloud sql databases create firebasehostingtest \
  --instance=firebasehostingtest-db

# ユーザーを作成
gcloud sql users create appuser \
  --instance=firebasehostingtest-db \
  --password=YOUR_SECURE_PASSWORD
```

### 3. 認証IP設定

```bash
# 現在のIPアドレスを許可（開発時のみ）
gcloud sql instances patch firebasehostingtest-db \
  --authorized-networks=YOUR_IP_ADDRESS/32

# または、Cloud SQL Proxyを使用（推奨）
gcloud sql instances patch firebasehostingtest-db \
  --assign-ip
```

### 4. 接続文字列の更新

Cloud SQL インスタンスの接続情報を取得:
```bash
gcloud sql instances describe firebasehostingtest-db
```

`.env`ファイルを更新:
```env
# Cloud SQL 接続文字列
DATABASE_URL="postgresql://appuser:YOUR_SECURE_PASSWORD@INSTANCE_IP:5432/firebasehostingtest"
```

### 5. データベースマイグレーション

```bash
# 本番データベースにスキーマをプッシュ
npm run db:push

# シードデータの投入（オプション）
npm run db:seed
```

## 🔥 Firebase App Hostingへのデプロイ

### 1. Firebase プロジェクトの準備

```bash
# Firebase CLIのインストール
npm install -g firebase-tools

# Firebase にログイン
firebase login

# Firebase プロジェクトを初期化
firebase init hosting
```

### 2. firebase.json の設定

```json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ]
  }
}
```

### 3. 本番ビルド & デプロイ

```bash
# 本番用ビルド
npm run build

# Firebase にデプロイ
firebase deploy
```

## 📊 API エンドポイント

### データベース接続テスト
- `GET /api/db-test` - データベース接続状態を確認

### ユーザー管理
- `GET /api/users` - ユーザー一覧取得
- `POST /api/users` - ユーザー作成
  ```json
  {
    "email": "user@example.com",
    "name": "User Name",
    "userType": "USER"
  }
  ```

### 投稿管理
- `GET /api/posts` - 投稿一覧取得
- `POST /api/posts` - 投稿作成
  ```json
  {
    "title": "Post Title",
    "content": "Post content",
    "authorId": "user-uuid",
    "categoryIds": ["category-uuid"]
  }
  ```

## 🔍 データベーススキーマ

主要なテーブル:
- `users` - ユーザー情報
- `posts` - 投稿情報
- `comments` - コメント情報
- `categories` - カテゴリー情報
- `post_categories` - 投稿とカテゴリーの関連

詳細は `prisma/schema.prisma` を参照してください。

## 🛠️ 便利なコマンド

```bash
# Prisma Studio でデータを確認
npm run db:studio

# データベースリセット
npx prisma migrate reset

# スキーマ変更時のマイグレーション
npm run db:migrate

# 型定義の再生成
npm run db:generate
```

## 🔒 セキュリティ

### 本番環境での注意点

1. **データベース認証情報**: 環境変数で管理し、コードにハードコードしない
2. **ネットワークセキュリティ**: Cloud SQL のIP制限を適切に設定
3. **SSL接続**: 本番環境では必ずSSL接続を使用
4. **API認証**: 本番アプリケーションでは適切な認証機能を実装

### 環境変数の管理

本番環境では以下の環境変数を設定:
```env
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://your-domain.com"
```

## 🐛 トラブルシューティング

### データベース接続エラー
1. Cloud SQL インスタンスが起動しているか確認
2. 認証情報が正しいか確認
3. ネットワーク設定（IP制限）を確認

### デプロイエラー
1. ビルドエラーがないか確認
2. 環境変数が正しく設定されているか確認
3. Firebase プロジェクト設定を確認

## 📝 ライセンス

MIT License
