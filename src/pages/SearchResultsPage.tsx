import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader, Star, MapPin } from 'lucide-react';
import { api } from '@/services/api';
import { AdvancedSearchBar } from '@/components/AdvancedSearchBar';

interface Apartment {
  _id: string;
  roomId: number;
  title: string;
  price: number;
  city: string;
  images: string[];
  guests: string;
  bedrooms: string;
  averageRating: number;
  reviewCount: number;
}

interface SearchResponse {
  apartments: Apartment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const SearchResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<Apartment[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(searchParams);
        params.set('page', currentPage.toString());

        const response = await api.get<SearchResponse>('/search', {
          params: Object.fromEntries(params)
        });

        setResults(response.data.apartments);
        setPagination(response.data.pagination);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch search results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams, currentPage]);

  const handleApartmentClick = (roomId: number) => {
    navigate(`/apartment/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="sticky top-0 bg-white shadow-sm z-10 py-4">
        <div className="max-w-6xl mx-auto px-4">
          <AdvancedSearchBar />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
          {pagination && (
            <p className="text-gray-600">
              Found {pagination.total} properties
              {searchParams.get('location') && ` in ${searchParams.get('location')}`}
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin" size={40} />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
            {error}
          </div>
        )}

        {/* No Results */}
        {!loading && results.length === 0 && !error && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No properties found matching your criteria.</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search parameters.</p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && results.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {results.map((apartment) => (
                <div
                  key={apartment._id}
                  onClick={() => handleApartmentClick(apartment.roomId)}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-64 bg-gray-200 overflow-hidden">
                    {apartment.images && apartment.images.length > 0 ? (
                      <img
                        src={apartment.images[0]}
                        alt={apartment.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300">
                        <span className="text-gray-500">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{apartment.title}</h3>
                        <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                          <MapPin size={14} />
                          {apartment.city}
                        </div>
                      </div>
                      {apartment.averageRating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star size={16} className="fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-sm">
                            {apartment.averageRating.toFixed(1)}
                          </span>
                          <span className="text-gray-600 text-xs">
                            ({apartment.reviewCount})
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="text-sm text-gray-600 mb-4">
                      <p>{apartment.guests} • {apartment.bedrooms}</p>
                    </div>

                    {/* Price */}
                    <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">€{apartment.price}</span>
                        <span className="text-gray-600 text-sm">/night</span>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
