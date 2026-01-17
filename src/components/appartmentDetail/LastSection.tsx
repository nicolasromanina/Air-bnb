import React from 'react';

// Configuration de la grille unifiée pour la cohérence
const GRID_CONTAINER = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

const LastSection: React.FC = () => {
  const features = [
    { id: '01', text: 'Class aptent taciti sociosqu ad litora torquent.' },
    { id: '02', text: 'Class aptent taciti sociosqu ad litora torquent.' },
    { id: '03', text: 'Class aptent taciti sociosqu ad litora torquent.' },
    { id: '04', text: 'Class aptent taciti sociosqu ad litora torquent.' },
  ];

  return (
    <section className="py-12 lg:py-20 bg-white font-sans">
      <div className={GRID_CONTAINER}>
        
        {/* BLOC GRIS ENCASTRÉ DANS LA GRILLE */}
        <div className="bg-[#EBEBEB] rounded-lg p-8 md:p-12 lg:p-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* COLONNE GAUCHE (5/12) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <h2 className="text-[42px] md:text-[56px] font-black leading-[0.9] text-black mb-8 uppercase tracking-tighter">
                  Consectetur <br />
                  ipsum elit
                </h2>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-[380px] font-medium">
                  Sorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>

              {/* Texte du bas aligné */}
              <div className="mt-12 lg:mt-24">
                <span className="text-xs font-black uppercase tracking-widest text-black border-l-4 border-[#FF2E63] pl-4">
                  Consectetur adipiscing elit.
                </span>
              </div>
            </div>

            {/* COLONNE DROITE (7/12) */}
            <div className="lg:col-span-7 flex flex-col">
              
              {/* Grille de points (01, 02, etc.) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12 mb-12">
                {features.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 group">
                    <span className="text-[32px] md:text-[48px] font-black text-gray-400/50 leading-none transition-colors group-hover:text-[#FF2E63]">
                      {item.id}
                    </span>
                    <p className="text-[13px] font-bold uppercase leading-snug text-black pt-2 tracking-tight">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Conteneur de l'image panoramique */}
              <div className="relative w-full aspect-[16/9] overflow-hidden rounded-[4px] shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop"
                  alt="Design épuré"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default LastSection;