import { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import SectionTitle from '../components/SectionTitle';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: 'garage' | 'motorcycles' | 'events';
}

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: 'https://images.pexels.com/photos/8112069/pexels-photo-8112069.jpeg',
    alt: 'Intérieur du garage',
    category: 'garage'
  },
  {
    id: 2,
    src: 'https://images.pexels.com/photos/163210/motorcycles-race-helmets-pilots-163210.jpeg',
    alt: 'Motos alignées',
    category: 'motorcycles'
  },
  {
    id: 3,
    src: 'https://images.pexels.com/photos/2393821/pexels-photo-2393821.jpeg',
    alt: 'BMW GS Adventure',
    category: 'motorcycles'
  },
  {
    id: 4,
    src: 'https://images.pexels.com/photos/1413412/pexels-photo-1413412.jpeg',
    alt: 'Moto en exposition',
    category: 'motorcycles'
  },
  {
    id: 5,
    src: 'https://images.pexels.com/photos/3807319/pexels-photo-3807319.jpeg',
    alt: 'Atelier mécanique',
    category: 'garage'
  },
  {
    id: 6,
    src: 'https://images.pexels.com/photos/258092/pexels-photo-258092.jpeg',
    alt: 'Course moto',
    category: 'events'
  },
  {
    id: 7,
    src: 'https://images.pexels.com/photos/2611686/pexels-photo-2611686.jpeg',
    alt: 'Yamaha MT',
    category: 'motorcycles'
  },
  {
    id: 8,
    src: 'https://images.pexels.com/photos/819805/pexels-photo-819805.jpeg',
    alt: 'Moto custom',
    category: 'motorcycles'
  },
  {
    id: 9,
    src: 'https://images.pexels.com/photos/995487/pexels-photo-995487.jpeg',
    alt: 'Moto de route',
    category: 'motorcycles'
  },
  {
    id: 10,
    src: 'https://images.pexels.com/photos/1045535/pexels-photo-1045535.jpeg',
    alt: 'Ducati sportive',
    category: 'motorcycles'
  },
  {
    id: 11,
    src: 'https://images.pexels.com/photos/2519374/pexels-photo-2519374.jpeg',
    alt: 'Rassemblement moto',
    category: 'events'
  },
  {
    id: 12,
    src: 'https://images.pexels.com/photos/1715193/pexels-photo-1715193.jpeg',
    alt: 'Façade du garage',
    category: 'garage'
  }
];

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>(galleryImages);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const filterImages = (category: string) => {
    setSelectedCategory(category);
    
    if (category === 'all') {
      setFilteredImages(galleryImages);
    } else {
      setFilteredImages(galleryImages.filter(image => image.category === category));
    }
  };

  const openModal = (image: GalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <HeroSection
        title="Notre Galerie"
        subtitle="Découvrez notre garage et nos motos en images"
        backgroundImage="https://images.pexels.com/photos/1715193/pexels-photo-1715193.jpeg"
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="Galerie Photos"
            subtitle="Explorez notre univers à travers notre collection d'images"
            center
          />

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => filterImages('all')}
              className={`px-6 py-2 rounded-md transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => filterImages('garage')}
              className={`px-6 py-2 rounded-md transition-colors ${
                selectedCategory === 'garage'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Le Garage
            </button>
            <button
              onClick={() => filterImages('motorcycles')}
              className={`px-6 py-2 rounded-md transition-colors ${
                selectedCategory === 'motorcycles'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Nos Motos
            </button>
            <button
              onClick={() => filterImages('events')}
              className={`px-6 py-2 rounded-md transition-colors ${
                selectedCategory === 'events'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Événements
            </button>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-lg shadow-md cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
                onClick={() => openModal(image)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end">
                  <div className="p-4 w-full text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-medium">{image.alt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal */}
          {selectedImage && (
            <div
              className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
              onClick={closeModal}
            >
              <div className="max-w-4xl mx-auto p-4">
                <button
                  className="absolute top-4 right-4 text-white"
                  onClick={closeModal}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="max-h-[80vh] mx-auto"
                />
                <p className="text-white text-center mt-4 text-lg">
                  {selectedImage.alt}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;