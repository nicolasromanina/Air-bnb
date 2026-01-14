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
    // Déclencher les animations après le chargement
    const timer = setTimeout(() => setIsVisible(true), 100);

    // Animation au scroll
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / window.innerHeight));
        setScrollProgress(progress);
      }
    };

    // Parallax avec mouvement de souris
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    // Animation de glitch aléatoire
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
      className="relative flex items-center justify-center pt-2 pb-8 sm:pb-12 md:pb-16 lg:pb-20 px-4 sm:px-6 md:px-8 overflow-hidden"
    >
      {/* Effet de particules subtiles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[1px] h-[1px] bg-[#FF1B7C] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-particle ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.3 + Math.random() * 0.4,
              transform: `scale(${0.5 + Math.random()})`,
            }}
          />
        ))}
      </div>

      {/* Conteneur principal */}
      <div className="max-w-[1440px] w-full mx-auto bg-white lg:bg-transparent p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 2xl:p-20 overflow-visible">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* ----- COLONNE GAUCHE (TEXTE & TÉMOIGNAGE) ----- */}
          <div className="flex flex-col justify-between h-full bg-white p-4 sm:p-6 md:p-8 lg:p-0 z-20 relative">
            {/* Effet de brillance sur le texte */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div 
                className="absolute w-64 h-64 bg-gradient-to-r from-[#FF1B7C]/10 to-transparent rounded-full blur-3xl"
                style={{
                  transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
                  transition: 'transform 0.3s ease-out'
                }}
              />
            </div>

            <div>
              <h1 className="text-[42px] xs:text-[48px] sm:text-[55px] md:text-[65px] lg:text-[75px] xl:text-[85px] 2xl:text-[95px] font-black leading-[0.9] tracking-tighter text-black mb-6 md:mb-8 uppercase overflow-hidden relative">
                <span 
                  className={`inline-block transition-all duration-700 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                  style={{
                    transform: isVisible ? 
                      `translateY(0) translateX(${mousePosition.x * 0.1}px)` : 
                      'translateY(8px)',
                    textShadow: `${mousePosition.x * 0.2}px ${mousePosition.y * 0.2}px 0 rgba(255,27,124,0.1)`
                  }}
                >
                  Lorem
                </span>
                <br />
                <span 
                  className={`inline-block transition-all duration-700 ease-out delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                  style={{
                    transform: isVisible ? 
                      `translateY(0) translateX(${mousePosition.x * 0.15}px)` : 
                      'translateY(8px)',
                    transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  Ipsum
                </span>
                <br />
                <span 
                  className={`inline-block transition-all duration-700 ease-out delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                  style={{
                    transform: isVisible ? 
                      `translateY(0) translateX(${mousePosition.x * 0.2}px)` : 
                      'translateY(8px)',
                    transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s'
                  }}
                >
                  Dolor Sit
                </span>
              </h1>
              <p 
                className={`text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed text-gray-800 mb-8 md:mb-10 max-w-full sm:max-w-[400px] md:max-w-[420px] font-medium transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                style={{
                  transform: isVisible ? 
                    `translateY(0) translateY(${scrollProgress * -20}px)` : 
                    'translateY(6px)'
                }}
              >
                Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
              </p>
              <button 
                className={`w-full sm:w-auto bg-[#FF1B7C] hover:bg-black text-white font-bold px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-[4px] uppercase transition-all duration-500 delay-400 ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-6 opacity-0 scale-95'} shadow-md hover:scale-105 active:scale-95 hover:shadow-lg text-sm sm:text-base relative overflow-hidden group`}
                style={{
                  transform: isVisible ? 
                    `translateY(0) scale(1) translateY(${scrollProgress * -10}px)` : 
                    'translateY(6px) scale(0.95)'
                }}
              >
                {/* Effet de brillance sur hover */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative z-10">Réserver</span>
              </button>
            </div>

            {/* BLOC TÉMOIGNAGE */}
            <div 
              className={`mt-12 md:mt-16 lg:mt-20 xl:mt-24 bg-white p-4 sm:p-5 rounded-xl inline-flex gap-4 sm:gap-5 items-center max-w-full sm:max-w-md shadow-sm border border-gray-100 transition-all duration-700 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'} hover:shadow-md hover:-translate-y-1 relative overflow-hidden group`}
              style={{
                transform: isVisible ? 
                  `translateX(0) translateY(${scrollProgress * -15}px)` : 
                  'translateX(-8px)'
              }}
            >
              {/* Effet de bordure animée */}
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF1B7C] via-transparent to-[#FF1B7C] opacity-0 group-hover:opacity-20 transition-opacity duration-500" 
                  style={{
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 2s infinite linear'
                  }}
                />
              </div>

              <div className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-[80px] md:h-[80px] bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative group/img">
                <img
                  src="https://images.pexels.com/photos/3777570/pexels-photo-3777570.jpeg?auto=compress&cs=tinysrgb&w=200"
                  alt="Client"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                  loading="lazy"
                  ref={el => imagesRef.current[0] = el}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[14px] sm:text-[15px] md:text-[16px] font-bold text-black mb-1 leading-tight break-words relative">
                  <span className="relative inline-block">
                    Lorem ipsum dolor<br />sit amet
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#FF1B7C] group-hover:w-full transition-all duration-500"></span>
                  </span>
                </h3>
                <p className="text-[11px] sm:text-[12px] leading-snug text-gray-500 break-words">
                  Korem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            </div>
          </div>

          {/* ----- COLONNE DROITE (COLLAGE) ----- */}
          <div className="relative h-[400px] xs:h-[450px] sm:h-[500px] md:h-[550px] lg:h-[650px] xl:h-[700px] 2xl:h-[750px] w-full mt-8 lg:mt-0">
            
            {/* 1. Image Principale */}
            <div 
              className={`absolute top-0 left-[-5%] sm:left-[-6%] lg:left-[-8%] w-[60%] sm:w-[62%] md:w-[63%] lg:w-[65%] h-[45%] sm:h-[48%] md:h-[50%] lg:h-[52%] xl:h-[55%] z-20 shadow-xl sm:shadow-2xl group transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
              style={{
                transform: isVisible ? 
                  `translateY(0) translateX(${mousePosition.x * 0.3}px) translateY(${mousePosition.y * 0.3}px)` : 
                  'translateY(12px)',
                transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
              }}
            >
              <div className="relative w-full h-full overflow-hidden rounded-sm">
                <img 
                  src={imagePrincipale} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  alt="Intérieur principal"
                  loading="lazy"
                  ref={el => imagesRef.current[1] = el}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/0 via-black/0 to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>

            {/* 2. Grand Carré Rose - Animation modifiée pour rester carré */}
            <div 
              className={`absolute top-[15%] sm:top-[16%] md:top-[17%] lg:top-[18%] right-[10%] sm:right-[12%] md:right-[13%] lg:right-[15%] w-[22%] sm:w-[23%] md:w-[24%] lg:w-[25%] aspect-square bg-[#FF1B7C] z-10 shadow-lg transition-all duration-1000 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
              style={{
                animation: 'pulse-glow 3s ease-in-out infinite, float-slow 6s ease-in-out infinite',
                transform: isVisible ? 
                  `translateY(0) rotate(${scrollProgress * 10}deg)` : 
                  'translateY(12px)',
                borderRadius: '4px' // Assurer qu'il reste carré
              }}
            ></div>

            {/* 3. Image Grise (TV) */}
            <div 
              className={`absolute top-[35%] sm:top-[37%] md:top-[38%] lg:top-[40%] right-[-15%] sm:right-[-18%] md:right-[-20%] lg:right-[-22%] xl:right-[-25%] w-[55%] sm:w-[57%] md:w-[59%] lg:w-[61%] xl:w-[63%] h-[25%] sm:h-[27%] md:h-[28%] lg:h-[29%] xl:h-[30%] z-30 shadow-xl sm:shadow-2xl group transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
              style={{
                transform: isVisible ? 
                  `translateY(0) translateX(${mousePosition.x * 0.2}px) translateY(${mousePosition.y * 0.2}px)` : 
                  'translateY(12px)',
                transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0.1s'
              }}
            >
              <div className="relative w-full h-full overflow-hidden rounded-sm">
                <img 
                  src={imageGrise} 
                  className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                  alt="Espace TV"
                  loading="lazy"
                  ref={el => imagesRef.current[2] = el}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {/* Effet de scan TV */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    animation: 'scan 2s linear infinite',
                    animationPlayState: 'paused'
                  }}
                />
              </div>
            </div>

            {/* 4. Petit Carré Rose */}
            <div 
              className={`absolute bottom-[10%] sm:bottom-[12%] md:bottom-[13%] lg:bottom-[14%] left-0 w-[8%] sm:w-[9%] md:w-[9.5%] lg:w-[10%] aspect-square bg-[#FF1B7C] z-10 shadow-lg transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
              style={{
                animation: 'bounce 4s ease-in-out infinite',
                transform: isVisible ? 
                  `translateY(0) translateY(${scrollProgress * 30}px)` : 
                  'translateY(12px)',
              }}
            ></div>

            {/* 5. Image Lit */}
            <div 
              className={`absolute bottom-[3%] sm:bottom-[4%] md:bottom-[4.5%] lg:bottom-[5%] right-[35%] sm:right-[37%] md:right-[38%] lg:right-[39%] xl:right-[40%] w-[42%] sm:w-[44%] md:w-[45%] lg:w-[46%] xl:w-[48%] h-[32%] sm:h-[34%] md:h-[35%] lg:h-[36%] xl:h-[38%] z-40 shadow-xl sm:shadow-2xl group transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
              style={{
                transform: isVisible ? 
                  `translateY(0) translateX(${mousePosition.x * 0.25}px) translateY(${mousePosition.y * 0.25}px)` : 
                  'translateY(12px)',
                transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0.2s'
              }}
            >
              <div className="relative w-full h-full overflow-hidden rounded-sm">
                <img 
                  src={imageLit} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  alt="Chambre"
                  loading="lazy"
                  ref={el => imagesRef.current[3] = el}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Style pour les animations CSS avancées */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-particle {
          0%, 100% { 
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          25% { 
            transform: translateY(-10px) translateX(5px);
            opacity: 0.6;
          }
          50% { 
            transform: translateY(-20px) translateX(-5px);
            opacity: 0.3;
          }
          75% { 
            transform: translateY(-10px) translateX(5px);
            opacity: 0.6;
          }
        }
        
        /* Nouvelle animation pour le grand carré rose - reste carré */
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(255, 27, 124, 0.5),
                       0 0 40px rgba(255, 27, 124, 0.3),
                       0 0 60px rgba(255, 27, 124, 0.1);
            opacity: 1;
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 30px rgba(255, 27, 124, 0.7),
                       0 0 50px rgba(255, 27, 124, 0.5),
                       0 0 70px rgba(255, 27, 124, 0.3);
            opacity: 0.9;
            transform: scale(1.05);
          }
        }
        
        @keyframes float-slow {
          0%, 100% { 
            transform: translateY(0) rotate(0deg);
          }
          25% { 
            transform: translateY(-8px) rotate(2deg);
          }
          50% { 
            transform: translateY(-15px) rotate(0deg);
          }
          75% { 
            transform: translateY(-8px) rotate(-2deg);
          }
        }
        
        @keyframes bounce {
          0%, 100% { 
            transform: translateY(0);
          }
          50% { 
            transform: translateY(-20px);
          }
        }
        
        @keyframes rotate {
          from { 
            transform: rotate(0deg); 
          }
          to { 
            transform: rotate(360deg); 
          }
        }
        
        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-pulse-slower {
          animation: pulse-slower 5s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        /* Améliorations responsive */
        @media (max-width: 640px) {
          .overflow-visible {
            overflow: visible;
          }
          
          /* Réduire les animations sur mobile pour les performances */
          * {
            animation-duration: 1.5s !important;
          }
        }
        
        /* Pour très petits écrans */
        @media (max-width: 380px) {
          .text-\[42px\] {
            font-size: 36px;
          }
          .h-\[400px\] {
            height: 350px;
          }
        }
        
        /* Pour les très grands écrans */
        @media (min-width: 1920px) {
          .max-w-\[1440px\] {
            max-width: 1600px;
          }
        }
        
        /* Désactiver certaines animations si l'utilisateur préfère réduire les motions */
        @media (prefers-reduced-motion: reduce) {
          *, ::before, ::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* Optimisation des performances */
        .transition-transform {
          will-change: transform;
          backface-visibility: hidden;
          transform: translateZ(0);
        }
        
        /* Amélioration du rendu des animations */
        .shadow-lg, .shadow-xl, .shadow-2xl {
          will-change: box-shadow, transform;
        }
      `}</style>
    </section>
  );
}

export default HeroSection;