// pages/AuthPage.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Mail, Lock, User, AlertCircle, Loader2, Home } from 'lucide-react';
import { api } from '@/services/api';

// --- Schemas de validation ---
const loginSchema = z.object({
  email: z.string().email({ message: "Adresse email invalide" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
});

const registerSchema = z.object({
  firstName: z.string().min(1, { message: "Le prénom est requis" }),
  lastName: z.string().min(1, { message: "Le nom est requis" }),
  email: z.string().email({ message: "Adresse email invalide" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

// --- Types ---
type AuthMode = 'login' | 'register';

const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);

  // Récupérer le mode depuis l'URL (ex: /auth?tab=register)
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'register' || tab === 'signup') {
      setMode('register');
    } else if (tab === 'login') {
      setMode('login');
    }

    // Vérifier si l'utilisateur est déjà connecté
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Rediriger vers la page précédente ou l'accueil
      const returnUrl = searchParams.get('returnUrl') || '/';
      navigate(returnUrl);
    }
  }, [searchParams, navigate]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
  };

  const handleLogin = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const response = await api.login(data as any);
      
      if (response.success) {
        toast.success('Connexion réussie !');

        // Si l'utilisateur est admin/superadmin, rediriger vers l'admin
        const role = response.data?.user?.role;
        if (role === 'admin' || role === 'superadmin') {
          navigate('/admin');
          return;
        }

        // Rediriger vers la page précédente ou l'accueil
        const returnUrl = searchParams.get('returnUrl') || '/';
        navigate(returnUrl);
      } else {
        toast.error(response.error || 'Échec de la connexion');
      }
    } catch (error) {
      toast.error('Erreur lors de la connexion');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      const response = await api.signup({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      
      if (response.success) {
        toast.success('Inscription réussie ! Vous êtes maintenant connecté.');
        
        // Rediriger vers la page précédente ou l'accueil
        const returnUrl = searchParams.get('returnUrl') || '/';
        navigate(returnUrl);
      } else {
        toast.error(response.error || "Échec de l'inscription");
      }
    } catch (error) {
      toast.error("Erreur lors de l'inscription");
      console.error('Register error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
        <AlertCircle size={14} />
        {message}
      </p>
    );
  };

  return (
    <div className="font-['Montserrat'] min-h-screen bg-[#F9FAFB] flex flex-col justify-center items-center px-4 py-12">
      
      {/* Logo et bouton d'accueil */}
      <div className="mb-10 text-center">
        <img 
          src="/Logo.png" 
          alt="SweetHome Logo" 
          className="h-[40px] w-auto mx-auto object-contain mb-4" 
        />
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <Home size={16} />
          Retour à l'accueil
        </button>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-[480px] bg-white rounded-[20px] p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-50">
        
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-black mb-2">
            {mode === 'login' ? 'Bon retour !' : 'Créer un compte'}
          </h1>
          <p className="text-[14px] text-gray-500">
            {mode === 'login' 
              ? 'Veuillez saisir vos identifiants pour accéder à votre espace.' 
              : 'Inscrivez-vous pour commencer à réserver vos appartements.'}
          </p>
        </div>

        {mode === 'login' ? (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6">
            <div>
              <label className="block text-[12px] font-bold mb-2 tracking-wide">Adresse e-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  placeholder="votre@email.com" 
                  className="w-full bg-[#F3F4F6] p-4 pl-10 rounded-[8px] outline-none text-[14px] focus:ring-1 focus:ring-[#FF2D75]/20 transition-all" 
                  {...loginForm.register('email')}
                  disabled={isLoading}
                />
              </div>
              <ErrorMessage message={loginForm.formState.errors.email?.message} />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[12px] font-bold tracking-wide">Mot de passe</label>
                <button 
                  type="button" 
                  className="text-[11px] text-[#FF2D75] font-semibold hover:underline"
                  onClick={() => navigate('/forgot-password')}
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-[#F3F4F6] p-4 pl-10 rounded-[8px] outline-none text-[14px] focus:ring-1 focus:ring-[#FF2D75]/20 transition-all" 
                  {...loginForm.register('password')}
                  disabled={isLoading}
                />
              </div>
              <ErrorMessage message={loginForm.formState.errors.password?.message} />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#FF2D75] text-white font-bold py-4 rounded-[8px] text-[15px] hover:bg-[#e62969] transition-all transform active:scale-[0.98] uppercase tracking-wider shadow-lg shadow-[#FF2D75]/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold mb-2 tracking-wide">Prénom</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Jean" 
                    className="w-full bg-[#F3F4F6] p-4 pl-10 rounded-[8px] outline-none text-[14px] focus:ring-1 focus:ring-[#FF2D75]/20 transition-all" 
                    {...registerForm.register('firstName')}
                    disabled={isLoading}
                  />
                </div>
                <ErrorMessage message={registerForm.formState.errors.firstName?.message} />
              </div>
              <div>
                <label className="block text-[12px] font-bold mb-2 tracking-wide">Nom</label>
                <input 
                  type="text" 
                  placeholder="Dupont" 
                  className="w-full bg-[#F3F4F6] p-4 rounded-[8px] outline-none text-[14px] focus:ring-1 focus:ring-[#FF2D75]/20 transition-all" 
                  {...registerForm.register('lastName')}
                  disabled={isLoading}
                />
                <ErrorMessage message={registerForm.formState.errors.lastName?.message} />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold mb-2 tracking-wide">Adresse e-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  placeholder="votre@email.com" 
                  className="w-full bg-[#F3F4F6] p-4 pl-10 rounded-[8px] outline-none text-[14px] focus:ring-1 focus:ring-[#FF2D75]/20 transition-all" 
                  {...registerForm.register('email')}
                  disabled={isLoading}
                />
              </div>
              <ErrorMessage message={registerForm.formState.errors.email?.message} />
            </div>

            <div>
              <label className="block text-[12px] font-bold mb-2 tracking-wide">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-[#F3F4F6] p-4 pl-10 rounded-[8px] outline-none text-[14px] focus:ring-1 focus:ring-[#FF2D75]/20 transition-all" 
                  {...registerForm.register('password')}
                  disabled={isLoading}
                />
              </div>
              <ErrorMessage message={registerForm.formState.errors.password?.message} />
            </div>

            <div>
              <label className="block text-[12px] font-bold mb-2 tracking-wide">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-[#F3F4F6] p-4 pl-10 rounded-[8px] outline-none text-[14px] focus:ring-1 focus:ring-[#FF2D75]/20 transition-all" 
                  {...registerForm.register('confirmPassword')}
                  disabled={isLoading}
                />
              </div>
              <ErrorMessage message={registerForm.formState.errors.confirmPassword?.message} />
            </div>

            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                id="terms" 
                className="mt-1 w-4 h-4 accent-[#FF2D75] cursor-pointer" 
                required
              />
              <label htmlFor="terms" className="text-[11px] text-gray-500 leading-snug cursor-pointer">
                J'accepte les <span className="text-black font-semibold underline">Conditions d'Utilisation</span> et la <span className="text-black font-semibold underline">Politique de Confidentialité</span>.
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#FF2D75] text-white font-bold py-4 rounded-[8px] text-[15px] hover:bg-[#e62969] transition-all transform active:scale-[0.98] uppercase tracking-wider shadow-lg shadow-[#FF2D75]/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Inscription...
                </>
              ) : (
                "S'inscrire"
              )}
            </button>
          </form>
        )}

        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <p className="text-[14px] text-gray-500">
            {mode === 'login' ? "Vous n'avez pas encore de compte ?" : "Vous avez déjà un compte ?"}
            <button 
              onClick={toggleMode}
              disabled={isLoading}
              className="ml-2 text-black font-bold hover:text-[#FF2D75] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mode === 'login' ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </div>

        {/* Lien vers la page de paiement si venu depuis là */}
        {searchParams.get('returnUrl')?.includes('/payment') && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-[12px] text-gray-500 text-center">
              Après votre connexion, vous serez redirigé automatiquement vers la page de paiement.
            </p>
          </div>
        )}
      </div>

      <p className="mt-8 text-[12px] text-gray-400 tracking-widest font-medium">
        © 2024 SweetHome App
      </p>
    </div>
  );
};

export default AuthPage;