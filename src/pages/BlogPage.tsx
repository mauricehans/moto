/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import SectionTitle from '../components/SectionTitle';
import { useBlogPosts } from '../hooks/useBlog';
import { getImageUrl } from '../utils/imageUrl';

const BlogPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: posts, isLoading, error } = useBlogPosts();

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts?.filter(p => p.is_published).map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={getImageUrl(post.image)} alt={post.title} className="w-full h-48 object-cover" />
                <div className="p-4 bg-white">
                  <h3 className="text-xl font-semibold mb-2 text-black">{post.title}</h3>
                  <p className="text-black mb-4">{post.excerpt || post.content.substring(0, 100) + '...'}</p>
                  <Link
                    to={`/blog/${post.slug || post.id}`}
                    onClick={() => console.log('[debug] Lire plus click', {
                      id: post.id,
                      slug: post.slug,
                      href: `/blog/${post.slug || post.id}`
                    })}
                    className="text-blue-500 hover:underline">
                    Lire plus <ArrowRight className="inline-block ml-1" size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {posts?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">
                Aucun article disponible pour le moment.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
