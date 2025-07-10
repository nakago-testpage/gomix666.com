export interface CategoryInfo {
  title: string;
  slug: string;
}

export interface Category {
  _id: string;
  title: string;
  slug: string;
}

export interface Tag {
  _id: string;
  title: string;
  slug: string;
}

export interface Post {
  _id: string;
  _createdAt: string;
  _updatedAt?: string;
  title: string;
  slug: string;
  mainImage?: {
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
  body?: {
    ja: any;
  };
  author?: {
    name: string;
    image: any;
  };
  categories?: {
    title: string;
  }[];
  tags?: {
    title: string;
  }[];
  category?: CategoryInfo;
  publishedAt: string;
  excerpt?: string;
  wordCount?: number;
  youtubeUrl?: string;
}
