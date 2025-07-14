import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogService } from '../services/api';
import { Post, BlogCategory } from '../types/Blog';

export const useBlogPosts = () => {
  return useQuery<Post[]>({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const response = await blogService.getPosts();
      return response.data.results;
    },
  });
};

export const useBlogPost = (id: string) => {
  return useQuery<Post>({
    queryKey: ['blog-post', id],
    queryFn: async () => {
      const response = await blogService.getPostById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useBlogCategories = () => {
  return useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const response = await blogService.getCategories();
      return response.data;
    },
  });
};