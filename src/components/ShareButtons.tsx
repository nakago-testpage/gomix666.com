'use client';

import { FaFacebook, FaLink } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <div className="my-8 p-4 border border-gray-800 rounded-lg bg-gray-900/70">
      <h3 className="text-lg font-medium mb-4 text-cyan-400">この記事をシェアする</h3>
      <div className="flex gap-4">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1DA1F2] text-white hover:opacity-80 transition-opacity"
          aria-label="Share on Twitter"
        >
          <FaXTwitter size={20} />
        </a>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-[#4267B2] text-white hover:opacity-80 transition-opacity"
          aria-label="Share on Facebook"
        >
          <FaFacebook size={20} />
        </a>
        <button
          onClick={copyToClipboard}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 text-white hover:opacity-80 transition-opacity"
          aria-label="Copy link"
        >
          <FaLink size={20} />
        </button>
        {copied && (
          <span className="ml-2 text-green-500 self-center">URLをコピーしました!</span>
        )}
      </div>
    </div>
  );
}
