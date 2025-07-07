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

async function getCategoryPosts(slug: string) {
  const query = `*[_type == "category" && slug.current == $slug][0] {
    "title": title.ja,
    "posts": *[_type == "post" && references(^._id)] | order(publishedAt desc) {
      _id,
      "title": title.ja,
      "slug": slug.current,
      mainImage,
      publishedAt
    }
  }`;
  const category = await client.fetch(query, { slug });
  return category;
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const categoryData = await getCategoryPosts(slug);
  const allCategories = await getCategories();
  const allTags = await getTags();

  if (!categoryData || !categoryData.posts) {
    return <div>Category not found or no posts in this category.</div>;
  }

  const breadcrumbItems = [
    { title: 'Home', href: '/' },
    { title: categoryData.title },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-16">
      <div className="w-full lg:w-3/4">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">
          Category: <span className="text-cyan-400">{categoryData.title}</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categoryData.posts.map((post: Post) => (
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
