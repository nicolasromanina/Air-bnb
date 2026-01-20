import { XCircle, CreditCard, AlertTriangle, Ban, ShieldX, Clock, HelpCircle, Home } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Stripe error codes and their French translations
const stripeErrorCodes = {
  card_declined: {
    title: "Carte refusée",
    description: "Votre carte bancaire a été refusée par votre banque.",
    icon: Ban,
    suggestion: "Vérifiez vos informations de carte ou contactez votre banque.",
  },
  insufficient_funds: {
    title: "Fonds insuffisants",
    description: "Votre carte ne dispose pas des fonds nécessaires pour cette transaction.",
    icon: CreditCard,
    suggestion: "Utilisez une autre carte ou approvisionnez votre compte.",
  },
  expired_card: {
    title: "Carte expirée",
    description: "La date d'expiration de votre carte est dépassée.",
    icon: Clock,
    suggestion: "Utilisez une carte valide avec une date d'expiration future.",
  },
  incorrect_cvc: {
    title: "CVC incorrect",
    description: "Le code de sécurité (CVC) saisi est incorrect.",
    icon: ShieldX,
    suggestion: "Vérifiez le code à 3 chiffres au dos de votre carte.",
  },
  processing_error: {
    title: "Erreur de traitement",
    description: "Une erreur est survenue lors du traitement de votre paiement.",
    icon: AlertTriangle,
    suggestion: "Réessayez dans quelques instants ou utilisez une autre carte.",
  },
  canceled: {
    title: "Paiement annulé",
    description: "Vous avez annulé le processus de paiement.",
    icon: XCircle,
    suggestion: "Vous pouvez reprendre votre réservation à tout moment.",
  },
};

const PaymentCanceled = () => {
  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get("error") || "canceled";
  
  const errorInfo = stripeErrorCodes[errorCode] || stripeErrorCodes.canceled;
  const ErrorIcon = errorInfo.icon;

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto">
          {/* Main error card */}
          <div className="bg-card rounded-xl p-8 shadow-sm border border-border text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <ErrorIcon className="h-10 w-10 text-destructive" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2 text-foreground">{errorInfo.title}</h1>
            <p className="text-muted-foreground mb-6">
              {errorInfo.description}
            </p>

            {/* Suggestion box */}
            <div className="bg-secondary/50 rounded-lg p-4 text-left mb-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="text-primary shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-medium mb-1 text-foreground">Que faire ?</p>
                  <p className="text-sm text-muted-foreground">{errorInfo.suggestion}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                to="/" 
                className="inline-flex items-center justify-center gap-2 flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-center font-semibold hover:bg-primary/90 transition-colors"
              >
                <Home size={18} />
                Retour à l'accueil
              </Link>
              <a 
                href="mailto:support@example.com" 
                className="inline-flex items-center justify-center gap-2 flex-1 px-6 py-3 rounded-lg border border-border text-center font-semibold hover:bg-secondary transition-colors text-foreground"
              >
                Contacter le support
              </a>
            </div>
          </div>

          {/* Error code reference */}
          <div className="text-center text-xs text-muted-foreground">
            Code d'erreur : <code className="bg-muted px-2 py-0.5 rounded text-foreground">{errorCode}</code>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentCanceled;