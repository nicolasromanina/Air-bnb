import { CreditCard, AlertCircle, Loader2, Calendar, Users, Bed } from "lucide-react";
import ImprovedDatePicker from '../ImprovedDatePicker';
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
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { user, isAuthenticated } = useAuth();
  
  const [suggestedDate, setSuggestedDate] = useState<Date | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editCheckIn, setEditCheckIn] = useState(reservationDetails?.checkIn ? new Date(reservationDetails.checkIn).toISOString().split('T')[0] : '');
  const [editCheckOut, setEditCheckOut] = useState(reservationDetails?.checkOut ? new Date(reservationDetails.checkOut).toISOString().split('T')[0] : '');
  
  // Fonction pour désactiver les dates passées pour l'arrivée
  const disablePastDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Fonction pour désactiver les dates <= à la date d'arrivée pour le départ
  const getDisableDepartureDates = () => {
    if (!editCheckIn) return () => false;
    const arrivalDate = new Date(editCheckIn);
    arrivalDate.setHours(0, 0, 0, 0);
    return (date: Date) => {
      date.setHours(0, 0, 0, 0);
      return date <= arrivalDate;
    };
  };

  // Calcul du montant final
  const calculateFinalAmount = () => {
    const nights = reservationDetails?.nights || 1;
    
    let pricePerNightValue = 0;
    
    if (reservationDetails?.pricePerNight !== undefined && reservationDetails?.pricePerNight !== null) {
      const pn = typeof reservationDetails.pricePerNight === 'string' 
        ? parseFloat(reservationDetails.pricePerNight) 
        : reservationDetails.pricePerNight;
      if (!isNaN(pn) && pn > 0) {
        pricePerNightValue = pn;
      }
    }
    else if (basePrice !== undefined && basePrice !== null) {
      const bp = typeof basePrice === 'string' ? parseFloat(basePrice) : basePrice;
      if (!isNaN(bp) && bp > 0) {
        pricePerNightValue = bp;
      }
    }
    else {
      pricePerNightValue = 300;
    }
    
    const calculatedBasePrice = pricePerNightValue * nights;
    
    let calculatedOptionsPrice = 0;
    
    if (optionsPrice !== undefined && optionsPrice !== null) {
      const op = typeof optionsPrice === 'string' ? parseFloat(optionsPrice) : optionsPrice;
      if (!isNaN(op) && op > 0) {
        calculatedOptionsPrice = op;
      }
    } else {
      const opts = selectedOptions || reservationDetails?.selectedOptions || [];
      if (opts.length > 0) {
        calculatedOptionsPrice = opts.reduce((sum, option) => {
          const optionPrice = typeof option.price === 'string' ? parseFloat(option.price) : option.price;
          const quantity = option.quantity || 1;
          return sum + (optionPrice * quantity);
        }, 0);
      }
    }
    
    const finalTotal = calculatedBasePrice + calculatedOptionsPrice;
    
    return {
      finalAmount: finalTotal,
      basePrice: calculatedBasePrice,
      optionsPrice: calculatedOptionsPrice,
      nights,
      pricePerNight: pricePerNightValue
    };
  };

  const { finalAmount, basePrice: calculatedBasePrice, optionsPrice: calculatedOptionsPrice, nights, pricePerNight } = calculateFinalAmount();

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
    setLoadingProgress(0);
    
    // Simuler une progression de chargement
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) return prev; // Ne pas aller à 100 avant la fin réelle
        return prev + Math.random() * 30;
      });
    }, 500);
    
    try {
      const extractNumber = (value: any): number => {
        if (typeof value === 'number' && !isNaN(value)) return value;
        if (typeof value === 'string') {
          const match = value.match(/\d+/);
          return match ? parseInt(match[0], 10) : 1;
        }
        return 1;
      };

      const checkInDate = reservationDetails?.checkIn 
        ? new Date(reservationDetails.checkIn)
        : new Date();
      
      const checkOutDate = reservationDetails?.checkOut 
        ? new Date(reservationDetails.checkOut)
        : new Date(checkInDate.getTime() + nights * 24 * 60 * 60 * 1000);

      const finalSelectedOptions = selectedOptions || reservationDetails?.selectedOptions || [];

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
      setLoadingProgress(100);

      if (response.success && response.data?.url) {
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
        
        toast.success(`Paiement de ${finalAmount}€...`);
        window.location.href = response.data.url;
      } else {
        const suggested = response.data?.availableFrom || response.data?.nextAvailable || response.data?.availableFrom;
        if (suggested) {
          setSuggestedDate(new Date(suggested));
        }
        throw new Error(response.error || "URL de paiement non reçue");
      }
    } catch (error) {
      clearInterval(progressInterval);
      setLoadingProgress(0);
      setIsRedirecting(false);
      
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      
      // Gestion spécifique des erreurs de timeout
      if (errorMessage.includes('timeout') || errorMessage.includes('Délai')) {
        toast.error('La préparation du paiement a expiré. Veuillez réessayer.');
      } else if (errorMessage.includes('Impossible')) {
        toast.error('Impossible de contacter le serveur. Veuillez vérifier votre connexion.');
      } else {
        toast.error(errorMessage);
      }
      
      console.error('Erreur paiement:', error);
    } finally {
      clearInterval(progressInterval);
    }
  };

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

  const handleApplyNewDates = () => {
    if (!editCheckIn || !editCheckOut) {
      toast.error('Veuillez remplir les deux dates');
      return;
    }

    const checkInDate = new Date(editCheckIn);
    const checkOutDate = new Date(editCheckOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      toast.error('La date d\'arrivée doit être à partir d\'aujourd\'hui');
      return;
    }

    if (checkOutDate <= checkInDate) {
      toast.error('La date de départ doit être après la date d\'arrivée');
      return;
    }

    if (typeof onSuggestDate === 'function') {
      onSuggestDate(checkInDate.toISOString(), checkOutDate.toISOString());
    }
    setEditMode(false);
    toast.success('Dates mises à jour avec succès');
  };

  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5 animate-fadeIn">
        <AlertCircle size={12} />
        {message}
      </p>
    );
  };

  const isLoading = isSubmitting || isRedirecting;
  const displaySelectedOptions = selectedOptions || reservationDetails?.selectedOptions || [];

  return (
    <form onSubmit={handleSubmit(handlePayment)} className="space-y-6">
      {/* RÉCAPITULATIF */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm p-6 space-y-5 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Calendar className="text-primary" size={20} />
          </div>
          <h3 className="font-bold text-lg text-gray-900">Récapitulatif de votre réservation</h3>
        </div>
        
        {reservationDetails?.title && (
          <div className="pb-4 border-b border-gray-200">
            <h4 className="font-semibold text-lg text-gray-900 mb-1">{reservationDetails.title}</h4>
            {reservationDetails.apartmentNumber && (
              <p className="text-sm text-gray-600">{reservationDetails.apartmentNumber}</p>
            )}
          </div>
        )}

        {reservationDetails?.checkIn && reservationDetails?.checkOut && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 font-semibold mb-1 flex items-center gap-1">
                  <Calendar size={12} />
                  Arrivée
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(reservationDetails.checkIn).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 font-semibold mb-1 flex items-center gap-1">
                  <Calendar size={12} />
                  Départ
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(reservationDetails.checkOut).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <p className="text-xs text-blue-800 font-semibold mb-1">Durée du séjour</p>
              <p className="text-sm font-semibold text-blue-900">
                {nights} nuit{nights > 1 ? 's' : ''} × {pricePerNight.toFixed(2)}€/nuit = {calculatedBasePrice.toFixed(2)}€
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditMode(!editMode);
                if (!editMode) {
                  setEditCheckIn(reservationDetails.checkIn ? new Date(reservationDetails.checkIn).toISOString().split('T')[0] : '');
                  setEditCheckOut(reservationDetails.checkOut ? new Date(reservationDetails.checkOut).toISOString().split('T')[0] : '');
                }
              }}
              className="w-full py-2 px-3 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {editMode ? (
                <>
                  <span>✕</span>
                  Annuler la modification
                </>
              ) : (
                <>
                  <Calendar size={14} />
                  Modifier les dates
                </>
              )}
            </button>
            
            {editMode && (
              <div className="animate-fadeIn mt-3 pt-4 border-t border-gray-200 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-700 font-medium mb-2 block">Nouvelle date d'arrivée</label>
                  <ImprovedDatePicker
                    value={editCheckIn}
                    onChange={setEditCheckIn}
                    shouldDisableDate={disablePastDates}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-700 font-medium mb-2 block">Nouvelle date de départ</label>
                  <ImprovedDatePicker
                    value={editCheckOut}
                    onChange={setEditCheckOut}
                    shouldDisableDate={getDisableDepartureDates()}
                    className="w-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyNewDates}
                  className="w-full mt-2 px-4 py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Appliquer les nouvelles dates
                </button>
              </div>
            )}
          </div>
        )}

        {(reservationDetails?.guests || reservationDetails?.bedrooms) && (
          <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-200">
            {reservationDetails.guests && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Users className="text-primary" size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Personnes</p>
                  <p className="text-sm font-semibold text-gray-900">{reservationDetails.guests}</p>
                </div>
              </div>
            )}
            {reservationDetails.bedrooms && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Bed className="text-primary" size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Chambres</p>
                  <p className="text-sm font-semibold text-gray-900">{reservationDetails.bedrooms}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {reservationDetails?.includes && reservationDetails.includes.length > 0 && (
          <div className="py-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 font-semibold mb-3">Inclus dans votre séjour</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {reservationDetails.includes.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 p-2 hover:bg-gray-50 rounded transition-colors">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* OPTIONS */}
      {displaySelectedOptions.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-2 rounded-lg">
              <span className="text-green-600 font-bold">✓</span>
            </div>
            <h4 className="font-semibold text-green-900 text-lg">Options incluses</h4>
          </div>
          <div className="space-y-3">
            {displaySelectedOptions.map((option, idx) => {
              const optionTotal = option.price * (option.quantity || 1);
              return (
                <div key={idx} className="flex justify-between items-center p-3 bg-white/50 rounded-lg border border-green-100 hover:bg-white transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-green-600 text-lg">•</span>
                    <div>
                      <span className="text-green-900 font-medium">{option.name}</span>
                      {option.quantity > 1 && (
                        <span className="text-green-700 ml-2 text-sm">×{option.quantity}</span>
                      )}
                    </div>
                  </div>
                  <span className="font-semibold text-green-900 bg-green-50 px-3 py-1 rounded-full">
                    {optionTotal.toFixed(2)}€
                  </span>
                </div>
              );
            })}
            <div className="border-t border-green-200 pt-3 mt-2">
              <div className="flex justify-between items-center font-semibold text-green-900">
                <span className="text-lg">Total options</span>
                <span className="text-xl bg-green-100 px-4 py-2 rounded-lg">
                  {calculatedOptionsPrice.toFixed(2)}€
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RÉPARTITION DES COÛTS */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-primary/20">
            <span className="text-lg font-semibold text-gray-900">Coût du logement</span>
            <div className="text-right">
              <div className="text-xl font-bold text-primary">{calculatedBasePrice.toFixed(2)}€</div>
              <div className="text-sm text-gray-600">
                ({pricePerNight.toFixed(2)}€ × {nights} nuit{nights > 1 ? 's' : ''})
              </div>
            </div>
          </div>
          
          {calculatedOptionsPrice > 0 && (
            <div className="flex justify-between items-center pb-3 border-b border-primary/20">
              <span className="text-lg font-semibold text-green-700">Options supplémentaires</span>
              <span className="text-xl font-bold text-green-600">{calculatedOptionsPrice.toFixed(2)}€</span>
            </div>
          )}
          
          <div className="pt-2">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">MONTANT TOTAL</span>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary animate-pulse-slow">{finalAmount.toFixed(2)}€</div>
                <div className="text-xs text-gray-500 mt-1">TTC</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FORMULAIRE */}
      <div className="space-y-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Informations personnelles</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Prénom(s) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Veuillez saisir votre prénom"
              className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                errors.firstName 
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 animate-shake" 
                  : "border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
              } bg-white text-gray-900 placeholder:text-gray-400 outline-none`}
              {...register("firstName")}
              disabled={isLoading}
            />
            <ErrorMessage message={errors.firstName?.message} />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Nom de famille"
              className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                errors.lastName 
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 animate-shake" 
                  : "border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
              } bg-white text-gray-900 placeholder:text-gray-400 outline-none`}
              {...register("lastName")}
              disabled={isLoading}
            />
            <ErrorMessage message={errors.lastName?.message} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Adresse Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="Votre adresse mail"
            className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
              errors.email 
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 animate-shake" 
                : "border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
            } bg-white text-gray-900 placeholder:text-gray-400 outline-none`}
            {...register("email")}
            disabled={isLoading}
          />
          <ErrorMessage message={errors.email?.message} />
        </div>
      </div>

      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-xl p-5 shadow-sm animate-pulse-slow">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-lg">
              <span className="text-amber-600 font-bold">!</span>
            </div>
            <div>
              <p className="font-semibold text-amber-900">Connexion requise</p>
              <p className="text-sm text-amber-800">Veuillez vous connecter pour effectuer un paiement.</p>
            </div>
          </div>
        </div>
      )}

      {/* MODES DE PAIEMENT */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-sm font-semibold mb-4 text-center text-gray-900">
          Mode de Paiement
        </h3>
        <div className="flex items-center justify-center gap-6 py-3">
          {[
            { src: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg", alt: "Visa", className: "h-8 transition-transform hover:scale-110" },
            { src: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg", alt: "Mastercard", className: "h-9 transition-transform hover:scale-110" },
            { src: "https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg", alt: "American Express", className: "h-8 transition-transform hover:scale-110" },
            { text: "DISCOVER", className: "font-bold text-sm tracking-wider text-gray-900 bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent" }
          ].map((payment, idx) => (
            <div key={idx} className="transition-all duration-300 hover:-translate-y-1">
              {payment.src ? (
                <img src={payment.src} alt={payment.alt} className={payment.className} />
              ) : (
                <span className={payment.className}>{payment.text}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SÉCURITÉ */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <CreditCard className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="font-semibold text-blue-900 text-lg mb-1">Paiement 100% sécurisé</p>
            <p className="text-sm text-blue-800">
              Vos informations de paiement sont cryptées et protégées. Vous serez redirigé vers une page sécurisée pour finaliser votre transaction.
            </p>
          </div>
        </div>
      </div>

      {suggestedDate && (
        <div className="mt-4 p-5 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-300 rounded-xl animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <span className="text-yellow-600 font-bold">!</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-900 mb-2">Les dates sélectionnées sont réservées.</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="text-sm text-yellow-800">
                  Suggestion : commencer à partir du <strong>{suggestedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleUseSuggested}
                  className="sm:ml-auto px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-semibold hover:bg-yellow-700 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Utiliser cette date
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* BOUTON DE PAIEMENT */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-lg font-bold text-gray-900">Total à payer</span>
            <p className="text-xs text-gray-500 mt-1">
              En cliquant ci-dessous, vous acceptez nos conditions générales de vente
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{finalAmount.toFixed(2)}€</div>
            <div className="text-xs text-gray-500">Toutes taxes comprises</div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !isAuthenticated}
          className={`w-full py-4 rounded-xl text-lg font-bold transition-all duration-300 relative overflow-hidden ${
            isLoading || !isAuthenticated
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
          } flex items-center justify-center gap-3`}
        >
          {/* Barre de progression */}
          {isLoading && (
            <div 
              className="absolute left-0 top-0 h-full bg-white/20 transition-all duration-300"
              style={{ width: `${Math.min(loadingProgress, 100)}%` }}
            />
          )}
          
          <div className="relative z-10 flex items-center gap-3">
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={22} />
                <span>
                  {loadingProgress < 30 && "Préparation du paiement..."}
                  {loadingProgress >= 30 && loadingProgress < 60 && "Vérification des données..."}
                  {loadingProgress >= 60 && loadingProgress < 90 && "Création de la session..."}
                  {loadingProgress >= 90 && "Finalisation..."}
                </span>
              </>
            ) : (
              <>
                <CreditCard size={22} />
                <span>Procéder au paiement {finalAmount.toFixed(2)}€</span>
              </>
            )}
          </div>
        </button>
        
        <p className="text-center text-xs text-gray-500 mt-3 animate-pulse-slow">
          ✅ Paiement sécurisé • 128-bit SSL • Sans frais cachés
        </p>
      </div>
    </form>
  );
};

export default PaymentForm;