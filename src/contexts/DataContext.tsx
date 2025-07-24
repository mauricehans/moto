import React, { createContext, useContext, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Configuration optimisée du QueryClient avec des paramètres stricts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes - données considérées comme fraîches plus longtemps
      cacheTime: 15 * 60 * 1000, // 15 minutes - garde en cache plus longtemps
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false, // Désactivé temporairement pour éviter les requêtes
      refetchInterval: false,
      retry: (failureCount, error: any) => {
        // Ne jamais réessayer les erreurs réseau
        if (error?.message?.includes('Serveur indisponible') || 
            error?.message?.includes('Network Error') ||
            error?.code === 'ERR_NETWORK') {
          return false;
        }
        return failureCount < 1; // Maximum 1 retry
      },
      retryDelay: 5000, // 5 secondes entre les tentatives
    },
    mutations: {
      retry: 0, // Pas de retry pour les mutations
    },
  },
});

interface DataContextType {
  queryClient: QueryClient;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  return (
    <DataContext.Provider value={{ queryClient }}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </DataContext.Provider>
  );
};

export default DataProvider;