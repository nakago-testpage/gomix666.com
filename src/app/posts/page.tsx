import { getPosts, getCategories } from '@/sanity/queries';
import { Post } from '@/types';
import { urlFor } from '@/sanity/image';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Suspense } from 'react';

// キャッシュを無効化して常に最新データを取得
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function BlogIndexPage({ searchParams }: { searchParams: { category?: string } }) {
  // searchParamsを非同期で処理
  const { category } = searchParams;
  let posts: Post[] = [];
  let categories: any[] = [];
  let filteredPosts: Post[] = [];
  let selectedCategory = '';
  
  console.log('Fetching posts and categories...');
  try {
    posts = await getPosts();
    categories = await getCategories();
    selectedCategory = category || '';
    
    // データ取得結果をデバッグ
    console.log('Posts fetched:', posts);
    console.log('Categories fetched:', categories);
    console.log('Selected category:', selectedCategory);
    console.log('Posts before filtering:', posts?.length || 0);
    
    // postsが配列でない場合の対応
    if (!Array.isArray(posts)) {
      console.error('Posts is not an array:', posts);
      return {
        notFound: true
      };
    }
    
    filteredPosts = selectedCategory 
      ? posts.filter((post: Post) => {
          const hasCategory = post?.category && post.category.slug === selectedCategory;
          console.log(`Post ${post?.title || 'unknown'} has matching category: ${hasCategory}`);
          return hasCategory;
        })
      : posts;
      
    console.log('Posts after filtering:', filteredPosts?.length || 0);
  } catch (error) {
    console.error('Error fetching data:', error);
    // エラーが発生した場合は空の配列を使用
    posts = [];
    categories = [];
    filteredPosts = [];
  }

  // パンくずリストのアイテム
  const breadcrumbItems = [
    { title: 'Home', href: '/' },
    { title: 'Blog' }
  ];
  
  // 選択されたカテゴリーがある場合、パンくずリストに追加
  if (selectedCategory) {
    const categoryTitle = categories.find(cat => cat.slug === selectedCategory)?.title || selectedCategory;
    breadcrumbItems.splice(1, 0, { title: categoryTitle, href: `/posts?category=${selectedCategory}` });
    breadcrumbItems[2] = { title: 'All Posts' };
  }

  return (
    <div className="container mx-auto px-4 py-16 pt-20">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      
      <h1 className="text-5xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
        {selectedCategory 
          ? `${categories.find(cat => cat.slug === selectedCategory)?.title || 'Category'} Posts` 
          : 'Blog'}
      </h1>
      
      {/* カテゴリーフィルター */}
      <div className="mb-12">
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <Link 
            href="/posts" 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${!selectedCategory ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            prefetch={true} // プリフェッチを有効化
            scroll={true} // スクロールを有効化
          >
            All Posts
          </Link>
          {Array.isArray(categories) && categories.map((category) => (
            <Link 
              key={category._id} 
              href={`/posts?category=${category.slug}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category.slug ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              prefetch={true} // プリフェッチを有効化
              scroll={true} // スクロールを有効化
            >
              {category.title}
            </Link>
          ))}
        </div>
      </div>
      
      {/* 記事がない場合のメッセージ */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12 bg-gray-900/70 backdrop-blur-sm rounded-lg">
          <p className="text-gray-400">この{selectedCategory ? 'カテゴリーには' : ''}記事がありません。</p>
        </div>
      )}
      
      {/* 記事一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.isArray(filteredPosts) && filteredPosts.map((post: Post) => (
          <Link 
            key={post._id} 
            href={`/posts/${post.slug}`} 
            className="scroll-fade-in"
            prefetch={true} // プリフェッチを有効化
            scroll={true} // スクロールを有効化
          >
            <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden hover:shadow-cyan-400/50 transition-all duration-300 h-full flex flex-col border border-gray-800/50 hover:border-cyan-400">
              {post.mainImage ? (
                <div className="w-full h-48 relative">
                  <Image
                    src={urlFor(post.mainImage).width(400).height(225).url()}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                  {post.category && (
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-cyan-400 border border-cyan-900/30">
                      {post.category.title}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                  {post.category && (
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-cyan-400 border border-cyan-900/30">
                      {post.category.title}
                    </div>
                  )}
                </div>
              )}
              <div className="p-6 flex-grow flex flex-col">
                <h2 className="text-xl font-semibold mb-2 flex-grow text-cyan-300 hover:text-purple-400 transition-colors">{post.title}</h2>
                {post.excerpt && (
                  <p className="text-gray-400 text-sm mb-4">{post.excerpt}</p>
                )}
                <p className="text-gray-500 text-xs mt-auto">
                  {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
