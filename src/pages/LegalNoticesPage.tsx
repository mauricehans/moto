import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale } from 'lucide-react';

const LegalNoticesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Scale className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Mentions Légales</h1>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Informations légales</h2>
            <div className="text-gray-700 space-y-3">
              <p><strong>Dénomination sociale :</strong> Agde Moto Gattuso</p>
              <p><strong>Forme juridique :</strong> Entreprise Individuelle</p>
              <p><strong>Capital social :</strong> 5000€</p>
              <p><strong>Siège social :</strong> 7 avenue de Vias, Agde, France</p>
              <p><strong>Numéro SIRET :</strong> 939 439 584 00011</p>
              <p><strong>Code APE :</strong> 4520A</p>
              <p><strong>Numéro de TVA intracommunautaire :</strong> FR60939439584</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Directeur de la publication</h2>
            <div className="text-gray-700">
              <p><strong>Directeur de la publication :</strong> Leo GATTUSO</p>
              <p><strong>Contact :</strong> agdemoto343@gmail.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Hébergement du site</h2>
            <div className="text-gray-700 space-y-3">
              <p><strong>Hébergeur :</strong> Hostinger International Ltd.</p>
              <p><strong>Adresse :</strong> 61 Lordou Vironos Street, 6023 Larnaca, Chypre</p>
              <p><strong>Contact :</strong> https://www.hostinger.fr/contact</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Propriété intellectuelle</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. 
                Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
              </p>
              <p>
                La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Responsabilité</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Les informations contenues sur ce site sont aussi précises que possible et le site remis à jour à différentes périodes de l'année, 
                mais peut toutefois contenir des inexactitudes ou des omissions.
              </p>
              <p>
                Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, merci de bien vouloir le signaler par email, 
                à l'adresse agdemoto343@gmail.com, en décrivant le problème de la façon la plus précise possible.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Liens hypertextes</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Les liens hypertextes mis en place dans le cadre du présent site internet en direction d'autres ressources présentes sur le réseau Internet 
                ne sauraient engager la responsabilité d'Agde Moto Gattuso.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Collecte et traitement de données personnelles</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Conformément aux dispositions de la loi n° 78-17 du 6 janvier 1978 modifiée, vous disposez d'un droit d'accès, 
                de modification et de suppression des données qui vous concernent.
              </p>
              <p>
                Pour exercer ce droit, adressez-vous à : agdemoto343@gmail.com
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Droit applicable</h2>
            <div className="text-gray-700">
              <p>
                Le présent site et les conditions de son utilisation sont régis par le droit français. 
                Tout litige sera de la compétence exclusive des tribunaux français.
              </p>
            </div>
          </section>
        </div>

        {/* Footer navigation */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm">
          <Link to="/legal/terms" className="text-red-600 hover:text-red-700 transition-colors">
            Conditions générales de vente
          </Link>
          <span className="text-gray-400">•</span>
          <Link to="/legal/privacy" className="text-red-600 hover:text-red-700 transition-colors">
            Politique de confidentialité
          </Link>
          <span className="text-gray-400">•</span>
          <Link to="/legal/cookies" className="text-red-600 hover:text-red-700 transition-colors">
            Gestion des cookies
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LegalNoticesPage;