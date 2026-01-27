export interface Room {
  id: number;
  image: string;
  title: string;
  description: string;
  guests: string;
  bedrooms: string;
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
    playButtonText: string;
    overlayColor: string;
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

import { api } from './api';

// Configuration du backend
const BACKEND_URL = 'https://airbnb-backend-l640.onrender.com/api/apartment';

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

    // Convertir le chemin relatif en URL absolue si nécessaire
    if (resp && resp.url && typeof resp.url === 'string' && resp.url.startsWith('/')) {
      const backendOrigin = BACKEND_URL.replace('/api/apartment', '');
      resp.url = `${backendOrigin}${resp.url}`;
    }

    return resp;
  } catch (error) {
    console.error('Erreur upload image:', error);
    throw error;
  }
};

export const apartmentApi = {
  // Récupérer les données de la page appartements
  async getApartmentPage(): Promise<ApartmentPageData> {
    return await makeRequest<ApartmentPageData>('');
  },

  // Mettre à jour la page appartements
  async updateApartmentPage(data: Partial<ApartmentPageData>): Promise<ApartmentPageData> {
    const response = await makeRequest<{ message: string; page: ApartmentPageData }>('/', 'PUT', data);
    return response.page;
  },

  // Mettre à jour une section spécifique
  async updateSection(section: string, subsection?: string, data?: any): Promise<ApartmentPageData> {
    const url = subsection 
      ? `/section/${section}/${subsection}`
      : `/section/${section}`;
    
    const response = await makeRequest<{ message: string; page: ApartmentPageData }>(url, 'PUT', data);
    return response.page;
  },

  // Ajouter une chambre
  async addRoom(room: Omit<Room, 'id'>): Promise<ApartmentPageData> {
    const response = await makeRequest<{ message: string; page: ApartmentPageData }>(
      '/rooms',
      'POST',
      { room }
    );
    return response.page;
  },

  // Mettre à jour une chambre
  async updateRoom(id: number, updates: Partial<Room>): Promise<ApartmentPageData> {
    const response = await makeRequest<{ message: string; page: ApartmentPageData }>(
      `/rooms/${id}`,
      'PUT',
      { updates }
    );
    return response.page;
  },

  // Supprimer une chambre
  async deleteRoom(id: number): Promise<ApartmentPageData> {
    const response = await makeRequest<{ message: string; page: ApartmentPageData }>(
      `/rooms/${id}`,
      'DELETE'
    );
    return response.page;
  },

  // Télécharger une image
  async uploadImage(file: File): Promise<{ url: string }> {
    return await uploadImage(file);
  },

  // Méthodes utilitaires pour gérer les données locales
  async saveLocalChanges(data: ApartmentPageData): Promise<void> {
    localStorage.setItem('apartmentPage_draft', JSON.stringify(data));
  },

  async loadLocalChanges(): Promise<ApartmentPageData | null> {
    const draft = localStorage.getItem('apartmentPage_draft');
    return draft ? JSON.parse(draft) : null;
  },

  async clearLocalChanges(): Promise<void> {
    localStorage.removeItem('apartmentPage_draft');
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
    const response = await makeRequest<{ message: string; page: ApartmentPageData }>(
      '/reset',
      'POST'
    );
    return response.page;
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
    const response = await makeRequest<{ message: string; page: ApartmentPageData }>(
      '/import',
      'POST',
      data
    );
    return response.page;
  }
};

export default apartmentApi;