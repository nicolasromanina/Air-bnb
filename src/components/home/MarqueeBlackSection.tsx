const MarqueeBlackSection = () => {
  return (
    <section 
      className="w-full py-8 sm:py-10 lg:py-12 overflow-hidden"
      style={{
        backgroundColor: 'hsl(0 0% 96%)' // secondary color
      }}
    >
      <div className="whitespace-nowrap flex items-center gap-8 sm:gap-12 lg:gap-16 cursor-default animate-marquee">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="text-[40px] sm:text-[64px] lg:text-[88px] xl:text-[108px] font-bold tracking-tight transform transition-transform duration-300 hover:scale-105"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: 'black',
              animation: `reveal-text 0.8s ease-out ${i * 0.1}s both`
            }}
          >
            Lorem ipsum dolor
          </div>
        ))}
      </div>
      
      <style>
        {`
          .cursor-default {
            cursor: default;
          }
          
          @keyframes reveal-text {
            0% {
              opacity: 0;
              transform: translateY(15px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-33.33%);
            }
          }
          
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
          
          div > div {
            position: relative;
            will-change: transform;
          }
          
          div > div::after {
            content: attr(data-text);
            position: absolute;
            left: 0;
            top: 0;
            width: 0;
            overflow: hidden;
            white-space: nowrap;
            animation: typewriter 15s steps(30) infinite;
            color: black;
          }
          
          @keyframes typewriter {
            0% {
              width: 0;
            }
            50% {
              width: 100%;
            }
            100% {
              width: 100%;
            }
          }
          
          /* Pause animation on hover */
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}
      </style>
    </section>
  );
};

export default MarqueeBlackSection;