/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Lock, LogOut, Bike, Package, FileText, LayoutDashboard
} from 'lucide-react';
import DataTable, { type Column } from '../components/DataTable';
import { useMotorcycles } from '../hooks/useMotorcycles';
import { useParts } from '../hooks/useParts';
import { useBlogPosts } from '../hooks/useBlog';
import { Motorcycle } from '../types/Motorcycle';
import { Part } from '../types/Part';
import type { Post } from '../types/Blog';

type TabType = 'dashboard' | 'motorcycles' | 'parts' | 'blog';

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

  // Hooks pour récupérer les données depuis l'API
  const { data: motorcycles = [], isLoading: motorcyclesLoading } = useMotorcycles();
  const { data: parts = [], isLoading: partsLoading } = useParts();
  const { data: blogPosts = [], isLoading: blogLoading } = useBlogPosts();

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
    { key: 'name' as keyof Part, label: 'Nom' },
    { key: 'category' as keyof Part, label: 'Catégorie' },
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

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Démo: admin / gattuso2024
            </p>
          </div>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
              <p className="text-gray-600">Agde Moto Gattuso</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      A
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Admin</p>
                    <p className="text-xs text-gray-500 capitalize">Administrateur</p>
                  </div>
                </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-red-600 transition-colors"
                title="Se déconnecter"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6">
            <div className="space-y-2">
              {[
                { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
                { id: 'motorcycles', label: 'Motos', icon: Bike },
                { id: 'parts', label: 'Pièces détachées', icon: Package },
                { id: 'blog', label: 'Blog', icon: FileText }
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
                {motorcyclesLoading && (
                  <div className="text-gray-500">Chargement...</div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <DataTable
                  data={motorcycles}
                  columns={motorcycleColumns}
                  loading={motorcyclesLoading}
                  emptyMessage="Aucune moto trouvée"
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
                {partsLoading && (
                  <div className="text-gray-500">Chargement...</div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <DataTable
                  data={parts}
                  columns={partColumns}
                  loading={partsLoading}
                  emptyMessage="Aucune pièce trouvée"
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
                {blogLoading && (
                  <div className="text-gray-500">Chargement...</div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <DataTable
                  data={blogPosts}
                  columns={blogColumns}
                  loading={blogLoading}
                  emptyMessage="Aucun article trouvé"
                />
              </div>
            </div>
          )}
          

        </main>
      </div>
    </div>
  );
};

export default AdminPage;
