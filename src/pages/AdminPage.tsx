/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Settings, Lock, LogOut, BarChart3, Users, 
  Bike, Package, FileText, LayoutDashboard, Search,
  TrendingUp, TrendingDown, Eye, Calendar
} from 'lucide-react';
import DataTable from '../components/DataTable';
import StatCard from '../components/StatCard';
import {
  User, Motorcycle, Part, BlogPost, GarageSettings, AdminStats,
  TabType, LoginCredentials, FormData, MotorcycleImage, PartImage
} from '../types/Admin';

const AdminPage: React.FC = () => {
  // États d'authentification
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginForm, setLoginForm] = useState<LoginCredentials>({ username: '', password: '' });
  const [loginError, setLoginError] = useState<string>('');

  // États de navigation
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // États des données
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [garageSettings, setGarageSettings] = useState<GarageSettings | null>(null);

  // États de formulaire
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Motorcycle | Part | BlogPost | User | null>(null);
  const [formData, setFormData] = useState<FormData>({});

  // Données de démonstration
  const mockMotorcycles: Motorcycle[] = [
    {
      id: '1',
      brand: 'Yamaha',
      model: 'MT-07',
      year: 2022,
      price: 6999,
      mileage: 3500,
      engine: '689 cc',
      power: 73,
      license: 'A2',
      color: 'Noir',
      description: 'Yamaha MT-07 en excellent état',
      is_sold: false,
      is_new: true,
      is_featured: true,
      images: [],
      created_at: '2023-01-15T10:00:00Z',
      updated_at: '2023-01-15T10:00:00Z'
    },
    {
      id: '2',
      brand: 'Honda',
      model: 'CB650R',
      year: 2021,
      price: 7499,
      mileage: 8200,
      engine: '649 cc',
      power: 95,
      license: 'A',
      color: 'Rouge',
      description: 'Honda CB650R Neo Sports Cafe',
      is_sold: false,
      is_new: false,
      is_featured: true,
      images: [],
      created_at: '2023-01-10T10:00:00Z',
      updated_at: '2023-01-10T10:00:00Z'
    }
  ];

  const mockStats: AdminStats = {
    total_motorcycles: 15,
    sold_motorcycles: 8,
    total_parts: 120,
    low_stock_parts: 5,
    total_blog_posts: 25,
    published_posts: 20,
    total_users: 150,
    active_users: 45,
    monthly_revenue: 85000,
    monthly_views: 12500
  };

  // Gestion de l'authentification
  const handleLogin = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    // Simulation d'authentification
    setTimeout(() => {
      if (loginForm.username === 'admin' && loginForm.password === 'gattuso2024') {
        const user: User = {
          id: '1',
          username: 'admin',
          email: 'admin@agdemoto.fr',
          role: 'admin',
          isActive: true,
          lastLogin: new Date().toISOString(),
          createdAt: '2023-01-01T00:00:00Z'
        };
        setCurrentUser(user);
        setIsAuthenticated(true);
        setLoginError('');
      } else {
        setLoginError('Nom d\'utilisateur ou mot de passe incorrect');
      }
      setLoading(false);
    }, 1000);
  }, [loginForm]);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setLoginForm({ username: '', password: '' });
    setActiveTab('dashboard');
  }, []);

  // Gestion des formulaires
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  }, []);

  const handleLoginInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Actions CRUD
  const handleEdit = useCallback((item: Motorcycle | Part | BlogPost | User) => {
    setEditingItem(item);
    setFormData({ ...item } as FormData);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback((item: Motorcycle | Part | BlogPost | User) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      // Simulation de suppression
      switch (activeTab) {
        case 'motorcycles':
          setMotorcycles(prev => prev.filter(m => m.id !== item.id));
          break;
        case 'parts':
          setParts(prev => prev.filter(p => p.id !== item.id));
          break;
        case 'blog':
          setBlogPosts(prev => prev.filter(b => b.id !== item.id));
          break;
        case 'users':
          setUsers(prev => prev.filter(u => u.id !== item.id));
          break;
      }
    }
  }, [activeTab]);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulation de sauvegarde
    console.log('Saving:', formData);
    setShowForm(false);
    setEditingItem(null);
    setFormData({});
  }, [formData]);

  const resetForm = useCallback(() => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({});
  }, []);

  // Définition des colonnes pour les tables
  const motorcycleColumns = [
    {
      key: 'brand' as keyof Motorcycle,
      label: 'Marque',
      render: (value: Motorcycle[keyof Motorcycle], item: Motorcycle) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
          <div>
            <p className="font-medium">{item.brand} {item.model}</p>
            <p className="text-sm text-gray-500">{item.engine}</p>
          </div>
        </div>
      )
    },
    {
      key: 'year' as keyof Motorcycle,
      label: 'Année'
    },
    {
      key: 'price' as keyof Motorcycle,
      label: 'Prix',
      render: (value: Motorcycle[keyof Motorcycle]) => `${Number(value).toLocaleString('fr-FR')} €`
    },
    {
      key: 'is_sold' as keyof Motorcycle,
      label: 'Statut',
      render: (value: Motorcycle[keyof Motorcycle], item: Motorcycle) => (
        <div className="flex flex-col space-y-1">
          {item.is_sold && <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Vendue</span>}
          {item.is_new && <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Nouvelle</span>}
          {item.is_featured && <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">À la une</span>}
        </div>
      )
    }
  ];

  // Initialisation des données
  useEffect(() => {
    if (isAuthenticated) {
      setMotorcycles(mockMotorcycles);
      setAdminStats(mockStats);
    }
  }, [isAuthenticated]);

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
                    {currentUser?.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{currentUser?.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{currentUser?.role}</p>
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
                { id: 'blog', label: 'Blog', icon: FileText },
                { id: 'users', label: 'Utilisateurs', icon: Users },
                { id: 'analytics', label: 'Analytiques', icon: BarChart3 },
                { id: 'settings', label: 'Paramètres', icon: Settings }
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

              {/* Statistiques */}
              {adminStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Motos en stock"
                    value={adminStats.total_motorcycles - adminStats.sold_motorcycles}
                    icon={Bike}
                    trend={{ value: 12, isPositive: true }}
                    color="blue"
                  />
                  <StatCard
                    title="Motos vendues ce mois"
                    value={adminStats.sold_motorcycles}
                    icon={TrendingUp}
                    trend={{ value: 8, isPositive: true }}
                    color="green"
                  />
                  <StatCard
                    title="Articles de blog"
                    value={adminStats.published_posts}
                    icon={FileText}
                    color="purple"
                  />
                  <StatCard
                    title="Chiffre d'affaires"
                    value={`${adminStats.monthly_revenue.toLocaleString('fr-FR')} €`}
                    icon={BarChart3}
                    trend={{ value: 15, isPositive: true }}
                    color="green"
                  />
                </div>
              )}

              {/* Actions rapides */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => {
                      setActiveTab('motorcycles');
                      setShowForm(true);
                    }}
                    className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Plus size={20} className="text-blue-600 mr-3" />
                    <span className="text-blue-600 font-medium">Ajouter une moto</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('parts');
                      setShowForm(true);
                    }}
                    className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Plus size={20} className="text-green-600 mr-3" />
                    <span className="text-green-600 font-medium">Ajouter une pièce</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('blog');
                      setShowForm(true);
                    }}
                    className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <Plus size={20} className="text-purple-600 mr-3" />
                    <span className="text-purple-600 font-medium">Nouvel article</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'motorcycles' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Gestion des motos</h2>
                  <p className="text-gray-600">Gérez votre stock de motos</p>
                </div>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <Plus size={20} className="mr-2" />
                    Ajouter une moto
                  </button>
                )}
              </div>

              {showForm ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-6">
                    {editingItem ? 'Modifier la moto' : 'Ajouter une nouvelle moto'}
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Marque *
                        </label>
                        <input
                          type="text"
                          name="brand"
                          value={String(formData.brand || '')}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Modèle *
                        </label>
                        <input
                          type="text"
                          name="model"
                          value={String(formData.model || '')}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Année *
                        </label>
                        <input
                          type="number"
                          name="year"
                          value={Number(formData.year || '')}
                          onChange={handleInputChange}
                          required
                          min="1900"
                          max={new Date().getFullYear() + 1}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prix (€) *
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={Number(formData.price || '')}
                          onChange={handleInputChange}
                          required
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kilométrage *
                        </label>
                        <input
                          type="number"
                          name="mileage"
                          value={Number(formData.mileage || '')}
                          onChange={handleInputChange}
                          required
                          min="0"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Permis requis *
                        </label>
                        <select
                          name="license"
                          value={String(formData.license || '')}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="">Sélectionner</option>
                          <option value="A1">A1</option>
                          <option value="A2">A2</option>
                          <option value="A">A</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={String(formData.description || '')}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div className="flex items-center space-x-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="is_new"
                          checked={Boolean(formData.is_new)}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Moto neuve
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="is_featured"
                          checked={Boolean(formData.is_featured)}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        À la une
                      </label>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        {editingItem ? 'Modifier' : 'Ajouter'}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <DataTable
                    data={motorcycles}
                    columns={motorcycleColumns}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loading}
                    emptyMessage="Aucune moto trouvée"
                  />
                </div>
              )}
            </div>
          )}

          {/* Autres onglets peuvent être ajoutés de manière similaire */}
          
          {activeTab !== 'dashboard' && activeTab !== 'motorcycles' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {activeTab === 'parts' && 'Gestion des pièces détachées'}
                {activeTab === 'blog' && 'Gestion du blog'}
                {activeTab === 'users' && 'Gestion des utilisateurs'}
                {activeTab === 'analytics' && 'Analytiques'}
                {activeTab === 'settings' && 'Paramètres'}
              </h2>
              <p className="text-gray-600">
                Cette section sera développée prochainement avec les mêmes standards de qualité.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
