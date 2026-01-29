import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, Maximize2, ExternalLink, Sparkles, ArrowRight } from 'lucide-react';

const GRID_CONTAINER = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

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
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [showImageFullscreen, setShowImageFullscreen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = [
    image,
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1616594039236-44204993a5d9?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop"
  ];

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
    if (selectedFeature === featureId) {
      setSelectedFeature(null);
    } else {
      setSelectedFeature(featureId);
    }
  };

  const handleImageClick = () => {
    setShowImageFullscreen(true);
  };

  const FullscreenImage = () => {
    if (!showImageFullscreen) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
          onClick={() => setShowImageFullscreen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-3"
            onClick={() => setShowImageFullscreen(false)}
            aria-label="Fermer"
          >
            <ChevronRight className="rotate-45" size={24} />
          </button>

          <div className="relative max-w-[90vw] max-h-[80vh] flex items-center justify-center">
            <motion.img
              key={activeImageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              src={images[activeImageIndex]}
              alt="Image plein écran"
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
          </div>

          {/* Navigation miniatures */}
          <div className="flex gap-2 mt-6 overflow-x-auto py-2 max-w-full px-4">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(index);
                }}
                className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                  activeImageIndex === index 
                    ? 'border-white scale-110' 
                    : 'border-transparent hover:border-white/50'
                }`}
              >
                <img
                  src={img}
                  alt={`Miniature ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <>
      <FullscreenImage />
      <section className="py-12 lg:py-20 bg-white overflow-hidden">
        <div className={GRID_CONTAINER}>
          
          {/* BLOC GRIS ENCASTRÉ */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="bg-[#EBEBEB] rounded-lg p-8 md:p-12 lg:p-16 relative overflow-hidden group"
          >
            {/* Effet de particules décoratives */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-500/5 to-purple-500/5 rounded-full blur-3xl -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl -translate-x-32 translate-y-32" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-10">
              
              {/* COLONNE GAUCHE (5/12) */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <motion.h2 
                    variants={itemVariants}
                    className="text-[40px] md:text-[52px] font-black leading-[1] text-black mb-8 uppercase tracking-tighter"
                  >
                    {titleLines.length > 1 ? (
                      <>
                        {titleLines.map((line, idx) => (
                          <motion.span
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="inline-block"
                          >
                            {line}
                            {idx < titleLines.length - 1 && <br />}
                          </motion.span>
                        ))}
                      </>
                    ) : (
                      <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                      >
                        {title}
                      </motion.span>
                    )}
                  </motion.h2>

                  <motion.p 
                    variants={itemVariants}
                    className="text-base text-gray-800 leading-relaxed max-w-[380px] font-medium mb-8"
                  >
                    {description}
                  </motion.p>

                  {/* CTA Button with animation */}
                  <motion.a
                    href={ctaLink}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-gray-900 transition-all group/cta w-fit"
                  >
                    {ctaText}
                    <ArrowRight size={16} className="group-hover/cta:translate-x-1 transition-transform" />
                  </motion.a>
                </motion.div>

                {/* Tagline avec animation */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="mt-12 lg:mt-0"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-[#FF2E63]" />
                    <span className="inline-block text-[11px] font-black uppercase tracking-[0.2em] text-black border-l-4 border-[#FF2E63] pl-4">
                      {tagline}
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* COLONNE DROITE (7/12) */}
              <div className="lg:col-span-7 flex flex-col">
                
                {/* Grille de points techniques améliorée */}
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 mb-12"
                >
                  {features.map((item) => (
                    <motion.div
                      key={item.id}
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
                            ? 'bg-white shadow-lg' 
                            : 'hover:bg-white/50'
                        }`}
                        onClick={() => handleFeatureClick(item.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <span className="text-[36px] font-black text-black/20 leading-none block">
                              {item.id}
                            </span>
                            {hoveredFeature === item.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute inset-0 w-8 h-8 bg-[#FF2E63] rounded-full -translate-x-1 -translate-y-1"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-[13px] font-bold uppercase leading-snug text-black pt-1 tracking-tight mb-2">
                              {item.text}
                            </p>
                            <AnimatePresence>
                              {selectedFeature === item.id && item.details && (
                                <motion.p
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="text-xs text-gray-600 leading-relaxed overflow-hidden"
                                >
                                  {item.details}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                          <motion.div
                            animate={{ rotate: selectedFeature === item.id ? 90 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-gray-400"
                          >
                            <ChevronRight size={16} />
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
                  className="relative w-full aspect-video lg:aspect-[16/10] overflow-hidden rounded-[4px] shadow-lg group/image cursor-pointer"
                  onClick={handleImageClick}
                >
                  {/* Image avec loading state */}
                  <div className="relative w-full h-full">
                    {!imageLoaded && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
                      </div>
                    )}
                    <img
                      src={images[activeImageIndex]}
                      alt="Modern Design"
                      className={`w-full h-full object-cover transition-all duration-500 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => setImageLoaded(true)}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/1200x675?text=Image+Error';
                        setImageLoaded(true);
                      }}
                    />
                  </div>

                  {/* Overlay interactif */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageClick();
                        }}
                        className="bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                        aria-label="Voir en plein écran"
                      >
                        <Maximize2 size={18} />
                      </button>
                      <a
                        href={images[activeImageIndex]}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                        aria-label="Ouvrir l'image"
                      >
                        <ExternalLink size={18} />
                      </a>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm font-medium">Cliquez pour voir en plein écran</p>
                      <p className="text-xs opacity-80">Image {activeImageIndex + 1} sur {images.length}</p>
                    </div>
                  </div>

                  {/* Navigation des images */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex(index);
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
                </motion.div>

                {/* Légende avec stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 flex flex-wrap items-center justify-between text-sm text-gray-600"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Check size={14} className="text-green-500" />
                      <span>Certifié qualité</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Check size={14} className="text-green-500" />
                      <span>Garantie 2 ans</span>
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {features.length} points clés • {images.length} visuels
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Effet de bordure animé */}
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