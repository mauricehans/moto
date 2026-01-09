/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { Images } from 'lucide-react';
import { partsService } from '../services/api';
import { Part } from '../types/Part';
import { PartCategory } from '../types/Part';
import { getAccessToken } from '../services/adminService';
import { getAccessToken } from '../services/adminService';

const EditPartPage = () => {
  const navigate = useNavigate();
  const token = getAccessToken();
  if (!token) {
    return <Navigate to="/admin/password-reset" replace />;
  }
  // Initialiser categories avec un tableau vide
  const [categories, setCategories] = useState<PartCategory[]>([]);
  
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      navigate('/admin/password-reset');
    }
    const loadCategories = async () => {
      try {
        const response = await partsService.getCategories();
        setCategories(response.data);
      } catch (err) {
        console.error('Erreur chargement catégories', err);
      }
    };
    loadCategories();
  }, []);
  const { id } = useParams<{ id: string }>();
  const [part, setPart] = useState<Part | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Partial<Part & { category_id?: number }>>({});
  

  useEffect(() => {
    const fetchPart = async () => {
      try {
        const response = await partsService.getById(id!);
        setPart(response.data);
        setFormData(response.data);
      } catch (err) {
        setError('Erreur lors du chargement de la pièce');
      } finally {
        setLoading(false);
      }
    };
    fetchPart();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await partsService.update(id!, {
        ...formData,
        category: { id: formData.category_id ?? formData.category?.id ?? 0 },
        condition: formData.condition || 'new',
        description: formData.description || '',
        price: formData.price?.toString() || '0'
      });
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
                <h1 className="text-2xl font-bold text-white">Modifier la pièce</h1>
                <p className="text-blue-100 mt-1">Modifiez les informations de la pièce détachée</p>
              </div>
              
              <Link
                to={`/admin/images/part/${id}`}
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Images size={16} className="mr-2" />
                Gérer les images
              </Link>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Nom de la pièce */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la pièce
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Entrez le nom de la pièce"
              />
            </div>

            {/* Marque */}
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                Marque
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Marque de la pièce"
              />
            </div>
            {/* Modèles compatibles */}
            <div>
              <label htmlFor="compatible_models" className="block text-sm font-medium text-gray-700 mb-2">
                Modèles compatibles
              </label>
              <textarea
                id="compatible_models"
                name="compatible_models"
                value={formData.compatible_models || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Modèles compatibles séparés par des virgules"
              />
            </div>
            {/* Catégorie */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              
              {/* Modification du select des catégories */}
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id || formData.category?.id || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Sélectionnez une catégorie</option>
                {/* Ajouter une vérification de type avant le .map() */}
                {Array.isArray(categories) && categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            {/* Condition */}
            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                Condition
              </label>
              <select
                id="condition"
                name="condition"
                value={formData.condition || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="new">Neuf</option>
                <option value="used_excellent">Occasion - Excellent</option>
                <option value="used_good">Occasion - Bon état</option>
                <option value="used_fair">Occasion - État correct</option>
                <option value="refurbished">Reconditionné</option>
              </select>
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
                value={(formData as any).slug || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Slug de la catégorie"
              />
            </div>

            {/* Description détaillée */}
            <div>
              <label htmlFor="full_description" className="block text-sm font-medium text-gray-700 mb-2">
                Description détaillée
              </label>
              <textarea
                id="full_description"
                name="full_description"
                value={(formData as any).full_description || ''}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Description complète avec spécifications techniques"
              />
            </div>
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Décrivez la pièce détachée"
              />
            </div>

            {/* Prix */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Prix (€)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price || ''}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="0.00"
              />
            </div>

            {/* Stock */}
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                Stock disponible
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock || ''}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Quantité en stock"
              />
            </div>

            {/* Statuts */}
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_available"
                  checked={formData.is_available || false}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Disponible</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured || false}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">En vedette</span>
              </label>
            </div>
            {/* Images (lecture seule, gestion sur page dédiée) */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">La gestion des images se fait dans la page dédiée.</p>
                <Link
                  to={`/admin/images/part/${id}`}
                  className="inline-flex items-center px-3 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                >
                  <Images size={16} className="mr-2" /> Ouvrir la page images
                </Link>
              </div>
              {part?.images && part.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Images existantes</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {part.images.map(img => (
                      <div key={img.id} className="relative border rounded-md overflow-hidden">
                        <img src={img.image} alt="" className="w-full h-32 object-cover" />
                        <div className="absolute top-2 left-2">
                          {img.is_primary ? (
                            <span className="inline-flex items-center px-2 py-1 text-xs bg-green-600 text-white rounded">Principale</span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">Secondaire</span>
                          )}
                        </div>
                        <div className="absolute top-2 right-2">
                          <span className="p-1 bg-white text-gray-600 border border-gray-300 rounded">ID {img.id}</span>
                        </div>
                      </div>
                    ))}
                  </div>
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

export default EditPartPage;
