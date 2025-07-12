'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// SimpleHomepageを動的にインポート（SSRを無効化）
const SimpleHomepage = dynamic(() => import('@/components/SimpleHomepage'), {
  ssr: false,
  loading: () => <div className="w-full h-screen flex items-center justify-center bg-gray-900">Loading...</div>
});
import YouTubeSection from '@/components/YouTubeSection';
import ProfileSection from '@/components/ProfileSection';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/image';

interface HomeClientProps {
  posts: any[];
  categories: any[];
}

export default function HomeClient({ posts, categories }: HomeClientProps) {
  // 最新の投稿を3つ取得（データがない場合は空配列を使用）
  const latestPosts = Array.isArray(posts) && posts.length > 0 ? posts.slice(0, 3) : [];
  
  // 上位のカテゴリーを取得（最大5件）
  const topCategories = Array.isArray(categories) ? categories.slice(0, 5) : [];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with 3D Background */}
      <section className="h-screen w-full relative">
        <SimpleHomepage />
      </section>

      {/* Profile Section */}
      <ProfileSection />

      {/* YouTube Section */}
      <YouTubeSection />

      {/* Categories Section */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center text-cyan-300">カテゴリー</h2>
          
          {topCategories.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-4">
              {topCategories.map((category) => (
                <Link 
                  key={category._id} 
                  href={`/posts?category=${category.slug.current}`}
                  className="bg-gray-900 px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-shadow"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">カテゴリーがありません</p>
          )}
        </div>
      </section>

      {/* Blog Posts Section - 一番下に移動 */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-cyan-300">最新の投稿</h2>
          
          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <div 
                  key={post._id || `post-${Math.random()}`} 
                  className="bg-black/50 backdrop-blur-sm rounded-lg overflow-hidden border border-emerald-800/50 shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-cyan-500/50 hover:border-cyan-500/50 group"
                >
                  {post.mainImage && (
                    <div className="relative h-48">
                      <Image 
                        src={urlFor(post.mainImage).width(600).height(400).url()} 
                        alt={post.title || 'ブログ画像'} 
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-cyan-100 group-hover:text-cyan-300 transition-colors">{post.title || 'タイトルなし'}</h3>
                    <p className="text-gray-300 mb-4">{post.excerpt || '概要がありません'}</p>
                    {post.slug && post.slug.current ? (
                      <Link 
                        href={`/posts/${post.slug.current}`}
                        className="inline-block bg-gradient-to-r from-cyan-900/50 to-emerald-900/50 text-cyan-300 font-medium py-1 px-4 rounded-full hover:scale-105 transition-all duration-300 border border-cyan-800/50 group-hover:border-cyan-500/70 group-hover:shadow-sm group-hover:shadow-cyan-500/30"
                        prefetch={true}
                      >
                        続きを読む
                      </Link>
                    ) : (
                      <span className="text-gray-500">リンクがありません</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">投稿がありません</p>
          )}
          
          <div className="mt-8 text-center">
            <Link 
              href="/posts"
              className="inline-block bg-cyan-700 text-white px-6 py-2 rounded-md hover:bg-cyan-600 transition-colors"
            >
              すべての投稿を見る
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
