// services/destinationApi.ts
import { api } from './api';

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

export const destinationApi = {
  // Récupérer les suggestions de destinations (villes, pays, lieux)
  async getDestinationSuggestions(): Promise<DestinationSuggestions> {
    try {
      const response = await api.get('/search/filters');
      if (response.success) {
        return response.data;
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
      console.error('Erreur lors de la récupération des suggestions de destinations:', error);
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

  // Rechercher des destinations par terme
  async searchDestinations(query: string, limit: number = 10): Promise<string[]> {
    try {
      const allOptions = await this.getAllDestinationOptions();
      const searchTerm = query.toLowerCase();
      return allOptions
        .filter(option => option.toLowerCase().includes(searchTerm))
        .slice(0, limit);
    } catch (error) {
      console.error('Erreur lors de la recherche de destinations:', error);
      return [];
    }
  },

  // Obtenir les destinations populaires
  async getPopularDestinations(limit: number = 5): Promise<string[]> {
    try {
      const suggestions = await this.getDestinationSuggestions();
      // Priorité: villes > pays > lieux
      const popular = [
        ...suggestions.cities.slice(0, limit),
        ...suggestions.countries.slice(0, Math.max(0, limit - suggestions.cities.length)),
        ...suggestions.locations.slice(0, Math.max(0, limit - suggestions.cities.length - suggestions.countries.length))
      ];
      return [...new Set(popular)].slice(0, limit);
    } catch (error) {
      console.error('Erreur lors de la récupération des destinations populaires:', error);
      return [];
    }
  },

  // Obtenir la plage de prix
  async getPriceRange(): Promise<{ minPrice: number; maxPrice: number }> {
    try {
      const suggestions = await this.getDestinationSuggestions();
      return suggestions.priceRange;
    } catch (error) {
      console.error('Erreur lors de la récupération de la plage de prix:', error);
      return { minPrice: 0, maxPrice: 1000 };
    }
  },

  // Obtenir les commodités disponibles
  async getAmenities(): Promise<string[]> {
    try {
      const suggestions = await this.getDestinationSuggestions();
      return suggestions.amenities;
    } catch (error) {
      console.error('Erreur lors de la récupération des commodités:', error);
      return [];
    }
  },

  // Obtenir la plage de capacité
  async getCapacityRange(): Promise<{ minCapacity: number; maxCapacity: number }> {
    try {
      const suggestions = await this.getDestinationSuggestions();
      return suggestions.capacityRange;
    } catch (error) {
      console.error('Erreur lors de la récupération de la plage de capacité:', error);
      return { minCapacity: 1, maxCapacity: 10 };
    }
  },

  // Gestion du cache local
  async saveLocalSuggestions(suggestions: DestinationSuggestions): Promise<void> {
    try {
      localStorage.setItem('destination_suggestions_cache', JSON.stringify({
        data: suggestions,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde locale des suggestions:', error);
    }
  },

  async loadLocalSuggestions(): Promise<DestinationSuggestions | null> {
    try {
      const cached = localStorage.getItem('destination_suggestions_cache');
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const cacheAge = new Date().getTime() - new Date(timestamp).getTime();
      const cacheMaxAge = 24 * 60 * 60 * 1000; // 24 heures

      if (cacheAge > cacheMaxAge) {
        localStorage.removeItem('destination_suggestions_cache');
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erreur lors du chargement local des suggestions:', error);
      return null;
    }
  },

  async clearLocalSuggestions(): Promise<void> {
    try {
      localStorage.removeItem('destination_suggestions_cache');
    } catch (error) {
      console.error('Erreur lors du nettoyage local des suggestions:', error);
    }
  },

  // Charger les suggestions avec cache
  async getSuggestionsWithCache(): Promise<DestinationSuggestions> {
    // Essayer d'abord le cache local
    const cached = await this.loadLocalSuggestions();
    if (cached) {
      return cached;
    }

    // Sinon charger depuis l'API
    const suggestions = await this.getDestinationSuggestions();
    
    // Sauvegarder dans le cache
    await this.saveLocalSuggestions(suggestions);
    
    return suggestions;
  },

  // Vérifier si une destination existe
  async destinationExists(destination: string): Promise<boolean> {
    try {
      const allOptions = await this.getAllDestinationOptions();
      return allOptions.some(option => 
        option.toLowerCase() === destination.toLowerCase()
      );
    } catch (error) {
      console.error('Erreur lors de la vérification de la destination:', error);
      return false;
    }
  },

  // Obtenir les statistiques
  async getStats(): Promise<{
    totalCities: number;
    totalCountries: number;
    totalLocations: number;
    totalAmenities: number;
    priceRange: { minPrice: number; maxPrice: number };
    capacityRange: { minCapacity: number; maxCapacity: number };
  }> {
    const suggestions = await this.getDestinationSuggestions();
    
    return {
      totalCities: suggestions.cities.length,
      totalCountries: suggestions.countries.length,
      totalLocations: suggestions.locations.length,
      totalAmenities: suggestions.amenities.length,
      priceRange: suggestions.priceRange,
      capacityRange: suggestions.capacityRange
    };
  }
};

export default destinationApi;