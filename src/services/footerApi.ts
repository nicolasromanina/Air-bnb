import { api } from './api';

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
  alt: string;
}

export interface FooterGalleryImage {
  _id?: string;
  image: string;
  alt: string;
  order: number;
}

export interface FooterData {
  logo: FooterLogo;
  description: string;
  linkGroups: FooterLinkGroup[];
  gallery: FooterGalleryImage[];
  contactInfo: {
    address: string;
    phone: string;
    email: string;
  };
  socialMedia: Array<{
    platform: string;
    icon: string;
    url: string;
  }>;
  copyright: string;
  meta: {
    updatedAt: string;
    updatedBy: string;
    version: number;
  };
}

export const footerServices = {
  // Récupérer les données du footer
  async getFooterData(): Promise<FooterData> {
    const response = await api.get('/footer');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la récupération du footer');
  },

  // Mettre à jour le footer
  async updateFooterData(footerData: Partial<FooterData>): Promise<FooterData> {
    const response = await api.put('/footer', footerData);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la mise à jour du footer');
  },

  // Uploader un logo
  async uploadLogo(file: File, alt?: string): Promise<{ url: string; alt: string }> {
    const formData = new FormData();
    formData.append('logo', file);
    if (alt) {
      formData.append('alt', alt);
    }

    const response = await api.uploadImage(file, 'footer');
    if (response.success) {
      return {
        url: response.data.url,
        alt: alt || 'Logo'
      };
    }
    throw new Error(response.error || 'Erreur lors de l\'upload du logo');
  },

  // Uploader une image de galerie
  async uploadGalleryImage(file: File, alt?: string, order?: number): Promise<{ url: string; alt: string; order: number }> {
    const response = await api.uploadImage(file, 'footer');
    if (response.success) {
      return {
        url: response.data.url,
        alt: alt || 'Gallery image',
        order: order || 0
      };
    }
    throw new Error(response.error || 'Erreur lors de l\'upload de l\'image de galerie');
  },

  // Uploader plusieurs images
  async uploadMultipleGalleryImages(files: File[], altTexts?: string[]): Promise<Array<{ url: string; alt: string; order: number }>> {
    const uploadPromises = files.map((file, index) => {
      const alt = altTexts?.[index] || `Image ${index + 1}`;
      return this.uploadGalleryImage(file, alt, index);
    });

    return Promise.all(uploadPromises);
  },

  // Supprimer une image de galerie
  async deleteGalleryImage(imageId: string): Promise<FooterData> {
    const response = await api.delete(`/footer/gallery/${imageId}`);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la suppression de l\'image de galerie');
  },

  // Mettre à jour l'ordre des images
  async updateGalleryOrder(orderedImages: FooterGalleryImage[]): Promise<FooterData> {
    const response = await api.put('/footer/gallery/order', { orderedImages });
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la mise à jour de l\'ordre des images');
  },

  // Upload générique d'image
  async uploadImage(file: File): Promise<string> {
    const response = await api.uploadImage(file, 'footer');
    if (response.success) {
      return response.data.url;
    }
    throw new Error(response.error || 'Erreur lors du téléchargement de l\'image');
  },

  // Vérifier la santé de l'API
  async healthCheck(): Promise<boolean> {
    try {
      const response = await api.healthCheck();
      return response.success;
    } catch {
      return false;
    }
  },

  // Gestion du cache local
  async saveLocalChanges(data: FooterData): Promise<void> {
    try {
      localStorage.setItem('footer_draft', JSON.stringify(data));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde locale:', error);
    }
  },

  async loadLocalChanges(): Promise<FooterData | null> {
    try {
      const draft = localStorage.getItem('footer_draft');
      return draft ? JSON.parse(draft) : null;
    } catch (error) {
      console.error('Erreur lors du chargement local:', error);
      return null;
    }
  },

  async clearLocalChanges(): Promise<void> {
    try {
      localStorage.removeItem('footer_draft');
    } catch (error) {
      console.error('Erreur lors du nettoyage local:', error);
    }
  },

  // Synchroniser avec le serveur
  async syncWithServer(): Promise<FooterData> {
    const draft = await this.loadLocalChanges();
    if (draft) {
      const serverData = await this.updateFooterData(draft);
      await this.clearLocalChanges();
      return serverData;
    } else {
      return await this.getFooterData();
    }
  },

  // Obtenir les statistiques
  async getStats(): Promise<{
    linkGroups: number;
    totalLinks: number;
    galleryImages: number;
    socialMedia: number;
    lastUpdated: string;
  }> {
    const data = await this.getFooterData();
    
    const totalLinks = data.linkGroups.reduce((sum, group) => sum + group.links.length, 0);
    
    return {
      linkGroups: data.linkGroups.length,
      totalLinks,
      galleryImages: data.gallery.length,
      socialMedia: data.socialMedia.length,
      lastUpdated: data.meta.updatedAt
    };
  },

  // Réinitialiser aux valeurs par défaut
  async resetToDefaults(): Promise<FooterData> {
    const response = await api.post('/footer/reset');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la réinitialisation');
  },

  // Exporter les données
  async exportData(): Promise<{ data: FooterData; timestamp: string }> {
    const data = await this.getFooterData();
    return {
      data,
      timestamp: new Date().toISOString()
    };
  },

  // Importer des données
  async importData(data: FooterData): Promise<FooterData> {
    const response = await api.post('/footer/import', data);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de l\'importation');
  }
};

// Hook React personnalisé pour utiliser les services
import { useState, useEffect, useCallback } from 'react';

export const useFooterData = () => {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
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

  const updateFooterData = useCallback(async (newData: Partial<FooterData>) => {
    try {
      setError(null);
      const result = await footerServices.updateFooterData(newData);
      setFooterData(result);
      return { success: true, message: 'Mise à jour réussie' };
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

export default footerServices;