import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Star, CheckCircle, AlertCircle, Settings, Images, Phone } from 'lucide-react';
import ImageGallery from '../components/ImageGallery';
import ContactForm from '../components/ContactForm';
import { usePart } from '../hooks/useParts';

const PartDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: part, isLoading, error } = usePart(id!);
  const [showContactForm, setShowContactForm] = useState(false);
  const { settings } = useGarageSettings();

  // ✅ Fonctions mémorisées pour éviter les re-renders
  const getConditionLabel = useMemo(() => {
    return (condition: string) => {
      const labels: Record<string, string> = {
        'new': 'Neuf',
        'used_excellent': 'Occasion - Excellent état',
        'used_good': 'Occasion - Bon état',
        'used_fair': 'Occasion - État correct',
        'refurbished': 'Reconditionné'
      };
      return labels[condition] || condition;
    };
  }, []);

  const getConditionColor = useMemo(() => {
    return (condition: string) => {
      const colors: Record<string, string> = {
        'new': 'bg-green-100 text-green-800',
        'used_excellent': 'bg-blue-100 text-blue-800',
        'used_good': 'bg-yellow-100 text-yellow-800',
        'used_fair': 'bg-orange-100 text-orange-800',
        'refurbished': 'bg-purple-100 text-purple-800'
      };
      return colors[condition] || 'bg-gray-100 text-gray-800';
    };
  }, []);

  // ✅ Données calculées avec useMemo
  const partData = useMemo(() => {
    if (!part) return null;
    
    return {
      images: part.images?.map((img: { image: string }) => img.image) || [
        'https://images.pexels.com/photos/2539322/pexels-photo-2539322.jpeg'
      ],
      price: parseFloat(part.price),
      categoryName: typeof part.category === 'object' 
        ? part.category.name 
        : part.category || 'Non catégorisé'
    };
  }, [part]);

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

  if (error || !part || !partData) {
    return (
      <div className="min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Pièce non trouvée
          </h1>
          <p className="text-gray-600 mb-8">
            La pièce que vous recherchez n'existe pas ou n'est plus disponible.
          </p>
          <Link
            to="/parts"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors duration-300"
          >
            <ArrowLeft size={20} className="mr-2" />
            Retour aux pièces détachées
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link
            to="/parts"
            className="inline-flex items-center text-gray-600 hover:text-red-600 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Retour aux pièces détachées
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            <div>
              <ImageGallery 
                images={partData.images} 
                alt={part.name} 
              />
            </div>
            
            <div>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {part.name || 'Nom non disponible'}
                </h1>
                {part.is_featured && (
                  <div className="bg-red-600 text-white text-xs font-bold uppercase px-3 py-1 rounded flex items-center">
                    <Star size={12} className="mr-1" />
                    À la une
                  </div>
                )}
              </div>
              
              <div className="flex items-center mb-6">
                <span className="text-2xl font-bold text-red-600 mr-4">
                  {partData.price.toLocaleString('fr-FR')} €
                </span>
                <span className={`text-sm font-medium px-3 py-1 rounded ${getConditionColor(part.condition)}`}>
                  {getConditionLabel(part.condition)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Package size={20} className="text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Stock</p>
                    <p className="font-medium text-gray-900 flex items-center">
                      {part.stock} unité{part.stock > 1 ? 's' : ''}
                      {part.stock > 0 ? (
                        <CheckCircle size={16} className="ml-2 text-green-600" />
                      ) : (
                        <AlertCircle size={16} className="ml-2 text-red-600" />
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Marque</p>
                    <p className="font-medium text-gray-900">{part.brand || 'Marque inconnue'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                    <path d="M4 4v16h16" />
                    <path d="M4 15l4-4c1.73 1.73 4.27 1.73 6 0l2-2c1.73-1.73 4.27-1.73 6 0l2 2" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Catégorie</p>
                    <p className="font-medium text-gray-900">{partData.categoryName}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                    <path d="M14 9V5a3 3 0 0 0-6 0v4" />
                    <rect x="2" y="9" width="20" height="11" rx="2" ry="2" />
                    <circle cx="12" cy="15" r="1" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Disponibilité</p>
                    <p className="font-medium text-gray-900">
                      {part.is_available && part.stock > 0 ? 'En stock' : 'Rupture de stock'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Modèles compatibles</h2>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{part.compatible_models}</p>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700">{part.description || 'Aucune description disponible'}</p>
              </div>
              
              <button
                onClick={toggleContactForm}
                disabled={!part.is_available || part.stock === 0}
                className={`w-full py-3 font-medium rounded-md transition-colors duration-300 ${
                  part.is_available && part.stock > 0
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {part.is_available && part.stock > 0 ? 'Contacter pour cette pièce' : 'Pièce indisponible'}
              </button>

              {part.is_available && part.stock > 0 && (
                <a
                  href={`tel:${(settings?.phone || '+33467123456').replace(/\s+/g,'')}`}
                  className="w-full mt-3 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors duration-300 flex items-center justify-center"
                >
                  <Phone size={20} className="mr-2" />
                  Appeler maintenant
                </a>
              )}
            </div>
          </div>
        </div>
        
        {/* Section Admin - Gestion des images */}
        {localStorage.getItem('admin-token') && (
          <div className="mb-12">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Settings size={24} />
                  <div>
                    <h3 className="text-xl font-bold">Administration</h3>
                    <p className="text-blue-100">Gestion des images de cette pièce</p>
                  </div>
                </div>
                <Link
                  to={`/admin/images/part/${id}`}
                  className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium"
                >
                  <Images size={16} className="mr-2" />
                  Gérer les images
                </Link>
              </div>
              
              {part?.images && part.images.length > 0 && (
                <div className="mt-4 pt-4 border-t border-blue-500">
                  <p className="text-blue-100 mb-3">Images actuelles ({part.images.length}):</p>
                  <div className="grid grid-cols-6 gap-2">
                    {part.images.slice(0, 6).map((image: any, index: number) => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.image}
                          alt={`Image ${index + 1}`}
                          className="w-full h-16 object-cover rounded border-2 border-white/20"
                        />
                        {image.is_primary && (
                          <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs px-1 rounded">
                            Principal
                          </div>
                        )}
                      </div>
                    ))}
                    {part.images.length > 6 && (
                      <div className="flex items-center justify-center bg-white/20 rounded h-16 text-white text-xs">
                        +{part.images.length - 6}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {showContactForm && (
          <div id="contact-form" className="bg-gray-50 p-6 lg:p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contacter pour cette pièce</h2>
            <ContactForm 
              partName={part.name}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PartDetailPage;
import useGarageSettings from '../hooks/useGarageSettings';
