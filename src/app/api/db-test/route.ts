import { NextResponse } from 'next/server';
import { testDatabaseConnection } from '@/lib/prisma';

// GET /api/db-test - データベース接続テスト
export async function GET() {
  try {
    const result = await testDatabaseConnection();
    
    if (result.success) {
      return NextResponse.json({
        status: 'success',
        message: result.message,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json({
        status: 'error',
        message: result.message,
        error: result.error,
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error occurred',
      error: error,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 