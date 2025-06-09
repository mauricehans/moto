import { useState, useEffect } from 'react';
import { SearchIcon } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import SectionTitle from '../components/SectionTitle';
import MotorcycleCard from '../components/MotorcycleCard';
import { motorcycles } from '../data/motorcycles';
import { Motorcycle } from '../types/Motorcycle';

const MotorcyclesPage = () => {
  const [filteredMotorcycles, setFilteredMotorcycles] = useState<Motorcycle[]>(motorcycles);
  const [filters, setFilters] = useState({
    search: '',
    brand: '',
    priceMin: '',
    priceMax: '',
    yearMin: '',
    yearMax: '',
  });

  // Get unique brands for filter
  const brands = Array.from(new Set(motorcycles.map(m => m.brand))).sort();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      brand: '',
      priceMin: '',
      priceMax: '',
      yearMin: '',
      yearMax: '',
    });
  };

  useEffect(() => {
    let result = motorcycles;

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(moto => 
        moto.brand.toLowerCase().includes(searchTerm) || 
        moto.model.toLowerCase().includes(searchTerm) ||
        moto.description.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by brand
    if (filters.brand) {
      result = result.filter(moto => moto.brand === filters.brand);
    }

    // Filter by price range
    if (filters.priceMin) {
      result = result.filter(moto => moto.price >= parseInt(filters.priceMin));
    }
    if (filters.priceMax) {
      result = result.filter(moto => moto.price <= parseInt(filters.priceMax));
    }

    // Filter by year range
    if (filters.yearMin) {
      result = result.filter(moto => moto.year >= parseInt(filters.yearMin));
    }
    if (filters.yearMax) {
      result = result.filter(moto => moto.year <= parseInt(filters.yearMax));
    }

    setFilteredMotorcycles(result);
  }, [filters]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <HeroSection
        title="Nos Motos à Vendre"
        subtitle="Découvrez notre sélection de motos d'occasion premium, toutes soigneusement entretenues et garanties."
        backgroundImage="https://images.pexels.com/photos/1715193/pexels-photo-1715193.jpeg"
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="Toutes nos motos"
            subtitle="Trouvez la moto de vos rêves parmi notre sélection"
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
                    placeholder="Marque, modèle..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <SearchIcon size={18} />
                  </div>
                </div>
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

              {/* Price Range */}
              <div className="grid grid-cols-2 gap-4">
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
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Year Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="yearMin" className="block text-sm font-medium text-gray-700 mb-1">
                    Année min
                  </label>
                  <input
                    type="number"
                    id="yearMin"
                    name="yearMin"
                    value={filters.yearMin}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label htmlFor="yearMax" className="block text-sm font-medium text-gray-700 mb-1">
                    Année max
                  </label>
                  <input
                    type="number"
                    id="yearMax"
                    name="yearMax"
                    value={filters.yearMax}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="md:col-span-2 flex items-end justify-end">
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors duration-300"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          {filteredMotorcycles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMotorcycles.map((motorcycle) => (
                <MotorcycleCard key={motorcycle.id} motorcycle={motorcycle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">
                Aucune moto ne correspond à vos critères de recherche.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors duration-300"
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

export default MotorcyclesPage;