// services/additionalOptionsApi.ts
import { api } from './api';

export interface AdditionalOption {
  _id: string;
  name: string;
  description: string;
  category: 'service' | 'modification' | 'insurance' | 'commodity';
  price: number;
  pricingType: 'fixed' | 'per_day' | 'per_guest';
  icon?: string;
  image?: string;
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

export const additionalOptionsApi = {
  // Récupérer toutes les options (groupées par catégorie)
  async getAllOptions(apartmentId?: number): Promise<OptionsResponse> {
    try {
      const url = apartmentId ? `/options?apartmentId=${apartmentId}` : '/options';
      const response = await api.get(url);
      
      if (response.success) {
        return {
          success: true,
          options: response.data?.options,
          all: response.data?.all || response.data,
          message: response.message
        };
      }
      
      return {
        success: false,
        error: response.error
      };
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
      const response = await api.get(`/options/category/${category}`);
      
      if (response.success) {
        return {
          success: true,
          options: response.data?.options,
          all: response.data?.all || response.data,
          category,
          message: response.message
        };
      }
      
      return {
        success: false,
        error: response.error
      };
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
      const response = await api.get(`/options/${id}`);
      
      if (response.success) {
        return {
          success: true,
          option: response.data,
          message: response.message
        };
      }
      
      return {
        success: false,
        error: response.error
      };
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'option ${id}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Créer une nouvelle option
  async createOption(optionData: Omit<AdditionalOption, '_id' | 'createdAt' | 'updatedAt'>): Promise<OptionsResponse> {
    try {
      const response = await api.post('/options', optionData);
      
      if (response.success) {
        return {
          success: true,
          option: response.data,
          message: response.message || 'Option créée avec succès'
        };
      }
      
      return {
        success: false,
        error: response.error
      };
    } catch (error) {
      console.error('Erreur lors de la création de l\'option:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Mettre à jour une option
  async updateOption(id: string, updates: Partial<AdditionalOption>): Promise<OptionsResponse> {
    try {
      const response = await api.put(`/options/${id}`, updates);
      
      if (response.success) {
        return {
          success: true,
          option: response.data,
          message: response.message || 'Option mise à jour avec succès'
        };
      }
      
      return {
        success: false,
        error: response.error
      };
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'option ${id}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Supprimer une option
  async deleteOption(id: string): Promise<OptionsResponse> {
    try {
      const response = await api.delete(`/options/${id}`);
      
      if (response.success) {
        return {
          success: true,
          message: response.message || 'Option supprimée avec succès'
        };
      }
      
      return {
        success: false,
        error: response.error
      };
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
      const response = await api.patch(`/options/${id}/status`, { isActive });
      
      if (response.success) {
        return {
          success: true,
          option: response.data,
          message: response.message || 'Statut de l\'option mis à jour'
        };
      }
      
      return {
        success: false,
        error: response.error
      };
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
      const response = await api.get(`/options/search?q=${encodeURIComponent(query)}`);
      if (response.success && response.data) {
        return response.data;
      }
      
      // Fallback: recherche côté client
      const allResponse = await this.getAllOptions();
      if (allResponse.success && allResponse.all) {
        const searchTerm = query.toLowerCase();
        return allResponse.all.filter(option =>
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
      return true;
    }
    
    return apartmentId ? option.apartmentIds.includes(apartmentId) : false;
  },

  // Obtenir les options groupées par catégorie
  async getGroupedOptions(apartmentId?: number): Promise<GroupedOptions> {
    try {
      const response = await this.getAllOptions(apartmentId);
      if (response.success && response.options) {
        return response.options;
      }
      
      // Fallback: grouper manuellement
      const allOptions = await this.getOptionsForApartment(apartmentId || 0);
      const grouped: GroupedOptions = {
        service: [],
        modification: [],
        insurance: [],
        commodity: []
      };
      
      allOptions.forEach(option => {
        if (grouped[option.category]) {
          grouped[option.category].push(option);
        }
      });
      
      return grouped;
    } catch (error) {
      console.error('Erreur lors du groupement des options:', error);
      return {
        service: [],
        modification: [],
        insurance: [],
        commodity: []
      };
    }
  },

  // Gestion du cache local
  async saveLocalChanges(options: AdditionalOption[]): Promise<void> {
    try {
      localStorage.setItem('additional_options_draft', JSON.stringify({
        data: options,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde locale:', error);
    }
  },

  async loadLocalChanges(): Promise<AdditionalOption[]> {
    try {
      const draft = localStorage.getItem('additional_options_draft');
      if (!draft) return [];
      
      const { data, timestamp } = JSON.parse(draft);
      const cacheAge = new Date().getTime() - new Date(timestamp).getTime();
      const cacheMaxAge = 60 * 60 * 1000; // 1 heure
      
      if (cacheAge > cacheMaxAge) {
        localStorage.removeItem('additional_options_draft');
        return [];
      }
      
      return data;
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

  // Synchroniser avec le serveur
  async syncWithServer(): Promise<AdditionalOption[]> {
    const draft = await this.loadLocalChanges();
    if (draft.length === 0) {
      const response = await this.getAllOptions();
      return response.success && response.all ? response.all : [];
    }

    const results = await Promise.all(
      draft.map(async (option) => {
        if (option._id) {
          return await this.updateOption(option._id, option);
        } else {
          return await this.createOption(option);
        }
      })
    );

    const allSuccess = results.every(result => result.success);
    if (allSuccess) {
      await this.clearLocalChanges();
    }

    const updatedOptions = results
      .filter(result => result.success && result.option)
      .map(result => result.option!);

    return updatedOptions;
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
      const results = await Promise.all(
        data.map(async (option) => {
          const { _id, createdAt, updatedAt, ...optionData } = option;
          return await this.createOption(optionData);
        })
      );
      
      const successCount = results.filter(result => result.success).length;
      const failedCount = results.length - successCount;
      
      return {
        success: successCount > 0,
        message: `${successCount} options importées avec succès${failedCount > 0 ? `, ${failedCount} échecs` : ''}`
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
    pricingTypes: Record<string, number>;
  }> {
    try {
      const response = await this.getAllOptions();
      if (response.success && response.all) {
        const options = response.all;
        const byCategory: Record<string, number> = {};
        const pricingTypes: Record<string, number> = {};
        let totalPrice = 0;
        
        options.forEach(option => {
          byCategory[option.category] = (byCategory[option.category] || 0) + 1;
          pricingTypes[option.pricingType] = (pricingTypes[option.pricingType] || 0) + 1;
          totalPrice += option.price;
        });
        
        return {
          total: options.length,
          byCategory,
          active: options.filter(o => o.isActive).length,
          inactive: options.filter(o => !o.isActive).length,
          averagePrice: options.length > 0 ? totalPrice / options.length : 0,
          pricingTypes
        };
      }
      return {
        total: 0,
        byCategory: {},
        active: 0,
        inactive: 0,
        averagePrice: 0,
        pricingTypes: {}
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        total: 0,
        byCategory: {},
        active: 0,
        inactive: 0,
        averagePrice: 0,
        pricingTypes: {}
      };
    }
  },

  // Télécharger une image d'option
  async uploadOptionImage(file: File): Promise<{ url: string }> {
    try {
      const response = await api.uploadImage(file, 'options');
      if (response.success) {
        return { url: response.data.url };
      }
      throw new Error(response.error || 'Erreur lors du téléchargement');
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      throw error;
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
      const failedCount = results.length - successCount;
      
      return {
        success: successCount > 0,
        message: `${successCount} options par défaut créées avec succès${failedCount > 0 ? `, ${failedCount} échecs` : ''}`
      };
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des options par défaut:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Valider une option
  validateOption(option: Partial<AdditionalOption>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!option.name || option.name.trim().length === 0) {
      errors.push('Le nom de l\'option est requis');
    }

    if (!option.description || option.description.trim().length === 0) {
      errors.push('La description de l\'option est requise');
    }

    if (!option.category || !['service', 'modification', 'insurance', 'commodity'].includes(option.category)) {
      errors.push('La catégorie de l\'option est invalide');
    }

    if (option.price === undefined || option.price < 0) {
      errors.push('Le prix de l\'option doit être un nombre positif');
    }

    if (!option.pricingType || !['fixed', 'per_day', 'per_guest'].includes(option.pricingType)) {
      errors.push('Le type de tarification est invalide');
    }

    if (option.apartmentIds && !Array.isArray(option.apartmentIds)) {
      errors.push('Les IDs d\'appartements doivent être un tableau');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
};

export default additionalOptionsApi;