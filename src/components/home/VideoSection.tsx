import { Play } from "lucide-react";
import bedroomMain from "@/assets/bedroom-main.png";
import bedroom1 from "@/assets/image-above.png";
import bedroom2 from "@/assets/image-center.png";
import bedroom3 from "@/assets/image-below.png";

const VideoSection = () => {
  // COHÉRENCE GRID : 1440px max-width pour l'alignement global
  const gridContainer = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

  return (
    <section className="w-full bg-white py-12 md:py-20 font-montserrat">
      <div className={gridContainer}>
        
        {/* INNER BOX : Le fond gris et les éléments décoratifs sont limités ici */}
        <div className="relative bg-[#E5E5E5] rounded-sm py-16 md:py-24 px-6 md:px-12 lg:px-16 overflow-hidden">
          
          {/* Blocs décoratifs alignés aux coins de l'INNER BOX (pas de l'écran) */}
          <div className="absolute top-0 left-0 w-20 h-20 md:w-32 md:h-32 bg-black z-0" />
          <div className="absolute bottom-0 right-0 w-24 h-24 md:w-40 md:h-40 bg-[#FF1B7C] z-0" />

          {/* Header Text */}
          <div className="text-center mb-12 md:mb-16 relative z-10">
            <h2 
              className="mb-6 font-bold text-4xl md:text-5xl lg:text-6xl leading-[1] tracking-tighter uppercase"
              style={{
                color: 'hsl(0 0% 8%)',
                fontFamily: "'Playfair Display', serif"
              }}
            >
              Adipiscing elit amet,<br />consectetur.
            </h2>
            <p className="text-sm md:text-base leading-relaxed max-w-2xl mx-auto text-gray-600 font-medium">
              Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti
              sociosqu ad litora torquent per conubia nostra.
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12 relative z-10">
            
            {/* Main Video Block */}
            <div className="lg:col-span-3 relative aspect-[16/10] overflow-hidden rounded-sm group shadow-xl bg-gray-200">
              <img
                src={bedroomMain}
                alt="Chambre luxueuse"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/40 flex items-center justify-center backdrop-blur-md bg-white/10 transition-all duration-500 hover:scale-110 hover:bg-[#FF1B7C] hover:border-[#FF1B7C]"
                  aria-label="Lire la vidéo"
                >
                  <Play className="w-6 h-6 md:w-8 md:h-8 text-white fill-white ml-1" />
                </button>
              </div>
            </div>

            {/* Side Gallery */}
            <div className="hidden lg:flex flex-col gap-4">
              {[bedroom1, bedroom2, bedroom3].map((img, idx) => (
                <div key={idx} className="flex-1 overflow-hidden rounded-sm shadow-md group">
                  <img
                    src={img}
                    alt={`Vue ${idx}`}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center relative z-10">
            <button 
              className="bg-black text-white px-10 py-4 rounded-sm text-[12px] font-bold  tracking-[0.2em] transition-all duration-500 hover:bg-[#FF1B7C] hover:-translate-y-1 shadow-lg"
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