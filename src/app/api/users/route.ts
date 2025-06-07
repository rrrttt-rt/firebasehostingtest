import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/users - ユーザー一覧取得
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: true,
        comments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // ユーザーデータを手動で整形
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const usersWithCount = users.map((user: any) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      userType: user.userType,
      createdAt: user.createdAt,
      _count: {
        posts: user.posts.length,
        comments: user.comments.length,
      },
    }));

    return NextResponse.json({ users: usersWithCount });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - ユーザー作成
export async function POST(request: NextRequest) {
  try {
    const { email, name, userType } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        userType: userType || 'USER',
      },
      include: {
        posts: true,
        comments: true,
      },
    });

    // フロントエンドが期待する形式に変換
    const userWithCount = {
      id: user.id,
      email: user.email,
      name: user.name,
      userType: user.userType,
      createdAt: user.createdAt,
      _count: {
        posts: user.posts.length,
        comments: user.comments.length,
      },
    };

    return NextResponse.json(userWithCount, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    
    // 重複メールアドレスエラーの処理
    if (error instanceof Error && 'code' in error && (error as { code: string }).code === 'P2002') {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 