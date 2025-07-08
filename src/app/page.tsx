import DynamicHomepage from '@/components/DynamicHomepage';
import YouTubeSection from '@/components/YouTubeSection';
import ProfileSection from '@/components/ProfileSection';
import { client } from '@/sanity/client';
import { getPosts } from '@/sanity/queries';
import { urlFor } from '@/sanity/image';
import { Post } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  const posts = await getPosts();

  return (
    <div>
      {/* Hero Section with 3D Background */}
      <section className="h-screen w-full relative">
        <DynamicHomepage />
      </section>

      {/* Profile Section */}
      <ProfileSection />

      {/* YouTube Section */}
      <YouTubeSection />

      {/* Blog Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Blog</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(0, 6).map((post: Post) => (
              <Link key={post._id} href={`/posts/${post.slug}`}>
                <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-cyan-400/50 transition-shadow duration-300 h-full flex flex-col border border-transparent hover:border-cyan-400">
                  {post.mainImage ? (
                    <div className="w-full h-48 relative">
                      <Image
                        src={urlFor(post.mainImage).width(400).height(225).url()}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
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
          <div className="text-center mt-16">
            <Link href="/posts">
              <span className="inline-block bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform duration-300 shadow-lg">すべての記事を見る</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

