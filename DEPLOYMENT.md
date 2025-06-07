# Firebase App Hosting + Cloud SQL デプロイ完全ガイド

## 🎯 **プロジェクト概要**

このプロジェクトは **Next.js + Prisma + PostgreSQL** を使用したフルスタックWebアプリケーションです。

### **技術構成**
- **フロントエンド**: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **バックエンド**: Next.js API Routes
- **データベース**: PostgreSQL (Google Cloud SQL)
- **ORM**: Prisma
- **デプロイ**: 
  - フロントエンド: Firebase App Hosting
  - データベース: Google Cloud SQL

### **機能**
- ユーザー管理 (`/api/users`)
- 投稿管理 (`/api/posts`) 
- データベース接続テスト (`/api/db-test`)
- リアルタイムデータ表示

### **デプロイURL**
- **本番**: `https://firebasehostingtest--apphostingtest-5d399.asia-east1.hosted.app`
- **リポジトリ**: `https://github.com/rrrttt-rt/firebasehostingtest`

---

## 🗄️ **Cloud SQL設定（完了済み）**

### **インスタンス情報**
```
インスタンス名: cloudsql1
プロジェクト: formidable-sol-462116-v1
リージョン: asia-northeast1
パブリックIP: 35.194.111.166
```

### **データベース設定**
```
データベース名: postgres (デフォルト使用)
ユーザー名: postgres
パスワード: Pa$$w0rd
ポート: 5432
```

### **接続文字列**
```
postgresql://postgres:Pa$$w0rd@35.194.111.166:5432/postgres?sslmode=require
```

---

## 🚀 **デプロイ手順（実際に行った手順）**

### **Phase 1: Cloud SQLインスタンス作成**

#### **1. Google Cloud Consoleでインスタンス作成**
1. Google Cloud Console → SQL
2. 「インスタンスを作成」→ PostgreSQL
3. 設定:
   - **インスタンスID**: `cloudsql1`
   - **パスワード**: `Pa$$w0rd`
   - **リージョン**: `asia-northeast1`
   - **マシンタイプ**: `db-f1-micro`
   - **ストレージ**: `10GB SSD`

#### **2. ネットワーク設定**
1. 「接続」タブ
2. 「ネットワークを追加」
3. **名前**: `development`
4. **ネットワーク**: `0.0.0.0/0` (開発用、本番では制限必要)

### **Phase 2: Prismaスキーマのデプロイ**

#### **1. ローカル環境からCloud SQLに接続**
```bash
# 環境変数設定
export DATABASE_URL="postgresql://postgres:Pa\$\$w0rd@35.194.111.166:5432/postgres?sslmode=require"

# スキーマをCloud SQLにプッシュ
npx prisma db push
```

#### **2. 作成されたテーブル**
- `users` - ユーザー情報
- `posts` - 投稿情報  
- `comments` - コメント情報
- `categories` - カテゴリー情報
- `post_categories` - 投稿-カテゴリー関連

### **Phase 3: Firebase App Hosting設定**

#### **1. apphosting.yamlの設定**
```yaml
runConfig:
  runtime: nodejs20
  cpu: 1
  memoryMiB: 512
  minInstances: 0
  maxInstances: 10
  concurrency: 80

env:
  - variable: DATABASE_URL
    value: "postgresql://postgres:Pa$$w0rd@35.194.111.166:5432/postgres?sslmode=require"
  - variable: NEXTAUTH_SECRET
    value: "firebasehosting-secret-key-32chars-min-2024"
  - variable: NEXTAUTH_URL
    value: "https://firebasehostingtest--apphostingtest-5d399.asia-east1.hosted.app"
```

#### **2. Firebase App Hosting情報**
```
バックエンド名: firebasehostingtest
リージョン: asia-east1
ドメイン: firebasehostingtest--apphostingtest-5d399.asia-east1.hosted.app
自動デプロイ: mainブランチへのプッシュで自動実行
```

### **Phase 4: デプロイ実行**

#### **1. コードのプッシュ**
```bash
# 変更をコミット
git add .
git commit -m "Configure for Cloud SQL production deployment"

# mainブランチにマージ・プッシュ
git checkout main
git merge develop
git push origin main
```

#### **2. 自動デプロイ**
- GitHubへのプッシュでFirebase App Hostingが自動検知
- `apphosting.yaml`に基づいてビルド・デプロイ実行
- Cloud Runにコンテナがデプロイされる

---

## 🔧 **API エンドポイント**

### **データベース接続テスト**
```
GET /api/db-test
レスポンス: {"status": "success", "message": "Database connected successfully"}
```

### **ユーザー管理**
```
GET /api/users
POST /api/users
{
  "email": "user@example.com",
  "name": "User Name", 
  "userType": "USER"
}
```

### **投稿管理**
```
GET /api/posts
POST /api/posts
{
  "title": "Post Title",
  "content": "Post content",
  "authorId": "user-uuid",
  "categoryIds": ["category-uuid"]
}
```

---

## 🔒 **セキュリティ設定**

### **現在の設定（開発環境）**
- Cloud SQL: 全IPからアクセス可能 (`0.0.0.0/0`)
- 認証: postgresスーパーユーザー使用
- 環境変数: apphosting.yamlに直接記載

### **本番環境推奨設定**
```yaml
# より安全な設定例
env:
  - variable: DATABASE_URL
    secret: DATABASE_URL  # Firebase Consoleでシークレット管理
  - variable: NEXTAUTH_SECRET
    secret: NEXTAUTH_SECRET
```

#### **Cloud SQL本番設定**
1. **IP制限**: 特定のIPアドレスのみ許可
2. **専用ユーザー**: アプリ専用ユーザー作成
3. **SSL証明書**: クライアント証明書認証
4. **VPC**: プライベートIP接続

---

## 🐛 **トラブルシューティング**

### **よくあるエラーと解決法**

#### **1. "シークレットの構成に誤り"**
```
Error: Error resolving secret version with name=projects/.../secrets/DATABASE_URL
```
**解決法**: `apphosting.yaml`で`secret:`ではなく`value:`を使用

#### **2. データベース接続エラー**
```
Error: getaddrinfo ENOTFOUND
```
**解決法**: 
- Cloud SQLインスタンスが起動しているか確認
- IPアドレスが正しいか確認
- パスワードに特殊文字がある場合はエスケープ

#### **3. Prismaスキーマエラー**
```
Error: P3009 migrate.lock file is missing
```
**解決法**: `npx prisma db push`を使用（マイグレーションファイル不要）

### **デバッグコマンド**
```bash
# データベース接続テスト
npx prisma db push --preview-feature

# ローカルでの動作確認
npm run dev

# ビルドテスト
npm run build
```

---

## 📊 **監視・メンテナンス**

### **Firebase Console確認項目**
1. App Hosting → ビルドログ
2. エラー発生状況
3. リクエスト数・レスポンス時間

### **Cloud SQL監視**
1. Google Cloud Console → SQL → cloudsql1
2. CPU使用率・メモリ使用率
3. 接続数・クエリ性能

### **バックアップ設定**
- 自動バックアップ: 有効
- ポイントインタイムリカバリ: 有効
- バックアップ保持期間: 7日間

---

## 📈 **スケーリング設定**

### **Firebase App Hosting**
```yaml
runConfig:
  minInstances: 0      # コスト最適化
  maxInstances: 10     # 負荷対応
  concurrency: 80      # 同時リクエスト数
```

### **Cloud SQL**
- 現在: `db-f1-micro` (1vCPU, 0.6GB RAM)
- スケールアップ可能: `db-custom-2-7680` まで

---

## 💰 **コスト管理**

### **予想コスト（月額）**
- Firebase App Hosting: 無料枠内
- Cloud SQL: 約$7-15 (f1-micro)
- ストレージ: 約$1-2 (10GB)

### **コスト削減のコツ**
1. 使用しない時はインスタンス停止
2. ストレージ自動増加の監視
3. 不要なバックアップデータの削除

---

## 🔄 **継続的デプロイメント**

### **現在の設定**
```
GitHub (main) → Firebase App Hosting → 自動デプロイ
```

### **デプロイフロー**
1. 開発: `develop`ブランチで作業
2. テスト: ローカルでビルド確認
3. リリース: `main`ブランチにマージ
4. デプロイ: Firebase App Hostingが自動実行

### **ロールバック方法**
1. Firebase Console → App Hosting
2. 過去のデプロイバージョンを選択
3. 「このバージョンを推進」をクリック 