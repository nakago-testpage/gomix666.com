import { client } from '@/sanity/client';
import { Post } from '@/types';
import { PortableText } from '@portabletext/react';
import PortableTextComponents from '@/components/PortableTextComponents';
import Breadcrumbs from '@/components/Breadcrumbs';
import imageUrlBuilder from '@sanity/image-url';
import Image from 'next/image';

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

async function getPost(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    "title": title.ja,
    "slug": slug.current,
    mainImage,
    publishedAt,
    body,
    "category": categories[0]->{"title": title.ja, "slug": slug.current},
    "tags": tags[]->{_id, "title": title.ja, "slug": slug.current},
    "author": author->{
      name,
      image
    },
    youtubeUrl
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

  const breadcrumbItems: { title: string; href?: string }[] = [
    { title: 'Home', href: `/` },
    { title: 'Blog', href: `/posts` },
  ];
  if (post.category) {
    breadcrumbItems.push({ title: post.category.title, href: `/posts?category=${post.category.slug}` });
  }
  breadcrumbItems.push({ title: post.title });

  return (
    <article className="max-w-3xl mx-auto pt-16">
      <div className="mb-6 mt-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">{post.title}</h1>
      <div className="flex items-center space-x-4 mb-8 text-gray-400">
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
          <p>{post.author?.name || 'Anonymous'}</p>
          <p>{new Date(post.publishedAt).toLocaleDateString('ja-JP')}</p>
        </div>
      </div>

      {post.mainImage && (
        <div className="mb-8">
          <Image
            src={urlFor(post.mainImage).width(1200).height(675).url()}
            alt={post.title}
            width={1200}
            height={675}
            className="rounded-lg w-full h-auto"
          />
        </div>
      )}

      <div className="prose prose-invert prose-lg max-w-none prose-h1:text-cyan-400 prose-a:text-purple-400 hover:prose-a:text-purple-300">
        <PortableText value={post.body?.ja || []} components={PortableTextComponents} />
      </div>
    </article>
  );
}
