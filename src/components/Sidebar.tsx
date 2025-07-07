import Link from 'next/link';

// 仮の型定義。後でtypes.tsに移動します。
interface Category {
  _id: string;
  title: string;
  slug: string;
}

interface Tag {
  _id: string;
  title: string;
  slug: string;
}

interface SidebarProps {
  categories: Category[];
  tags: Tag[];
}

const Sidebar = ({ categories, tags }: SidebarProps) => {
  return (
    <aside className="w-full lg:w-1/4 lg:pl-8">
      <div className="mb-12">
        <h3 className="text-2xl font-bold mb-4 text-cyan-400">Categories</h3>
        <ul>
          {categories.map((category) => (
            <li key={category._id} className="mb-2">
              <Link href={`/categories/${category.slug}`}>
                <span className="text-gray-300 hover:text-purple-400 transition-colors duration-300">{category.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-4 text-cyan-400">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link href={`/tags/${tag.slug}`} key={tag._id}>
              <span className="block bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-purple-600 hover:text-white transition-colors duration-300">
                {tag.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
