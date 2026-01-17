import { Home } from "lucide-react";
import featureBedroom from "@/assets/horizontal-photo-room.png";
import featureLiving from "@/assets/square-photo-room.png";

const FeatureRoom = () => {
  // COHÉRENCE HERO & FOOTER : Grid de 1440px avec marges réactives
  const gridContainer = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

  return (
    <section className="w-full py-16 md:py-24 bg-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className={gridContainer}>
        
        {/* Header : Aligné sur la grille */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-8 mb-16 md:mb-20">
          <div className="max-w-[500px]">
            <h2 
              className="text-[32px] sm:text-[42px] lg:text-[52px] xl:text-[62px] font-bold leading-[1] tracking-tighter uppercase"
              style={{
                color: 'hsl(0 0% 8%)',
                fontFamily: "'Montserrat', sans-serif"
              }}
            >
              Adipiscing<br />
              Elit Amet<br />
              Consectetur
            </h2>
          </div>
          
          <div className="max-w-md">
            <p 
              className="text-sm sm:text-base leading-relaxed text-gray-600 border-l-2 border-black/10 pl-6"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
            </p>
          </div>
        </div>

        {/* Grid content : 2 colonnes principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Colonne Gauche */}
          <div className="flex flex-col gap-8">
            {/* Cartes de caractéristiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Dark card */}
              <div 
                className="p-8 md:p-10 flex flex-col items-start text-left rounded-sm transition-transform hover:-translate-y-1 duration-500"
                style={{
                  backgroundColor: 'hsl(0 0% 8%)',
                  color: 'hsl(0 0% 100%)'
                }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6 bg-white">
                  <Home className="w-5 h-5 text-black" />
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Lorem ipsum dolor sit amet
                </h3>
                <p className="text-sm leading-relaxed opacity-70"
                   style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
                </p>
              </div>

              {/* Light card (Gris très clair pour subtilité) */}
              <div 
                className="p-8 md:p-10 flex flex-col items-start text-left rounded-sm bg-[#F5F5F5] transition-transform hover:-translate-y-1 duration-500"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6 bg-black">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Nunc vulputate libero et velit
                </h3>
                <p className="text-sm leading-relaxed text-gray-500"
                   style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
                </p>
              </div>
            </div>

            {/* Bedroom image (Horizontal) */}
            <div className="w-full aspect-[16/9] overflow-hidden rounded-sm group">
              <img
                src={featureBedroom}
                alt="Luxury bedroom interior"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
              />
            </div>
          </div>

          {/* Colonne Droite - Grande image verticale */}
          <div className="w-full h-full min-h-[500px] lg:min-h-full overflow-hidden rounded-sm group">
            <img
              src={featureLiving}
              alt="Modern living room interior"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureRoom;