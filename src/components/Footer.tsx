import { Link } from 'react-router-dom';
import { Bike, Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Bike size={24} className="text-red-600" />
              <div className="flex flex-col">
                <span className="text-xl font-bold">AGDE MOTO</span>
                <span className="text-sm italic text-red-600">Gattuso</span>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Votre spécialiste moto à Agde depuis 2005. Vente de motos d'occasion et pièces détachées sélectionnées avec soin.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-gray-400 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
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
                <span className="text-gray-400">123 Avenue de la Plage, 34300 Agde, France</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-red-600 flex-shrink-0" />
                <span className="text-gray-400">+33 4 67 12 34 56</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-red-600 flex-shrink-0" />
                <span className="text-gray-400">contact@agdemoto.fr</span>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-gray-400">
                <span className="font-semibold">Horaires d'ouverture:</span><br />
                Lun-Ven: 9h-12h, 14h-18h<br />
                Sam: 9h-12h, 14h-17h<br />
                Dim: Fermé
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