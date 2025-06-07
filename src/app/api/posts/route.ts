import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/posts - 投稿一覧取得
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        comments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // コメント数を手動で計算
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const postsWithCount = posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      status: post.status,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      authorId: post.authorId,
      author: post.author,
      categories: post.categories,
      _count: {
        comments: post.comments.length,
      },
    }));

    return NextResponse.json({ posts: postsWithCount });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - 投稿作成
export async function POST(request: NextRequest) {
  try {
    const { title, content, authorId, categoryIds } = await request.json();

    if (!title || !authorId) {
      return NextResponse.json(
        { error: 'Title and authorId are required' },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
        categories: categoryIds ? {
          create: categoryIds.map((categoryId: string) => ({
            categoryId,
          })),
        } : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
} 