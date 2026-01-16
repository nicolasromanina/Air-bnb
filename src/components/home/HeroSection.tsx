import React, { useEffect, useState, useRef } from 'react';
// Importation des images locales
import imagePrincipale from "@/assets/image-principale-hero.png";
import imageGrise from "@/assets/Image-Grise-hero.png";
import imageLit from "@/assets/Image-Lit-hero.png";

function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);
  const imagesRef = useRef([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);

    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / window.innerHeight));
        setScrollProgress(progress);
      }
    };

    const handleMouseMove = (e) => {
      if (window.matchMedia("(pointer: coarse)").matches) return;
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        imagesRef.current.forEach(img => {
          if (img && Math.random() > 0.7) {
            img.style.transform = `translateX(${(Math.random() - 0.5) * 4}px)`;
            setTimeout(() => {
              if (img) img.style.transform = 'translateX(0)';
            }, 100);
          }
        });
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(glitchInterval);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative flex items-center justify-center bg-white lg:bg-transparent min-h-screen overflow-hidden"
    >
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 hidden sm:block">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[1px] h-[1px] bg-[#FF1B7C] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-particle ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>

      {/* MAIN GRID CONTAINER */}
      <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20 py-12 md:py-20 lg:py-28 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          
          {/* ----- COLONNE GAUCHE (TEXTE) ----- */}
          <div className="flex flex-col justify-center relative text-left order-2 lg:order-1">
            <div 
              className="absolute -top-20 -left-20 w-64 h-64 bg-[#FF1B7C]/5 rounded-full blur-[100px] pointer-events-none hidden lg:block"
              style={{
                transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                transition: 'transform 0.3s ease-out'
              }}
            />

            <h1 className="text-[42px] xs:text-[50px] sm:text-[60px] md:text-[70px] lg:text-[75px] xl:text-[85px] 2xl:text-[100px] font-black leading-[0.85] tracking-tighter text-black mb-6 md:mb-8 uppercase">
              <span 
                className={`inline-block transition-all duration-700 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{ transform: isVisible ? `translateY(0) translateX(${mousePosition.x * 0.05}px)` : 'translateY(8px)' }}
              >
                Lorem
              </span>
              <br />
              <span 
                className={`inline-block transition-all duration-700 ease-out delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{ transform: isVisible ? `translateY(0) translateX(${mousePosition.x * 0.1}px)` : 'translateY(8px)' }}
              >
                Ipsum
              </span>
              <br />
              <span 
                className={`inline-block transition-all duration-700 ease-out delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{ transform: isVisible ? `translateY(0) translateX(${mousePosition.x * 0.15}px)` : 'translateY(8px)' }}
              >
                Dolor Sit
              </span>
            </h1>

            <p className={`text-base md:text-lg leading-relaxed text-gray-700 mb-8 md:mb-10 max-w-[460px] font-medium transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
              Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
            </p>

            <div className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <button className="w-full sm:w-auto bg-[#FF1B7C] hover:bg-black text-white font-bold px-10 py-4 rounded-[4px] transition-all duration-500 shadow-lg hover:shadow-[#FF1B7C]/20 relative overflow-hidden group">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative z-10">Réserver</span>
              </button>
            </div>

            {/* TESTIMONIAL BLOC */}
            <div 
              className={`mt-12 lg:mt-20 bg-white p-4 sm:p-5 rounded-xl inline-flex gap-4 sm:gap-5 items-center max-w-sm shadow-xl shadow-black/5 border border-gray-100 transition-all duration-700 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'} group`}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                <img
                  src="https://images.pexels.com/photos/3777570/pexels-photo-3777570.jpeg?auto=compress&cs=tinysrgb&w=200"
                  alt="Client"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  ref={el => imagesRef.current[0] = el}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-[15px] font-bold text-black mb-1 leading-tight">
                  Lorem ipsum dolor sit amet
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-500">
                  Korem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            </div>
          </div>

          {/* ----- COLONNE DROITE (COLLAGE) ----- */}
          {/* Ajout d'un padding-left important (lg:pl-12) pour laisser de la place au carré qui dépasse à gauche */}
          {/* ----- COLONNE DROITE (COLLAGE) ----- */}
            <div className="relative h-[400px] xs:h-[500px] sm:h-[600px] lg:h-[650px] w-full order-1 lg:order-2 lg:pl-12">
              
              {/* 1. Image Principale */}
              <div 
                className={`absolute top-0 
                  left-0 xl:left-[-22%] lg:left-[-12%] 
                  w-[80%] sm:w-[75%] h-[65%] z-20 shadow-2xl transition-all duration-1000 
                  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                style={{ transform: `translate3d(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px, 0)` }}
              >
                <div className="relative w-full h-full overflow-hidden rounded-sm">
                  <img src={imagePrincipale} className="w-full h-full object-cover" alt="Interior" />
                </div>
              </div>

              {/* 2. Grand Carré Rose */}
              <div 
                className="absolute top-[25%] right-[6%] lg:right-[15%] xl:right-[23%] w-[20%] aspect-square bg-[#FF1B7C] z-10 shadow-lg rounded-[4px]"
                style={{ 
                  animation: 'pulse-glow 3s infinite, float-slow 6s infinite',
                  transform: `rotate(${scrollProgress * 15}deg)`
                }}
              />

              {/* 3. Image Grise (TV) */}
              <div 
                className={`absolute top-[45%] right-0 w-[40%] lg:w-[45%] h-[28%] z-30 shadow-2xl transition-all duration-1000 delay-200 
                  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                style={{ transform: `translate3d(${mousePosition.x * 0.15}px, ${mousePosition.y * 0.15}px, 0)` }}
              >
                <div className="relative w-full h-full overflow-hidden rounded-sm group">
                  <img src={imageGrise} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="TV Area" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 animate-scan pointer-events-none" />
                </div>
              </div>

              {/* 4. LE PETIT CARRÉ ROSE (POSITION RÉPARÉE) */}
              <div 
                className={`absolute bottom-[3%] 
                  left-[5%] lg:left-[-10%] xl:left-[-20%] 
                  w-[12%] aspect-square bg-[#FF1B7C] z-[50] shadow-2xl rounded-sm animate-bounce 
                  ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
                style={{ 
                  boxShadow: '0 0 25px rgba(255, 27, 124, 0.6)',
                  animationDuration: '2.5s'
                }}
              />

              {/* 5. Image Lit */}
              <div 
                className={`absolute bottom-[-4%] 
                  left-[10%] lg:left-[-5%] xl:left-[2%] 
                  w-[55%] lg:w-[52%] h-[38%] z-40 shadow-2xl transition-all duration-1000 delay-400 
                  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                style={{ transform: `translate3d(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px, 0)` }}
              >
                <div className="relative w-full h-full overflow-hidden rounded-sm border-2 border-white/20">
                  <img src={imageLit} className="w-full h-full object-cover" alt="Bedroom" />
                </div>
              </div>
            </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 27, 124, 0.4); }
          50% { box-shadow: 0 0 40px rgba(255, 27, 124, 0.6); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan { animation: scan 3s linear infinite; }
        
        section { contain: paint; }
        img { will-change: transform; backface-visibility: hidden; }

        @media (max-width: 480px) {
          h1 { line-height: 0.9; }
        }
      `}</style>
    </section>
  );
}

export default HeroSection;