import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { partsService } from '../services/api';

// ✅ Type harmonisé avec ID number
interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

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
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false, // ✅ Évite les refetch inutiles
  });
};
