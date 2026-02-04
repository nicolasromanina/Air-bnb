// services/api.ts
import { config, getBaseUrl, getServiceUrl, getNormalizedBaseUrl } from '@/config/env';
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
    // Prefer a normalized, absolute base URL in the browser to avoid relative/malformed URLs
    this.baseUrl = (typeof window !== 'undefined') ? getNormalizedBaseUrl() : getBaseUrl();
    this.loadToken();
  }

  private loadToken() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  private saveToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      this.token = token;
    }
  }

  clearToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    this.token = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & { skipContentType?: boolean; timeout?: number } = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const { skipContentType, timeout = 30000, ...restOptions } = options;
    
    const headers: HeadersInit = {
      ...(skipContentType ? {} : { 'Content-Type': 'application/json' }),
      ...restOptions.headers,
    };

    // Ajouter le token d'authentification si disponible
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const requestOptions: RequestInit = {
      ...restOptions,
      headers,
      credentials: 'include' as RequestCredentials,
      signal: controller.signal,
    };

    try {
      const response = await fetch(url, requestOptions);
      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type');
      let data: any;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text };
      }

      if (!response.ok) {
        // Gérer les erreurs d'authentification
        if (response.status === 401) {
          this.clearToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }

        return {
          success: false,
          error: data.error || `Erreur HTTP ${response.status}: ${response.statusText}`,
          data: data.data || data,
          message: data.message,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        return {
          success: false,
          error: 'La requête a expiré. Veuillez réessayer.',
        };
      }
      
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
    await this.request('/auth/logout', { method: 'POST' });
    this.clearToken();
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

  async patch<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // ========== PAIEMENTS ==========
  async createPayment(paymentData: PaymentRequest): Promise<ApiResponse<PaymentResponse>> {
    return this.request<PaymentResponse>('/payments/create', {
      method: 'POST',
      body: JSON.stringify(paymentData),
      timeout: 60000,
    });
  }

  async verifyPayment(sessionId: string): Promise<ApiResponse<VerifyPaymentResponse>> {
    return this.request<VerifyPaymentResponse>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });
  }

  async getStripeSessionDetails(sessionId: string): Promise<ApiResponse<any>> {
    return this.request(`/payments/stripe/session/${sessionId}`);
  }

  async getPaymentBySessionId(sessionId: string): Promise<ApiResponse<any>> {
    return this.request(`/payments/session/${sessionId}`);
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

  // ========== PROMOTIONS ==========
  async getPromotion(roomId: number): Promise<ApiResponse<any>> {
    return this.request(`/promotions/${roomId}`);
  }

  // ========== OPTIONS SUPPLÉMENTAIRES ==========
  async getAdditionalOptions(apartmentId?: number): Promise<ApiResponse<any>> {
    const q = apartmentId ? `?apartmentId=${encodeURIComponent(String(apartmentId))}` : '';
    return this.request(`/options${q}`);
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

  // ========== APARTMENTS ==========
  async getApartments(): Promise<ApiResponse<any>> {
    return this.request('/apartment');
  }

  async getApartmentById(id: number): Promise<ApiResponse<any>> {
    return this.request(`/apartment/${id}`);
  }

  async updateApartment(id: number, data: any): Promise<ApiResponse<any>> {
    return this.request(`/apartment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ========== ROOM DETAILS ==========
  async getRoomDetail(roomId: number): Promise<ApiResponse<any>> {
    return this.request(`/room-details/${roomId}`);
  }

  async updateRoomDetail(roomId: number, data: any): Promise<ApiResponse<any>> {
    return this.request(`/room-details/${roomId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ========== SEARCH ==========
  async searchApartments(filters: any): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    return this.request(`/search?${params}`);
  }

  // ========== HOME PAGE ==========
  async getHomePage(): Promise<ApiResponse<any>> {
    return this.request('/home');
  }

  async updateHomePage(data: any): Promise<ApiResponse<any>> {
    return this.request('/home', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ========== SERVICES PAGE ==========
  async getServicesPage(): Promise<ApiResponse<any>> {
    return this.request('/services');
  }

  async updateServicesPage(data: any): Promise<ApiResponse<any>> {
    return this.request('/services', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ========== CONTACT PAGE ==========
  async getContactPage(): Promise<ApiResponse<any>> {
    return this.request('/contact');
  }

  async updateContactPage(data: any): Promise<ApiResponse<any>> {
    return this.request('/contact', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async submitContactForm(data: any): Promise<ApiResponse<any>> {
    return this.request('/contact/submit', {
      method: 'POST',
      body: JSON.stringify(data),
      timeout: 90000,
    });
  }

  // ========== FOOTER ==========
  async getFooter(): Promise<ApiResponse<any>> {
    return this.request('/footer');
  }

  async updateFooter(data: any): Promise<ApiResponse<any>> {
    return this.request('/footer', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ========== UPLOAD ==========
  async uploadImage(file: File, service?: string): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('image', file);
    if (service) {
      formData.append('service', service);
    }

    return this.request('/upload', {
      method: 'POST',
      body: formData,
      skipContentType: true,
      timeout: 60000,
    });
  }

  async uploadVideo(file: File, service?: string): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('video', file);
    if (service) {
      formData.append('service', service);
    }

    return this.request('/upload/video', {
      method: 'POST',
      body: formData,
      skipContentType: true,
      timeout: 120000,
    });
  }

  // ========== UTILITAIRES ==========
  async healthCheck(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl.replace('/api', '')}/health`);
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data,
        };
      }
      return {
        success: false,
        error: 'Serveur non disponible',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Serveur non disponible',
      };
    }
  }

  // ========== ADMIN ==========
  async getAdminStats(): Promise<ApiResponse<any>> {
    return this.request('/admin/stats');
  }

  async getAdminUsers(page = 1, limit = 20, search?: string): Promise<ApiResponse<PaginatedResponse<any>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) {
      params.append('search', search);
    }

    return this.request(`/admin/users?${params}`);
  }

  async getAdminReservations(filters?: any): Promise<ApiResponse<PaginatedResponse<any>>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    return this.request(`/admin/reservations?${params}`);
  }

  async updateReservationStatus(id: string, status: string): Promise<ApiResponse<any>> {
    return this.request(`/admin/reservations/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getAdminBooking(id: string): Promise<ApiResponse<any>> {
    return this.request(`/admin/bookings/${id}`);
  }

  async getBookingCommunications(bookingId: string): Promise<ApiResponse<any>> {
    return this.request(`/admin/bookings/${bookingId}/communications`);
  }

  async sendAdminCommunication(data: any): Promise<ApiResponse<any>> {
    return this.request('/admin/communications/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUserRole(id: string, data: { role: string }): Promise<ApiResponse<any>> {
    return this.request(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getAdminPayments(page = 1, limit = 50): Promise<ApiResponse<PaginatedResponse<any>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return this.request(`/admin/payments?${params}`);
  }

  async refundAdminPayment(paymentId: string, reason: string): Promise<ApiResponse<any>> {
    return this.request(`/admin/payments/${paymentId}/refund`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async getAdminBookings(filters?: any): Promise<ApiResponse<PaginatedResponse<any>>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    return this.request(`/admin/bookings?${params}`);
  }

  async confirmBooking(id: string): Promise<ApiResponse<any>> {
    return this.request(`/admin/bookings/${id}/confirm`, {
      method: 'POST',
    });
  }

  async cancelBooking(id: string): Promise<ApiResponse<any>> {
    return this.request(`/admin/bookings/${id}/cancel`, {
      method: 'POST',
    });
  }

  // ========== MÉTHODES UTILITAIRES ==========
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getAuthToken(): string | null {
    return this.token;
  }

  setAuthToken(token: string): void {
    this.saveToken(token);
  }
}

// Instance singleton
export const api = new ApiService();