import { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import SectionTitle from '../components/SectionTitle';
import MotorcycleCard from '../components/MotorcycleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useMotorcycles } from '../hooks/useMotorcycles';
import { Motorcycle } from '../types/Motorcycle';

interface Filters {
  search: string;
  brand: string;
  priceMin: string;
  priceMax: string;
  yearMin: string;
  yearMax: string;
}

const MotorcyclesPage = () => {
  const { data: motorcycles = [], isLoading, error } = useMotorcycles();
  const [filters, setFilters] = useState<Filters>({
    search: '',
    brand: '',
    priceMin: '',
    priceMax: '',
    yearMin: '',
    yearMax: '',
  });

  // Get unique brands for filter - memoized
  const brands = useMemo(() => {
    if (!motorcycles?.length) return [];
    return Array.from(new Set(motorcycles.map((m: Motorcycle) => m.brand))).sort();
  }, [motorcycles]);

  // Filter motorcycles - memoized to prevent unnecessary recalculations
  const filteredMotorcycles = useMemo(() => {
    if (!motorcycles?.length) return [];

    // Start with non-sold motorcycles
    let result = motorcycles.filter((moto: Motorcycle) => !moto.is_sold);

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter((moto: Motorcycle) =>
        moto.brand.toLowerCase().includes(searchTerm) ||
        moto.model.toLowerCase().includes(searchTerm) ||
        moto.description.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by brand
    if (filters.brand) {
      result = result.filter((moto: Motorcycle) => moto.brand === filters.brand);
    }

    // Filter by price range
    if (filters.priceMin) {
      result = result.filter((moto: Motorcycle) => parseFloat(moto.price) >= parseInt(filters.priceMin));
    }
    if (filters.priceMax) {
      result = result.filter((moto: Motorcycle) => parseFloat(moto.price) <= parseInt(filters.priceMax));
    }

    // Filter by year range
    if (filters.yearMin) {
      result = result.filter((moto: Motorcycle) => moto.year >= parseInt(filters.yearMin));
    }
    if (filters.yearMax) {
      result = result.filter((moto: Motorcycle) => moto.year <= parseInt(filters.yearMax));
    }

    return result;
  }, [motorcycles, filters]);

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
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Erreur de chargement
          </h1>
          <p className="text-gray-600 mb-8">
            Impossible de charger les motos. Veuillez réessayer plus tard.
          </p>
        </div>
      </div>
    );
  }

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
                    <Search size={18} />
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
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredMotorcycles.length} moto{filteredMotorcycles.length > 1 ? 's' : ''} trouvée{filteredMotorcycles.length > 1 ? 's' : ''}
            </p>
          </div>

          {filteredMotorcycles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMotorcycles.map((motorcycle: Motorcycle) => (
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
