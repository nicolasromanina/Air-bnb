// hooks/useDataSync.ts
import { useEffect, useCallback } from 'react';

/**
 * Hook pour synchroniser les données entre composants
 * Écoute l'événement 'apartmentDataUpdated' et exécute la callback
 */
export const useDataSync = (callback: (data?: any) => void) => {
  useEffect(() => {
    const handleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      callback(customEvent.detail?.data);
    };

    window.addEventListener('apartmentDataUpdated', handleUpdate);
    
    return () => {
      window.removeEventListener('apartmentDataUpdated', handleUpdate);
    };
  }, [callback]);
};

/**
 * Hook pour forcer le rafraîchissement des données d'une chambre
 */
export const useRoomDetailSync = (roomId: number | null, callback: () => void) => {
  useEffect(() => {
    if (!roomId) return;

    const handleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      // Recharger les données si c'est la bonne chambre ou si c'est une mise à jour générale
      if (!customEvent.detail?.roomId || customEvent.detail?.roomId === roomId) {
        callback();
      }
    };

    window.addEventListener('apartmentDataUpdated', handleUpdate);
    window.addEventListener('roomDetailUpdated', handleUpdate);
    
    return () => {
      window.removeEventListener('apartmentDataUpdated', handleUpdate);
      window.removeEventListener('roomDetailUpdated', handleUpdate);
    };
  }, [roomId, callback]);
};

/**
 * Dispatch un événement de mise à jour de chambre
 */
export const dispatchRoomDetailUpdate = (roomId: number, data?: any) => {
  window.dispatchEvent(new CustomEvent('roomDetailUpdated', { 
    detail: { roomId, data, timestamp: Date.now() } 
  }));
};

/**
 * Dispatch un événement de mise à jour générale
 */
export const dispatchApartmentUpdate = (data?: any) => {
  window.dispatchEvent(new CustomEvent('apartmentDataUpdated', { 
    detail: { data, timestamp: Date.now() } 
  }));
};
