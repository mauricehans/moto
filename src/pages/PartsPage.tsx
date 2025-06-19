import { useState, useEffect } from 'react';
import { SearchIcon } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import SectionTitle from '../components/SectionTitle';
import PartCard from '../components/PartCard';
import { parts, categories, brands } from '../data/parts';
import { Part } from '../types/Part';

const PartsPage = () => {
  const [filteredParts, setFilteredParts] = useState<Part[]>(parts.filter(p => p.isAvailable));
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    brand: '',
    condition: '',
    priceMin: '',
    priceMax: '',
    inStock: false,
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      brand: '',
      condition: '',
      priceMin: '',
      priceMax: '',
      inStock: false,
    });
  };

  useEffect(() => {
    let result = parts.filter(part => part.isAvailable);

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(part => 
        part.name.toLowerCase().includes(searchTerm) || 
        part.brand.toLowerCase().includes(searchTerm) ||
        part.compatibleModels.toLowerCase().includes(searchTerm) ||
        part.description.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by category
    if (filters.category) {
      result = result.filter(part => part.category === filters.category);
    }

    // Filter by brand
    if (filters.brand) {
      result = result.filter(part => part.brand === filters.brand);
    }

    // Filter by condition
    if (filters.condition) {
      result = result.filter(part => part.condition === filters.condition);
    }

    // Filter by price range
    if (filters.priceMin) {
      result = result.filter(part => part.price >= parseInt(filters.priceMin));
    }
    if (filters.priceMax) {
      result = result.filter(part => part.price <= parseInt(filters.priceMax));
    }

    // Filter by stock availability
    if (filters.inStock) {
      result = result.filter(part => part.stock > 0);
    }

    setFilteredParts(result);
  }, [filters]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <HeroSection
        title="Pièces Détachées"
        subtitle="Découvrez notre large sélection de pièces détachées de qualité pour votre moto"
        backgroundImage="https://images.pexels.com/photos/8985454/pexels-photo-8985454.jpeg"
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="Catalogue de Pièces"
            subtitle="Trouvez les pièces qu'il vous faut pour votre moto"
          />

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Search */}
              <div className="relative">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Recherche
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Nom, marque, modèle compatible..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <SearchIcon size={18} />
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  id="category"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand */}
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                  Marque
                </label>
                <select
                  id="brand"
                  name="brand"
                  value={filters.brand}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Toutes les marques</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {/* Condition */}
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                  État
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={filters.condition}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Tous les états</option>
                  <option value="new">Neuf</option>
                  <option value="used_excellent">Occasion - Excellent</option>
                  <option value="used_good">Occasion - Bon état</option>
                  <option value="used_fair">Occasion - État correct</option>
                  <option value="refurbished">Reconditionné</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label htmlFor="priceMin" className="block text-sm font-medium text-gray-700 mb-1">
                  Prix min (€)
                </label>
                <input
                  type="number"
                  id="priceMin"
                  name="priceMin"
                  value={filters.priceMin}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label htmlFor="priceMax" className="block text-sm font-medium text-gray-700 mb-1">
                  Prix max (€)
                </label>
                <input
                  type="number"
                  id="priceMax"
                  name="priceMax"
                  value={filters.priceMax}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Stock filter */}
              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={filters.inStock}
                    onChange={handleFilterChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">En stock uniquement</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={resetFilters}
                className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors duration-300"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredParts.length} pièce{filteredParts.length > 1 ? 's' : ''} trouvée{filteredParts.length > 1 ? 's' : ''}
            </p>
          </div>

          {filteredParts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredParts.map((part) => (
                <PartCard key={part.id} part={part} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">
                Aucune pièce ne correspond à vos critères de recherche.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors duration-300"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PartsPage;