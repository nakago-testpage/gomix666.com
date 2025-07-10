'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaYoutube } from 'react-icons/fa';

interface BlogYouTubePromoProps {
  videoId?: string;
}

export default function BlogYouTubePromo({ videoId = 'FKZDa1Doecc' }: BlogYouTubePromoProps) {
  return (
    <div className="my-8 p-6 border border-gray-800 rounded-lg bg-gray-900/70 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="w-full md:w-1/2">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 flex flex-col">
          <h3 className="text-xl font-bold mb-2 text-cyan-400">Shamanic Drive</h3>
          <p className="text-gray-300 mb-4">
            AI音楽クリエイターとして活動中。実験的な音楽制作とテクノロジーの融合を探求しています。
            チャンネル登録して最新の音楽制作をチェックしてください！
          </p>
          <a 
            href="https://www.youtube.com/@ShamanicDrive" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-colors duration-300 self-start"
          >
            <FaYoutube size={20} />
            <span>チャンネル登録する</span>
          </a>
        </div>
      </div>
    </div>
  );
}
