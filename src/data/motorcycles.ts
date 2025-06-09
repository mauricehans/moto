import { Motorcycle } from '../types/Motorcycle';

export const motorcycles: Motorcycle[] = [
  {
    id: '1',
    brand: 'Yamaha',
    model: 'MT-07',
    year: 2022,
    price: 6999,
    mileage: 3500,
    engine: '689 cc',
    power: 73,
    license: 'A2',
    color: 'Noir',
    description: 'Yamaha MT-07 en excellent état, entretien récent effectué, pneus neufs, aucun frais à prévoir. Moto très agréable à conduire, idéale pour débuter ou pour un usage quotidien.',
    features: [
      'ABS',
      'Éclairage LED',
      'Système d\'échappement Akrapovic',
      'Protection moteur',
      'Selle confort'
    ],
    images: [
      'https://images.pexels.com/photos/2611686/pexels-photo-2611686.jpeg',
      'https://images.pexels.com/photos/163210/motorcycles-race-helmets-pilots-163210.jpeg',
      'https://images.pexels.com/photos/595807/pexels-photo-595807.jpeg',
      'https://images.pexels.com/photos/40904/bmw-motorcycle-motorcycles-bike-40904.jpeg'
    ],
    isNew: true,
    isFeatured: true,
    createdAt: '2023-05-15'
  },
  {
    id: '2',
    brand: 'Honda',
    model: 'CB650R',
    year: 2021,
    price: 7499,
    mileage: 8200,
    engine: '649 cc',
    power: 95,
    license: 'A',
    color: 'Rouge',
    description: 'Honda CB650R Neo Sports Cafe en parfait état. Entretien suivi chez concessionnaire Honda. Moto polyvalente et fiable avec un look néo-rétro très réussi.',
    features: [
      'ABS',
      'Contrôle de traction HSTC',
      'Fourche Showa SFF-BP',
      'Éclairage full LED',
      'Tableau de bord LCD'
    ],
    images: [
      'https://images.pexels.com/photos/1413412/pexels-photo-1413412.jpeg',
      'https://images.pexels.com/photos/163210/motorcycles-race-helmets-pilots-163210.jpeg',
      'https://images.pexels.com/photos/595807/pexels-photo-595807.jpeg',
      'https://images.pexels.com/photos/40904/bmw-motorcycle-motorcycles-bike-40904.jpeg'
    ],
    isFeatured: true,
    createdAt: '2023-04-20'
  },
  {
    id: '3',
    brand: 'Kawasaki',
    model: 'Z900',
    year: 2020,
    price: 8299,
    mileage: 12500,
    engine: '948 cc',
    power: 125,
    license: 'A',
    color: 'Vert',
    description: 'Kawasaki Z900 en très bon état, révision complète récente, pneus neufs. Roadster puissant et réactif, position de conduite confortable pour la route.',
    features: [
      'ABS',
      'Modes de conduite',
      'Contrôle de traction KTRC',
      'Éclairage LED',
      'Tableau de bord TFT couleur',
      'Connectivité smartphone'
    ],
    images: [
      'https://images.pexels.com/photos/819805/pexels-photo-819805.jpeg',
      'https://images.pexels.com/photos/163210/motorcycles-race-helmets-pilots-163210.jpeg',
      'https://images.pexels.com/photos/595807/pexels-photo-595807.jpeg',
      'https://images.pexels.com/photos/40904/bmw-motorcycle-motorcycles-bike-40904.jpeg'
    ],
    createdAt: '2023-03-10'
  },
  {
    id: '4',
    brand: 'BMW',
    model: 'R 1250 GS',
    year: 2021,
    price: 16500,
    mileage: 15800,
    engine: '1254 cc',
    power: 136,
    license: 'A',
    color: 'Blanc',
    description: 'BMW R 1250 GS, la référence des trails routiers. Parfaitement entretenue, équipée de nombreuses options, prête pour les grandes aventures.',
    features: [
      'ABS Pro',
      'Dynamic ESA',
      'Modes de conduite Pro',
      'Shifter Pro',
      'Valises latérales',
      'Top case',
      'GPS Navigateur',
      'Selle chauffante',
      'Poignées chauffantes'
    ],
    images: [
      'https://images.pexels.com/photos/2393821/pexels-photo-2393821.jpeg',
      'https://images.pexels.com/photos/163210/motorcycles-race-helmets-pilots-163210.jpeg',
      'https://images.pexels.com/photos/595807/pexels-photo-595807.jpeg',
      'https://images.pexels.com/photos/40904/bmw-motorcycle-motorcycles-bike-40904.jpeg'
    ],
    isFeatured: true,
    createdAt: '2023-02-15'
  },
  {
    id: '5',
    brand: 'Ducati',
    model: 'Monster 937',
    year: 2022,
    price: 11999,
    mileage: 4200,
    engine: '937 cc',
    power: 111,
    license: 'A',
    color: 'Rouge',
    description: 'Ducati Monster 937, le roadster iconique dans sa dernière évolution. État impeccable, son caractéristique Ducati, performances de haut niveau.',
    features: [
      'ABS Cornering',
      'Contrôle de traction DTC',
      'Modes de conduite',
      'Quickshifter up/down',
      'Tableau de bord TFT couleur',
      'Éclairage full LED'
    ],
    images: [
      'https://images.pexels.com/photos/1045535/pexels-photo-1045535.jpeg',
      'https://images.pexels.com/photos/163210/motorcycles-race-helmets-pilots-163210.jpeg',
      'https://images.pexels.com/photos/595807/pexels-photo-595807.jpeg',
      'https://images.pexels.com/photos/40904/bmw-motorcycle-motorcycles-bike-40904.jpeg'
    ],
    isNew: true,
    createdAt: '2023-06-05'
  },
  {
    id: '6',
    brand: 'Triumph',
    model: 'Street Triple RS',
    year: 2021,
    price: 10999,
    mileage: 9800,
    engine: '765 cc',
    power: 123,
    license: 'A',
    color: 'Gris',
    description: 'Triumph Street Triple RS, le roadster sportif britannique par excellence. Équipée de composants haut de gamme, cette moto offre des performances exceptionnelles.',
    features: [
      'ABS Cornering',
      'Contrôle de traction',
      '5 modes de conduite',
      'Quickshifter bidirectionnel',
      'Suspension Öhlins',
      'Freins Brembo M50',
      'Tableau de bord TFT couleur'
    ],
    images: [
      'https://images.pexels.com/photos/258092/pexels-photo-258092.jpeg',
      'https://images.pexels.com/photos/163210/motorcycles-race-helmets-pilots-163210.jpeg',
      'https://images.pexels.com/photos/595807/pexels-photo-595807.jpeg',
      'https://images.pexels.com/photos/40904/bmw-motorcycle-motorcycles-bike-40904.jpeg'
    ],
    createdAt: '2023-01-20'
  }
];

export const getFeaturedMotorcycles = (): Motorcycle[] => {
  return motorcycles.filter(moto => moto.isFeatured);
};

export const getNewMotorcycles = (): Motorcycle[] => {
  return motorcycles.filter(moto => moto.isNew);
};

export const getMotorcycleById = (id: string): Motorcycle | undefined => {
  return motorcycles.find(moto => moto.id === id);
};