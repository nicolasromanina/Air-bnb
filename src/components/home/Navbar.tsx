import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navRef = useRef(null);
  const buttonRef = useRef(null);
  const logoRef = useRef(null);

  const navLinks = [
    { label: "A propos", href: "#apropos" },
    { label: "Services", href: "#services" },
    { label: "Nos appartements", href: "#appartements" },
    { label: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    let ticking = false;
    let scrollTimeout = null;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Afficher la navbar seulement si:
          // 1. On scroll vers le haut (currentScrollY < lastScrollY)
          // 2. On est en haut de la page (currentScrollY < 10)
          // 3. Le menu mobile est ouvert
          if (
            currentScrollY < lastScrollY || 
            currentScrollY < 10 || 
            isOpen
          ) {
            setIsVisible(true);
          } 
          // Cacher la navbar si on scroll vers le bas et qu'on est assez bas
          else if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsVisible(false);
          }
          
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }

      // Clear previous timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Timeout pour remettre la navbar visible après un certain temps d'inactivité de scroll
      scrollTimeout = setTimeout(() => {
        setIsVisible(true);
      }, 1500); // Réapparaît après 1.5 seconde d'inactivité
    };

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      setMousePosition({ x: clientX, y: clientY });
      
      // Si la souris est près du haut de la page, afficher la navbar
      if (clientY < 100) {
        setIsVisible(true);
      }
    };

    // Animation de pulsation pour le bouton
    const buttonPulseInterval = setInterval(() => {
      if (buttonRef.current && !isOpen) {
        buttonRef.current.style.boxShadow = `0 0 0 0 rgba(255, 27, 124, 0.7)`;
        setTimeout(() => {
          if (buttonRef.current) {
            buttonRef.current.style.boxShadow = `0 0 20px 10px rgba(255, 27, 124, 0)`;
          }
        }, 600);
      }
    }, 4000);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);
    
    // Écouter l'événement mouseenter près du haut de la page
    const handleMouseEnterTop = () => setIsVisible(true);
    const topArea = document.createElement('div');
    topArea.style.position = 'fixed';
    topArea.style.top = '0';
    topArea.style.left = '0';
    topArea.style.right = '0';
    topArea.style.height = '50px';
    topArea.style.zIndex = '49';
    topArea.style.pointerEvents = 'none';
    document.body.appendChild(topArea);
    
    // Créer une zone invisible en haut pour déclencher le mouseenter
    const triggerArea = document.createElement('div');
    triggerArea.style.position = 'fixed';
    triggerArea.style.top = '0';
    triggerArea.style.left = '0';
    triggerArea.style.right = '0';
    triggerArea.style.height = '5px';
    triggerArea.style.zIndex = '49';
    triggerArea.addEventListener('mouseenter', handleMouseEnterTop);
    document.body.appendChild(triggerArea);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(buttonPulseInterval);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      document.body.removeChild(triggerArea);
      document.body.removeChild(topArea);
      triggerArea.removeEventListener('mouseenter', handleMouseEnterTop);
    };
  }, [lastScrollY, isOpen]);

  // Fonction pour gérer la fermeture du menu mobile
  const handleMenuClose = () => {
    setIsOpen(false);
  };

  return (
    <nav 
      ref={navRef}
      className={`w-full py-4 px-4 md:px-8 lg:px-12 fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isVisible 
          ? "translate-y-0 opacity-100" 
          : "-translate-y-full opacity-0 pointer-events-none"
      } ${
        window.scrollY > 20 
          ? "bg-white/95 backdrop-blur-md shadow-lg" 
          : "bg-white lg:bg-transparent"
      }`}
      style={{
        transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
      }}
    >
      {/* Effet de particules subtiles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[1px] h-[1px] bg-[#FF1B7C] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-nav ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: window.scrollY > 20 ? 0.2 : 0.1,
              transform: `scale(${0.3 + Math.random() * 0.7})`,
            }}
          />
        ))}
      </div>

      <div className="max-w-[1440px] mx-auto flex items-center justify-between relative">
        {/* Logo avec animation */}
        <div 
          ref={logoRef}
          className="flex items-center gap-2 group"
          style={{
            transform: `translateX(${mousePosition.x * 0.01}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        >
          <div className="relative overflow-hidden rounded-lg">
            <img 
              src="./Logo.png" 
              alt="SWEETHOME Logo" 
              className="h-8 w-auto transition-transform duration-700 group-hover:scale-110"
              style={{
                filter: window.scrollY > 20 ? 'none' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
              }}
            />
            {/* Effet de brillance sur hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </div>
        </div>

        {/* Desktop Navigation avec animations */}
        <div className="hidden md:flex items-center gap-8 relative">
          {/* Effet de souris suiveur */}
          <div 
            className="absolute w-24 h-8 bg-[#FF1B7C]/10 rounded-full blur-xl transition-all duration-300 pointer-events-none"
            style={{
              opacity: hoveredLink !== null ? 0.5 : 0,
              transform: hoveredLink !== null 
                ? `translateX(${hoveredLink * 80}px) scale(1)` 
                : `translateX(${mousePosition.x * 0.02}px) scale(0)`,
              left: 0,
            }}
          />
          
          {navLinks.map((link, index) => (
            <a 
              key={link.label} 
              href={link.href} 
              className="relative text-black hover:text-[#FF1B7C] transition-all duration-300 text-sm font-semibold group/nav-link"
              onMouseEnter={() => setHoveredLink(index)}
              onMouseLeave={() => setHoveredLink(null)}
              style={{
                transform: `translateY(${window.scrollY > 20 ? 0 : mousePosition.y * -0.005}px)`,
                textShadow: hoveredLink === index 
                  ? `0 0 10px rgba(255, 27, 124, 0.3)`
                  : 'none'
              }}
              onClick={() => setIsVisible(true)}
            >
              <span className="relative z-10">{link.label}</span>
              
              {/* Ligne animée sous le lien */}
              <span 
                className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#FF1B7C] group-hover/nav-link:w-full transition-all duration-500"
                style={{
                  width: hoveredLink === index ? '100%' : '0%',
                  boxShadow: hoveredLink === index 
                    ? '0 0 10px rgba(255, 27, 124, 0.5)'
                    : 'none'
                }}
              />
              
              {/* Effet de halo au hover */}
              <span className="absolute inset-0 rounded-lg bg-[#FF1B7C]/5 scale-0 group-hover/nav-link:scale-100 transition-transform duration-300 -z-10"></span>
            </a>
          ))}
        </div>

        {/* CTA Button avec animations avancées */}
        <button 
          ref={buttonRef}
          className="hidden md:block bg-[#FF1B7C] text-white px-6 py-2.5 rounded-full font-bold hover:bg-black transition-all duration-500 text-sm relative overflow-hidden group/button"
          style={{
            transform: window.scrollY > 20 
              ? 'scale(1)' 
              : `scale(${1 + mousePosition.y * 0.0001})`,
            boxShadow: window.scrollY > 20
              ? '0 4px 20px rgba(255, 27, 124, 0.3)'
              : '0 8px 30px rgba(255, 27, 124, 0.4)',
            animation: 'button-pulse 4s ease-in-out infinite'
          }}
          onClick={() => setIsVisible(true)}
        >
          {/* Effet de brillance */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover/button:translate-x-[100%] transition-transform duration-1000"></span>
          
          {/* Particules animées */}
          <span className="absolute inset-0 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${15 + i * 20}%`,
                  top: '50%',
                  animation: `button-particle ${1.5 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                  opacity: 0.6,
                }}
              />
            ))}
          </span>
          
          <span className="relative z-10">Réserver maintenant</span>
        </button>

        {/* Mobile Menu Button avec animation */}
        <button 
          onClick={() => {
            setIsOpen(!isOpen);
            setIsVisible(true); // Toujours afficher la navbar quand on ouvre le menu
          }} 
          className="md:hidden text-black relative group/menu"
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {/* Animation du bouton */}
          <div className="relative w-6 h-6">
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              isOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'
            }`}>
              <Menu 
                size={24} 
                className="transition-all duration-300 group-hover/menu:scale-110 group-hover/menu:text-[#FF1B7C]" 
              />
            </div>
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              isOpen ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'
            }`}>
              <X 
                size={24} 
                className="transition-all duration-300 group-hover/menu:scale-110 group-hover/menu:text-[#FF1B7C]" 
              />
            </div>
          </div>
          
          {/* Animation du cercle */}
          <span className="absolute -inset-2 rounded-full bg-[#FF1B7C]/10 scale-0 group-hover/menu:scale-100 transition-transform duration-300 -z-10"></span>
        </button>
      </div>

      {/* Mobile Menu avec animations */}
      <div 
        className={`md:hidden absolute left-0 w-full bg-white z-40 shadow-2xl transition-all duration-700 overflow-hidden ${
          isOpen 
            ? "top-full opacity-100 translate-y-0" 
            : "top-0 opacity-0 -translate-y-10"
        }`}
        style={{
          maxHeight: isOpen ? '400px' : '0',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        {/* Fond animé du menu mobile */}
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50/80"></div>
        
        {/* Effet de vague animée */}
        <div 
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF1B7C] to-transparent"
          style={{
            animation: 'wave 2s linear infinite',
            backgroundSize: '200% 100%',
          }}
        />

        <div className="relative z-10 flex flex-col gap-1 p-4">
          {navLinks.map((link, index) => (
            <a 
              key={link.label} 
              href={link.href} 
              className="relative text-black font-medium py-3 px-4 rounded-lg hover:bg-[#FF1B7C]/5 transition-all duration-500 group/mobile-link"
              onClick={handleMenuClose}
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'forwards',
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'translateX(0)' : 'translateX(-20px)',
                animation: isOpen ? 'slideInRight 0.5s ease-out' : 'none',
              }}
            >
              <span className="relative z-10 flex items-center">
                {/* Icône animée */}
                <span 
                  className="w-2 h-2 bg-[#FF1B7C] rounded-full mr-3 transition-all duration-300 group-hover/mobile-link:scale-150 group-hover/mobile-link:mr-4"
                  style={{
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'scale(1)' : 'scale(0)',
                    animation: isOpen ? 'bounce 0.6s ease-out' : 'none',
                    animationDelay: `${index * 100 + 200}ms`,
                  }}
                />
                {link.label}
              </span>
              
              {/* Effet de fond au hover */}
              <span className="absolute inset-0 bg-gradient-to-r from-[#FF1B7C]/5 to-transparent rounded-lg scale-x-0 group-hover/mobile-link:scale-x-100 transition-transform duration-500 origin-left -z-10"></span>
              
              {/* Ligne animée */}
              <span className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent"></span>
            </a>
          ))}
          
          {/* Bouton dans le menu mobile */}
          <button 
            className="mt-4 bg-[#FF1B7C] text-white px-6 py-3 rounded-full font-bold hover:bg-black transition-all duration-500 text-sm relative overflow-hidden group/mobile-button"
            onClick={handleMenuClose}
            style={{
              animationDelay: `${navLinks.length * 100}ms`,
              animation: isOpen ? 'slideInUp 0.5s ease-out' : 'none',
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            {/* Effet de brillance */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/mobile-button:translate-x-[100%] transition-transform duration-1000"></span>
            <span className="relative z-10">Réserver maintenant</span>
          </button>
        </div>
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes float-nav {
          0%, 100% { 
            transform: translateY(0) translateX(0);
            opacity: 0.1;
          }
          25% { 
            transform: translateY(-5px) translateX(3px);
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-10px) translateX(-3px);
            opacity: 0.1;
          }
          75% { 
            transform: translateY(-5px) translateX(3px);
            opacity: 0.3;
          }
        }

        @keyframes button-pulse {
          0%, 100% { 
            box-shadow: 0 4px 20px rgba(255, 27, 124, 0.3);
          }
          50% { 
            box-shadow: 0 4px 30px rgba(255, 27, 124, 0.5);
          }
        }

        @keyframes button-particle {
          0%, 100% { 
            transform: translateY(-50%) translateX(0) scale(1);
            opacity: 0;
          }
          50% { 
            transform: translateY(-50%) translateX(40px) scale(1.2);
            opacity: 0.8;
          }
        }

        @keyframes wave {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%, 100% { 
            transform: scale(1);
          }
          50% { 
            transform: scale(1.2);
          }
        }

        /* Pour réduire les animations si l'utilisateur préfère */
        @media (prefers-reduced-motion: reduce) {
          *, ::before, ::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Optimisations de performance */
        .transition-transform {
          will-change: transform;
          backface-visibility: hidden;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;