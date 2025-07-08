import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
