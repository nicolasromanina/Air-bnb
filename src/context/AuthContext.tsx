import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { api } from '@/services/api';

interface User {
  email: string;
  name: string;
  role: "admin";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock admin credentials (frontend-only simulation)
const MOCK_ADMIN = {
  email: "admin@sweethome.com",
  password: "admin123",
  name: "Administrateur",
};

const AUTH_STORAGE_KEY = "sweethome_admin_auth";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const init = async () => {
      // First, try the legacy admin auth storage (frontend mock)
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          setIsLoading(false);
          return;
        } catch {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }

      // If an API auth token exists (set by `api.login`), try to fetch current user
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const res = await api.getCurrentUser();
          if (res.success && res.data) {
            const u = res.data.user || res.data;
            setUser({
              email: u.email || '',
              name: u.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : u.name || u.email || '',
              role: (u.role === 'admin' ? 'admin' : 'admin') as 'admin',
            });
          }
        } catch (err) {
          console.warn('Failed to fetch current user for auth provider', err);
        }
      }

      setIsLoading(false);
    };

    init();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
      const userData: User = {
        email: MOCK_ADMIN.email,
        name: MOCK_ADMIN.name,
        role: "admin",
      };
      setUser(userData);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
