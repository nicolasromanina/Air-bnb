// components/AuthModal.tsx (version mise à jour)
import { useState } from "react";
import { X, Mail, Lock, User, AlertCircle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

const signupSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "signup";
}

const AuthModal = ({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);
  const { signIn, signUp } = useAuth();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const handleLogin = async (data: LoginFormData) => {
    const { error } = await signIn(data.email, data.password);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Connexion réussie !");
      onClose();
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    const { error } = await signUp(data.email, data.password, data.firstName, data.lastName);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Inscription réussie !");
      onClose();
    }
  };

  if (!isOpen) return null;

  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <p className="text-destructive text-xs flex items-center gap-1 mt-1">
        <AlertCircle size={14} />
        {message}
      </p>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl max-w-md w-full shadow-xl border border-border animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">
            {activeTab === "login" ? "Connexion" : "Inscription"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "login"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "signup"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Inscription
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "login" ? (
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    className="input-field pl-10"
                    {...loginForm.register("email")}
                  />
                </div>
                <ErrorMessage message={loginForm.formState.errors.email?.message} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="input-field pl-10"
                    {...loginForm.register("password")}
                  />
                </div>
                <ErrorMessage message={loginForm.formState.errors.password?.message} />
              </div>

              <button
                type="submit"
                disabled={loginForm.formState.isSubmitting}
                className="w-full btn-primary py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                {loginForm.formState.isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Prénom</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="text"
                      placeholder="Jean"
                      className="input-field pl-10"
                      {...signupForm.register("firstName")}
                    />
                  </div>
                  <ErrorMessage message={signupForm.formState.errors.firstName?.message} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Nom</label>
                  <input
                    type="text"
                    placeholder="Dupont"
                    className="input-field"
                    {...signupForm.register("lastName")}
                  />
                  <ErrorMessage message={signupForm.formState.errors.lastName?.message} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    className="input-field pl-10"
                    {...signupForm.register("email")}
                  />
                </div>
                <ErrorMessage message={signupForm.formState.errors.email?.message} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="input-field pl-10"
                    {...signupForm.register("password")}
                  />
                </div>
                <ErrorMessage message={signupForm.formState.errors.password?.message} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Confirmer le mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="input-field pl-10"
                    {...signupForm.register("confirmPassword")}
                  />
                </div>
                <ErrorMessage message={signupForm.formState.errors.confirmPassword?.message} />
              </div>

              <button
                type="submit"
                disabled={signupForm.formState.isSubmitting}
                className="w-full btn-primary py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                {signupForm.formState.isSubmitting ? (
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
        </div>
      </div>
    </div>
  );
};

export default AuthModal;