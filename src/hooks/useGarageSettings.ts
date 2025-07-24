import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { garageService } from '../services/api';
import { GarageSettings } from '../types/Admin';

// Valeurs par défaut pour les paramètres du garage
const defaultSettings: GarageSettings = {
  name: 'AGDE MOTO',
  address: '123 Avenue de la Plage, 34300 Agde, France',
  phone: '+33 4 67 12 34 56',
  email: 'contact@agdemoto.fr',
  website: 'https://agdemoto.fr',
  description: 'Votre spécialiste moto à Agde depuis 2005. Vente de motos d\'occasion et pièces détachées sélectionnées avec soin.',
  social_media: {
    facebook: 'https://facebook.com/agdemoto34',
    instagram: 'https://instagram.com/agde_moto_officiel',
    youtube: 'https://youtube.com/@AgdeMotoPro'
  },
  business_hours: {
    monday: { is_closed: false, intervals: [{ open: '09:00', close: '18:00' }] },
    tuesday: { is_closed: false, intervals: [{ open: '09:00', close: '18:00' }] },
    wednesday: { is_closed: false, intervals: [{ open: '09:00', close: '18:00' }] },
    thursday: { is_closed: false, intervals: [{ open: '09:00', close: '18:00' }] },
    friday: { is_closed: false, intervals: [{ open: '09:00', close: '18:00' }] },
    saturday: { is_closed: false, intervals: [{ open: '09:00', close: '17:00' }] },
    sunday: { is_closed: true, intervals: [] }
  },
  seo_settings: {
    meta_title: 'AGDE MOTO - Spécialiste moto à Agde',
    meta_description: 'Votre spécialiste moto à Agde depuis 2005. Vente de motos d\'occasion et pièces détachées.',
    keywords: 'moto, agde, occasion, pièces détachées'
  }
};

const useGarageSettings = (): UseQueryResult<GarageSettings, Error> & { settings: GarageSettings | undefined; loading: boolean; error: Error | null } => {
  const query = useQuery({
    queryKey: ['garage-settings'],
    queryFn: async () => {
      try {
        const response = await garageService.getSettings();
        return response.data;
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
        // Retourner les valeurs par défaut en cas d'erreur
        return defaultSettings;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Ne pas réessayer si c'est une erreur réseau
      if (error?.message?.includes('Serveur indisponible')) {
        return false;
      }
      return failureCount < 1; // Réessayer une seule fois
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });

  return {
    ...query,
    settings: query.data,
    loading: query.isLoading,
    error: query.error,
  };
};

export default useGarageSettings;