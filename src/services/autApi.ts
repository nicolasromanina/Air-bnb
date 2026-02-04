import { api } from './api';

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  stripeCustomerId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export const authService = {
  // ========== AUTHENTIFICATION ==========
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.login(credentials);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la connexion');
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.signup(credentials);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de l\'inscription');
  },

  async logout(): Promise<void> {
    await api.logout();
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.getCurrentUser();
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la récupération de l\'utilisateur');
  },

  // ========== MOT DE PASSE ==========
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/auth/forgot-password', { email });
    if (response.success) {
      return {
        success: true,
        message: response.message || 'Email de réinitialisation envoyé'
      };
    }
    return {
      success: false,
      message: response.error || 'Erreur lors de l\'envoi de l\'email'
    };
  },

  async resetPassword(data: ResetPasswordData): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/auth/reset-password', data);
    if (response.success) {
      return {
        success: true,
        message: response.message || 'Mot de passe réinitialisé avec succès'
      };
    }
    return {
      success: false,
      message: response.error || 'Erreur lors de la réinitialisation du mot de passe'
    };
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/auth/change-password', { currentPassword, newPassword });
    if (response.success) {
      return {
        success: true,
        message: response.message || 'Mot de passe changé avec succès'
      };
    }
    return {
      success: false,
      message: response.error || 'Erreur lors du changement de mot de passe'
    };
  },

  // ========== PROFIL ==========
  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.updateUserProfile(data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Erreur lors de la mise à jour du profil');
  },

  async deleteAccount(): Promise<{ success: boolean; message: string }> {
    const response = await api.delete('/auth/account');
    if (response.success) {
      await api.logout();
      return {
        success: true,
        message: response.message || 'Compte supprimé avec succès'
      };
    }
    return {
      success: false,
      message: response.error || 'Erreur lors de la suppression du compte'
    };
  },

  // ========== VERIFICATION ==========
  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/auth/verify-email', { token });
    if (response.success) {
      return {
        success: true,
        message: response.message || 'Email vérifié avec succès'
      };
    }
    return {
      success: false,
      message: response.error || 'Erreur lors de la vérification de l\'email'
    };
  },

  async resendVerificationEmail(): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/auth/resend-verification');
    if (response.success) {
      return {
        success: true,
        message: response.message || 'Email de vérification renvoyé'
      };
    }
    return {
      success: false,
      message: response.error || 'Erreur lors de l\'envoi de l\'email de vérification'
    };
  },

  // ========== SESSIONS ==========
  async getActiveSessions(): Promise<any[]> {
    const response = await api.get('/auth/sessions');
    if (response.success) {
      return response.data || [];
    }
    throw new Error(response.error || 'Erreur lors de la récupération des sessions');
  },

  async revokeSession(sessionId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/auth/sessions/${sessionId}`);
    if (response.success) {
      return {
        success: true,
        message: response.message || 'Session révoquée avec succès'
      };
    }
    return {
      success: false,
      message: response.error || 'Erreur lors de la révocation de la session'
    };
  },

  async revokeAllSessions(): Promise<{ success: boolean; message: string }> {
    const response = await api.delete('/auth/sessions');
    if (response.success) {
      return {
        success: true,
        message: response.message || 'Toutes les sessions ont été révoquées'
      };
    }
    return {
      success: false,
      message: response.error || 'Erreur lors de la révocation des sessions'
    };
  },

  // ========== UTILITAIRES ==========
  isAuthenticated(): boolean {
    return api.isAuthenticated();
  },

  getAuthToken(): string | null {
    return api.getAuthToken();
  },

  // Gestion des permissions
  hasRole(requiredRole: string): boolean {
    try {
      const token = this.getAuthToken();
      if (!token) return false;

      // Décoder le token JWT (partie payload)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === requiredRole || payload.role === 'admin';
    } catch (error) {
      return false;
    }
  },

  hasAnyRole(roles: string[]): boolean {
    try {
      const token = this.getAuthToken();
      if (!token) return false;

      const payload = JSON.parse(atob(token.split('.')[1]));
      return roles.includes(payload.role) || payload.role === 'admin';
    } catch (error) {
      return false;
    }
  },

  // Stockage local sécurisé
  saveToLocalStorage(key: string, value: any): void {
    try {
      const encrypted = btoa(JSON.stringify(value));
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Erreur lors du stockage local:', error);
    }
  },

  getFromLocalStorage(key: string): any {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      return JSON.parse(atob(encrypted));
    } catch (error) {
      console.error('Erreur lors de la récupération locale:', error);
      return null;
    }
  },

  removeFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
  },

  // Validation des données
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePassword(password: string): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une minuscule');
    }

    if (!/\d/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un caractère spécial');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
};

export default authService;