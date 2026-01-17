const MarqueeBlackSection = () => {
  // COHÉRENCE GRID : Toujours aligné sur le max-width du site
  const gridContainer = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

  return (
    <section className="w-full bg-white py-6 md:py-10 font-montserrat">
      {/* WRAPPER DE LA GRILLE */}
      <div className={gridContainer}>
        
        {/* INNER BOX : Fond gris identique aux autres sections */}
        <div 
          className="rounded-sm overflow-hidden py-10 sm:py-14 lg:py-20 shadow-inner"
          style={{
            backgroundColor: 'hsl(0, 0%, 100%)' // Gris secondaire cohérent
          }}
        >
          <div className="whitespace-nowrap flex items-center gap-12 sm:gap-16 lg:gap-24 animate-marquee hover:pause">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="text-[48px] sm:text-[72px] lg:text-[96px] xl:text-[115px] font-black tracking-tighter inline-block transition-transform duration-500 hover:scale-105"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  color: '#1a1a1a', // Noir profond
                  // Reveal effect subtil au chargement
                  animation: `reveal-text 1s cubic-bezier(0.2, 1, 0.3, 1) ${i * 0.1}s both`
                }}
              >
                Lorem ipsum dolor <span className="ml-8 text-[#FF1B7C]">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style>
        {`
          @keyframes reveal-text {
            0% {
              opacity: 0;
              transform: translateY(30px) skewY(2deg);
            }
            100% {
              opacity: 1;
              transform: translateY(0) skewY(0);
            }
          }
          
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          
          .animate-marquee {
            display: flex;
            width: max-content;
            animation: marquee 40s linear infinite;
          }

          .hover\\:pause:hover {
            animation-play-state: paused;
          }

          /* Optimisation pour des mouvements fluides */
          .animate-marquee div {
            will-change: transform;
          }
        `}
      </style>
    </section>
  );
};

export default MarqueeBlackSection;