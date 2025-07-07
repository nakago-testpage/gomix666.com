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
  title: string;
  slug: {
    current: string;
  };
  mainImage: {
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
  body: any; // For block content
  author: {
    name: string;
    image: any;
  };
  categories: {
      title: string;
  }[];
  tags: {
      title: string;
  }[];
  category?: CategoryInfo;
  publishedAt: string;
  excerpt?: string;
}
