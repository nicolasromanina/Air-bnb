import { api } from './api';

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

export interface DestinationSuggestions {
  cities: string[];
  countries: string[];
  locations: string[];
  priceRange: {
    minPrice: number;
    maxPrice: number;
  };
  amenities: string[];
  capacityRange: {
    minCapacity: number;
    maxCapacity: number;
  };
}

export const searchApi = {
  // Rechercher les appartements avec filtres
  async searchApartments(filters: SearchFilters): Promise<SearchResponse> {
    console.log('🌐 APPEL API RECHERCHE');
    console.log('  🔍 Filtres appliqués:', filters);
    
    try {
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
      const url = `/search${queryString ? `?${queryString}` : ''}`;
      
      console.log('  📍 URL:', url);
      console.log('  📋 Query string:', queryString);
      
      const response = await api.get<SearchResponse>(url);
      
      if (response.success) {
        console.log('✅ Réponse API reçue:', {
          appartements: response.data?.apartments?.length || 0,
          pagination: response.data?.pagination
        });
        return response.data!;
      }
      
      throw new Error(response.error || 'Erreur lors de la recherche');
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
  },

  // Récupérer les suggestions de destinations
  async getDestinationSuggestions(): Promise<DestinationSuggestions> {
    try {
      const response = await api.get<DestinationSuggestions>('/search/filters');
      if (response.success) {
        return response.data!;
      }
      // Retourner des valeurs par défaut en cas d'erreur
      return {
        cities: [],
        countries: [],
        locations: [],
        priceRange: { minPrice: 0, maxPrice: 1000 },
        amenities: [],
        capacityRange: { minCapacity: 1, maxCapacity: 10 }
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des suggestions:', error);
      return {
        cities: [],
        countries: [],
        locations: [],
        priceRange: { minPrice: 0, maxPrice: 1000 },
        amenities: [],
        capacityRange: { minCapacity: 1, maxCapacity: 10 }
      };
    }
  },

  // Récupérer uniquement les villes
  async getCities(): Promise<string[]> {
    try {
      const suggestions = await this.getDestinationSuggestions();
      return suggestions.cities;
    } catch (error) {
      console.error('Erreur lors de la récupération des villes:', error);
      return [];
    }
  },

  // Récupérer uniquement les pays
  async getCountries(): Promise<string[]> {
    try {
      const suggestions = await this.getDestinationSuggestions();
      return suggestions.countries;
    } catch (error) {
      console.error('Erreur lors de la récupération des pays:', error);
      return [];
    }
  },

  // Récupérer uniquement les lieux/locations
  async getLocations(): Promise<string[]> {
    try {
      const suggestions = await this.getDestinationSuggestions();
      return suggestions.locations;
    } catch (error) {
      console.error('Erreur lors de la récupération des lieux:', error);
      return [];
    }
  },

  // Combiner cities, countries et locations pour les suggestions de destination
  async getAllDestinationOptions(): Promise<string[]> {
    try {
      const suggestions = await this.getDestinationSuggestions();
      const allOptions = [
        ...new Set([
          ...suggestions.cities,
          ...suggestions.countries,
          ...suggestions.locations
        ])
      ];
      return allOptions.sort();
    } catch (error) {
      console.error('Erreur lors de la récupération des options de destination:', error);
      return [];
    }
  },

  // Rechercher les appartements disponibles pour des dates spécifiques
  async searchAvailableApartments(
    checkIn: string,
    checkOut: string,
    filters?: Omit<SearchFilters, 'checkIn'>
  ): Promise<SearchResponse> {
    return this.searchApartments({
      ...filters,
      checkIn
    });
  },

  // Obtenir les appartements les plus populaires
  async getPopularApartments(limit: number = 6): Promise<SearchApartment[]> {
    try {
      const response = await this.searchApartments({
        sortBy: 'popularity',
        limit
      });
      return response.apartments;
    } catch (error) {
      console.error('Erreur lors de la récupération des appartements populaires:', error);
      return [];
    }
  },

  // Obtenir les appartements récemment ajoutés
  async getRecentApartments(limit: number = 6): Promise<SearchApartment[]> {
    try {
      const response = await this.searchApartments({
        sortBy: 'recent',
        limit
      });
      return response.apartments;
    } catch (error) {
      console.error('Erreur lors de la récupération des appartements récents:', error);
      return [];
    }
  },

  // Obtenir les appartements avec les meilleures notes
  async getTopRatedApartments(limit: number = 6): Promise<SearchApartment[]> {
    try {
      const response = await this.searchApartments({
        sortBy: 'rating',
        limit
      });
      return response.apartments;
    } catch (error) {
      console.error('Erreur lors de la récupération des appartements les mieux notés:', error);
      return [];
    }
  },

  // Recherche rapide (pour la barre de recherche)
  async quickSearch(query: string, limit: number = 10): Promise<SearchApartment[]> {
    try {
      const response = await this.searchApartments({
        destination: query,
        limit
      });
      return response.apartments;
    } catch (error) {
      console.error('Erreur lors de la recherche rapide:', error);
      return [];
    }
  },

  // Obtenir les détails complets d'un appartement
  async getApartmentDetails(apartmentId: number): Promise<SearchApartment | null> {
    try {
      const response = await api.get<SearchApartment>(`/search/${apartmentId}`);
      if (response.success) {
        return response.data!;
      }
      return null;
    } catch (error) {
      console.error(`Erreur lors de la récupération des détails de l'appartement ${apartmentId}:`, error);
      return null;
    }
  },

  // Obtenir les appartements similaires
  async getSimilarApartments(apartmentId: number, limit: number = 4): Promise<SearchApartment[]> {
    try {
      const response = await api.get<SearchApartment[]>(`/search/${apartmentId}/similar?limit=${limit}`);
      if (response.success) {
        return response.data!;
      }
      return [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des appartements similaires à ${apartmentId}:`, error);
      return [];
    }
  }
};

export default searchApi;