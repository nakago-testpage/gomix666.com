import DynamicHomepage from '@/components/DynamicHomepage';
import YouTubeSection from '@/components/YouTubeSection';
import ProfileSection from '@/components/ProfileSection';
import { client } from '@/sanity/client';
import { getPosts, getCategories } from '@/sanity/queries';
import { urlFor } from '@/sanity/image';
import { Post } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  // データ取得時のエラーハンドリングを追加
  let posts = [];
  let categories = [];
  
  try {
    posts = await getPosts();
    categories = await getCategories();
    console.log('Posts fetched:', posts?.length || 0);
    console.log('Categories fetched:', categories?.length || 0);
  } catch (error) {
    console.error('Error fetching data:', error);
    // エラーが発生した場合は空の配列を使用
    posts = [];
    categories = [];
  }

  return (
    <div>
      {/* Hero Section with 3D Background */}
      <section className="h-screen w-full relative">
        <DynamicHomepage />
      </section>

      {/* 常に表示するように修正 */}
      {/* Profile Section */}
      <ProfileSection />

      {/* YouTube Section */}
      <YouTubeSection />

      {/* Twitter Feed Section removed */}

      {/* Blog Section */}
      
        <section className="py-20 bg-black/60 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8 text-white scroll-fade-in">Blog</h2>
          
          {/* カテゴリーフィルター */}
          <div className="mb-12 scroll-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {Array.isArray(categories) && categories.slice(0, 5).map((category) => (
                <Link 
                  key={category._id} 
                  href={`/posts?category=${category.slug}`}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-gray-800/70 backdrop-blur-sm text-gray-300 hover:bg-cyan-900/70 hover:text-white border border-gray-700/50 hover:border-cyan-500/50"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(posts) && posts.slice(0, 6).map((post: Post, index: number) => (
              <Link key={post._id} href={`/posts/${post.slug}`} className={`scroll-fade-in`} style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden hover:shadow-cyan-400/50 transition-all duration-300 h-full flex flex-col border border-cyan-900/30 hover:border-cyan-400">
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
          
          <div className="text-center mt-16 scroll-fade-in" style={{ animationDelay: '0.5s' }}>
            <Link href="/posts">
              <span className="inline-block bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform duration-300 shadow-lg">すべての記事を見る</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

