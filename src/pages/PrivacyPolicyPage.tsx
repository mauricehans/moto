import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
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
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Politique de Confidentialité</h1>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Collecte des données personnelles</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Agde Moto Gattuso collecte vos données personnelles dans le cadre de ses activités commerciales 
                et pour améliorer la qualité de ses services.
              </p>
              <p><strong>Types de données collectées :</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Données d'identification (nom, prénom, adresse)</li>
                <li>Données de contact (email, téléphone)</li>
                <li>Données de commande et de facturation</li>
                <li>Données de navigation sur notre site web</li>
                <li>Préférences et historique d'achat</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Finalités du traitement</h2>
            <div className="text-gray-700 space-y-3">
              <p><strong>Vos données sont utilisées pour :</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Traiter et suivre vos commandes</li>
                <li>Gérer votre compte client</li>
                <li>Vous contacter concernant nos produits et services</li>
                <li>Améliorer notre site web et nos services</li>
                <li>Respecter nos obligations légales et réglementaires</li>
                <li>Prévenir la fraude et assurer la sécurité</li>
                <li>Vous envoyer des communications marketing (avec votre consentement)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Base légale du traitement</h2>
            <div className="text-gray-700 space-y-3">
              <p><strong>Le traitement de vos données repose sur :</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>L'exécution d'un contrat :</strong> pour traiter vos commandes et gérer votre compte</li>
                <li><strong>L'intérêt légitime :</strong> pour améliorer nos services et assurer la sécurité</li>
                <li><strong>Le consentement :</strong> pour les communications marketing</li>
                <li><strong>L'obligation légale :</strong> pour respecter nos obligations comptables et fiscales</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Partage des données</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Nous ne vendons, ne louons, ni ne partageons vos données personnelles avec des tiers, 
                sauf dans les cas suivants :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Prestataires de services (livraison, paiement, maintenance informatique)</li>
                <li>Autorités compétentes en cas d'obligation légale</li>
                <li>Partenaires commerciaux avec votre consentement explicite</li>
              </ul>
              <p>
                Tous nos prestataires sont tenus par des accords de confidentialité et ne peuvent utiliser 
                vos données que pour les services convenus.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Durée de conservation</h2>
            <div className="text-gray-700 space-y-3">
              <p><strong>Nous conservons vos données pendant :</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Données de compte :</strong> jusqu'à la suppression de votre compte</li>
                <li><strong>Données de commande :</strong> 10 ans (obligations comptables)</li>
                <li><strong>Données de prospection :</strong> 3 ans après le dernier contact</li>
                <li><strong>Données de navigation :</strong> 13 mois maximum</li>
              </ul>
              <p>
                À l'expiration de ces délais, vos données sont supprimées ou anonymisées, 
                sauf obligation légale de conservation plus longue.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Sécurité des données</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées 
                pour protéger vos données personnelles :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Chiffrement des données sensibles</li>
                <li>Accès restreint aux données personnelles</li>
                <li>Sauvegardes régulières et sécurisées</li>
                <li>Formation du personnel à la protection des données</li>
                <li>Mise à jour régulière des systèmes de sécurité</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Vos droits</h2>
            <div className="text-gray-700 space-y-3">
              <p><strong>Conformément au RGPD, vous disposez des droits suivants :</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
                <li><strong>Droit de rectification :</strong> corriger des données inexactes</li>
                <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
                <li><strong>Droit à la limitation :</strong> restreindre le traitement de vos données</li>
                <li><strong>Droit à la portabilité :</strong> récupérer vos données dans un format structuré</li>
                <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
                <li><strong>Droit de retrait du consentement :</strong> retirer votre consentement à tout moment</li>
              </ul>
              <p>
                Pour exercer ces droits, contactez-nous à [email de contact] en joignant une copie de votre pièce d'identité.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Cookies et technologies similaires</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Notre site utilise des cookies pour améliorer votre expérience de navigation. 
                Pour plus d'informations, consultez notre 
                <Link to="/legal/cookies" className="text-red-600 hover:text-red-700 underline">
                  politique de gestion des cookies
                </Link>.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Transferts internationaux</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Vos données personnelles sont principalement traitées en France. 
                En cas de transfert vers un pays tiers, nous nous assurons que des garanties appropriées 
                sont mises en place pour protéger vos données.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Modifications de la politique</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Cette politique de confidentialité peut être modifiée pour refléter les changements 
                dans nos pratiques ou la réglementation. Nous vous informerons de toute modification importante.
              </p>
              <p><strong>Dernière mise à jour :</strong> [Date de dernière mise à jour]</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Contact et réclamations</h2>
            <div className="text-gray-700 space-y-3">
              <p><strong>Délégué à la protection des données :</strong></p>
              <p>
                Pour toute question concernant cette politique ou pour exercer vos droits, 
                contactez notre délégué à la protection des données :
              </p>
              <ul className="list-none space-y-1 ml-4">
                <li>Email : [email DPO]</li>
                <li>Adresse : [adresse postale]</li>
              </ul>
              <p>
                <strong>Autorité de contrôle :</strong> Vous avez également le droit de déposer une réclamation 
                auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) si vous estimez 
                que vos droits ne sont pas respectés.
              </p>
            </div>
          </section>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-8">
            <p className="text-green-800 text-sm">
              <strong>Engagement :</strong> Agde Moto Gattuso s'engage à traiter vos données personnelles 
              avec le plus grand soin et dans le respect de la réglementation en vigueur.
            </p>
          </div>
        </div>

        {/* Footer navigation */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm">
          <Link to="/legal/notices" className="text-red-600 hover:text-red-700 transition-colors">
            Mentions légales
          </Link>
          <span className="text-gray-400">•</span>
          <Link to="/legal/terms" className="text-red-600 hover:text-red-700 transition-colors">
            Conditions générales de vente
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

export default PrivacyPolicyPage;