// hooks/useReservations.ts
import { useState, useCallback } from 'react';
import { api } from '@/services/api';
import { toast } from 'sonner';

export const useReservations = () => {
  const [loading, setLoading] = useState(false);

  const createReservation = useCallback(async (reservationData: any) => {
    try {
      setLoading(true);
      const response = await api.createReservation(reservationData);
      
      if (response.success) {
        toast.success('Réservation créée avec succès');
        return response.data;
      } else {
        throw new Error(response.error || 'Échec de la création');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la création');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserReservations = useCallback(async (page = 1, limit = 10, status?: string) => {
    try {
      setLoading(true);
      const response = await api.getUserReservations(page, limit, status);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Échec de la récupération');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur de récupération');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelReservation = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await api.cancelReservation(id);
      
      if (response.success) {
        toast.success('Réservation annulée avec succès');
        return response.data;
      } else {
        throw new Error(response.error || 'Échec de l\'annulation');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur d\'annulation');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteReservation = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await api.deleteReservation(id);
      
      if (response.success) {
        toast.success('Réservation supprimée avec succès');
        return response.data;
      } else {
        throw new Error(response.error || 'Échec de la suppression');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur de suppression');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAvailability = useCallback(async (apartmentId: number, checkIn: Date, checkOut: Date) => {
    try {
      setLoading(true);
      const response = await api.checkAvailability(apartmentId, checkIn, checkOut);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Échec de la vérification');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur de vérification');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    createReservation,
    getUserReservations,
    cancelReservation,
    deleteReservation,
    checkAvailability,
  };
};