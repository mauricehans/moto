/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Lock, LogOut, Bike, Package, FileText, LayoutDashboard, Plus, Settings, ShieldAlert
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
import { getAccessToken } from '../services/adminService';
import { GarageSettings } from '../types/Admin';
type AdminUser = { id: number; username: string; email: string; is_superuser: boolean; is_active: boolean };

type TabType = 'dashboard' | 'motorcycles' | 'parts' | 'blog' | 'settings' | 'superadmin';

interface LoginCredentials {
  username: string;
  password: string;
}

const AdminPage: React.FC = () => {
  // États d'authentification
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // États de navigation
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // États pour les paramètres du garage
  const [garageSettings, setGarageSettings] = useState<GarageSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState('');

  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [canSuperAdmin, setCanSuperAdmin] = useState(false);
  const [saLoading, setSaLoading] = useState(false);
  const [saError, setSaError] = useState('');
  const [saForm, setSaForm] = useState({ email: '', username: '', password: '', is_superuser: false });

  // Hooks pour récupérer les données depuis l'API
  const { data: motorcycles = [], isLoading: motorcyclesLoading } = useMotorcycles();
  const { data: parts = [], isLoading: partsLoading } = useParts();
  const { data: blogPosts = [], isLoading: blogLoading } = useBlogPosts();
  const navigate = useNavigate();

  // Vérifier l'authentification au chargement de la page
  useEffect(() => {
    const token = getAccessToken();
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

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdmins();
    }
  }, [isAuthenticated]);

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
          monday: { is_closed: false, intervals: [{ open: '09:00', close: '18:00' }] },
          tuesday: { is_closed: false, intervals: [{ open: '09:00', close: '18:00' }] },
          wednesday: { is_closed: false, intervals: [{ open: '09:00', close: '18:00' }] },
          thursday: { is_closed: false, intervals: [{ open: '09:00', close: '18:00' }] },
          friday: { is_closed: false, intervals: [{ open: '09:00', close: '18:00' }] },
          saturday: { is_closed: false, intervals: [{ open: '09:00', close: '17:00' }] },
          sunday: { is_closed: true, intervals: [] }
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
        const sectionValue = prev[section as keyof GarageSettings];
        
        // Vérifier que la section est bien un objet avant d'utiliser le spread
        if (typeof sectionValue === 'object' && sectionValue !== null) {
          return {
            ...prev,
            [section]: {
              ...sectionValue,
              [subField]: value
            }
          };
        }
        
        // Si ce n'est pas un objet, on ne peut pas faire de spread
        return prev;
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

  const handleIntervalChange = (day: string, intervalIndex: number, field: 'open' | 'close', value: string) => {
    if (!garageSettings) return;
    
    setGarageSettings(prev => {
      if (!prev) return prev;
      
      const dayHours = prev.business_hours[day as keyof typeof prev.business_hours];
      const updatedIntervals = [...dayHours.intervals];
      updatedIntervals[intervalIndex] = {
        ...updatedIntervals[intervalIndex],
        [field]: value
      };
      
      return {
        ...prev,
        business_hours: {
          ...prev.business_hours,
          [day]: {
            ...dayHours,
            intervals: updatedIntervals
          }
        }
      };
    });
  };

  const addInterval = (day: string) => {
    if (!garageSettings) return;
    
    setGarageSettings(prev => {
      if (!prev) return prev;
      
      const dayHours = prev.business_hours[day as keyof typeof prev.business_hours];
      const newInterval = { open: '09:00', close: '18:00' };
      
      return {
        ...prev,
        business_hours: {
          ...prev.business_hours,
          [day]: {
            ...dayHours,
            intervals: [...dayHours.intervals, newInterval]
          }
        }
      };
    });
  };

  const removeInterval = (day: string, intervalIndex: number) => {
    if (!garageSettings) return;
    
    setGarageSettings(prev => {
      if (!prev) return prev;
      
      const dayHours = prev.business_hours[day as keyof typeof prev.business_hours];
      const updatedIntervals = dayHours.intervals.filter((_, index) => index !== intervalIndex);
      
      return {
        ...prev,
        business_hours: {
          ...prev.business_hours,
          [day]: {
            ...dayHours,
            intervals: updatedIntervals
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

  const fetchAdmins = async () => {
    setSaLoading(true);
    setSaError('');
    try {
      const res = await api.get('/superadmin/admins/');
      setAdmins(Array.isArray(res.data.admins) ? res.data.admins : []);
      setCanSuperAdmin(true);
    } catch (e: any) {
      setCanSuperAdmin(false);
    } finally {
      setSaLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaLoading(true);
    setSaError('');
    try {
      await api.post('/superadmin/admins/create/', saForm);
      setSaForm({ email: '', username: '', password: '', is_superuser: false });
      fetchAdmins();
    } catch (e: any) {
      setSaError(e.response?.data?.error || 'Erreur lors de la création');
    } finally {
      setSaLoading(false);
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    if (!window.confirm('Supprimer cet admin ?')) return;
    setSaLoading(true);
    setSaError('');
    try {
      await api.delete(`/superadmin/admins/${id}/`);
      setAdmins(prev => prev.filter(a => a.id !== id));
    } catch (e: any) {
      setSaError(e.response?.data?.error || 'Erreur lors de la suppression');
    } finally {
      setSaLoading(false);
    }
  };

  // Fonctions de suppression
  const handleDeleteMotorcycle = async (motorcycle: Motorcycle) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la moto ${motorcycle.brand} ${motorcycle.model} ?`)) {
      try {
        await api.delete(`/motorcycles/${motorcycle.id}/`);
        // Recharger la page pour actualiser les données
        window.location.reload();
      } catch (error) {
        alert('Erreur lors de la suppression de la moto');
      }
    }
  };

  const handleDeletePart = async (part: Part) => {
    console.log('Tentative de suppression de la pièce:', part);
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la pièce ${part.name} ?`)) {
      try {
        await api.delete(`/parts/${part.id}/`);
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
        await api.delete(`/blog/${post.id}/`);
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

  const handleLogout = () => {
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    // Nettoyer aussi les anciens tokens au cas où
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    navigate('/admin/login');
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

  const renderSuperAdminSection = () => {
    if (!isAuthenticated || !canSuperAdmin) return null;
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestion des administrateurs</h2>
          <p className="text-gray-600">Gérez les accès et les permissions</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter un administrateur</h3>
          {saError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">{saError}</div>}
          <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" 
                type="email" 
                value={saForm.email} 
                onChange={e=>setSaForm({...saForm,email:e.target.value})} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom d’utilisateur (optionnel)</label>
              <input 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" 
                type="text" 
                value={saForm.username} 
                onChange={e=>setSaForm({...saForm,username:e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <input 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" 
                type="password" 
                value={saForm.password} 
                onChange={e=>setSaForm({...saForm,password:e.target.value})} 
                required 
              />
            </div>
            <div className="flex items-center gap-2 md:pt-8">
              <input 
                id="sa_is_super" 
                type="checkbox" 
                checked={saForm.is_superuser} 
                onChange={e=>setSaForm({...saForm,is_superuser:e.target.checked})} 
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="sa_is_super" className="text-sm text-gray-700">Donner les droits superuser</label>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button 
                type="submit" 
                disabled={saLoading} 
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {saLoading ? 'Création...' : 'Créer un admin'}
              </button>
            </div>
          </form>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Liste des administrateurs</h3>
            {saLoading && admins.length === 0 ? (
              <div className="text-center py-4">Chargement...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Superuser</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actif</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {admins.map(a=> (
                      <tr key={a.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{a.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{a.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{a.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${a.is_superuser ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {a.is_superuser ? 'Oui' : 'Non'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${a.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {a.is_active ? 'Oui' : 'Non'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={()=>handleDeleteAdmin(a.id)} 
                            className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md transition-colors"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                    {admins.length===0 && (
                      <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center" colSpan={6}>Aucun admin trouvé.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

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
                { id: 'settings', label: 'Paramètres du site', icon: Settings },
                // Ajouter l'onglet Super Admin si autorisé
                ...(canSuperAdmin ? [{ id: 'superadmin', label: 'Super Admin', icon: ShieldAlert }] : [])
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
                    <div className="space-y-6">
                      {garageSettings.business_hours && typeof garageSettings.business_hours === 'object' ? (
                        Object.entries(garageSettings.business_hours).map(([day, hours]) => {
                        const dayLabels: { [key: string]: string } = {
                          monday: 'Lundi',
                          tuesday: 'Mardi',
                          wednesday: 'Mercredi',
                          thursday: 'Jeudi',
                          friday: 'Vendredi',
                          saturday: 'Samedi',
                          sunday: 'Dimanche'
                        };
                        
                        // Sécurisation de l'objet hours
                        if (!hours || typeof hours !== 'object') return null;

                        return (
                          <div key={day} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <span className="text-sm font-medium text-gray-700 w-20">
                                  {dayLabels[day]}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={!hours.is_closed}
                                    onChange={(e) => handleBusinessHoursChange(day, 'is_closed', !e.target.checked)}
                                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                  />
                                  <span className="text-sm text-gray-600">Ouvert</span>
                                </div>
                              </div>
                              {!hours.is_closed && (
                                <button
                                  type="button"
                                  onClick={() => addInterval(day)}
                                  className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                >
                                  + Ajouter un créneau
                                </button>
                              )}
                            </div>
                            
                            {hours.is_closed ? (
                              <span className="text-sm text-gray-500 italic">Fermé</span>
                            ) : (
                              <div className="space-y-2">
                                {Array.isArray(hours.intervals) ? hours.intervals.map((interval: { open: string; close: string }, index: number) => (
                                  <div key={index} className="flex items-center space-x-3">
                                    <span className="text-sm text-gray-600 w-8">#{index + 1}</span>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm text-gray-600">de</span>
                                      <input
                                        type="time"
                                        lang="fr"
                                        value={interval.open}
                                        onChange={(e) => handleIntervalChange(day, index, 'open', e.target.value)}
                                        step="60"
                                        className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                      />
                                      <span className="text-sm text-gray-600">à</span>
                                      <input
                                        type="time"
                                        lang="fr"
                                        value={interval.close}
                                        onChange={(e) => handleIntervalChange(day, index, 'close', e.target.value)}
                                        step="60"
                                        className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                      />
                                    </div>
                                    {Array.isArray(hours.intervals) && hours.intervals.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeInterval(day, index)}
                                        className="px-2 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                      >
                                        Supprimer
                                      </button>
                                    )}
                                  </div>
                                )) : <p className="text-sm text-red-500">Erreur format horaires</p>}
                                {Array.isArray(hours.intervals) && hours.intervals.length === 0 && (
                                  <p className="text-sm text-gray-500 italic">Aucun créneau défini</p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                      ) : (
                        <div className="text-center py-4 text-red-600">
                          Erreur de chargement des horaires. Veuillez contacter le support.
                        </div>
                      )}
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
          
          {activeTab === 'superadmin' && renderSuperAdminSection()}
          

        </main>
      </div>
    </div>
  );
};

export default AdminPage;
