import React from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NavbarSpacer from '@/components/NavbarSpacer';
import apartment1 from "@/assets/apartment-1.jpg";
import apartment2 from "@/assets/apartment-2.jpg";
import bedroomTestimonial from "@/assets/bedroom-testimonial.jpg";
import avatar from "@/assets/avatar.jpg";

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

      <main className="py-0 lg:py-0">
        
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
        <section className="section-dark py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left Side - Text Content */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase leading-tight mb-6">
                    CLASS APTENT TACITI SOCIOSQU AD LITORA TORQUENT .
                  </h2>
                  <p className="text-dark-muted text-sm leading-relaxed">
                    Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
                    Class aptent taciti sociosqu ad litora torquent per conubia nostra,
                    per inceptos himenaeos. Curabitur tempus urna at turpis
                    condimentum lobortis.
                  </p>
                </div>

                {/* Testimonial Card */}
                <div className="bg-background text-foreground p-6 lg:p-8">
                  <div className="testimonial-quote mb-4">"</div>
                  <p className="text-sm leading-relaxed mb-6">
                    Gorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nunc vulputate libero et velit interdum, ac aliquet odio
                    mattis. Class aptent taciti sociosqu ad litora torquent per
                    conubia nostra, per inceptos himenaeos.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={avatar}
                        alt="John Doe"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-sm">John Doe</p>
                        <p className="text-xs text-muted-foreground">
                          Curabitur tempus urna<br />at turpis
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 border border-foreground rounded-full flex items-center justify-center hover:bg-foreground hover:text-background transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 border border-foreground rounded-full flex items-center justify-center hover:bg-foreground hover:text-background transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Image with Accent */}
              <div className="relative">
                <div className="absolute top-[50px] left-0 w-20 h-20 bg-primary -translate-x-4 z-10" />
                <img
                  src={bedroomTestimonial}
                  alt="Chambre moderne avec canapé terracotta"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 3: IMAGES GALLERY --- */}
       <section className="bg-white py-12 lg:py-16">
        <div className={GRID_CONTAINER}>
          
          {/* Le fond (bg-secondary ou bg-background) est limité ici par le grid */}
          <div className="bg-white rounded-[2rem] px-8 py-12 md:px-12 lg:px-16 lg:py-20 shadow-sm">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Texte de gauche - occupe 3 colonnes sur 12 */}
              <div className="lg:col-span-6">
                <h3 className="text-xl md:text-2xl font-bold leading-tight mb-4 text-black uppercase tracking-tighter">
                  Gorem ipsum <br /> dolor sit amet, <br /> consectetur
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Sorem ipsum dolor sit amet, consectetur <br />
                  adipiscing elit. Nunc vulputate et velit <br />
                  interdum, ac aliquet odio mattis.
                </p>
              </div>

              {/* Section centrale/droite - occupe 9 colonnes sur 12 */}
              <div className="lg:col-span-6">
                <div className="flex flex-col">
                  
                  {/* Texte au-dessus des images */}
                  <div className="mb-6 lg:mb-8">
                    <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-black font-medium">
                      Nunc vulputate <span className="text-[#FF2D75] font-bold">libero et velit</span> interdum, ac <br className="hidden lg:block"/> aliquet odio mattis.
                    </p>
                  </div>
                  
                  {/* Images côte à côte */}
                  <div className="flex gap-4">
                    <div className="w-1/3 aspect-[4/5] overflow-hidden rounded-xl shadow-lg">
                      <img
                        src={apartment1}
                        alt="Salon moderne"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="w-1/3 aspect-[4/5] overflow-hidden rounded-xl shadow-lg">
                      <img
                        src={apartment2}
                        alt="Chambre minimaliste"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  
                </div>
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