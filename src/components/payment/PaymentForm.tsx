import { CreditCard, AlertCircle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { api, PaymentRequest } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

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
  basePrice?: number;
  optionsPrice?: number;
  selectedOptions?: Array<{
    optionId: string;
    name: string;
    price: number;
    quantity: number;
    pricingType: string;
  }>;
  reservationDetails?: {
    title?: string;
    apartmentNumber?: string;
    date?: string;
    apartmentId?: number;
    nights?: number;
    guests?: number;
    bedrooms?: number;
    pricePerNight?: number;
    image?: string;
    includes?: string[];
    checkIn?: string;
    checkOut?: string;
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
  onSuggestDate?: (newCheckInIso: string, newCheckOutIso: string) => void;
}

const PaymentForm = ({ totalAmount = 800, basePrice, optionsPrice, selectedOptions, reservationDetails, onSuggestDate }: PaymentFormProps) => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { user, isAuthenticated } = useAuth();
  
  // Calculer le montant correct basé sur basePrice et optionsPrice
  // Priorité: basePrice+optionsPrice > totalAmount > 800
  const finalAmount = (() => {
    // Convertir à nombre si nécessaire
    const bp = typeof basePrice === 'string' ? parseFloat(basePrice) : basePrice;
    const op = typeof optionsPrice === 'string' ? parseFloat(optionsPrice) : optionsPrice;
    const ta = typeof totalAmount === 'string' ? parseFloat(totalAmount) : totalAmount;
    
    // Essayer d'utiliser basePrice en priorité
    if (typeof bp === 'number' && !isNaN(bp) && bp > 0) {
      const optPrice = typeof op === 'number' && !isNaN(op) ? op : 0;
      return bp + optPrice;
    }
    // Sinon utiliser totalAmount
    if (typeof ta === 'number' && !isNaN(ta) && ta > 0) {
      return ta;
    }
    // Fallback: 800
    return 800;
  })();

  // Vérification de débogage
  useEffect(() => {
    console.log("💰 Montants dans PaymentForm:", {
      totalAmount,
      basePrice,
      optionsPrice,
      finalAmount,
      hasBasePrice: basePrice !== undefined && basePrice !== null,
      reservationDetailsBasePrice: reservationDetails?.basePrice
    });
  }, [totalAmount, basePrice, optionsPrice, reservationDetails]);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    },
  });

  const handlePayment = async (data: PaymentFormData) => {
    if (!isAuthenticated) {
      toast.error("Veuillez vous connecter pour effectuer un paiement");
      return;
    }

    if (!reservationDetails?.apartmentId) {
      toast.error("Détails de réservation manquants");
      return;
    }

    setIsRedirecting(true);
    
    try {
      console.log("🔧 Initialisation du paiement...", { 
        customerInfo: data,
        amount: finalAmount,
        basePrice,
        optionsPrice,
        reservationDetails 
      });

      // Helper function to extract number from string (e.g., "3 Chambres" -> 3)
      const extractNumber = (value: any): number => {
        if (typeof value === 'number' && !isNaN(value)) return value;
        if (typeof value === 'string') {
          const match = value.match(/\d+/);
          return match ? parseInt(match[0], 10) : 1;
        }
        return 1;
      };

      // Préparer les dates
      const checkInDate = reservationDetails?.checkIn 
        ? new Date(reservationDetails.checkIn)
        : new Date();
      
      const checkOutDate = reservationDetails?.checkOut 
        ? new Date(reservationDetails.checkOut)
        : new Date(checkInDate.getTime() + (reservationDetails?.nights || 1) * 24 * 60 * 60 * 1000);

      // Préparer les données pour le backend
      const paymentRequest: PaymentRequest = {
        amount: finalAmount,
        reservationDetails: {
          apartmentId: reservationDetails.apartmentId,
          apartmentNumber: reservationDetails.apartmentNumber || `Appartement ${reservationDetails.apartmentId}`,
          title: reservationDetails.title || "Réservation",
          image: reservationDetails.image || 'https://images.unsplash.com/photo-1560184897-e6270f3f322f?auto=format&fit=crop&w=1200&q=80',
          includes: reservationDetails.includes || [],
          checkIn: checkInDate.toISOString(),
          checkOut: checkOutDate.toISOString(),
          nights: extractNumber(reservationDetails.nights),
          guests: extractNumber(reservationDetails.guests),
          bedrooms: extractNumber(reservationDetails.bedrooms),
          totalPrice: finalAmount,
          pricePerNight: reservationDetails.pricePerNight || finalAmount,
          customerName: `${data.firstName} ${data.lastName}`,
          customerEmail: data.email,
          basePrice: reservationDetails.basePrice,
          optionsPrice: reservationDetails.optionsPrice,
          selectedOptions: reservationDetails.selectedOptions,
        },
      };

      const response = await api.createPayment(paymentRequest);

      if (response.success && response.data?.url) {
        console.log("✅ Redirection vers Stripe Checkout:", response.data.url);
        
        // IMPORTANT: Sauvegarder les données complètes dans localStorage AVANT redirection
        const completeReservationData = {
          ...reservationDetails,
          checkIn: checkInDate.toISOString(),
          checkOut: checkOutDate.toISOString(),
          nights: extractNumber(reservationDetails.nights),
          guests: extractNumber(reservationDetails.guests),
          bedrooms: extractNumber(reservationDetails.bedrooms),
          total: finalAmount,
          basePrice: reservationDetails.basePrice,
          optionsPrice: reservationDetails.optionsPrice,
          selectedOptions: reservationDetails.selectedOptions,
          customerEmail: data.email,
          customerName: `${data.firstName} ${data.lastName}`,
        };
        localStorage.setItem('currentReservation', JSON.stringify(completeReservationData));
        console.log("💾 Données sauvegardées dans localStorage avec montant:", finalAmount);
        
        toast.success("Redirection vers la page de paiement sécurisée...");
        
        // Rediriger immédiatement
        window.location.href = response.data.url;
      } else {
        // If backend returned a suggested available date, surface it in the UI
        const suggested = response.data?.availableFrom || response.data?.nextAvailable || response.data?.availableFrom;
        if (suggested) {
          setSuggestedDate(new Date(suggested));
        }

        throw new Error(response.error || "URL de paiement non reçue");
      }
    } catch (err) {
      console.error("❌ Payment error:", err);
      toast.error(err instanceof Error ? err.message : "Erreur lors du paiement");
      setIsRedirecting(false);
    }
  };

  const [suggestedDate, setSuggestedDate] = useState<Date | null>(null);

  const handleUseSuggested = () => {
    if (!suggestedDate || !reservationDetails) return;

    // compute duration from reservationDetails
    const originalCheckIn = reservationDetails.checkIn ? new Date(reservationDetails.checkIn) : new Date();
    const originalCheckOut = reservationDetails.checkOut ? new Date(reservationDetails.checkOut) : new Date(originalCheckIn.getTime() + (reservationDetails.nights || 1) * 24 * 60 * 60 * 1000);
    const durationMs = originalCheckOut.getTime() - originalCheckIn.getTime();

    const newCheckIn = new Date(suggestedDate);
    const newCheckOut = new Date(newCheckIn.getTime() + durationMs);

    // Notify parent to update reservation (and localStorage)
    if (typeof onSuggestDate === 'function') {
      onSuggestDate(newCheckIn.toISOString(), newCheckOut.toISOString());
    }

    // Also update local suggested state to reflect change
    setSuggestedDate(null);
    toast.success('Dates mises à jour avec la suggestion');
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
    <form onSubmit={handleSubmit(handlePayment)} className="space-y-4">
      {/* RÉCAPITULATIF COMPLET DE LA RÉSERVATION */}
      <div className="bg-card rounded-lg border border-border p-6 space-y-4">
        <h3 className="font-bold text-foreground">Récapitulatif de votre réservation</h3>
        
        {/* Titre du logement */}
        {reservationDetails?.title && (
          <div className="pb-4 border-b border-border">
            <h4 className="font-semibold text-lg text-foreground">{reservationDetails.title}</h4>
            {reservationDetails.apartmentNumber && (
              <p className="text-sm text-muted-foreground">{reservationDetails.apartmentNumber}</p>
            )}
          </div>
        )}

        {/* Dates et durée */}
        {reservationDetails?.checkIn && reservationDetails?.checkOut && (
          <div className="grid grid-cols-2 gap-4 py-2">
            <div>
              <p className="text-xs text-muted-foreground font-semibold mb-1">Arrivée</p>
              <p className="text-sm font-medium">{new Date(reservationDetails.checkIn).toLocaleDateString('fr-FR')}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold mb-1">Départ</p>
              <p className="text-sm font-medium">{new Date(reservationDetails.checkOut).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        )}

        {/* Personnes et chambres */}
        {(reservationDetails?.guests || reservationDetails?.bedrooms) && (
          <div className="grid grid-cols-2 gap-4 py-2 border-t border-b border-border">
            {reservationDetails.guests && (
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">Personnes</p>
                <p className="text-sm font-medium">{reservationDetails.guests}</p>
              </div>
            )}
            {reservationDetails.bedrooms && (
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">Chambres</p>
                <p className="text-sm font-medium">{reservationDetails.bedrooms}</p>
              </div>
            )}
          </div>
        )}

        {/* Inclusions */}
        {reservationDetails?.includes && reservationDetails.includes.length > 0 && (
          <div className="py-2">
            <p className="text-xs text-muted-foreground font-semibold mb-2">Inclus</p>
            <ul className="space-y-1">
              {reservationDetails.includes.map((item: string, idx: number) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Résumé des options sélectionnées */}
      {reservationDetails?.selectedOptions && reservationDetails.selectedOptions.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-3">Options incluses dans cette réservation</h4>
          <div className="space-y-2">
            {reservationDetails.selectedOptions.map((option, idx) => (
              <div key={idx} className="flex justify-between items-start text-sm">
                <span className="text-green-900">{option.name}</span>
                <span className="font-semibold text-green-900">{(option.price * option.quantity).toFixed(2)}€</span>
              </div>
            ))}
            {reservationDetails.optionsPrice && reservationDetails.optionsPrice > 0 && (
              <div className="border-t border-green-200 pt-2 mt-2">
                <div className="flex justify-between font-semibold text-green-900">
                  <span>Total options</span>
                  <span>{reservationDetails.optionsPrice}€</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Répartition des coûts - IMPORTANT */}
      {reservationDetails?.basePrice && (
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 rounded-lg p-5 text-sm">
          <div className="space-y-2.5">
            <div className="flex justify-between">
              <span className="text-foreground font-medium">Coût du logement</span>
              <span className="font-semibold text-foreground">{reservationDetails.basePrice}€</span>
            </div>
            {reservationDetails.optionsPrice && reservationDetails.optionsPrice > 0 && (
              <div className="flex justify-between">
                <span className="text-foreground font-medium">Options supplémentaires</span>
                <span className="font-semibold text-green-600">{reservationDetails.optionsPrice}€</span>
              </div>
            )}
            <div className="border-t border-primary/20 pt-2.5">
              <div className="flex justify-between">
                <span className="text-foreground font-bold text-base">MONTANT TOTAL</span>
                <span className="text-primary font-bold text-lg">{finalAmount}€</span>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Message de connexion requise */}
      {!isAuthenticated && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          <p className="font-medium">Connexion requise</p>
          <p>Veuillez vous connecter pour effectuer un paiement.</p>
        </div>
      )}

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
          <span className="text-primary">{finalAmount}€</span>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          En cliquant sur "Effectuer le paiement", vous acceptez nos conditions générales de vente
        </p>
      </div>

      {/* Submit Button */}
      {suggestedDate && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 mb-2">Les dates sélectionnées sont réservées.</p>
          <div className="flex items-center gap-3">
            <span className="text-sm">Suggestion : commencer à partir du <strong>{suggestedDate.toLocaleDateString('fr-FR')}</strong></span>
            <button
              type="button"
              onClick={handleUseSuggested}
              className="ml-auto inline-flex items-center px-3 py-2 bg-primary text-white rounded text-sm"
            >
              Commencer à partir de cette date
            </button>
          </div>
        </div>
      )}
      <button
        type="submit"
        disabled={isLoading || !isAuthenticated}
        className="w-full bg-primary text-primary-foreground py-4 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Préparation du paiement...
          </>
        ) : !isAuthenticated ? (
          "Connexion requise"
        ) : (
          `Effectuer le paiement de ${finalAmount}€`
        )}
      </button>
    </form>
  );
};

export default PaymentForm;