/**
 * Service API pour gérer les uploads d'images via Cloudinary
 */

import { config } from '@/config/env';

export interface UploadResponse {
  url: string;
  publicId?: string;
  success?: boolean;
}

export interface ImageUploadOptions {
  folder?: string;
  quality?: 'auto' | 'low' | 'medium' | 'high';
  format?: 'auto' | 'webp' | 'jpg' | 'png';
}

/**
 * Service pour uploader des images vers Cloudinary via le backend
 */
export const imageUploadService = {
  /**
   * Upload une image pour les services
   */
  uploadServiceImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${config.apiBaseUrl}/services/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token || ''}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload de l\'image');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur upload service image:', error);
      throw error;
    }
  },

  /**
   * Upload une image pour les appartements
   */
  uploadApartmentImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${config.apiBaseUrl}/apartments/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token || ''}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload de l\'image');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur upload apartment image:', error);
      throw error;
    }
  },

  /**
   * Upload une image pour les détails de chambre
   */
  uploadRoomDetailImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${config.apiBaseUrl}/room-details/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token || ''}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload de l\'image');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur upload room detail image:', error);
      throw error;
    }
  },

  /**
   * Upload une image pour la page d'accueil
   */
  uploadHomeImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${config.apiBaseUrl}/home/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token || ''}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload de l\'image');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur upload home image:', error);
      throw error;
    }
  },

  /**
   * Upload une image pour la page de contact
   */
  uploadContactImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${config.apiBaseUrl}/contact/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token || ''}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload de l\'image');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur upload contact image:', error);
      throw error;
    }
  },

  /**
   * Upload une vidéo pour la page d'accueil
   */
  uploadHomeVideo: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('video', file);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${config.apiBaseUrl}/home/upload-video`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token || ''}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'upload de la vidéo');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur upload home video:', error);
      throw error;
    }
  }
};
