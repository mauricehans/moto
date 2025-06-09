import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HeroSection from '../components/HeroSection';

const BlogPostPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Simulate loading state
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <HeroSection
        title="Article du Blog"
        subtitle="Découvrez nos derniers articles"
        backgroundImage="https://images.pexels.com/photos/2519374/pexels-photo-2519374.jpeg"
      />

      <article className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-lg mx-auto">
          <div className="mb-8">
            <p className="text-gray-600 mb-4">Article ID: {id}</p>
            <h1 className="text-4xl font-bold mb-4">Contenu à venir</h1>
            <p className="text-gray-600">
              Le contenu détaillé de cet article sera bientôt disponible.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;