import { api } from './api';

export interface CMSPage {
  _id?: string;
  slug: string;
  title: string;
  content: string;
  html?: string;
  meta?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CMSSnapshot {
  _id?: string;
  pageId: string;
  data: CMSPage;
  version: number;
  createdBy?: string;
  createdAt: string;
}

export const cmsService = {
  // Récupérer une page par son slug
  async getPage(slug: string): Promise<CMSPage | null> {
    try {
      const response = await api.get(`/cms/${slug}`);
      if (response.success) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la page ${slug}:`, error);
      return null;
    }
  },

  // Récupérer toutes les pages
  async getAllPages(): Promise<CMSPage[]> {
    try {
      const response = await api.get('/cms');
      if (response.success) {
        return response.data || [];
      }
      return [];
    } catch (error) {
      console.error('Erreur lors de la récupération des pages:', error);
      return [];
    }
  },

  // Créer une nouvelle page
  async createPage(page: Omit<CMSPage, '_id' | 'createdAt' | 'updatedAt'>): Promise<CMSPage | null> {
    try {
      const response = await api.post('/cms', page);
      if (response.success) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la création de la page:', error);
      return null;
    }
  },

  // Mettre à jour une page
  async updatePage(slug: string, updates: Partial<CMSPage>): Promise<CMSPage | null> {
    try {
      const response = await api.put(`/cms/${slug}`, updates);
      if (response.success) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la page ${slug}:`, error);
      return null;
    }
  },

  // Supprimer une page
  async deletePage(slug: string): Promise<boolean> {
    try {
      const response = await api.delete(`/cms/${slug}`);
      return response.success;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la page ${slug}:`, error);
      return false;
    }
  },

  // Récupérer l'historique d'une page
  async getPageHistory(slug: string): Promise<CMSSnapshot[]> {
    try {
      const response = await api.get(`/cms/${slug}/history`);
      if (response.success) {
        return response.data || [];
      }
      return [];
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'historique de la page ${slug}:`, error);
      return [];
    }
  },

  // Restaurer une version précédente
  async restoreSnapshot(slug: string, snapshotId: string): Promise<CMSPage | null> {
    try {
      const response = await api.post(`/cms/${slug}/restore/${snapshotId}`);
      if (response.success) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error(`Erreur lors de la restauration du snapshot ${snapshotId}:`, error);
      return null;
    }
  },

  // Uploader une image pour le CMS
  async uploadImage(file: File): Promise<string | null> {
    try {
      const response = await api.uploadImage(file, 'cms');
      if (response.success) {
        return response.data.url;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image:', error);
      return null;
    }
  },

  // Rechercher dans les pages
  async searchPages(query: string): Promise<CMSPage[]> {
    try {
      const response = await api.get(`/cms/search?q=${encodeURIComponent(query)}`);
      if (response.success) {
        return response.data || [];
      }
      return [];
    } catch (error) {
      console.error(`Erreur lors de la recherche "${query}":`, error);
      return [];
    }
  },

  // Obtenir les statistiques
  async getStats(): Promise<{
    totalPages: number;
    activePages: number;
    inactivePages: number;
    recentUpdates: number;
  }> {
    try {
      const response = await api.get('/cms/stats');
      if (response.success) {
        return response.data;
      }
      return {
        totalPages: 0,
        activePages: 0,
        inactivePages: 0,
        recentUpdates: 0
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        totalPages: 0,
        activePages: 0,
        inactivePages: 0,
        recentUpdates: 0
      };
    }
  },

  // Exporter toutes les pages
  async exportAllPages(): Promise<{ data: CMSPage[]; timestamp: string }> {
    try {
      const pages = await this.getAllPages();
      return {
        data: pages,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erreur lors de l\'exportation des pages:', error);
      throw error;
    }
  },

  // Importer des pages
  async importPages(pages: CMSPage[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const page of pages) {
      try {
        const result = await this.createPage(page);
        if (result) {
          success++;
        } else {
          failed++;
        }
      } catch (error) {
        console.error(`Erreur lors de l'importation de la page ${page.slug}:`, error);
        failed++;
      }
    }

    return { success, failed };
  }
};

export default cmsService;