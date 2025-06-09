import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Wrench, Award, Shield, Clock } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import SectionTitle from '../components/SectionTitle';
import MotorcycleCard from '../components/MotorcycleCard';
import ServiceCard from '../components/ServiceCard';
import { getFeaturedMotorcycles, getNewMotorcycles } from '../data/motorcycles';

const HomePage = () => {
  const featuredMotorcycles = getFeaturedMotorcycles();
  const newMotorcycles = getNewMotorcycles();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <HeroSection
        title="Moto Garage Agde"
        subtitle="Votre spécialiste moto à Agde depuis 2005. Vente de motos d'occasion sélectionnées avec soin."
        backgroundImage="https://images.pexels.com/photos/2519374/pexels-photo-2519374.jpeg"
        buttonText="Découvrir nos motos"
        buttonLink="/motorcycles"
      />

      {/* Featured Motorcycles */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <SectionTitle
              title="Nos motos à la une"
              subtitle="Découvrez notre sélection de motos d'occasion premium"
            />
            <Link
              to="/motorcycles"
              className="inline-flex items-center text-red-600 font-medium hover:text-red-700 transition-colors mt-4 md:mt-0"
            >
              Voir toutes nos motos
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredMotorcycles.map((motorcycle) => (
              <MotorcycleCard key={motorcycle.id} motorcycle={motorcycle} />
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="Nos services"
            subtitle="Au Moto Garage Agde, nous vous proposons une gamme complète de services pour votre passion moto"
            center
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ServiceCard
              icon={Wrench}
              title="Entretien & Réparation"
              description="Notre atelier assure l'entretien et la réparation de votre moto avec des techniciens qualifiés."
            />
            <ServiceCard
              icon={Award}
              title="Vente de motos d'occasion"
              description="Grand choix de motos d'occasion sélectionnées et révisées par nos soins."
            />
            <ServiceCard
              icon={Shield}
              title="Garantie 3 mois"
              description="Toutes nos motos sont vendues avec une garantie de 3 mois minimum pour votre tranquillité."
            />
            <ServiceCard
              icon={Clock}
              title="Assistance 24/7"
              description="Service d'assistance disponible 24h/24 et 7j/7 pour nos clients en cas de panne."
            />
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newMotorcycles.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <SectionTitle
              title="Nouveaux arrivages"
              subtitle="Les dernières motos arrivées dans notre garage"
              center
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newMotorcycles.map((motorcycle) => (
                <MotorcycleCard key={motorcycle.id} motorcycle={motorcycle} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/motorcycles"
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors duration-300"
              >
                Voir toutes nos motos
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Vous cherchez une moto spécifique ?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Nous pouvons vous aider à trouver la moto de vos rêves. Contactez-nous avec vos critères et votre budget.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors duration-300"
          >
            Nous contacter
            <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;