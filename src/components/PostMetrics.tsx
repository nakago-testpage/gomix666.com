'use client';

import { useEffect, useState } from 'react';
import { FaEye, FaClock } from 'react-icons/fa';

interface PostMetricsProps {
  slug: string;
  wordCount: number;
  publishedAt: string;
  updatedAt?: string;
}

export default function PostMetrics({ slug, wordCount, publishedAt, updatedAt }: PostMetricsProps) {
  const [viewCount, setViewCount] = useState<number>(0);
  
  // 閲覧数を取得・更新する関数（実際にはローカルストレージを使用）
  useEffect(() => {
    // ローカルストレージから閲覧数を取得
    const getViewCount = () => {
      try {
        const viewCounts = JSON.parse(localStorage.getItem('postViewCounts') || '{}');
        return viewCounts[slug] || 0;
      } catch (error) {
        console.error('Failed to get view count:', error);
        return 0;
      }
    };

    // 閲覧数を更新
    const updateViewCount = () => {
      try {
        const viewCounts = JSON.parse(localStorage.getItem('postViewCounts') || '{}');
        const newCount = (viewCounts[slug] || 0) + 1;
        viewCounts[slug] = newCount;
        localStorage.setItem('postViewCounts', JSON.stringify(viewCounts));
        setViewCount(newCount);
      } catch (error) {
        console.error('Failed to update view count:', error);
      }
    };

    // 初期値を設定
    setViewCount(getViewCount());
    
    // ページ訪問時に閲覧数を更新
    updateViewCount();
  }, [slug]);

  // 読了時間を計算（平均的な読書速度は1分あたり約250単語）
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 250));

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6">
      <div className="flex items-center gap-1">
        <FaEye className="text-cyan-400" />
        <span>{viewCount} 回閲覧</span>
      </div>
      <div className="flex items-center gap-1">
        <FaClock className="text-cyan-400" />
        <span>約{readingTimeMinutes}分で読めます</span>
      </div>
      <div>
        <span>公開日: {formatDate(publishedAt)}</span>
      </div>
      {updatedAt && updatedAt !== publishedAt && (
        <div>
          <span>更新日: {formatDate(updatedAt)}</span>
        </div>
      )}
    </div>
  );
}
