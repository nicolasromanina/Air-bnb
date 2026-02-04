import { api } from './api';

export interface UploadResponse {
  url: string;
  publicId?: string;
  success?: boolean;
  filename?: string;
  originalName?: string;
  size?: number;
  mimetype?: string;
}

export interface ImageUploadOptions {
  folder?: string;
  quality?: 'auto' | 'low' | 'medium' | 'high';
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  transformation?: string;
}

export const imageUploadService = {
  /**
   * Upload une image générique
   */
  async uploadImage(file: File, service: string = 'general', options?: ImageUploadOptions): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('service', service);
    
    if (options) {
      if (options.folder) formData.append('folder', options.folder);
      if (options.quality) formData.append('quality', options.quality);
      if (options.format) formData.append('format', options.format);
      if (options.transformation) formData.append('transformation', options.transformation);
    }

    const response = await api.uploadImage(file, service);
    if (response.success) {
      return {
        url: response.data.url,
        publicId: response.data.publicId,
        filename: response.data.filename,
        originalName: response.data.originalName,
        size: response.data.size,
        mimetype: response.data.mimetype,
        success: true
      };
    }
    throw new Error(response.error || 'Erreur lors de l\'upload de l\'image');
  },

  /**
   * Upload une vidéo
   */
  async uploadVideo(file: File, service: string = 'general'): Promise<UploadResponse> {
    const response = await api.uploadVideo(file, service);
    if (response.success) {
      return {
        url: response.data.url,
        publicId: response.data.publicId,
        filename: response.data.filename,
        originalName: response.data.originalName,
        size: response.data.size,
        mimetype: response.data.mimetype,
        success: true
      };
    }
    throw new Error(response.error || 'Erreur lors de l\'upload de la vidéo');
  },

  /**
   * Upload une image pour les services
   */
  async uploadServiceImage(file: File): Promise<UploadResponse> {
    return this.uploadImage(file, 'services');
  },

  /**
   * Upload une image pour les appartements
   */
  async uploadApartmentImage(file: File): Promise<UploadResponse> {
    return this.uploadImage(file, 'apartment');
  },

  /**
   * Upload une image pour les détails de chambre
   */
  async uploadRoomDetailImage(file: File): Promise<UploadResponse> {
    return this.uploadImage(file, 'room-details');
  },

  /**
   * Upload une image pour la page d'accueil
   */
  async uploadHomeImage(file: File): Promise<UploadResponse> {
    return this.uploadImage(file, 'home');
  },

  /**
   * Upload une image pour la page de contact
   */
  async uploadContactImage(file: File): Promise<UploadResponse> {
    return this.uploadImage(file, 'contact');
  },

  /**
   * Upload une image pour le footer
   */
  async uploadFooterImage(file: File): Promise<UploadResponse> {
    return this.uploadImage(file, 'footer');
  },

  /**
   * Upload une vidéo pour la page d'accueil
   */
  async uploadHomeVideo(file: File): Promise<UploadResponse> {
    return this.uploadVideo(file, 'home');
  },

  /**
   * Upload une vidéo pour la page apartment
   */
  async uploadApartmentVideo(file: File): Promise<UploadResponse> {
    return this.uploadVideo(file, 'apartment');
  },

  /**
   * Upload une vidéo pour les détails de chambre
   */
  async uploadRoomDetailVideo(file: File): Promise<UploadResponse> {
    return this.uploadVideo(file, 'room-details');
  },

  /**
   * Upload une image pour les options supplémentaires d'une chambre
   */
  async uploadOptionImage(file: File): Promise<UploadResponse> {
    return this.uploadImage(file, 'options');
  },

  /**
   * Upload multiple images
   */
  async uploadMultipleImages(files: File[], service: string = 'general'): Promise<UploadResponse[]> {
    const uploadPromises = files.map(file => this.uploadImage(file, service));
    return Promise.all(uploadPromises);
  },

  /**
   * Delete an uploaded image
   */
  async deleteImage(publicId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/upload/${publicId}`);
      if (response.success) {
        return {
          success: true,
          message: response.message || 'Image supprimée avec succès'
        };
      }
      return {
        success: false,
        message: response.error || 'Erreur lors de la suppression'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  /**
   * Get image info
   */
  async getImageInfo(publicId: string): Promise<UploadResponse | null> {
    try {
      const response = await api.get(`/upload/${publicId}/info`);
      if (response.success) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération des informations de l\'image:', error);
      return null;
    }
  },

  /**
   * Transform an image
   */
  async transformImage(publicId: string, transformations: any): Promise<string> {
    try {
      const response = await api.post(`/upload/${publicId}/transform`, { transformations });
      if (response.success) {
        return response.data.url;
      }
      throw new Error(response.error || 'Erreur lors de la transformation de l\'image');
    } catch (error) {
      console.error('Erreur lors de la transformation de l\'image:', error);
      throw error;
    }
  },

  /**
   * Validate file before upload
   */
  validateFile(file: File, options?: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
  }): { valid: boolean; error?: string } {
    const maxSize = options?.maxSize || 10 * 1024 * 1024; // 10MB par défaut
    const allowedTypes = options?.allowedTypes || [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml'
    ];

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `Le fichier est trop volumineux. Taille maximale: ${maxSize / (1024 * 1024)}MB`
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Type de fichier non autorisé. Types autorisés: ${allowedTypes.join(', ')}`
      };
    }

    return { valid: true };
  },

  /**
   * Compress image before upload (client-side)
   */
  async compressImage(file: File, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate new dimensions (max 2000px on the longest side)
          let width = img.width;
          let height = img.height;
          const maxDimension = 2000;
          
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Erreur lors de la compression de l\'image'));
              }
            },
            'image/jpeg',
            quality
          );
        };
        
        img.onerror = () => {
          reject(new Error('Erreur lors du chargement de l\'image'));
        };
      };
      
      reader.onerror = () => {
        reject(new Error('Erreur lors de la lecture du fichier'));
      };
    });
  }
};

export default imageUploadService;