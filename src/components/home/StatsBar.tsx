import { useEffect, useState, useRef } from 'react';

interface StatItem {
  value: string;
  label: string;
}

interface StatsBarProps {
  stats: StatItem[];
}

const StatsBar = ({ stats }: StatsBarProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<string[]>([]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRefs = useRef<number[]>([]);
  const hasTriggeredAnimation = useRef(false); // Pour éviter de redémarrer l'animation

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Initialiser les valeurs animées
    const initialValues = stats.map(stat => {
      // Extraire le préfixe (+, %, etc.) et le suffixe (K, M, etc.)
      const match = stat.value.match(/^([^0-9]*)([\d,.]+)([^0-9]*)$/);
      
      if (match) {
        const [, prefix, numberStr, suffix] = match;
        return `${prefix}0${suffix}`; // Commence à 0 avec préfixe/suffixe
      }
      
      return stat.value;
    });
    setAnimatedValues(initialValues);

    return () => {
      clearTimeout(timer);
      // Nettoyer les animations
      animationRefs.current.forEach(id => cancelAnimationFrame(id));
      animationRefs.current = [];
    };
  }, [stats]);

  // Fonction pour démarrer les animations
  const startNumberAnimations = () => {
    if (hasTriggeredAnimation.current) return;
    hasTriggeredAnimation.current = true;
    
    setHasAnimated(true);
    
    stats.forEach((stat, index) => {
      // Analyser la valeur pour extraire préfixe, nombre et suffixe
      const match = stat.value.match(/^([^0-9]*)([\d,.]+)([^0-9]*)$/);
      
      if (match) {
        const [, prefix, numberStr, suffix] = match;
        
        // Convertir le suffixe en multiplicateur
        let multiplier = 1;
        let displaySuffix = suffix;
        
        if (suffix.toLowerCase().includes('k')) {
          multiplier = 1000;
          displaySuffix = suffix.replace(/k/gi, ''); // Retirer le K pour le calcul
        }
        
        // Nettoyer le nombre (supprimer les virgules)
        const cleanNumberStr = numberStr.replace(/,/g, '');
        const numericValue = parseFloat(cleanNumberStr) * multiplier;
        
        const duration = 2000;
        const startTime = Date.now();
        const startValue = 0;
        
        const animate = () => {
          const currentTime = Date.now();
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          const currentValue = Math.floor(startValue + (numericValue - startValue) * easeOutQuart);
          
          // Formater la valeur affichée
          let displayValue = currentValue.toString();
          
          // Appliquer le suffixe K si nécessaire
          if (multiplier === 1000 && currentValue >= 1000) {
            displayValue = (currentValue / 1000).toFixed(1).replace('.0', '');
            displaySuffix = suffix; // Rétablir le suffixe original
          }
          
          // Ajouter le préfixe et le suffixe
          const formattedValue = `${prefix}${displayValue}${displaySuffix}`;
          
          setAnimatedValues(prev => {
            const newValues = [...prev];
            newValues[index] = formattedValue;
            return newValues;
          });
          
          if (progress < 1) {
            const animationId = requestAnimationFrame(animate);
            animationRefs.current[index] = animationId;
          } else {
            // Quand l'animation est terminée, s'assurer qu'on a la valeur finale exacte
            setAnimatedValues(prev => {
              const newValues = [...prev];
              newValues[index] = stat.value;
              return newValues;
            });
          }
        };
        
        // Démarrer l'animation avec un délai décalé pour chaque élément
        setTimeout(() => {
          const animationId = requestAnimationFrame(animate);
          animationRefs.current[index] = animationId;
        }, index * 150);
      } else {
        // Pour les valeurs non numériques (comme "100%"), on les affiche directement
        setAnimatedValues(prev => {
          const newValues = [...prev];
          newValues[index] = stat.value;
          return newValues;
        });
      }
    });
  };

  // Animation au scroll - version améliorée avec seuil plus précis
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || hasTriggeredAnimation.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Déclencher l'animation quand la section est visible à 40% de la fenêtre
      const triggerPoint = windowHeight * 0.6; // 60% du haut de la fenêtre
      
      if (rect.top < triggerPoint && rect.bottom > 0) {
        setIsVisible(true);
        startNumberAnimations();
        
        // Retirer l'écouteur d'événement scroll après avoir déclenché l'animation
        window.removeEventListener('scroll', handleScroll);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasTriggeredAnimation.current) {
            setIsVisible(true);
            // Petit délai avant de démarrer l'animation pour un effet plus naturel
            setTimeout(() => {
              startNumberAnimations();
            }, 300);
          }
        });
      },
      {
        threshold: 0.3, // 30% de la section visible
        rootMargin: '-50px 0px -100px 0px' // Déclenche un peu avant d'arriver à l'élément
      }
    );

    // Double stratégie : IntersectionObserver pour la plupart des cas,
    // et écouteur scroll pour les navigateurs qui n'ont pas un bon support
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Déclencher aussi au chargement initial si l'élément est déjà visible
    setTimeout(() => {
      handleScroll();
    }, 500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="rounded-2xl py-8 px-6 md:px-12 max-w-4xl mx-auto shadow-2xl"
      style={{
        backgroundColor: 'hsl(0 0% 6%)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        transform: 'translateY(20px)',
        opacity: 0,
        animation: isVisible ? 'slideUpFadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'none',
        fontFamily: "'Montserrat', sans-serif"
      }}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="text-center"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
              transition: `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 100}ms, 
                         transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 100}ms`
            }}
          >
            <div className="relative inline-block mb-2">
              <span 
                className="text-3xl md:text-5xl font-bold"
                style={{
                  color: 'hsl(0 0% 100%)',
                  fontFamily: "'Montserrat', sans-serif",
                  display: 'inline-block',
                  minWidth: '50px'
                }}
              >
                {animatedValues[index] || stat.value}
              </span>
              <div 
                className="absolute -bottom-1 left-0 right-0 h-0.5"
                style={{
                  backgroundColor: 'hsl(340 100% 59%)',
                  transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: `transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${(index * 100) + 300}ms`
                }}
              />
            </div>
            <p 
              className="text-sm mt-3"
              style={{
                color: 'hsl(0 0% 65%)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                transition: `opacity 0.5s ease-out ${(index * 100) + 400}ms, 
                           transform 0.5s ease-out ${(index * 100) + 400}ms`,
                fontFamily: "'Montserrat', sans-serif"
              }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>
      
      <style jsx global>{`
        @keyframes slideUpFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        .hover-pulse:hover {
          animation: pulse 0.3s ease-in-out;
        }
      `}</style>
      
      <style jsx>{`
        .text-center:hover span {
          transform: scale(1.05);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default StatsBar;