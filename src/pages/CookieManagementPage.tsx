import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie, Check, X } from 'lucide-react';

const CookieManagementPage: React.FC = () => {
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false
  });

  const handlePreferenceChange = (type: keyof typeof preferences) => {
    if (type === 'necessary') return; // Cannot disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const acceptAll = () => {
    setPreferences({
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    });
  };

  const rejectAll = () => {
    setPreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    });
  };

  const savePreferences = () => {
    // Here you would typically save to localStorage or send to your analytics service
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    alert('Vos préférences ont été sauvegardées !');
  };

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
              <Cookie className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Cookies</h1>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Information importante</h3>
              <p className="text-green-700 mb-3">
                <strong>Ce site ne collecte aucun cookie automatiquement.</strong> Nous respectons votre vie privée 
                et n'utilisons que le stockage local (localStorage) de votre navigateur pour :
              </p>
              <ul className="list-disc list-inside text-green-700 space-y-1 ml-4">
                <li>L'authentification des administrateurs du site</li>
                <li>La sauvegarde de vos préférences de cookies (si vous les configurez)</li>
              </ul>
              <p className="text-green-700 mt-3 text-sm">
                Aucune donnée personnelle n'est transmise à des tiers sans votre consentement explicite.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Qu'est-ce qu'un cookie ?</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) 
                lors de la visite d'un site web. Il permet de reconnaître votre navigateur et de mémoriser certaines informations 
                vous concernant ou concernant vos préférences.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pourquoi utilisons-nous des cookies ?</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Agde Moto Gattuso utilise des cookies pour améliorer votre expérience de navigation, 
                analyser l'utilisation de notre site et vous proposer des contenus personnalisés.
              </p>
            </div>
          </section>

          {/* Cookie Preferences */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Utilisation des cookies</h2>
            
            <div className="space-y-6">
              {/* Necessary Cookies */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-medium text-gray-900">Cookies nécessaires</h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Obligatoire</span>
                  </div>
                  <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                    <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-500" />
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Ces cookies sont indispensables au fonctionnement du site. Ils permettent d'utiliser les principales 
                  fonctionnalités comme l'authentification des administrateurs et la navigation sécurisée.
                </p>
                <p className="text-xs text-gray-500">
                  Durée : Session • Finalité : Fonctionnement du site
                </p>
              </div>

              {/* Analytics Cookies - Disabled */}
              <div className="border border-gray-200 rounded-lg p-6 opacity-75">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Cookies d'analyse</h3>
                  <div className="w-12 h-6 bg-gray-200 rounded-full flex items-center justify-start px-1">
                    <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <X className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Nous n'utilisons pas de cookies d'analyse ou de mesure d'audience.
                </p>
                <p className="text-xs text-gray-500">
                  État : Non utilisé
                </p>
              </div>

              {/* Marketing Cookies - Disabled */}
              <div className="border border-gray-200 rounded-lg p-6 opacity-75">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Cookies marketing</h3>
                  <div className="w-12 h-6 bg-gray-200 rounded-full flex items-center justify-start px-1">
                    <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <X className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Nous n'utilisons aucun cookie publicitaire ou de traçage commercial.
                </p>
                <p className="text-xs text-gray-500">
                  État : Non utilisé
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Comment gérer les cookies dans votre navigateur ?</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Vous pouvez également gérer les cookies directement dans les paramètres de votre navigateur :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Chrome :</strong> Paramètres &gt; Confidentialité et sécurité &gt; Cookies</li>
                <li><strong>Firefox :</strong> Paramètres &gt; Vie privée et sécurité &gt; Cookies</li>
                <li><strong>Safari :</strong> Préférences &gt; Confidentialité &gt; Cookies</li>
                <li><strong>Edge :</strong> Paramètres &gt; Cookies et autorisations de site</li>
              </ul>
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                <strong>Attention :</strong> La désactivation de certains cookies peut affecter le fonctionnement du site.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cookies tiers</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Notre site peut contenir des liens vers des réseaux sociaux (Facebook, Instagram) qui peuvent déposer des cookies si vous interagissez avec leurs plateformes.
              </p>
              <p>
                Ces services ont leurs propres politiques de cookies que nous vous invitons à consulter.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Pour toute question concernant notre utilisation des cookies, 
                vous pouvez nous contacter à agdemoto343@gmail.com.
              </p>
            </div>
          </section>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
            <p className="text-blue-800 text-sm">
              <strong>Mise à jour :</strong> Cette politique de cookies peut être modifiée. 
              Nous vous informerons de tout changement important.
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
          <Link to="/legal/privacy" className="text-red-600 hover:text-red-700 transition-colors">
            Politique de confidentialité
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CookieManagementPage;