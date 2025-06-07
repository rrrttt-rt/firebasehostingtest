import { PrismaClient } from '@prisma/client';

declare global {
  // グローバル変数の型を拡張（開発環境でのホットリロード対応）
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// PrismaClientのシングルトンインスタンス
const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// 開発環境ではグローバル変数にPrismaClientを割り当て（ホットリロード時の重複接続を防ぐ）
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

export { prisma };

// データベース接続テスト関数
export async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    return { success: true, message: 'Database connected successfully' };
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return { success: false, message: 'Database connection failed', error };
  } finally {
    await prisma.$disconnect();
  }
} 