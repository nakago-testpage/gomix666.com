import { client } from './client';
import { Post, Category, Tag } from '../types';

export async function getPosts(category?: string): Promise<Post[]> {
  const timestamp = new Date().getTime();
  
  console.log('Executing Sanity query for posts:', { 
    timestamp, 
    category: category || 'all',
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION
  });
  
  // クエリを簡素化し、日本語フィールドを明示的に指定
  const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    _createdAt,
    _updatedAt,
    "title": title.ja,
    "slug": slug.current,
    publishedAt,
    "excerpt": excerpt.ja,
    mainImage
  }`;

  try {
    console.log('Fetching posts from Sanity...');
    const posts = await client.fetch<Post[]>(
      query,
      {},
      {
        cache: 'no-store',
        next: { revalidate: 0 },
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
    
    console.log(`Sanity returned ${posts?.length || 0} posts`);
    return posts;
  } catch (error) {
    console.error('Error fetching posts from Sanity:', error);
    // エラーの詳細情報を表示
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return [];
  }
}

export async function getRelatedPosts(postId: string, categorySlug?: string, limit: number = 3): Promise<Post[]> {
  // 同じカテゴリーの記事を取得し、現在の記事を除外
  const query = `*[_type == "post" && _id != $postId && defined(publishedAt) && defined(title.ja) ${categorySlug ? '&& $categorySlug in categories[]->slug.current' : ''}] | order(publishedAt desc)[0...$limit] {
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
  
  const posts = await client.fetch<Post[]>(query, { postId, categorySlug, limit });
  return posts;
}

export async function getCategories(): Promise<Category[]> {
  // タイムスタンプを追加してキャッシュを無効化
  const timestamp = new Date().getTime();
  
  // タイムスタンプをクエリに直接含める
  const query = `*[_type == "category" && _updatedAt < "${new Date().toISOString()}"] | order(title asc) {
    _id,
    "title": title.ja,
    "slug": slug.current
  }`;
  
  try {
    console.log(`Fetching categories with timestamp: ${timestamp}`);
    const categories = await client.fetch<Category[]>(query, { timestamp }, {
      cache: 'no-store',
      next: { revalidate: 0 },
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    console.log(`Successfully fetched ${categories?.length || 0} categories`);
    
    // 詳細なデバッグ情報
    if (categories && categories.length > 0) {
      console.log('First category sample:', JSON.stringify(categories[0], null, 2));
    } else {
      console.log('No categories returned from Sanity');
    }
    
    return categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    // エラーの詳細情報を表示
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return [];
  }
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
