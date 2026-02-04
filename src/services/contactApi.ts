import { api } from './api';

export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
}

export interface Testimonial {
  _id?: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
  date: string;
}

export interface GalleryImage {
  _id?: string;
  image: string;
  alt: string;
  order: number;
}

export interface ContactPageData {
  heroSection: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    contactInfo: {
      phone: string;
      email: string;
      address: string;
    };
  };
  contactForm: {
    title: string;
    subtitle: string;
    submitButton: string;
    fields: Array<{
      name: string;
      label: string;
      type: string;
      required: boolean;
      placeholder?: string;
    }>;
  };
  testimonialsSection: {
    title: string;
    subtitle: string;
    testimonials: Testimonial[];
  };
  gallerySection: {
    title: string;
    subtitle: string;
    images: GalleryImage[];
  };
  mapSection: {
    title: string;
    subtitle: string;
    iframeUrl: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  meta: {
    updatedAt: string;
    updatedBy: string;
    version: number;
  };
}

export const contactServices = {
  // Récupérer la page contact complète
  async getContactPage(): Promise<ContactPageData> {
    const response = await api.get('/contact');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la récupération de la page contact');
  },

  // Mettre à jour la page contact complète
  async updateContactPage(pageData: Partial<ContactPageData>): Promise<ContactPageData> {
    const response = await api.put('/contact', pageData);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la mise à jour de la page contact');
  },

  // Mettre à jour une section spécifique
  async updateSection(section: string, sectionData: any): Promise<ContactPageData> {
    const response = await api.put(`/contact/section/${section}`, sectionData);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || `Erreur lors de la mise à jour de la section ${section}`);
  },

  // Ajouter un témoignage
  async addTestimonial(testimonial: Omit<Testimonial, '_id' | 'date'>): Promise<ContactPageData> {
    const response = await api.post('/contact/testimonials', testimonial);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de l\'ajout du témoignage');
  },

  // Mettre à jour un témoignage
  async updateTestimonial(id: string, testimonial: Partial<Testimonial>): Promise<ContactPageData> {
    const response = await api.put(`/contact/testimonials/${id}`, testimonial);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la mise à jour du témoignage');
  },

  // Supprimer un témoignage
  async deleteTestimonial(id: string): Promise<ContactPageData> {
    const response = await api.delete(`/contact/testimonials/${id}`);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la suppression du témoignage');
  },

  // Ajouter un élément à la galerie
  async addGalleryItem(galleryItem: Omit<GalleryImage, '_id'>): Promise<ContactPageData> {
    const response = await api.post('/contact/gallery', galleryItem);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de l\'ajout de l\'image à la galerie');
  },

  // Mettre à jour un élément de la galerie
  async updateGalleryItem(id: string, galleryItem: Partial<GalleryImage>): Promise<ContactPageData> {
    const response = await api.put(`/contact/gallery/${id}`, galleryItem);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la mise à jour de l\'image de la galerie');
  },

  // Supprimer un élément de la galerie
  async deleteGalleryItem(id: string): Promise<ContactPageData> {
    const response = await api.delete(`/contact/gallery/${id}`);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la suppression de l\'image de la galerie');
  },

  // Soumettre un formulaire de contact
  async submitContactForm(data: ContactFormData): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/contact/submit', data);
    if (response.success) {
      return {
        success: true,
        message: response.message || 'Message envoyé avec succès'
      };
    }
    return {
      success: false,
      message: response.error || 'Erreur lors de l\'envoi du message'
    };
  },

  // Upload d'image
  async uploadImage(file: File): Promise<string> {
    const response = await api.uploadImage(file, 'contact');
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
  async saveLocalChanges(data: ContactPageData): Promise<void> {
    try {
      localStorage.setItem('contactPage_draft', JSON.stringify(data));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde locale:', error);
    }
  },

  async loadLocalChanges(): Promise<ContactPageData | null> {
    try {
      const draft = localStorage.getItem('contactPage_draft');
      return draft ? JSON.parse(draft) : null;
    } catch (error) {
      console.error('Erreur lors du chargement local:', error);
      return null;
    }
  },

  async clearLocalChanges(): Promise<void> {
    try {
      localStorage.removeItem('contactPage_draft');
    } catch (error) {
      console.error('Erreur lors du nettoyage local:', error);
    }
  },

  // Synchroniser avec le serveur
  async syncWithServer(): Promise<ContactPageData> {
    const draft = await this.loadLocalChanges();
    if (draft) {
      const serverData = await this.updateContactPage(draft);
      await this.clearLocalChanges();
      return serverData;
    } else {
      return await this.getContactPage();
    }
  },

  // Obtenir les statistiques
  async getStats(): Promise<{
    testimonials: number;
    galleryImages: number;
    contactFields: number;
    lastUpdated: string;
  }> {
    const data = await this.getContactPage();
    
    return {
      testimonials: data.testimonialsSection.testimonials.length,
      galleryImages: data.gallerySection.images.length,
      contactFields: data.contactForm.fields.length,
      lastUpdated: data.meta.updatedAt
    };
  },

  // Réinitialiser aux valeurs par défaut
  async resetToDefaults(): Promise<ContactPageData> {
    const response = await api.post('/contact/reset');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la réinitialisation');
  },

  // Exporter les données
  async exportData(): Promise<{ data: ContactPageData; timestamp: string }> {
    const data = await this.getContactPage();
    return {
      data,
      timestamp: new Date().toISOString()
    };
  },

  // Importer des données
  async importData(data: ContactPageData): Promise<ContactPageData> {
    const response = await api.post('/contact/import', data);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de l\'importation');
  }
};

// Hook React personnalisé pour utiliser les services
import { useState, useEffect, useCallback } from 'react';

export const useContactPage = () => {
  const [pageData, setPageData] = useState<ContactPageData | null>(null);
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

  const updatePageData = useCallback(async (newData: Partial<ContactPageData>) => {
    try {
      setError(null);
      const result = await contactServices.updateContactPage(newData);
      setPageData(result);
      return { success: true, message: 'Mise à jour réussie' };
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

export default contactServices;