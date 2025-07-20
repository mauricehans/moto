/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Gauge, 
  Award, 
  BarChart2, 
  PaintBucket,
  Heart,
  Share2,
  Printer,
  Calculator,
  Eye,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Download,
  Shield,
  Clock,
  CheckCircle,
  Settings,
  Images
} from 'lucide-react';
import ImageGallery from '../components/ImageGallery';
import ContactForm from '../components/ContactForm';
import MotorcycleCard from '../components/MotorcycleCard';
import SectionTitle from '../components/SectionTitle';
import { useMotorcycle, useMotorcycles } from '../hooks/useMotorcycles';
import { Motorcycle } from '../types/Motorcycle';

interface SimilarMotorcycle {
  id: string;
  brand: string;
  model: string;
  price: number;
  year: number;
  images: any[];
}

const MotorcycleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: motorcycle, isLoading, error } = useMotorcycle(id!);
  const { data: allMotorcycles = [] } = useMotorcycles();
  
  // États locaux
  const [showContactForm, setShowContactForm] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showFinanceCalculator, setShowFinanceCalculator] = useState(false);
// Removed unused state
  const [showShareModal, setShowShareModal] = useState(false);
  const [viewCount, setViewCount] = useState(0);
// Removed unused state

  // Calculateur de financement
  const [financeData, setFinanceData] = useState({
    downPayment: 0,
    loanTerm: 36,
    interestRate: 4.5
  });

  // Motos similaires basées sur la marque et la gamme de prix
  const similarMotorcycles = useMemo(() => {
    if (!motorcycle || !allMotorcycles.length) return [];
    
    const currentPrice = parseFloat(motorcycle.price);
    const priceRange = currentPrice * 0.3; // ±30% du prix
    
    return allMotorcycles
      .filter((moto: any) => 
        moto.id !== motorcycle.id && 
        (moto.brand === motorcycle.brand || 
         Math.abs(parseFloat(moto.price) - currentPrice) <= priceRange)
      )
      .slice(0, 4);
  }, [motorcycle, allMotorcycles]);

  // Navigation entre les motos
  const currentIndex = useMemo(() => {
    return allMotorcycles.findIndex((moto: any) => moto.id === id);
  }, [allMotorcycles, id]);

  const previousMoto = currentIndex > 0 ? allMotorcycles[currentIndex - 1] : null;
  const nextMoto = currentIndex < allMotorcycles.length - 1 ? allMotorcycles[currentIndex + 1] : null;

  // Calcul du financement
  const calculateMonthlyPayment = useCallback(() => {
    if (!motorcycle) return 0;
    
    const principal = parseFloat(motorcycle.price) - financeData.downPayment;
    const monthlyRate = financeData.interestRate / 100 / 12;
    const numPayments = financeData.loanTerm;
    
    if (monthlyRate === 0) return principal / numPayments;
    
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  }, [motorcycle, financeData]);

  // Gestion de la wishlist
  const toggleWishlist = useCallback(() => {
    const wishlist = JSON.parse(localStorage.getItem('moto-wishlist') || '[]');
    const isCurrentlyWishlisted = wishlist.includes(id);
    
    if (isCurrentlyWishlisted) {
      const newWishlist = wishlist.filter((itemId: string) => itemId !== id);
      localStorage.setItem('moto-wishlist', JSON.stringify(newWishlist));
      setIsWishlisted(false);
    } else {
      wishlist.push(id);
      localStorage.setItem('moto-wishlist', JSON.stringify(wishlist));
      setIsWishlisted(true);
    }
  }, [id]);

  // Partage
  const handleShare = useCallback(async (platform: string) => {
    const url = window.location.href;
    const text = `Découvrez cette ${motorcycle?.brand} ${motorcycle?.model} sur Agde Moto Gattuso`;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${text} ${url}`, '_blank');
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        alert('Lien copié dans le presse-papiers !');
        break;
    }
    setShowShareModal(false);
  }, [motorcycle]);

  // Impression
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Effets
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Incrémenter le compteur de vues
    const viewKey = `moto-view-${id}`;
    const currentViews = parseInt(localStorage.getItem(viewKey) || '0');
    localStorage.setItem(viewKey, (currentViews + 1).toString());
    setViewCount(currentViews + 1);
    
    // Ajouter à l'historique des vues
    const history = JSON.parse(localStorage.getItem('moto-history') || '[]');
    const newHistory = [id, ...history.filter((itemId: string) => itemId !== id)].slice(0, 10);
    localStorage.setItem('moto-history', JSON.stringify(newHistory));
// Remove setLastViewed since it's not defined and not needed
// The history is already saved in localStorage above
    
    // Vérifier si la moto est dans la wishlist
    const wishlist = JSON.parse(localStorage.getItem('moto-wishlist') || '[]');
    setIsWishlisted(wishlist.includes(id));
  }, [id]);

  // SEO et Meta tags
  useEffect(() => {
    if (motorcycle) {
      document.title = `${motorcycle.brand} ${motorcycle.model} ${motorcycle.year} - Agde Moto Gattuso`;
      
      // Meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `${motorcycle.brand} ${motorcycle.model} ${motorcycle.year} à vendre - ${parseFloat(motorcycle.price).toLocaleString('fr-FR')}€ - ${motorcycle.description.substring(0, 120)}...`
        );
      }
    }
  }, [motorcycle]);

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

  // Gestion du loading améliorée
  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
                <div className="h-96 bg-gray-300 rounded"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-300 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !motorcycle) {
    return (
      <div className="min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink size={48} className="text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Moto non trouvée
              </h1>
              <p className="text-gray-600 mb-8">
                La moto que vous recherchez n'existe pas ou a été vendue.
              </p>
            </div>
            <div className="space-y-4">
              <Link
                to="/motorcycles"
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors duration-300"
              >
                <ArrowLeft size={20} className="mr-2" />
                Retour aux motos
              </Link>
              <button
                onClick={() => window.history.back()}
                className="block w-full px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors duration-300"
              >
                Page précédente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const images = motorcycle.images?.map((img: { image: string }) => img.image) || [
    'https://images.pexels.com/photos/2611686/pexels-photo-2611686.jpeg'
  ];

  const monthlyPayment = calculateMonthlyPayment();

  return (
    <div className="min-h-screen pt-32 pb-16">
      {/* Breadcrumbs améliorés */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-600 hover:text-red-600 transition-colors">
              Accueil
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/motorcycles" className="text-gray-600 hover:text-red-600 transition-colors">
              Motos
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">
              {motorcycle.brand} {motorcycle.model}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation entre motos */}
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/motorcycles"
            className="inline-flex items-center text-gray-600 hover:text-red-600 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Retour aux motos
          </Link>
          
          <div className="flex items-center space-x-4">
            {previousMoto && (
              <button
                onClick={() => navigate(`/motorcycles/${previousMoto.id}`)}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft size={16} className="mr-1" />
                Précédent
              </button>
            )}
            
            {nextMoto && (
              <button
                onClick={() => navigate(`/motorcycles/${nextMoto.id}`)}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Suivant
                <ChevronRight size={16} className="ml-1" />
              </button>
            )}
          </div>
        </div>

        {/* Contenu principal */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Galerie d'images améliorée */}
            <div className="space-y-4">
              <ImageGallery 
                images={images} 
                alt={`${motorcycle.brand} ${motorcycle.model}`} 
              />
              
              {/* Informations rapides sous l'image */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-50 p-3 rounded-md">
                  <Eye size={16} className="mx-auto text-gray-600 mb-1" />
                  <p className="text-xs text-gray-600">{viewCount} vues</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <Calendar size={16} className="mx-auto text-gray-600 mb-1" />
                  <p className="text-xs text-gray-600">Ajoutée il y a 3 jours</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <MapPin size={16} className="mx-auto text-gray-600 mb-1" />
                  <p className="text-xs text-gray-600">Agde, 34300</p>
                </div>
              </div>
            </div>
            
            {/* Informations détaillées */}
            <div className="space-y-6">
              {/* En-tête avec actions */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {motorcycle.brand || 'Marque inconnue'} {motorcycle.model || 'Modèle inconnu'}
                  </h1>
                  <div className="flex items-center space-x-2">
                    {motorcycle.is_new && (
                      <span className="bg-green-100 text-green-800 text-xs font-bold uppercase px-3 py-1 rounded">
                        <CheckCircle size={12} className="inline mr-1" />
                        Nouveau
                      </span>
                    )}
                    {motorcycle.is_featured && (
                      <span className="bg-red-100 text-red-800 text-xs font-bold uppercase px-3 py-1 rounded">
                        <Star size={12} className="inline mr-1" />
                        À la une
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Actions rapides */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleWishlist}
                    className={`p-2 rounded-full border transition-colors ${
                      isWishlisted 
                        ? 'bg-red-600 text-white border-red-600' 
                        : 'bg-white text-gray-600 border-gray-300 hover:border-red-600 hover:text-red-600'
                    }`}
                    title={isWishlisted ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  >
                    <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                  </button>
                  
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="p-2 rounded-full border border-gray-300 text-gray-600 hover:border-red-600 hover:text-red-600 transition-colors"
                    title="Partager"
                  >
                    <Share2 size={20} />
                  </button>
                  
                  <button
                    onClick={handlePrint}
                    className="p-2 rounded-full border border-gray-300 text-gray-600 hover:border-red-600 hover:text-red-600 transition-colors"
                    title="Imprimer"
                  >
                    <Printer size={20} />
                  </button>
                </div>
              </div>
              
              {/* Prix et financement */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-red-600">
                    {parseFloat(motorcycle.price).toLocaleString('fr-FR')} €
                  </span>
                  <button
                    onClick={() => setShowFinanceCalculator(!showFinanceCalculator)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Calculator size={16} className="mr-2" />
                    Financement
                  </button>
                </div>
                
                {showFinanceCalculator && (
                  <div className="border-t pt-4 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Apport (€)</label>
                        <input
                          type="number"
                          value={financeData.downPayment}
                          onChange={(e) => setFinanceData(prev => ({ 
                            ...prev, 
                            downPayment: parseInt(e.target.value) || 0 
                          }))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Durée (mois)</label>
                        <select
                          value={financeData.loanTerm}
                          onChange={(e) => setFinanceData(prev => ({ 
                            ...prev, 
                            loanTerm: parseInt(e.target.value) 
                          }))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        >
                          <option value={12}>12 mois</option>
                          <option value={24}>24 mois</option>
                          <option value={36}>36 mois</option>
                          <option value={48}>48 mois</option>
                          <option value={60}>60 mois</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Taux (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={financeData.interestRate}
                          onChange={(e) => setFinanceData(prev => ({ 
                            ...prev, 
                            interestRate: parseFloat(e.target.value) || 0 
                          }))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-md">
                      <p className="text-center">
                        <span className="text-sm text-gray-600">Mensualité estimée : </span>
                        <span className="text-xl font-bold text-blue-600">
                          {monthlyPayment.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €/mois
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Caractéristiques principales */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar size={24} className="text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Année</p>
                    <p className="font-medium text-gray-900">{motorcycle.year}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Gauge size={24} className="text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Kilométrage</p>
                    <p className="font-medium text-gray-900">{motorcycle.mileage?.toLocaleString('fr-FR') || 'N/A'} km</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Award size={24} className="text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Permis</p>
                    <p className="font-medium text-gray-900">{motorcycle.license || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <BarChart2 size={24} className="text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Puissance</p>
                    <p className="font-medium text-gray-900">{motorcycle.power || 'N/A'} ch</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <PaintBucket size={24} className="text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Couleur</p>
                    <p className="font-medium text-gray-900">{motorcycle.color || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                    <path d="M4 4v16h16" />
                    <path d="M4 15l4-4c1.73 1.73 4.27 1.73 6 0l2-2c1.73-1.73 4.27-1.73 6 0l2 2" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Cylindrée</p>
                    <p className="font-medium text-gray-900">{motorcycle.engine || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              {/* Garanties et services */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                  <Shield size={20} className="mr-2" />
                  Garanties incluses
                </h3>
                <ul className="space-y-1 text-sm text-green-700">
                  <li className="flex items-center">
                    <CheckCircle size={16} className="mr-2 text-green-600" />
                    Garantie 3 mois pièces et main d'œuvre
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="mr-2 text-green-600" />
                    Contrôle technique récent
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="mr-2 text-green-600" />
                    Révision complète effectuée
                  </li>
                </ul>
              </div>
              
              {/* Description */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">{motorcycle.description || 'Aucune description disponible'}</p>
              </div>
              
              {/* Boutons d'action */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={toggleContactForm}
                  className="w-full py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors duration-300 flex items-center justify-center"
                >
                  <Mail size={20} className="mr-2" />
                  Contacter le vendeur
                </button>
                
                <a
                  href="tel:+33467123456"
                  className="w-full py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors duration-300 flex items-center justify-center"
                >
                  <Phone size={20} className="mr-2" />
                  Appeler maintenant
                </a>
              </div>
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
                    <p className="text-blue-100">Gestion des images de cette moto</p>
                  </div>
                </div>
                <Link
                  to={`/admin/images/motorcycle/${id}`}
                  className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium"
                >
                  <Images size={16} className="mr-2" />
                  Gérer les images
                </Link>
              </div>
              
              {motorcycle?.images && motorcycle.images.length > 0 && (
                <div className="mt-4 pt-4 border-t border-blue-500">
                  <p className="text-blue-100 mb-3">Images actuelles ({motorcycle.images.length}):</p>
                  <div className="grid grid-cols-6 gap-2">
                    {motorcycle.images.slice(0, 6).map((image: any, index: number) => (
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
                    {motorcycle.images.length > 6 && (
                      <div className="flex items-center justify-center bg-white/20 rounded h-16 text-white text-xs">
                        +{motorcycle.images.length - 6}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Motos similaires */}
        {similarMotorcycles.length > 0 && (
          <div className="mb-12">
            <SectionTitle
              title="Motos similaires"
              subtitle="Découvrez d'autres motos qui pourraient vous intéresser"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarMotorcycles.map((similar: Motorcycle) => (
                <MotorcycleCard 
                  key={similar.id}
                  motorcycle={similar as Motorcycle}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Formulaire de contact */}
        {showContactForm && (
          <div id="contact-form" className="bg-white rounded-lg shadow-md p-6 lg:p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Mail size={24} className="mr-3 text-red-600" />
              Contacter le vendeur
            </h2>
            <ContactForm 
              motorcycleId={motorcycle.id.toString()}
              motorcycleName={`${motorcycle.brand} ${motorcycle.model} (${motorcycle.year})`} 
            />
          </div>
        )}
      </div>

      {/* Modal de partage */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Partager cette moto</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleShare('facebook')}
                className="p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
              >
                Facebook
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="p-3 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors text-center"
              >
                Twitter
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="p-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-center"
              >
                WhatsApp
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="p-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-center"
              >
                Copier lien
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-4 p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MotorcycleDetailPage;
