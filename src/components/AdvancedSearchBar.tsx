import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Users, ChevronDown } from 'lucide-react';
import { api } from '@/services/api';
import { useNavigate } from 'react-router-dom';

interface FilterOptions {
  locations: string[];
  priceRange: { minPrice: number; maxPrice: number };
  amenities: string[];
  capacityRange: { minCapacity: number; maxCapacity: number };
}

interface AdvancedSearchParams {
  location: string;
  minPrice: number;
  maxPrice: number;
  minCapacity: number;
  amenities: string[];
  sortBy: 'popularity' | 'price-low' | 'price-high' | 'rating' | 'newest';
}

export const AdvancedSearchBar: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterOptions>({
    locations: [],
    priceRange: { minPrice: 0, maxPrice: 5000 },
    amenities: [],
    capacityRange: { minCapacity: 1, maxCapacity: 10 }
  });

  const [searchParams, setSearchParams] = useState<AdvancedSearchParams>({
    location: '',
    minPrice: 0,
    maxPrice: 5000,
    minCapacity: 1,
    amenities: [],
    sortBy: 'popularity'
  });

  const [expandedFilters, setExpandedFilters] = useState({
    location: false,
    price: false,
    capacity: false,
    amenities: false,
    sort: false
  });

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await api.get('/search/filters');
        setFilters(response.data);
        setSearchParams((prev) => ({
          ...prev,
          minPrice: response.data.priceRange.minPrice,
          maxPrice: response.data.priceRange.maxPrice
        }));
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };

    fetchFilters();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchParams.location) params.append('location', searchParams.location);
    if (searchParams.minPrice) params.append('minPrice', searchParams.minPrice.toString());
    if (searchParams.maxPrice) params.append('maxPrice', searchParams.maxPrice.toString());
    if (searchParams.minCapacity) params.append('minCapacity', searchParams.minCapacity.toString());
    if (searchParams.amenities.length > 0)
      params.append('amenities', searchParams.amenities.join(','));
    params.append('sortBy', searchParams.sortBy);

    navigate(`/search?${params.toString()}`);
  };

  const toggleAmenity = (amenity: string) => {
    setSearchParams((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Your Perfect Stay</h2>

      <div className="space-y-4">
        {/* Main Search Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Location */}
          <div className="relative">
            <button
              onClick={() =>
                setExpandedFilters((prev) => ({
                  ...prev,
                  location: !prev.location
                }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left flex items-center gap-2 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <MapPin size={18} className="text-gray-600" />
              <span className="flex-1">
                {searchParams.location || 'Select location...'}
              </span>
              <ChevronDown size={18} />
            </button>

            {expandedFilters.location && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                <div className="p-2">
                  {filters.locations.map((location) => (
                    <button
                      key={location}
                      onClick={() => {
                        setSearchParams((prev) => ({
                          ...prev,
                          location
                        }));
                        setExpandedFilters((prev) => ({
                          ...prev,
                          location: false
                        }));
                      }}
                      className={`w-full text-left px-4 py-2 rounded hover:bg-gray-100 ${
                        searchParams.location === location
                          ? 'bg-blue-100 text-blue-900 font-medium'
                          : ''
                      }`}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="relative">
            <button
              onClick={() =>
                setExpandedFilters((prev) => ({
                  ...prev,
                  price: !prev.price
                }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left flex items-center gap-2 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <DollarSign size={18} className="text-gray-600" />
              <span className="flex-1">
                €{searchParams.minPrice} - €{searchParams.maxPrice}
              </span>
              <ChevronDown size={18} />
            </button>

            {expandedFilters.price && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Price: €{searchParams.minPrice}
                  </label>
                  <input
                    type="range"
                    min={filters.priceRange.minPrice}
                    max={filters.priceRange.maxPrice}
                    value={searchParams.minPrice}
                    onChange={(e) =>
                      setSearchParams((prev) => ({
                        ...prev,
                        minPrice: parseInt(e.target.value)
                      }))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Price: €{searchParams.maxPrice}
                  </label>
                  <input
                    type="range"
                    min={filters.priceRange.minPrice}
                    max={filters.priceRange.maxPrice}
                    value={searchParams.maxPrice}
                    onChange={(e) =>
                      setSearchParams((prev) => ({
                        ...prev,
                        maxPrice: parseInt(e.target.value)
                      }))
                    }
                    className="w-full"
                  />
                </div>
                <button
                  onClick={() =>
                    setExpandedFilters((prev) => ({
                      ...prev,
                      price: false
                    }))
                  }
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Capacity */}
          <div className="relative">
            <button
              onClick={() =>
                setExpandedFilters((prev) => ({
                  ...prev,
                  capacity: !prev.capacity
                }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left flex items-center gap-2 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Users size={18} className="text-gray-600" />
              <span className="flex-1">{searchParams.minCapacity}+ guests</span>
              <ChevronDown size={18} />
            </button>

            {expandedFilters.capacity && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4">
                <input
                  type="range"
                  min={filters.capacityRange.minCapacity}
                  max={filters.capacityRange.maxCapacity}
                  value={searchParams.minCapacity}
                  onChange={(e) =>
                    setSearchParams((prev) => ({
                      ...prev,
                      minCapacity: parseInt(e.target.value)
                    }))
                  }
                  className="w-full"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Minimum {searchParams.minCapacity} guest{searchParams.minCapacity > 1 ? 's' : ''}
                </p>
                <button
                  onClick={() =>
                    setExpandedFilters((prev) => ({
                      ...prev,
                      capacity: false
                    }))
                  }
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-2"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
          >
            <Search size={20} />
            Search
          </button>
        </div>

        {/* Additional Filters */}
        <div className="flex gap-2 flex-wrap">
          {/* Sort */}
          <select
            value={searchParams.sortBy}
            onChange={(e) =>
              setSearchParams((prev) => ({
                ...prev,
                sortBy: e.target.value as any
              }))
            }
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="popularity">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>

          {/* Amenities Filter */}
          <div className="relative">
            <button
              onClick={() =>
                setExpandedFilters((prev) => ({
                  ...prev,
                  amenities: !prev.amenities
                }))
              }
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Amenities ({searchParams.amenities.length})
              <ChevronDown size={16} className="inline ml-1" />
            </button>

            {expandedFilters.amenities && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4 max-w-xs grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {filters.amenities.map((amenity) => (
                  <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={searchParams.amenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchBar;
