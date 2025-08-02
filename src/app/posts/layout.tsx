'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getPosts, getCategories } from '@/sanity/queries';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // ページ遷移時にデータを強制的に再取得するための処理
  useEffect(() => {
    // ブログページに来た時だけ実行
    if (pathname === '/posts') {
      // データを事前に取得して確実にキャッシュを更新
      const prefetchData = async () => {
        try {
          console.log('Prefetching blog data...');
          // 直接Sanityクエリを実行してキャッシュを更新
          await Promise.all([
            getPosts(),
            getCategories()
          ]);
          
          // 少し遅延させてからルーターをリフレッシュ
          setTimeout(() => {
            console.log('Refreshing router...');
            router.refresh();
          }, 100);
        } catch (error) {
          console.error('Error prefetching blog data:', error);
        }
      };
      
      prefetchData();
    }
  }, [pathname, router]);

  return <>{children}</>;
}
