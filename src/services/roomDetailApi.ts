// services/roomDetailApi.ts
import { api } from './api';

const BACKEND_URL = 'https://airbnb-backend.onrender.com/api';

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
  features: string[];
  accommodationType?: string;
  includes?: string[];
  amenities?: string[];
  selectedOptionIds?: string[];
  meta?: {
    createdAt?: string;
    updatedAt?: string;
    updatedBy?: string;
    version?: number;
  };
}

// Interfaces pour les modifications spécifiques
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
  features?: string[];
  accommodationType?: string;
  includes?: string[];
  amenities?: string[];
  selectedOptionIds?: string[];
}

const makeRequest = async <T>(
  url: string,
  method: string = 'GET',
  data?: any
): Promise<T> => {
  const token = api.getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
  
  const config: RequestInit = {
    method,
    headers,
    credentials: 'include',
    ...(data && { body: JSON.stringify(data) }),
  };
  
  try {
    const fullUrl = url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
    console.log(`[API] ${method} ${fullUrl}`, data ? { data } : '');
    
    const response = await fetch(fullUrl, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error || errorData.message || `Erreur HTTP ${response.status}`;
      console.error(`[API ERROR] ${method} ${fullUrl}:`, errorMsg);
      throw new Error(errorMsg);
    }
    
    const result = await response.json();
    console.log(`[API SUCCESS] ${method} ${fullUrl}:`, result);
    return result;
  } catch (error) {
    console.error(`[API EXCEPTION] ${method} ${url}:`, error);
    throw error;
  }
};

export const roomDetailApi = {
  // Récupérer les détails d'une chambre via l'API apartment-details
  async getRoomDetail(roomId: number): Promise<{ success: boolean; data: RoomDetail }> {
    try {
      // Essayer d'abord le nouvel endpoint room-details s'il existe
      try {
        const result = await makeRequest<{ success: boolean; data: RoomDetail }>(
          `/room-details/${roomId}`
        );
        return result;
      } catch (e) {
        // Fallback vers apartment-details
        console.log('Fallback vers /apartment-details');
        const result = await makeRequest<{ success: boolean; data: RoomDetail }>(
          `/apartment-details/${roomId}`
        );
        return result;
      }
    } catch (error) {
      console.error('Erreur fetch room detail:', error);
      throw error;
    }
  },
  
  // Mettre à jour une chambre (via apartment endpoint)
  async updateRoomDetail(roomId: number, data: Partial<RoomDetail>): Promise<{ success: boolean; data: RoomDetail }> {
    console.log('[API] 📤 updateRoomDetail called with:', { roomId, dataKeys: Object.keys(data) });
    try {
      // Essayer d'abord le nouvel endpoint room-details
      try {
        console.log('[API] 🔄 Trying /room-details/' + roomId + ' endpoint...');
        const result = await makeRequest<{ success: boolean; data: RoomDetail }>(
          `/room-details/${roomId}`,
          'PUT',
          data
        );
        console.log('[API] ✅ Room detail update (room-details) response:', result);
        return result;
      } catch (e) {
        // Fallback vers apartment
        console.log('[API] ⚠️ /room-details fallback failed, trying /apartment endpoint');
        console.error('[API] Error from /room-details:', e);
        const response = await makeRequest<any>(
          `/apartment`,
          'PUT',
          {
            roomId,
            ...data
          }
        );
        console.log('[API] 📥 Response from /apartment:', response);
        
        // Le serveur peut retourner différents formats
        // Essayer de normaliser la réponse
        let normalizedData: RoomDetail;
        
        if (response.success && response.data) {
          // Format: { success: true, data: RoomDetail }
          normalizedData = response.data;
        } else if (response.page?.roomsSection?.rooms) {
          // Format: { message, page: ApartmentPageData }
          // Chercher la chambre dans la liste des chambres
          const room = response.page.roomsSection.rooms.find((r: any) => r.id === roomId);
          normalizedData = room || {
            roomId,
            title: data.title || '',
            subtitle: data.subtitle || '',
            description: data.description || '',
            price: data.price || 0,
            guests: data.guests || '',
            bedrooms: data.bedrooms || '',
            images: data.images || [],
            features: data.features || [],
            ...data
          };
        } else if (response.message) {
          // Format: { message, ... }
          // Retourner les données envoyées avec success: true
          normalizedData = {
            roomId,
            title: data.title || '',
            subtitle: data.subtitle || '',
            description: data.description || '',
            price: data.price || 0,
            guests: data.guests || '',
            bedrooms: data.bedrooms || '',
            images: data.images || [],
            features: data.features || [],
            ...data
          };
        } else {
          normalizedData = {
            roomId,
            title: data.title || '',
            subtitle: data.subtitle || '',
            description: data.description || '',
            price: data.price || 0,
            guests: data.guests || '',
            bedrooms: data.bedrooms || '',
            images: data.images || [],
            features: data.features || [],
            ...data
          };
        }
        
        console.log('[API] ✅ Room detail normalized response:', normalizedData);
        return { success: true, data: normalizedData };
      }
    } catch (error) {
      console.error('[API] ❌ Error in updateRoomDetail:', error);
      console.error('[API] ❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : '',
        type: typeof error
      });
      throw error;
    }
  },
  
  // Mettre à jour les informations de hero (titre, sous-titre, description, type)
  async updateHeroInfo(roomId: number, heroInfo: Partial<HeroInfo>): Promise<{ success: boolean; data: RoomDetail }> {
    const payload: UpdateRoomDetailPayload = {
      ...(heroInfo.title && { title: heroInfo.title }),
      ...(heroInfo.subtitle && { subtitle: heroInfo.subtitle }),
      ...(heroInfo.description && { description: heroInfo.description }),
      ...(heroInfo.accommodationType && { accommodationType: heroInfo.accommodationType }),
      ...(heroInfo.images && { images: heroInfo.images }),
    };
    return await makeRequest<{ success: boolean; data: RoomDetail }>(`/${roomId}`, 'PUT', payload);
  },

  // Mettre à jour le prix
  async updatePricing(roomId: number, pricingInfo: PricingInfo): Promise<{ success: boolean; data: RoomDetail }> {
    return await this.updateRoomDetail(roomId, { price: pricingInfo.price } as any);
  },

  // Mettre à jour le nombre d'invités et de chambres
  async updateGuestBedInfo(roomId: number, guestBedInfo: GuestBedInfo): Promise<{ success: boolean; data: RoomDetail }> {
    return await this.updateRoomDetail(roomId, { 
      guests: guestBedInfo.guests,
      bedrooms: guestBedInfo.bedrooms,
    } as any);
  },

  // Mettre à jour les images
  async updateImages(roomId: number, imageUrls: string[]): Promise<{ success: boolean; data: RoomDetail }> {
    return await this.updateRoomDetail(roomId, { images: imageUrls } as any);
  },

  // Ajouter une image
  async addImage(roomId: number, imageUrl: string): Promise<{ success: boolean; data: RoomDetail }> {
    try {
      const room = await this.getRoomDetail(roomId);
      const updatedImages = [...(room.data.images || []), imageUrl];
      return await this.updateRoomDetail(roomId, { images: updatedImages } as any);
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'image:', error);
      throw error;
    }
  },

  // Supprimer une image
  async removeImage(roomId: number, imageUrl: string): Promise<{ success: boolean; data: RoomDetail }> {
    try {
      const room = await this.getRoomDetail(roomId);
      const updatedImages = (room.data.images || []).filter(img => img !== imageUrl);
      return await this.updateRoomDetail(roomId, { images: updatedImages } as any);
    } catch (error) {
      console.error('Erreur lors de la suppression d\'image:', error);
      throw error;
    }
  },

  // Réorganiser les images
  async reorderImages(roomId: number, imageUrls: string[]): Promise<{ success: boolean; data: RoomDetail }> {
    return await this.updateRoomDetail(roomId, { images: imageUrls } as any);
  },

  // Valider les données d'entrée
  validateRoomDetail(data: Partial<RoomDetail>): { valid: boolean; errors: string[] } {
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

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  // Sauvegarder les modifications localement avec versioning
  async saveLocalDraft(roomId: number, data: RoomDetail, version: number = 1): Promise<void> {
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
  },

  // Récupérer le timestamp du brouillon
  getLocalDraftTimestamp(roomId: number): string | null {
    return localStorage.getItem(`roomDetail_${roomId}_draft_timestamp`);
  },

  // Supprimer le brouillon local après sauvegarde
  clearLocalDraft(roomId: number): void {
    localStorage.removeItem(`roomDetail_${roomId}_draft`);
    localStorage.removeItem(`roomDetail_${roomId}_draft_timestamp`);
  },

  // Obtenir tous les brouillons locaux
  getAllLocalDrafts(): Record<string, RoomDetail> {
    const drafts: Record<string, RoomDetail> = {};
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
    return drafts;
  },

  // Synchroniser les changements avec le serveur
  async syncLocalChanges(roomId: number): Promise<{ success: boolean; data: RoomDetail }> {
    const localDraft = localStorage.getItem(`roomDetail_${roomId}_draft`);
    if (!localDraft) {
      throw new Error('Aucun brouillon local trouvé');
    }

    try {
      const data = JSON.parse(localDraft);
      const result = await this.updateRoomDetail(roomId, data);
      this.clearLocalDraft(roomId);
      return result;
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      throw error;
    }
  },

  // Sauvegarder les changements locaux
  async saveLocalChanges(roomId: number, data: RoomDetail): Promise<void> {
    localStorage.setItem(`roomDetail_${roomId}_draft`, JSON.stringify(data));
  },

  // Charger les changements locaux
  getLocalChanges(roomId: number): RoomDetail | null {
    const data = localStorage.getItem(`roomDetail_${roomId}_draft`);
    return data ? JSON.parse(data) : null;
  },

  // Télécharger une image
  async uploadImage(file: File): Promise<{ success: boolean; url: string; filename: string }> {
    const token = api.getAuthToken();
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Essayer d'abord room-details endpoint
      let uploadUrl = `${BACKEND_URL}/room-details/upload`;
      
      let response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        credentials: 'include',
        body: formData,
      });

      // Fallback vers apartment endpoint
      if (!response.ok) {
        uploadUrl = `${BACKEND_URL}/apartment/upload`;
        response = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
          credentials: 'include',
          body: formData,
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('[API] Upload success:', data);
      
      return {
        success: true,
        url: data.url || data.filename || '',
        filename: data.filename || ''
      };
    } catch (error) {
      console.error('Erreur upload image:', error);
      throw error;
    }
  },
  
  // Sauvegarder localement
  async saveLocalChanges(roomId: number, data: RoomDetail): Promise<void> {
    localStorage.setItem(`roomDetail_${roomId}_draft`, JSON.stringify(data));
  },

  // Charger les changements locaux
  getLocalChanges(roomId: number): RoomDetail | null {
    const data = localStorage.getItem(`roomDetail_${roomId}_draft`);
    return data ? JSON.parse(data) : null;
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

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  // Sauvegarder les modifications localement avec versioning
  async saveLocalDraft(roomId: number, data: RoomDetail, version: number = 1): Promise<void> {
    const draft = {
      ...data,
      meta: {
        ...data.meta,
        version,
        updatedAt: new Date().toISOString(),
      },
    };
    localStorage.setItem(`roomDetail_${roomId}_draft`, JSON.stringify(draft));
    localStorage.setItem(`roomDetail_${roomId}_draft_timestamp`, new Date().toISOString());
  },

  // Récupérer le timestamp du brouillon
  getLocalDraftTimestamp(roomId: number): string | null {
    return localStorage.getItem(`roomDetail_${roomId}_draft_timestamp`);
  },

  // Supprimer le brouillon local après sauvegarde
  clearLocalDraft(roomId: number): void {
    localStorage.removeItem(`roomDetail_${roomId}_draft`);
    localStorage.removeItem(`roomDetail_${roomId}_draft_timestamp`);
  },

  // Obtenir tous les brouillons locaux
  getAllLocalDrafts(): Record<string, RoomDetail> {
    const drafts: Record<string, RoomDetail> = {};
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
    return drafts;
  },

  // Synchroniser les changements avec le serveur
  async syncLocalChanges(roomId: number): Promise<{ success: boolean; data: RoomDetail }> {
    const localDraft = this.getLocalChanges(roomId);
    if (!localDraft) {
      throw new Error('Aucun brouillon local trouvé');
    }

    try {
      const result = await this.updateRoomDetail(roomId, localDraft);
      this.clearLocalDraft(roomId);
      return result;
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      throw error;
    }
  }
};
