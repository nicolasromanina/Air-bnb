import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Loader2, Mail, Calendar, Home, FileText, Clock, User } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/services/api";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [reservationData, setReservationData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Récupérer les données de réservation depuis localStorage
    const storedReservation = localStorage.getItem('currentReservation');
    if (storedReservation) {
      try {
        setReservationData(JSON.parse(storedReservation));
      } catch (e) {
        console.error('Error parsing stored reservation:', e);
      }
    }
  }, []);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError("Aucune session de paiement trouvée");
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 Vérification du paiement pour session:", sessionId);
        
        // Première tentative avec notre API
        const response = await api.verifyPayment(sessionId);
        
        if (response.success && response.data) {
          setPaymentDetails(response.data);
          toast.success("Paiement confirmé avec succès !");
          
          // Nettoyer la réservation du localStorage
          localStorage.removeItem('currentReservation');
        } else {
          // Si l'API échoue, essayer de récupérer les infos depuis Stripe via notre endpoint
          const paymentResponse = await api.getPaymentBySessionId(sessionId);
          if (paymentResponse.success && paymentResponse.data?.payment) {
            const payment = paymentResponse.data.payment;
            setPaymentDetails({
              success: true,
              paymentStatus: payment.status,
              customerEmail: payment.userEmail,
              amountTotal: payment.amount * 100, // Convertir en centimes
              currency: payment.currency || 'eur',
              metadata: {
                reservationDetails: payment.reservation?.details || "Réservation confirmée"
              },
              paymentId: payment._id,
              reservationId: payment.reservation?._id
            });
            toast.success("Paiement vérifié avec succès !");
          } else {
            throw new Error(paymentResponse.error || "Échec de la vérification");
          }
        }
        
      } catch (err) {
        console.error("Erreur de vérification:", err);
        const errorMessage = err instanceof Error ? err.message : "Erreur de vérification";
        setError(errorMessage);
        toast.error("Erreur lors de la vérification du paiement");
        
        // En cas d'erreur, utiliser les données de localStorage comme fallback
        if (sessionId) {
          setPaymentDetails({
            success: true,
            paymentStatus: "pending_verification",
            customerEmail: reservationData?.customerEmail || localStorage.getItem('userEmail') || "client@example.com",
            amountTotal: reservationData?.total ? reservationData.total * 100 : 0,
            currency: "eur",
            metadata: {
              sessionId: sessionId
            }
          });
        }
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency?.toUpperCase() || "EUR",
    }).format(amount / 100); // Convertir centimes en euros
  };

  const formatDate = (date?: string) => {
    if (!date) return "Date non disponible";
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary">
        <Navbar />
        <main className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Vérification du paiement...</h1>
            <p className="text-muted-foreground">
              Nous confirmons votre réservation. Cela peut prendre quelques secondes.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error && !paymentDetails) {
    return (
      <div className="min-h-screen bg-secondary">
        <Navbar />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-card rounded-xl p-8 shadow-sm border border-border text-center">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold mb-4 text-destructive">Erreur de vérification</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="space-y-3">
              <Link 
                to="/" 
                className="inline-flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                <Home size={18} />
                Retour à l'accueil
              </Link>
              <Link 
                to="/reservations" 
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg border border-border font-semibold hover:bg-secondary transition-colors"
              >
                <Calendar size={18} />
                Voir mes réservations
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const metadata = paymentDetails?.metadata || {};
  const reservationDetails = (() => {
    try {
      const data = metadata.reservationDetails;
      if (typeof data === 'string') {
        return JSON.parse(data);
      }
      return data || {};
    } catch (e) {
      console.error('Error parsing reservationDetails:', e);
      return {};
    }
  })();

  // Utiliser les données du localStorage en priorité
  const displayedReservation = reservationData || reservationDetails;

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Carte principale de succès */}
          <div className="bg-card rounded-xl p-8 shadow-sm border border-border text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold mb-2 text-foreground">Paiement réussi !</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Merci pour votre réservation. Votre paiement a été traité avec succès.
            </p>
            
            {/* Détails du paiement */}
            <div className="bg-secondary/50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-bold text-lg mb-4 text-foreground">Détails de la réservation</h3>
              
              <div className="space-y-4">
                {/* Montant */}
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="font-medium">Montant payé</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatAmount(paymentDetails?.amountTotal || 0, paymentDetails?.currency)}
                  </span>
                </div>

                {/* Répartition des coûts si disponible */}
                {reservationData?.basePrice && (
                  <div className="bg-blue-50 border border-blue-200 rounded-[4px] p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-900">Coût du logement</span>
                        <span className="font-medium text-blue-900">{reservationData.basePrice}€</span>
                      </div>
                      {reservationData.optionsPrice && reservationData.optionsPrice > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-900">Options supplémentaires</span>
                          <span className="font-medium text-green-600">{reservationData.optionsPrice}€</span>
                        </div>
                      )}
                      <div className="border-t border-blue-200 pt-2 mt-2">
                        <div className="flex justify-between font-bold text-blue-900">
                          <span>Total payé</span>
                          <span className="text-primary">{reservationData.total}€</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Statut */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="text-primary shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-muted-foreground">Statut</p>
                      <p className={`font-medium ${
                        paymentDetails?.paymentStatus === 'paid' 
                          ? 'text-green-600' 
                          : 'text-amber-600'
                      }`}>
                        {paymentDetails?.paymentStatus === 'paid' 
                          ? 'Confirmé' 
                          : 'En attente de confirmation'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{formatDate(new Date().toISOString())}</p>
                  </div>
                </div>
                
                {/* Email de confirmation */}
                <div className="flex items-center gap-3">
                  <Mail className="text-primary shrink-0" size={20} />
                  <div>
                    <p className="text-sm text-muted-foreground">Email de confirmation</p>
                    <p className="font-medium text-foreground">
                      {paymentDetails?.customerEmail || "client@example.com"}
                    </p>
                  </div>
                </div>
                
                {/* Détails de la réservation */}
                {(reservationData?.title || displayedReservation?.title) && (
                  <div className="flex items-start gap-3">
                    <Home className="text-primary shrink-0 mt-1" size={20} />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Logement</p>
                      <p className="font-medium text-foreground">{reservationData?.title || displayedReservation?.title}</p>
                      {(reservationData?.apartmentNumber || displayedReservation?.apartmentNumber) && (
                        <p className="text-sm text-muted-foreground">{reservationData?.apartmentNumber || displayedReservation?.apartmentNumber}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Dates et durée */}
                {reservationData?.checkIn && (
                  <div className="flex items-start gap-3">
                    <Calendar className="text-primary shrink-0 mt-1" size={20} />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Dates de réservation</p>
                      <p className="font-medium text-foreground">
                        {new Date(reservationData.checkIn).toLocaleDateString('fr-FR')} au {new Date(reservationData.checkOut).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-sm text-muted-foreground">{reservationData.nights} nuit(s)</p>
                    </div>
                  </div>
                )}

                {/* Nombre de personnes et chambres */}
                {reservationData?.guests && (
                  <div className="flex items-start gap-3">
                    <User className="text-primary shrink-0 mt-1" size={20} />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Détails du séjour</p>
                      <p className="font-medium text-foreground">
                        {reservationData.guests} personne(s) • {reservationData.bedrooms}
                      </p>
                    </div>
                  </div>
                )}

                {/* Options sélectionnées */}
                {reservationData?.selectedOptions && reservationData.selectedOptions.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-[4px] p-4 mt-4">
                    <p className="text-sm font-semibold text-green-900 mb-3">Options sélectionnées :</p>
                    <div className="space-y-2">
                      {reservationData.selectedOptions.map((option: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-green-900">{option.name}</span>
                          <span className="font-medium text-green-900">{(option.price * option.quantity).toFixed(2)}€</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Numéro de session */}
                <div className="flex items-start gap-3">
                  <User className="text-primary shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-muted-foreground">Référence de paiement</p>
                    <p className="font-mono text-sm bg-muted px-2 py-1 rounded inline-block break-all">
                      {sessionId}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/" 
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex-1 sm:flex-none"
              >
                <Home size={18} />
                Retour à l'accueil
              </Link>
              
              <Link 
                to="/reservations" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border font-semibold hover:bg-secondary transition-colors flex-1 sm:flex-none"
              >
                <Calendar size={18} />
                Mes réservations
              </Link>
              
              <button 
                onClick={() => {
                  // Fonction pour générer un reçu
                  const receiptWindow = window.open('', '_blank');
                  if (receiptWindow) {
                    receiptWindow.document.write(`
                      <!DOCTYPE html>
                      <html>
                      <head>
                        <title>Reçu de paiement</title>
                        <style>
                          body { font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
                          .header { text-align: center; margin-bottom: 30px; }
                          .details { margin: 20px 0; }
                          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
                          .total { font-size: 1.2em; font-weight: bold; border-top: 2px solid #000; padding-top: 10px; }
                          .footer { margin-top: 30px; text-align: center; font-size: 0.8em; color: #666; }
                        </style>
                      </head>
                      <body>
                        <div class="header">
                          <img src="/Logo.png" alt="Logo" style="max-width:160px;margin-bottom:12px;" />
                          <h1>Reçu de paiement</h1>
                          <p>${formatDate(new Date().toISOString())}</p>
                        </div>
                        <div class="details">
                          <div class="detail-row">
                            <span>Montant:</span>
                            <span>${formatAmount(paymentDetails?.amountTotal || 0, paymentDetails?.currency)}</span>
                          </div>
                          <div class="detail-row">
                            <span>Statut:</span>
                            <span>${paymentDetails?.paymentStatus === 'paid' ? 'Payé' : 'En attente'}</span>
                          </div>
                          <div class="detail-row">
                            <span>Référence:</span>
                            <span>${sessionId?.substring(0, 15)}...</span>
                          </div>
                          ${reservationDetails.title ? `
                          <div class="detail-row">
                            <span>Réservation:</span>
                            <span>${reservationDetails.title}</span>
                          </div>
                          ` : ''}
                        </div>
                        <div class="detail-row total">
                          <span>TOTAL</span>
                          <span>${formatAmount(paymentDetails?.amountTotal || 0, paymentDetails?.currency)}</span>
                        </div>
                        <div class="footer">
                          <p>Merci pour votre réservation !</p>
                          <p>Ce document fait office de reçu.</p>
                        </div>
                      </body>
                      </html>
                    `);
                    receiptWindow.document.close();
                    receiptWindow.print();
                  }
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gray-100 font-semibold hover:bg-gray-200 transition-colors flex-1 sm:flex-none"
              >
                <FileText size={18} />
                Imprimer le reçu
              </button>
            </div>
          </div>
          
          {/* Informations supplémentaires */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="font-bold text-lg mb-4 text-foreground">Prochaines étapes</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>Vous recevrez un email de confirmation avec tous les détails de votre réservation.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>Un SMS de rappel vous sera envoyé 24h avant votre arrivée.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>Pour toute question, contactez notre service client à support@example.com.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>Vous pouvez annuler gratuitement jusqu'à 24h avant votre arrivée.</span>
              </li>
            </ul>
          </div>
          
          {/* Note de session */}
          {sessionId && (
            <div className="text-center text-xs text-muted-foreground mt-6">
              <p>ID de session Stripe :</p>
              <code className="bg-muted px-2 py-1 rounded block mt-1 break-all text-[10px]">
                {sessionId}
              </code>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;