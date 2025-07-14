/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import SectionTitle from '../components/SectionTitle';

const BlogPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <HeroSection
        title="Blog Moto"
        subtitle="Actualités, conseils et passion moto"
        backgroundImage="https://images.pexels.com/photos/2393821/pexels-photo-2393821.jpeg"
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="Derniers Articles"
            subtitle="Restez informé des dernières actualités et conseils moto"
          />

          {/* Content will be added in the next iteration */}
          <div className="text-center py-12">
            <p className="text-gray-600">
              Les articles du blog seront bientôt disponibles.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;