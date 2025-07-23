import { useState, useEffect } from 'react';
import { garageService } from '../services/api';
import { GarageSettings } from '../types/Admin';

const useGarageSettings = () => {
  const [settings, setSettings] = useState<GarageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await garageService.getSettings();
        const data = response.data;
        setSettings(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des paramètres:', err);
        setError('Erreur lors du chargement des paramètres');
        // Valeurs par défaut en cas d'erreur
        setSettings({
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
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error, refetch: () => fetchSettings() };
};

export default useGarageSettings;