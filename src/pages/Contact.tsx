import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NavbarSpacer from '@/components/NavbarSpacer';

// Configuration de la grille unifiée
const GRID_CONTAINER = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

// --- Icônes ---
const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9 7 9-7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="22 7 12 14 2 7"/></svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
);

const QuoteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-black"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H11.017V4H21.017V15C21.017 18.3137 18.3307 21 15.017 21H14.017ZM3.01697 21L3.01697 18C3.01697 16.8954 3.9124 16 5.01697 16H8.01697C8.56925 16 9.01697 15.5523 9.01697 15V9C9.01697 8.44772 8.56925 8 8.01697 8H4.01697C3.46468 8 3.01697 8.44772 3.01697 9V12C3.01697 12.5523 2.56925 13 2.01697 13H0.0169678V4H10.017V15C10.017 18.3137 7.3307 21 4.01697 21H3.01697Z"/></svg>
);

const Contact: React.FC = () => {
  return (
    <div className="bg-white min-h-screen font-sans">
      <Navbar />
      <NavbarSpacer />

      <main className="py-12 lg:py-20">
        
        {/* --- SECTION 1: HERO & FORM (Fond gris encastré) --- */}
        <div className={GRID_CONTAINER}>
          <section className="bg-[#EBEBEB] rounded-2xl overflow-hidden shadow-sm">
            <div className="flex flex-col lg:flex-row items-stretch">
              
              {/* Côté Gauche: Visuel & Info */}
              <div className="lg:w-[45%] p-8 md:p-12 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-1.5 bg-[#FF2D75] mb-8"></div>
                  <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-8 text-black">
                    CONTACTEZ <br /> NOUS
                  </h1>
                </div>

                <div className="space-y-6">
                  <div className="h-[300px] rounded-xl overflow-hidden shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1000&auto=format&fit=crop" 
                      alt="Chambre" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white/80 backdrop-blur-md p-4 rounded-xl flex items-center gap-3 border border-white">
                      <div className="bg-black text-white p-2.5 rounded-lg"><MailIcon /></div>
                      <span className="text-[13px] font-bold text-black truncate">Lorem@mail.com</span>
                    </div>
                    <div className="bg-white/80 backdrop-blur-md p-4 rounded-xl flex items-center gap-3 border border-white">
                      <div className="bg-black text-white p-2.5 rounded-lg"><PhoneIcon /></div>
                      <span className="text-[13px] font-bold text-black">+33 00 00 000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Côté Droit: Formulaire (Card Blanche) */}
              <div className="lg:w-[55%] p-4 md:p-8 lg:p-12">
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl h-full">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black  tracking-widest text-gray-400">Nom complet</label>
                        <input type="text" placeholder="Votre nom" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-lg outline-none focus:border-[#FF2D75] transition-all text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black  tracking-widest text-gray-400">Téléphone</label>
                        <input type="tel" placeholder="Votre numéro" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-lg outline-none focus:border-[#FF2D75] transition-all text-sm" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black  tracking-widest text-gray-400">Email</label>
                      <input type="email" placeholder="votre@email.com" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-lg outline-none focus:border-[#FF2D75] transition-all text-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black  tracking-widest text-gray-400">Message</label>
                      <textarea rows={4} placeholder="Comment pouvons-nous vous aider ?" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-lg outline-none focus:border-[#FF2D75] transition-all text-sm resize-none"></textarea>
                    </div>
                    
                    <div className="flex items-center gap-3 py-2">
                      <input type="checkbox" id="consent" className="w-4 h-4 accent-[#FF2D75] cursor-pointer" />
                      <label htmlFor="consent" className="text-[10px] text-gray-400 font-medium cursor-pointer  tracking-tight">
                        J'accepte la politique de confidentialité et la récolte de données.
                      </label>
                    </div>

                    <button className="w-full bg-black text-white font-black  tracking-[0.2em] py-5 rounded-xl hover:bg-[#FF2D75] transition-all transform active:scale-[0.98] text-xs shadow-lg shadow-black/10">
                      Envoyer le message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* --- SECTION 2: TESTIMONIAL --- */}
        <section className="py-24 overflow-hidden">
          <div className={GRID_CONTAINER}>
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/2 space-y-8">
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9]">
                  L'excellence à <br /> votre service.
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed max-w-md italic">
                  "Nous croyons que chaque séjour doit être une expérience unique, définie par le confort et l'attention aux détails."
                </p>

                {/* Testimonial Card */}
                <div className="bg-gray-50 p-10 rounded-2xl border border-gray-100 relative">
                  <div className="absolute -top-4 -left-4 bg-[#FF2D75] p-3 rounded-lg text-white">
                    <QuoteIcon />
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed mb-8 font-medium">
                    "Une expérience inoubliable. L'attention portée aux détails et la réactivité de l'équipe ont rendu notre séjour parfait du début à la fin."
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-black ring-4 ring-white shadow-md">
                        <img src="https://i.pravatar.cc/150?u=johndoe" alt="John Doe" />
                      </div>
                      <div>
                        <h4 className="font-black uppercase text-xs tracking-widest">John Doe</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Client Premium</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2 relative">
                <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#EBEBEB] rounded-full -z-10"></div>
                <div className="h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl transform lg:rotate-2">
                  <img 
                    src="https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1000&auto=format&fit=crop" 
                    alt="Interior Design" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Contact;