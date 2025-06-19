import { Part } from '../types/Part';

export const parts: Part[] = [
  {
    id: '1',
    name: 'Pot d\'échappement Akrapovic Slip-On',
    category: 'Échappement',
    brand: 'Akrapovic',
    compatibleModels: 'Yamaha MT-07, MT-09',
    price: 450,
    stock: 3,
    condition: 'new',
    description: 'Pot d\'échappement sport en titane Akrapovic Slip-On. Améliore les performances et le son de votre moto. Installation facile sans modification.',
    specifications: {
      material: 'Titane',
      weight: '2.1 kg',
      homologation: 'CE',
      gain_puissance: '+3 ch'
    },
    images: [
      'https://images.pexels.com/photos/2539322/pexels-photo-2539322.jpeg',
      'https://images.pexels.com/photos/8985454/pexels-photo-8985454.jpeg'
    ],
    isAvailable: true,
    isFeatured: true,
    createdAt: '2023-06-01'
  },
  {
    id: '2',
    name: 'Plaquettes de frein Brembo Z04',
    category: 'Freinage',
    brand: 'Brembo',
    compatibleModels: 'Honda CBR600RR, CBR1000RR',
    price: 89,
    stock: 12,
    condition: 'new',
    description: 'Plaquettes de frein haute performance Brembo Z04. Excellent mordant et résistance à la température. Idéales pour la piste.',
    specifications: {
      material: 'Métal fritté',
      temperature_max: '800°C',
      type: 'Racing',
      compatibilite: 'Étriers Brembo'
    },
    images: [
      'https://images.pexels.com/photos/3807319/pexels-photo-3807319.jpeg',
      'https://images.pexels.com/photos/2539322/pexels-photo-2539322.jpeg'
    ],
    isAvailable: true,
    isFeatured: true,
    createdAt: '2023-05-28'
  },
  {
    id: '3',
    name: 'Amortisseur arrière Öhlins TTX GP',
    category: 'Suspension',
    brand: 'Öhlins',
    compatibleModels: 'Kawasaki ZX-10R, Ninja 1000',
    price: 1250,
    stock: 2,
    condition: 'new',
    description: 'Amortisseur arrière Öhlins TTX GP de compétition. Réglages compression et détente séparés. Performance exceptionnelle sur piste.',
    specifications: {
      course: '65mm',
      reglages: 'Compression/Détente',
      reservoir: 'Séparé',
      garantie: '2 ans'
    },
    images: [
      'https://images.pexels.com/photos/8985454/pexels-photo-8985454.jpeg',
      'https://images.pexels.com/photos/3807319/pexels-photo-3807319.jpeg'
    ],
    isAvailable: true,
    isFeatured: false,
    createdAt: '2023-05-25'
  },
  {
    id: '4',
    name: 'Carénage avant Ducati Panigale V4',
    category: 'Carrosserie',
    brand: 'Ducati',
    compatibleModels: 'Ducati Panigale V4, V4S',
    price: 680,
    stock: 1,
    condition: 'used_excellent',
    description: 'Carénage avant d\'origine Ducati Panigale V4 en excellent état. Aucun impact, peinture d\'origine. Fixations incluses.',
    specifications: {
      couleur: 'Rouge Ducati',
      etat: 'Excellent',
      origine: 'Ducati OEM',
      fixations: 'Incluses'
    },
    images: [
      'https://images.pexels.com/photos/1045535/pexels-photo-1045535.jpeg',
      'https://images.pexels.com/photos/2539322/pexels-photo-2539322.jpeg'
    ],
    isAvailable: true,
    isFeatured: false,
    createdAt: '2023-05-20'
  },
  {
    id: '5',
    name: 'Kit chaîne DID VX3',
    category: 'Transmission',
    brand: 'DID',
    compatibleModels: 'BMW S1000RR, HP4',
    price: 165,
    stock: 8,
    condition: 'new',
    description: 'Kit chaîne complet DID VX3 avec joints X-Ring. Haute résistance et longévité. Comprend chaîne, pignon et couronne.',
    specifications: {
      maillons: '118',
      joints: 'X-Ring',
      resistance: '9800 lbs',
      kit_complet: 'Chaîne + Pignons'
    },
    images: [
      'https://images.pexels.com/photos/8985454/pexels-photo-8985454.jpeg',
      'https://images.pexels.com/photos/3807319/pexels-photo-3807319.jpeg'
    ],
    isAvailable: true,
    isFeatured: true,
    createdAt: '2023-05-18'
  },
  {
    id: '6',
    name: 'Filtre à air K&N Performance',
    category: 'Moteur',
    brand: 'K&N',
    compatibleModels: 'Triumph Street Triple, Speed Triple',
    price: 75,
    stock: 15,
    condition: 'new',
    description: 'Filtre à air haute performance K&N lavable et réutilisable. Améliore le débit d\'air et les performances du moteur.',
    specifications: {
      type: 'Coton huilé',
      lavable: 'Oui',
      gain_debit: '+15%',
      duree_vie: 'Illimitée'
    },
    images: [
      'https://images.pexels.com/photos/2539322/pexels-photo-2539322.jpeg',
      'https://images.pexels.com/photos/8985454/pexels-photo-8985454.jpeg'
    ],
    isAvailable: true,
    isFeatured: false,
    createdAt: '2023-05-15'
  },
  {
    id: '7',
    name: 'Rétroviseurs CRG Arrow',
    category: 'Accessoires',
    brand: 'CRG',
    compatibleModels: 'Universel (filetage M10)',
    price: 120,
    stock: 6,
    condition: 'new',
    description: 'Rétroviseurs CRG Arrow design sportif. Miroir anti-éblouissement et fixation solide. Look racing garanti.',
    specifications: {
      filetage: 'M10 x 1.25',
      miroir: 'Anti-éblouissement',
      reglage: '360°',
      style: 'Racing'
    },
    images: [
      'https://images.pexels.com/photos/3807319/pexels-photo-3807319.jpeg',
      'https://images.pexels.com/photos/2539322/pexels-photo-2539322.jpeg'
    ],
    isAvailable: true,
    isFeatured: false,
    createdAt: '2023-05-12'
  },
  {
    id: '8',
    name: 'Levier d\'embrayage Brembo RCS',
    category: 'Commandes',
    brand: 'Brembo',
    compatibleModels: 'Ducati Monster, Streetfighter',
    price: 280,
    stock: 4,
    condition: 'new',
    description: 'Levier d\'embrayage Brembo RCS avec réglage de distance. Précision et confort de pilotage améliorés.',
    specifications: {
      reglage: 'Distance au guidon',
      material: 'Aluminium usiné',
      couleur: 'Noir anodisé',
      ergonomie: 'Optimisée'
    },
    images: [
      'https://images.pexels.com/photos/8985454/pexels-photo-8985454.jpeg',
      'https://images.pexels.com/photos/3807319/pexels-photo-3807319.jpeg'
    ],
    isAvailable: true,
    isFeatured: false,
    createdAt: '2023-05-10'
  },
  {
    id: '9',
    name: 'Pneu avant Michelin Power RS',
    category: 'Pneumatiques',
    brand: 'Michelin',
    compatibleModels: '120/70 ZR17 (avant)',
    price: 145,
    stock: 10,
    condition: 'new',
    description: 'Pneu sport-touring Michelin Power RS. Excellent compromis performance/longévité. Adhérence exceptionnelle sur sec et mouillé.',
    specifications: {
      dimension: '120/70 ZR17',
      position: 'Avant',
      type: 'Sport-Touring',
      technologie: 'Bi-compound'
    },
    images: [
      'https://images.pexels.com/photos/2539322/pexels-photo-2539322.jpeg',
      'https://images.pexels.com/photos/8985454/pexels-photo-8985454.jpeg'
    ],
    isAvailable: true,
    isFeatured: true,
    createdAt: '2023-05-08'
  },
  {
    id: '10',
    name: 'Compteur digital Koso RX3',
    category: 'Électronique',
    brand: 'Koso',
    compatibleModels: 'Universel (adaptable)',
    price: 320,
    stock: 3,
    condition: 'new',
    description: 'Compteur digital multifonctions Koso RX3. Écran couleur TFT, nombreuses fonctions, design moderne.',
    specifications: {
      ecran: 'TFT couleur 5"',
      fonctions: 'Vitesse, RPM, Temp, etc.',
      connectivite: 'Bluetooth',
      etanche: 'IP67'
    },
    images: [
      'https://images.pexels.com/photos/3807319/pexels-photo-3807319.jpeg',
      'https://images.pexels.com/photos/8985454/pexels-photo-8985454.jpeg'
    ],
    isAvailable: true,
    isFeatured: false,
    createdAt: '2023-05-05'
  }
];

export const categories = [
  'Échappement',
  'Freinage',
  'Suspension',
  'Carrosserie',
  'Transmission',
  'Moteur',
  'Accessoires',
  'Commandes',
  'Pneumatiques',
  'Électronique'
];

export const brands = Array.from(new Set(parts.map(part => part.brand))).sort();

export const getFeaturedParts = (): Part[] => {
  return parts.filter(part => part.isFeatured && part.isAvailable);
};

export const getPartsByCategory = (category: string): Part[] => {
  return parts.filter(part => part.category === category && part.isAvailable);
};

export const getPartById = (id: string): Part | undefined => {
  return parts.find(part => part.id === id);
};

export const searchParts = (query: string): Part[] => {
  const searchTerm = query.toLowerCase();
  return parts.filter(part => 
    part.isAvailable && (
      part.name.toLowerCase().includes(searchTerm) ||
      part.brand.toLowerCase().includes(searchTerm) ||
      part.compatibleModels.toLowerCase().includes(searchTerm) ||
      part.description.toLowerCase().includes(searchTerm)
    )
  );
};