import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // キャッシュを無効化して常に最新のアセットを配信
  generateEtags: false,
  // 静的アセットのキャッシュ時間を設定
  onDemandEntries: {
    maxInactiveAge: 25000,
    pagesBufferLength: 5,
  },
  // 画像の設定
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '**',
      },
    ],
    // 画像キャッシュを短く設定
    minimumCacheTTL: 60,
  },
  eslint: {
    // 本番ビルド時にESLintチェックを無効化
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 本番ビルド時に型チェックを無効化
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
