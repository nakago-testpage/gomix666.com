'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { getPosts, getCategories } from '@/sanity/queries';
import { urlFor } from '@/sanity/image';
import { Post, Category } from '@/types';

export default function BlogPostsList() {
  // 状態管理
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const router = useRouter();
  
  // URLパラメータからカテゴリーを取得
  const searchParams = useSearchParams();
  const category = searchParams ? searchParams.get('category') || '' : '';
  
  // データ取得関数をuseCallbackで最適化
  const fetchData = useCallback(async (forceRefresh = false) => {
    console.log(`Fetching blog data (attempt ${retryCount + 1}) with timestamp:`, new Date().toISOString());
    setLoading(true);
    setError(null);
    
    try {
      // 環境変数の確認
      const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
      const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
      
      if (!projectId || !dataset) {
        console.error('Sanity environment variables are missing!');
        setError('環境変数が正しく設定されていません。管理者にお問い合わせください。');
        return;
      }
      
      // キャッシュを完全に無効化するためのタイムスタンプパラメータを追加
      const timestamp = new Date().getTime();
      
      // デバッグ用にダミーデータを作成
      const dummyPosts: Post[] = [
        {
          _id: 'dummy-1',
          _createdAt: new Date().toISOString(),
          _updatedAt: new Date().toISOString(),
          title: 'テスト記事1',
          slug: 'test-post-1',
          excerpt: 'これはテスト記事です。',
          publishedAt: new Date().toISOString(),
          category: { title: 'テスト', slug: 'test' },
          mainImage: {
            asset: {
              _ref: 'image-dummy-1',
              _type: 'reference'
            }
          }
        },
        {
          _id: 'dummy-2',
          _createdAt: new Date().toISOString(),
          _updatedAt: new Date().toISOString(),
          title: 'テスト記事2',
          slug: 'test-post-2',
          excerpt: 'これはテスト記事2です。',
          publishedAt: new Date().toISOString(),
          category: { title: 'テスト2', slug: 'test2' },
          mainImage: {
            asset: {
              _ref: 'image-dummy-2',
              _type: 'reference'
            }
          }
        }
      ];
      
      // 記事を取得
      console.log(`Attempting to fetch posts (attempt ${retryCount + 1})...`);
      const fetchedPosts = await getPosts();
      console.log(`Posts fetched (attempt ${retryCount + 1}):`, fetchedPosts?.length || 0, 'isArray:', Array.isArray(fetchedPosts));
      
      // 詳細なデバッグ情報
      if (fetchedPosts && fetchedPosts.length > 0) {
        console.log('First post sample:', JSON.stringify(fetchedPosts[0], null, 2));
      } else {
        console.log('No posts returned from Sanity. Response:', JSON.stringify(fetchedPosts, null, 2));
      }
      
      // 常にダミーデータを優先的に表示（デバッグ用）
      console.log('Setting dummy data for immediate display');
      setPosts(dummyPosts);
      setLoading(false);
      setError(null);
      
      // ダミーカテゴリーを設定
      setCategories([
        { _id: 'cat-1', title: 'テスト', slug: 'test' },
        { _id: 'cat-2', title: 'テスト2', slug: 'test2' }
      ] as Category[]);
      
      // Sanityからのデータも確認
      if (Array.isArray(fetchedPosts) && fetchedPosts.length > 0) {
        console.log('Sanity data also available:', fetchedPosts.length, 'posts');
        // 成功した場合はリトライカウンタをリセット
        setRetryCount(0);
        // デバッグ用にコメントアウトしていますが、実際のデータを使いたい場合はここを有効化
        // setPosts(fetchedPosts);
      } else {
        console.warn('No valid posts from Sanity, using dummy data only');
        if (retryCount < 3) {
          setRetryCount(prev => prev + 1);
        }
      }
      
      // カテゴリー取得はすでにダミーデータを設定済みなので、ここではログのみ出力
      try {
        const fetchedCategories = await getCategories();
        console.log(`Categories fetched (attempt ${retryCount + 1}):`, fetchedCategories?.length || 0, 'isArray:', Array.isArray(fetchedCategories));
        
        if (Array.isArray(fetchedCategories) && fetchedCategories.length > 0) {
          console.log('Sanity categories available:', fetchedCategories.length, 'categories');
          // デバッグ用にコメントアウトしていますが、実際のデータを使いたい場合はここを有効化
          // setCategories(fetchedCategories);
        }
      } catch (categoryError) {
        console.error('Error fetching categories:', categoryError);
      }
      
      // 強制リフレッシュが必要な場合
      if (forceRefresh && fetchedPosts?.length === 0 && retryCount >= 3) {
        console.log('Force refreshing page after multiple failed attempts');
        router.refresh();
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('データの取得に失敗しました: ' + (err instanceof Error ? err.message : String(err)));
      if (retryCount < 3) {
        setRetryCount(prev => prev + 1);
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount, router]);
  
  // コンポーネントマウント時とカテゴリー変更時にデータを取得
  useEffect(() => {
    console.log('Effect triggered with category:', category);
    fetchData(false);
    
    // ページ表示直後に再度データを取得して確実に表示する
    const timer = setTimeout(() => {
      if (posts.length === 0) {
        console.log('No posts found after initial load, retrying...');
        fetchData(true); // 強制リフレッシュフラグをセット
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [category, fetchData]); // posts.lengthを依存配列から削除して無限ループを防止
  
  // リトライカウントが増えたときに自動的に再取得
  useEffect(() => {
    if (retryCount > 0 && retryCount <= 3) {
      const retryTimer = setTimeout(() => {
        console.log(`Auto retry attempt ${retryCount}...`);
        fetchData(retryCount >= 3);
      }, 1500 * retryCount); // 待ち時間を少しずつ増やす
      
      return () => clearTimeout(retryTimer);
    }
  }, [retryCount, fetchData]);
  
  // カテゴリーでフィルタリング
  const filteredPosts = category 
    ? posts.filter(post => post?.category && post.category.slug === category)
    : posts;
  
  console.log('Filtered posts:', filteredPosts?.length || 0, 'Category:', category);
  
  return (
    <div className="w-full">
      {/* デバッグ情報 */}
      <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
        <p>Total Posts: {posts.length}</p>
        <p>Filtered Posts: {filteredPosts.length}</p>
        <p>Category Filter: {category || 'none'}</p>
      </div>
      
      {/* リフレッシュボタン */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">ブログ記事</h2>
        <button 
          onClick={() => fetchData(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          {loading ? '読み込み中...' : '再読み込み'}
        </button>
      </div>
      
      {/* カテゴリーフィルター */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link 
          href="/posts" 
          prefetch={true}
          scroll={true}
          className={`px-4 py-2 rounded-full text-sm ${!category ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          All Posts
        </Link>
        {Array.isArray(categories) && categories.map((cat) => (
          <Link 
            key={cat._id} 
            href={`/posts?category=${cat.slug}`}
            prefetch={true}
            scroll={true}
            className={`px-4 py-2 rounded-full text-sm ${category === cat.slug ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {cat.title}
          </Link>
        ))}
      </div>
      
      {/* ローディング表示 */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* エラー表示 */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p className="font-bold">エラー</p>
          <p>{error}</p>
          <button 
            onClick={() => fetchData(true)}
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
          >
            再試行
          </button>
        </div>
      )}
      
      {/* 投稿がない場合の表示 */}
      {!loading && !error && filteredPosts.length === 0 && (
        <div className="text-center py-20 bg-gray-100 rounded-lg">
          <p className="text-xl text-gray-600">記事がありません</p>
          <button 
            onClick={() => fetchData(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            再読み込み
          </button>
        </div>
      )}
      
      {/* 投稿一覧 */}
      {!loading && !error && filteredPosts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <div 
              key={post._id} 
              className="group bg-black/50 backdrop-blur-sm rounded-lg overflow-hidden border border-emerald-800/50 shadow-lg shadow-emerald-500/20 hover:shadow-cyan-500/50 hover:border-cyan-500/50 transition-all duration-300"
            >
              {post.mainImage && (
                <div className="relative h-48 w-full">
                  <Image 
                    src={urlFor(post.mainImage).url()} 
                    alt={post.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                  {post.category && (
                    <span className="absolute top-4 right-4 bg-black/70 border border-emerald-800/50 text-cyan-300 text-xs px-2 py-1 rounded-md">
                      {post.category.title}
                    </span>
                  )}
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-cyan-300 transition-colors">{post.title}</h3>
                {post.excerpt && (
                  <p className="text-gray-300 mb-4 line-clamp-2">{post.excerpt}</p>
                )}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">{new Date(post.publishedAt).toLocaleDateString('ja-JP')}</span>
                  <Link 
                    href={`/posts/${post.slug}`} 
                    prefetch={true}
                    scroll={true}
                    className="px-4 py-1 bg-gradient-to-r from-cyan-900/50 to-emerald-900/50 text-cyan-300 rounded-full hover:scale-105 transition-transform group-hover:shadow-sm group-hover:shadow-cyan-500/30"
                  >
                    続きを読む
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
