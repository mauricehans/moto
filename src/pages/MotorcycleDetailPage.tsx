import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Gauge, Award, BarChart2, PaintBucket } from 'lucide-react';
import ImageGallery from '../components/ImageGallery';
import ContactForm from '../components/ContactForm';
import { useMotorcycle } from '../hooks/useMotorcycles';

const MotorcycleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: motorcycle, isLoading, error } = useMotorcycle(id!);
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !motorcycle) {
    return (
      <div className="min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Moto non trouvée
          </h1>
          <p className="text-gray-600 mb-8">
            La moto que vous recherchez n'existe pas ou a été vendue.
          </p>
          <Link
            to="/motorcycles"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors duration-300"
          >
            <ArrowLeft size={20} className="mr-2" />
            Retour aux motos
          </Link>
        </div>
      </div>
    );
  }

  const toggleContactForm = () => {
    setShowContactForm(!showContactForm);
    if (!showContactForm) {
      setTimeout(() => {
        const contactSection = document.getElementById('contact-form');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Adapter les données de l'API Django
  const images = motorcycle.images?.map((img: any) => img.image) || [
    'https://images.pexels.com/photos/2611686/pexels-photo-2611686.jpeg'
  ];

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link
            to="/motorcycles"
            className="inline-flex items-center text-gray-600 hover:text-red-600 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Retour aux motos
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            <div>
              <ImageGallery 
                images={images} 
                alt={`${motorcycle.brand} ${motorcycle.model}`} 
              />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {motorcycle.brand} {motorcycle.model}
              </h1>
              
              <div className="flex items-center mb-6">
                <span className="text-2xl font-bold text-red-600">
                  {parseFloat(motorcycle.price).toLocaleString('fr-FR')} €
                </span>
                {motorcycle.is_new && (
                  <span className="ml-4 bg-red-600 text-white text-xs font-bold uppercase px-3 py-1 rounded">
                    Nouveau
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Calendar size={20} className="text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Année</p>
                    <p className="font-medium text-gray-900">{motorcycle.year}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Gauge size={20} className="text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Kilométrage</p>
                    <p className="font-medium text-gray-900">{motorcycle.mileage?.toLocaleString('fr-FR')} km</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Award size={20} className="text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Permis</p>
                    <p className="font-medium text-gray-900">{motorcycle.license}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <BarChart2 size={20} className="text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Puissance</p>
                    <p className="font-medium text-gray-900">{motorcycle.power} ch</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <PaintBucket size={20} className="text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Couleur</p>
                    <p className="font-medium text-gray-900">{motorcycle.color}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                    <path d="M4 4v16h16" />
                    <path d="M4 15l4-4c1.73 1.73 4.27 1.73 6 0l2-2c1.73-1.73 4.27-1.73 6 0l2 2" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Cylindrée</p>
                    <p className="font-medium text-gray-900">{motorcycle.engine}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700">{motorcycle.description}</p>
              </div>
              
              <button
                onClick={toggleContactForm}
                className="w-full py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors duration-300"
              >
                Contacter le vendeur
              </button>
            </div>
          </div>
        </div>
        
        {showContactForm && (
          <div id="contact-form" className="bg-white rounded-lg shadow-md p-6 lg:p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Contacter le vendeur
            </h2>
            <ContactForm 
              motorcycleId={motorcycle.id} 
              motorcycleName={`${motorcycle.brand} ${motorcycle.model} (${motorcycle.year})`} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MotorcycleDetailPage;