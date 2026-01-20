import { CreditCard, AlertCircle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";

const paymentSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: "Le prénom est requis" })
    .max(50, { message: "Le prénom ne doit pas dépasser 50 caractères" }),
  lastName: z
    .string()
    .trim()
    .min(1, { message: "Le nom est requis" })
    .max(50, { message: "Le nom ne doit pas dépasser 50 caractères" }),
  email: z
    .string()
    .trim()
    .email({ message: "Adresse email invalide" })
    .max(100, { message: "L'email ne doit pas dépasser 100 caractères" })
    .optional()
    .or(z.literal("")),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  totalAmount?: number;
  reservationDetails?: {
    title?: string;
    apartmentNumber?: string;
    date?: string;
  };
}

const PaymentForm = ({ totalAmount = 800, reservationDetails }: PaymentFormProps) => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    mode: "onBlur",
  });

const handleStripePayment = async (data: PaymentFormData) => {
  setIsRedirecting(true);
  
  try {
    console.log("🔧 Initiating Stripe payment...", { 
      customerInfo: data,
      amount: totalAmount,
      reservationDetails 
    });

    // Appel SIMPLIFIÉ - pas d'header Authorization
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // PAS d'Authorization header car --no-verify-jwt
        },
        body: JSON.stringify({
          amount: totalAmount, // Montant en euros
          reservationDetails: {
            ...reservationDetails,
            customerName: `${data.firstName} ${data.lastName}`,
            customerEmail: data.email,
          },
        }),
      }
    );

    console.log("📡 Response status:", response.status);
    
    const responseData = await response.json();
    console.log("📡 Response data:", responseData);
    
    if (!response.ok) {
      console.error('❌ Payment error response:', responseData);
      throw new Error(responseData.error || `Erreur HTTP: ${response.status}`);
    }

    if (responseData.url) {
      console.log("✅ Redirecting to Stripe Checkout:", responseData.url);
      toast.success("Redirection vers la page de paiement sécurisée...");
      
      // Rediriger immédiatement
      window.location.href = responseData.url;
    } else {
      throw new Error("URL de paiement non reçue");
    }
  } catch (err) {
    console.error("❌ Payment error:", err);
    toast.error(err instanceof Error ? err.message : "Erreur lors du paiement");
    setIsRedirecting(false);
  }
};

  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5">
        <AlertCircle size={12} />
        {message}
      </p>
    );
  };

  const isLoading = isSubmitting || isRedirecting;

  return (
    <form onSubmit={handleSubmit(handleStripePayment)} className="space-y-4">
      {/* Prénom */}
      <div>
        <label className="block text-sm font-medium mb-1.5 text-foreground">
          Prénom(s) <span className="text-primary">*</span>
        </label>
        <input
          type="text"
          placeholder="Veuillez saisir votre prénom"
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.firstName 
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
              : "border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
          } bg-background text-foreground placeholder:text-muted-foreground outline-none transition-colors`}
          {...register("firstName")}
          disabled={isLoading}
        />
        <ErrorMessage message={errors.firstName?.message} />
      </div>

      {/* Nom */}
      <div>
        <label className="block text-sm font-medium mb-1.5 text-foreground">
          Nom <span className="text-primary">*</span>
        </label>
        <input
          type="text"
          placeholder="Nom de famille"
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.lastName 
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
              : "border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
          } bg-background text-foreground placeholder:text-muted-foreground outline-none transition-colors`}
          {...register("lastName")}
          disabled={isLoading}
        />
        <ErrorMessage message={errors.lastName?.message} />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1.5 text-foreground">
          Adresse Email <span className="text-primary">*</span>
        </label>
        <input
          type="email"
          placeholder="Votre adresse mail"
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.email 
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
              : "border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
          } bg-background text-foreground placeholder:text-muted-foreground outline-none transition-colors`}
          {...register("email")}
          disabled={isLoading}
        />
        <ErrorMessage message={errors.email?.message} />
      </div>

      {/* Mode de Paiement */}
      <div className="pt-2">
        <label className="block text-sm font-medium mb-1.5 text-center text-foreground">
          Mode de Paiement
        </label>
        <div className="flex items-center justify-center gap-6 py-3">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
            alt="Visa" 
            className="h-5"
          />
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
            alt="Mastercard" 
            className="h-6"
          />
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" 
            alt="American Express" 
            className="h-5"
          />
          <span className="font-bold text-xs tracking-wider text-foreground">DISCOVER</span>
        </div>
      </div>

      {/* Stripe Info Notice */}
      <div className="bg-secondary/50 rounded-lg p-4 flex items-start gap-3">
        <CreditCard className="text-primary shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Paiement sécurisé</p>
          <p>Vous serez redirigé vers la page de paiement sécurisée pour finaliser votre transaction.</p>
        </div>
      </div>

      {/* Total Amount */}
      <div className="border-t border-border pt-4 mt-4">
        <div className="flex justify-between items-center text-lg font-bold">
          <span className="text-foreground">Total à payer</span>
          <span className="text-primary">{totalAmount}€</span>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          En cliquant sur "Effectuer le paiement", vous acceptez nos conditions générales de vente
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-primary-foreground py-4 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Préparation du paiement...
          </>
        ) : (
          `Effectuer le paiement de ${totalAmount}€`
        )}
      </button>
    </form>
  );
};

export default PaymentForm;