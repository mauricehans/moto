import { useEffect } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import SectionTitle from '../components/SectionTitle';
import ContactForm from '../components/ContactForm';
import Map from '../components/Map';
import useGarageSettings from '../hooks/useGarageSettings';

const ContactPage = () => {
  const { settings, loading } = useGarageSettings();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      <HeroSection
        title="Contactez-Nous"
        subtitle="Nous sommes à votre disposition pour répondre à toutes vos questions"
        backgroundImage="https://images.pexels.com/photos/4300121/pexels-photo-4300121.jpeg"
      />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <SectionTitle
                title="Nos Coordonnées"
                subtitle="N'hésitez pas à nous contacter par téléphone, email ou en nous rendant visite"
              />

              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <MapPin size={24} className="text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Adresse</h3>
                    <p className="text-gray-700">{settings.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone size={24} className="text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Téléphone</h3>
                    <p className="text-gray-700">{settings.phone}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail size={24} className="text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-700">{settings.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock size={24} className="text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Horaires d'ouverture</h3>
                    <div className="text-gray-700">
                      {settings.business_hours && (
                        <>
                          <p>Lundi : {settings.business_hours.monday?.is_closed ? 'Fermé' : `${settings.business_hours.monday?.open} - ${settings.business_hours.monday?.close}`}</p>
                          <p>Mardi : {settings.business_hours.tuesday?.is_closed ? 'Fermé' : `${settings.business_hours.tuesday?.open} - ${settings.business_hours.tuesday?.close}`}</p>
                          <p>Mercredi : {settings.business_hours.wednesday?.is_closed ? 'Fermé' : `${settings.business_hours.wednesday?.open} - ${settings.business_hours.wednesday?.close}`}</p>
                          <p>Jeudi : {settings.business_hours.thursday?.is_closed ? 'Fermé' : `${settings.business_hours.thursday?.open} - ${settings.business_hours.thursday?.close}`}</p>
                          <p>Vendredi : {settings.business_hours.friday?.is_closed ? 'Fermé' : `${settings.business_hours.friday?.open} - ${settings.business_hours.friday?.close}`}</p>
                          <p>Samedi : {settings.business_hours.saturday?.is_closed ? 'Fermé' : `${settings.business_hours.saturday?.open} - ${settings.business_hours.saturday?.close}`}</p>
                          <p>Dimanche : {settings.business_hours.sunday?.is_closed ? 'Fermé' : `${settings.business_hours.sunday?.open} - ${settings.business_hours.sunday?.close}`}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Localisation</h3>
                <Map address={settings.address} height="300px" />
              </div>
            </div>

            <div>
              <SectionTitle
                title="Envoyez-nous un message"
                subtitle="Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais"
              />

              <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <SectionTitle
            title="Suivez-nous sur les réseaux sociaux"
            subtitle="Restez informé des dernières nouveautés et promotions"
            center
          />

          <div className="flex justify-center space-x-6">
            {settings.social_media?.facebook && (
              <a
                href={settings.social_media.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-12 h-12 bg-white text-blue-600 rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            )}

            {settings.social_media?.instagram && (
              <a
                href={settings.social_media.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-12 h-12 bg-white text-pink-600 rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            )}

            {settings.social_media?.youtube && (
              <a
                href={settings.social_media.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-12 h-12 bg-white text-red-600 rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;