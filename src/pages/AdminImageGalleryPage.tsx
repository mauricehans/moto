import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Trash2, Star, StarOff, Eye, Download, Plus } from 'lucide-react';
import { motorcycleService, partsService, blogService, imageService } from '../services/api';
import api from '../services/api';
import { Motorcycle } from '../types/Motorcycle';
import { Part } from '../types/Part';
import { Post } from '../types/Blog';

type ItemType = 'motorcycle' | 'part' | 'blog';

interface ImageItem {
  id: number;
  image: string;
  is_primary: boolean;
  created_at: string;
}

const AdminImageGalleryPage: React.FC = () => {
  const { type, id } = useParams<{ type: ItemType; id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Motorcycle | Part | Post | null>(null);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [fsImages, setFsImages] = useState<{ filename: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  useEffect(() => {
    fetchItemAndImages();
  }, [type, id]);

  const fetchItemAndImages = async () => {
    try {
      setLoading(true);
      let itemData;
      
      switch (type) {
        case 'motorcycle':
          itemData = await motorcycleService.getById(id!);
          break;
        case 'part':
          itemData = await partsService.getById(id!);
          break;
        case 'blog':
          itemData = await blogService.getPostById(id!);
          break;
        default:
          throw new Error('Type d\'item invalide');
      }
      
      setItem(itemData.data);
      
      // Pour les articles de blog, on gère différemment car ils n'ont qu'une image
      if (type === 'blog') {
        const blogPost = itemData.data as Post;
        if (blogPost.image) {
          setImages([{
            id: 1,
            image: blogPost.image,
            is_primary: true,
            created_at: blogPost.created_at
          }]);
        } else {
          setImages([]);
        }
      } else {
        setImages((itemData.data as Motorcycle | Part).images || []);
      }

      if (type === 'motorcycle') {
        try {
          const res = await api.get(`/motorcycles/${id}/list_images/`);
          setFsImages(res.data?.filesystem || []);
        } catch (e) {
          setFsImages([]);
        }
      } else {
        setFsImages([]);
      }
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    setUploading(true);
    try {
      const MAX_PER_FILE = 1024 * 1024 * 1024;
      for (let i = 0; i < selectedFiles.length; i++) {
        if (selectedFiles[i].size > MAX_PER_FILE) {
          throw new Error('Fichier trop volumineux (>1Go). Réduisez la taille avant upload.');
        }
      }
      switch (type) {
        case 'motorcycle': {
          for (let i = 0; i < selectedFiles.length; i++) {
            const fd = new FormData();
            fd.append('images', selectedFiles[i]);
            await api.post(`/motorcycles/${id}/upload_images/`, fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 0 });
          }
          break;
        }
        case 'part': {
          for (let i = 0; i < selectedFiles.length; i++) {
            const fd = new FormData();
            fd.append('images', selectedFiles[i]);
            await api.post(`/parts/${id}/upload_images/`, fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 0 });
          }
          break;
        }
        case 'blog': {
          if (selectedFiles.length > 1) {
            throw new Error('Un seul fichier autorisé pour les articles de blog');
          }
          await imageService.uploadBlogImage(id!, selectedFiles[0]);
          break;
        }
        default:
          throw new Error('Type d\'item non supporté');
      }
      
      // Recharger les images après upload
      await fetchItemAndImages();
      setSelectedFiles(null);
      
      // Reset du input file
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      console.error('Erreur upload:', err);
      if (err.response?.status === 404) {
        setError('Endpoint d\'upload non trouvé. Vérifiez que le backend est configuré correctement.');
      } else if (err.response?.status === 413) {
        setError('Fichier trop volumineux (413). Réduisez la taille ou uploadez par fichier.');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Erreur lors de l\'upload des images');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSetPrimary = async (imageId: number) => {
    try {
      let response;
      
      switch (type) {
        case 'motorcycle':
          response = await imageService.setMotorcyclePrimaryImage(id!, imageId);
          break;
        case 'part':
          response = await imageService.setPartPrimaryImage(id!, imageId);
          break;
        case 'blog':
          // Les articles de blog n'ont qu'une seule image, pas besoin de définir comme principale
          console.log('Les articles de blog n\'ont qu\'une seule image');
          return;
        default:
          throw new Error('Type d\'item non supporté');
      }
      
      console.log('Image principale mise à jour:', response.data);
      
      // Mettre à jour localement
      setImages(prev => prev.map(img => ({
        ...img,
        is_primary: img.id === imageId
      })));
    } catch (err: any) {
      console.error('Erreur set primary:', err);
      if (err.response?.status === 404) {
        setError('Endpoint de mise à jour non trouvé. Vérifiez que le backend est configuré correctement.');
      } else {
        setError('Erreur lors de la mise à jour de l\'image principale');
      }
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;
    
    try {
      switch (type) {
        case 'motorcycle':
          await imageService.deleteMotorcycleImage(id!, imageId);
          break;
        case 'part':
          await imageService.deletePartImage(id!, imageId);
          break;
        case 'blog':
          await imageService.deleteBlogImage(id!);
          break;
        default:
          throw new Error('Type d\'item non supporté');
      }
      
      console.log('Image supprimée avec succès');
      
      // Mettre à jour localement
      setImages(prev => prev.filter(img => img.id !== imageId));
    } catch (err: any) {
      console.error('Erreur delete:', err);
      if (err.response?.status === 404) {
        setError('Endpoint de suppression non trouvé. Vérifiez que le backend est configuré correctement.');
      } else {
        setError('Erreur lors de la suppression de l\'image');
      }
    }
  };

  const getItemTitle = () => {
    if (!item) return 'Chargement...';
    
    switch (type) {
      case 'motorcycle':
        const moto = item as Motorcycle;
        return `${moto.brand} ${moto.model} (${moto.year})`;
      case 'part':
        return (item as Part).name;
      case 'blog':
        return (item as Post).title;
      default:
        return 'Item inconnu';
    }
  };

  const getBackUrl = () => {
    switch (type) {
      case 'motorcycle':
        return `/admin/edit-motorcycle/${id}`;
      case 'part':
        return `/admin/edit-part/${id}`;
      case 'blog':
        return `/admin/edit-blog/${id}`;
      default:
        return '/admin';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            to="/admin"
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <ArrowLeft size={16} className="mr-2" />
            Retour à l'admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to={getBackUrl()}
                className="inline-flex items-center text-gray-600 hover:text-red-600 transition-colors mb-2"
              >
                <ArrowLeft size={20} className="mr-2" />
                Retour à l'édition
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Galerie d'images - {getItemTitle()}
              </h1>
              <p className="text-gray-600">
                Gérez les images associées à cet item
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Section d'upload */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Ajouter de nouvelles images
          </h2>
          
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                id="file-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              />
            </div>
            
            <button
              onClick={handleUpload}
              disabled={!selectedFiles || uploading}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                  Upload...
                </>
              ) : (
                <>
                  <Upload size={16} className="mr-2" />
                  Uploader
                </>
              )}
            </button>
          </div>
          
          {selectedFiles && selectedFiles.length > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {selectedFiles.length} fichier(s) sélectionné(s)
            </p>
          )}
        </div>

        {/* Galerie d'images */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Images actuelles ({images.length})
          </h2>
          
          {images.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">Aucune image associée à cet item</p>
              <p className="text-sm text-gray-400">
                Utilisez la section ci-dessus pour ajouter des images
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={image.image}
                      alt="Image de l'item"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Badge image principale */}
                  {image.is_primary && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                      <Star size={12} className="mr-1" />
                      Principale
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      {!image.is_primary && (
                        <button
                          onClick={() => handleSetPrimary(image.id)}
                          className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
                          title="Définir comme image principale"
                        >
                          <Star size={16} />
                        </button>
                      )}
                      
                      <button
                        onClick={() => window.open(image.image, '_blank')}
                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                        title="Voir en grand"
                      >
                        <Eye size={16} />
                      </button>
                      
                      <a
                        href={image.image}
                        download
                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                        title="Télécharger"
                      >
                        <Download size={16} />
                      </a>
                      
                      <button
                        onClick={() => handleDeleteImage(image.id)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Informations */}
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">
                      Ajoutée le {new Date(image.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {type === 'motorcycle' && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Fichiers du dossier ({fsImages.length})
            </h2>
            {fsImages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-500 mb-4">Aucun fichier détecté dans le dossier</p>
                <p className="text-sm text-gray-400">Vérifiez l'upload ou la synchronisation</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {fsImages.map((fi) => (
                  <div key={fi.url} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={fi.url}
                        alt="Fichier du dossier"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(fi.url, '_blank')}
                          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                          title="Voir en grand"
                        >
                          <Eye size={16} />
                        </button>
                        <a
                          href={fi.url}
                          download
                          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                          title="Télécharger"
                        >
                          <Download size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminImageGalleryPage;
