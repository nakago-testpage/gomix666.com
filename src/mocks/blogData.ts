// モックデータ：Sanity接続に問題がある場合のフォールバック用
export const mockPosts = [
  {
    _id: 'mock-post-1',
    title: 'モックブログ記事1',
    slug: 'mock-post-1',
    excerpt: 'これはモックデータです。環境変数とSanity接続を確認してください。',
    mainImage: null,
    publishedAt: new Date().toISOString(),
    category: {
      _id: 'mock-cat-1',
      title: 'テスト',
      slug: 'test'
    },
    author: {
      name: 'テストユーザー',
      image: null
    },
    _updatedAt: new Date().toISOString()
  },
  {
    _id: 'mock-post-2',
    title: 'モックブログ記事2',
    slug: 'mock-post-2',
    excerpt: '環境変数が正しく設定されていることを確認してください。',
    mainImage: null,
    publishedAt: new Date().toISOString(),
    category: {
      _id: 'mock-cat-2',
      title: 'ヘルプ',
      slug: 'help'
    },
    author: {
      name: 'テストユーザー',
      image: null
    },
    _updatedAt: new Date().toISOString()
  }
];

export const mockCategories = [
  {
    _id: 'mock-cat-1',
    title: 'テスト',
    slug: 'test',
    description: 'テストカテゴリー'
  },
  {
    _id: 'mock-cat-2',
    title: 'ヘルプ',
    slug: 'help',
    description: '環境変数の設定方法'
  }
];
