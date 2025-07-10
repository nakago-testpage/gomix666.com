'use client';

import React from 'react';
import Link from 'next/link';

const YouTubeSection: React.FC = () => {
  const channelId = 'UCxLPKzuDJJLI5EwOTMI_KQg'; // ShamanicDrivebygomix666 channel ID
  const channelUrl = 'https://www.youtube.com/@ShamanicDrivebygomix666';
  const featuredVideoId = 'FKZDa1Doecc'; // メイン表示する動画ID

  return (
    <section className="w-full py-12 bg-black/40 backdrop-blur-sm text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center scroll-fade-in">
          <span className="text-cyan-400">Shamanic Drive</span> - AI Ethnic Trance Music
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* YouTube Player */}
          <div className="w-full lg:w-2/3 mx-auto scroll-fade-in">
            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg shadow-cyan-900/50">
              <iframe 
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${featuredVideoId}?autoplay=0`}
                title="Shamanic Drive - AI Ethnic Trance Music"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-emerald-900/30 backdrop-blur-sm rounded-lg border border-emerald-800/50 shadow-lg shadow-emerald-500/10 max-w-2xl mx-auto scroll-fade-in" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-xl font-bold mb-3 text-center">About My Channel</h3>
          <p className="mb-6 text-center">
            I create ethnic trance music using AI technology. My tracks blend traditional sounds with modern electronic beats for a unique shamanic experience.
          </p>
          <div className="flex justify-center">
            <Link 
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Visit My YouTube Channel
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YouTubeSection;
