import { api } from './api';

export interface ServicePageData {
  service1: {
    heroSection: {
      titleLine1: string;
      titleLine2: string;
      titleLine3: string;
      description: string;
      backgroundImage: string;
    };
    compositionSection: {
      mainImage: string;
      secondaryImage: string;
      title: string;
      description: string;
      features: Array<{
        icon: string;
        title: string;
      }>;
      decorativeElements: {
        pinkSquare: string;
        blackSquare: string;
      };
    };
    ctaSection: {
      title: string;
      description: string;
      buttonText: string;
      image: string;
      featureCards: Array<{
        icon: string;
        title: string;
        description: string;
      }>;
      layout: 'split' | 'grid';
    };
    featuresSection: {
      title: string;
      features: Array<{
        icon: string;
        title: string;
        description: string;
      }>;
      decorativeText: string;
      backgroundColor: string;
    };
    darkSection: {
      title: string;
      subtitle: string;
      description: string;
      image1: string;
      image2: string;
      buttonText: string;
      accentColor: string;
      features: Array<{
        id: string;
        text: string;
      }>;
    };
  };
  service2: {
    faqSection: {
      questions: Array<{
        question: string;
        answer: string;
      }>;
      title: string;
      description: string;
      image: string;
      decorativeElements: {
        pinkSquare: string;
        blackSquare: string;
      };
    };
    gallerySection: {
      mainImage: string;
      secondaryImages: string[];
      title: string;
      description: string;
      backgroundColor: string;
      decorativeElements: {
        pinkSquare: string;
        blackSquare: string;
      };
    };
  };
  meta: {
    updatedAt: string;
    updatedBy: string;
    version: number;
  };
}

export const serviceApi = {
  // Récupérer les données de la page services
  async getServicePage(): Promise<ServicePageData> {
    const response = await api.get('/services');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la récupération de la page services');
  },

  // Mettre à jour la page services
  async updateServicePage(data: Partial<ServicePageData>): Promise<ServicePageData> {
    const response = await api.put('/services', data);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la mise à jour de la page services');
  },

  // Mettre à jour une section spécifique
  async updateSection(section: string, subsection?: string, data?: any): Promise<ServicePageData> {
    const url = subsection 
      ? `/services/section/${section}/${subsection}`
      : `/services/section/${section}`;
    
    const response = await api.put(url, data);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || `Erreur lors de la mise à jour de la section ${section}`);
  },

  // Ajouter une question FAQ
  async addFAQItem(question: string, answer: string): Promise<ServicePageData> {
    const response = await api.post('/services/faq', { question, answer });
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de l\'ajout de la question FAQ');
  },

  // Mettre à jour une question FAQ
  async updateFAQItem(index: number, question: string, answer: string): Promise<ServicePageData> {
    const response = await api.put(`/services/faq/${index}`, { question, answer });
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la mise à jour de la question FAQ');
  },

  // Supprimer une question FAQ
  async removeFAQItem(index: number): Promise<ServicePageData> {
    const response = await api.delete(`/services/faq/${index}`);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la suppression de la question FAQ');
  },

  // Ajouter une feature
  async addFeature(section: string, feature: any): Promise<ServicePageData> {
    const response = await api.post('/services/features', { section, feature });
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de l\'ajout de la feature');
  },

  // Télécharger une image
  async uploadImage(file: File): Promise<{ url: string }> {
    const response = await api.uploadImage(file, 'services');
    if (response.success) {
      return { url: response.data.url };
    }
    throw new Error(response.error || 'Erreur lors du téléchargement de l\'image');
  },

  // Méthodes utilitaires pour gérer les données locales
  async saveLocalChanges(data: ServicePageData): Promise<void> {
    try {
      localStorage.setItem('servicePage_draft', JSON.stringify(data));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde locale:', error);
    }
  },

  async loadLocalChanges(): Promise<ServicePageData | null> {
    try {
      const draft = localStorage.getItem('servicePage_draft');
      return draft ? JSON.parse(draft) : null;
    } catch (error) {
      console.error('Erreur lors du chargement local:', error);
      return null;
    }
  },

  async clearLocalChanges(): Promise<void> {
    try {
      localStorage.removeItem('servicePage_draft');
    } catch (error) {
      console.error('Erreur lors du nettoyage local:', error);
    }
  },

  // Synchroniser avec le serveur
  async syncWithServer(): Promise<ServicePageData> {
    const draft = await this.loadLocalChanges();
    if (draft) {
      const serverData = await this.updateServicePage(draft);
      await this.clearLocalChanges();
      return serverData;
    } else {
      return await this.getServicePage();
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
    features: number;
    faqQuestions: number;
    images: number;
    lastUpdated: string;
  }> {
    const data = await this.getServicePage();
    
    const totalFeatures = 
      data.service1.compositionSection.features.length +
      data.service1.ctaSection.featureCards.length +
      data.service1.featuresSection.features.length +
      data.service1.darkSection.features.length;
    
    const totalImages = 
      1 + // hero background
      2 + // composition images
      1 + // cta image
      2 + // dark section images
      1 + // faq image
      1 + // gallery main image
      data.service2.gallerySection.secondaryImages.length;
    
    return {
      sections: 7,
      features: totalFeatures,
      faqQuestions: data.service2.faqSection.questions.length,
      images: totalImages,
      lastUpdated: data.meta.updatedAt
    };
  },

  // Réinitialiser aux valeurs par défaut
  async resetToDefaults(): Promise<ServicePageData> {
    const response = await api.post('/services/reset');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la réinitialisation');
  },

  // Exporter les données
  async exportData(): Promise<{ data: ServicePageData; timestamp: string }> {
    const data = await this.getServicePage();
    return {
      data,
      timestamp: new Date().toISOString()
    };
  },

  // Importer des données
  async importData(data: ServicePageData): Promise<ServicePageData> {
    const response = await api.post('/services/import', data);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de l\'importation');
  }
};

export default serviceApi;