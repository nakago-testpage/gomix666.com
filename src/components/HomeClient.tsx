'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// クライアントサイドでのみレンダリングするために動的インポート
const DynamicHomepage = dynamic(() => import('@/components/DynamicHomepage'), {
  ssr: false,
  loading: () => <div className="w-full h-screen flex items-center justify-center bg-gray-900">Loading...</div>
});

export default function HomeClient() {
  return (
    <div className="w-full h-screen">
      <DynamicHomepage />
    </div>
  );
}
