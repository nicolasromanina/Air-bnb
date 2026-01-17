import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTopButton from "./components/ScrollToTopButton";

// Import du Provider de contexte
import { ContentProvider } from "@/context/ContentContext";

// Pages
import Index from "./pages/Index";
import Services from "./pages/Services";
import Appartment from "./pages/Appartment";
import AppartmentDetailPage from "./pages/AppartmentDetailPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import Payment from "./pages/Payment";
import PriceSection from "./pages/Price";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ClientList from "./pages/Admin/ClientsPage";
import PaymentsPage from "./pages/Admin/PaymentsPage";
import AdminIndex from "./pages/Admin/AdminIndex";
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminDashboardEditor from "@/pages/Admin/AdminDashboardEditor";
import HomeEditor from "@/pages/Admin/HomeEditor";
import ServicesEditor from "@/pages/Admin/ServicesEditor";
import ApartmentsEditor from "@/pages/Admin/ApartmentsEditor";
import ApartmentDetailEditor from "@/pages/Admin/ApartmentDetailEditor";
import PaymentEditor from "@/pages/Admin/PaymentEditor";
import ConfirmationEditor from "@/pages/Admin/ConfirmationEditor";
import PricingEditor from "@/pages/Admin/PricingEditor";
import ContactEditor from "@/pages/Admin/ContactEditor";
import SettingsEditor from "@/pages/Admin/SettingsEditor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* 1. On enveloppe TOUTE l'application avec ContentProvider */}
    <ContentProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Routes Publiques */}
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/appartement" element={<Appartment />} />
            <Route path="/appartment-detail" element={<AppartmentDetailPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/price" element={<PriceSection />} />

            {/* Routes Admin (Anciennes) */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/clients" element={<ClientList />} />
            <Route path="/admin/payments" element={<PaymentsPage />} />
            
            {/* Landing page de l'éditeur admin */}
            <Route path="/admin-editor" element={<AdminIndex />} />

            {/* Routes de l'éditeur avec Layout (Nouveau) */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardEditor />} />
                <Route path="home" element={<HomeEditor />} />
                <Route path="services" element={<ServicesEditor />} />
                <Route path="apartments" element={<ApartmentsEditor />} />
                <Route path="apartment-detail" element={<ApartmentDetailEditor />} />
                <Route path="payment" element={<PaymentEditor />} />
                <Route path="confirmation" element={<ConfirmationEditor />} />
                <Route path="pricing" element={<PricingEditor />} />
                <Route path="contact" element={<ContactEditor />} />
                <Route path="settings" element={<SettingsEditor />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ScrollToTopButton />
        </BrowserRouter>
      </TooltipProvider>
    </ContentProvider>
  </QueryClientProvider>
);

export default App;