'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // エラーをログに記録
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 pt-20">
      <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg p-8 max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-red-400 mb-4">エラーが発生しました</h2>
        <p className="text-gray-300 mb-6">
          申し訳ありませんが、コンテンツの読み込み中に問題が発生しました。
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors"
          >
            再試行する
          </button>
          <Link
            href="/"
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
