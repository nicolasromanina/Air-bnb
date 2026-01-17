import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";
import bedroomMain from "@/assets/bedroom-main.png";
import bedroom1 from "@/assets/image-above.png";
import bedroom2 from "@/assets/image-center.png";
import bedroom3 from "@/assets/image-below.png";

const VideoSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  
  const galleryImages = [bedroom1, bedroom2, bedroom3];
  
  // COHÉRENCE GRID : 1440px max-width pour l'alignement global
  const gridContainer = "max-w-[1440px] w-full mx-auto px-4 xs:px-5 sm:px-6 md:px-10 lg:px-16 xl:px-20";

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <section className="w-full bg-white py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 font-montserrat">
      <div className={gridContainer}>
        
        {/* INNER BOX : Le fond gris et les éléments décoratifs sont limités ici */}
        <div className="relative bg-[#E5E5E5] rounded-sm py-10 xs:py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24 
                       px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 overflow-hidden">
          
          {/* Blocs décoratifs alignés aux coins de l'INNER BOX (pas de l'écran) */}
          <div className="absolute top-0 left-0 w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-32 xl:h-32 bg-black z-0" />
          <div className="absolute bottom-0 right-0 w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 xl:w-40 xl:h-40 bg-[#FF1B7C] z-0" />

          {/* Header Text */}
          <div className="text-center mb-8 xs:mb-10 sm:mb-12 md:mb-14 lg:mb-16 relative z-10">
            <h2 
              className="mb-4 xs:mb-5 sm:mb-6 font-bold text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
                       leading-[1.1] sm:leading-[1.05] tracking-tighter uppercase"
              style={{
                color: 'hsl(0 0% 8%)',
                fontFamily: "'Playfair Display', serif"
              }}
            >
              Adipiscing elit amet,<br />consectetur.
            </h2>
            <p className="text-xs xs:text-sm sm:text-base leading-relaxed max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl 
                        mx-auto text-gray-600 font-medium px-2 xs:px-0">
              Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti
              sociosqu ad litora torquent per conubia nostra.
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 xs:gap-5 sm:gap-6 mb-8 xs:mb-10 sm:mb-12 md:mb-14 lg:mb-16 relative z-10">
            
            {/* Main Video Block */}
            <div className="lg:col-span-3 relative aspect-video xs:aspect-[16/10] overflow-hidden rounded-sm group shadow-lg sm:shadow-xl bg-gray-200">
              <img
                src={bedroomMain}
                alt="Chambre luxueuse"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 
                         transition-all duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 
                           rounded-full border border-white/40 flex items-center justify-center 
                           backdrop-blur-md bg-white/10 transition-all duration-500 
                           hover:scale-110 hover:bg-[#FF1B7C] hover:border-[#FF1B7C]"
                  aria-label="Lire la vidéo"
                >
                  <Play className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 
                                 text-white fill-white ml-0.5 xs:ml-1" />
                </button>
              </div>
            </div>

            {/* Side Gallery - DESKTOP (inchangé) */}
            <div className="hidden lg:flex flex-col gap-3 xs:gap-4">
              {galleryImages.map((img, idx) => (
                <div key={idx} className="flex-1 overflow-hidden rounded-sm shadow-md sm:shadow-lg group">
                  <img
                    src={img}
                    alt={`Vue ${idx}`}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 
                             transition-all duration-700"
                  />
                </div>
              ))}
            </div>

            {/* Mobile Gallery Slider */}
            <div className="lg:hidden relative">
              <div className="relative overflow-hidden rounded-sm">
                <div 
                  ref={sliderRef}
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {galleryImages.map((img, idx) => (
                    <div 
                      key={idx}
                      className="w-full flex-shrink-0"
                    >
                      <div className="mx-1 xs:mx-2 sm:mx-3">
                        <div className="overflow-hidden rounded-sm shadow-md">
                          <img
                            src={img}
                            alt={`Vue ${idx}`}
                            className="w-full h-40 xs:h-44 sm:h-48 md:h-56 object-cover grayscale hover:grayscale-0 
                                     transition-all duration-700"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Navigation buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-2 xs:left-3 sm:left-4 top-1/2 -translate-y-1/2 
                         w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-full bg-black/80 text-white 
                         flex items-center justify-center transition-all duration-300 
                         hover:bg-[#FF1B7C] hover:scale-110 z-20"
                aria-label="Image précédente"
              >
                <ChevronLeft className="w-4 h-4 xs:w-5 xs:h-5" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-2 xs:right-3 sm:right-4 top-1/2 -translate-y-1/2 
                         w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-full bg-black/80 text-white 
                         flex items-center justify-center transition-all duration-300 
                         hover:bg-[#FF1B7C] hover:scale-110 z-20"
                aria-label="Image suivante"
              >
                <ChevronRight className="w-4 h-4 xs:w-5 xs:h-5" />
              </button>
              
              {/* Dots indicator */}
              <div className="flex justify-center mt-4 xs:mt-5 sm:mt-6 space-x-2">
                {galleryImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                      currentSlide === idx 
                        ? 'bg-black scale-125' 
                        : 'bg-gray-400 hover:bg-gray-600'
                    }`}
                    aria-label={`Aller à l'image ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center relative z-10">
            <button 
              className="bg-black text-white px-6 xs:px-7 sm:px-8 md:px-9 lg:px-10 
                       py-3 xs:py-3.5 sm:py-4 rounded-sm 
                       text-xs xs:text-xs sm:text-[13px] md:text-[13.5px] lg:text-[14px] 
                       font-bold tracking-[0.15em] xs:tracking-[0.17em] sm:tracking-[0.19em] md:tracking-[0.2em]
                       transition-all duration-500 hover:bg-[#FF1B7C] hover:-translate-y-1 shadow-lg
                       min-w-[180px] xs:min-w-[200px] sm:min-w-[220px] md:min-w-[240px]"
            >
              Réserver maintenant
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;