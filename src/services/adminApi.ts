import { api } from './api';

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  cancelledReservations: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageBookingValue: number;
  occupancyRate: number;
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  _id: string;
  reservationId: string;
  user: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  apartment: {
    apartmentId: number;
    title: string;
    image: string;
  };
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentId?: string;
  stripeSessionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const adminService = {
  // ========== STATISTIQUES ==========
  async getStats(): Promise<AdminStats> {
    const response = await api.get('/admin/stats');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la récupération des statistiques');
  },

  // ========== UTILISATEURS ==========
  async getUsers(page: number = 1, limit: number = 20, search?: string): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });

    const response = await api.get(`/admin/users?${params}`);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la récupération des utilisateurs');
  },

  async getUserById(userId: string): Promise<User> {
    const response = await api.get(`/admin/users/${userId}`);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la récupération de l\'utilisateur');
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const response = await api.put(`/admin/users/${userId}`, updates);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la mise à jour de l\'utilisateur');
  },

  async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/admin/users/${userId}`);
    if (response.success) {
      return {
        success: true,
        message: response.message || 'Utilisateur supprimé avec succès'
      };
    }
    return {
      success: false,
      message: response.error || 'Erreur lors de la suppression de l\'utilisateur'
    };
  },

  async updateUserRole(userId: string, role: string): Promise<User> {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la mise à jour du rôle');
  },

  async toggleUserStatus(userId: string, isActive: boolean): Promise<User> {
    const response = await api.put(`/admin/users/${userId}/status`, { isActive });
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la mise à jour du statut');
  },

  // ========== RÉSERVATIONS ==========
  async getReservations(
    page: number = 1,
    limit: number = 20,
    filters?: {
      status?: string;
      paymentStatus?: string;
      dateFrom?: string;
      dateTo?: string;
      search?: string;
    }
  ): Promise<PaginatedResponse<Reservation>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.paymentStatus && { paymentStatus: filters.paymentStatus }),
      ...(filters?.dateFrom && { dateFrom: filters.dateFrom }),
      ...(filters?.dateTo && { dateTo: filters.dateTo }),
      ...(filters?.search && { search: filters.search })
    });

    const response = await api.get(`/admin/reservations?${params}`);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la récupération des réservations');
  },

  async getReservationById(reservationId: string): Promise<Reservation> {
    const response = await api.get(`/admin/reservations/${reservationId}`);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la récupération de la réservation');
  },

  async updateReservationStatus(reservationId: string, status: string): Promise<Reservation> {
    const response = await api.put(`/admin/reservations/${reservationId}/status`, { status });
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la mise à jour du statut de la réservation');
  },

  async cancelReservation(reservationId: string, reason?: string): Promise<Reservation> {
    const response = await api.post(`/admin/reservations/${reservationId}/cancel`, { reason });
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de l\'annulation de la réservation');
  },

  async refundPayment(reservationId: string, amount?: number, reason?: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post(`/admin/reservations/${reservationId}/refund`, { amount, reason });
    if (response.success) {
      return {
        success: true,
        message: response.message || 'Remboursement effectué avec succès'
      };
    }
    return {
      success: false,
      message: response.error || 'Erreur lors du remboursement'
    };
  },

  // ========== PAIEMENTS ==========
  async getPayments(
    page: number = 1,
    limit: number = 20,
    filters?: {
      status?: string;
      dateFrom?: string;
      dateTo?: string;
    }
  ): Promise<PaginatedResponse<any>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.dateFrom && { dateFrom: filters.dateFrom }),
      ...(filters?.dateTo && { dateTo: filters.dateTo })
    });

    const response = await api.get(`/admin/payments?${params}`);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la récupération des paiements');
  },

  async getPaymentDetails(paymentId: string): Promise<any> {
    const response = await api.get(`/admin/payments/${paymentId}`);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la récupération des détails du paiement');
  },

  // ========== LOGS ==========
  async getLogs(
    page: number = 1,
    limit: number = 50,
    filters?: {
      level?: string;
      dateFrom?: string;
      dateTo?: string;
      search?: string;
    }
  ): Promise<PaginatedResponse<any>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.level && { level: filters.level }),
      ...(filters?.dateFrom && { dateFrom: filters.dateFrom }),
      ...(filters?.dateTo && { dateTo: filters.dateTo }),
      ...(filters?.search && { search: filters.search })
    });

    const response = await api.get(`/admin/logs?${params}`);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la récupération des logs');
  },

  // ========== EXPORT ==========
  async exportReservations(format: 'csv' | 'excel' = 'csv', filters?: any): Promise<string> {
    const params = new URLSearchParams({ format });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }

    // Retourner l'URL pour télécharger le fichier
    return `${api.baseUrl}/admin/export/reservations?${params}`;
  },
  
  async exportUsers(format: 'csv' | 'excel' = 'csv'): Promise<string> {
    return `${api.baseUrl}/admin/export/users?format=${format}`;
  },

  // ========== BACKUP ==========
  async createBackup(): Promise<{ success: boolean; message: string; backupId?: string }> {
    const response = await api.post('/admin/backup');
    if (response.success) {
      return {
        success: true,
        message: response.message || 'Backup créé avec succès',
        backupId: response.data?.backupId
      };
    }
    return {
      success: false,
      message: response.error || 'Erreur lors de la création du backup'
    };
  },

  async getBackups(): Promise<any[]> {
    const response = await api.get('/admin/backups');
    if (response.success) {
      return response.data || [];
    }
    throw new Error(response.error || 'Erreur lors de la récupération des backups');
  },

  async restoreBackup(backupId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post(`/admin/backup/${backupId}/restore`);
    if (response.success) {
      return {
        success: true,
        message: response.message || 'Backup restauré avec succès'
      };
    }
    return {
      success: false,
      message: response.error || 'Erreur lors de la restauration du backup'
    };
  },

  // ========== CONFIGURATION ==========
  async getSettings(): Promise<Record<string, any>> {
    const response = await api.get('/admin/settings');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la récupération des paramètres');
  },

  async updateSettings(settings: Record<string, any>): Promise<Record<string, any>> {
    const response = await api.put('/admin/settings', settings);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la mise à jour des paramètres');
  },

  async clearCache(): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/admin/cache/clear');
    if (response.success) {
      return {
        success: true,
        message: response.message || 'Cache vidé avec succès'
      };
    }
    return {
      success: false,
      message: response.error || 'Erreur lors du vidage du cache'
    };
  }
};

export default adminService;