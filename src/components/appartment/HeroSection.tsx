import React, { memo } from 'react';
import heroRoom from "@/assets/hero-room.jpg";

// --- CONFIGURATION DE LA GRILLE (Constante pour l'alignement parfait) ---
const GRID_CONTAINER = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

const HeroSection = () => {
  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className={GRID_CONTAINER}>
        
        {/* Conteneur interne avec le fond gris, aligné sur la grille */}
        <div className="flex flex-col lg:flex-row bg-[#EBEBEB] overflow-hidden rounded-sm min-h-[500px] lg:min-h-[600px]">
          +
          {/* Colonne Gauche : Contenu texte */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-16 xl:p-24">
            <h1 className="text-black font-sans font-black text-4xl md:text-5xl lg:text-[56px] xl:text-[75px] leading-[0.9] tracking-tighter uppercase mb-8">
              INTERDUM,<br />
              AC ALIQUET<br />
              ODIO MATTIS.
            </h1>
            <p className="text-gray-800 font-sans text-sm sm:text-base md:text-lg max-w-md leading-relaxed font-medium">
              Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
              vulputate libero et velit interdum, ac aliquet odio mattis.
            </p>
          </div>
          
          {/* Colonne Droite : Image */}
          {/* h-[400px] sur mobile pour ne pas être trop écrasé, h-full sur desktop */}
          <div className="w-full lg:w-1/2 h-[400px] lg:h-auto">
            <img
              src={heroRoom}
              alt="Luxury modern apartment"
              className="w-full h-full object-cover"
              loading="eager" // Priorité haute car c'est le Hero
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default memo(HeroSection);