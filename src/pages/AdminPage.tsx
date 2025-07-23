/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Lock, LogOut, Bike, Package, FileText, LayoutDashboard, Plus, Settings
} from 'lucide-react';
import DataTable, { type Column } from '../components/DataTable';
import { useMotorcycles } from '../hooks/useMotorcycles';
import { useParts } from '../hooks/useParts';
import { useBlogPosts } from '../hooks/useBlog';
import { Motorcycle } from '../types/Motorcycle';
import { Part } from '../types/Part';
import type { Post } from '../types/Blog';
import { useNavigate } from 'react-router-dom';
import { garageService } from '../services/api';
import { GarageSettings } from '../types/Admin';

type TabType = 'dashboard' | 'motorcycles' | 'parts' | 'blog' | 'settings';

interface LoginCredentials {
  username: string;
  password: string;
}

const AdminPage: React.FC = () => {
  // États d'authentification
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginForm, setLoginForm] = useState<LoginCredentials>({ username: '', password: '' });
  const [loginError, setLoginError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // États de navigation
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // États pour les paramètres du garage
  const [garageSettings, setGarageSettings] = useState<GarageSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState('');

  // Hooks pour récupérer les données depuis l'API
  const { data: motorcycles = [], isLoading: motorcyclesLoading } = useMotorcycles();
  const { data: parts = [], isLoading: partsLoading } = useParts();
  const { data: blogPosts = [], isLoading: blogLoading } = useBlogPosts();
  const navigate = useNavigate();

  // Vérifier l'authentification au chargement de la page
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Charger les paramètres du garage
  useEffect(() => {
    if (isAuthenticated && activeTab === 'settings') {
      loadGarageSettings();
    }
  }, [isAuthenticated, activeTab]);

  const loadGarageSettings = async () => {
    setSettingsLoading(true);
    setSettingsError('');
    try {
      const response = await garageService.getSettings();
      setGarageSettings(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
      setSettingsError('Erreur lors du chargement des paramètres');
      // Initialiser avec des valeurs par défaut si aucun paramètre n'existe
      setGarageSettings({
        id: '1',
        name: 'Agde Moto Gattuso',
        address: '',
        phone: '',
        email: '',
        website: '',
        description: '',
        social_media: {
          facebook: '',
          instagram: '',
          youtube: '',
          twitter: '',
          linkedin: ''
        },
        business_hours: {
          monday: { open: '09:00', close: '18:00', is_closed: false },
          tuesday: { open: '09:00', close: '18:00', is_closed: false },
          wednesday: { open: '09:00', close: '18:00', is_closed: false },
          thursday: { open: '09:00', close: '18:00', is_closed: false },
          friday: { open: '09:00', close: '18:00', is_closed: false },
          saturday: { open: '09:00', close: '17:00', is_closed: false },
          sunday: { open: '10:00', close: '16:00', is_closed: true }
        },
        seo_settings: {
          meta_title: '',
          meta_description: '',
          meta_keywords: '',
          og_title: '',
          og_description: '',
          og_image: ''
        }
      });
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleSettingsChange = (field: string, value: string | boolean) => {
    if (!garageSettings) return;
    
    setGarageSettings(prev => {
      if (!prev) return prev;
      
      if (field.includes('.')) {
        const [section, subField] = field.split('.');
        return {
          ...prev,
          [section]: {
            ...prev[section as keyof GarageSettings],
            [subField]: value
          }
        };
      }
      
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleBusinessHoursChange = (day: string, field: string, value: string | boolean) => {
    if (!garageSettings) return;
    
    setGarageSettings(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        business_hours: {
          ...prev.business_hours,
          [day]: {
            ...prev.business_hours[day as keyof typeof prev.business_hours],
            [field]: value
          }
        }
      };
    });
  };

  const handleSaveSettings = async () => {
    if (!garageSettings) return;
    
    setSettingsLoading(true);
    setSettingsError('');
    
    try {
      await garageService.updateSettings(garageSettings);
      alert('Paramètres sauvegardés avec succès !');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setSettingsError('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setSettingsLoading(false);
    }
  };

  // Fonctions de suppression
  const handleDeleteMotorcycle = async (motorcycle: Motorcycle) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la moto ${motorcycle.brand} ${motorcycle.model} ?`)) {
      try {
        await api.delete(`/motorcycles/motorcycles/${motorcycle.id}/`);
        // Recharger la page pour actualiser les données
        window.location.reload();
      } catch (error) {
        alert('Erreur lors de la suppression de la moto');
      }
    }
  };

  const handleDeletePart = async (part: Part) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la pièce ${part.name} ?`)) {
      try {
        await api.delete(`/parts/parts/${part.id}/`);
        // Recharger la page pour actualiser les données
        window.location.reload();
      } catch (error) {
        alert('Erreur lors de la suppression de la pièce');
      }
    }
  };

  const handleDeleteBlogPost = async (post: Post) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'article "${post.title}" ?`)) {
      try {
        await api.delete(`/blog/posts/${post.id}/`);
        // Recharger la page pour actualiser les données
        window.location.reload();
      } catch (error) {
        alert('Erreur lors de la suppression de l\'article');
      }
    }
  };

  // Calculs des statistiques en temps réel
  const availableMotorcycles = motorcycles.filter(m => !m.is_sold).length;
  const soldMotorcycles = motorcycles.filter(m => m.is_sold).length;
  const availableParts = parts.filter(p => p.is_available && p.stock > 0).length;
  const outOfStockParts = parts.filter(p => p.stock === 0).length;
  const publishedPosts = blogPosts.filter(p => p.is_published).length;

  // Gestion de l'authentification
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    try {
      const response = await api.post('/token/', {
        username: loginForm.username,
        password: loginForm.password
      });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      setIsAuthenticated(true);
    } catch (error) {
      setLoginError('Nom d\'utilisateur ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    setLoginForm({ username: '', password: '' });
    setActiveTab('dashboard');
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Définition des colonnes pour les tables
  const motorcycleColumns = [
    {
      key: 'images' as keyof Motorcycle,
      label: 'Images',
      render: (value: Motorcycle[keyof Motorcycle], item: Motorcycle) => (
        <div className="flex space-x-1">
          {item.images && item.images.length > 0 ? (
            <>
              <img
                src={item.images.find(img => img.is_primary)?.image || item.images[0]?.image}
                alt={`${item.brand} ${item.model}`}
                className="w-12 h-12 object-cover rounded-md border"
              />
              {item.images.length > 1 && (
                <span className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 text-xs rounded-md border">
                  +{item.images.length - 1}
                </span>
              )}
            </>
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-md border flex items-center justify-center">
              <span className="text-gray-400 text-xs">Aucune</span>
            </div>
          )}
        </div>
      )
    },
    { key: 'brand' as keyof Motorcycle, label: 'Marque' },
    { key: 'model' as keyof Motorcycle, label: 'Modèle' },
    { key: 'year' as keyof Motorcycle, label: 'Année' },
    { 
      key: 'price' as keyof Motorcycle, 
      label: 'Prix', 
      render: (value: Motorcycle[keyof Motorcycle]) => `${Number(value).toLocaleString()} €`
    },
    { 
      key: 'is_sold' as keyof Motorcycle, 
      label: 'Statut de vente', 
      render: (value: Motorcycle[keyof Motorcycle]) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          value ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {value ? 'Vendue' : 'Disponible'}
        </span>
      )
    }
  ];

  const partColumns = [
    {
      key: 'images' as keyof Part,
      label: 'Images',
      render: (value: Part[keyof Part], item: Part) => (
        <div className="flex space-x-1">
          {item.images && item.images.length > 0 ? (
            <>
              <img
                src={item.images.find(img => img.is_primary)?.image || item.images[0]?.image}
                alt={item.name}
                className="w-12 h-12 object-cover rounded-md border"
              />
              {item.images.length > 1 && (
                <span className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 text-xs rounded-md border">
                  +{item.images.length - 1}
                </span>
              )}
            </>
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-md border flex items-center justify-center">
              <span className="text-gray-400 text-xs">Aucune</span>
            </div>
          )}
        </div>
      )
    },
    { key: 'name' as keyof Part, label: 'Nom' },
    { 
      key: 'category' as keyof Part, 
      label: 'Catégorie',
      render: (value: Part[keyof Part], item: Part) => item.category?.name || 'N/A'
    },
    { 
      key: 'price' as keyof Part, 
      label: 'Prix', 
      render: (value: Part[keyof Part]) => `${Number(value).toLocaleString()} €`
    },
    { key: 'stock' as keyof Part, label: 'Stock' },
    { 
      key: 'is_available' as keyof Part, 
      label: 'Statut de disponibilité', 
      render: (value: Part[keyof Part], item: Part) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          value && item.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value && item.stock > 0 ? 'Disponible' : 'Indisponible'}
        </span>
      )
    }
  ];

  const blogColumns = [
    {
      key: 'image' as keyof Post,
      label: 'Image',
      render: (value: Post[keyof Post], item: Post) => (
        <div className="flex space-x-1">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="w-12 h-12 object-cover rounded-md border"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-md border flex items-center justify-center">
              <span className="text-gray-400 text-xs">Aucune</span>
            </div>
          )}
        </div>
      )
    },
    { key: 'title' as keyof Post, label: 'Titre' },
    { 
      key: 'created_at' as keyof Post,
      label: 'Date de création', 
      render: (value: Post[keyof Post], item: Post) => new Date(String(value)).toLocaleDateString()
    },
    { 
      key: 'is_published' as keyof Post, 
      label: 'Statut de publication', 
      render: (value: Post[keyof Post], item: Post) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {value ? 'Publié' : 'Brouillon'}
        </span>
      )
    }
  ];

  // Les données sont automatiquement chargées via les hooks useMotorcycles, useParts, useBlog

  // Affichage du formulaire de connexion
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <Lock size={48} className="mx-auto text-red-600 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
            <p className="text-gray-600 mt-2">Connectez-vous pour accéder au panneau d'administration</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={loginForm.username}
                onChange={handleLoginInputChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginForm.password}
                onChange={handleLoginInputChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
              />
            </div>

            {loginError && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                  Connexion...
                </div>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          
        </div>
      </div>
    );
  }

  // Interface d'administration
  return (
    <div className="min-h-screen bg-gray-100">
      {/* En-tête */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
            <p className="text-gray-600">Agde Moto Gattuso</p>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6">
            {/* Profil Admin */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    A
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500">Administrateur</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Se déconnecter"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="space-y-2">
              {[
                { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
                { id: 'motorcycles', label: 'Motos', icon: Bike },
                { id: 'parts', label: 'Pièces détachées', icon: Package },
                { id: 'blog', label: 'Blog', icon: FileText },
                { id: 'settings', label: 'Paramètres du site', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-red-50 text-red-600 border-r-2 border-red-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} className="mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Contenu principal */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Tableau de bord</h2>
                <p className="text-gray-600">Vue d'ensemble de votre garage</p>
              </div>

              {/* Statistiques en temps réel */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Motos disponibles</p>
                      <p className="text-2xl font-bold text-green-600">{availableMotorcycles}</p>
                    </div>
                    <Bike className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Motos vendues</p>
                      <p className="text-2xl font-bold text-red-600">{soldMotorcycles}</p>
                    </div>
                    <Bike className="w-8 h-8 text-red-600" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pièces disponibles</p>
                      <p className="text-2xl font-bold text-green-600">{availableParts}</p>
                    </div>
                    <Package className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Articles publiés</p>
                      <p className="text-2xl font-bold text-blue-600">{publishedPosts}</p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'motorcycles' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Liste des motos</h2>
                  <p className="text-gray-600">Consultez votre stock de motos</p>
                </div>
                <div className="flex items-center space-x-4">
                  {motorcyclesLoading && (
                    <div className="text-gray-500">Chargement...</div>
                  )}
                  <button
                    onClick={() => navigate('/admin/create-motorcycle')}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <Plus size={16} className="mr-2" />
                    Créer une moto
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <DataTable
                  data={motorcycles}
                  columns={motorcycleColumns}
                  loading={motorcyclesLoading}
                  emptyMessage="Aucune moto trouvée"
                  onEdit={(item) => navigate(`/admin/edit-motorcycle/${item.id}`)}
                  onView={(item) => navigate(`/admin/images/motorcycle/${item.id}`)}
                  onDelete={handleDeleteMotorcycle}
                />
              </div>
            </div>
          )}

          {activeTab === 'parts' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Liste des pièces détachées</h2>
                  <p className="text-gray-600">Consultez votre stock de pièces</p>
                </div>
                <div className="flex items-center space-x-4">
                  {partsLoading && (
                    <div className="text-gray-500">Chargement...</div>
                  )}
                  <button
                    onClick={() => navigate('/admin/create-part')}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <Plus size={16} className="mr-2" />
                    Créer une pièce
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <DataTable
                  data={parts}
                  columns={partColumns}
                  loading={partsLoading}
                  emptyMessage="Aucune pièce trouvée"
                  onEdit={(item) => navigate(`/admin/edit-part/${item.id}`)}
                  onView={(item) => navigate(`/admin/images/part/${item.id}`)}
                  onDelete={handleDeletePart}
                />
              </div>
            </div>
          )}

          {activeTab === 'blog' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Liste des articles de blog</h2>
                  <p className="text-gray-600">Consultez vos articles de blog</p>
                </div>
                <div className="flex items-center space-x-4">
                  {blogLoading && (
                    <div className="text-gray-500">Chargement...</div>
                  )}
                  <button
                    onClick={() => navigate('/admin/create-blog')}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <Plus size={16} className="mr-2" />
                    Créer un article
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <DataTable
                  data={blogPosts}
                  columns={blogColumns}
                  loading={blogLoading}
                  emptyMessage="Aucun article trouvé"
                  onEdit={(item) => navigate(`/admin/edit-blog/${item.id}`)}
                  onView={(item) => navigate(`/admin/images/blog/${item.id}`)}
                  onDelete={handleDeleteBlogPost}
                />
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Paramètres du site</h2>
                <p className="text-gray-600">Gérez les informations importantes de votre garage</p>
              </div>

              {settingsLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-600"></div>
                  <span className="ml-2 text-gray-600">Chargement des paramètres...</span>
                </div>
              )}

              {settingsError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {settingsError}
                </div>
              )}

              {garageSettings && (
                <div className="space-y-8">
                  {/* Informations générales */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom du garage
                        </label>
                        <input
                          type="text"
                          value={garageSettings.name}
                          onChange={(e) => handleSettingsChange('name', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adresse
                        </label>
                        <input
                          type="text"
                          value={garageSettings.address}
                          onChange={(e) => handleSettingsChange('address', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone de contact
                        </label>
                        <input
                          type="tel"
                          value={garageSettings.phone}
                          onChange={(e) => handleSettingsChange('phone', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="04 67 XX XX XX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email de contact
                        </label>
                        <input
                          type="email"
                          value={garageSettings.email}
                          onChange={(e) => handleSettingsChange('email', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="contact@agdemoto.fr"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Site web
                        </label>
                        <input
                          type="url"
                          value={garageSettings.website}
                          onChange={(e) => handleSettingsChange('website', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="https://www.agdemoto.fr"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={garageSettings.description}
                          onChange={(e) => handleSettingsChange('description', e.target.value)}
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Description de votre garage..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Horaires d'ouverture */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Horaires d'ouverture</h3>
                    <div className="space-y-4">
                      {Object.entries(garageSettings.business_hours).map(([day, hours]) => {
                        const dayLabels: { [key: string]: string } = {
                          monday: 'Lundi',
                          tuesday: 'Mardi',
                          wednesday: 'Mercredi',
                          thursday: 'Jeudi',
                          friday: 'Vendredi',
                          saturday: 'Samedi',
                          sunday: 'Dimanche'
                        };
                        
                        return (
                          <div key={day} className="flex items-center space-x-4">
                            <div className="w-24">
                              <span className="text-sm font-medium text-gray-700">
                                {dayLabels[day]}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={!hours.is_closed}
                                onChange={(e) => handleBusinessHoursChange(day, 'is_closed', !e.target.checked)}
                                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                              />
                              <span className="text-sm text-gray-600">Ouvert</span>
                            </div>
                            {!hours.is_closed && (
                              <>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-600">de</span>
                                  <input
                                    type="time"
                                    value={hours.open}
                                    onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                                    className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                  />
                                  <span className="text-sm text-gray-600">à</span>
                                  <input
                                    type="time"
                                    value={hours.close}
                                    onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
                                    className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                  />
                                </div>
                              </>
                            )}
                            {hours.is_closed && (
                              <span className="text-sm text-gray-500 italic">Fermé</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Réseaux sociaux */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Réseaux sociaux</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Facebook
                        </label>
                        <input
                          type="url"
                          value={garageSettings.social_media.facebook}
                          onChange={(e) => handleSettingsChange('social_media.facebook', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="https://facebook.com/agdemoto"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Instagram
                        </label>
                        <input
                          type="url"
                          value={garageSettings.social_media.instagram}
                          onChange={(e) => handleSettingsChange('social_media.instagram', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="https://instagram.com/agdemoto"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          YouTube
                        </label>
                        <input
                          type="url"
                          value={garageSettings.social_media.youtube}
                          onChange={(e) => handleSettingsChange('social_media.youtube', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="https://youtube.com/agdemoto"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          LinkedIn
                        </label>
                        <input
                          type="url"
                          value={garageSettings.social_media.linkedin}
                          onChange={(e) => handleSettingsChange('social_media.linkedin', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="https://linkedin.com/company/agdemoto"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bouton de sauvegarde */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveSettings}
                      disabled={settingsLoading}
                      className="px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {settingsLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                          Sauvegarde...
                        </div>
                      ) : (
                        'Sauvegarder les paramètres'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          

        </main>
      </div>
    </div>
  );
};

export default AdminPage;
