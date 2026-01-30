// pages/reservation/Payment.tsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import ReservationCard from "@/components/payment/ReservationCard";
import PaymentForm from "@/components/payment/PaymentForm";
import PromoSection from "@/components/payment/PromoSection";
import Footer from "@/components/Footer";
import AuthModal from "@/components/payment/AuthModal";
import { api } from '@/services/api';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [promotionData, setPromotionData] = useState<any>(null);

  useEffect(() => {
    // Récupérer les données de réservation
    if (location.state) {
      setReservation(location.state);
      localStorage.setItem('currentReservation', JSON.stringify(location.state));
    } else {
      const savedReservation = localStorage.getItem('currentReservation');
      if (savedReservation) {
        setReservation(JSON.parse(savedReservation));
      } else {
        navigate('/');
      }
    }

    // Vérifier si l'utilisateur doit être redirigé vers l'authentification
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setShowAuthModal(true);
        setAuthMode('login');
      }
    };

    const timer = setTimeout(checkAuth, 1000);
    return () => clearTimeout(timer);
  }, [location, navigate]);

  // Load promotion data when reservation is available
  useEffect(() => {
    console.log('[PAYMENT] 🔍 Checking reservation:', {
      hasReservation: !!reservation,
      roomId: reservation?.roomId,
      apartmentId: reservation?.apartmentId,
      id: reservation?.id,
      allKeys: reservation ? Object.keys(reservation) : []
    });

    if (reservation?.roomId) {
      const loadPromotion = async () => {
        try {
          console.log('[PAYMENT] 📥 Loading promotion for roomId:', reservation.roomId);
          const response = await api.getPromotion(reservation.roomId);
          console.log('[PAYMENT] API response:', { 
            success: response.success, 
            hasData: !!response.data,
            dataKeys: response.data ? Object.keys(response.data) : []
          });
          
          if (response.success && response.data) {
            console.log('[PAYMENT] ✅ Setting promotion data');
            setPromotionData(response.data);
          } else {
            console.warn('[PAYMENT] ⚠️ No promotion data received');
          }
        } catch (error) {
          console.error('[PAYMENT] ❌ Failed to load promotion:', error);
        }
      };
      
      loadPromotion();
    } else {
      console.warn('[PAYMENT] ⚠️ No roomId in reservation');
    }
  }, [reservation?.roomId]);

  if (!reservation) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <p className="text-lg">Chargement de votre réservation...</p>
      </div>
    );
  }

  // CORRECTION IMPORTANTE : Calculer les montants correctement
  const calculateAmounts = () => {
    const nights = Number(reservation.nights) || 1;
    
    // 1. Déterminer le PRIX PAR NUIT
    let pricePerNight = 0;
    
    // Priorité 1: reservation.pricePerNight
    if (reservation.pricePerNight !== undefined && reservation.pricePerNight !== null) {
      pricePerNight = typeof reservation.pricePerNight === 'string' 
        ? parseFloat(reservation.pricePerNight) 
        : reservation.pricePerNight;
    }
    // Priorité 2: reservation.price
    else if (reservation.price !== undefined && reservation.price !== null) {
      pricePerNight = typeof reservation.price === 'string' 
        ? parseFloat(reservation.price) 
        : reservation.price;
    }
    // Priorité 3: reservation.basePrice (c'est le prix par nuit)
    else if (reservation.basePrice !== undefined && reservation.basePrice !== null) {
      pricePerNight = typeof reservation.basePrice === 'string' 
        ? parseFloat(reservation.basePrice) 
        : reservation.basePrice;
    }
    
    if (isNaN(pricePerNight) || pricePerNight <= 0) {
      pricePerNight = 300; // Valeur par défaut
    }
    
    // 2. Calculer le TOTAL DU LOGEMENT
    const basePriceTotal = pricePerNight * nights;
    
    // 3. Calculer le PRIX DES OPTIONS
    let optionsPriceTotal = 0;
    if (reservation.optionsPrice !== undefined && reservation.optionsPrice !== null) {
      optionsPriceTotal = typeof reservation.optionsPrice === 'string' 
        ? parseFloat(reservation.optionsPrice) 
        : reservation.optionsPrice;
    } else if (reservation.selectedOptions && Array.isArray(reservation.selectedOptions)) {
      optionsPriceTotal = reservation.selectedOptions.reduce((sum: number, option: any) => {
        const optionPrice = typeof option.price === 'string' ? parseFloat(option.price) : option.price;
        const quantity = option.quantity || 1;
        return sum + (optionPrice * quantity);
      }, 0);
    }
    
    // 4. TOTAL FINAL
    const totalAmount = basePriceTotal + optionsPriceTotal;
    
    console.log("🔢 Payment.tsx - Calculs:", {
      nights,
      pricePerNight,
      basePriceTotal,
      optionsPriceTotal,
      totalAmount,
      reservationData: {
        pricePerNightProp: reservation.pricePerNight,
        priceProp: reservation.price,
        basePriceProp: reservation.basePrice
      }
    });
    
    return {
      pricePerNight,
      basePrice: basePriceTotal, // C'est le TOTAL pour le séjour
      optionsPrice: optionsPriceTotal,
      total: totalAmount
    };
  };

  const { pricePerNight, basePrice, optionsPrice, total } = calculateAmounts();

  // Formater la date actuelle
  const formatDate = (daysToAdd = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Créer la réservation au format attendu par ReservationCard
  const aptNumber = reservation.apartmentNumber || 
    (reservation.apartmentId ? `Appartement n° ${String(reservation.apartmentId).padStart(3, '0')}` : 'Appartement');

  const dateDisplay = reservation.checkIn && reservation.checkOut
    ? `Du ${new Date(reservation.checkIn).toLocaleDateString('fr-FR')} au ${new Date(reservation.checkOut).toLocaleDateString('fr-FR')}`
    : `Du ${formatDate()} au ${formatDate(reservation.nights)}`;

  const reservationData = {
    image: reservation.image || 'https://images.unsplash.com/photo-1560184897-e6270f3f322f?auto=format&fit=crop&w=1200&q=80',
    title: reservation.title || "Réservation",
    includes: reservation.includes || [],
    apartmentNumber: aptNumber,
    date: dateDisplay,
    price: `${Number(total).toFixed(2)}€`,
    nights: reservation.nights || 1,
    pricePerNight: pricePerNight,
    basePrice: basePrice,
    optionsPrice: optionsPrice,
    selectedOptions: reservation.selectedOptions || []
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    window.location.reload();
  };

  const handleSuggestDate = (newCheckInIso: string, newCheckOutIso: string) => {
    try {
      const updated = { ...reservation, checkIn: newCheckInIso, checkOut: newCheckOutIso };
      setReservation(updated);
      localStorage.setItem('currentReservation', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to apply suggested date', e);
    }
  };

  const handleSwitchToSignup = () => {
    setAuthMode('signup');
  };

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />

      {/* AuthModal pour l'authentification */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authMode}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Bandeau d'information sur l'authentification */}
        {showAuthModal && (
          <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-800">
                  <span className="font-medium">Authentification requise</span> - Vous devez vous connecter ou créer un compte pour finaliser votre paiement.
                </p>
                <div className="mt-2 flex gap-3">
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setShowAuthModal(true);
                    }}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  >
                    Se connecter
                  </button>
                  <button
                    onClick={handleSwitchToSignup}
                    className="inline-flex items-center px-3 py-1.5 border border-amber-600 text-xs font-medium rounded text-amber-700 bg-white hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  >
                    Créer un compte
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Reservation Details */}
          <div>
            <h1 className="text-2xl font-bold mb-2">Réservation en cours</h1>
            <p className="text-sm text-muted-foreground mb-8">
              {reservation.description || "Vérifiez les détails de votre réservation avant de procéder au paiement."}
            </p>

            <div className="space-y-4">
              <ReservationCard {...reservationData} />
              
              {/* Détails supplémentaires - CORRIGÉ */}
              <div className="bg-card rounded-lg p-6 mt-6">
                <h3 className="font-semibold mb-4">Détails de la réservation</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Durée du séjour</span>
                    <span className="font-medium">{reservation.nights || 1} nuit(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Nombre de personnes</span>
                    <span className="font-medium">{reservation.guests || 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Prix par nuit</span>
                    <span className="font-medium">{pricePerNight.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Chambres</span>
                    <span className="font-medium">{reservation.bedrooms || 1}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Sous-total logement</span>
                      <span className="text-primary">{basePrice.toFixed(2)}€</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Options sélectionnées */}
              {reservation.selectedOptions && reservation.selectedOptions.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
                  <h3 className="font-semibold mb-4 text-green-900">Options sélectionnées</h3>
                  <div className="space-y-2">
                    {reservation.selectedOptions.map((option: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-green-900">{option.name}</p>
                          <p className="text-xs text-green-700">
                            {option.pricingType === 'per_day' ? `${option.price}€/nuit × ${option.quantity || 1}` :
                             option.pricingType === 'per_guest' ? `${option.price}€/pers × ${option.quantity || 1}` :
                             `${option.price}€`}
                          </p>
                        </div>
                        <span className="font-semibold text-green-900 ml-4">
                          {(option.price * (option.quantity || 1)).toFixed(2)}€
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-green-200 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-green-900">Coût des options</span>
                        <span className="font-bold text-green-900">{optionsPrice.toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Total avec répartition des coûts */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mt-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Coût du logement</span>
                    <span className="font-medium">{basePrice.toFixed(2)}€</span>
                  </div>
                  {optionsPrice > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Options supplémentaires</span>
                      <span className="font-medium text-green-600">{optionsPrice.toFixed(2)}€</span>
                    </div>
                  )}
                  <div className="border-t border-primary/20 pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>TOTAL À PAYER</span>
                      <span className="text-primary">{total.toFixed(2)}€</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Form */}
          <div className="lg:pt-0">
            <div className="bg-card rounded-xl p-6 lg:p-8 shadow-sm border border-border">
              <PaymentForm 
                totalAmount={total}
                basePrice={pricePerNight} // CORRECTION : Passer le prix par nuit
                optionsPrice={optionsPrice}
                selectedOptions={reservation.selectedOptions}
                onSuggestDate={handleSuggestDate}
                reservationDetails={{
                  title: reservation.title || "Réservation",
                  apartmentNumber: `Appartement n° ${(reservation.apartmentId || 0).toString().padStart(3, '0')}`,
                  apartmentId: reservation.apartmentId || 0,
                  nights: reservation.nights || 1,
                  guests: reservation.guests || 1,
                  bedrooms: reservation.bedrooms || 1,
                  pricePerNight: pricePerNight, // CORRECTION : Passer le prix par nuit calculé
                  image: reservation.image || 'https://images.unsplash.com/photo-1560184897-e6270f3f322f?auto=format&fit=crop&w=1200&q=80',
                  includes: reservation.includes || [],
                  checkIn: reservation.checkIn,
                  checkOut: reservation.checkOut,
                  basePrice: basePrice, // CORRECTION : Passer le total du logement
                  optionsPrice: optionsPrice,
                  selectedOptions: reservation.selectedOptions || []
                }}
              />
            </div>

            {/* Section d'aide pour l'authentification */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">Besoin d'aide ?</h3>
              <p className="text-sm text-blue-800 mb-3">
                Si vous avez des problèmes avec l'authentification ou le paiement, notre équipe est là pour vous aider.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => window.location.href = '/auth?tab=login'}
                  className="text-sm text-blue-700 hover:text-blue-900 font-medium"
                >
                  Page de connexion complète →
                </button>
                <button
                  onClick={() => window.location.href = '/auth?tab=register'}
                  className="text-sm text-blue-700 hover:text-blue-900 font-medium"
                >
                  Page d'inscription complète →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PromoSection promo={promotionData} />
      <Footer />
    </div>
  );
};

export default Payment;