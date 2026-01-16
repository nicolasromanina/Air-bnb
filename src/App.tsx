import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/appartment" element={<Appartment />} />
          <Route path="/appartment-detail" element={<AppartmentDetailPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/order-confirmation"
            element={<OrderConfirmationPage />}
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/price" element={<PriceSection />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/clients" element={<ClientList />} />
          <Route path="/admin/payments" element={<PaymentsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
