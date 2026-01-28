import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Settings, Images } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import { useBlogPost } from '../hooks/useBlog';
import { getImageUrl } from '../utils/imageUrl';

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, error } = useBlogPost(id!);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
          <p className="text-gray-600 mb-8">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
          <Link
            to="/blog"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Retour au blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <HeroSection
        title={post.title}
        subtitle="Article du blog"
        backgroundImage={getImageUrl(post.image) || "https://images.pexels.com/photos/2519374/pexels-photo-2519374.jpeg"}
      />

      <div className="container mx-auto px-4 py-16">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Retour au blog
          </Link>
        </div>

        <article className="max-w-4xl mx-auto bg-white text-black rounded-lg shadow-sm p-6">
          {/* En-tête de l'article */}
          <header className="mb-8">
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                {new Date(post.created_at).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center">
                <User size={16} className="mr-1" />
                Agde Moto Gattuso
              </div>
              {post.category && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {post.category.name}
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          </header>

          {/* Image principale */}
          {post.image && (
            <div className="mb-8">
              <img
                src={getImageUrl(post.image)}
                alt={post.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Contenu */}
          <div className="max-w-none text-black">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </article>

        {/* Section Admin - Gestion des images */}
        {localStorage.getItem('admin-token') && (
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Settings size={24} />
                  <div>
                    <h3 className="text-xl font-bold">Administration</h3>
                    <p className="text-blue-100">Gestion de l'image de cet article</p>
                  </div>
                </div>
                <Link
                  to={`/admin/images/blog/${id}`}
                  className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium"
                >
                  <Images size={16} className="mr-2" />
                  Gérer l'image
                </Link>
              </div>
              
              {post.image && (
                <div className="mt-4 pt-4 border-t border-blue-500">
                  <p className="text-blue-100 mb-3">Image actuelle:</p>
                  <div className="flex items-center space-x-4">
                    <img
                      src={getImageUrl(post.image)}
                      alt="Image de l'article"
                      className="w-24 h-16 object-cover rounded border-2 border-white/20"
                    />
                    <div className="text-blue-100 text-sm">
                      <p>Image principale de l'article</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostPage;