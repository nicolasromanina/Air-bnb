import { api } from './api';

// Configuration du backend
const BACKEND_URL = 'http://api.waya2828.odns.fr/api/search';

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

  const fullUrl = `${BACKEND_URL}${url}`;
  console.log(`📡 Requête ${method}: ${fullUrl}`);
  console.log(`   Headers:`, headers);
  if (data) console.log(`   Body:`, data);

  try {
    const response = await fetch(fullUrl, config);
    
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   Headers réponse:`, response.headers);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `Erreur HTTP ${response.status}: ${response.statusText}`;
      console.error(`❌ Erreur ${method} ${url}:`, errorMessage);
      console.error(`   Données d'erreur:`, errorData);
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log(`✅ Réponse complète reçue pour ${method} ${url}`);
    return data;
  } catch (error) {
    console.error(`❌ Erreur ${method} ${url}:`, error);
    console.error(`   Type d'erreur:`, error instanceof Error ? error.constructor.name : typeof error);
    if (error instanceof Error) {
      console.error(`   Message:`, error.message);
      console.error(`   Stack:`, error.stack);
    }
    throw error;
  }
};

export const searchApi = {
  // Rechercher les appartements avec filtres
  async searchApartments(filters: SearchFilters): Promise<SearchResponse> {
    const params = new URLSearchParams();
    
    if (filters.destination) params.append('destination', filters.destination);
    // Some backends expect a `city` query parameter instead of `destination`.
    // If the caller provided `destination` but not `city`, include it as `city`
    // to maximize compatibility with different search implementations.
    if (filters.destination && !filters.city) params.append('city', filters.destination);
    if (filters.city) params.append('city', filters.city);
    if (filters.country) params.append('country', filters.country);
    if (filters.location) params.append('location', filters.location);
    if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.minCapacity !== undefined) params.append('minCapacity', filters.minCapacity.toString());
    if (filters.amenities && filters.amenities.length > 0) params.append('amenities', filters.amenities.join(','));
    if (filters.checkIn) params.append('checkIn', filters.checkIn);
    if (filters.availableFrom) params.append('availableFrom', filters.availableFrom);
    // Some backends may expect 'availableFrom' instead of 'checkIn'.
    // If only checkIn is provided, also include it as availableFrom to improve compatibility.
    if (filters.checkIn && !filters.availableFrom) params.append('availableFrom', filters.checkIn);
    if (filters.travelers !== undefined) params.append('travelers', filters.travelers.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `/?${queryString}` : '/';
    
    console.log('🌐 APPEL API RECHERCHE');
    console.log('  📍 URL complète:', `${BACKEND_URL}${url}`);
    console.log('  🔍 Filtres appliqués:', filters);
    console.log('  📋 Query string:', queryString);
    
    try {
      const response = await makeRequest<SearchResponse>(url);
      console.log('✅ Réponse API reçue:', response);
      console.log(`  📦 Nombre d'appartements retournés: ${response.apartments.length}`);
      console.log(`  📄 Pagination:`, response.pagination);
      return response;
    } catch (error) {
      console.error('❌ Erreur lors de l\'appel API de recherche:', error);
      throw error;
    }
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
