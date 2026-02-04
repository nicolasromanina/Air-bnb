import { api } from './api';

const BACKEND_URL = 'http://api.waya2828.odns.fr/api';

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
    credentials: 'include', // Important pour CORS avec credentials
    mode: 'cors', // Spécifie explicitement le mode CORS
    ...(data && { body: JSON.stringify(data) }),
  };
  
  try {
    const fullUrl = url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
    console.log(`[makeRequest] 📡 Starting ${method} request:`, {
      url: fullUrl,
      hasToken: !!token,
      hasData: !!data,
      dataSize: data ? Object.keys(data).length : 0
    });
    
    const response = await fetch(fullUrl, config);
    
    console.log(`[makeRequest] 📥 Response received:`, {
      url: fullUrl,
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get('content-type'),
      corsHeaders: {
        'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
        'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
        'access-control-allow-credentials': response.headers.get('access-control-allow-credentials')
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error || errorData.message || `Erreur HTTP ${response.status}`;
      console.error(`[makeRequest] ❌ HTTP Error:`, {
        status: response.status,
        errorMsg,
        errorData
      });
      throw new Error(errorMsg);
    }
    
    const result = await response.json();
    console.log(`[makeRequest] ✅ ${method} ${fullUrl} - Success:`, {
      hasData: !!result,
      dataKeys: result ? Object.keys(result).slice(0, 5) : []
    });
    return result;
  } catch (error) {
    console.error(`[makeRequest] ❌ EXCEPTION ${method} ${url}:`, {
      errorMessage: error instanceof Error ? error.message : String(error),
      errorType: error instanceof Error ? error.constructor.name : typeof error
    });
    throw error;
  }
};

export const roomDetailApi = {
  // Récupérer les détails d'une chambre via l'API room-details
  async getRoomDetail(roomId: number): Promise<{ success: boolean; data: RoomDetail }> {
    try {
      console.log('[roomDetailApi] 🔍 getRoomDetail called with roomId:', roomId);
      
      // Essayer d'abord le nouvel endpoint room-details
      try {
        console.log('[roomDetailApi] 📡 Attempting /room-details/' + roomId);
        const result = await makeRequest<{ success: boolean; data: RoomDetail }>(
          `/room-details/${roomId}`
        );
        console.log('[roomDetailApi] ✅ /room-details succeeded:', {
          success: result.success,
          hasData: !!result.data,
          roomId: result.data?.roomId,
          title: result.data?.title
        });
        return result;
      } catch (e) {
        // Fallback vers apartment-details
        console.log('[roomDetailApi] ⚠️ /room-details failed, attempting fallback');
        console.error('[roomDetailApi] Error details:', {
          message: e instanceof Error ? e.message : String(e),
          type: typeof e,
          errorObj: e
        });
        
        // Vérifier si c'est une erreur CORS
        if (e instanceof Error && (e.message.includes('Failed to fetch') || e.message.includes('CORS'))) {
          console.log('[roomDetailApi] ⚠️ CORS error detected, trying with CORS proxy');
          // Essayer avec un proxy CORS temporaire
          const proxyResult = await fetch(`https://cors-anywhere.herokuapp.com/${BACKEND_URL}/room-details/${roomId}`, {
            headers: {
              'Content-Type': 'application/json',
            },
            mode: 'cors'
          });
          
          if (proxyResult.ok) {
            const proxyData = await proxyResult.json();
            console.log('[roomDetailApi] ✅ CORS proxy succeeded');
            return proxyData;
          }
        }
        
        console.log('[roomDetailApi] 📡 Attempting fallback /apartment-details/' + roomId);
        const result = await makeRequest<{ success: boolean; data: RoomDetail }>(
          `/apartment-details/${roomId}`
        );
        console.log('[roomDetailApi] ✅ /apartment-details succeeded:', {
          success: result.success,
          hasData: !!result.data,
          roomId: result.data?.roomId,
          title: result.data?.title
        });
        return result;
      }
    } catch (error) {
      console.error('[roomDetailApi] ❌ Erreur fetch room detail:', {
        error: error instanceof Error ? error.message : String(error),
        roomId,
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  },
  
  // Mettre à jour une chambre (via room-details endpoint)
  async updateRoomDetail(roomId: number, data: Partial<RoomDetail>): Promise<{ success: boolean; data: RoomDetail }> {
    console.log('[API] 📤 updateRoomDetail called with:', { roomId, dataKeys: Object.keys(data) });
    try {
      // Essayer d'abord le nouvel endpoint room-details
      console.log('[API] 🔄 Trying /room-details/' + roomId + ' endpoint...');
      const result = await makeRequest<{ success: boolean; data: RoomDetail }>(
        `/room-details/${roomId}`,
        'PUT',
        data
      );
      console.log('[API] ✅ Room detail update (room-details) response:', result);
      return result;
    } catch (e) {
      console.log('[API] ⚠️ /room-details failed, trying fallback');
      console.error('[API] Error from /room-details:', e);
      
      // Si c'est une erreur CORS, essayer différentes approches
      if (e instanceof Error && (e.message.includes('Failed to fetch') || e.message.includes('CORS'))) {
        console.log('[API] ⚠️ CORS error detected, trying alternative endpoints');
        
        // Essayer apartment-details comme fallback
        try {
          const fallbackResult = await makeRequest<any>(
            `/apartment-details/${roomId}`,
            'PUT',
            data
          );
          console.log('[API] 📥 Response from /apartment-details:', fallbackResult);
          return { success: true, data: { roomId, ...data } as RoomDetail };
        } catch (fallbackError) {
          console.error('[API] ❌ All endpoints failed:', fallbackError);
        }
      }
      
      throw e;
    }
  },
  
  // Mettre à jour les informations de hero
  async updateHeroInfo(roomId: number, heroInfo: Partial<HeroInfo>): Promise<{ success: boolean; data: RoomDetail }> {
    const payload: UpdateRoomDetailPayload = {
      ...(heroInfo.title && { title: heroInfo.title }),
      ...(heroInfo.subtitle && { subtitle: heroInfo.subtitle }),
      ...(heroInfo.description && { description: heroInfo.description }),
      ...(heroInfo.accommodationType && { accommodationType: heroInfo.accommodationType }),
      ...(heroInfo.images && { images: heroInfo.images }),
    };
    
    console.log('[API] 🔄 updateHeroInfo called:', { roomId, payload });
    
    // Utiliser le bon endpoint
    return await makeRequest<{ success: boolean; data: RoomDetail }>(
      `/room-details/${roomId}`,
      'PATCH',
      payload
    );
  },

  // Mettre à jour le prix
  async updatePricing(roomId: number, pricingInfo: PricingInfo): Promise<{ success: boolean; data: RoomDetail }> {
    console.log('[API] 🔄 updatePricing called:', { roomId, pricingInfo });
    return await this.updateRoomDetail(roomId, { price: pricingInfo.price });
  },

  // Mettre à jour le nombre d'invités et de chambres
  async updateGuestBedInfo(roomId: number, guestBedInfo: GuestBedInfo): Promise<{ success: boolean; data: RoomDetail }> {
    console.log('[API] 🔄 updateGuestBedInfo called:', { roomId, guestBedInfo });
    return await this.updateRoomDetail(roomId, { 
      guests: guestBedInfo.guests,
      bedrooms: guestBedInfo.bedrooms,
      ...(guestBedInfo.city && { city: guestBedInfo.city }),
      ...(guestBedInfo.country && { country: guestBedInfo.country }),
    });
  },

  // Mettre à jour la ville et le pays
  async updateCityCountry(roomId: number, city: string, country: string): Promise<{ success: boolean; data: RoomDetail }> {
    console.log('[API] 🔄 updateCityCountry called:', { roomId, city, country });
    return await this.updateRoomDetail(roomId, { city, country });
  },

  // Mettre à jour les images
  async updateImages(roomId: number, imageUrls: string[]): Promise<{ success: boolean; data: RoomDetail }> {
    console.log('[API] 🔄 updateImages called:', { roomId, imageCount: imageUrls.length });
    return await this.updateRoomDetail(roomId, { images: imageUrls });
  },

  // Ajouter une image
  async addImage(roomId: number, imageUrl: string): Promise<{ success: boolean; data: RoomDetail }> {
    try {
      console.log('[API] ➕ addImage called:', { roomId, imageUrl });
      const room = await this.getRoomDetail(roomId);
      const updatedImages = [...(room.data.images || []), imageUrl];
      return await this.updateRoomDetail(roomId, { images: updatedImages });
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'image:', error);
      throw error;
    }
  },

  // Supprimer une image
  async removeImage(roomId: number, imageUrl: string): Promise<{ success: boolean; data: RoomDetail }> {
    try {
      console.log('[API] ➖ removeImage called:', { roomId, imageUrl });
      const room = await this.getRoomDetail(roomId);
      const updatedImages = (room.data.images || []).filter(img => img !== imageUrl);
      return await this.updateRoomDetail(roomId, { images: updatedImages });
    } catch (error) {
      console.error('Erreur lors de la suppression d\'image:', error);
      throw error;
    }
  },

  // Réorganiser les images
  async reorderImages(roomId: number, imageUrls: string[]): Promise<{ success: boolean; data: RoomDetail }> {
    console.log('[API] 🔄 reorderImages called:', { roomId, imageCount: imageUrls.length });
    return await this.updateRoomDetail(roomId, { images: imageUrls });
  },

  // Télécharger une image
  async uploadImage(file: File): Promise<{ success: boolean; url: string; filename: string }> {
    const token = api.getAuthToken();
    const formData = new FormData();
    formData.append('image', file);

    console.log('[API] 📤 uploadImage called:', { 
      filename: file.name, 
      size: file.size,
      type: file.type,
      hasToken: !!token 
    });

    try {
      // Essayer d'abord room-details endpoint
      let uploadUrl = `${BACKEND_URL}/room-details/upload`;
      
      let response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        credentials: 'include',
        mode: 'cors',
        body: formData,
      });

      console.log('[API] 📥 Upload response (room-details):', {
        status: response.status,
        ok: response.ok,
        url: uploadUrl
      });

      // Fallback vers apartment endpoint si nécessaire
      if (!response.ok) {
        console.log('[API] ⚠️ room-details upload failed, trying apartment endpoint');
        uploadUrl = `${BACKEND_URL}/apartment/upload`;
        response = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
          credentials: 'include',
          mode: 'cors',
          body: formData,
        });
        
        console.log('[API] 📥 Upload response (apartment):', {
          status: response.status,
          ok: response.ok,
          url: uploadUrl
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[API] ❌ Upload failed:', errorData);
        throw new Error(errorData.error || `Erreur HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('[API] ✅ Upload success:', data);
      
      return {
        success: true,
        url: data.url || data.filename || '',
        filename: data.filename || ''
      };
    } catch (error) {
      console.error('[API] ❌ Erreur upload image:', error);
      throw error;
    }
  },
  
  // --- Gestion des brouillons locaux ---
  
  // Sauvegarder localement
  saveLocalChanges(roomId: number, data: RoomDetail): void {
    console.log('[LocalStorage] 💾 Saving local changes for room:', roomId);
    localStorage.setItem(`roomDetail_${roomId}_draft`, JSON.stringify(data));
  },

  // Charger les changements locaux
  getLocalChanges(roomId: number): RoomDetail | null {
    const data = localStorage.getItem(`roomDetail_${roomId}_draft`);
    if (data) {
      console.log('[LocalStorage] 📂 Loading local changes for room:', roomId);
      return JSON.parse(data);
    }
    return null;
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
    console.log('[Validation] 🔍 Validation result:', { valid, errorCount: errors.length });
    
    return {
      valid,
      errors,
    };
  },

  // Sauvegarder les modifications localement avec versioning
  saveLocalDraft(roomId: number, data: RoomDetail, version: number = 1): void {
    console.log('[LocalStorage] 💾 Saving draft v' + version + ' for room:', roomId);
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
    console.log('[LocalStorage] 🗑️ Clearing draft for room:', roomId);
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
    console.log('[LocalStorage] 📚 Found drafts:', Object.keys(drafts));
    return drafts;
  },

  // Synchroniser les changements avec le serveur
  async syncLocalChanges(roomId: number): Promise<{ success: boolean; data: RoomDetail }> {
    const localDraft = this.getLocalChanges(roomId);
    if (!localDraft) {
      throw new Error('Aucun brouillon local trouvé');
    }

    console.log('[API] 🔄 Syncing local changes for room:', roomId);
    
    try {
      const result = await this.updateRoomDetail(roomId, localDraft);
      this.clearLocalDraft(roomId);
      console.log('[API] ✅ Sync successful:', result);
      return result;
    } catch (error) {
      console.error('[API] ❌ Sync failed:', error);
      throw error;
    }
  }
};