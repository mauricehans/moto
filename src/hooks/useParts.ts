import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { partsService } from '../services/api';
import { Part } from '../types/Part';

// Type simple pour les catégories - évite les conflits d'import
interface CategoryResponse {
  id: number;
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
        return response.data?.results || [];
      } catch (error) {
        console.error('Failed to fetch parts:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      // Ne pas réessayer si c'est une erreur réseau
      if (error?.message?.includes('Serveur indisponible')) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
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
        return response.data || [];
      } catch (error) {
        console.error('Failed to fetch part categories:', error);
        return [];
      }
    },
    staleTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      // Ne pas réessayer si c'est une erreur réseau
      if (error?.message?.includes('Serveur indisponible')) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
};

export const useCreatePart = (): UseMutationResult<Part, Error, Partial<Part>> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Part>) => {
      const response = await partsService.create(data as Omit<Part, 'id' | 'created_at' | 'updated_at'>);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
    },
    onError: (error) => {
      console.error('Failed to create part:', error);
    },
  });
};
