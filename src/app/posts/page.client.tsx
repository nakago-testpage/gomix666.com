'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';
import { urlFor } from '@/sanity/image';
import { Post, Category } from '@/types';

interface BlogPostsPageProps {
  posts: Post[];
  categories: Category[];
  breadcrumbItems: { title: string; href?: string }[];
  selectedCategory?: string;
}

export default function BlogPostsPage({ 
  posts, 
  categories, 
  breadcrumbItems,
  selectedCategory 
}: BlogPostsPageProps) {
  const [activeCategory, setActiveCategory] = useState<string | undefined>(selectedCategory);
  
  // カテゴリーでフィルタリングされた投稿を取得
  const filteredPosts = activeCategory
    ? posts.filter(post => {
        if (!post.categories) return false;
        return post.categories.some((cat: any) => 
          cat.slug?.current === activeCategory || cat.slug === activeCategory
        );
      })
    : posts;

  return (
    <div className="container mx-auto px-4 py-16 pt-20">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      
      <h1 className="text-5xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
        Blog
      </h1>
      
      {/* カテゴリーフィルター */}
      {categories.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveCategory(undefined)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                !activeCategory 
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              すべて
            </button>
            
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setActiveCategory(category.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.slug 
                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* 投稿一覧 */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <div 
              key={post._id} 
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
                <h3 className="text-xl font-semibold mb-2 text-cyan-100 group-hover:text-cyan-300 transition-colors">
                  {post.title || 'タイトルなし'}
                </h3>
                <p className="text-gray-300 mb-4">{post.excerpt || '概要がありません'}</p>
                {post.slug ? (
                  <Link 
                    href={`/posts/${post.slug}`}
                    className="inline-block bg-gradient-to-r from-cyan-900/50 to-emerald-900/50 text-cyan-300 font-medium py-1 px-4 rounded-full hover:scale-105 transition-all duration-300 border border-cyan-800/50 group-hover:border-cyan-500/70 group-hover:shadow-sm group-hover:shadow-cyan-500/30"
                    prefetch={true}
                    scroll={true}
                  >
                    続きを読む
                  </Link>
                ) : (
                  <span className="inline-block text-gray-500">リンクがありません</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400">投稿が見つかりませんでした</p>
          {activeCategory && (
            <button
              onClick={() => setActiveCategory(undefined)}
              className="mt-4 px-6 py-2 bg-cyan-700 text-white rounded-md hover:bg-cyan-600 transition-colors"
            >
              すべての投稿を表示
            </button>
          )}
        </div>
      )}
    </div>
  );
}
