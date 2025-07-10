import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 pt-20">
      <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg p-8 max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-cyan-400 mb-4">ページが見つかりません</h2>
        <p className="text-gray-300 mb-6">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link
          href="/"
          className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors inline-block"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}
