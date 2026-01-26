// components/AuthGuard.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      // Rediriger vers la page d'authentification avec un paramètre de retour
      const currentPath = window.location.pathname + window.location.search;
      navigate(`/auth?returnUrl=${encodeURIComponent(currentPath)}`);
    }
  }, [isAuthenticated, isLoading, navigate, requireAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="text-center">
          <p className="text-lg mb-4">Redirection vers la page de connexion...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;