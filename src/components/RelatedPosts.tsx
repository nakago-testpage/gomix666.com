'use client';

import { Post } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/image';

interface RelatedPostsProps {
  posts: Post[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) {
    return null;
  }
  
  return (
    <div className="my-8">
      <h3 className="text-xl font-bold mb-6 text-cyan-400 border-b border-gray-800 pb-2">関連記事</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post._id} href={`/posts/${post.slug}`} className="block group">
            <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden hover:shadow-cyan-400/30 transition-all duration-300 h-full flex flex-col border border-gray-800/50 hover:border-cyan-400">
              {post.mainImage ? (
                <div className="w-full h-40 relative">
                  <Image
                    src={urlFor(post.mainImage).width(400).height(225).url()}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {post.category && (
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-cyan-400 border border-cyan-900/30">
                      {post.category.title}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-40 bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                  {post.category && (
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-cyan-400 border border-cyan-900/30">
                      {post.category.title}
                    </div>
                  )}
                </div>
              )}
              <div className="p-4 flex-grow flex flex-col">
                <h4 className="text-lg font-medium mb-2 text-cyan-300 group-hover:text-purple-400 transition-colors">
                  {post.title}
                </h4>
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
