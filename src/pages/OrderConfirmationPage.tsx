import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OrderConfirmation from '@/components/orderConfirmation/OrderConfirmation';
import NavbarSpacer from '@/components/NavbarSpacer';

function OrderConfirmationPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <NavbarSpacer />
      <main className="flex-grow">
        <OrderConfirmation />
      </main>
      <Footer />
    </div>
  );
}

export default OrderConfirmationPage;