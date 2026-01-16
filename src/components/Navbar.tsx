import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navRef = useRef(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  // COHÉRENCE GRID : Même max-width et paddings que vos sections Hero et Destination
  const gridContainer = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

  const navLinks = [
    { label: "À propos", href: "/", sectionId: "apropos" },
    { label: "Services", href: "/services" },
    { label: "Nos appartements", href: "/appartment" },
    { label: "Contact", href: "/contact" },
  ];

  // Gestion du scroll identique à votre logique actuelle
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY || currentScrollY < 10 || isOpen) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", (e) => setMousePosition({ x: e.clientX, y: e.clientY }));
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, isOpen]);

  const handleNavClick = (e, href, sectionId = null) => {
    e.preventDefault();
    if (href === "/" && sectionId) {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
      }, 100);
    } else {
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const isLinkActive = (href, sectionId = null) => {
    return location.pathname === href;
  };

  return (
    <nav 
      ref={navRef}
      className={`w-full fixed top-0 left-0 right-0 z-[100] transition-all duration-500 font-montserrat ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      } ${
        lastScrollY > 20 ? "bg-white/95 backdrop-blur-md shadow-sm py-3" : "bg-white py-5 md:bg-transparent"
      }`}
    >
      <div className={gridContainer}>
        <div className="flex items-center justify-between">
          
          {/* Logo - Aligné sur le bord gauche de la grille */}
          <div 
            className="z-50"
            style={{ 
              transform: `translateX(${mousePosition.x * 0.002}px)`, 
              transition: 'transform 0.4s ease-out' 
            }}
          >
            <a href="/" onClick={(e) => handleNavClick(e, "/")} className="block">
              <img 
                src="./Logo.png" 
                alt="Logo" 
                className="h-8 sm:h-10 w-auto"
              />
            </a>
          </div>

          {/* Desktop Links - Centrés ou à droite selon votre préférence */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            {navLinks.map((link, index) => (
              <a 
                key={link.label} 
                href={link.href} 
                className={`relative py-2 text-[13px] lg:text-[14px] font-bold  tracking-widest transition-colors duration-300 ${
                  isLinkActive(link.href) ? "text-[#FF1B7C]" : "text-black hover:text-[#FF1B7C]"
                }`}
                onMouseEnter={() => setHoveredLink(index)}
                onMouseLeave={() => setHoveredLink(null)}
                onClick={(e) => handleNavClick(e, link.href, link.sectionId)}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 h-[2px] bg-[#FF1B7C] transition-all duration-500 ${
                  isLinkActive(link.href) || hoveredLink === index ? 'w-full' : 'w-0'
                }`} />
              </a>
            ))}
          </div>

          {/* CTA Button - Aligné sur le bord droit de la grille */}
          <div className="flex items-center">
            <button 
              className="hidden md:block bg-primary text-white px-8 py-3 rounded-sm font-bold text-[12px] tracking-widest hover:bg-[#FF1B7C] transition-all duration-500 shadow-xl"
              onClick={() => navigate("/contact")}
            >
              Réserver maintenant
            </button>

            {/* Mobile Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="md:hidden text-black p-2 z-50"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden fixed inset-0 bg-white transition-all duration-500 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full justify-center items-center gap-8 p-10">
          {navLinks.map((link) => (
            <a 
              key={link.label} 
              href={link.href} 
              className="text-2xl font-black tracking-tighter"
              onClick={(e) => handleNavClick(e, link.href, link.sectionId)}
            >
              {link.label}
            </a>
          ))}
          <button 
            className="w-full bg-[#FF1B7C] text-white py-5 rounded-sm font-bold tracking-widest"
            onClick={() => {navigate("/contact"); setIsOpen(false);}}
          >
            Réserver maintenant
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;