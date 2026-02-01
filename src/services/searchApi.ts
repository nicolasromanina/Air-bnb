import { api } from './api';

// Configuration du backend
const BACKEND_URL = 'https://airbnb-backend-l640.onrender.com/api/search';

export interface SearchApartment {
  _id?: string;
  id?: number;
  roomId?: number;
  title: string;
  description: string;
  image?: string;
  images?: string[];
  price: number;
  city?: string;
  location?: string;
  country?: string;
  guests: string;
  bedrooms: string;
  capacity?: number;
  amenities?: string[];
  availability?: boolean;
  availableFrom?: string;
  averageRating?: number;
  reviewCount?: number;
  meta?: any;
}

export interface SearchResponse {
  apartments: SearchApartment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SearchFilters {
  destination?: string;
  city?: string;
  country?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
  amenities?: string[];
  checkIn?: string;
  availableFrom?: string;
  travelers?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
}

// Fonction utilitaire pour les requêtes
const makeRequest = async <T>(
  url: string,
  method: string = 'GET',
  data?: any,
  options?: RequestInit
): Promise<T> => {
  const token = api.getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options?.headers,
  };

  const config: RequestInit = {
    method,
    headers,
    credentials: 'include',
    ...(data && { body: JSON.stringify(data) }),
    ...options,
  };

  try {
    const response = await fetch(`${BACKEND_URL}${url}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `Erreur HTTP ${response.status}: ${response.statusText}`;
      console.error(`Erreur ${method} ${url}:`, errorMessage);
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erreur ${method} ${url}:`, error);
    throw error;
  }
};

export const searchApi = {
  // Rechercher les appartements avec filtres
  async searchApartments(filters: SearchFilters): Promise<SearchResponse> {
    const params = new URLSearchParams();
    
    if (filters.destination) params.append('destination', filters.destination);
    if (filters.city) params.append('city', filters.city);
    if (filters.country) params.append('country', filters.country);
    if (filters.location) params.append('location', filters.location);
    if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.minCapacity !== undefined) params.append('minCapacity', filters.minCapacity.toString());
    if (filters.amenities && filters.amenities.length > 0) params.append('amenities', filters.amenities.join(','));
    if (filters.checkIn) params.append('checkIn', filters.checkIn);
    if (filters.availableFrom) params.append('availableFrom', filters.availableFrom);
    if (filters.travelers !== undefined) params.append('travelers', filters.travelers.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `/?${queryString}` : '/';
    
    return await makeRequest<SearchResponse>(url);
  },

  // Recherche simple par destination
  async searchByDestination(destination: string, page: number = 1, limit: number = 12): Promise<SearchResponse> {
    return this.searchApartments({
      destination,
      page,
      limit
    });
  },

  // Recherche complète avec tous les critères
  async searchWithFilters(
    destination: string,
    checkIn: string,
    travelers: number,
    page: number = 1,
    limit: number = 12
  ): Promise<SearchResponse> {
    return this.searchApartments({
      destination,
      checkIn,
      travelers,
      page,
      limit
    });
  }
};
