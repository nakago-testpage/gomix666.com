import { getPosts, getCategories } from '@/sanity/queries';
import HomeClient from './page.client';

// キャッシュを無効化して常に最新データを取得
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function Home() {
  // データ取得時のエラーハンドリングを追加
  let posts: any[] = [];
  let categories: any[] = [];
  
  try {
    posts = await getPosts() || [];
    categories = await getCategories() || [];
    console.log('Posts fetched:', posts?.length || 0);
    console.log('Categories fetched:', categories?.length || 0);
  } catch (error) {
    console.error('Error fetching data:', error);
    // エラーが発生した場合は空の配列を使用
    posts = [];
    categories = [];
  }

  return <HomeClient posts={posts} categories={categories} />;
}
