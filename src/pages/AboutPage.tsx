import { useEffect } from 'react';
import { Users, Award, ThumbsUp, Clock } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import SectionTitle from '../components/SectionTitle';

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <HeroSection
        title="À Propos de Nous"
        subtitle="Découvrez l'histoire de Moto Garage Agde et notre passion pour les deux-roues"
        backgroundImage="https://images.pexels.com/photos/995487/pexels-photo-995487.jpeg"
      />

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Notre Histoire
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Fondé en 2005 par Jean Dupont, passionné de moto depuis plus de 30 ans, Moto Garage Agde est né d'une vision simple : offrir des motos d'occasion de qualité à des prix justes, avec un service personnalisé et professionnel.
                </p>
                <p>
                  Situé au cœur d'Agde, notre garage s'est rapidement fait connaître pour son expertise, sa transparence et la qualité de ses motos. Au fil des années, nous avons développé une clientèle fidèle qui nous fait confiance pour l'achat de leur moto.
                </p>
                <p>
                  Aujourd'hui, Moto Garage Agde est devenu une référence locale dans le domaine de la vente de motos d'occasion. Notre équipe, composée de passionnés, met tout en œuvre pour vous aider à trouver la moto qui correspond à vos besoins et à votre budget.
                </p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.pexels.com/photos/3807319/pexels-photo-3807319.jpeg"
                alt="Notre garage"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="Pourquoi nous choisir ?"
            subtitle="Nous nous distinguons par notre expertise et notre engagement envers nos clients"
            center
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-5">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Expertise
              </h3>
              <p className="text-gray-600">
                Plus de 15 ans d'expérience dans la vente et l'entretien de motos de toutes marques.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-5">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Qualité
              </h3>
              <p className="text-gray-600">
                Toutes nos motos sont rigoureusement sélectionnées et vérifiées par nos techniciens.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-5">
                <ThumbsUp size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Satisfaction
              </h3>
              <p className="text-gray-600">
                Plus de 95% de nos clients nous recommandent à leur entourage.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-5">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Service après-vente
              </h3>
              <p className="text-gray-600">
                Un service client réactif et attentif à vos besoins avant, pendant et après votre achat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="Notre Équipe"
            subtitle="Rencontrez les passionnés qui font de Moto Garage Agde un lieu unique"
            center
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img
                src="https://images.pexels.com/photos/8112069/pexels-photo-8112069.jpeg"
                alt="Jean Dupont - Fondateur"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Jean Dupont</h3>
                <p className="text-red-600 font-medium mb-3">Fondateur & Directeur</p>
                <p className="text-gray-600">
                  Passionné de moto depuis plus de 30 ans, Jean a fondé Moto Garage Agde en 2005 avec la vision d'offrir un service personnalisé et des motos de qualité.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img
                src="https://images.pexels.com/photos/2760289/pexels-photo-2760289.jpeg"
                alt="Sophie Martin - Responsable des ventes"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Sophie Martin</h3>
                <p className="text-red-600 font-medium mb-3">Responsable des ventes</p>
                <p className="text-gray-600">
                  Avec 10 ans d'expérience dans la vente de motos, Sophie vous accompagne dans le choix de votre future moto avec expertise et bienveillance.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img
                src="https://images.pexels.com/photos/6964375/pexels-photo-6964375.jpeg"
                alt="Thomas Bernard - Chef mécanicien"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Thomas Bernard</h3>
                <p className="text-red-600 font-medium mb-3">Chef mécanicien</p>
                <p className="text-gray-600">
                  Mécanicien certifié avec plus de 15 ans d'expérience, Thomas supervise la préparation et l'entretien de toutes les motos de notre garage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="Ce que disent nos clients"
            subtitle="Découvrez les témoignages de nos clients satisfaits"
            center
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "J'ai acheté ma Yamaha MT-07 chez Moto Garage Agde et je suis très satisfait du service. L'équipe est professionnelle, à l'écoute et de bons conseils. Ma moto est impeccable et le suivi après-vente est excellent."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-gray-900">Pierre Lefèvre</p>
                  <p className="text-sm text-gray-600">Client depuis 2021</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "C'est la deuxième moto que j'achète chez Moto Garage Agde. Le personnel est accueillant et compétent. Ils prennent le temps de comprendre nos besoins et proposent des motos qui correspondent parfaitement."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-gray-900">Marie Dubois</p>
                  <p className="text-sm text-gray-600">Cliente depuis 2018</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Très satisfait de mon achat chez Moto Garage Agde. J'hésitais entre plusieurs modèles, et leurs conseils m'ont aidé à faire le bon choix. La moto était parfaitement préparée et l'après-vente est irréprochable."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-gray-900">Lucas Moreau</p>
                  <p className="text-sm text-gray-600">Client depuis 2020</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;