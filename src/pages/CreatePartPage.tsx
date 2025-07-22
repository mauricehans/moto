import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { partsService } from '../services/api';
import { ArrowLeft, Save } from 'lucide-react';
import { PartCategory } from '../types/Part';

interface PartFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category_name: string;
  brand: string;
  compatible_models: string;
  condition: string;
  is_available: boolean;
}

const CreatePartPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [categories, setCategories] = useState<PartCategory[]>([]);
  
  const [formData, setFormData] = useState<PartFormData>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category_name: '',
    brand: '',
    compatible_models: '',
    condition: 'new',
    is_available: true
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await partsService.getCategories();
        
        if (response.data && Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          setCategories([]);
          setError('Erreur lors du chargement des catégories');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        setCategories([]);
        setError('Impossible de charger les catégories. Veuillez réessayer.');
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));

    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category_name: '',
      brand: '',
      compatible_models: '',
      condition: 'new',
      is_available: true
    });
    setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Le nom de la pièce est requis');
      return false;
    }
    if (!formData.category_name.trim()) {
      setError('Veuillez saisir une catégorie');
      return false;
    }
    if (formData.price <= 0) {
      setError('Le prix doit être supérieur à 0');
      return false;
    }
    if (formData.stock < 0) {
      setError('Le stock ne peut pas être négatif');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Envoyer les données à l'API - le backend gérera la création de catégorie si nécessaire
      const response = await partsService.create(formData);
      navigate('/admin', { state: { tab: 'parts', message: 'Pièce créée avec succès!' } });
    } catch (err: any) {
      console.error('Erreur détaillée:', err.response?.data);
      setError(err.response?.data?.message || err.response?.data?.detail || 'Erreur lors de la création de la pièce');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Retour à l'administration
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Créer une nouvelle pièce</h1>
          <p className="text-gray-600 mt-2">Ajoutez une nouvelle pièce détachée à votre inventaire</p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la pièce *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Ex: Plaquettes de frein avant, Filtre à air..."
                />
              </div>

              <div>
                <label htmlFor="category_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <input
                  type="text"
                  id="category_name"
                  name="category_name"
                  value={formData.category_name}
                  onChange={handleInputChange}
                  required
                  list="categories-list"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder={categoriesLoading ? 'Chargement des catégories...' : 'Saisissez ou sélectionnez une catégorie'}
                />
                <datalist id="categories-list">
                  {Array.isArray(categories) && categories.map((category) => (
                    <option key={category.id} value={category.name} />
                  ))}
                </datalist>
                {categoriesLoading && (
                  <p className="text-sm text-gray-500 mt-1">Chargement des catégories suggérées...</p>
                )}
                {!categoriesLoading && categories.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">Aucune catégorie prédéfinie. Vous pouvez saisir votre propre catégorie.</p>
                )}
              </div>

              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                  Marque
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Ex: Brembo, K&N, NGK..."
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Prix (€) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                  État
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="new">Neuf</option>
                  <option value="used_excellent">Occasion - Excellent</option>
                  <option value="used_good">Occasion - Bon état</option>
                  <option value="used_fair">Occasion - État correct</option>
                  <option value="refurbished">Reconditionné</option>
                </select>
              </div>
            </div>

            {/* Compatibilité */}
            <div>
              <label htmlFor="compatible_models" className="block text-sm font-medium text-gray-700 mb-2">
                Modèles compatibles
              </label>
              <input
                type="text"
                id="compatible_models"
                name="compatible_models"
                value={formData.compatible_models}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Ex: Honda CBR600RR 2007-2012, Yamaha YZF-R1 2009-2014..."
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
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Décrivez la pièce, ses caractéristiques, son utilisation..."
              />
            </div>

            {/* Options */}
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_available"
                  name="is_available"
                  checked={formData.is_available}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="is_available" className="ml-2 block text-sm text-gray-900">
                  Pièce disponible à la vente
                </label>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex justify-between pt-6 border-t">
              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Réinitialiser
              </button>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  disabled={loading}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading || categoriesLoading}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Création...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Créer la pièce
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePartPage;