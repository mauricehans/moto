import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { partsService } from '../services/api';
import { Part } from '../types/Part';

// Type simple pour les catégories - évite les conflits d'import
interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export const useParts = (): UseQueryResult<Part[], Error> => {
  return useQuery({
    queryKey: ['parts'],
    queryFn: async () => {
      try {
        const response = await partsService.getAll();
        return response.data.results;
      } catch (error) {
        console.error('Failed to fetch parts:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const usePart = (id: string): UseQueryResult<Part | null, Error> => {
  return useQuery({
    queryKey: ['part', id],
    queryFn: async () => {
      try {
        const response = await partsService.getById(id);
        return response.data;
      } catch (error) {
        console.error(`Failed to fetch part ${id}:`, error);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const usePartCategories = (): UseQueryResult<CategoryResponse[], Error> => {
  return useQuery({
    queryKey: ['part-categories'],
    queryFn: async () => {
      try {
        const response = await partsService.getCategories();
        return response.data;
      } catch (error) {
        console.error('Failed to fetch part categories:', error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
};

export const useCreatePart = (): UseMutationResult<Part, Error, Partial<Part>> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: partsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
    },
    onError: (error) => {
      console.error('Failed to create part:', error);
    },
  });
};
