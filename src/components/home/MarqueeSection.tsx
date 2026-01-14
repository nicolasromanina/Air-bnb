const MarqueeSection = () => {
  return (
    <section 
      className="w-full py-8 sm:py-10 lg:py-12 overflow-hidden"
      style={{
        backgroundColor: 'hsl(0 0% 96%)' // secondary color
      }}
    >
      <div 
        className="whitespace-nowrap flex items-center gap-8 sm:gap-12 lg:gap-16"
        style={{
          animation: 'marquee-section 30s linear infinite'
        }}
      >
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="text-[48px] sm:text-[72px] lg:text-[96px] xl:text-[120px] font-bold tracking-tight"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: 'hsla(0, 0%, 45%, 0.3)' // muted-foreground/30
            }}
          >
            Lorem ipsum dolor
          </span>
        ))}
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