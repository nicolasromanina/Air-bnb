import { api } from './api';

export interface RoomDetail {
  _id?: string;
  id?: number;
  roomId: number;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  guests: string;
  bedrooms: string;
  images: string[];
  videoUrl?: string;
  features: string[];
  city?: string;
  country?: string;
  accommodationType?: string;
  includes?: string[];
  amenities?: string[];
  selectedOptionIds?: string[];
  additionalOptions?: {
    optionId: string;
    name: string;
    price: number;
    quantity: number;
    pricingType: 'fixed' | 'per_day' | 'per_guest';
    image?: string;
  }[];
  meta?: {
    createdAt?: string;
    updatedAt?: string;
    updatedBy?: string;
    version?: number;
  };
}

export interface HeroInfo {
  title: string;
  subtitle: string;
  description: string;
  accommodationType?: string;
  images: string[];
}

export interface PricingInfo {
  price: number;
  currency?: string;
}

export interface GuestBedInfo {
  guests: string;
  bedrooms: string;
  city?: string;
  country?: string;
}

export interface RoomImages {
  images: string[];
  mainImageUrl?: string;
}

export interface RoomFeatures {
  features: string[];
  includes?: string[];
  amenities?: string[];
}

export interface UpdateRoomDetailPayload {
  title?: string;
  subtitle?: string;
  description?: string;
  price?: number;
  guests?: string;
  bedrooms?: string;
  images?: string[];
  videoUrl?: string;
  features?: string[];
  city?: string;
  country?: string;
  accommodationType?: string;
  includes?: string[];
  amenities?: string[];
  selectedOptionIds?: string[];
  additionalOptions?: {
    optionId: string;
    name: string;
    price: number;
    quantity: number;
    pricingType: 'fixed' | 'per_day' | 'per_guest';
    image?: string;
  }[];
}

export const roomDetailApi = {
  // Récupérer les détails d'une chambre
  async getRoomDetail(roomId: number): Promise<RoomDetail> {
    console.log('[roomDetailApi] 🔍 getRoomDetail called with roomId:', roomId);
    
    try {
      const response = await api.get(`/room-details/${roomId}`);
      
      if (response.success) {
        console.log('[roomDetailApi] ✅ Room detail retrieved:', {
          roomId: response.data?.roomId,
          title: response.data?.title
        });
        return response.data!;
      }
      
      // Fallback vers apartment-details si room-details échoue
      console.log('[roomDetailApi] ⚠️ room-details failed, attempting apartment-details fallback');
      const fallbackResponse = await api.get(`/apartment-details/${roomId}`);
      
      if (fallbackResponse.success) {
        console.log('[roomDetailApi] ✅ Apartment-details fallback succeeded');
        return fallbackResponse.data!;
      }
      
      throw new Error(fallbackResponse.error || 'Erreur lors de la récupération des détails de la chambre');
    } catch (error) {
      console.error('[roomDetailApi] ❌ Error fetching room detail:', error);
      throw error;
    }
  },
  
  // Mettre à jour une chambre
  async updateRoomDetail(roomId: number, data: Partial<RoomDetail>): Promise<RoomDetail> {
    console.log('[roomDetailApi] 🔄 updateRoomDetail called with:', { roomId, dataKeys: Object.keys(data) });
    
    try {
      const response = await api.put(`/room-details/${roomId}`, data);
      
      if (response.success) {
        console.log('[roomDetailApi] ✅ Room detail updated successfully');
        return response.data!;
      }
      
      // Fallback vers apartment-details
      console.log('[roomDetailApi] ⚠️ room-details update failed, attempting apartment-details fallback');
      const fallbackResponse = await api.put(`/apartment-details/${roomId}`, data);
      
      if (fallbackResponse.success) {
        console.log('[roomDetailApi] ✅ Apartment-details update succeeded');
        return fallbackResponse.data!;
      }
      
      throw new Error(fallbackResponse.error || 'Erreur lors de la mise à jour de la chambre');
    } catch (error) {
      console.error('[roomDetailApi] ❌ Error updating room detail:', error);
      throw error;
    }
  },
  
  // Mettre à jour les informations de hero
  async updateHeroInfo(roomId: number, heroInfo: Partial<HeroInfo>): Promise<RoomDetail> {
    const payload: UpdateRoomDetailPayload = {
      ...(heroInfo.title && { title: heroInfo.title }),
      ...(heroInfo.subtitle && { subtitle: heroInfo.subtitle }),
      ...(heroInfo.description && { description: heroInfo.description }),
      ...(heroInfo.accommodationType && { accommodationType: heroInfo.accommodationType }),
      ...(heroInfo.images && { images: heroInfo.images }),
    };
    
    console.log('[roomDetailApi] 🔄 updateHeroInfo called:', { roomId, payload });
    
    return await this.updateRoomDetail(roomId, payload);
  },

  // Mettre à jour le prix
  async updatePricing(roomId: number, pricingInfo: PricingInfo): Promise<RoomDetail> {
    console.log('[roomDetailApi] 🔄 updatePricing called:', { roomId, pricingInfo });
    return await this.updateRoomDetail(roomId, { price: pricingInfo.price });
  },

  // Mettre à jour le nombre d'invités et de chambres
  async updateGuestBedInfo(roomId: number, guestBedInfo: GuestBedInfo): Promise<RoomDetail> {
    console.log('[roomDetailApi] 🔄 updateGuestBedInfo called:', { roomId, guestBedInfo });
    return await this.updateRoomDetail(roomId, { 
      guests: guestBedInfo.guests,
      bedrooms: guestBedInfo.bedrooms,
      ...(guestBedInfo.city && { city: guestBedInfo.city }),
      ...(guestBedInfo.country && { country: guestBedInfo.country }),
    });
  },

  // Mettre à jour la ville et le pays
  async updateCityCountry(roomId: number, city: string, country: string): Promise<RoomDetail> {
    console.log('[roomDetailApi] 🔄 updateCityCountry called:', { roomId, city, country });
    return await this.updateRoomDetail(roomId, { city, country });
  },

  // Mettre à jour les images
  async updateImages(roomId: number, imageUrls: string[]): Promise<RoomDetail> {
    console.log('[roomDetailApi] 🔄 updateImages called:', { roomId, imageCount: imageUrls.length });
    return await this.updateRoomDetail(roomId, { images: imageUrls });
  },

  // Ajouter une image
  async addImage(roomId: number, imageUrl: string): Promise<RoomDetail> {
    try {
      console.log('[roomDetailApi] ➕ addImage called:', { roomId, imageUrl });
      const room = await this.getRoomDetail(roomId);
      const updatedImages = [...(room.images || []), imageUrl];
      return await this.updateRoomDetail(roomId, { images: updatedImages });
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'image:', error);
      throw error;
    }
  },

  // Supprimer une image
  async removeImage(roomId: number, imageUrl: string): Promise<RoomDetail> {
    try {
      console.log('[roomDetailApi] ➖ removeImage called:', { roomId, imageUrl });
      const room = await this.getRoomDetail(roomId);
      const updatedImages = (room.images || []).filter(img => img !== imageUrl);
      return await this.updateRoomDetail(roomId, { images: updatedImages });
    } catch (error) {
      console.error('Erreur lors de la suppression d\'image:', error);
      throw error;
    }
  },

  // Réorganiser les images
  async reorderImages(roomId: number, imageUrls: string[]): Promise<RoomDetail> {
    console.log('[roomDetailApi] 🔄 reorderImages called:', { roomId, imageCount: imageUrls.length });
    return await this.updateRoomDetail(roomId, { images: imageUrls });
  },

  // Télécharger une image
  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    console.log('[roomDetailApi] 📤 uploadImage called:', { 
      filename: file.name, 
      size: file.size,
      type: file.type
    });

    try {
      const response = await api.uploadImage(file, 'room-details');
      
      if (response.success) {
        console.log('[roomDetailApi] ✅ Upload success:', response.data);
        return {
          url: response.data.url,
          filename: response.data.filename || file.name
        };
      }
      
      throw new Error(response.error || 'Erreur lors du téléchargement de l\'image');
    } catch (error) {
      console.error('[roomDetailApi] ❌ Error uploading image:', error);
      throw error;
    }
  },
  
  // --- Gestion des brouillons locaux ---
  
  // Sauvegarder localement
  saveLocalChanges(roomId: number, data: RoomDetail): void {
    console.log('[roomDetailApi] 💾 Saving local changes for room:', roomId);
    try {
      localStorage.setItem(`roomDetail_${roomId}_draft`, JSON.stringify(data));
    } catch (error) {
      console.error('[roomDetailApi] ❌ Error saving local changes:', error);
    }
  },

  // Charger les changements locaux
  getLocalChanges(roomId: number): RoomDetail | null {
    try {
      const data = localStorage.getItem(`roomDetail_${roomId}_draft`);
      if (data) {
        console.log('[roomDetailApi] 📂 Loading local changes for room:', roomId);
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error('[roomDetailApi] ❌ Error loading local changes:', error);
      return null;
    }
  },

  // Valider les données d'entrée
  validateRoomDetail(data: Partial<UpdateRoomDetailPayload>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.price !== undefined && data.price < 0) {
      errors.push('Le prix ne peut pas être négatif');
    }

    if (data.title && data.title.trim().length === 0) {
      errors.push('Le titre ne peut pas être vide');
    }

    if (data.description && data.description.trim().length === 0) {
      errors.push('La description ne peut pas être vide');
    }

    if (data.images && !Array.isArray(data.images)) {
      errors.push('Les images doivent être un tableau');
    }

    if (data.features && !Array.isArray(data.features)) {
      errors.push('Les fonctionnalités doivent être un tableau');
    }

    const valid = errors.length === 0;
    console.log('[roomDetailApi] 🔍 Validation result:', { valid, errorCount: errors.length });
    
    return {
      valid,
      errors,
    };
  },

  // Sauvegarder les modifications localement avec versioning
  saveLocalDraft(roomId: number, data: RoomDetail, version: number = 1): void {
    console.log('[roomDetailApi] 💾 Saving draft v' + version + ' for room:', roomId);
    try {
      const draft = {
        ...data,
        meta: {
          ...(data.meta || {}),
          version,
          updatedAt: new Date().toISOString(),
        },
      };
      localStorage.setItem(`roomDetail_${roomId}_draft`, JSON.stringify(draft));
      localStorage.setItem(`roomDetail_${roomId}_draft_timestamp`, new Date().toISOString());
    } catch (error) {
      console.error('[roomDetailApi] ❌ Error saving draft:', error);
    }
  },

  // Récupérer le timestamp du brouillon
  getLocalDraftTimestamp(roomId: number): string | null {
    try {
      return localStorage.getItem(`roomDetail_${roomId}_draft_timestamp`);
    } catch (error) {
      console.error('[roomDetailApi] ❌ Error getting draft timestamp:', error);
      return null;
    }
  },

  // Supprimer le brouillon local après sauvegarde
  clearLocalDraft(roomId: number): void {
    console.log('[roomDetailApi] 🗑️ Clearing draft for room:', roomId);
    try {
      localStorage.removeItem(`roomDetail_${roomId}_draft`);
      localStorage.removeItem(`roomDetail_${roomId}_draft_timestamp`);
    } catch (error) {
      console.error('[roomDetailApi] ❌ Error clearing draft:', error);
    }
  },

  // Obtenir tous les brouillons locaux
  getAllLocalDrafts(): Record<string, RoomDetail> {
    const drafts: Record<string, RoomDetail> = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('roomDetail_') && key?.endsWith('_draft')) {
          const roomId = key.replace('roomDetail_', '').replace('_draft', '');
          const data = localStorage.getItem(key);
          if (data) {
            drafts[roomId] = JSON.parse(data);
          }
        }
      }
      console.log('[roomDetailApi] 📚 Found drafts:', Object.keys(drafts));
    } catch (error) {
      console.error('[roomDetailApi] ❌ Error getting all drafts:', error);
    }
    return drafts;
  },

  // Synchroniser les changements avec le serveur
  async syncLocalChanges(roomId: number): Promise<RoomDetail> {
    const localDraft = this.getLocalChanges(roomId);
    if (!localDraft) {
      throw new Error('Aucun brouillon local trouvé');
    }

    console.log('[roomDetailApi] 🔄 Syncing local changes for room:', roomId);
    
    try {
      const result = await this.updateRoomDetail(roomId, localDraft);
      this.clearLocalDraft(roomId);
      console.log('[roomDetailApi] ✅ Sync successful:', result);
      return result;
    } catch (error) {
      console.error('[roomDetailApi] ❌ Sync failed:', error);
      throw error;
    }
  },

  // Obtenir toutes les chambres
  async getAllRooms(): Promise<RoomDetail[]> {
    try {
      const response = await api.get('/room-details');
      if (response.success) {
        return response.data || [];
      }
      return [];
    } catch (error) {
      console.error('[roomDetailApi] ❌ Error getting all rooms:', error);
      return [];
    }
  },

  // Créer une nouvelle chambre
  async createRoom(data: Omit<RoomDetail, '_id' | 'id' | 'roomId' | 'meta'> & { roomId: number }): Promise<RoomDetail> {
    console.log('[roomDetailApi] ➕ createRoom called:', { roomId: data.roomId });
    
    try {
      const response = await api.post('/room-details', data);
      if (response.success) {
        return response.data!;
      }
      throw new Error(response.error || 'Erreur lors de la création de la chambre');
    } catch (error) {
      console.error('[roomDetailApi] ❌ Error creating room:', error);
      throw error;
    }
  },

  // Supprimer une chambre
  async deleteRoom(roomId: number): Promise<{ success: boolean; message: string }> {
    console.log('[roomDetailApi] 🗑️ deleteRoom called:', { roomId });
    
    try {
      const response = await api.delete(`/room-details/${roomId}`);
      if (response.success) {
        this.clearLocalDraft(roomId);
        return {
          success: true,
          message: response.message || 'Chambre supprimée avec succès'
        };
      }
      return {
        success: false,
        message: response.error || 'Erreur lors de la suppression de la chambre'
      };
    } catch (error) {
      console.error('[roomDetailApi] ❌ Error deleting room:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Mettre à jour les options supplémentaires
  async updateAdditionalOptions(
    roomId: number, 
    options: {
      optionId: string;
      name: string;
      price: number;
      quantity: number;
      pricingType: 'fixed' | 'per_day' | 'per_guest';
      image?: string;
    }[]
  ): Promise<RoomDetail> {
    console.log('[roomDetailApi] 🔄 updateAdditionalOptions called:', { roomId, optionsCount: options.length });
    
    return await this.updateRoomDetail(roomId, { additionalOptions: options });
  },

  // Mettre à jour les IDs d'options sélectionnées
  async updateSelectedOptionIds(roomId: number, optionIds: string[]): Promise<RoomDetail> {
    console.log('[roomDetailApi] 🔄 updateSelectedOptionIds called:', { roomId, optionIds });
    
    return await this.updateRoomDetail(roomId, { selectedOptionIds: optionIds });
  }
};

export default roomDetailApi;