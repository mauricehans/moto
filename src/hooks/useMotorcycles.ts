import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motorcycleService } from '../services/api';

export const useMotorcycles = () => {
  return useQuery({
    queryKey: ['motorcycles'],
    queryFn: async () => {
      const response = await motorcycleService.getAll();
      return response.data.results;
    },
  });
};

export const useMotorcycle = (id: string) => {
  return useQuery({
    queryKey: ['motorcycle', id],
    queryFn: async () => {
      const response = await motorcycleService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useFeaturedMotorcycles = () => {
  return useQuery({
    queryKey: ['motorcycles', 'featured'],
    queryFn: async () => {
      const response = await motorcycleService.getFeatured();
      return response.data;
    },
  });
};

export const useCreateMotorcycle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: motorcycleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motorcycles'] });
    },
  });
};
