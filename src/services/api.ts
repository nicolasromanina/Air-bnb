import { config } from '@/config/env';
import { toast } from 'sonner';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
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

// Types pour les requêtes
export interface PaymentRequest {
  amount?: number;
  priceId?: string;
  reservationDetails: {
    apartmentId: number;
    apartmentNumber: string;
    title: string;
    image: string;
    includes: string[];
    checkIn: string;
    checkOut: string;
    nights: number;
    guests: number;
    bedrooms: number;
    totalPrice: number;
    pricePerNight: number;
    customerName?: string;
    customerEmail?: string;
    basePrice?: number;
    optionsPrice?: number;
    selectedOptions?: Array<{
      optionId: string;
      name: string;
      price: number;
      quantity: number;
      pricingType: string;
    }>;
  };
}

export interface PaymentResponse {
  success: boolean;
  url: string;
  sessionId: string;
  paymentId: string;
  reservationId: string;
}

export interface VerifyPaymentRequest {
  sessionId: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  paymentStatus: 'paid' | 'pending' | 'failed';
  customerEmail: string;
  amountTotal: number;
  currency: string;
  metadata: Record<string, string>;
  paymentId: string;
  reservationId: string;
}

export interface ReservationRequest {
  apartmentId: number;
  apartmentNumber: string;
  title: string;
  image: string;
  includes: string[];
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  bedrooms: number;
  totalPrice: number;
  pricePerNight: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    stripeCustomerId?: string;
  };
  message: string;
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = config.apiBaseUrl;
    this.loadToken();
  }

  private loadToken() {
    this.token = localStorage.getItem('auth_token');
  }

  private saveToken(token: string) {
    localStorage.setItem('auth_token', token);
    this.token = token;
  }

  clearToken() {
    localStorage.removeItem('auth_token');
    this.token = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & { skipContentType?: boolean } = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const { skipContentType, ...restOptions } = options;
    
    const headers: HeadersInit = {
      ...(skipContentType ? {} : { 'Content-Type': 'application/json' }),
      ...restOptions.headers,
    };

    // Ajouter le token d'authentification si disponible
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const requestOptions: RequestInit = {
      ...restOptions,
      headers,
      credentials: 'include' as RequestCredentials,
    };

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        // Gérer les erreurs d'authentification
        if (response.status === 401) {
          this.clearToken();
          window.location.href = '/login';
        }

        // Return the server response even on non-OK so callers can inspect extra fields
        return {
          success: false,
          error: data.error || 'Une erreur est survenue',
          data: data,
          message: data.message,
        };
      }

      return {
        success: true,
        data: data,
        message: data.message,
      };
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      
      if (error instanceof Error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: false,
        error: 'Erreur réseau ou serveur',
      };
    }
  }

  // ========== AUTHENTIFICATION ==========
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      this.saveToken(response.data.token);
    }

    return response;
  }

  async signup(credentials: SignupRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      this.saveToken(response.data.token);
    }

    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<any>> {
    return this.request('/auth/me');
  }

  async logout(): Promise<void> {
    this.clearToken();
    // Optionnel: Appeler une endpoint de logout backend
  }

  // ========== PROFIL UTILISATEUR ==========
  async getUserProfile(): Promise<ApiResponse<any>> {
    return this.request('/auth/me');
  }

  async updateUserProfile(profileData: any): Promise<ApiResponse<any>> {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // ========== MÉTHODES GÉNÉRIQUES ==========
  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint);
  }

  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // ========== PAIEMENTS ==========
  async createPayment(paymentData: PaymentRequest): Promise<ApiResponse<PaymentResponse>> {
    // Timeout plus long pour la création de paiement (60 secondes)
    // Car Stripe peut prendre du temps pour valider et créer la session
    return this.request<PaymentResponse>('/payments/create', {
      method: 'POST',
      body: JSON.stringify(paymentData),
      timeout: 60000, // 60 secondes pour les paiements
    });
  }

  async verifyPayment(sessionId: string): Promise<ApiResponse<VerifyPaymentResponse>> {
    return this.request<VerifyPaymentResponse>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });
  }

  async getPaymentBySessionId(sessionId: string): Promise<ApiResponse<any>> {
    return this.request(`/payments/session/${sessionId}`);
  }

  async getStripeSessionDetails(sessionId: string): Promise<ApiResponse<any>> {
    return this.request(`/payments/stripe-session/${sessionId}`);
  }

  async getUserPayments(page = 1, limit = 10, status?: string): Promise<ApiResponse<PaginatedResponse<any>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });

    return this.request(`/payments/my-payments?${params}`);
  }

  // Admin: liste des paiements
  async getAdminPayments(page = 1, limit = 20, status?: string): Promise<ApiResponse<PaginatedResponse<any>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });

    return this.request(`/payments?${params}`);
  }

  // Admin: demander un remboursement pour un paiement
  async refundAdminPayment(paymentId: string, reason?: string): Promise<ApiResponse<any>> {
    return this.request(`/payments/${paymentId}/refund`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // ========== RÉSERVATIONS ==========
  async createReservation(reservationData: ReservationRequest): Promise<ApiResponse<any>> {
    return this.request('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
  }

  async getUserReservations(page = 1, limit = 10, status?: string): Promise<ApiResponse<PaginatedResponse<any>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });

    return this.request(`/reservations/my-reservations?${params}`);
  }

  async getReservation(id: string): Promise<ApiResponse<any>> {
    return this.request(`/reservations/${id}`);
  }

  async cancelReservation(id: string): Promise<ApiResponse<any>> {
    return this.request(`/reservations/${id}/cancel`, {
      method: 'DELETE',
    });
  }

  async deleteReservation(id: string): Promise<ApiResponse<any>> {
    return this.request(`/reservations/${id}`, {
      method: 'DELETE',
    });
  }

  async checkAvailability(
    apartmentId: number,
    checkIn: Date,
    checkOut: Date
  ): Promise<ApiResponse<any>> {
    const params = new URLSearchParams({
      apartmentId: apartmentId.toString(),
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
    });

    return this.request(`/reservations/availability?${params}`);
  }

  async getReservationStats(): Promise<ApiResponse<any>> {
    return this.request('/reservations/stats/overview');
  }

  // ========== OPTIONS SUPPLÉMENTAIRES ==========
  async getAdditionalOptions(apartmentId?: number): Promise<ApiResponse<any>> {
    const q = apartmentId ? `?apartmentId=${encodeURIComponent(String(apartmentId))}` : '';
    return this.request(`/options${q}`);
  }

  async getOptionsByCategory(category: string): Promise<ApiResponse<any>> {
    return this.request(`/options/category/${category}`);
  }

  async getOption(id: string): Promise<ApiResponse<any>> {
    return this.request(`/options/${id}`);
  }

  async createOption(optionData: any): Promise<ApiResponse<any>> {
    return this.request('/options', {
      method: 'POST',
      body: JSON.stringify(optionData),
    });
  }

  async updateOption(id: string, optionData: any): Promise<ApiResponse<any>> {
    return this.request(`/options/${id}`, {
      method: 'PUT',
      body: JSON.stringify(optionData),
    });
  }

  async deleteOption(id: string): Promise<ApiResponse<any>> {
    return this.request(`/options/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== UTILITAIRES ==========
  async healthCheck(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl.replace('/api', '')}/health`);
      const data = await response.json();
      return {
        success: response.ok,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Serveur non disponible',
      };
    }
  }

  // ========== ADMIN ==========
  async getAdminUsers(page = 1, limit = 20, q = ''): Promise<ApiResponse<any>> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit), ...(q && { q }) });
    return this.request(`/admin/users?${params}`);
  }

  async getAdminUser(id: string): Promise<ApiResponse<any>> {
    return this.request(`/admin/users/${id}`);
  }

  async updateUserRole(id: string, payload: any): Promise<ApiResponse<any>> {
    return this.request(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify(payload) });
  }

  async sendAdminCommunication(payload: any): Promise<ApiResponse<any>> {
    return this.request('/admin/users/communications', { method: 'POST', body: JSON.stringify(payload) });
  }

  async getAdminBookings(paramsObj: Record<string,string|number|undefined> = {}): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    Object.entries(paramsObj).forEach(([k,v]) => { if (v !== undefined) params.set(k, String(v)); });
    return this.request(`/admin/bookings?${params}`);
  }

  async getAdminBooking(id: string): Promise<ApiResponse<any>> {
    return this.request(`/admin/bookings/${id}`);
  }

  async confirmBooking(id: string): Promise<ApiResponse<any>> {
    return this.request(`/admin/bookings/${id}/confirm`, { method: 'POST' });
  }

  async cancelBooking(id: string): Promise<ApiResponse<any>> {
    return this.request(`/admin/bookings/${id}/cancel`, { method: 'POST' });
  }

  async getBookingCommunications(bookingId: string): Promise<ApiResponse<any>> {
    return this.request(`/admin/bookings/${bookingId}/communications`);
  }

  exportBookingsUrl(paramsObj: Record<string,string|number|undefined> = {}) {
    const params = new URLSearchParams();
    Object.entries(paramsObj).forEach(([k,v]) => { if (v !== undefined) params.set(k, String(v)); });
    return `${this.baseUrl}/admin/bookings/export?${params}`;
  }

  // Promotion endpoints
  async getPromotion(roomId: number): Promise<ApiResponse<any>> {
    return this.request(`/promotions/${roomId}`);
  }

  async updatePromotion(roomId: number, payload: any): Promise<ApiResponse<any>> {
    return this.request(`/promotions/${roomId}`, { method: 'PUT', body: JSON.stringify(payload) });
  }

  async uploadPromotionImage(roomId: number, file: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('image', file);
    return this.request(`/promotions/${roomId}/upload`, { 
      method: 'POST', 
      body: formData,
      skipContentType: true 
    });
  }

  async uploadPromotionCardImage(roomId: number, file: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('image', file);
    return this.request(`/promotions/${roomId}/upload-card`, { 
      method: 'POST', 
      body: formData,
      skipContentType: true 
    });
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getAuthToken(): string | null {
    return this.token;
  }
}

// Instance singleton
export const api = new ApiService();