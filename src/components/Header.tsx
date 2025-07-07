import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-black bg-opacity-50 text-white p-4 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link href="/">gomix666.com</Link>
        </h1>
        <nav className="flex gap-6 items-center">
          <Link href="/posts" className="hover:text-gray-300 transition-colors text-sm">ブログ</Link>
          <a href="/#profile" className="hover:text-gray-300 transition-colors text-sm">プロフィール</a>
        </nav>
      </div>
    </header>
  );
};
