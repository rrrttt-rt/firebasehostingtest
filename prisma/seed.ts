import { PrismaClient, UserType, PostStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ユーザーを作成
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      userType: UserType.ADMIN,
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      userType: UserType.USER,
    },
  });

  // カテゴリーを作成
  const techCategory = await prisma.category.upsert({
    where: { name: 'Technology' },
    update: {},
    create: {
      name: 'Technology',
      description: 'Tech-related posts',
    },
  });

  const generalCategory = await prisma.category.upsert({
    where: { name: 'General' },
    update: {},
    create: {
      name: 'General',
      description: 'General discussion topics',
    },
  });

  // 投稿を作成
  const post1 = await prisma.post.create({
    data: {
      title: 'Welcome to our blog!',
      content: 'This is the first post on our blog. We hope you enjoy reading our content.',
      status: PostStatus.PUBLISHED,
      authorId: adminUser.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Getting started with Next.js and Prisma',
      content: 'In this post, we will explore how to set up a Next.js application with Prisma and PostgreSQL.',
      status: PostStatus.PUBLISHED,
      authorId: regularUser.id,
    },
  });

  // 投稿とカテゴリーの関連付け
  await prisma.postCategory.createMany({
    data: [
      {
        postId: post1.id,
        categoryId: generalCategory.id,
      },
      {
        postId: post2.id,
        categoryId: techCategory.id,
      },
    ],
  });

  // コメントを作成
  await prisma.comment.createMany({
    data: [
      {
        content: 'Great first post! Looking forward to more content.',
        postId: post1.id,
        authorId: regularUser.id,
      },
      {
        content: 'Very helpful tutorial. Thank you for sharing!',
        postId: post2.id,
        authorId: adminUser.id,
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 