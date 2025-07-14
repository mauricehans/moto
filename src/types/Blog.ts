export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  category: BlogCategory;
  content: string;
  image: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}
