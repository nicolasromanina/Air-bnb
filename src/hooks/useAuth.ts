// hooks/useAuth.ts - Version avec debug
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  stripeCustomerId?: string;
  phone?: string;
  createdAt?: string;
}

export interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: Error }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error?: Error }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadUser = useCallback(async () => {
    console.log('=== loadUser called ===');
    try {
      setIsLoading(true);
      
      // Vérifier d'abord si un token existe
      const token = localStorage.getItem('auth_token');
      console.log('Token from localStorage:', token ? 'present' : 'missing');
      
      if (!token) {
        console.log('No token found, setting user to null');
        setUser(null);
        return;
      }
      
      // Vérifier si le token est expiré
      const tokenData = parseJwt(token);
      console.log('Token data:', tokenData);
      
      if (tokenData && tokenData.exp && tokenData.exp * 1000 < Date.now()) {
        console.log('Token expired, logging out...');
        api.clearToken();
        setUser(null);
        return;
      }
      
      // Charger l'utilisateur depuis l'API
      console.log('Calling api.getCurrentUser()...');
      const response = await api.getCurrentUser();
      console.log('API Response:', response);
      
      if (response.success && response.data?.user) {
        console.log('Setting user:', response.data.user);
        setUser(response.data.user);
      } else {
        // Si l'API retourne une erreur, nettoyer le token
        console.log('API error or no user data, clearing token');
        api.clearToken();
        setUser(null);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      api.clearToken();
      setUser(null);
    } finally {
      console.log('loadUser finished, setting isLoading to false');
      setIsLoading(false);
    }
  }, []);

  // Fonction utilitaire pour parser le JWT
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      console.log('Parsed JWT payload:', JSON.parse(jsonPayload));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('useAuth useEffect triggered');
    loadUser();
  }, [loadUser]);

  const signIn = async (email: string, password: string) => {
    console.log('signIn called with:', { email });
    try {
      setIsLoading(true);
      const response = await api.login({ email, password });
      console.log('Login response:', response);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        toast.success('Connexion réussie !');
        return {};
      } else {
        throw new Error(response.error || 'Échec de la connexion');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Échec de la connexion';
      console.error('Login error:', message);
      toast.error(message);
      return { error: error instanceof Error ? error : new Error(message) };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setIsLoading(true);
      const response = await api.signup({ email, password, firstName, lastName });
      
      if (response.success && response.data) {
        setUser(response.data.user);
        toast.success('Inscription réussie !');
        return {};
      } else {
        throw new Error(response.error || 'Échec de l\'inscription');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Échec de l\'inscription';
      toast.error(message);
      return { error: error instanceof Error ? error : new Error(message) };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      api.clearToken();
      toast.success('Déconnexion réussie');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const refreshUser = async () => {
    await loadUser();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    refreshUser,
  };
};