'use client';

import React, { useEffect, useRef } from 'react';
import Script from 'next/script';
import { FaTwitter } from 'react-icons/fa';
import Link from 'next/link';

interface TwitterFeedProps {
  username: string;
}

const TwitterFeed: React.FC<TwitterFeedProps> = ({ username }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Function to load Twitter embed
  const loadTwitterEmbed = () => {
    // Check if the container exists
    if (!containerRef.current) return;
    
    // Clear any existing content
    containerRef.current.innerHTML = '';
    
    // Create a new anchor element that Twitter widget will transform
    const anchor = document.createElement('a');
    anchor.className = 'twitter-timeline';
    anchor.setAttribute('data-theme', 'dark');
    anchor.setAttribute('data-chrome', 'noheader nofooter noborders transparent');
    anchor.setAttribute('data-tweet-limit', '5');
    anchor.setAttribute('data-width', '100%');
    anchor.setAttribute('data-height', '400');
    anchor.setAttribute('href', `https://twitter.com/${username}`);
    anchor.innerText = 'Tweets by ' + username;
    
    // Append the anchor to the container
    containerRef.current.appendChild(anchor);
    
    // If Twitter widgets are already loaded, process the newly added element
    if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load(containerRef.current);
    }
  };
  
  // Handle Twitter script load event
  const handleTwitterScriptLoad = () => {
    if (window.twttr) {
      loadTwitterEmbed();
    }
  };
  
  useEffect(() => {
    // Try to load Twitter embed when component mounts
    loadTwitterEmbed();
    
    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [username]);
  
  return (
    <div className="twitter-feed">
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
        onLoad={handleTwitterScriptLoad}
      />
      
      <div ref={containerRef} className="w-full min-h-[400px] bg-gray-800 bg-opacity-30 rounded-lg p-4">
        <div className="flex flex-col items-center justify-center h-60">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400 mb-4"></div>
          <p className="text-gray-400">Loading tweets from @{username}...</p>
        </div>
      </div>
      
      <div className="mt-4">
        <Link 
          href={`https://x.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
        >
          <FaTwitter className="mr-2" />
          View Full Profile on X
        </Link>
      </div>
    </div>
  );
};

export default TwitterFeed;

// Add TypeScript declaration for Twitter widgets
declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement) => void;
      };
    };
  }
}
