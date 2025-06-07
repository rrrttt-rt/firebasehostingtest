const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔄 データベース接続をテストしています...');
    
    // 接続テスト
    await prisma.$connect();
    console.log('✅ データベースに接続成功');
    
    // テーブル数を確認
    const userCount = await prisma.user.count();
    const postCount = await prisma.post.count();
    const categoryCount = await prisma.category.count();
    
    console.log('📊 データベース統計:');
    console.log(`   ユーザー数: ${userCount}`);
    console.log(`   投稿数: ${postCount}`);
    console.log(`   カテゴリー数: ${categoryCount}`);
    
  } catch (error) {
    console.error('❌ データベース接続エラー:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase(); 