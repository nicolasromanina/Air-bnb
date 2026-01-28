import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import UserMenu from "./UserMenu";

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  // COHÉRENCE GRID : Responsive padding optimisé
  const gridContainer = "max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20";

  const navLinks = [
    { label: "À propos", href: "/", sectionId: "apropos" },
    { label: "Services", href: "/services" },
    { label: "Nos appartements", href: "/appartement" },
    { label: "Contact", href: "/contact" },
  ];

  // Gestion du scroll optimisée
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Gestion de la visibilité
      if (currentScrollY < lastScrollY || currentScrollY < 10 || isOpen) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      // Gestion du style au scroll
      setIsScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isOpen]);

  // Fermer le menu mobile quand la fenêtre est redimensionnée
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  const handleNavClick = (href, sectionId = null) => {
    if (href === "/" && sectionId) {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          window.scrollTo({ 
            top: element.offsetTop - 100, 
            behavior: 'smooth' 
          });
        }
      }, 100);
    } else {
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const isLinkActive = (href, sectionId = null) => {
    if (sectionId && location.pathname === "/" && location.hash === `#${sectionId}`) {
      return true;
    }
    return location.pathname === href;
  };

  return (
    <>
      <nav 
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[1000] w-full transition-all duration-500 ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        } ${
          isScrolled 
            ? "bg-white/95 backdrop-blur-md shadow-lg py-3" 
            : "bg-white py-4 md:py-6 lg:py-8 md:bg-transparent"
        }`}
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <div className={gridContainer}>
          <div className="flex items-center justify-between">
            
            {/* Logo avec animation au scroll */}
            <div className="z-50">
              <button 
                onClick={() => handleNavClick("/")}
                className="block focus:outline-none focus:ring-2 focus:ring-[#FF1B7C] rounded-sm"
                aria-label="Retour à l'accueil"
              >
                <img 
                  src="./Logo.png" 
                  alt="Logo" 
                  className={`h-7 sm:h-8 md:h-10 lg:h-12 w-auto transition-all duration-300 ${
                    isScrolled ? "md:h-9 lg:h-10" : ""
                  }`}
                />
              </button>
            </div>

            {/* Navigation Desktop */}
            <div className="hidden md:flex items-center justify-center flex-1 px-8 lg:px-16">
              <div className="flex items-center gap-4 lg:gap-8 xl:gap-12">
                {navLinks.map((link, index) => {
                  const active = isLinkActive(link.href, link.sectionId);
                  return (
                    <button
                      key={link.label}
                      onClick={() => handleNavClick(link.href, link.sectionId)}
                      onMouseEnter={() => setHoveredLink(index)}
                      onMouseLeave={() => setHoveredLink(null)}
                      className={`relative py-2 px-1 text-xs lg:text-sm xl:text-base font-bold tracking-wider transition-all duration-300 ${
                        active 
                          ? "text-[#FF1B7C]" 
                          : "text-gray-800 hover:text-[#FF1B7C]"
                      }`}
                      aria-current={active ? "page" : undefined}
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {link.label}
                      <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#FF1B7C] transition-all duration-500 ${
                        active || hoveredLink === index 
                          ? 'w-full opacity-100' 
                          : 'w-0 opacity-0'
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA Button Desktop */}
            <div className="hidden md:flex items-center gap-4 z-50">
              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <button 
                  onClick={() => handleNavClick("/appartement")}
                  className="bg-[#FF1B7C] text-white px-6 lg:px-8 py-2.5 lg:py-3 rounded-sm font-bold text-xs lg:text-sm tracking-wider hover:bg-[#e0176d] active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#FF1B7C] focus:ring-offset-2"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Réserver maintenant
                </button>
              )}
            </div>

            {/* Bouton Menu Mobile */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="md:hidden text-gray-800 p-2 z-50 focus:outline-none focus:ring-2 focus:ring-[#FF1B7C] rounded-sm"
              aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isOpen}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {isOpen ? (
                <X size={28} className="text-gray-800" />
              ) : (
                <Menu size={28} className="text-gray-800" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay de fond pour mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/30 z-[999] backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Menu Mobile */}
      <div 
        className={`md:hidden fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-[1000] transition-all duration-500 ease-in-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } shadow-2xl`}
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        {/* En-tête du menu mobile */}
        <div className="flex items-center justify-between p-6 border-b">
          <img 
            src="./Logo.png" 
            alt="Logo" 
            className="h-8 w-auto"
          />
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-800 p-2 focus:outline-none focus:ring-2 focus:ring-[#FF1B7C] rounded-sm"
            aria-label="Fermer le menu"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Liens du menu mobile */}
        <div className="flex flex-col h-[calc(100%-80px)] justify-between p-6">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href, link.sectionId);
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href, link.sectionId)}
                  className={`text-left py-4 px-4 text-lg font-bold tracking-tight rounded-lg transition-all duration-300 ${
                    active 
                      ? "bg-[#FF1B7C] text-white" 
                      : "text-gray-800 hover:bg-gray-100 active:bg-gray-200"
                  }`}
                  aria-current={active ? "page" : undefined}
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Bouton CTA Mobile */}
          <div className="pt-6 border-t">
            {isAuthenticated ? (
              <>
                <button 
                  onClick={() => {
                    handleNavClick("/reservations");
                    setIsOpen(false);
                  }}
                  className="w-full bg-[#FF1B7C] text-white py-4 rounded-sm font-bold tracking-wider text-lg hover:bg-[#e0176d] active:scale-[0.98] transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B7C] focus:ring-offset-2 mb-3"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Mes réservations
                </button>
                <button 
                  onClick={() => {
                    navigate("/auth");
                    setIsOpen(false);
                  }}
                  className="w-full bg-gray-200 text-gray-800 py-3 rounded-sm font-bold tracking-wider text-base hover:bg-gray-300 transition-all duration-300"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <button 
                onClick={() => handleNavClick("/contact")}
                className="w-full bg-[#FF1B7C] text-white py-4 rounded-sm font-bold tracking-wider text-lg hover:bg-[#e0176d] active:scale-[0.98] transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B7C] focus:ring-offset-2"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Réserver maintenant
              </button>
            )}
            
            {/* Contact info supplémentaire pour mobile */}
            <div className="mt-6 text-sm text-gray-600 text-center">
              <p className="font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Disponible 7j/7
              </p>
              <p className="mt-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                contact@example.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Espace réservé pour éviter que le contenu soit caché */}
      <div 
        className={`w-full transition-all duration-500 ${
          isScrolled ? "h-[72px]" : "h-[88px] md:h-[104px] lg:h-[120px]"
        }`}
        aria-hidden="true"
      />
    </>
  );
};

export default Navbar;