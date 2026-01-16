import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// --- Types ---
interface ReservationProps {
  image: string;
  title: string;
  price: string;
  apartment: string;
  date: string;
  inclus: string[];
}

// --- Icons (SVG Inline for Pixel Perfection) ---
const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF2D75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg>
);

const CreditCardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
);

// --- Sub-components ---
const ReservationCard: React.FC<ReservationProps> = ({ image, title, price, apartment, date, inclus }) => (
  <div className="flex gap-4 bg-white p-4 rounded-[10px] shadow-sm relative mb-4 last:mb-0 border border-gray-100">
    <div className="w-[120px] h-[90px] flex-shrink-0 overflow-hidden rounded-[5px]">
      <img src={image} alt={title} className="w-full h-full object-cover" />
    </div>
    <div className="flex flex-col justify-between flex-grow">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-[14px] leading-tight max-w-[180px]">{title}</h4>
          <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">Inclus</p>
          <ul className="text-[9px] text-gray-500 leading-tight">
            {inclus.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <span className="font-bold text-[16px]">{price}</span>
      </div>
      <div className="flex justify-between items-end mt-2">
        <div>
          <p className="text-[10px] text-gray-400">Appartement n° {apartment}</p>
          <p className="text-[10px] text-gray-400 italic">{date}</p>
        </div>
        <button className="hover:scale-110 transition-transform"><TrashIcon /></button>
      </div>
    </div>
  </div>
);

const PaymentPage: React.FC = () => {
  return (
    <div className="font-['Montserrat'] bg-[#F9FAFB] min-h-screen">
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-4 py-12">
        <div className="flex flex-col xl:flex-row gap-12 items-start">
          
          {/* --- LEFT COLUMN: RESERVATIONS --- */}
          <div className="w-full xl:w-[480px]">
            <h1 className="text-[28px] font-bold text-black mb-1">Mes reservations</h1>
            <p className="text-[14px] text-gray-500 mb-8">Class aptent taciti per inceptos himenaeos.</p>
            
            <div className="space-y-4">
              <ReservationCard 
                image="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=300"
                title="Aptent taciti sociosqu ad litora"
                price="800€"
                apartment="201"
                date="12 Juin 2024"
                inclus={["Petit déjeuner", "Pressing"]}
              />
              <ReservationCard 
                image="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=300"
                title="Aptent taciti sociosqu ad litora"
                price="920€"
                apartment="421"
                date="26 Avril 2024"
                inclus={["Petit déjeuner", "Pressing", "Ménage tout les jours"]}
              />
              <ReservationCard 
                image="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=300"
                title="Aptent taciti sociosqu ad litora"
                price="800€"
                apartment="412"
                date="18 Octobre 2024"
                inclus={["Petit déjeuner", "Pressing"]}
              />
            </div>
          </div>

          {/* --- RIGHT COLUMN: PAYMENT FORM --- */}
          <div className="w-full xl:w-[720px] bg-white rounded-[20px] p-8 xl:p-12 shadow-xl shadow-gray-200/50">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[12px] font-bold mb-2">Prénom(s) *</label>
                  <input type="text" placeholder="Veuillez saisir votre prénom" className="w-full bg-[#F3F4F6] p-4 rounded-[8px] outline-none text-[14px]" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold mb-2">Nom *</label>
                  <input type="text" placeholder="Nom de famille" className="w-full bg-[#F3F4F6] p-4 rounded-[8px] outline-none text-[14px]" />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold mb-2">Adresse Email</label>
                <input type="email" placeholder="Votre adresse mail" className="w-full bg-[#F3F4F6] p-4 rounded-[8px] outline-none text-[14px]" />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-center text-[12px] font-bold mb-4 uppercase tracking-wider">Mode de Paiement</p>
                <div className="flex justify-center items-center gap-6 mb-8 grayscale opacity-70">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-5" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d1/Discover_Card_logo.svg" alt="Discover" className="h-4" />
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[12px] font-bold mb-2">Numéro de la carte</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2"><CreditCardIcon /></div>
                      <input type="text" placeholder="1234 1234 1234 1234" className="w-full bg-[#F3F4F6] pl-12 pr-20 py-4 rounded-[8px] outline-none text-[14px]" />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#000] text-white px-3 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                        <span className="text-[#00D084]">●</span> Link
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[12px] font-bold mb-2">Date d'expiration*</label>
                      <input type="text" placeholder="MM / AA" className="w-full bg-[#F3F4F6] p-4 rounded-[8px] outline-none text-[14px]" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold mb-2">Code de sécurité*</label>
                      <input type="text" placeholder="CVC" className="w-full bg-[#F3F4F6] p-4 rounded-[8px] outline-none text-[14px]" />
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full bg-[#FF2D75] text-white font-bold py-5 rounded-[8px] text-[15px] hover:bg-[#e62969] transition-colors mt-8 uppercase">
                Effectuer le paiement
              </button>
            </form>
          </div>
        </div>

        {/* --- SECTION 2: CONTENT & BLACK CARD --- */}
        <section className="mt-24 flex flex-col xl:flex-row gap-16 items-center">
          <div className="w-full xl:w-1/2">
            <div className="rounded-[10px] overflow-hidden shadow-2xl shadow-blue-900/10">
              <img 
                src="https://images.unsplash.com/photo-1616594111715-4743b93873f7?auto=format&fit=crop&q=80&w=1000" 
                alt="Bedroom" 
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
          <div className="w-full xl:w-1/2">
            <h2 className="text-[24px] font-bold leading-tight mb-8">
              Nunc vulputate libero et velit interdum, ac aliquet odio mattis. 
              <span className="text-gray-400 font-normal"> Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</span>
            </h2>
            
            {/* Black Card */}
            <div className="bg-black rounded-[15px] p-8 flex items-center justify-between relative overflow-hidden group">
              <div className="z-10 w-2/3">
                <p className="text-white text-[10px] mb-2 font-light">Nunc vulputate<br/>libero</p>
                <div className="h-[2px] w-8 bg-white/20 mb-12"></div>
                <p className="text-white text-[12px] font-light leading-snug">
                  Lorem ipsum dolor sit amet,<br/>consectetur adipiscing elit
                </p>
              </div>
              <div className="w-1/3 z-10">
                <img 
                  src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=300" 
                  alt="Internal" 
                  className="rounded-[8px] w-full aspect-video object-cover"
                />
              </div>
              {/* Pink Dot Button */}
              <div className="absolute bottom-4 right-4 w-6 h-6 bg-[#FF2D75] rounded-full cursor-pointer hover:scale-110 transition-transform"></div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentPage;