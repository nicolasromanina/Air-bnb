import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface ScrollContextType {
  scrollToDestination: () => void;
  setDestinationRef: (element: HTMLElement | null) => void;
  isScrollingToDestination: boolean;
  destinationRef: React.MutableRefObject<HTMLElement | null>;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const destinationRef = useRef<HTMLElement | null>(null);
  const [isScrollingToDestination, setIsScrollingToDestination] = useState(false);

  const setDestinationRef = useCallback((element: HTMLElement | null) => {
    destinationRef.current = element;
  }, []);

  const scrollToDestination = useCallback(() => {
    if (destinationRef.current) {
      setIsScrollingToDestination(true);
      
      // Calculer la position de scroll
      const navbar = document.querySelector('nav');
      const navbarHeight = navbar ? navbar.offsetHeight : 100;
      const elementPosition = destinationRef.current.offsetTop - navbarHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
      
      // Optionnel: Ajouter un effet visuel
      destinationRef.current.classList.add('highlight-section');
      setTimeout(() => {
        destinationRef.current?.classList.remove('highlight-section');
      }, 1500);
      
      // Focus sur le premier input après le scroll
      setTimeout(() => {
        const input = destinationRef.current?.querySelector('input');
        if (input) {
          input.focus({ preventScroll: true });
        }
        setIsScrollingToDestination(false);
      }, 800);
    }
  }, []);

  return (
    <ScrollContext.Provider value={{ 
      scrollToDestination, 
      setDestinationRef, 
      isScrollingToDestination,
      destinationRef
    }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
};