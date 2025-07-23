import { Link } from 'react-router-dom';
import { Bike, Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import useGarageSettings from '../hooks/useGarageSettings';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { settings, loading } = useGarageSettings();

  if (loading || !settings) {
    return (
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-gray-400">Chargement...</div>
        </div>
      </footer>
    );
  }
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Bike size={24} className="text-red-600" />
              <div className="flex flex-col">
                <span className="text-xl font-bold">{settings.name}</span>
                <span className="text-sm italic text-red-600">Gattuso</span>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              {settings.description}
            </p>
            <div className="flex space-x-4">
              {settings.social_media?.facebook && (
                <a href={settings.social_media.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook size={20} />
                </a>
              )}
              {settings.social_media?.instagram && (
                <a href={settings.social_media.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram size={20} />
                </a>
              )}
              {settings.social_media?.youtube && (
                <a href={settings.social_media.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-gray-400 hover:text-white transition-colors">
                  <Youtube size={20} />
                </a>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">Accueil</Link>
              </li>
              <li>
                <Link to="/motorcycles" className="text-gray-400 hover:text-white transition-colors">Motos</Link>
              </li>
              <li>
                <Link to="/parts" className="text-gray-400 hover:text-white transition-colors">Pièces Détachées</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-red-600 mt-1 flex-shrink-0" />
                <span className="text-gray-400">{settings.address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-red-600 flex-shrink-0" />
                <span className="text-gray-400">{settings.phone}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-red-600 flex-shrink-0" />
                <span className="text-gray-400">{settings.email}</span>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-gray-400">
                <span className="font-semibold">Horaires d'ouverture:</span><br />
                {settings.business_hours && (
                  <>
                    Lun: {settings.business_hours.monday?.is_closed ? 'Fermé' : `${settings.business_hours.monday?.open}-${settings.business_hours.monday?.close}`}<br />
                    Mar: {settings.business_hours.tuesday?.is_closed ? 'Fermé' : `${settings.business_hours.tuesday?.open}-${settings.business_hours.tuesday?.close}`}<br />
                    Mer: {settings.business_hours.wednesday?.is_closed ? 'Fermé' : `${settings.business_hours.wednesday?.open}-${settings.business_hours.wednesday?.close}`}<br />
                    Jeu: {settings.business_hours.thursday?.is_closed ? 'Fermé' : `${settings.business_hours.thursday?.open}-${settings.business_hours.thursday?.close}`}<br />
                    Ven: {settings.business_hours.friday?.is_closed ? 'Fermé' : `${settings.business_hours.friday?.open}-${settings.business_hours.friday?.close}`}<br />
                    Sam: {settings.business_hours.saturday?.is_closed ? 'Fermé' : `${settings.business_hours.saturday?.open}-${settings.business_hours.saturday?.close}`}<br />
                    Dim: {settings.business_hours.sunday?.is_closed ? 'Fermé' : `${settings.business_hours.sunday?.open}-${settings.business_hours.sunday?.close}`}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Agde Moto Gattuso. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;