import { Toaster, ToasterProvider } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTopButton from "./components/ScrollToTopButton";

// Import du Provider de contexte
import { ContentProvider } from "@/context/ContentContext";
import { AuthProvider } from "@/context/AuthContext";

// Pages
import Index from "./pages/Index";
import Services from "./pages/Services";
import Appartment from "./pages/Appartment";
import AppartmentDetailPage from "./pages/AppartmentDetailPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import Payment from "./pages/reservation/Payment";
import PriceSection from "./pages/Price";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import AdminRoutes from "./routes/AdminRoutes";
import PaymentSuccess from "./pages/reservation/PaymentSuccess";
import PaymentCanceled from "./pages/reservation/PaymentCanceled";
import Reservations from "./pages/reservation/Reservations";
import AuthGuard from "./components/payment/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
    {/* 1. On enveloppe TOUTE l'application avec ContentProvider */}
    <ContentProvider>
      <TooltipProvider>
        <ToasterProvider>
          <Toaster />
        </ToasterProvider>
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Routes Publiques */}
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/appartement" element={<Appartment />} />
            <Route path="/apartment/:id" element={<AppartmentDetailPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<Navigate to="/auth" replace />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/contact" element={<Contact />} />
            
            <Route path="/payment" 
              element={
              <AuthGuard requireAuth={true}>
                <Payment />
              </AuthGuard>
            } 
            />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-canceled" element={<PaymentCanceled />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/price" element={<PriceSection />} />
            {/* Admin routes consolidated */}
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ScrollToTopButton />
        </BrowserRouter>
      </TooltipProvider>
    </ContentProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;