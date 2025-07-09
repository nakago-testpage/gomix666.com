'use client';

import { useState } from 'react';
import Link from 'next/link';
import HeaderIcon from './HeaderIcon';
import DockText from './DockText';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-emerald-900/40 text-white z-[100] h-12 shadow-md shadow-emerald-500/20 backdrop-blur-sm">
      <div className="container mx-auto flex h-full justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <Link href="/?full=true"><DockText>gomix666.com</DockText></Link>
          <HeaderIcon />
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link 
            href="/posts" 
            className="text-cyan-300 text-glow hover:text-pink-400 hover:scale-110 transition-all duration-300 text-sm font-medium"
          >
            ブログ
          </Link>
          <a 
            href="/#profile" 
            className="text-cyan-300 text-glow hover:text-pink-400 hover:scale-110 transition-all duration-300 text-sm font-medium"
          >
            プロフィール
          </a>
          <Link 
            href="/contact" 
            className="text-cyan-300 text-glow hover:text-pink-400 hover:scale-110 transition-all duration-300 text-sm font-medium"
          >
            Contact
          </Link>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-cyan-300 hover:text-pink-400 transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-12 left-0 w-full bg-gray-900/95 backdrop-blur-md py-4 px-4 shadow-lg shadow-cyan-900/30 border-t border-cyan-900/30 z-[90]">
          <nav className="flex flex-col gap-4">
            <Link 
              href="/posts" 
              className="text-cyan-300 hover:text-pink-400 transition-colors py-2 px-4 hover:bg-gray-800/50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              ブログ
            </Link>
            <a 
              href="/#profile" 
              className="text-cyan-300 hover:text-pink-400 transition-colors py-2 px-4 hover:bg-gray-800/50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              プロフィール
            </a>
            <Link 
              href="/contact" 
              className="text-cyan-300 hover:text-pink-400 transition-colors py-2 px-4 hover:bg-gray-800/50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
