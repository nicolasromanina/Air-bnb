import { useEffect, useState, useRef, useCallback } from "react";
import "./ScrollToTopButton.css";

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const toggleVisibility = useCallback(() => {
    const scrolled = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0;
    
    setIsVisible(scrolled > 300);
    setScrollProgress(progress);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };
  
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility(); // Vérifier l'état initial
    
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [toggleVisibility]);
  
  // Animation de particules au clic
  const createParticles = () => {
    if (!buttonRef.current) return;
    
    const button = buttonRef.current;
    const particleCount = 12;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      
      // Position aléatoire par rapport au bouton
      const angle = (Math.PI * 2 * i) / particleCount;
      const size = Math.random() * 4 + 2;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = `hsl(${Math.random() * 60 + 300}, 100%, 65%)`;
      particle.style.borderRadius = "50%";
      particle.style.position = "absolute";
      particle.style.left = "50%";
      particle.style.top = "50%";
      particle.style.zIndex = "-1";
      
      // Animation
      const animation = particle.animate([
        { 
          transform: `translate(-50%, -50%) rotate(${angle}rad) translate(0)`, 
          opacity: 1 
        },
        { 
          transform: `translate(-50%, -50%) rotate(${angle}rad) translate(${Math.random() * 30 + 20}px)`, 
          opacity: 0 
        }
      ], {
        duration: 600 + Math.random() * 400,
        easing: "cubic-bezier(0.2, 0.8, 0.3, 1)"
      });
      
      button.appendChild(particle);
      
      // Supprimer la particule après l'animation
      animation.onfinish = () => {
        if (button.contains(particle)) {
          button.removeChild(particle);
        }
      };
    }
  };
  
  const handleClick = () => {
    createParticles();
    scrollToTop();
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        aria-label="Retour en haut de la page"
        className={`scroll-to-top ${isVisible ? "visible" : ""} ${isHovered ? "hovered" : ""}`}
      >
        {/* Conteneur pour l'icône et le progress */}
        <div className="scroll-to-top-content">
          {/* SVG avec flèche animée */}
          <svg 
            className="scroll-to-top-arrow" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 5L12 19M12 5L6 11M12 5L18 11" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          
          {/* Cercle de progression */}
          <svg className="scroll-progress-circle" viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              className="progress-circle-bg"
            />
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              className="progress-circle"
              style={{ strokeDashoffset: 283 - (283 * scrollProgress) / 100 }}
            />
          </svg>
          
          {/* Élément de réflexion de lumière dynamique */}
          <div 
            className="light-reflection"
            style={{
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y}px`,
            }}
          />
        </div>
        
        {/* Badge avec pourcentage de défilement (optionnel) */}
        {isHovered && (
          <div className="scroll-percentage">
            {Math.round(scrollProgress)}%
          </div>
        )}
      </button>
      
      {/* Effet de particules flottantes (visibles lors du défilement) */}
      <div className="floating-particles">
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i} 
            className="floating-particle"
            style={{
              left: `${10 + i * 10}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default ScrollToTopButton;