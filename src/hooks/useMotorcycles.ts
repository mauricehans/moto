import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { motorcycleService } from '../services/api';
import { Motorcycle } from '../types/Motorcycle';

export const useMotorcycles = (): UseQueryResult<Motorcycle[], Error> => {
  return useQuery({
    queryKey: ['motorcycles'],
    queryFn: async () => {
      try {
        const response = await motorcycleService.getAll();
        return response.data?.results || [];
      } catch (error) {
        console.error('Failed to fetch motorcycles:', error);
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

export const useMotorcycle = (id: string): UseQueryResult<Motorcycle | null, Error> => {
  return useQuery({
    queryKey: ['motorcycle', id],
    queryFn: async () => {
      try {
        const response = await motorcycleService.getById(id);
        return response.data;
      } catch (error) {
        console.error(`Failed to fetch motorcycle ${id}:`, error);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useFeaturedMotorcycles = (): UseQueryResult<Motorcycle[], Error> => {
  return useQuery({
    queryKey: ['motorcycles', 'featured'],
    queryFn: async () => {
      try {
        const response = await motorcycleService.getFeatured();
        return response.data || [];
      } catch (error) {
        console.error('Failed to fetch featured motorcycles:', error);
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

export const useCreateMotorcycle = (): UseMutationResult<Motorcycle, Error, Partial<Motorcycle>> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: motorcycleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motorcycles'] });
    },
    onError: (error) => {
      console.error('Failed to create motorcycle:', error);
    },
  });
};
