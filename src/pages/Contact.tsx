import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NavbarSpacer from '@/components/NavbarSpacer';

// --- Icônes SVG Intégrées (Pixel Perfect) ---
const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9 7 9-7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="22 7 12 14 2 7"/></svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
);

const QuoteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-[#111827]"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H11.017V4H21.017V15C21.017 18.3137 18.3307 21 15.017 21H14.017ZM3.01697 21L3.01697 18C3.01697 16.8954 3.9124 16 5.01697 16H8.01697C8.56925 16 9.01697 15.5523 9.01697 15V9C9.01697 8.44772 8.56925 8 8.01697 8H4.01697C3.46468 8 3.01697 8.44772 3.01697 9V12C3.01697 12.5523 2.56925 13 2.01697 13H0.0169678V4H10.017V15C10.017 18.3137 7.3307 21 4.01697 21H3.01697Z"/></svg>
);

const Contact: React.FC = () => {
  return (
    <div className="font-['Montserrat'] bg-white overflow-x-hidden">
      <Navbar />
      <NavbarSpacer />
      <main>
        {/* --- SECTION 1: HERO & CONTACT FORM --- */}
        <section className="relative bg-[#E5E5E5] pt-16 pb-24 px-4 md:px-8 xl:px-0">
          <div className="max-w-[1280px] mx-auto flex flex-col xl:flex-row gap-8 items-start">
            
            {/* Left Side: Image & Info */}
            <div className="w-full xl:w-[540px]">
              <div className="rounded-[10px] overflow-hidden mb-6 h-[450px]">
                <img 
                  src="https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1000&auto=format&fit=crop" 
                  alt="Chambre" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 bg-white/50 backdrop-blur-sm p-5 rounded-[10px] flex items-center gap-4">
                  <div className="bg-black text-white p-3 rounded-full"><MailIcon /></div>
                  <span className="text-[14px] font-medium">Lorem@mail.com</span>
                </div>
                <div className="flex-1 bg-white/50 backdrop-blur-sm p-5 rounded-[10px] flex items-center gap-4">
                  <div className="bg-black text-white p-3 rounded-full"><PhoneIcon /></div>
                  <span className="text-[14px] font-medium">+33 00 00 000</span>
                </div>
              </div>
            </div>

            {/* Right Side: Form Card */}
            <div className="w-full xl:w-[680px] bg-white p-8 md:p-12 rounded-[20px] shadow-sm">
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-[12px] font-bold mb-2 tracking-wide">Nom</label>
                    <input type="text" placeholder="Votre nom" className="w-full bg-[#F3F4F6] p-4 rounded-[8px] outline-none text-[14px] focus:ring-1 focus:ring-[#FF2D75]/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold mb-2 tracking-wide">Numéro de téléphone</label>
                    <input type="tel" placeholder="Votre numéro de téléphone" className="w-full bg-[#F3F4F6] p-4 rounded-[8px] outline-none text-[14px] focus:ring-1 focus:ring-[#FF2D75]/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold mb-2 tracking-wide">Adresse e-mail</label>
                    <input type="email" placeholder="Votre adresse e-mail" className="w-full bg-[#F3F4F6] p-4 rounded-[8px] outline-none text-[14px] focus:ring-1 focus:ring-[#FF2D75]/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold mb-2 tracking-wide">Adresse</label>
                    <input type="text" placeholder="Votre adresse" className="w-full bg-[#F3F4F6] p-4 rounded-[8px] outline-none text-[14px] focus:ring-1 focus:ring-[#FF2D75]/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold mb-2 tracking-wide">Message</label>
                    <textarea rows={4} placeholder="Votre message" className="w-full bg-[#F3F4F6] p-4 rounded-[8px] outline-none text-[14px] resize-none focus:ring-1 focus:ring-[#FF2D75]/20 transition-all"></textarea>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="consent" className="w-4 h-4 accent-[#FF2D75] cursor-pointer" />
                  <label htmlFor="consent" className="text-[11px] text-gray-500 cursor-pointer">Coût de la récolte de données à des fins marketing sera à votre charge</label>
                </div>

                <button className="w-full bg-[#FF2D75] text-white font-bold py-4 rounded-[8px] text-[14px] hover:bg-[#e62969] transition-all transform active:scale-[0.98] tracking-wider">
                  Envoyer le message
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* --- SECTION 2: TESTIMONIAL & CONTENT --- */}
        <section className="py-24 px-4 md:px-8 xl:px-0">
          <div className="max-w-[1280px] mx-auto flex flex-col xl:flex-row gap-16 items-center">
            
            <div className="w-full xl:w-1/2">
              <h2 className="text-[32px] md:text-[40px] font-extrabold leading-[1.1] mb-8 uppercase tracking-tight max-w-[500px]">
                Class aptent taciti sociosqu ad litora torquent .
              </h2>
              <p className="text-[#4B5563] text-[15px] leading-relaxed mb-12 max-w-[550px]">
                Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna et turpis condimentum lobortis.
              </p>

              {/* Testimonial Card */}
              <div className="relative bg-white border border-gray-100 p-10 rounded-[10px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] max-w-[550px]">
                <div className="mb-6"><QuoteIcon /></div>
                <p className="italic text-[16px] leading-relaxed mb-8 text-[#1f2937]">
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                      <img src="https://i.pravatar.cc/150?u=johndoe" alt="John Doe" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[16px]">John Doe</h4>
                      <p className="text-[12px] text-gray-400">Lorem ipsum dolor sit amet, consectetur</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all group">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-[#FF2D75] border-none transition-all">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full xl:w-1/2 relative">
              {/* Pink Square Accent - Pixel Perfect positioning */}
              <div className="absolute -left-6 top-20 w-[60px] h-[60px] bg-[#FF2D75] z-10 hidden xl:block"></div>
              <div className="h-[500px] md:h-[700px] w-full rounded-[10px] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1000&auto=format&fit=crop" 
                  alt="Interior Design" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 3: TWO IMAGES GALLERY --- */}
        <section className="py-24 bg-[#F9FAFB] px-4 md:px-8 xl:px-0">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex flex-col xl:flex-row gap-12">
              <div className="w-full xl:w-1/3">
                <h3 className="text-[32px] font-extrabold leading-tight mb-6 uppercase tracking-tight">
                  Gorem ipsum dolor sit amet, consectetur
                </h3>
                <p className="text-gray-600 text-[15px] leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
                </p>
              </div>
              
              <div className="w-full xl:w-2/3">
                <div className="mb-6">
                   <p className="text-[16px] font-bold">Nunc vulputate <span className="text-gray-400 font-normal italic">libero et velit</span> interdum, ac aliquet odio mattis.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-[350px] rounded-[10px] overflow-hidden group">
                    <img 
                      src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop" 
                      alt="Room View 1" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                  <div className="h-[350px] rounded-[10px] overflow-hidden group">
                    <img 
                      src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800&auto=format&fit=crop" 
                      alt="Room View 2" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- BOTTOM BANNER --- */}
        <section className="bg-[#E5E5E5] py-20 overflow-hidden flex justify-center items-center">
            <h1 className="text-[60px] md:text-[100px] lg:text-[140px] font-black tracking-tighter text-black leading-none select-none">
              Adipiscing elit
            </h1>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;