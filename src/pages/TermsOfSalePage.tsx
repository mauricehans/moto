import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const TermsOfSalePage: React.FC = () => {
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
              <FileText className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Conditions Générales de Vente</h1>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Objet et champ d'application</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Les présentes conditions générales de vente (CGV) s'appliquent à toutes les ventes de motos, pièces détachées, 
                accessoires et prestations de services réalisées par Agde Moto Gattuso.
              </p>
              <p>
                Toute commande implique l'acceptation sans réserve par l'acheteur des présentes conditions générales de vente.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Produits et services</h2>
            <div className="text-gray-700 space-y-3">
              <p><strong>Nos produits et services comprennent :</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Vente de motos neuves et d'occasion</li>
                <li>Vente de pièces détachées et accessoires</li>
                <li>Services de réparation et d'entretien</li>
                <li>Services de personnalisation</li>
                <li>Conseils techniques</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Prix et modalités de paiement</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                <strong>Prix :</strong> Les prix sont indiqués en euros, toutes taxes comprises (TTC). 
                Ils sont valables au jour de la commande et peuvent être modifiés à tout moment.
              </p>
              <p><strong>Modalités de paiement acceptées :</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Espèces (dans la limite légale)</li>
                <li>Chèque bancaire</li>
                <li>Carte bancaire</li>
                <li>Virement bancaire</li>
                <li>Financement (sous conditions)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Commandes et livraisons</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                <strong>Commandes :</strong> Toute commande doit faire l'objet d'un bon de commande signé par le client. 
                Un acompte peut être demandé à la commande.
              </p>
              <p>
                <strong>Délais de livraison :</strong> Les délais de livraison sont donnés à titre indicatif. 
                Tout retard de livraison ne peut donner lieu à des dommages et intérêts.
              </p>
              <p>
                <strong>Livraison :</strong> La livraison s'effectue soit par retrait en magasin, soit par transport. 
                Les frais de transport sont à la charge du client sauf accord contraire.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Garanties</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                <strong>Garantie légale :</strong> Tous nos produits bénéficient de la garantie légale de conformité 
                et de la garantie contre les vices cachés.
              </p>
              <p>
                <strong>Garantie constructeur :</strong> Les produits neufs bénéficient de la garantie constructeur 
                selon les conditions définies par chaque fabricant.
              </p>
              <p>
                <strong>Garantie sur les réparations :</strong> Nos interventions sont garanties 6 mois 
                (pièces et main-d'œuvre) sauf usure normale.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Droit de rétractation</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Conformément au Code de la consommation, vous disposez d'un délai de 14 jours pour exercer votre droit de rétractation 
                sans avoir à justifier de motifs ni à payer de pénalités.
              </p>
              <p>
                <strong>Exceptions :</strong> Le droit de rétractation ne s'applique pas aux biens confectionnés selon les spécifications 
                du consommateur ou nettement personnalisés.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Responsabilité</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Notre responsabilité est limitée au remplacement ou au remboursement des produits défectueux. 
                Elle ne saurait en aucun cas couvrir les dommages indirects.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Protection des données personnelles</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Les données personnelles collectées sont nécessaires au traitement de votre commande et à la gestion de la relation client. 
                Elles ne sont pas transmises à des tiers sans votre accord.
              </p>
              <p>
                Vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Règlement des litiges</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                En cas de litige, nous nous efforçons de trouver une solution amiable. 
                À défaut, le litige sera porté devant les tribunaux compétents.
              </p>
              <p>
                <strong>Médiation :</strong> En cas de litige, vous pouvez recourir à la médiation de la consommation 
                auprès de [nom du médiateur].
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Dispositions générales</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Les présentes CGV sont soumises au droit français. Toute modification des CGV sera portée à la connaissance des clients.
              </p>
              <p>
                Si une clause des présentes CGV était déclarée nulle, elle serait réputée non écrite, 
                mais les autres clauses resteraient en vigueur.
              </p>
            </div>
          </section>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
            <p className="text-blue-800 text-sm">
              <strong>Contact :</strong> Pour toute question concernant ces conditions générales de vente, 
              vous pouvez nous contacter à [email de contact] ou au [numéro de téléphone].
            </p>
          </div>
        </div>

        {/* Footer navigation */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm">
          <Link to="/legal/notices" className="text-red-600 hover:text-red-700 transition-colors">
            Mentions légales
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

export default TermsOfSalePage;