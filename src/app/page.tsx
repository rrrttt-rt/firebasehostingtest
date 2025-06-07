'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string | null;
  userType: string;
  createdAt: string;
  _count: {
    posts: number;
    comments: number;
  };
}

interface Post {
  id: string;
  title: string;
  content: string | null;
  status: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
  categories: Array<{
    category: {
      id: string;
      name: string;
      description: string | null;
    };
  }>;
  _count: {
    comments: number;
  };
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [dbStatus, setDbStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [loading, setLoading] = useState(true);
  
  // 新規ユーザー作成用の状態
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    userType: 'USER' as 'USER' | 'ADMIN'
  });
  
  // 新規投稿作成用の状態
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    authorId: ''
  });

  useEffect(() => {
    // データベース接続テスト
    const testConnection = async () => {
      try {
        const response = await fetch('/api/db-test');
        const result = await response.json();
        
        if (result.status === 'success') {
          setDbStatus('connected');
        } else {
          setDbStatus('error');
        }
      } catch (error) {
        console.error('Database connection test failed:', error);
        setDbStatus('error');
      }
    };

    // ユーザーデータ取得
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    // 投稿データ取得
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };

    const loadData = async () => {
      await testConnection();
      await Promise.all([fetchUsers(), fetchPosts()]);
      setLoading(false);
    };

    loadData();
  }, []);

  // ユーザー作成関数
  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      
      if (response.ok) {
        const newUserData = await response.json();
        setUsers(prev => [...prev, newUserData]);
        setNewUser({ email: '', name: '', userType: 'USER' });
        alert('ユーザーを作成しました！');
      } else {
        alert('ユーザー作成に失敗しました');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('エラーが発生しました');
    }
  };

  // 投稿作成関数
  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });
      
      if (response.ok) {
        const newPostData = await response.json();
        setPosts(prev => [...prev, newPostData]);
        setNewPost({ title: '', content: '', authorId: '' });
        alert('投稿を作成しました！');
      } else {
        alert('投稿作成に失敗しました');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('エラーが発生しました');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Firebase Hosting Test with PostgreSQL
          </h1>
          <p className="text-xl text-gray-600">
            Next.js + Prisma + PostgreSQL (Cloud SQL対応)
          </p>
          
          {/* Database Status */}
          <div className="mt-6 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium">
            {dbStatus === 'connected' && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                ✅ Database Connected
              </span>
            )}
            {dbStatus === 'error' && (
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
                ❌ Database Connection Error
              </span>
            )}
            {dbStatus === 'loading' && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                🔄 Testing Connection...
              </span>
            )}
          </div>
        </div>

        {/* データ作成フォーム */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* ユーザー作成フォーム */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              👤 新規ユーザー作成
            </h2>
            <form onSubmit={createUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  名前
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ユーザータイプ
                </label>
                <select
                  value={newUser.userType}
                  onChange={(e) => setNewUser(prev => ({ ...prev, userType: e.target.value as 'USER' | 'ADMIN' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                ユーザーを作成
              </button>
            </form>
          </div>

          {/* 投稿作成フォーム */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📝 新規投稿作成
            </h2>
            <form onSubmit={createPost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  タイトル
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  内容
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  作成者選択
                </label>
                <select
                  value={newPost.authorId}
                  onChange={(e) => setNewPost(prev => ({ ...prev, authorId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">作成者を選択...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name || user.email}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                投稿を作成
              </button>
            </form>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Users ({users.length})
            </h2>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">
                      {user.name || 'Anonymous'}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.userType === 'ADMIN' 
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.userType}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                  <div className="flex space-x-4 text-xs text-gray-500">
                    <span>Posts: {user._count.posts}</span>
                    <span>Comments: {user._count.comments}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Posts Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Posts ({posts.length})
            </h2>
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="mb-2">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {post.content}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>By: {post.author.name || post.author.email}</span>
                    <span>Comments: {post._count.comments}</span>
                  </div>
                  {post.categories.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {post.categories.map(({ category }) => (
                        <span
                          key={category.id}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* API Endpoints Info */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Available API Endpoints
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Database Test</h3>
              <code className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                GET /api/db-test
              </code>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Users</h3>
              <div className="space-y-1">
                <code className="block text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                  GET /api/users
                </code>
                <code className="block text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                  POST /api/users
                </code>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Posts</h3>
              <div className="space-y-1">
                <code className="block text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                  GET /api/posts
                </code>
                <code className="block text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                  POST /api/posts
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
