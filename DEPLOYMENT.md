# Firebase App Hosting + Cloud SQL デプロイ手順

## 🗄️ Cloud SQL設定（すでに完了済み）

✅ PostgreSQLインスタンス作成済み
✅ データベース接続確認済み

## 🚀 Firebase App Hostingデプロイ手順

### 1. Firebase Consoleでの環境変数設定

Firebase Console → App Hosting → Backend → 環境変数 で以下を設定：

#### DATABASE_URL
```
postgresql://ユーザー名:パスワード@Cloud_SQL_IP:5432/データベース名?sslmode=require
```

**例:**
```
postgresql://appuser:your_password@34.85.123.456:5432/firebasehostingtest?sslmode=require
```

#### NEXTAUTH_SECRET
```
your-production-nextauth-secret-here
```

#### NEXTAUTH_URL
```
https://your-app-domain.web.app
```

### 2. Cloud SQLへのスキーマデプロイ

#### オプション A: ローカルからCloud SQLにデプロイ

1. `.env.production`ファイルを実際の値で更新
2. 以下のコマンドを実行：

```bash
# 本番環境用の環境変数を読み込み
export $(cat .env.production | xargs)

# Prismaスキーマをプッシュ
npx prisma db push

# シードデータの投入（オプション）
npx prisma db seed
```

#### オプション B: Firebase App Hosting経由でデプロイ

1. スキーマデプロイ用のAPIエンドポイントを作成
2. デプロイ後にAPIを呼び出してスキーマを設定

### 3. Firebase App Hostingへのデプロイ

#### 自動デプロイ（推奨）
```bash
# mainブランチにプッシュすると自動デプロイ
git add .
git commit -m "Configure for Cloud SQL production"
git push origin main
```

#### 手動デプロイ
```bash
# Firebase CLIでデプロイ
firebase apphosting:backends:deploy BACKEND_NAME
```

## 🔧 接続確認

デプロイ後、以下のエンドポイントで接続を確認：

- `GET /api/db-test` - データベース接続テスト
- `GET /api/users` - ユーザー一覧（初期は空）
- `GET /api/posts` - 投稿一覧（初期は空）

## 🔒 セキュリティチェックリスト

- [ ] Cloud SQLのIPアドレス制限設定
- [ ] SSL接続の有効化 (`?sslmode=require`)
- [ ] Firebase Console環境変数の適切な設定
- [ ] 強力なパスワードの使用
- [ ] 認証情報の安全な保管

## 🐛 トラブルシューティング

### データベース接続エラー
1. Cloud SQLインスタンスの状態確認
2. IPアドレス制限の確認
3. 認証情報の確認
4. SSL設定の確認

### デプロイエラー
1. ビルドログの確認
2. 環境変数の設定確認
3. Firebase プロジェクト設定確認 