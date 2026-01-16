import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OrderConfirmation from '@/components/orderConfirmation/OrderConfirmation';

function OrderConfirmationPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <br />
      <br />
      <br />
      <main className="flex-grow">
        <OrderConfirmation />
      </main>
      <Footer />
    </div>
  );
}

export default OrderConfirmationPage;