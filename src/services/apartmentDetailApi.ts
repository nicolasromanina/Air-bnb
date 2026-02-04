// services/apartmentDetailApi.ts
import { api } from './api';

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface FeatureItem {
  id: string;
  text: string;
}

export interface HeroSection {
  title: string;
  subtitle: string;
  description: string;
  price: number;
  guests: string;
  bedrooms: string;
  mainImage: string;
  galleryImages: string[];
}

export interface DetailsSection {
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  features: FeatureItem[];
}

export interface GallerySection {
  title: string;
  subtitle: string;
  images: GalleryImage[];
  buttonText: string;
}

export interface LastSection {
  title: string;
  description: string;
  features: FeatureItem[];
  image: string;
  tagline: string;
}

export interface AdditionalOption {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  pricingType: string;
  icon?: string;
}

export interface ApartmentDetailData {
  apartmentId: number;
  hero: HeroSection;
  details: DetailsSection;
  gallery: GallerySection;
  lastSection: LastSection;
  additionalOptions?: string[];
  availableOptions?: AdditionalOption[];
  meta: {
    createdAt: string;
    updatedAt: string;
    updatedBy: string;
    version: number;
  };
}

export const apartmentDetailApi = {
  // Récupérer tous les détails
  async getAllDetails(): Promise<ApartmentDetailData[]> {
    const response = await api.get('/apartment-details');
    if (response.success) {
      return response.data || [];
    }
    throw new Error(response.error || 'Erreur lors de la récupération des détails d\'appartements');
  },
  
  // Récupérer un détail par apartmentId
  async getDetailByApartmentId(apartmentId: number): Promise<ApartmentDetailData> {
    const response = await api.get(`/apartment-details/${apartmentId}`);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || `Erreur lors de la récupération des détails de l'appartement ${apartmentId}`);
  },
  
  // Mettre à jour un détail
  async updateDetail(apartmentId: number, data: Partial<ApartmentDetailData>): Promise<ApartmentDetailData> {
    const response = await api.put(`/apartment-details/${apartmentId}`, data);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || `Erreur lors de la mise à jour des détails de l'appartement ${apartmentId}`);
  },
  
  // Mettre à jour une section
  async updateSection(apartmentId: number, section: string, data: any): Promise<ApartmentDetailData> {
    const response = await api.put(`/apartment-details/${apartmentId}/section/${section}`, data);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || `Erreur lors de la mise à jour de la section ${section} de l'appartement ${apartmentId}`);
  },
  
  // Mettre à jour les options supplémentaires
  async updateAdditionalOptions(apartmentId: number, optionIds: string[]): Promise<ApartmentDetailData> {
    const response = await api.put(`/apartment-details/${apartmentId}/options`, { optionIds });
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || `Erreur lors de la mise à jour des options de l'appartement ${apartmentId}`);
  },
  
  // Synchroniser avec la page principale
  async syncWithMainPage(apartmentId: number, roomData: any): Promise<ApartmentDetailData> {
    const response = await api.post(`/apartment-details/${apartmentId}/sync`, { roomData });
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || `Erreur lors de la synchronisation de l'appartement ${apartmentId}`);
  },
  
  // Supprimer un détail
  async deleteDetail(apartmentId: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/apartment-details/${apartmentId}`);
    if (response.success) {
      return {
        success: true,
        message: response.message || 'Détails supprimés avec succès'
      };
    }
    return {
      success: false,
      message: response.error || 'Erreur lors de la suppression des détails'
    };
  },
  
  // Créer un nouveau détail
  async createDetail(data: Omit<ApartmentDetailData, 'meta'>): Promise<ApartmentDetailData> {
    const response = await api.post('/apartment-details', data);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la création des détails');
  },

  // Télécharger une image
  async uploadImage(file: File): Promise<{ url: string }> {
    const response = await api.uploadImage(file, 'apartment-details');
    if (response.success) {
      return { url: response.data.url };
    }
    throw new Error(response.error || 'Erreur lors du téléchargement de l\'image');
  },

  // Gestion du cache local
  async saveLocalChanges(apartmentId: number, data: ApartmentDetailData): Promise<void> {
    try {
      localStorage.setItem(`apartmentDetail_${apartmentId}_draft`, JSON.stringify(data));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde locale:', error);
    }
  },
  
  async loadLocalChanges(apartmentId: number): Promise<ApartmentDetailData | null> {
    try {
      const draft = localStorage.getItem(`apartmentDetail_${apartmentId}_draft`);
      return draft ? JSON.parse(draft) : null;
    } catch (error) {
      console.error('Erreur lors du chargement local:', error);
      return null;
    }
  },
  
  async clearLocalChanges(apartmentId: number): Promise<void> {
    try {
      localStorage.removeItem(`apartmentDetail_${apartmentId}_draft`);
    } catch (error) {
      console.error('Erreur lors du nettoyage local:', error);
    }
  },

  // Synchroniser avec le serveur
  async syncWithServer(apartmentId: number): Promise<ApartmentDetailData> {
    const draft = await this.loadLocalChanges(apartmentId);
    if (draft) {
      const serverData = await this.updateDetail(apartmentId, draft);
      await this.clearLocalChanges(apartmentId);
      return serverData;
    } else {
      return await this.getDetailByApartmentId(apartmentId);
    }
  },

  // Obtenir les statistiques
  async getStats(): Promise<{
    totalDetails: number;
    totalImages: number;
    totalFeatures: number;
    lastUpdated: string;
  }> {
    const details = await this.getAllDetails();
    
    const totalImages = details.reduce((sum, detail) => {
      return sum + 
        (detail.hero.galleryImages?.length || 0) +
        (detail.gallery.images?.length || 0) +
        1; // lastSection image
    }, 0);

    const totalFeatures = details.reduce((sum, detail) => {
      return sum + 
        (detail.details.features?.length || 0) +
        (detail.lastSection.features?.length || 0);
    }, 0);

    const lastUpdated = details.length > 0 
      ? details.reduce((latest, detail) => {
          const detailDate = new Date(detail.meta.updatedAt);
          const latestDate = new Date(latest);
          return detailDate > latestDate ? detail.meta.updatedAt : latest;
        }, details[0].meta.updatedAt)
      : new Date().toISOString();

    return {
      totalDetails: details.length,
      totalImages,
      totalFeatures,
      lastUpdated
    };
  },

  // Réinitialiser aux valeurs par défaut
  async resetToDefaults(apartmentId: number): Promise<ApartmentDetailData> {
    const response = await api.post(`/apartment-details/${apartmentId}/reset`);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la réinitialisation');
  },

  // Exporter les données
  async exportData(apartmentId?: number): Promise<{ data: ApartmentDetailData | ApartmentDetailData[]; timestamp: string }> {
    if (apartmentId) {
      const data = await this.getDetailByApartmentId(apartmentId);
      return {
        data,
        timestamp: new Date().toISOString()
      };
    } else {
      const data = await this.getAllDetails();
      return {
        data,
        timestamp: new Date().toISOString()
      };
    }
  },

  // Importer des données
  async importData(data: ApartmentDetailData | ApartmentDetailData[]): Promise<{ success: number; failed: number }> {
    const details = Array.isArray(data) ? data : [data];
    let success = 0;
    let failed = 0;

    for (const detail of details) {
      try {
        if (detail.apartmentId) {
          await this.updateDetail(detail.apartmentId, detail);
        } else {
          await this.createDetail(detail);
        }
        success++;
      } catch (error) {
        console.error('Erreur lors de l\'importation:', error);
        failed++;
      }
    }

    return { success, failed };
  },

  // Valider les données
  validateApartmentDetail(data: Partial<ApartmentDetailData>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.hero && data.hero.price && data.hero.price < 0) {
      errors.push('Le prix ne peut pas être négatif');
    }

    if (data.hero && (!data.hero.title || data.hero.title.trim().length === 0)) {
      errors.push('Le titre de la section hero ne peut pas être vide');
    }

    if (data.details && (!data.details.title || data.details.title.trim().length === 0)) {
      errors.push('Le titre de la section détails ne peut pas être vide');
    }

    if (data.gallery && data.gallery.images && !Array.isArray(data.gallery.images)) {
      errors.push('Les images de la galerie doivent être un tableau');
    }

    if (data.details && data.details.features && !Array.isArray(data.details.features)) {
      errors.push('Les fonctionnalités doivent être un tableau');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
};

export default apartmentDetailApi;