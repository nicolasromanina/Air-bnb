import { Diamond } from 'lucide-react';

function ThreeCardsSection() {
  // COHÉRENCE GRID : 1440px pour l'alignement parfait avec les sections supérieures
  const gridContainer = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

  return (
    <section className="bg-white py-16 md:py-24" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className={gridContainer}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Carte 1 - Style Minimaliste Gris */}
          <div className="bg-[#F3F3F3] rounded-sm p-10 lg:p-12 flex flex-col justify-between min-h-[450px] transition-transform duration-500 hover:-translate-y-2">
            <div>
              <h3 
                className="text-[28px] lg:text-[32px] font-bold text-black leading-none uppercase tracking-tighter mb-20"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Sorem ipsum<br />dolor sit amet
              </h3>
            </div>

            <div>
              <p className="text-[18px] lg:text-[20px] leading-snug font-medium"
                 style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <span className="text-gray-400 uppercase text-sm block mb-2 font-bold tracking-widest"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}>Origine</span>
                <span className="text-black">Class aptent taciti socios quad litora torquent.</span>
              </p>
            </div>
          </div>

          {/* Carte 2 - Style Black & Pink (La pièce maîtresse) */}
          <div className="bg-black rounded-sm p-10 lg:p-12 flex flex-col justify-between min-h-[450px] shadow-2xl transition-transform duration-500 hover:-translate-y-2 relative overflow-hidden">
            {/* Décoration subtile en arrière-plan */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF1B7C]/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <div className="relative z-10">
              <h3 
                className="text-[28px] lg:text-[32px] font-bold text-white leading-tight uppercase tracking-tighter mb-6"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Sit amet,<br />consectetur elit.
              </h3>

              <p className="text-sm leading-relaxed text-gray-300 mb-10"
                 style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
              </p>
            </div>

            <button className="bg-[#FF1B7C] hover:bg-white hover:text-black text-white font-bold text-sm tracking-[0.2em] px-10 py-5 rounded-sm transition-all duration-500 w-full relative z-10 shadow-lg"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Réserver maintenant
            </button>
          </div>

          {/* Carte 3 - Style White & Diamond */}
          <div className="bg-white border border-gray-200 rounded-sm p-10 lg:p-12 flex flex-col justify-between min-h-[450px] relative transition-transform duration-500 hover:-translate-y-2 shadow-sm">
            <div className="absolute top-10 right-10">
              <div className="w-14 h-14 bg-[#FF1B7C] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <Diamond className="w-6 h-6 text-white" fill="currentColor" />
              </div>
            </div>

            <div>
              <h3 
                className="text-[28px] lg:text-[32px] font-bold text-black leading-tight uppercase tracking-tighter mb-6"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Inceptos<br />himenaeos.
              </h3>

              <p className="text-sm leading-relaxed text-gray-500 mb-10 font-medium"
                 style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <h4 className="text-[18px] lg:text-[20px] font-bold text-black leading-tight  tracking-tight"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Sorem ipsum dolor sit amet
              </h4>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default ThreeCardsSection;