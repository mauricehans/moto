import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motorcycleService } from '../services/api';
import { Motorcycle } from '../types/Motorcycle';

export const useMotorcycles = () => {
  return useQuery<Motorcycle[]>({
    queryKey: ['motorcycles'],
    queryFn: async () => {
      const response = await motorcycleService.getAll();
      return response.data.results;
    },
  });
};

export const useMotorcycle = (id: string) => {
  return useQuery<Motorcycle>({
    queryKey: ['motorcycle', id],
    queryFn: async () => {
      const response = await motorcycleService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useFeaturedMotorcycles = () => {
  return useQuery<Motorcycle[]>({ // Assuming getFeatured returns an array of Motorcycles
    queryKey: ['motorcycles', 'featured'],
    queryFn: async () => {
      const response = await motorcycleService.getFeatured();
      // Check if the response is paginated or a direct array
      if ('results' in response.data) {
        return response.data.results;
      } else {
        return response.data;
      }
    },
  });
};

export const useCreateMotorcycle = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Motorcycle, Error, Motorcycle>({
    mutationFn: motorcycleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motorcycles'] });
    },
  });
};
