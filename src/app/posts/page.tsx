import Breadcrumbs from '@/components/Breadcrumbs';
import { getPosts, getCategories } from '@/sanity/queries';
import BlogPostsPage from './page.client';

// キャッシュを無効化して常に最新データを取得
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function BlogIndexPage({ searchParams }: { searchParams: { category?: string } }) {
  // データ取得時のエラーハンドリングを追加
  let posts: any[] = [];
  let categories: any[] = [];
  
  try {
    // カテゴリーフィルターがあれば渡す
    posts = await getPosts(searchParams.category) || [];
    categories = await getCategories() || [];
    console.log('Posts fetched in server component:', posts?.length || 0);
    console.log('Categories fetched in server component:', categories?.length || 0);
  } catch (error) {
    console.error('Error fetching data in server component:', error);
    // エラーが発生した場合は空の配列を使用
    posts = [];
    categories = [];
  }

  // パンくずリストのアイテム
  const breadcrumbItems = [
    { title: 'Home', href: '/' },
    { title: 'Blog' }
  ];
  
  return <BlogPostsPage 
    posts={posts} 
    categories={categories} 
    breadcrumbItems={breadcrumbItems} 
    selectedCategory={searchParams.category} 
  />;
}
