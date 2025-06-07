#!/bin/bash

# Firebase App Hostingデプロイスクリプト

PROJECT_ID="your-project-id"
BACKEND_NAME="firebasehostingtest-backend"

echo "🚀 Firebase App Hostingへのデプロイを開始します..."

# プロジェクトIDの確認
if [ "$PROJECT_ID" = "your-project-id" ]; then
    echo "❌ PROJECT_IDを設定してください"
    exit 1
fi

# Firebase プロジェクトを設定
echo "📋 Firebaseプロジェクトを設定中..."
firebase use $PROJECT_ID

# 依存関係のインストール
echo "📦 依存関係をインストール中..."
npm install

# Prismaクライアントの生成
echo "🔧 Prismaクライアントを生成中..."
npm run db:generate

# アプリケーションのビルド
echo "🏗️  アプリケーションをビルド中..."
npm run build

# Firebase App Hostingにデプロイ
echo "🚀 Firebase App Hostingにデプロイ中..."
firebase apphosting:backends:create $BACKEND_NAME \
    --project=$PROJECT_ID \
    --location=asia-northeast1

echo "✅ デプロイが完了しました！"
echo ""
echo "🔗 アクセスURL:"
echo "https://$BACKEND_NAME---$PROJECT_ID.apphosting.dev"
echo ""
echo "📊 管理コンソール:"
echo "https://console.firebase.google.com/project/$PROJECT_ID/apphosting" 