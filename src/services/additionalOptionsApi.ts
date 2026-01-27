// services/additionalOptionsApi.ts
import { api } from './api';

const BACKEND_URL = 'https://airbnb-backend-l640.onrender.com/api/options';

export interface AdditionalOption {
  _id: string;
  name: string;
  description: string;
  category: 'service' | 'modification' | 'insurance' | 'commodity';
  price: number;
  pricingType: 'fixed' | 'per_day' | 'per_guest';
  icon?: string;
  isActive: boolean;
  apartmentIds?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface GroupedOptions {
  service: AdditionalOption[];
  modification: AdditionalOption[];
  insurance: AdditionalOption[];
  commodity: AdditionalOption[];
  [key: string]: AdditionalOption[];
}

export interface OptionsResponse {
  success: boolean;
  options?: GroupedOptions;
  all?: AdditionalOption[];
  category?: string;
  option?: AdditionalOption;
  message?: string;
  error?: string;
}

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

export const additionalOptionsApi = {
  // Récupérer toutes les options (groupées par catégorie)
  async getAllOptions(apartmentId?: number): Promise<OptionsResponse> {
    try {
      const url = apartmentId ? `?apartmentId=${apartmentId}` : '';
      return await makeRequest<OptionsResponse>(url);
    } catch (error) {
      console.error('Erreur lors de la récupération des options:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Récupérer les options par catégorie
  async getOptionsByCategory(category: string): Promise<OptionsResponse> {
    try {
      return await makeRequest<OptionsResponse>(`/category/${category}`);
    } catch (error) {
      console.error(`Erreur lors de la récupération des options ${category}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Récupérer une option spécifique
  async getOption(id: string): Promise<OptionsResponse> {
    try {
      return await makeRequest<OptionsResponse>(`/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'option ${id}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Créer une nouvelle option (Admin)
  async createOption(optionData: Omit<AdditionalOption, '_id' | 'createdAt' | 'updatedAt'>): Promise<OptionsResponse> {
    try {
      return await makeRequest<OptionsResponse>('/', 'POST', optionData);
    } catch (error) {
      console.error('Erreur lors de la création de l\'option:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Mettre à jour une option (Admin)
  async updateOption(id: string, updates: Partial<AdditionalOption>): Promise<OptionsResponse> {
    try {
      return await makeRequest<OptionsResponse>(`/${id}`, 'PUT', updates);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'option ${id}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Supprimer une option (Admin)
  async deleteOption(id: string): Promise<OptionsResponse> {
    try {
      return await makeRequest<OptionsResponse>(`/${id}`, 'DELETE');
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'option ${id}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Activer/désactiver une option
  async toggleOptionStatus(id: string, isActive: boolean): Promise<OptionsResponse> {
    try {
      return await makeRequest<OptionsResponse>(`/${id}/status`, 'PATCH', { isActive });
    } catch (error) {
      console.error(`Erreur lors du changement de statut de l'option ${id}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Filtrer les options par appartement
  async getOptionsForApartment(apartmentId: number): Promise<AdditionalOption[]> {
    try {
      const response = await this.getAllOptions(apartmentId);
      if (response.success && response.all) {
        return response.all;
      }
      return [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des options pour l'appartement ${apartmentId}:`, error);
      return [];
    }
  },

  // Rechercher des options
  async searchOptions(query: string): Promise<AdditionalOption[]> {
    try {
      // Implémentation côté client si le backend ne le supporte pas
      const response = await this.getAllOptions();
      if (response.success && response.all) {
        const searchTerm = query.toLowerCase();
        return response.all.filter(option =>
          option.name.toLowerCase().includes(searchTerm) ||
          option.description.toLowerCase().includes(searchTerm) ||
          option.category.toLowerCase().includes(searchTerm)
        );
      }
      return [];
    } catch (error) {
      console.error('Erreur lors de la recherche des options:', error);
      return [];
    }
  },

  // Calculer le prix d'une option
  calculateOptionPrice(option: AdditionalOption, nights: number = 1, guests: number = 1): number {
    switch (option.pricingType) {
      case 'per_day':
        return option.price * nights;
      case 'per_guest':
        return option.price * guests;
      case 'fixed':
      default:
        return option.price;
    }
  },

  // Vérifier si une option est applicable à un appartement
  isOptionApplicable(option: AdditionalOption, apartmentId?: number): boolean {
    if (!option.isActive) return false;
    
    if (!option.apartmentIds || option.apartmentIds.length === 0) {
      // Option globale - applicable à tous les appartements
      return true;
    }
    
    // Vérifier si l'appartement est dans la liste
    return apartmentId ? option.apartmentIds.includes(apartmentId) : false;
  },

  // Gestion du cache local
  async saveLocalChanges(options: AdditionalOption[]): Promise<void> {
    try {
      localStorage.setItem('additional_options_draft', JSON.stringify(options));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde locale:', error);
    }
  },

  async loadLocalChanges(): Promise<AdditionalOption[]> {
    try {
      const draft = localStorage.getItem('additional_options_draft');
      return draft ? JSON.parse(draft) : [];
    } catch (error) {
      console.error('Erreur lors du chargement local:', error);
      return [];
    }
  },

  async clearLocalChanges(): Promise<void> {
    try {
      localStorage.removeItem('additional_options_draft');
    } catch (error) {
      console.error('Erreur lors du nettoyage local:', error);
    }
  },

  // Exporter les options
  async exportOptions(): Promise<{ data: AdditionalOption[]; timestamp: string }> {
    try {
      const response = await this.getAllOptions();
      if (response.success && response.all) {
        return {
          data: response.all,
          timestamp: new Date().toISOString()
        };
      }
      throw new Error('Impossible d\'exporter les options');
    } catch (error) {
      console.error('Erreur lors de l\'exportation:', error);
      throw error;
    }
  },

  // Importer des options
  async importOptions(data: AdditionalOption[]): Promise<OptionsResponse> {
    try {
      // Note: Cette fonctionnalité pourrait nécessiter une route backend dédiée
      // Pour l'instant, on crée chaque option individuellement
      const results = await Promise.all(
        data.map(option => this.createOption(option))
      );
      
      const allSuccess = results.every(result => result.success);
      
      return {
        success: allSuccess,
        message: allSuccess 
          ? `${data.length} options importées avec succès` 
          : 'Certaines options n\'ont pas pu être importées'
      };
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Obtenir les statistiques
  async getStats(): Promise<{
    total: number;
    byCategory: Record<string, number>;
    active: number;
    inactive: number;
    averagePrice: number;
  }> {
    try {
      const response = await this.getAllOptions();
      if (response.success && response.all) {
        const options = response.all;
        const byCategory: Record<string, number> = {};
        let totalPrice = 0;
        
        options.forEach(option => {
          byCategory[option.category] = (byCategory[option.category] || 0) + 1;
          totalPrice += option.price;
        });
        
        return {
          total: options.length,
          byCategory,
          active: options.filter(o => o.isActive).length,
          inactive: options.filter(o => !o.isActive).length,
          averagePrice: options.length > 0 ? totalPrice / options.length : 0
        };
      }
      return {
        total: 0,
        byCategory: {},
        active: 0,
        inactive: 0,
        averagePrice: 0
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        total: 0,
        byCategory: {},
        active: 0,
        inactive: 0,
        averagePrice: 0
      };
    }
  },

  // Initialiser avec des options par défaut
  async initializeDefaultOptions(): Promise<OptionsResponse> {
    const defaultOptions = [
      {
        name: 'Nettoyage professionnel',
        description: 'Nettoyage en profondeur avant et après votre séjour',
        category: 'service' as const,
        price: 75,
        pricingType: 'fixed' as const,
        icon: '🧹',
        isActive: true
      },
      {
        name: 'Service de draps premium',
        description: 'Draps en coton égyptien haut de gamme',
        category: 'service' as const,
        price: 30,
        pricingType: 'fixed' as const,
        icon: '🛏️',
        isActive: true
      },
      {
        name: 'Parking sécurisé',
        description: 'Place de parking réservée et sécurisée',
        category: 'service' as const,
        price: 15,
        pricingType: 'per_day' as const,
        icon: '🅿️',
        isActive: true
      },
      {
        name: 'WiFi premium',
        description: 'Accès illimité avec vitesse fibre optique',
        category: 'service' as const,
        price: 20,
        pricingType: 'fixed' as const,
        icon: '📡',
        isActive: true
      },
      {
        name: 'Check-in anticipé (avant 15h)',
        description: 'Arrivée possible dès 10h du matin',
        category: 'modification' as const,
        price: 25,
        pricingType: 'fixed' as const,
        icon: '🚪',
        isActive: true
      },
      {
        name: 'Check-out tardif (après 11h)',
        description: 'Départ possible jusqu\'à 18h',
        category: 'modification' as const,
        price: 25,
        pricingType: 'fixed' as const,
        icon: '🕐',
        isActive: true
      },
      {
        name: 'Assurance annulation',
        description: 'Remboursement complet en cas d\'annulation',
        category: 'insurance' as const,
        price: 75,
        pricingType: 'fixed' as const,
        icon: '🛡️',
        isActive: true
      },
      {
        name: 'Assurance dégâts',
        description: 'Protection contre les dégâts accidentels',
        category: 'insurance' as const,
        price: 50,
        pricingType: 'fixed' as const,
        icon: '🔒',
        isActive: true
      },
      {
        name: 'Petit-déjeuner complet',
        description: 'Petit-déjeuner français traditionnel chaque matin',
        category: 'commodity' as const,
        price: 15,
        pricingType: 'per_day' as const,
        icon: '🥐',
        isActive: true
      },
      {
        name: 'Service de conciergerie',
        description: 'Assistance pour les réservations et arrangements',
        category: 'commodity' as const,
        price: 35,
        pricingType: 'fixed' as const,
        icon: '🎩',
        isActive: true
      }
    ];

    try {
      const results = await Promise.all(
        defaultOptions.map(option => this.createOption(option))
      );
      
      const successCount = results.filter(r => r.success).length;
      
      return {
        success: successCount > 0,
        message: `${successCount} options par défaut créées avec succès`
      };
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des options par défaut:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }
};

export default additionalOptionsApi;