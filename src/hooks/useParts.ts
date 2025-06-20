import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { partsService } from '../services/api';

export const useParts = () => {
  return useQuery({
    queryKey: ['parts'],
    queryFn: async () => {
      const response = await partsService.getAll();
      return response.data.results;
    },
  });
};

export const usePart = (id: string) => {
  return useQuery({
    queryKey: ['part', id],
    queryFn: async () => {
      const response = await partsService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const usePartCategories = () => {
  return useQuery({
    queryKey: ['part-categories'],
    queryFn: async () => {
      const response = await partsService.getCategories();
      return response.data;
    },
  });
};

export const useCreatePart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: partsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
    },
  });
};