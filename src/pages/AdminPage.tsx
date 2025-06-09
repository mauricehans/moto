import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Settings, Clock, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import { motorcycles } from '../data/motorcycles';
import { Motorcycle } from '../types/Motorcycle';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  image: string;
  isPublished: boolean;
  createdAt: string;
}

interface Part {
  id: string;
  name: string;
  category: string;
  brand: string;
  compatibleModels: string;
  price: number;
  stock: number;
  description: string;
  image: string;
}

interface SocialMedia {
  facebook: string;
  instagram: string;
  youtube: string;
}

interface GarageInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  socialMedia: SocialMedia;
  hours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
}

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<'motorcycles' | 'parts' | 'blog' | 'settings'>('motorcycles');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Sample data
  const [adminMotorcycles, setAdminMotorcycles] = useState<Motorcycle[]>(motorcycles);
  const [parts, setParts] = useState<Part[]>([
    {
      id: '1',
      name: 'Pot d\'échappement Akrapovic',
      category: 'Échappement',
      brand: 'Akrapovic',
      compatibleModels: 'Yamaha MT-07, MT-09',
      price: 450,
      stock: 3,
      description: 'Pot d\'échappement sport en titane',
      image: 'https://images.pexels.com/photos/2539322/pexels-photo-2539322.jpeg'
    }
  ]);
  
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'Les meilleures motos pour débuter',
      content: 'Contenu de l\'article...',
      category: 'Conseils',
      image: 'https://images.pexels.com/photos/2519374/pexels-photo-2519374.jpeg',
      isPublished: true,
      createdAt: '2023-06-01'
    }
  ]);

  const [garageInfo, setGarageInfo] = useState<GarageInfo>({
    name: 'Agde Moto Gattuso',
    address: '123 Avenue de la Plage, 34300 Agde, France',
    phone: '+33 4 67 12 34 56',
    email: 'contact@agdemoto.fr',
    socialMedia: {
      facebook: 'https://facebook.com/agdemotogattuso',
      instagram: 'https://instagram.com/agdemotogattuso',
      youtube: 'https://youtube.com/@agdemotogattuso'
    },
    hours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '17:00', closed: false },
      sunday: { open: '09:00', close: '17:00', closed: true }
    }
  });

  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = (id: string, type: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      switch (type) {
        case 'motorcycle':
          setAdminMotorcycles(prev => prev.filter(m => m.id !== id));
          break;
        case 'part':
          setParts(prev => prev.filter(p => p.id !== id));
          break;
        case 'blog':
          setBlogPosts(prev => prev.filter(b => b.id !== id));
          break;
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      // Update existing item
      switch (activeTab) {
        case 'motorcycles':
          setAdminMotorcycles(prev => prev.map(m => m.id === editingItem.id ? { ...formData } : m));
          break;
        case 'parts':
          setParts(prev => prev.map(p => p.id === editingItem.id ? { ...formData } : p));
          break;
        case 'blog':
          setBlogPosts(prev => prev.map(b => b.id === editingItem.id ? { ...formData } : b));
          break;
      }
    } else {
      // Create new item
      const newItem = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      switch (activeTab) {
        case 'motorcycles':
          setAdminMotorcycles(prev => [...prev, newItem]);
          break;
        case 'parts':
          setParts(prev => [...prev, newItem]);
          break;
        case 'blog':
          setBlogPosts(prev => [...prev, newItem]);
          break;
      }
    }
    
    setShowForm(false);
    setEditingItem(null);
    setFormData({});
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleGarageInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGarageInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGarageInfo(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [name]: value
      }
    }));
  };

  const handleHoursChange = (day: string, field: string, value: string | boolean) => {
    setGarageInfo(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: {
          ...prev.hours[day as keyof typeof prev.hours],
          [field]: value
        }
      }
    }));
  };

  const saveSocialMedia = () => {
    alert('Liens des réseaux sociaux sauvegardés !');
  };

  const saveGarageInfo = () => {
    alert('Informations du garage sauvegardées !');
  };

  const saveHours = () => {
    alert('Horaires sauvegardés !');
  };

  const renderMotorcycleForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
          <input
            type="text"
            name="brand"
            value={formData.brand || ''}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
          <input
            type="text"
            name="model"
            value={formData.model || ''}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
          <input
            type="number"
            name="year"
            value={formData.year || ''}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
          <input
            type="number"
            name="price"
            value={formData.price || ''}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kilométrage</label>
          <input
            type="number"
            name="mileage"
            value={formData.mileage || ''}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cylindrée</label>
          <input
            type="text"
            name="engine"
            value={formData.engine || ''}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Puissance (ch)</label>
          <input
            type="number"
            name="power"
            value={formData.power || ''}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Permis requis</label>
          <select
            name="license"
            value={formData.license || ''}
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
          <input
            type="text"
            name="color"
            value={formData.color || ''}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleInputChange}
          rows={4}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image principale</label>
        <input
          type="url"
          name="mainImage"
          value={formData.mainImage || ''}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="isNew"
            checked={formData.isNew || false}
            onChange={handleInputChange}
            className="mr-2"
          />
          Nouveau
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured || false}
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
          <Save size={18} className="inline mr-2" />
          {editingItem ? 'Modifier' : 'Créer'}
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
        >
          <X size={18} className="inline mr-2" />
          Annuler
        </button>
      </div>
    </form>
  );

  const renderPartForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la pièce</label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
          <select
            name="category"
            value={formData.category || ''}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Sélectionner</option>
            <option value="Échappement">Échappement</option>
            <option value="Freinage">Freinage</option>
            <option value="Suspension">Suspension</option>
            <option value="Carrosserie">Carrosserie</option>
            <option value="Moteur">Moteur</option>
            <option value="Électrique">Électrique</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
          <input
            type="text"
            name="brand"
            value={formData.brand || ''}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
          <input
            type="number"
            name="price"
            value={formData.price || ''}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock || ''}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Modèles compatibles</label>
        <input
          type="text"
          name="compatibleModels"
          value={formData.compatibleModels || ''}
          onChange={handleInputChange}
          placeholder="Ex: Yamaha MT-07, Honda CB650R"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleInputChange}
          rows={4}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image</label>
        <input
          type="url"
          name="image"
          value={formData.image || ''}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <Save size={18} className="inline mr-2" />
          {editingItem ? 'Modifier' : 'Créer'}
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
        >
          <X size={18} className="inline mr-2" />
          Annuler
        </button>
      </div>
    </form>
  );

  const renderBlogForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
        <input
          type="text"
          name="title"
          value={formData.title || ''}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
        <select
          name="category"
          value={formData.category || ''}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">Sélectionner</option>
          <option value="Conseils">Conseils</option>
          <option value="Actualités">Actualités</option>
          <option value="Tests">Tests</option>
          <option value="Entretien">Entretien</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
        <textarea
          name="content"
          value={formData.content || ''}
          onChange={handleInputChange}
          rows={10}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image</label>
        <input
          type="url"
          name="image"
          value={formData.image || ''}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="isPublished"
            checked={formData.isPublished || false}
            onChange={handleInputChange}
            className="mr-2"
          />
          Publié
        </label>
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <Save size={18} className="inline mr-2" />
          {editingItem ? 'Modifier' : 'Créer'}
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
        >
          <X size={18} className="inline mr-2" />
          Annuler
        </button>
      </div>
    </form>
  );

  const renderSettingsForm = () => (
    <div className="space-y-8">
      {/* Informations du garage */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Informations du garage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail size={16} className="inline mr-1" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={garageInfo.email}
              onChange={handleGarageInfoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Phone size={16} className="inline mr-1" />
              Téléphone
            </label>
            <input
              type="tel"
              name="phone"
              value={garageInfo.phone}
              onChange={handleGarageInfoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin size={16} className="inline mr-1" />
            Adresse
          </label>
          <input
            type="text"
            name="address"
            value={garageInfo.address}
            onChange={handleGarageInfoChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <button
          onClick={saveGarageInfo}
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <Save size={18} className="inline mr-2" />
          Sauvegarder les informations
        </button>
      </div>

      {/* Réseaux sociaux */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Réseaux sociaux</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Facebook size={16} className="inline mr-1 text-blue-600" />
              Facebook
            </label>
            <input
              type="url"
              name="facebook"
              value={garageInfo.socialMedia.facebook}
              onChange={handleSocialMediaChange}
              placeholder="https://facebook.com/votrepage"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Instagram size={16} className="inline mr-1 text-pink-600" />
              Instagram
            </label>
            <input
              type="url"
              name="instagram"
              value={garageInfo.socialMedia.instagram}
              onChange={handleSocialMediaChange}
              placeholder="https://instagram.com/votrepage"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Youtube size={16} className="inline mr-1 text-red-600" />
              YouTube
            </label>
            <input
              type="url"
              name="youtube"
              value={garageInfo.socialMedia.youtube}
              onChange={handleSocialMediaChange}
              placeholder="https://youtube.com/@votrepage"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
        <button
          onClick={saveSocialMedia}
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <Save size={18} className="inline mr-2" />
          Sauvegarder les réseaux sociaux
        </button>
      </div>

      {/* Horaires d'ouverture */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">
          <Clock size={20} className="inline mr-2" />
          Horaires d'ouverture
        </h3>
        <div className="space-y-4">
          {Object.entries(garageInfo.hours).map(([day, hours]) => (
            <div key={day} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="font-medium capitalize">
                {day === 'monday' && 'Lundi'}
                {day === 'tuesday' && 'Mardi'}
                {day === 'wednesday' && 'Mercredi'}
                {day === 'thursday' && 'Jeudi'}
                {day === 'friday' && 'Vendredi'}
                {day === 'saturday' && 'Samedi'}
                {day === 'sunday' && 'Dimanche'}
              </div>
              <div>
                <input
                  type="time"
                  value={hours.open}
                  onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                  disabled={hours.closed}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <input
                  type="time"
                  value={hours.close}
                  onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                  disabled={hours.closed}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={hours.closed}
                    onChange={(e) => handleHoursChange(day, 'closed', e.target.checked)}
                    className="mr-2"
                  />
                  Fermé
                </label>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={saveHours}
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <Save size={18} className="inline mr-2" />
          Sauvegarder les horaires
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Administration"
          subtitle="Gérez votre garage, vos motos, pièces détachées et articles de blog"
        />

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('motorcycles')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'motorcycles'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Motos ({adminMotorcycles.length})
              </button>
              <button
                onClick={() => setActiveTab('parts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'parts'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Pièces détachées ({parts.length})
              </button>
              <button
                onClick={() => setActiveTab('blog')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'blog'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Blog ({blogPosts.length})
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Settings size={16} className="inline mr-1" />
                Paramètres
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab !== 'settings' && !showForm && (
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {activeTab === 'motorcycles' && 'Gestion des motos'}
                  {activeTab === 'parts' && 'Gestion des pièces détachées'}
                  {activeTab === 'blog' && 'Gestion du blog'}
                </h2>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <Plus size={18} className="inline mr-2" />
                  Ajouter
                </button>
              </div>
            )}

            {showForm ? (
              <div>
                <h3 className="text-lg font-semibold mb-6">
                  {editingItem ? 'Modifier' : 'Créer'} {
                    activeTab === 'motorcycles' ? 'une moto' :
                    activeTab === 'parts' ? 'une pièce détachée' :
                    'un article'
                  }
                </h3>
                {activeTab === 'motorcycles' && renderMotorcycleForm()}
                {activeTab === 'parts' && renderPartForm()}
                {activeTab === 'blog' && renderBlogForm()}
              </div>
            ) : activeTab === 'settings' ? (
              renderSettingsForm()
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {activeTab === 'motorcycles' && (
                        <>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moto</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Année</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </>
                      )}
                      {activeTab === 'parts' && (
                        <>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pièce</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </>
                      )}
                      {activeTab === 'blog' && (
                        <>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activeTab === 'motorcycles' && adminMotorcycles.map((motorcycle) => (
                      <tr key={motorcycle.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img className="h-10 w-10 rounded-full object-cover" src={motorcycle.images[0]} alt="" />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{motorcycle.brand} {motorcycle.model}</div>
                              <div className="text-sm text-gray-500">{motorcycle.engine}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{motorcycle.price.toLocaleString()} €</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{motorcycle.year}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-1">
                            {motorcycle.isNew && <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Nouveau</span>}
                            {motorcycle.isFeatured && <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">À la une</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(motorcycle)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(motorcycle.id, 'motorcycle')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {activeTab === 'parts' && parts.map((part) => (
                      <tr key={part.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img className="h-10 w-10 rounded-full object-cover" src={part.image} alt="" />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{part.name}</div>
                              <div className="text-sm text-gray-500">{part.brand}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{part.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{part.price} €</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{part.stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(part)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(part.id, 'part')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {activeTab === 'blog' && blogPosts.map((post) => (
                      <tr key={post.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img className="h-10 w-10 rounded-full object-cover" src={post.image} alt="" />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{post.title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.createdAt}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded ${
                            post.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {post.isPublished ? 'Publié' : 'Brouillon'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(post)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id, 'blog')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;