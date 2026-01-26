// services/serviceApi.ts

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

import { api } from './api';

// Configuration du backend
const BACKEND_URL = 'https://airbnb-backend.onrender.com/api/services';

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

// Fonction pour les uploads d'images
const uploadImage = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('image', file);
  
  const token = api.getAuthToken();
  
  try {
    const response = await fetch(`${BACKEND_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Erreur HTTP ${response.status}: ${response.statusText}`
      );
    }
    const resp = await response.json();

    // If backend returns a relative path (e.g. `/uploads/...`), convert to absolute
    if (resp && resp.url && typeof resp.url === 'string' && resp.url.startsWith('/')) {
      const backendOrigin = BACKEND_URL.replace('/api/services', '');
      resp.url = `${backendOrigin}${resp.url}`;
    }

    return resp;
  } catch (error) {
    console.error('Erreur upload image:', error);
    throw error;
  }
};

export const serviceApi = {
  // Récupérer les données de la page services
  async getServicePage(): Promise<ServicePageData> {
    return await makeRequest<ServicePageData>('');
  },

  // Mettre à jour la page services
  async updateServicePage(data: Partial<ServicePageData>): Promise<ServicePageData> {
    const response = await makeRequest<{ message: string; page: ServicePageData }>('/', 'PUT', data);
    return response.page;
  },

  // Mettre à jour une section spécifique
  async updateSection(section: string, subsection?: string, data?: any): Promise<ServicePageData> {
    const url = subsection 
      ? `/section/${section}/${subsection}`
      : `/section/${section}`;
    
    const response = await makeRequest<{ message: string; page: ServicePageData }>(url, 'PUT', data);
    return response.page;
  },

  // Ajouter une question FAQ
  async addFAQItem(question: string, answer: string): Promise<ServicePageData> {
    const response = await makeRequest<{ message: string; page: ServicePageData }>(
      '/faq',
      'POST',
      { question, answer }
    );
    return response.page;
  },

  // Supprimer une question FAQ
  async removeFAQItem(index: number): Promise<ServicePageData> {
    const response = await makeRequest<{ message: string; page: ServicePageData }>(
      `/faq/${index}`,
      'DELETE'
    );
    return response.page;
  },

  // Ajouter une feature
  async addFeature(section: string, feature: any): Promise<ServicePageData> {
    const response = await makeRequest<{ message: string; page: ServicePageData }>(
      '/features',
      'POST',
      { section, feature }
    );
    return response.page;
  },

  // Télécharger une image
  async uploadImage(file: File): Promise<{ url: string }> {
    return await uploadImage(file);
  },

  // Méthodes utilitaires pour gérer les données locales
  async saveLocalChanges(data: ServicePageData): Promise<void> {
    // Optionnel: sauvegarde locale avant envoi au serveur
    localStorage.setItem('servicePage_draft', JSON.stringify(data));
  },

  async loadLocalChanges(): Promise<ServicePageData | null> {
    const draft = localStorage.getItem('servicePage_draft');
    return draft ? JSON.parse(draft) : null;
  },

  async clearLocalChanges(): Promise<void> {
    localStorage.removeItem('servicePage_draft');
  },

  // Synchroniser avec le serveur
  async syncWithServer(): Promise<ServicePageData> {
    const draft = await this.loadLocalChanges();
    if (draft) {
      // Si on a des changements locaux, on les envoie au serveur
      const serverData = await this.updateServicePage(draft);
      await this.clearLocalChanges();
      return serverData;
    } else {
      // Sinon on récupère les données du serveur
      return await this.getServicePage();
    }
  },

  // Vérifier la connexion
  async checkConnection(): Promise<{ connected: boolean; message?: string }> {
    try {
      await fetch(`${BACKEND_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      return { connected: true };
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
    const response = await makeRequest<{ message: string; page: ServicePageData }>(
      '/reset',
      'POST'
    );
    return response.page;
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
    const response = await makeRequest<{ message: string; page: ServicePageData }>(
      '/import',
      'POST',
      data
    );
    return response.page;
  }
};

export default serviceApi;