import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { partsService } from '../services/api';
import { Part, PartCategory } from '../types/Part';

export const useParts = () => {
  return useQuery<Part[]>({
    queryKey: ['parts'],
    queryFn: async () => {
      const response = await partsService.getAll();
      return response.data.results;
    },
  });
};

export const usePart = (id: string) => {
  return useQuery<Part>({
    queryKey: ['part', id],
    queryFn: async () => {
      const response = await partsService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const usePartCategories = () => {
  return useQuery<PartCategory[]>({
    queryKey: ['part-categories'],
    queryFn: async () => {
      const response = await partsService.getCategories();
      return response.data;
    },
  });
};

export const useCreatePart = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Part, Error, Part>({
    mutationFn: partsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
    },
  });
};