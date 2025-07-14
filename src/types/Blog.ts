export interface Post {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  image: string;
  isPublished: boolean;
  createdAt: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}