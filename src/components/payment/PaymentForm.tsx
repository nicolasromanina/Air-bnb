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
  
  // Calculer le montant total correct
  const calculateFinalAmount = () => {
    // Extraire le nombre de nuits
    const nights = reservationDetails?.nights || 1;
    
    // 1. Calculer le prix du logement pour le séjour complet
    let calculatedBasePrice = 0;
    let pricePerNightValue = 0;
    
    // Priorité 1: basePrice fourni (déjà le total pour le séjour)
    if (typeof basePrice === 'number' && !isNaN(basePrice) && basePrice > 0) {
      calculatedBasePrice = basePrice;
      pricePerNightValue = basePrice / nights;
    }
    // Priorité 2: basePrice dans reservationDetails
    else if (reservationDetails?.basePrice) {
      const bp = typeof reservationDetails.basePrice === 'string' 
        ? parseFloat(reservationDetails.basePrice) 
        : reservationDetails.basePrice;
      if (!isNaN(bp) && bp > 0) {
        calculatedBasePrice = bp;
        pricePerNightValue = bp / nights;
      }
    }
    // Priorité 3: pricePerNight × nights
    else if (reservationDetails?.pricePerNight) {
      pricePerNightValue = typeof reservationDetails.pricePerNight === 'string' 
        ? parseFloat(reservationDetails.pricePerNight) 
        : reservationDetails.pricePerNight;
      if (!isNaN(pricePerNightValue) && pricePerNightValue > 0) {
        calculatedBasePrice = pricePerNightValue * nights;
      }
    }
    // Fallback: utiliser totalAmount
    else {
      const ta = typeof totalAmount === 'string' ? parseFloat(totalAmount) : totalAmount;
      if (typeof ta === 'number' && !isNaN(ta) && ta > 0) {
        calculatedBasePrice = ta;
        pricePerNightValue = ta / nights;
      } else {
        calculatedBasePrice = 800;
        pricePerNightValue = 800;
      }
    }
    
    // 2. Calculer le prix des options
    let calculatedOptionsPrice = 0;
    
    // Priorité 1: optionsPrice fourni directement
    if (typeof optionsPrice === 'number' && !isNaN(optionsPrice) && optionsPrice > 0) {
      calculatedOptionsPrice = optionsPrice;
    }
    // Priorité 2: selectedOptions fourni directement
    else if (selectedOptions && selectedOptions.length > 0) {
      calculatedOptionsPrice = selectedOptions.reduce((sum, option) => {
        const optionPrice = typeof option.price === 'string' ? parseFloat(option.price) : option.price;
        const quantity = option.quantity || 1;
        return sum + (optionPrice * quantity);
      }, 0);
    }
    // Priorité 3: selectedOptions dans reservationDetails
    else if (reservationDetails?.selectedOptions && reservationDetails.selectedOptions.length > 0) {
      calculatedOptionsPrice = reservationDetails.selectedOptions.reduce((sum, option) => {
        const optionPrice = typeof option.price === 'string' ? parseFloat(option.price) : option.price;
        const quantity = option.quantity || 1;
        return sum + (optionPrice * quantity);
      }, 0);
    }
    // Priorité 4: optionsPrice dans reservationDetails
    else if (reservationDetails?.optionsPrice) {
      const op = typeof reservationDetails.optionsPrice === 'string' 
        ? parseFloat(reservationDetails.optionsPrice) 
        : reservationDetails.optionsPrice;
      if (!isNaN(op) && op > 0) {
        calculatedOptionsPrice = op;
      }
    }
    
    // 3. Total final
    const finalTotal = calculatedBasePrice + calculatedOptionsPrice;
    
    return {
      finalAmount: finalTotal,
      basePrice: calculatedBasePrice, // C'est le TOTAL pour le séjour
      optionsPrice: calculatedOptionsPrice,
      nights,
      pricePerNight: pricePerNightValue
    };
  };

  const { finalAmount, basePrice: calculatedBasePrice, optionsPrice: calculatedOptionsPrice, nights, pricePerNight } = calculateFinalAmount();

  // Vérification de débogage
  useEffect(() => {
    console.log("💰 Calcul des montants dans PaymentForm:", {
      nights,
      calculatedBasePrice,
      calculatedOptionsPrice,
      finalAmount,
      pricePerNight,
      reservationDetails: reservationDetails
    });
  }, [totalAmount, basePrice, optionsPrice, reservationDetails, selectedOptions]);
  
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
        basePrice: calculatedBasePrice,
        optionsPrice: calculatedOptionsPrice,
        nights,
        pricePerNight,
        reservationDetails 
      });

      // Helper function to extract number from string
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
        : new Date(checkInDate.getTime() + nights * 24 * 60 * 60 * 1000);

      // Récupérer les options sélectionnées
      const finalSelectedOptions = selectedOptions || reservationDetails?.selectedOptions || [];

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
          nights: nights,
          guests: extractNumber(reservationDetails.guests),
          bedrooms: extractNumber(reservationDetails.bedrooms),
          totalPrice: finalAmount,
          pricePerNight: pricePerNight,
          customerName: `${data.firstName} ${data.lastName}`,
          customerEmail: data.email,
          basePrice: calculatedBasePrice,
          optionsPrice: calculatedOptionsPrice,
          selectedOptions: finalSelectedOptions,
        },
      };

      const response = await api.createPayment(paymentRequest);

      if (response.success && response.data?.url) {
        console.log("✅ Redirection vers Stripe Checkout:", response.data.url);
        
        // Sauvegarder les données complètes
        const completeReservationData = {
          ...reservationDetails,
          checkIn: checkInDate.toISOString(),
          checkOut: checkOutDate.toISOString(),
          nights: nights,
          guests: extractNumber(reservationDetails.guests),
          bedrooms: extractNumber(reservationDetails.bedrooms),
          total: finalAmount,
          basePrice: calculatedBasePrice,
          optionsPrice: calculatedOptionsPrice,
          selectedOptions: finalSelectedOptions,
          customerEmail: data.email,
          customerName: `${data.firstName} ${data.lastName}`,
        };
        localStorage.setItem('currentReservation', JSON.stringify(completeReservationData));
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userName', `${data.firstName} ${data.lastName}`);
        console.log("💾 Données sauvegardées dans localStorage avec montant:", finalAmount);
        
        toast.success("Redirection vers la page de paiement sécurisée...");
        
        // Rediriger immédiatement
        window.location.href = response.data.url;
      } else {
        // If backend returned a suggested available date
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

    const originalCheckIn = reservationDetails.checkIn ? new Date(reservationDetails.checkIn) : new Date();
    const originalCheckOut = reservationDetails.checkOut ? new Date(reservationDetails.checkOut) : new Date(originalCheckIn.getTime() + (reservationDetails.nights || 1) * 24 * 60 * 60 * 1000);
    const durationMs = originalCheckOut.getTime() - originalCheckIn.getTime();

    const newCheckIn = new Date(suggestedDate);
    const newCheckOut = new Date(newCheckIn.getTime() + durationMs);

    if (typeof onSuggestDate === 'function') {
      onSuggestDate(newCheckIn.toISOString(), newCheckOut.toISOString());
    }

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

  // Récupérer les options à afficher
  const displaySelectedOptions = selectedOptions || reservationDetails?.selectedOptions || [];

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
            {/* Affichage de la durée */}
            <div className="col-span-2 mt-2 pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground font-semibold mb-1">Durée du séjour</p>
              <p className="text-sm font-medium">{nights} nuit{nights > 1 ? 's' : ''}</p>
            </div>
          </div>
        )}

        {/* Personnes et chambres */}
        {(reservationDetails?.guests || reservationDetails?.bedrooms) && (
          <div className="grid grid-cols-2 gap-4 py-2 border-t border-border">
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
          <div className="py-2 border-t border-border">
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
      {displaySelectedOptions.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-3">Options incluses dans cette réservation</h4>
          <div className="space-y-2">
            {displaySelectedOptions.map((option, idx) => {
              const optionTotal = option.price * (option.quantity || 1);
              return (
                <div key={idx} className="flex justify-between items-start text-sm">
                  <div>
                    <span className="text-green-900">{option.name}</span>
                    {option.quantity > 1 && (
                      <span className="text-green-700 ml-2">×{option.quantity}</span>
                    )}
                  </div>
                  <span className="font-semibold text-green-900">
                    {optionTotal.toFixed(2)}€
                  </span>
                </div>
              );
            })}
            <div className="border-t border-green-200 pt-2 mt-2">
              <div className="flex justify-between font-semibold text-green-900">
                <span>Total options</span>
                <span>{calculatedOptionsPrice.toFixed(2)}€</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Répartition des coûts - IMPORTANT */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 rounded-lg p-5 text-sm">
        <div className="space-y-2.5">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-foreground font-medium">Coût du logement</span>
              {nights > 1 && pricePerNight > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  {pricePerNight.toFixed(2)}€ par nuit
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="font-semibold text-foreground">
                {calculatedBasePrice.toFixed(2)}€
              </div>
              {nights > 1 && pricePerNight > 0 && (
                <div className="text-xs text-muted-foreground">
                  ({pricePerNight.toFixed(2)}€ × {nights} nuits)
                </div>
              )}
            </div>
          </div>
          
          {calculatedOptionsPrice > 0 && (
            <div className="flex justify-between">
              <span className="text-foreground font-medium">Options supplémentaires</span>
              <span className="font-semibold text-green-600">{calculatedOptionsPrice.toFixed(2)}€</span>
            </div>
          )}
          
          <div className="border-t border-primary/20 pt-2.5">
            <div className="flex justify-between">
              <span className="text-foreground font-bold text-base">MONTANT TOTAL</span>
              <span className="text-primary font-bold text-lg">{finalAmount.toFixed(2)}€</span>
            </div>
          </div>
        </div>
      </div>

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
          <span className="text-primary">{finalAmount.toFixed(2)}€</span>
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
          `Effectuer le paiement de ${finalAmount.toFixed(2)}€`
        )}
      </button>
    </form>
  );
};

export default PaymentForm;