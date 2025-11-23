/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Images } from 'lucide-react';
import { blogService } from '../services/api';
import { Post } from '../types/Blog';

function EditBlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Partial<Post>>({});
  
// Add this new state for categories if needed, but for now assume hardcoded

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await blogService.getPostById(id!);
        setPost(response.data);
        setFormData(response.data);
      } catch (err) {
        setError('Erreur lors du chargement de l\'article');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'category') {
      // Handle category selection specially
      setFormData(prev => ({
        ...prev,
        category: value ? { id: parseInt(value), name: '', slug: '' } : null
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Prepare data with category_id instead of category object
      const dataToSend = {
        ...formData,
        category_id: formData.category?.id || null
      };
      // Remove the category object to avoid conflicts
      delete dataToSend.category;
      
      // Update post data
      await blogService.update(id!, dataToSend);
      navigate('/admin');
    } catch (err) {
      setError('Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">Modifier l'article</h1>
                <p className="text-blue-100 mt-1">Modifiez les informations de l'article de blog</p>
              </div>
              
              <Link
                to={`/admin/images/blog/${id}`}
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Images size={16} className="mr-2" />
                Gérer l'image
              </Link>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Titre */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Titre de l'article
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Entrez le titre de l'article"
              />
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                Slug
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Slug unique (généré automatiquement si vide)"
              />
            </div>
            {/* Contenu */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Contenu de l'article
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content || ''}
                onChange={handleInputChange}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Rédigez le contenu de votre article..."
              />
            </div>

            {/* Catégorie */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                id="category"
                name="category"
                value={formData.category?.id || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Sélectionnez une catégorie</option>
                {/* Assume categories are fetched and mapped here; for now hardcoded */}
                <option value="1">Actualités</option>
                <option value="2">Conseils</option>
                <option value="3">Maintenance</option>
                <option value="4">Nouveautés</option>
              </select>
            </div>
            {/* Statut de publication */}
            <div>
              <label htmlFor="is_published" className="flex items-center">
                <input
                  type="checkbox"
                  id="is_published"
                  name="is_published"
                  checked={formData.is_published || false}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Publier l'article</span>
              </label>
            </div>
            {/* Image (lecture seule, gestion sur page dédiée) */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">La gestion de l'image se fait dans la page dédiée.</p>
                <Link
                  to={`/admin/images/blog/${id}`}
                  className="inline-flex items-center px-3 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                >
                  <Images size={16} className="mr-2" /> Ouvrir la page image
                </Link>
              </div>
              {post?.image && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Image actuelle</p>
                  <img src={post.image} alt="Image de l'article" className="w-full h-40 object-cover rounded border" />
                </div>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Mettre à jour
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditBlogPostPage;