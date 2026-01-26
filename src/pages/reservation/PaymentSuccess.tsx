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
        
        // Première tentative avec notre API - vérifier le paiement auprès de Stripe
        const response = await api.verifyPayment(sessionId);
        
        if (response.success && response.data) {
          // Enrichir les données avec les infos du sessionId
          const enrichedPaymentDetails = {
            ...response.data,
            sessionId: sessionId,
            verifiedAt: new Date().toISOString()
          };
          setPaymentDetails(enrichedPaymentDetails);
          console.log("✅ Paiement vérifié depuis Stripe:", enrichedPaymentDetails);
          toast.success("Paiement confirmé avec succès !");
          
          // Nettoyer la réservation du localStorage
          localStorage.removeItem('currentReservation');
        } else {
          // Si l'API échoue, essayer de récupérer les infos Stripe complètes
          const stripeResponse = await api.getStripeSessionDetails(sessionId);
          if (stripeResponse.success && stripeResponse.data?.session) {
            const session = stripeResponse.data.session;
            const payment = stripeResponse.data.payment;
            
            // Extraire et formater les infos Stripe
            const paymentMetadata = session.metadata || {};
            const reservationDetails = payment?.reservation || {};
            
            setPaymentDetails({
              success: session.status === 'paid',
              paymentStatus: session.status === 'paid' ? 'paid' : 'pending',
              customerEmail: session.customer_email || payment?.userEmail || "client@example.com",
              customerName: session.customer_details?.name || `${paymentMetadata.firstName || ''} ${paymentMetadata.lastName || ''}`.trim() || "Client",
              amountTotal: session.amount_total,
              currency: session.currency || 'eur',
              sessionId: sessionId,
              paymentMethod: session.payment_method_types?.[0] || 'card',
              metadata: paymentMetadata,
              reservationDetails: reservationDetails,
              paymentId: payment?._id,
              reservationId: payment?.reservation?._id,
              createdAt: session.created ? new Date(session.created * 1000).toISOString() : new Date().toISOString(),
              verifiedAt: new Date().toISOString(),
              stripeSession: session
            });
            console.log("✅ Infos Stripe complètes récupérées:", stripeResponse.data);
            toast.success("Paiement vérifié avec succès !");
          } else {
            // Fallback: essayer de récupérer depuis la BD
            const paymentResponse = await api.getPaymentBySessionId(sessionId);
            if (paymentResponse.success && paymentResponse.data?.payment) {
              const payment = paymentResponse.data.payment;
              const paymentMetadata = payment.metadata || {};
              const reservationDetails = typeof paymentMetadata.reservationDetails === 'string' 
                ? JSON.parse(paymentMetadata.reservationDetails)
                : paymentMetadata.reservationDetails || {};
              
              setPaymentDetails({
                success: true,
                paymentStatus: payment.status || 'paid',
                customerEmail: payment.userEmail || payment.customerEmail || "client@example.com",
                customerName: payment.customerName || `${paymentMetadata.firstName || ''} ${paymentMetadata.lastName || ''}`.trim(),
                amountTotal: payment.amount * 100,
                currency: payment.currency || 'eur',
                sessionId: sessionId,
                paymentMethod: payment.paymentMethod || 'card',
                metadata: paymentMetadata,
                reservationDetails: reservationDetails,
                paymentId: payment._id,
                reservationId: payment.reservation?._id,
                createdAt: payment.createdAt,
                verifiedAt: new Date().toISOString()
              });
              console.log("✅ Paiement récupéré depuis la BD:", paymentResponse.data.payment);
              toast.success("Paiement vérifié avec succès !");
            } else {
              throw new Error(paymentResponse.error || "Échec de la vérification");
            }
          }
        }
        
      } catch (err) {
        console.error("Erreur de vérification:", err);
        const errorMessage = err instanceof Error ? err.message : "Erreur de vérification";
        setError(errorMessage);
        toast.error("Erreur lors de la vérification du paiement");
        
        // En cas d'erreur, utiliser les données de localStorage comme fallback
        if (sessionId) {
          const fallbackDetails = {
            success: true,
            paymentStatus: "pending_verification",
            customerEmail: reservationData?.customerEmail || localStorage.getItem('userEmail') || "client@example.com",
            customerName: reservationData?.customerName || localStorage.getItem('userName') || "Client",
            amountTotal: reservationData?.total ? reservationData.total * 100 : 0,
            currency: "eur",
            sessionId: sessionId,
            verifiedAt: new Date().toISOString(),
            metadata: {
              reservationDetails: reservationData || {}
            }
          };
          setPaymentDetails(fallbackDetails);
          console.log("⚠️ Utilisation des données de fallback:", fallbackDetails);
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
                  <FileText className="text-primary shrink-0 mt-1" size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Référence de paiement Stripe</p>
                    <div className="mt-2 bg-muted px-3 py-2 rounded text-xs break-all font-mono hover:bg-secondary transition-colors">
                      <code className="text-foreground">{sessionId || 'N/A'}</code>
                    </div>
                  </div>
                </div>

                {/* ID de paiement local si disponible */}
                {paymentDetails?.paymentId && (
                  <div className="flex items-start gap-3">
                    <FileText className="text-primary shrink-0 mt-1" size={20} />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">ID de paiement local</p>
                      <div className="mt-2 bg-muted px-3 py-2 rounded text-xs break-all font-mono">
                        <code className="text-foreground">{paymentDetails.paymentId}</code>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timestamp de vérification */}
                {paymentDetails?.verifiedAt && (
                  <div className="flex items-start gap-3 text-xs text-muted-foreground">
                    <span>✓ Vérifié le {formatDate(paymentDetails.verifiedAt)}</span>
                  </div>
                )}
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
                  // Fonction pour générer un reçu complet avec toutes les infos Stripe
                  const receiptWindow = window.open('', '_blank');
                  if (receiptWindow) {
                    const receiptHTML = `
                      <!DOCTYPE html>
                      <html lang="fr">
                      <head>
                        <meta charset="UTF-8">
                        <title>Reçu de paiement - ${sessionId?.substring(0, 15)}</title>
                        <style>
                          * { margin: 0; padding: 0; box-sizing: border-box; }
                          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px 20px; max-width: 800px; margin: 0 auto; color: #333; }
                          .container { background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                          .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #f0f0f0; padding-bottom: 30px; }
                          .header img { max-width: 180px; margin-bottom: 20px; }
                          .header h1 { font-size: 28px; color: #000; margin-bottom: 10px; }
                          .header p { color: #666; font-size: 14px; }
                          .section { margin-bottom: 30px; }
                          .section-title { font-size: 16px; font-weight: 600; text-transform: uppercase; color: #FF2E63; margin-bottom: 15px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; }
                          .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f5f5f5; }
                          .detail-row:last-child { border-bottom: none; }
                          .detail-label { font-weight: 500; color: #666; }
                          .detail-value { font-weight: 600; color: #000; text-align: right; }
                          .detail-value.important { font-size: 18px; color: #FF2E63; }
                          .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                          @media (max-width: 600px) { .grid-2 { grid-template-columns: 1fr; } }
                          .total-section { background: #f9f9f9; padding: 20px; border-radius: 6px; margin-top: 20px; }
                          .total-row { display: flex; justify-content: space-between; font-size: 18px; font-weight: 700; color: #000; padding: 10px 0; }
                          .total-amount { color: #FF2E63; font-size: 24px; }
                          .footer { margin-top: 40px; padding-top: 30px; border-top: 2px solid #f0f0f0; text-align: center; color: #999; font-size: 12px; }
                          .badge { display: inline-block; padding: 4px 12px; background: #e8f5e9; color: #2e7d32; border-radius: 20px; font-size: 12px; font-weight: 600; }
                          .badge.success { background: #e8f5e9; color: #2e7d32; }
                          .badge.pending { background: #fff3e0; color: #e65100; }
                          .reference-code { background: #f5f5f5; padding: 10px 12px; border-radius: 4px; font-family: 'Courier New', monospace; font-size: 12px; word-break: break-all; margin-top: 8px; }
                          .separator { height: 1px; background: #e0e0e0; margin: 20px 0; }
                        </style>
                      </head>
                      <body>
                        <div class="container">
                          <!-- En-tête -->
                          <div class="header">
                            <img src="/Logo.png" alt="Logo" onerror="this.style.display='none'" />
                            <h1>REÇU DE PAIEMENT</h1>
                            <p>Confirmation de votre réservation</p>
                          </div>

                          <!-- Infos Stripe et Paiement -->
                          <div class="section">
                            <div class="section-title">📋 Détails du paiement</div>
                            <div class="detail-row">
                              <span class="detail-label">Statut</span>
                              <span class="detail-value">
                                <span class="badge ${paymentDetails?.paymentStatus === 'paid' ? 'success' : 'pending'}">
                                  ${paymentDetails?.paymentStatus === 'paid' ? '✓ PAYÉ' : '⏳ EN ATTENTE'}
                                </span>
                              </span>
                            </div>
                            <div class="detail-row">
                              <span class="detail-label">Montant payé</span>
                              <span class="detail-value important">${formatAmount(paymentDetails?.amountTotal || 0, paymentDetails?.currency)}</span>
                            </div>
                            <div class="detail-row">
                              <span class="detail-label">Devise</span>
                              <span class="detail-value">${(paymentDetails?.currency || 'eur').toUpperCase()}</span>
                            </div>
                            <div class="detail-row">
                              <span class="detail-label">Date du paiement</span>
                              <span class="detail-value">${formatDate(paymentDetails?.verifiedAt || new Date().toISOString())}</span>
                            </div>
                            <div class="detail-row">
                              <span class="detail-label">Méthode de paiement</span>
                              <span class="detail-value">${paymentDetails?.paymentMethod === 'card' ? '💳 Carte bancaire' : 'Autre'}</span>
                            </div>
                          </div>

                          <div class="separator"></div>

                          <!-- Infos Client -->
                          <div class="section">
                            <div class="section-title">👤 Informations client</div>
                            <div class="detail-row">
                              <span class="detail-label">Nom</span>
                              <span class="detail-value">${paymentDetails?.customerName || 'Client'}</span>
                            </div>
                            <div class="detail-row">
                              <span class="detail-label">Email</span>
                              <span class="detail-value">${paymentDetails?.customerEmail || 'client@example.com'}</span>
                            </div>
                          </div>

                          <div class="separator"></div>

                          <!-- Infos Réservation -->
                          ${displayedReservation?.title ? `
                          <div class="section">
                            <div class="section-title">🏠 Détails de la réservation</div>
                            ${displayedReservation.title ? `
                            <div class="detail-row">
                              <span class="detail-label">Logement</span>
                              <span class="detail-value">${displayedReservation.title}</span>
                            </div>
                            ` : ''}
                            ${displayedReservation.apartmentNumber ? `
                            <div class="detail-row">
                              <span class="detail-label">Numéro d'appartement</span>
                              <span class="detail-value">${displayedReservation.apartmentNumber}</span>
                            </div>
                            ` : ''}
                            ${displayedReservation.checkIn ? `
                            <div class="detail-row">
                              <span class="detail-label">Check-in</span>
                              <span class="detail-value">${new Date(displayedReservation.checkIn).toLocaleDateString('fr-FR')}</span>
                            </div>
                            ` : ''}
                            ${displayedReservation.checkOut ? `
                            <div class="detail-row">
                              <span class="detail-label">Check-out</span>
                              <span class="detail-value">${new Date(displayedReservation.checkOut).toLocaleDateString('fr-FR')}</span>
                            </div>
                            ` : ''}
                            ${displayedReservation.nights ? `
                            <div class="detail-row">
                              <span class="detail-label">Durée du séjour</span>
                              <span class="detail-value">${displayedReservation.nights} nuit(s)</span>
                            </div>
                            ` : ''}
                            ${displayedReservation.guests ? `
                            <div class="detail-row">
                              <span class="detail-label">Nombre de personnes</span>
                              <span class="detail-value">${displayedReservation.guests}</span>
                            </div>
                            ` : ''}
                            ${displayedReservation.bedrooms ? `
                            <div class="detail-row">
                              <span class="detail-label">Chambres</span>
                              <span class="detail-value">${displayedReservation.bedrooms}</span>
                            </div>
                            ` : ''}
                          </div>

                          <div class="separator"></div>
                          ` : ''}

                          <!-- Récapitulatif des coûts -->
                          <div class="section">
                            <div class="section-title">💰 Récapitulatif des coûts</div>
                            ${displayedReservation?.basePrice ? `
                            <div class="detail-row">
                              <span class="detail-label">Coût du logement</span>
                              <span class="detail-value">${displayedReservation.basePrice}€</span>
                            </div>
                            ` : ''}
                            ${displayedReservation?.optionsPrice && displayedReservation.optionsPrice > 0 ? `
                            <div class="detail-row">
                              <span class="detail-label">Options supplémentaires</span>
                              <span class="detail-value">${displayedReservation.optionsPrice}€</span>
                            </div>
                            ` : ''}
                            <div class="total-section">
                              <div class="total-row">
                                <span>MONTANT TOTAL PAYÉ</span>
                                <span class="total-amount">${formatAmount(paymentDetails?.amountTotal || 0, paymentDetails?.currency)}</span>
                              </div>
                            </div>
                          </div>

                          <div class="separator"></div>

                          <!-- Références Stripe -->
                          <div class="section">
                            <div class="section-title">🔐 Références de paiement</div>
                            <div class="detail-row">
                              <span class="detail-label">ID Session Stripe</span>
                              <span class="detail-value" style="font-size: 12px; word-break: break-all;">
                                <code>${sessionId || 'N/A'}</code>
                              </span>
                            </div>
                            ${paymentDetails?.paymentId ? `
                            <div class="detail-row">
                              <span class="detail-label">ID Paiement local</span>
                              <span class="detail-value" style="font-size: 12px; word-break: break-all;">
                                <code>${paymentDetails.paymentId}</code>
                              </span>
                            </div>
                            ` : ''}
                          </div>

                          <!-- Pied de page -->
                          <div class="footer">
                            <p>Ce document fait office de reçu officiel pour votre réservation.</p>
                            <p>Merci de votre confiance ! Pour toute question, contactez : support@example.com</p>
                            <p style="margin-top: 10px; font-size: 11px;">${formatDate(new Date().toISOString())}</p>
                          </div>
                        </div>

                        <script>
                          window.addEventListener('load', () => {
                            window.print();
                          });
                        </script>
                      </body>
                      </html>
                    `;
                    receiptWindow.document.write(receiptHTML);
                    receiptWindow.document.close();
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