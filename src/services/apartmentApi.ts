import { api } from './api';

export interface Room {
  id: number;
  image: string;
  title: string;
  description: string;
  guests: string;
  bedrooms: string;
  city?: string;
  location?: string;
  availability?: boolean;
  availableFrom?: string;
  capacity?: number;
}

export interface ApartmentPageData {
  heroSection: {
    titleLine1: string;
    titleLine2: string;
    titleLine3: string;
    description: string;
    backgroundImage: string;
  };
  roomsSection: {
    title: string;
    description: string;
    rooms: Room[];
    loadMoreText: string;
    showLessText: string;
    backToTopText: string;
  };
  featureSection: {
    mainTitle: string;
    mainDescription: string;
    darkCard: {
      title: string;
      footer: string;
    };
    lightCard: {
      title: string;
      description: string;
    };
    images: {
      small: string;
      large: string;
    };
    footerTexts: string[];
  };
  showcaseSection: {
    title: string;
    description: string;
    image: string;
    checkItems: Array<{ text: string }>;
    decorativeElements: {
      grayRectangle: string;
      pinkSquare: string;
    };
  };
  perfectShowSection: {
    title: string;
    description: string;
    buttonText: string;
    images: {
      main: string;
      view: string;
      detail: string;
    };
    footerText: string;
  };
  marqueeSection: {
    text: string;
    backgroundColor: string;
    textColor: string;
  };
  videoSection: {
    coverImage: string;
    videoUrl: string;
    playButtonText: string;
    overlayColor: string;
    galleryImages: string[];
  };
  finalSection: {
    title: string;
    subtitle: string;
    text1: string;
    text2: string;
    images: string[];
  };
  meta: {
    updatedAt: string;
    updatedBy: string;
    version: number;
  };
}

export const apartmentApi = {
  // Récupérer les données de la page appartements
  async getApartmentPage(): Promise<ApartmentPageData> {
    const response = await api.get('/apartment');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la récupération de la page appartement');
  },

  // Mettre à jour la page appartements
  async updateApartmentPage(data: Partial<ApartmentPageData>): Promise<ApartmentPageData> {
    const response = await api.put('/apartment', data);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la mise à jour de la page appartement');
  },

  // Mettre à jour une section spécifique
  async updateSection(section: string, subsection?: string, data?: any): Promise<ApartmentPageData> {
    const url = subsection 
      ? `/apartment/section/${section}/${subsection}`
      : `/apartment/section/${section}`;
    
    const response = await api.put(url, data);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || `Erreur lors de la mise à jour de la section ${section}`);
  },

  // Ajouter une chambre
  async addRoom(room: Omit<Room, 'id'>): Promise<ApartmentPageData> {
    const response = await api.post('/apartment/rooms', { room });
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de l\'ajout de la chambre');
  },

  // Mettre à jour une chambre
  async updateRoom(id: number, updates: Partial<Room>): Promise<ApartmentPageData> {
    const response = await api.put(`/apartment/rooms/${id}`, { updates });
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la mise à jour de la chambre');
  },

  // Supprimer une chambre
  async deleteRoom(id: number): Promise<ApartmentPageData> {
    const response = await api.delete(`/apartment/rooms/${id}`);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la suppression de la chambre');
  },

  // Télécharger une image
  async uploadImage(file: File): Promise<{ url: string }> {
    const response = await api.uploadImage(file, 'apartment');
    if (response.success) {
      return { url: response.data.url };
    }
    throw new Error(response.error || 'Erreur lors du téléchargement de l\'image');
  },

  // Méthodes utilitaires pour gérer les données locales
  async saveLocalChanges(data: ApartmentPageData): Promise<void> {
    try {
      localStorage.setItem('apartmentPage_draft', JSON.stringify(data));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde locale:', error);
    }
  },

  async loadLocalChanges(): Promise<ApartmentPageData | null> {
    try {
      const draft = localStorage.getItem('apartmentPage_draft');
      return draft ? JSON.parse(draft) : null;
    } catch (error) {
      console.error('Erreur lors du chargement local:', error);
      return null;
    }
  },

  async clearLocalChanges(): Promise<void> {
    try {
      localStorage.removeItem('apartmentPage_draft');
    } catch (error) {
      console.error('Erreur lors du nettoyage local:', error);
    }
  },

  // Synchroniser avec le serveur
  async syncWithServer(): Promise<ApartmentPageData> {
    const draft = await this.loadLocalChanges();
    if (draft) {
      const serverData = await this.updateApartmentPage(draft);
      await this.clearLocalChanges();
      return serverData;
    } else {
      return await this.getApartmentPage();
    }
  },

  // Vérifier la connexion
  async checkConnection(): Promise<{ connected: boolean; message?: string }> {
    try {
      const response = await api.healthCheck();
      return { 
        connected: response.success,
        message: response.success ? undefined : 'Connexion impossible'
      };
    } catch (error) {
      return { 
        connected: false, 
        message: error instanceof Error ? error.message : 'Connexion impossible'
      };
    }
  },

  // Obtenir les statistiques
  async getStats(): Promise<{
    sections: number;
    rooms: number;
    checkItems: number;
    images: number;
    lastUpdated: string;
  }> {
    const data = await this.getApartmentPage();
    
    const totalImages = 
      1 + // hero background
      2 + // feature section images
      1 + // showcase image
      3 + // perfect show images
      1 + // video cover
      2 + // final images
      data.roomsSection.rooms.length;
    
    return {
      sections: 8,
      rooms: data.roomsSection.rooms.length,
      checkItems: data.showcaseSection.checkItems.length,
      images: totalImages,
      lastUpdated: data.meta.updatedAt
    };
  },

  // Réinitialiser aux valeurs par défaut
  async resetToDefaults(): Promise<ApartmentPageData> {
    const response = await api.post('/apartment/reset');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la réinitialisation');
  },

  // Exporter les données
  async exportData(): Promise<{ data: ApartmentPageData; timestamp: string }> {
    const data = await this.getApartmentPage();
    return {
      data,
      timestamp: new Date().toISOString()
    };
  },

  // Importer des données
  async importData(data: ApartmentPageData): Promise<ApartmentPageData> {
    const response = await api.post('/apartment/import', data);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de l\'importation');
  }
};

export default apartmentApi;