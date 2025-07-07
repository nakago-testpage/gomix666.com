import Link from 'next/link';
import HeaderIcon from './HeaderIcon';
import DockText from './DockText';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-black bg-opacity-50 text-white z-50 h-12">
      <div className="container mx-auto flex h-full justify-between items-center px-4">
                <div className="flex items-center gap-4">
          <Link href="/"><DockText>gomix666.com</DockText></Link>
          <HeaderIcon />
        </div>
        <nav className="flex gap-6 items-center">
          <Link href="/posts" className="hover:text-gray-300 transition-colors text-sm">ブログ</Link>
          <a href="/#profile" className="hover:text-gray-300 transition-colors text-sm">プロフィール</a>
          <Link href="/contact" className="hover:text-gray-300 transition-colors text-sm">Contact</Link>
        </nav>
      </div>
    </header>
  );
};
