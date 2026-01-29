import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, Maximize2, ExternalLink, Sparkles, ArrowRight, X, Pause, Play } from 'lucide-react';

const GRID_CONTAINER = "max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-16";

interface Feature {
  id: string;
  text: string;
  icon?: string;
  details?: string;
}

interface LastSectionProps {
  title?: string;
  description?: string;
  features?: Feature[];
  image?: string;
  tagline?: string;
  ctaText?: string;
  ctaLink?: string;
}

const LastSection: React.FC<LastSectionProps> = ({
  title = "Consectetur\nipsum elit",
  description = "Sorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum.",
  features = [
    { 
      id: '01', 
      text: 'Class aptent taciti sociosqu ad litora torquent.',
      details: 'Détails supplémentaires sur cette caractéristique unique.'
    },
    { 
      id: '02', 
      text: 'Class aptent taciti sociosqu ad litora torquent.',
      details: 'Explication approfondie de ce point clé.'
    },
    { 
      id: '03', 
      text: 'Class aptent taciti sociosqu ad litora torquent.',
      details: 'Informations complémentaires importantes.'
    },
    { 
      id: '04', 
      text: 'Class aptent taciti sociosqu ad litora torquent.',
      details: 'Dernier point mais non des moindres.'
    },
  ],
  image = "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop",
  tagline = "Consectetur adipiscing",
  ctaText = "Découvrir plus",
  ctaLink = "#"
}) => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(features[0]?.id || null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [showImageFullscreen, setShowImageFullscreen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const autoRotateRef = useRef<NodeJS.Timeout>();

  const images = [
    image,
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1616594039236-44204993a5d9?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop"
  ];

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-rotate images
  useEffect(() => {
    if (isAutoRotating && !showImageFullscreen) {
      autoRotateRef.current = setInterval(() => {
        setActiveImageIndex((prev) => (prev + 1) % images.length);
      }, 4000);
    }
    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    };
  }, [isAutoRotating, showImageFullscreen, images.length]);

  // Touch gestures for image navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    } else if (isRightSwipe) {
      setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Parse title if it contains line breaks
  const titleLines = title.split('\n').map(line => line.trim()).filter(line => line);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const featureVariants = {
    initial: { scale: 1, backgroundColor: "transparent" },
    hover: { 
      scale: 1.02,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      transition: { duration: 0.2 }
    }
  };

  const handleFeatureClick = (featureId: string) => {
    setSelectedFeature(featureId);
    // Scroll to feature on mobile
    if (isMobile) {
      const element = document.getElementById(`feature-${featureId}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleImageClick = () => {
    setIsAutoRotating(false);
    setShowImageFullscreen(true);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    } else {
      setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const FullscreenImage = () => {
    if (!showImageFullscreen) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowImageFullscreen(false);
            }
          }}
        >
          <div className="relative w-full max-w-6xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-white text-sm">
                Image {activeImageIndex + 1} sur {images.length}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAutoRotating(!isAutoRotating)}
                  className="text-white hover:text-gray-300 transition-colors p-2 rounded-full bg-black/50"
                  aria-label={isAutoRotating ? "Pause" : "Lecture"}
                >
                  {isAutoRotating ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button
                  onClick={() => setShowImageFullscreen(false)}
                  className="text-white hover:text-gray-300 transition-colors p-2 rounded-full bg-black/50"
                  aria-label="Fermer"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Main Image */}
            <div className="relative flex-1 overflow-hidden rounded-lg">
              <motion.img
                key={activeImageIndex}
                initial={{ opacity: 0, x: direction === 'next' ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === 'prev' ? 100 : -100 }}
                src={images[activeImageIndex]}
                alt="Image plein écran"
                className="w-full h-full object-contain"
              />
              
              {/* Navigation Buttons */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('prev');
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                aria-label="Image précédente"
              >
                <ChevronRight className="rotate-180" size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('next');
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                aria-label="Image suivante"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mt-4 overflow-x-auto py-2 px-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(index);
                  }}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                    activeImageIndex === index 
                      ? 'border-white scale-105' 
                      : 'border-transparent hover:border-white/50 hover:scale-105'
                  }`}
                  aria-label={`Voir l'image ${index + 1}`}
                >
                  <img
                    src={img}
                    alt={`Miniature ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <>
      <FullscreenImage />
      <section className="py-8 lg:py-16 bg-white overflow-hidden" aria-labelledby="section-title">
        <div className={GRID_CONTAINER}>
          
          {/* BLOC GRIS ENCASTRÉ */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="bg-[#EBEBEB] rounded-lg p-6 md:p-10 lg:p-12 relative overflow-hidden group"
          >
            {/* Effet de particules décoratives */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-500/5 to-purple-500/5 rounded-full blur-3xl -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl -translate-x-32 translate-y-32" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
              
              {/* COLONNE GAUCHE (5/12) */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <motion.h2 
                    id="section-title"
                    variants={itemVariants}
                    className="text-3xl sm:text-4xl md:text-[52px] font-black leading-[1.1] text-black mb-6 uppercase tracking-tighter"
                  >
                    {titleLines.map((line, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="block"
                      >
                        {line}
                      </motion.span>
                    ))}
                  </motion.h2>

                  <motion.p 
                    variants={itemVariants}
                    className="text-base text-gray-800 leading-relaxed max-w-[380px] font-medium mb-8"
                  >
                    {description}
                  </motion.p>

                  {/* CTA Button with improved accessibility */}
                  <motion.a
                    href={ctaLink}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-gray-900 transition-all group/cta w-fit focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                    aria-label={`${ctaText} (ouvre dans la même page)`}
                  >
                    {ctaText}
                    <ArrowRight size={16} className="group-hover/cta:translate-x-1 transition-transform" />
                  </motion.a>
                </motion.div>

                {/* Tagline */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="mt-10 lg:mt-0"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-[#FF2E63]" />
                    <span className="inline-block text-xs font-black uppercase tracking-[0.2em] text-black border-l-4 border-[#FF2E63] pl-3 py-1">
                      {tagline}
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* COLONNE DROITE (7/12) */}
              <div className="lg:col-span-7 flex flex-col">
                
                {/* Grille de points techniques */}
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-8 md:mb-12"
                >
                  {features.map((item) => (
                    <motion.div
                      key={item.id}
                      id={`feature-${item.id}`}
                      variants={itemVariants}
                      whileHover="hover"
                      initial="initial"
                      animate={selectedFeature === item.id ? "hover" : "initial"}
                      onMouseEnter={() => setHoveredFeature(item.id)}
                      onMouseLeave={() => setHoveredFeature(null)}
                      className="relative"
                    >
                      <motion.div
                        variants={featureVariants}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                          selectedFeature === item.id 
                            ? 'bg-white shadow-lg ring-2 ring-[#FF2E63]/20' 
                            : 'hover:bg-white/50'
                        }`}
                        onClick={() => handleFeatureClick(item.id)}
                        role="button"
                        tabIndex={0}
                        aria-expanded={selectedFeature === item.id}
                        aria-label={`${item.text} ${selectedFeature === item.id ? 'détails ouverts' : 'cliquer pour voir les détails'}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleFeatureClick(item.id);
                          }
                        }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="relative flex-shrink-0">
                            <span className="text-2xl font-black text-black/20 leading-none block">
                              {item.id}
                            </span>
                            {hoveredFeature === item.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute inset-0 w-6 h-6 bg-[#FF2E63] rounded-full -translate-x-0.5 -translate-y-0.5"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold uppercase leading-snug text-black mb-1 tracking-tight line-clamp-2">
                              {item.text}
                            </p>
                            <AnimatePresence>
                              {selectedFeature === item.id && item.details && (
                                <motion.p
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="text-xs text-gray-600 leading-relaxed overflow-hidden pt-1"
                                >
                                  {item.details}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                          <motion.div
                            animate={{ rotate: selectedFeature === item.id ? 90 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-gray-400 flex-shrink-0 mt-1"
                          >
                            <ChevronRight size={14} />
                          </motion.div>
                        </div>
                      </motion.div>
                      
                      {/* Indicateur de sélection */}
                      {selectedFeature === item.id && (
                        <motion.div
                          layoutId="feature-indicator"
                          className="absolute left-0 top-0 w-1 h-full bg-[#FF2E63] rounded-r"
                        />
                      )}
                    </motion.div>
                  ))}
                </motion.div>

                {/* Image avec overlay interactif */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full aspect-video lg:aspect-[16/10] overflow-hidden rounded-lg shadow-lg group/image"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {/* Loading state */}
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                      <div className="w-10 h-10 border-3 border-gray-300 border-t-black rounded-full animate-spin" />
                    </div>
                  )}
                  
                  {/* Main Image */}
                  <img
                    src={images[activeImageIndex]}
                    alt={`Modern Design ${activeImageIndex + 1}`}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/1200x675?text=Image+Error';
                      setImageLoaded(true);
                    }}
                  />

                  {/* Progress bar for auto-rotate */}
                  <motion.div
                    key={activeImageIndex}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 4, ease: "linear" }}
                    className="absolute top-0 left-0 h-1 bg-[#FF2E63]"
                  />

                  {/* Interactive overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsAutoRotating(!isAutoRotating);
                        }}
                        className="bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                        aria-label={isAutoRotating ? "Pause la rotation" : "Démarrer la rotation"}
                      >
                        {isAutoRotating ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                      <button
                        onClick={handleImageClick}
                        className="bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                        aria-label="Voir en plein écran"
                      >
                        <Maximize2 size={16} />
                      </button>
                      <a
                        href={images[activeImageIndex]}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                        aria-label="Ouvrir l'image dans un nouvel onglet"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                    
                    <div className="absolute bottom-3 left-3 text-white pointer-events-none">
                      <p className="text-xs font-medium opacity-0 group-hover/image:opacity-100 transition-opacity">
                        {isMobile ? 'Swipe pour naviguer' : 'Cliquez pour plein écran'}
                      </p>
                    </div>
                  </div>

                  {/* Image navigation */}
                  <div className="absolute bottom-3 right-3 flex gap-1">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex(index);
                          setIsAutoRotating(false);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          activeImageIndex === index 
                            ? 'bg-white w-4' 
                            : 'bg-white/50 hover:bg-white/80'
                        }`}
                        aria-label={`Voir l'image ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Navigation arrows */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImage('prev');
                      setIsAutoRotating(false);
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover/image:opacity-100 transition-all"
                    aria-label="Image précédente"
                  >
                    <ChevronRight className="rotate-180" size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImage('next');
                      setIsAutoRotating(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover/image:opacity-100 transition-all"
                    aria-label="Image suivante"
                  >
                    <ChevronRight size={18} />
                  </button>
                </motion.div>

                {/* Caption with stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 md:mt-6 flex flex-wrap items-center justify-between text-sm text-gray-600 gap-2"
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Check size={12} className="text-green-500 flex-shrink-0" />
                      <span className="text-xs">Certifié qualité</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Check size={12} className="text-green-500 flex-shrink-0" />
                      <span className="text-xs">Garantie 2 ans</span>
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {features.length} points clés • {images.length} visuels
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Animated border */}
            <motion.div
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF2E63] via-purple-500 to-cyan-500"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default LastSection;