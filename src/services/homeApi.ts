import { api } from './api';

export interface HomePageData {
  heroSection: {
    titleLine1: string;
    titleLine2: string;
    titleLine3: string;
    description: string;
    backgroundImage: string;
    buttonText: string;
  };
  welcomeSection: {
    title: string;
    subtitle: string;
    description: string;
    image: string;
    features: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  marqueeSection: {
    text: string;
    speed: number;
    backgroundColor: string;
    textColor: string;
  };
  destinationSearch: {
    title: string;
    subtitle: string;
    placeholder: string;
    buttonText: string;
    backgroundImage: string;
  };
  featureRoom: {
    title: string;
    subtitle: string;
    room: {
      id: number;
      title: string;
      description: string;
      image: string;
      price: number;
      guests: string;
      bedrooms: string;
      rating: number;
    };
    features: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  marqueeBlackSection: {
    text: string;
    backgroundColor: string;
    textColor: string;
  };
  videoSection: {
    title: string;
    subtitle: string;
    description: string;
    videoUrl: string;
    coverImage: string;
    playButtonText: string;
  };
  servicesSection: {
    title: string;
    subtitle: string;
    services: Array<{
      icon: string;
      title: string;
      description: string;
      link: string;
    }>;
  };
  featuresSection: {
    title: string;
    subtitle: string;
    features: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  statsSection: {
    title: string;
    stats: Array<{
      value: string;
      label: string;
      suffix?: string;
    }>;
    backgroundImage: string;
  };
  logoSection: {
    title: string;
    logos: Array<{
      name: string;
      logo: string;
      url?: string;
    }>;
  };
  threeCardsSection: {
    title: string;
    subtitle: string;
    cards: Array<{
      icon: string;
      title: string;
      description: string;
      buttonText: string;
      link: string;
    }>;
  };
  meta: {
    updatedAt: string;
    updatedBy: string;
    version: number;
  };
}

export const homeApi = {
  // Récupérer la page d'accueil
  async getHomePage(): Promise<HomePageData> {
    const response = await api.get('/home');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la récupération de la page d\'accueil');
  },

  // Mettre à jour la page d'accueil
  async updateHomePage(data: Partial<HomePageData>): Promise<HomePageData> {
    const response = await api.put('/home', data);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la mise à jour de la page d\'accueil');
  },

  // Mettre à jour une section spécifique
  async updateSection(section: string, data: any): Promise<HomePageData> {
    const response = await api.put(`/home/section/${section}`, data);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || `Erreur lors de la mise à jour de la section ${section}`);
  },

  // Vérifier si une section est valide
  isValidSection(section: string): boolean {
    const validSections = [
      'heroSection',
      'welcomeSection',
      'marqueeSection',
      'destinationSearch',
      'featureRoom',
      'marqueeBlackSection',
      'videoSection',
      'servicesSection',
      'featuresSection',
      'statsSection',
      'logoSection',
      'threeCardsSection'
    ];
    
    return validSections.includes(section);
  },

  // Télécharger une image
  async uploadImage(file: File): Promise<{ url: string }> {
    const response = await api.uploadImage(file, 'home');
    if (response.success) {
      return { url: response.data.url };
    }
    throw new Error(response.error || 'Erreur lors du téléchargement de l\'image');
  },

  // Télécharger une vidéo
  async uploadVideo(file: File): Promise<{ url: string }> {
    const response = await api.uploadVideo(file, 'home');
    if (response.success) {
      return { url: response.data.url };
    }
    throw new Error(response.error || 'Erreur lors du téléchargement de la vidéo');
  },

  // Test de connexion
  async testConnection(): Promise<boolean> {
    try {
      const response = await api.healthCheck();
      return response.success;
    } catch {
      return false;
    }
  },

  // Gestion du cache local
  async saveLocalChanges(data: HomePageData): Promise<void> {
    try {
      localStorage.setItem('homePage_draft', JSON.stringify(data));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde locale:', error);
    }
  },

  async loadLocalChanges(): Promise<HomePageData | null> {
    try {
      const draft = localStorage.getItem('homePage_draft');
      return draft ? JSON.parse(draft) : null;
    } catch (error) {
      console.error('Erreur lors du chargement local:', error);
      return null;
    }
  },

  async clearLocalChanges(): Promise<void> {
    try {
      localStorage.removeItem('homePage_draft');
    } catch (error) {
      console.error('Erreur lors du nettoyage local:', error);
    }
  },

  // Synchroniser avec le serveur
  async syncWithServer(): Promise<HomePageData> {
    const draft = await this.loadLocalChanges();
    if (draft) {
      const serverData = await this.updateHomePage(draft);
      await this.clearLocalChanges();
      return serverData;
    } else {
      return await this.getHomePage();
    }
  },

  // Obtenir les statistiques
  async getStats(): Promise<{
    sections: number;
    features: number;
    services: number;
    logos: number;
    images: number;
    lastUpdated: string;
  }> {
    const data = await this.getHomePage();
    
    const totalImages = 
      1 + // hero background
      1 + // welcome image
      1 + // destination search background
      1 + // feature room image
      1 + // video cover
      1 + // stats background
      data.logoSection.logos.length;
    
    return {
      sections: 12,
      features: data.featuresSection.features.length,
      services: data.servicesSection.services.length,
      logos: data.logoSection.logos.length,
      images: totalImages,
      lastUpdated: data.meta.updatedAt
    };
  },

  // Réinitialiser aux valeurs par défaut
  async resetToDefaults(): Promise<HomePageData> {
    const response = await api.post('/home/reset');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la réinitialisation');
  },

  // Exporter les données
  async exportData(): Promise<{ data: HomePageData; timestamp: string }> {
    const data = await this.getHomePage();
    return {
      data,
      timestamp: new Date().toISOString()
    };
  },

  // Importer des données
  async importData(data: HomePageData): Promise<HomePageData> {
    const response = await api.post('/home/import', data);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de l\'importation');
  }
};