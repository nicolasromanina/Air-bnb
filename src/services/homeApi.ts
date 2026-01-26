// src/services/homeApi.ts

import { HomePageData, IHomePage } from '../types/home.types';

// In the browser `process` is not defined (Vite uses `import.meta.env`).
// Use `process.env` when available (node envs) otherwise fall back to Vite's `import.meta.env`.
const API_BASE_URL = (
  typeof process !== 'undefined' && (process as any)?.env?.NEXT_PUBLIC_API_URL
) || (import.meta as any)?.env?.VITE_API_URL || 'https://airbnb-backend.onrender.com/api';

const HOME_ENDPOINT = `${API_BASE_URL}/home`;

/**
 * Gestion des erreurs HTTP
 */
class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

/**
 * Service API pour la gestion de la page d'accueil
 */
class HomeApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      credentials: 'include',
    };

    try {
      const response = await fetch(endpoint, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new HttpError(
          response.status,
          errorData.error || `HTTP Error ${response.status}`,
          errorData.details
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(
        0,
        'Network error or server unreachable',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      // Pour Next.js, vous pouvez adapter selon votre méthode de stockage
      return localStorage.getItem('auth_token') || 
             sessionStorage.getItem('auth_token') ||
             null;
    }
    return null;
  }

  /**
   * Récupérer la page d'accueil
   */
  async getHomePage(): Promise<HomePageData> {
    try {
      const response = await this.request<HomePageData>(HOME_ENDPOINT, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      console.error('Error fetching home page:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour toute la page d'accueil
   */
  async updateHomePage(data: Partial<IHomePage>): Promise<{ message: string; page: HomePageData }> {
    try {
      const response = await this.request<{ message: string; page: HomePageData }>(
        HOME_ENDPOINT,
        {
          method: 'PUT',
          body: JSON.stringify(data),
        }
      );

      return response;
    } catch (error) {
      console.error('Error updating home page:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour une section spécifique
   */
  async updateSection(
    section: string,
    data: any
  ): Promise<{ message: string; page: HomePageData }> {
    try {
      const response = await this.request<{ message: string; page: HomePageData }>(
        `${HOME_ENDPOINT}/section/${section}`,
        {
          method: 'PUT',
          body: JSON.stringify(data),
        }
      );

      return response;
    } catch (error) {
      console.error(`Error updating section ${section}:`, error);
      throw error;
    }
  }

  /**
   * Vérifier les sections valides
   */
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
  }

  /**
   * Méthode utilitaire pour formater les données avant envoi
   */
  formatHomePageData(data: Partial<IHomePage>): any {
    // Vous pouvez ajouter des transformations ici si nécessaire
    return data;
  }

  /**
   * Récupérer l'historique des versions (si vous implémentez cette fonctionnalité plus tard)
   */
  async getVersionHistory(): Promise<any> {
    try {
      // Cette route n'existe pas encore dans votre backend
      // Vous pouvez l'ajouter ultérieurement
      const response = await this.request<any>(`${HOME_ENDPOINT}/versions`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      console.error('Error fetching version history:', error);
      throw error;
    }
  }

  /**
   * Restaurer une version précédente (si vous implémentez cette fonctionnalité)
   */
  async restoreVersion(versionId: string): Promise<any> {
    try {
      const response = await this.request<any>(
        `${HOME_ENDPOINT}/restore/${versionId}`,
        {
          method: 'POST',
        }
      );

      return response;
    } catch (error) {
      console.error('Error restoring version:', error);
      throw error;
    }
  }

  /**
   * Télécharger une image (méthode utilitaire)
   */
  async uploadImage(file: File): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      // Note: Vous aurez besoin d'une route dédiée pour l'upload d'images
      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      return response.json();
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Test de connexion au serveur
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

/**
 * Hook React personnalisé pour utiliser le service
 */
// Pour Next.js/React, vous pouvez créer un hook custom
export const useHomeApi = () => {
  const homeApi = new HomeApiService();

  const getHomePage = async () => {
    try {
      return await homeApi.getHomePage();
    } catch (error) {
      // Gérer l'erreur selon votre contexte d'application
      if (error instanceof HttpError) {
        // Afficher un message à l'utilisateur
        console.error(`HTTP Error ${error.status}: ${error.message}`);
      }
      throw error;
    }
  };

  const updateHomePage = async (data: Partial<IHomePage>) => {
    try {
      return await homeApi.updateHomePage(data);
    } catch (error) {
      console.error('Failed to update home page:', error);
      throw error;
    }
  };

  const updateSection = async (section: string, data: any) => {
    if (!homeApi.isValidSection(section)) {
      throw new Error(`Invalid section: ${section}`);
    }

    try {
      return await homeApi.updateSection(section, data);
    } catch (error) {
      console.error(`Failed to update section ${section}:`, error);
      throw error;
    }
  };

  return {
    getHomePage,
    updateHomePage,
    updateSection,
    isValidSection: homeApi.isValidSection,
    testConnection: homeApi.testConnection,
    uploadImage: homeApi.uploadImage,
  };
};

/**
 * Instance singleton pour une utilisation directe
 */
export const homeApi = new HomeApiService();

// Exporter les types d'erreur pour une meilleure gestion
export { HttpError };