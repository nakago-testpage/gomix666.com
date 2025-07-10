import { client } from './client';
import { Post, Category, Tag } from '../types';

export async function getPosts(): Promise<Post[]> {
  const query = `*[_type == "post" && defined(publishedAt) && defined(title.ja)] | order(publishedAt desc) {
    _id,
    "title": title.ja,
    "slug": slug.current,
    "excerpt": excerpt.ja,
    mainImage,
    publishedAt,
    "category": categories[0]->{
      _id,
      "title": title.ja,
      "slug": slug.current
    }
  }`;
  const posts = await client.fetch<Post[]>(query);
  return posts;
}

export async function getCategories(): Promise<Category[]> {
  const query = `*[_type == "category"] | order(title asc) {
    _id,
    "title": title.ja,
    "slug": slug.current
  }`;
  const categories = await client.fetch<Category[]>(query);
  return categories;
}

export async function getTags(): Promise<Tag[]> {
  const query = `*[_type == "tag"] | order(title asc) {
    _id,
    "title": title.ja,
    "slug": slug.current
  }`;
  const tags = await client.fetch<Tag[]>(query);
  return tags;
}
