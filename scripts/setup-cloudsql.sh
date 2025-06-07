#!/bin/bash

# Cloud SQLセットアップスクリプト
# 使用前に以下の変数を設定してください

PROJECT_ID="your-project-id"
INSTANCE_NAME="firebasehostingtest-db"
DATABASE_NAME="firebasehostingtest"
DB_USER="appuser"
REGION="asia-northeast1"

echo "🚀 Cloud SQLセットアップを開始します..."

# プロジェクトIDの確認
if [ "$PROJECT_ID" = "your-project-id" ]; then
    echo "❌ PROJECT_IDを設定してください"
    exit 1
fi

# Google Cloud プロジェクトを設定
echo "📋 プロジェクトを設定中..."
gcloud config set project $PROJECT_ID

# Cloud SQL APIを有効化
echo "🔧 Cloud SQL APIを有効化中..."
gcloud services enable sqladmin.googleapis.com

# PostgreSQLインスタンスを作成
echo "🐘 PostgreSQLインスタンスを作成中..."
gcloud sql instances create $INSTANCE_NAME \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=$REGION \
    --storage-type=SSD \
    --storage-size=10GB \
    --storage-auto-increase

# データベースを作成
echo "💾 データベースを作成中..."
gcloud sql databases create $DATABASE_NAME \
    --instance=$INSTANCE_NAME

# アプリケーション用ユーザーを作成
echo "👤 アプリケーション用ユーザーを作成中..."
echo "パスワードを入力してください:"
read -s DB_PASSWORD
gcloud sql users create $DB_USER \
    --instance=$INSTANCE_NAME \
    --password=$DB_PASSWORD

# インスタンス情報を取得
echo "📊 インスタンス情報を取得中..."
INSTANCE_IP=$(gcloud sql instances describe $INSTANCE_NAME --format="value(ipAddresses[0].ipAddress)")

echo "✅ Cloud SQLセットアップが完了しました！"
echo ""
echo "📋 接続情報:"
echo "インスタンス名: $INSTANCE_NAME"
echo "データベース名: $DATABASE_NAME"
echo "ユーザー名: $DB_USER"
echo "IPアドレス: $INSTANCE_IP"
echo ""
echo "🔗 接続文字列:"
echo "DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@$INSTANCE_IP:5432/$DATABASE_NAME\""
echo ""
echo "⚠️  セキュリティ設定:"
echo "1. IPアドレス制限を設定してください"
echo "2. SSL証明書を設定してください（本番環境）"
echo "3. 環境変数にパスワードを安全に保存してください" 