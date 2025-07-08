'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
}

const YouTubeSection: React.FC = () => {
  const [latestVideos, setLatestVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const channelId = 'UCxLPKzuDJJLI5EwOTMI_KQg'; // ShamanicDrivebygomix666 channel ID
  const channelUrl = 'https://www.youtube.com/@ShamanicDrivebygomix666';

  useEffect(() => {
    // Using the actual video ID provided by the user
    const videos: Video[] = [
      {
        id: 'FKZDa1Doecc', // Actual video from Shamanic Drive channel
        title: 'Shamanic Drive - Tribal Trance [AI Music]',
        thumbnail: 'https://i.ytimg.com/vi/FKZDa1Doecc/hqdefault.jpg',
      },
      {
        id: 'FKZDa1Doecc', // Same video as backup
        title: 'Shamanic Drive - Ethnic Beats [AI Music]',
        thumbnail: 'https://i.ytimg.com/vi/FKZDa1Doecc/hqdefault.jpg',
      },
      {
        id: 'FKZDa1Doecc', // Same video as backup
        title: 'Shamanic Drive - Mystical Journey [AI Music]',
        thumbnail: 'https://i.ytimg.com/vi/FKZDa1Doecc/hqdefault.jpg',
      },
    ];
    
    setLatestVideos(videos);
    setSelectedVideo(videos[0].id);
  }, []);

  return (
    <section className="w-full py-12 bg-black bg-opacity-70 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">
          <span className="text-cyan-400">Shamanic Drive</span> - AI Ethnic Trance Music
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* YouTube Player */}
          <div className="lg:w-2/3">
            {selectedVideo && (
              <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg shadow-cyan-900/50">
                <iframe 
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=0`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
          
          {/* Channel Info & Video List */}
          <div className="lg:w-1/3 flex flex-col">
            <div className="mb-6 p-4 bg-emerald-900 bg-opacity-30 rounded-lg">
              <h3 className="text-xl font-bold mb-2">About My Channel</h3>
              <p className="mb-4">
                I create ethnic trance music using AI technology. My tracks blend traditional sounds with modern electronic beats for a unique shamanic experience.
              </p>
              <Link 
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Visit My YouTube Channel
              </Link>
            </div>
            
            <h3 className="text-xl font-bold mb-2">Latest Videos</h3>
            <div className="space-y-4">
              {latestVideos.map((video) => (
                <div 
                  key={video.id + video.title}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedVideo === video.id ? 'bg-cyan-900 bg-opacity-50' : 'hover:bg-gray-800'
                  }`}
                  onClick={() => setSelectedVideo(video.id)}
                >
                  <div className="w-24 h-16 flex-shrink-0 overflow-hidden rounded">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm">{video.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YouTubeSection;
