import { client } from '@/sanity/client';
import { getCategories, getTags } from '@/sanity/queries';
import { Post } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

async function getTagPosts(slug: string) {
  const query = `*[_type == "tag" && slug.current == $slug][0] {
    "title": title.ja,
    "posts": *[_type == "post" && references(^._id)] | order(publishedAt desc) {
      _id,
      "title": title.ja,
      "slug": slug.current,
      mainImage,
      publishedAt
    }
  }`;
  const tag = await client.fetch(query, { slug });
  return tag;
}

export default async function TagPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const tagData = await getTagPosts(slug);
  const allCategories = await getCategories();
  const allTags = await getTags();

  if (!tagData || !tagData.posts) {
    return <div>Tag not found or no posts with this tag.</div>;
  }

  const breadcrumbItems = [
    { title: 'Home', href: '/' },
    { title: tagData.title },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-16">
      <div className="w-full lg:w-3/4">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">
          Tag: <span className="text-cyan-400">{tagData.title}</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tagData.posts.map((post: Post) => (
            <Link href={`/posts/${post.slug}`} key={post._id}>
              <article className="bg-gray-900 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 h-full flex flex-col">
                {post.mainImage ? (
                  <div className="relative w-full h-48">
                    <Image
                      src={urlFor(post.mainImage).width(400).height(225).url()}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-800"></div>
                )}
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-semibold text-cyan-300 hover:text-purple-400 flex-grow">{post.title}</h3>
                  <p className="text-gray-500 mt-2 text-sm">
                    {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
      <Sidebar categories={allCategories} tags={allTags} />
    </div>
  );
}
