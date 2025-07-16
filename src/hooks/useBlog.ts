import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { blogService } from '../services/api';
import { Post } from '../types/Blog';

interface BlogCategoryResponse {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export const useBlogPosts = (): UseQueryResult<Post[], Error> => {
  return useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      try {
        const response = await blogService.getPosts();
        return response.data.results;
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useBlogPost = (id: string): UseQueryResult<Post | null, Error> => {
  return useQuery({
    queryKey: ['blog-post', id],
    queryFn: async () => {
      try {
        const response = await blogService.getPostById(id);
        return response.data;
      } catch (error) {
        console.error(`Failed to fetch blog post ${id}:`, error);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useBlogCategories = (): UseQueryResult<BlogCategoryResponse[], Error> => {
  return useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      try {
        const response = await blogService.getCategories();
        return response.data;
      } catch (error) {
        console.error('Failed to fetch blog categories:', error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
};
