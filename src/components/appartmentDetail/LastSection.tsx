import React from 'react';

const LastSection: React.FC = () => {
  // Données pour la grille de texte
  const features = [
    { id: '01', text: 'Class aptent taciti sociosqu ad litora torquent.' },
    { id: '02', text: 'Class aptent taciti sociosqu ad litora torquent.' },
    { id: '03', text: 'Class aptent taciti sociosqu ad litora torquent.' },
    { id: '04', text: 'Class aptent taciti sociosqu ad litora torquent.' },
  ];

  return (
    <section className="bg-white font-['Montserrat'] min-h-screen flex items-center justify-center p-6 md:p-12 lg:p-20">
      <div className="max-w-[1280px] w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
        
        {/* COLONNE GAUCHE */}
        <div className="lg:col-span-5 flex flex-col justify-between py-2">
          <div>
            <h1 className="text-[42px] md:text-[56px] font-bold leading-[1.1] text-black mb-8">
              Consectetur <br />
              ipsum elit
            </h1>
            <p className="text-[16px] md:text-[18px] text-gray-700 leading-relaxed max-w-[380px]">
              Sorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>

          {/* Texte du bas - visible sur desktop en bas, stacké sur mobile */}
          <div className="mt-16 lg:mt-auto">
            <span className="text-[16px] font-bold tracking-tight text-black">
              Consectetur adipiscing elit.
            </span>
          </div>
        </div>

        {/* COLONNE DROITE */}
        <div className="lg:col-span-7 flex flex-col">
          
          {/* Grille de points (01, 02, etc.) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 mb-16">
            {features.map((item) => (
              <div key={item.id} className="flex items-start gap-4">
                <span className="text-[32px] md:text-[40px] font-bold text-[#949494] leading-none">
                  {item.id}
                </span>
                <p className="text-[14px] font-semibold leading-snug text-black pt-1">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* Conteneur de l'image */}
          <div className="relative w-full aspect-[16/9] lg:aspect-auto lg:h-[400px] overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop"
              alt="Chambre moderne au design épuré"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default LastSection;