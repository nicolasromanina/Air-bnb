import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Loader2, Mail, Calendar, Home } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError("Aucune session de paiement trouvée");
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 Vérification du paiement pour session:", sessionId);
        
        // Pour l'instant, simulons une réponse réussie
        // En production, vous appellerez votre Edge Function verify-payment
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Données simulées (remplacez par un appel API réel)
        const mockData = {
          success: true,
          paymentStatus: "paid",
          customerEmail: "client@example.com",
          amountTotal: 30000, // en centimes
          currency: "eur",
          metadata: {
            reservationDetails: JSON.stringify({
              title: "Appartement de luxe",
              apartmentNumber: "Appartement n° 101",
              date: "Du 20 Janvier 2026 au 22 Janvier 2026",
            })
          }
        };
        
        setPaymentDetails(mockData);
        toast.success("Paiement confirmé avec succès !");
        
      } catch (err) {
        console.error("Erreur de vérification:", err);
        setError(err instanceof Error ? err.message : "Erreur de vérification");
        toast.error("Erreur lors de la vérification du paiement");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency?.toUpperCase() || "EUR",
    }).format(amount / 100); // Convertir centimes en euros
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

  if (error) {
    return (
      <div className="min-h-screen bg-secondary">
        <Navbar />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-card rounded-xl p-8 shadow-sm border border-border text-center">
            <h1 className="text-2xl font-bold mb-4 text-destructive">Erreur</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              <Home size={18} />
              Retour à l'accueil
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
                
                {/* Email de confirmation */}
                <div className="flex items-center gap-3">
                  <Mail className="text-primary shrink-0" size={20} />
                  <div>
                    <p className="text-sm text-muted-foreground">Un email de confirmation a été envoyé à</p>
                    <p className="font-medium text-foreground">
                      {paymentDetails?.customerEmail || "client@example.com"}
                    </p>
                  </div>
                </div>
                
                {/* Numéro de session */}
                <div className="flex items-start gap-3">
                  <Calendar className="text-primary shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-muted-foreground">Référence de paiement</p>
                    <p className="font-mono text-sm bg-muted px-2 py-1 rounded inline-block">
                      {sessionId?.substring(0, 20)}...
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
              
              <button 
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border font-semibold hover:bg-secondary transition-colors flex-1 sm:flex-none"
              >
                Télécharger le reçu
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
            </ul>
          </div>
          
          {/* Note de session */}
          <div className="text-center text-xs text-muted-foreground mt-6">
            ID de session: <code className="bg-muted px-2 py-0.5 rounded">{sessionId}</code>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;