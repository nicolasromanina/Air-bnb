import React from 'react';

// Ta configuration de grille partagée
const GRID_CONTAINER = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

const LastSection: React.FC = () => {
  const features = [
    { id: '01', text: 'Class aptent taciti sociosqu ad litora torquent.' },
    { id: '02', text: 'Class aptent taciti sociosqu ad litora torquent.' },
    { id: '03', text: 'Class aptent taciti sociosqu ad litora torquent.' },
    { id: '04', text: 'Class aptent taciti sociosqu ad litora torquent.' },
  ];

  return (
    <section className="py-12 lg:py-20 bg-white">
      <div className={GRID_CONTAINER}>
        
        {/* BLOC GRIS ENCASTRÉ : Même couleur et arrondi que les autres sections */}
        <div className="bg-[#EBEBEB] rounded-lg p-8 md:p-12 lg:p-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* COLONNE GAUCHE (5/12) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <h2 className="text-[40px] md:text-[52px] font-black leading-[1] text-black mb-8 uppercase tracking-tighter">
                  Consectetur <br />
                  ipsum elit
                </h2>
                <p className="text-base text-gray-800 leading-relaxed max-w-[380px] font-medium">
                  Sorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum.
                </p>
              </div>

              {/* Petit rappel de marque en bas de colonne */}
              <div className="mt-12 lg:mt-0">
                <span className="inline-block text-[11px] font-black uppercase tracking-[0.2em] text-black border-l-4 border-[#FF2E63] pl-4">
                  Consectetur adipiscing
                </span>
              </div>
            </div>

            {/* COLONNE DROITE (7/12) */}
            <div className="lg:col-span-7 flex flex-col">
              
              {/* Grille de points techniques */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 mb-12">
                {features.map((item) => (
                  <div key={item.id} className="flex items-start gap-4">
                    <span className="text-[36px] font-black text-black/20 leading-none">
                      {item.id}
                    </span>
                    <p className="text-[13px] font-bold uppercase leading-snug text-black pt-1 tracking-tight">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Image finale avec aspect ratio contrôlé */}
              <div className="relative w-full aspect-video lg:aspect-[16/10] overflow-hidden rounded-[4px] shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop"
                  alt="Modern Design"
                  className="w-full h-full object-cover"
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