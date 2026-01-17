const MarqueeSection = () => {
  // COHÉRENCE HERO : Même max-width et paddings extérieurs
  const gridContainer = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

  return (
    <section className="w-full bg-white py-6 md:py-10 font-montserrat">
      {/* WRAPPER DE LA GRILLE (Marges extérieures) */}
      <div className={gridContainer}>
        
        {/* INNER BOX (Le fond gris délimité comme le Footer/Destination) */}
        <div 
          className="rounded-sm overflow-hidden py-8 sm:py-12 lg:py-16"
          style={{
            backgroundColor: 'hsl(0 0% 98%)' // Gris cohérent avec le reste
          }}
        >
          {/* Conteneur de l'animation */}
          <div 
            className="whitespace-nowrap flex items-center gap-8 sm:gap-12 lg:gap-16 w-max"
            style={{
              animation: 'marquee-section 30s linear infinite'
            }}
          >
            {[...Array(10)].map((_, i) => (
              <span
                key={i}
                className="text-[40px] sm:text-[60px] lg:text-[80px] xl:text-[100px] font-bold tracking-tighter"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  color: 'hsla(0, 0%, 10%, 0.15)' // Plus subtil pour l'aspect luxe
                }}
              >
                Lorem ipsum dolor •
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <style>
        {`
          @keyframes marquee-section {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}
      </style>
    </section>
  );
};

export default MarqueeSection;