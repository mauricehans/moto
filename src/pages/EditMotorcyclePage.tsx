/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { Images, Trash2, Star } from 'lucide-react';
import { motorcycleService, imageService } from '../services/api';
import { getAccessToken } from '../services/adminService';
import { Motorcycle } from '../types/Motorcycle';

function EditMotorcyclePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = getAccessToken();
  if (!token) {
    return <Navigate to="/admin/password-reset" replace />;
  }
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Partial<Motorcycle>>({});
  const [imageActionError, setImageActionError] = useState('');

  useEffect(() => {
    const fetchMotorcycle = async () => {
      try {
        const response = await motorcycleService.getById(id!);
        setMotorcycle(response.data);
        setFormData(response.data);
      } catch (err) {
        setError('Erreur lors du chargement de la moto');
      } finally {
        setLoading(false);
      }
    };
    fetchMotorcycle();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
// Add checkbox handler if not present
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  

  const refreshMotorcycle = async () => {
    try {
      const response = await motorcycleService.getById(id!);
      setMotorcycle(response.data);
      setFormData(response.data);
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await motorcycleService.update(id!, formData);
      navigate('/admin');
    } catch (err) {
      setError('Erreur lors de la mise à jour');
    }
  };

  const setPrimary = async (imageId: number) => {
    try {
      await imageService.setMotorcyclePrimaryImage(id!, imageId);
      await refreshMotorcycle();
    } catch (err) {
      setImageActionError('Impossible de définir l\'image principale');
    }
  };

  const deleteImage = async (imageId: number) => {
    try {
      await imageService.deleteMotorcycleImage(id!, imageId);
      await refreshMotorcycle();
    } catch (err) {
      setImageActionError('Suppression d\'image échouée');
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
                <h1 className="text-2xl font-bold text-white">Modifier la moto</h1>
                <p className="text-blue-100 mt-1">Modifiez les informations de la moto</p>
              </div>
              
              <Link
                to={`/admin/images/motorcycle/${id}`}
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Images size={16} className="mr-2" />
                Gérer les images
              </Link>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                placeholder="Entrez la marque"
              />
            </div>

            {/* Modèle */}
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                Modèle
              </label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Entrez le modèle"
              />
            </div>

            {/* Année */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                Année
              </label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year || ''}
                onChange={handleInputChange}
                min="1900"
                max="2030"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Année de fabrication"
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

            {/* Kilométrage */}
            <div>
              <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-2">
                Kilométrage
              </label>
              <input
                type="number"
                id="mileage"
                name="mileage"
                value={formData.mileage || ''}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Kilométrage en km"
              />
            </div>

            {/* Moteur */}
            <div>
              <label htmlFor="engine" className="block text-sm font-medium text-gray-700 mb-2">
                Moteur
              </label>
              <input
                type="text"
                id="engine"
                name="engine"
                value={formData.engine || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Type de moteur"
              />
            </div>
            {/* Puissance */}
            <div>
              <label htmlFor="power" className="block text-sm font-medium text-gray-700 mb-2">
                Puissance (CV)
              </label>
              <input
                type="number"
                id="power"
                name="power"
                value={formData.power || ''}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Puissance en CV"
              />
            </div>
            {/* Permis */}
            <div>
              <label htmlFor="license" className="block text-sm font-medium text-gray-700 mb-2">
                Permis requis
              </label>
              <input
                type="text"
                id="license"
                name="license"
                value={formData.license || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="ex: A, A2"
              />
            </div>
            {/* Couleur */}
            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                Couleur
              </label>
              <input
                type="text"
                id="color"
                name="color"
                value={formData.color || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Couleur principale"
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
                placeholder="Décrivez la moto"
              />
            </div>

            {/* Images */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">La gestion des images se fait dans la page dédiée.</p>
                <Link
                  to={`/admin/images/motorcycle/${id}`}
                  className="inline-flex items-center px-3 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                >
                  <Images size={16} className="mr-2" /> Ouvrir la page images
                </Link>
              </div>
              {imageActionError && (
                <p className="text-sm text-red-600 mt-2">{imageActionError}</p>
              )}
              {motorcycle?.images && motorcycle.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Images existantes</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {motorcycle.images.map(img => (
                      <div key={img.id} className="relative border rounded-md overflow-hidden">
                        <img src={img.image} alt="" className="w-full h-32 object-cover" />
                        <div className="absolute top-2 left-2">
                          {img.is_primary ? (
                            <span className="inline-flex items-center px-2 py-1 text-xs bg-green-600 text-white rounded">
                              <Star size={12} className="mr-1" /> Principale
                            </span>
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

            {/* Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_sold"
                  checked={formData.is_sold || false}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Vendu</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_new"
                  checked={formData.is_new || false}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Neuf</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured || false}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">En vedette</span>
              </label>
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

export default EditMotorcyclePage;
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      navigate('/admin/password-reset');
    }
  }, [navigate]);
