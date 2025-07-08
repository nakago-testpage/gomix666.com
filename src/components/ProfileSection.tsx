'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaTwitter, FaYoutube, FaGlobe, FaRetweet, FaHeart, FaReply } from 'react-icons/fa';

// Gomixロゴ画像のBase64データ（添付された画像から変換）
const gomixLogoBase64 = '/images/gomix-logo.png';

const ProfileSection: React.FC = () => {
  return (
    <section id="profile" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-cyan-300">Profile</h2>
        
        <div className="flex flex-col gap-8">
          {/* Profile Info */}
          <div className="w-full max-w-3xl mx-auto">
            <div className="bg-black bg-opacity-50 p-8 rounded-lg border border-emerald-800 h-full">
              <div className="flex flex-col md:flex-row items-center mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6 border-4 border-cyan-500 shadow-lg shadow-cyan-500/50">
                  <img 
                    src="/images/gomix-logo.png" 
                    alt="gomix666" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">gomix666</h3>
                  <div className="flex items-center justify-center md:justify-start text-cyan-400 mb-4">
                    <FaTwitter className="mr-2" />
                    <Link 
                      href="https://x.com/gomix666" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-cyan-300 transition-colors"
                    >
                      @gomix666
                    </Link>
                  </div>
                  <a 
                    href="https://x.com/gomix666" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-gradient-to-r from-cyan-500 to-emerald-600 text-white font-bold py-2 px-6 rounded-full hover:scale-105 transition-transform duration-300 shadow-lg"
                  >
                    <div className="flex items-center justify-center">
                      <FaTwitter className="mr-2" />
                      <span>Follow on X</span>
                    </div>
                  </a>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-white text-base leading-relaxed">専門卒→就職失敗→ネットワークビジネス失敗→うつ→高額商材300万で自己破産😱→水商売に再就職も失敗→コロナで休業→リボ払い300万で債務整理中😓マイナス300万→残り225万円。ポイ活、投資、仮想通貨で再起を目指す⤴️</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
