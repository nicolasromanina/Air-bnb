import { api } from './api';

// Configuration du backend
const BACKEND_URL = 'http://api.waya2828.odns.fr/api/search';

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

export const destinationApi = {
  // Récupérer les suggestions de destinations (villes, pays, lieux)
  async getDestinationSuggestions(): Promise<DestinationSuggestions> {
    return await makeRequest<DestinationSuggestions>('/filters');
  },

  // Récupérer uniquement les villes
  async getCities(): Promise<string[]> {
    const suggestions = await makeRequest<DestinationSuggestions>('/filters');
    return suggestions.cities;
  },

  // Récupérer uniquement les pays
  async getCountries(): Promise<string[]> {
    const suggestions = await makeRequest<DestinationSuggestions>('/filters');
    return suggestions.countries;
  },

  // Récupérer uniquement les lieux/locations
  async getLocations(): Promise<string[]> {
    const suggestions = await makeRequest<DestinationSuggestions>('/filters');
    return suggestions.locations;
  },

  // Combiner cities, countries et locations pour les suggestions de destination
  async getAllDestinationOptions(): Promise<string[]> {
    const suggestions = await makeRequest<DestinationSuggestions>('/filters');
    const allOptions = [
      ...new Set([
        ...suggestions.cities,
        ...suggestions.countries,
        ...suggestions.locations
      ])
    ];
    return allOptions.sort();
  }
};
