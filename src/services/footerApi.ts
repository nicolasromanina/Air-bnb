import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { IFooterData } from '@/types/footer.types';
import { config } from '@/config/env';

const createApiClient = (): AxiosInstance => {
  const baseURL = config.apiBaseUrl || 'https://airbnb-backend-l640.onrender.com/api';
  
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  });
};

const apiClient = createApiClient();

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const handleApiError = (error: any): never => {
  console.error('Footer API Error:', error.response?.data || error.message);
  
  if (error.response) {
    throw new Error(error.response.data.error || 'Une erreur est survenue');
  } else if (error.request) {
    throw new Error('Impossible de contacter le serveur');
  } else {
    throw new Error('Erreur de configuration');
  }
};

interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export const footerServices = {
  // Récupérer les données du footer
  async getFooterData(): Promise<IFooterData> {
    try {
      const response: AxiosResponse = await apiClient.get('/footer');
      const respData = response.data;
      return respData;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Mettre à jour le footer
  async updateFooterData(footerData: Partial<IFooterData>): Promise<ApiResponse<IFooterData>> {
    try {
      const response: AxiosResponse = await apiClient.put('/footer', footerData);
      const respData = response.data;
      return {
        data: respData.footer || respData,
        message: respData.message || 'OK',
        status: response.status
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Uploader un logo
  async uploadLogo(file: File, alt?: string): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('logo', file);
      if (alt) {
        formData.append('alt', alt);
      }

      const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/footer/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Uploader une image de galerie
  async uploadGalleryImage(file: File, alt?: string, order?: number): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      if (alt) formData.append('alt', alt);
      if (order) formData.append('order', order.toString());

      const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/footer/gallery', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Uploader plusieurs images
  async uploadMultipleGalleryImages(files: File[], altTexts?: string[]): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });
      if (altTexts) {
        formData.append('altTexts', JSON.stringify(altTexts));
      }

      const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/footer/gallery/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Supprimer une image de galerie
  async deleteGalleryImage(imageId: string): Promise<ApiResponse<any>> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await apiClient.delete(`/footer/gallery/${imageId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Mettre à jour l'ordre des images
  async updateGalleryOrder(orderedImages: any[]): Promise<ApiResponse<any>> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await apiClient.put('/footer/gallery/order', {
        orderedImages
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Upload générique d'image
  async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await apiClient.post('/footer/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.url;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Vérifier la santé de l'API
  async healthCheck(): Promise<boolean> {
    try {
      const response = await apiClient.get('/footer');
      return response.status === 200;
    } catch {
      return false;
    }
  },
};

// Hook React pour utiliser les services
import { useState, useEffect, useCallback } from 'react';

export const useFooterData = () => {
  const [footerData, setFooterData] = useState<IFooterData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFooterData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await footerServices.getFooterData();
      setFooterData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      console.error('Erreur lors du chargement du footer:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFooterData = useCallback(async (newData: Partial<IFooterData>) => {
    try {
      setError(null);
      const result = await footerServices.updateFooterData(newData);
      setFooterData(result.data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      setError(errorMessage);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchFooterData();
  }, [fetchFooterData]);

  return {
    footerData,
    loading,
    error,
    fetchFooterData,
    updateFooterData,
  };
};

// Types pour le frontend
export interface FooterGalleryImage {
  _id?: string;
  image: string;
  cloudinaryPublicId?: string;
  alt: string;
  order: number;
}

export interface FooterLink {
  text: string;
  url: string;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface FooterLogo {
  url: string;
  cloudinaryPublicId?: string;
  alt: string;
}

export default {
  footer: footerServices,
  useFooterData,
};