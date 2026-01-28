// Services pour communiquer avec l'API backend du CMS
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { IContactPage } from '@/types/contact.types';
import { config } from '@/config/env';

// Configuration de l'instance Axios
const createApiClient = (): AxiosInstance => {
  const baseURL = config.apiBaseUrl || 'https://airbnb-backend-l640.onrender.com/api';
  
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 secondes timeout
  });
};

// Instance API avec intercepteur pour le token d'authentification
const apiClient = createApiClient();

// Ajouter l'intercepteur pour inclure le token JWT
apiClient.interceptors.request.use((config) => {
  // Récupérer le token depuis localStorage ou cookies
  const token = localStorage.getItem('auth_token');
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Gestion des erreurs
const handleApiError = (error: any): never => {
  console.error('API Error:', error.response?.data || error.message);
  
  if (error.response) {
    // Erreur serveur (4xx, 5xx)
    throw new Error(error.response.data.error || 'Une erreur est survenue');
  } else if (error.request) {
    // Pas de réponse du serveur
    throw new Error('Impossible de contacter le serveur');
  } else {
    // Erreur de configuration
    throw new Error('Erreur de configuration');
  }
};

// Interface pour les réponses API
interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// Services pour la page Contact
export const contactServices = {
  // Récupérer la page contact complète
  async getContactPage(): Promise<IContactPage> {
    try {
      const response: AxiosResponse = await apiClient.get('/contact');
      // Backend sometimes returns the page directly, sometimes wrapped in { data: ... } or { page: ... }
      const respData = response.data;
      if (respData?.data) return respData.data;
      if (respData?.page) return respData.page;
      return respData;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Mettre à jour la page contact complète
  async updateContactPage(pageData: Partial<IContactPage>): Promise<ApiResponse<IContactPage>> {
    try {
      const response: AxiosResponse = await apiClient.put('/contact', pageData);
      const respData = response.data;
      // Normalize different backend shapes
      if (respData?.page) return { data: respData.page, message: respData.message || 'OK', status: response.status };
      if (respData?.data) return { data: respData.data, message: respData.message || 'OK', status: response.status };
      // If backend returns the page directly
      return { data: respData, message: respData?.message || 'OK', status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Mettre à jour une section spécifique
  async updateSection(section: string, sectionData: any): Promise<ApiResponse<IContactPage>> {
    try {
      const response: AxiosResponse<ApiResponse<IContactPage>> = await apiClient.put(`/contact/section/${section}`, sectionData);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Ajouter un témoignage
  async addTestimonial(testimonial: any): Promise<ApiResponse<any>> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/contact/testimonials', testimonial);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Ajouter un élément à la galerie
  async addGalleryItem(galleryItem: any): Promise<ApiResponse<any>> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/contact/gallery', galleryItem);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Soumettre un formulaire de contact
  async submitContactForm(data: {
    fullName: string;
    email: string;
    phone: string;
    message: string;
    consent: boolean;
  }): Promise<ApiResponse<any>> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/contact-messages/submit', data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Upload d'image
  async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      // Pour l'exemple, on simule l'upload
      // En réalité, vous devriez avoir un endpoint dédié
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
      
      // Pour une vraie implémentation:
      // const response = await apiClient.post('/upload', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
      // return response.data.url;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Vérifier la santé de l'API
  async healthCheck(): Promise<boolean> {
    try {
      const response = await apiClient.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  },
};

// Hook personnalisé pour utiliser les services
import { useState, useEffect, useCallback } from 'react';

export const useContactPage = () => {
  const [pageData, setPageData] = useState<IContactPage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPageData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contactServices.getContactPage();
      setPageData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      console.error('Erreur lors du chargement de la page contact:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePageData = useCallback(async (newData: Partial<IContactPage>) => {
    try {
      setError(null);
      const result = await contactServices.updateContactPage(newData);
      setPageData(result.data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      setError(errorMessage);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  return {
    pageData,
    loading,
    error,
    fetchPageData,
    updatePageData,
  };
};

// Exporter par défaut tous les services
export default {
  contact: contactServices,
  healthCheck: contactServices.healthCheck,
  useContactPage,
};