'use client';

import dynamic from 'next/dynamic';

export const PostMetrics = dynamic(() => import('@/components/PostMetrics'), { ssr: false });
export const ShareButtons = dynamic(() => import('@/components/ShareButtons'), { ssr: false });
export const BlogYouTubePromo = dynamic(() => import('@/components/BlogYouTubePromo'), { ssr: false });
export const RelatedPosts = dynamic(() => import('@/components/RelatedPosts'), { ssr: false });
