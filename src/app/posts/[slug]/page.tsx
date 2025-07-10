import { client } from '@/sanity/client';
import { Post } from '@/types';
import { PortableText } from '@portabletext/react';
import PortableTextComponents from '@/components/PortableTextComponents';
import Breadcrumbs from '@/components/Breadcrumbs';
import { urlFor } from '@/sanity/image';
import Image from 'next/image';
import { getRelatedPosts } from '@/sanity/queries';
import { Suspense } from 'react';
import { PostMetrics, ShareButtons, BlogYouTubePromo, RelatedPosts } from '@/components/DynamicPostComponents';

// キャッシュを無効化して常に最新データを取得
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getPost(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    "title": title.ja,
    "slug": slug.current,
    mainImage,
    publishedAt,
    _updatedAt,
    body,
    "category": categories[0]->{"title": title.ja, "slug": slug.current},
    "tags": tags[]->{_id, "title": title.ja, "slug": slug.current},
    "author": author->{
      name,
      image
    },
    youtubeUrl,
    "wordCount": length(pt::text(body.ja))
  }`;

  const post = await client.fetch<Post>(query, { slug });
  return post;
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = await getPost(slug);

  if (!post) {
    return <div>Post not found.</div>;
  }
  
  // 関連記事を取得
  const relatedPosts = await getRelatedPosts(
    post._id, 
    post.category?.slug, 
    3
  );

  const breadcrumbItems: { title: string; href?: string }[] = [
    { title: 'Home', href: `/` },
    { title: 'Blog', href: `/posts` },
  ];
  if (post.category) {
    breadcrumbItems.push({ title: post.category.title, href: `/posts?category=${post.category.slug}` });
  }
  breadcrumbItems.push({ title: post.title });
  
  // 現在のURL（クライアントサイドで使用）
  const currentUrl = `https://gomix666.com/posts/${slug}`;

  return (
    <article className="max-w-4xl mx-auto pt-16 px-4">
      <div className="mb-6 mt-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">{post.title}</h1>
      
      {/* 著者情報と記事メトリクス */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center space-x-4 text-gray-400 mb-4 md:mb-0">
          {post.author?.image && (
            <Image
              src={urlFor(post.author.image).width(50).height(50).url()}
              alt={post.author.name}
              className="rounded-full"
              width={50}
              height={50}
            />
          )}
          <div>
            <p className="font-medium text-cyan-400">{post.author?.name || 'Anonymous'}</p>
          </div>
        </div>
        
        {/* 記事メトリクス（閲覧数、読了時間、公開日、更新日） */}
        <Suspense fallback={<div className="h-6 w-full bg-gray-800 animate-pulse rounded"></div>}>
          <PostMetrics 
            slug={post.slug} 
            wordCount={post.wordCount || 0} 
            publishedAt={post.publishedAt} 
            updatedAt={post._updatedAt}
          />
        </Suspense>
      </div>

      {/* メイン画像 */}
      {post.mainImage && (
        <div className="mb-8">
          <Image
            src={urlFor(post.mainImage).width(1200).height(675).url()}
            alt={post.title}
            width={1200}
            height={675}
            className="rounded-lg w-full h-auto"
            priority
          />
        </div>
      )}

      {/* 記事本文 */}
      <div className="prose prose-invert prose-lg max-w-none prose-h1:text-cyan-400 prose-a:text-purple-400 hover:prose-a:text-purple-300">
        <PortableText value={post.body?.ja || []} components={PortableTextComponents} />
      </div>
      
      {/* シェアボタン */}
      <Suspense fallback={<div className="h-20 w-full bg-gray-800 animate-pulse rounded-lg my-8"></div>}>
        <ShareButtons title={post.title} url={currentUrl} />
      </Suspense>
      
      {/* YouTubeチャンネル紹介 */}
      <Suspense fallback={<div className="h-40 w-full bg-gray-800 animate-pulse rounded-lg my-8"></div>}>
        <BlogYouTubePromo videoId={post.youtubeUrl} />
      </Suspense>
      
      {/* 関連記事 */}
      <Suspense fallback={<div className="h-60 w-full bg-gray-800 animate-pulse rounded-lg my-8"></div>}>
        <RelatedPosts posts={relatedPosts} />
      </Suspense>
    </article>
  );
}
