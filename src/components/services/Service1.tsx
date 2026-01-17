import React, { memo, useMemo } from 'react';
import { 
  Home, 
  Gem, 
  Bed, 
  Utensils, 
  Umbrella, 
  Sofa,
  FileText,
  BedDouble
} from 'lucide-react';
import heroService from '@/assets/hero-service.png';
import bedroomService1 from '@/assets/badroom-service-1.png';
import bedroomService2 from '@/assets/bedroom-service-2.png';
import livingrooService1 from '@/assets/livingroom-service-1.png';
import bedroomService3 from '@/assets/bedroom-service-3.png';
import livingrooService2 from '@/assets/livingroom-service-2.png';

// --- CONFIGURATION DE LA GRILLE UNIFIÉE ---
const GRID_CONTAINER = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

const OptimizedImage = memo(({ src, alt, className = "", containerClass = "", priority = false }: any) => (
  <div className={`relative overflow-hidden ${containerClass}`}>
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  </div>
));

const features = [
  {
    icon: FileText,
    title: "Adipiscing elit amet, consectetur .",
    description: "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
  },
  {
    icon: Bed,
    title: "Class aptent taciti sociosqu ad",
    description: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
  },
  {
    icon: Utensils,
    title: "A nunc vulputate libero et velit",
    description: "Curabitur tempus urna at turpis condimentum lobortis. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent."
  },
  {
    icon: Umbrella,
    title: "Curabitur tempus urna at turpis condimentum",
    description: "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis."
  }
];

const Service1: React.FC = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="text-gray-900 bg-white overflow-x-hidden selection:bg-pink-500 selection:text-white"
         style={{ fontFamily: "'Montserrat', sans-serif" }}>
      
      {/* SECTION 1: HERO */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className={GRID_CONTAINER}>
          <div className="flex flex-col lg:flex-row bg-[#EBEBEB] overflow-hidden rounded-sm">
            <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-16 xl:p-20">
              <h1 className="text-4xl sm:text-5xl md:text-[60px] xl:text-[75px] leading-[0.9] font-black text-black tracking-tighter mb-6 uppercase"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}>
                CONSECT<br/>ADIPISCING<br/>ELIT.
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed max-w-md font-medium"
                 style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum.
              </p>
            </div>
            <div className="w-full lg:w-1/2">
              <OptimizedImage src={heroService} alt="Hero" className="w-full h-full object-cover" priority={true} />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: COMPOSITION IMAGES */}
      <section className="py-16 sm:py-24 lg:py-32 bg-white">
        <div className={GRID_CONTAINER}>
          <div className="flex flex-col xl:flex-row gap-16 items-center">
            <div className="w-full xl:w-1/2 relative min-h-[400px] sm:min-h-[600px]">
              <div className="absolute top-[15%] right-[0%] w-32 h-32 bg-[#FF1675] z-0"></div>
              <div className="absolute bottom-[0%] left-[28%] w-16 h-16 bg-black z-30"></div>

              <div className="absolute top-0 left-0 w-[75%] z-10 shadow-xl">
                <OptimizedImage src={livingrooService1} alt="Living" containerClass="h-[300px] sm:h-[400px]" />
              </div>
              <div className="absolute bottom-0 right-0 w-[65%] z-20 shadow-2xl border-[10px] border-white">
                <OptimizedImage src={bedroomService1} alt="Detail" containerClass="h-[250px] sm:h-[350px]" />
              </div>
            </div>
            <div className="w-full xl:w-1/2 lg:pl-12">
              <h2 className="text-4xl sm:text-6xl font-black text-black mb-8 uppercase tracking-tighter"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Lorem ipsum<br/>dolor sit.
              </h2>
              <p className="text-gray-600 mb-10 max-w-lg"
                 style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent.
              </p>
              <div className="space-y-8">
                {[{icon: Gem, title: "Inceptos"}, {icon: Home, title: "Curabitur"}].map((item, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-full bg-[#FF1675] flex items-center justify-center flex-shrink-0">
                      <item.icon className="text-white w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-xl uppercase tracking-tight"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {item.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: CTA SPLIT */}
      <section className="bg-white py-12 lg:py-16">
          <div className={GRID_CONTAINER}>
            <div className="bg-[#EBEBEB] flex flex-col lg:flex-row overflow-hidden rounded-sm">
              {/* COLONNE GAUCHE */}
              <div className="w-full lg:w-1/3 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-black leading-tight mb-6 uppercase tracking-tight"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Adipiscing elit amet <br /> consectetur.
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-10 max-w-sm"
                   style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Class aptent taciti sociosqu ad litora torquent per conubia nostra, 
                  per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.
                </p>
                <button 
                  className="bg-[#1A1A1A] hover:bg-black text-white font-bold py-4 px-10 rounded-md w-fit transition-colors duration-300 text-sm uppercase tracking-wider"
                  aria-label="Reserver"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Reserver
                </button>
              </div>
              {/* COLONNE CENTRALE */}
              <div className="w-full lg:w-1/3 h-[400px] lg:h-auto border-x border-gray-300/30">
                <img 
                  src={bedroomService2}
                  alt="Chambre de luxe design" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* COLONNE DROITE */}
              <div className="w-full lg:w-1/3 p-8 sm:p-10 lg:p-12 flex flex-col gap-6 justify-center">
                <div className="bg-white p-8 rounded-sm shadow-sm flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-4">
                    <Bed className="text-white w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-black mb-3 uppercase tracking-tight"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Inceptos himenaeos
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed"
                     style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Ad litora torquent per conubia nostra, per inceptos himenaeos. 
                    Curabitur tempus urna at turpis condimentum lobortis.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-sm shadow-sm flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-4">
                    <Sofa className="text-white w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-black mb-3 uppercase tracking-tight"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Class aptent taciti
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed"
                     style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Norem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: FEATURES GRID */}
        <section className="w-full bg-[#FAFAFA] pt-20 lg:pt-28 pb-10 relative overflow-hidden"
                 style={{ fontFamily: "'Montserrat', sans-serif" }}>
          <div className={GRID_CONTAINER}>
            <div className="text-center mb-16 lg:mb-24">
              <h2 className="text-3xl sm:text-4xl lg:text-[56px] font-bold text-[#1A1A1A] leading-[1.1] tracking-tight"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Lorem ipsum dolor sit <br /> amet.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative z-10 mb-20 lg:mb-32">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white p-8 sm:p-10 rounded-[4px] shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#1A1A1A] rounded-[4px] flex items-center justify-center group-hover:bg-[#FF2E63] transition-colors duration-300">
                      <feature.icon className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#1A1A1A] pt-1 leading-snug"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-[15px] text-gray-600 leading-relaxed font-medium"
                     style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full overflow-hidden select-none pointer-events-none mt-10 pb-20 lg:pb-20">
             <div className="text-center font-bold text-[#808080] opacity-40 text-[12vw] lg:text-[110px] leading-[0.8] tracking-tighter whitespace-nowrap transform translate-y-4"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Lorem ipsum dolor
             </div>
          </div>
        </section>

      {/* SECTION 5: DARK - MODIFIÉE (Moins haut, apparence plus large) */}
      <section className="bg-white py-12 lg:py-20"
               style={{ fontFamily: "'Montserrat', sans-serif" }}>
        <div className={GRID_CONTAINER}>
          
          {/* --- EN-TÊTE DE SECTION --- */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 lg:mb-14 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FF2E63] flex items-center justify-center text-white shadow-sm flex-shrink-0">
                <BedDouble size={24} strokeWidth={2} />
              </div>
              <div className="text-sm font-bold leading-tight uppercase text-black tracking-wide"
                   style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Worem ipsum <br/> dolor sit amet
              </div>
            </div>
            <div className="text-left sm:text-right max-w-xs text-sm font-semibold text-gray-800 leading-snug"
                 style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Sorem ipsum dolor sit amet, <br className="hidden sm:block"/> consectetur adipiscing elit.
            </div>
          </div>

          {/* --- GRILLE PRINCIPALE (Ratio Asymétrique) --- */}
          <div className="flex flex-col gap-6 lg:gap-8">
            
            {/* LIGNE 1 : Image (Petite) + Bloc Gris (Large) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* IMAGE 1 : 5 colonnes */}
              <div className="lg:col-span-5 h-[300px] w-full rounded-[4px] overflow-hidden">
                <img 
                  src={bedroomService3}
                  alt="Chambre beige lumineuse" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>

              {/* CARTE GRISE : 7 colonnes (Plus large) */}
              <div className="lg:col-span-7 bg-[#E5E5E5] p-8 lg:p-12 flex flex-col justify-center rounded-[4px] min-h-[300px]">
                <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#1A1A1A] leading-[1.2] mb-5"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-8 font-medium max-w-2xl"
                   style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Qorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit 
                  interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent.
                </p>
                <button className="bg-[#FF2E63] hover:bg-[#e02655] text-white font-bold py-3 px-8 rounded-[4px] w-fit text-sm uppercase tracking-wide transition-colors duration-300 shadow-md"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Reserver maintenant
                </button>
              </div>
            </div>

            {/* LIGNE 2 : Bloc Noir (Large) + Image (Petite) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* CARTE NOIRE : 7 colonnes (Plus large) */}
              <div className="lg:col-span-7 bg-black p-8 lg:p-12 flex flex-col justify-center rounded-[4px] min-h-[300px]">
                <h2 className="text-2xl sm:text-3xl text-white mb-8 lg:mb-10 leading-tight"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  <span className="text-gray-500 font-light block sm:inline mr-2">Class</span>
                  <span className="font-bold">aptent taciti sociosqu quad litora torquent .</span>
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10">
                  {[
                    { id: "01", text: "Nunc vulputate libero et velit interdum" },
                    { id: "02", text: "Class aptent taciti sociosqu ad litora torquent" },
                    { id: "03", text: "Class aptent taciti sociosqu ad litora" },
                    { id: "04", text: "Taciti sociosqu ad litora torquent" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-row items-center gap-4">
                      <span className="text-5xl font-bold text-gray-500 font-mono opacity-60">{item.id}</span>
                      <p className="text-sm sm:text-base text-gray-300 font-medium leading-snug"
                         style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>

              </div>

              {/* IMAGE 2 : 5 colonnes */}
              <div className="lg:col-span-5 h-[300px] w-full rounded-[4px] overflow-hidden">
                <img 
                  src={livingrooService2}
                  alt="Détail chambre bois" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default memo(Service1);