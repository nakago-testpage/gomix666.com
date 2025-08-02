'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/types';
import { getPosts, getCategories } from '@/sanity/queries';

export function useBlogData(categorySlug?: string | null) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // データ取得関数
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      console.log('Fetching blog data...');
      
      try {
        // 直接データを取得する方法に変更
        console.log('Fetching posts...');
        const postsData = await getPosts();
        console.log('Posts fetched:', postsData?.length || 0, postsData);
        
        console.log('Fetching categories...');
        const categoriesData = await getCategories();
        console.log('Categories fetched:', categoriesData?.length || 0, categoriesData);
        
        // データをセット
        if (Array.isArray(postsData) && postsData.length > 0) {
          console.log('Setting posts data');
          setPosts(postsData);
        } else {
          console.warn('Posts data is empty or not an array');
          setPosts([]);
        }
        
        if (Array.isArray(categoriesData) && categoriesData.length > 0) {
          console.log('Setting categories data');
          setCategories(categoriesData);
        } else {
          console.warn('Categories data is empty or not an array');
          setCategories([]);
        }
      } catch (err) {
        console.error('Error fetching blog data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        // エラー時は空の配列をセット
        setPosts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // 15秒ごとにデータを再取得
    const intervalId = setInterval(fetchData, 15000);
    
    return () => clearInterval(intervalId);
  }, []);

  // カテゴリーでフィルタリングした投稿を返す
  const filteredPosts = categorySlug 
    ? posts.filter(post => post?.category && post.category.slug === categorySlug)
    : posts;

  return {
    posts: filteredPosts,
    categories,
    loading,
    error,
    refetch: async () => {
      setLoading(true);
      console.log('Manually refetching blog data...');
      try {
        const postsData = await getPosts();
        console.log('Refetched posts:', postsData?.length || 0);
        
        const categoriesData = await getCategories();
        console.log('Refetched categories:', categoriesData?.length || 0);
        
        if (Array.isArray(postsData)) {
          setPosts(postsData);
        }
        
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        }
      } catch (err) {
        console.error('Error refetching blog data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }
  };
}
