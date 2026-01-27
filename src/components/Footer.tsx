import React, { useState, useEffect } from 'react';
import { useFooterData } from '@/services/footerApi';

const Footer = () => {
  const { footerData, loading, fetchFooterData } = useFooterData();
  const gridContainer = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

  // Listen for updates from editor
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === 'footer_updated') {
        fetchFooterData();
      }
    };

    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('storage', handler);
    };
  }, [fetchFooterData]);

  if (loading || !footerData) {
    return (
      <footer className="w-full bg-white pb-12 text-black">
        <div className={gridContainer}>
          <div className="bg-[#E5E5E5] rounded-sm pt-20 overflow-hidden">
            <div className="px-8 md:px-12 lg:px-16">
              <div className="animate-pulse">
                <div className="h-10 bg-gray-300 rounded w-32 mx-auto mb-24"></div>
                <div className="border-t border-gray-300 mb-5"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-20">
                  {/* Gallery skeleton */}
                  <div className="grid grid-cols-2 gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="aspect-square bg-gray-300 rounded-sm"></div>
                    ))}
                  </div>
                  {/* Spacer */}
                  <div className="hidden lg:block" />
                  {/* Links skeleton */}
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="space-y-3">
                      <div className="h-4 bg-gray-300 rounded w-24"></div>
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="h-3 bg-gray-200 rounded w-32"></div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-300 mb-5"></div>
                <div className="py-20 lg:py-32">
                  <div className="h-12 bg-gray-300 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-white pb-12 text-black" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className={gridContainer}>
        <div className="bg-[#E5E5E5] rounded-sm pt-20 overflow-hidden">
          <div className="px-8 md:px-12 lg:px-16">
            {/* Logo Centré */}
            <div className="flex justify-center mb-24">
              <img 
                src={footerData.logo.url} 
                alt={footerData.logo.alt} 
                className="h-10 w-auto"
                onError={(e) => {
                  e.currentTarget.src = './Logo.png';
                }}
              />
            </div>
            
            <div className="border-t border-black/20 mb-5" />
            
            {/* Grille de contenu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-20">
              {/* Galerie - Col 1 */}
              <div className="grid grid-cols-2 gap-2">
                {footerData.galleryImages.slice(0, 4).map((img, i) => (
                  <div key={img._id || i} className="aspect-square overflow-hidden rounded-sm bg-black/5">
                    <img 
                      src={img.image} 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                      alt={img.alt} 
                      onError={(e) => {
                        // Fallback images
                        const fallbacks = [
                          'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1000&auto=format&fit=crop',
                          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1000&auto=format&fit=crop'
                        ];
                        e.currentTarget.src = fallbacks[i % fallbacks.length];
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Spacer Luxe - Col 2 */}
              <div className="hidden lg:block" />

              {/* Liens Utiles - Col 3 */}
              <div className="flex flex-col">
                <h4 className="font-bold text-[10px] tracking-[0.3em] uppercase mb-8 opacity-90">
                  {footerData.usefulLinks.title}
                </h4>
                <ul className="space-y-4">
                  {footerData.usefulLinks.links.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.url} 
                        className="text-sm opacity-50 hover:opacity-100 transition-opacity"
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pages Légales - Col 4 */}
              <div className="flex flex-col">
                <h4 className="font-bold text-[10px] tracking-[0.3em] uppercase mb-8 opacity-90">
                  {footerData.legalPages.title}
                </h4>
                <ul className="space-y-4">
                  {footerData.legalPages.links.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.url} 
                        className="text-sm opacity-50 hover:opacity-100 transition-opacity"
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="border-t border-black/20 mb-5" />

            {/* Bannière Visuelle */}
            <div className="border-t border-black/5">
              <div 
                className="py-20 lg:py-32"
                style={{ backgroundColor: footerData.visualBanner.backgroundColor }}
              >
                <h2 
                  className="text-[10vw] lg:text-[130px] font-medium text-center leading-none tracking-tighter text-black"
                >
                  {footerData.visualBanner.title}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className={`${gridContainer} mt-8`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] tracking-[0.2em] opacity-40 px-2">
          <p>{footerData.copyright.text}</p>
          <p>{footerData.copyright.designText}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;