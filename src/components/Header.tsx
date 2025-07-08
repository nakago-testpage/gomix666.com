import Link from 'next/link';
import HeaderIcon from './HeaderIcon';
import DockText from './DockText';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-emerald-900/40 text-white z-50 h-12 shadow-md shadow-emerald-500/20">
      <div className="container mx-auto flex h-full justify-between items-center px-4">
                <div className="flex items-center gap-4">
          <Link href="/"><DockText>gomix666.com</DockText></Link>
          <HeaderIcon />
        </div>
        <nav className="flex gap-6 items-center">
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
      </div>
    </header>
  );
};
