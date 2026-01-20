import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import ReservationCard from "@/components/payment/ReservationCard";
import PaymentForm from "@/components/payment/PaymentForm";
import PromoSection from "@/components/payment/PromoSection";
import Footer from "@/components/Footer";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    // Récupérer les données de réservation depuis l'état de navigation ou localStorage
    if (location.state) {
      setReservation(location.state);
      localStorage.setItem('currentReservation', JSON.stringify(location.state));
    } else {
      // Essayer de récupérer depuis localStorage
      const savedReservation = localStorage.getItem('currentReservation');
      if (savedReservation) {
        setReservation(JSON.parse(savedReservation));
      } else {
        // Rediriger vers la page d'accueil si pas de réservation
        navigate('/');
      }
    }
  }, [location, navigate]);

  if (!reservation) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <p className="text-lg">Chargement de votre réservation...</p>
      </div>
    );
  }

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
  const reservationData = {
    image: reservation.image,
    title: reservation.title,
    includes: reservation.includes,
    apartmentNumber: `Appartement n° ${reservation.apartmentId.toString().padStart(3, '0')}`,
    date: `Du ${formatDate()} au ${formatDate(reservation.nights)}`,
    price: `${reservation.total}€`,
    nights: reservation.nights,
    pricePerNight: reservation.price
  };

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Reservation Details */}
          <div>
            <h1 className="text-2xl font-bold mb-2">Réservation en cours</h1>
            <p className="text-sm text-muted-foreground mb-8">
              {reservation.description}
            </p>

            <div className="space-y-4">
              <ReservationCard {...reservationData} />
              
              {/* Détails supplémentaires */}
              <div className="bg-card rounded-lg p-6 mt-6">
                <h3 className="font-semibold mb-4">Détails de la réservation</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Durée du séjour</span>
                    <span className="font-medium">{reservation.nights} nuit(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Prix par nuit</span>
                    <span className="font-medium">{reservation.price}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Capacité</span>
                    <span className="font-medium">{reservation.guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Chambres</span>
                    <span className="font-medium">{reservation.bedrooms}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">{reservation.total}€</span>
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
                totalAmount={reservation.total}
                reservationDetails={{
                  title: reservation.title,
                  apartmentNumber: `Appartement n° ${reservation.apartmentId.toString().padStart(3, '0')}`,
                  date: `Du ${formatDate()} au ${formatDate(reservation.nights)}`
                }}
              />
            </div>
          </div>
        </div>
      </main>

      <PromoSection />
      <Footer />
    </div>
  );
};

export default Payment;