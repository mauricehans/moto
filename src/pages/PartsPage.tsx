import { useState, useEffect } from 'react';
import { SearchIcon } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import SectionTitle from '../components/SectionTitle';

const PartsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <HeroSection
        title="Pièces Détachées"
        subtitle="Découvrez notre sélection de pièces détachées pour votre moto"
        backgroundImage="https://images.pexels.com/photos/8985454/pexels-photo-8985454.jpeg"
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="Catalogue de Pièces"
            subtitle="Trouvez les pièces qu'il vous faut pour votre moto"
          />

          {/* Content will be added in the next iteration */}
          <div className="text-center py-12">
            <p className="text-gray-600">
              Le catalogue des pièces détachées sera bientôt disponible.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartsPage;