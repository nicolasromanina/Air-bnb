import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Maximize2, Loader2 } from "lucide-react";
import { useFadeInOnScroll, useStaggerChildren, useChildFadeIn } from "@/hooks/useSrollAnimation";
import { Link } from 'react-router-dom';
// ... imports des images
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import gallery7 from "@/assets/gallery-7.jpg";
import gallery8 from "@/assets/gallery-8.jpg";
import gallery9 from "@/assets/gallery-9.jpg";
interface GalleryImage {
  src: string;
  alt: string;
  description?: string;
}

interface GallerySectionProps {
  title?: string;
  subtitle?: string;
  images?: GalleryImage[];
  buttonText?: string;
  enableLightbox?: boolean;
  enableLazyLoading?: boolean;
}

const defaultGalleryImages = [
  { 
    src: gallery1, 
    alt: "Modern bedroom with artwork",
    description: "Chambre moderne avec œuvre d'art contemporain"
  },
  // ... ajoutez descriptions pour toutes les images
];

const GallerySection: React.FC<GallerySectionProps> = ({ 
  title = "Nunc vulputate libero et\nvelit interdum, ac aliquet\nodio mattis.",
  subtitle,
  images,
  buttonText = "Nous contacter",
  enableLightbox = true,
  enableLazyLoading = true
}) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean[]>([]);
  const [loadedImages, setLoadedImages] = useState<boolean[]>([]);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  const fadeIn = useFadeInOnScroll();
  const stagger = useStaggerChildren(0.05);
  const childVariants = useChildFadeIn();

  const galleryImages = images && images.length > 0 
    ? images.filter(img => img.src && img.alt)
    : defaultGalleryImages;

  useEffect(() => {
    setLoadedImages(new Array(galleryImages.length).fill(false));
    setIsLoading(new Array(galleryImages.length).fill(false));
  }, [galleryImages.length]);

  const handleImageLoad = (index: number) => {
    const newLoadedImages = [...loadedImages];
    newLoadedImages[index] = true;
    setLoadedImages(newLoadedImages);
  };

  const handleImageError = (index: number) => {
    const newLoadedImages = [...loadedImages];
    newLoadedImages[index] = true;
    setLoadedImages(newLoadedImages);
    setIsLoading(prev => {
      const newLoading = [...prev];
      newLoading[index] = false;
      return newLoading;
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedImage !== null) {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedImage((prev) => 
          prev !== null ? (prev + 1) % galleryImages.length : null
        );
      } else if (e.key === 'ArrowLeft') {
        setSelectedImage((prev) => 
          prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null
        );
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null || selectedImage === null) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setSelectedImage((prev) => 
          (prev! + 1) % galleryImages.length
        );
      } else {
        setSelectedImage((prev) => 
          (prev! - 1 + galleryImages.length) % galleryImages.length
        );
      }
    }
    setTouchStart(null);
  };

  useEffect(() => {
    if (selectedImage !== null) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage]);

  const titleLines = title.split('\n').map(line => line.trim()).filter(line => line);

  const Lightbox = () => {
    if (selectedImage === null) return null;

    const image = galleryImages[selectedImage];

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
          ref={lightboxRef}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
              aria-label="Fermer la visionneuse"
            >
              <X size={24} />
            </button>

            <div className="relative">
              <img
                src={image.src}
                alt={image.alt}
                className="max-w-full max-h-[80vh] object-contain"
              />
              {image.description && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white text-sm md:text-base">{image.description}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-4 text-white">
              <button
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                onClick={() => setSelectedImage((prev) => 
                  (prev! - 1 + galleryImages.length) % galleryImages.length
                )}
                aria-label="Image précédente"
              >
                <ChevronLeft size={24} />
              </button>

              <span className="text-sm">
                {selectedImage + 1} / {galleryImages.length}
              </span>

              <button
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                onClick={() => setSelectedImage((prev) => 
                  (prev! + 1) % galleryImages.length
                )}
                aria-label="Image suivante"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <section className="section-muted py-16 lg:py-24">
      <div className="container max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          {...fadeIn}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="heading-section italic mb-4">
            {titleLines.length > 1 ? (
              <>
                {titleLines.map((line, idx) => (
                  <span key={idx}>
                    {line}
                    {idx < titleLines.length - 1 && <br />}
                  </span>
                ))}
              </>
            ) : (
              title
            )}
          </h2>
          {subtitle && (
            <p className="text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Gallery grid */}
        <motion.div
          {...stagger}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-6 mb-12"
          role="list"
          aria-label="Galerie d'images"
        >
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              variants={childVariants}
              className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
              role="listitem"
            >
              {/* Skeleton loader */}
              {!loadedImages[index] && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              )}

              {/* Image */}
              <button
                className={`relative w-full h-full ${enableLightbox ? 'cursor-zoom-in' : 'cursor-default'}`}
                onClick={() => enableLightbox && setSelectedImage(index)}
                aria-label={`Voir l'image ${index + 1}: ${image.alt}`}
                disabled={!enableLightbox}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    loadedImages[index] 
                      ? 'opacity-100 group-hover:scale-105 group-hover:brightness-110' 
                      : 'opacity-0'
                  }`}
                  loading={enableLazyLoading ? "lazy" : "eager"}
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                  decoding="async"
                />
              </button>

              {/* Overlay avec description */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-sm font-medium">{image.alt}</p>
                  {image.description && (
                    <p className="text-gray-300 text-xs mt-1">{image.description}</p>
                  )}
                  {enableLightbox && (
                    <div className="flex items-center justify-end mt-2">
                      <Maximize2 size={16} className="text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Indicateur de chargement */}
              <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                loadedImages[index] ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
              }`} />
            </motion.div>
          ))}
        </motion.div>

        {/* Lightbox */}
        {enableLightbox && <Lightbox />}

        {/* Contact button */}
        <motion.div 
          {...fadeIn} 
          className="flex flex-col items-center gap-6"
        >
          <div className="text-center max-w-2xl">
          <Link to="/contact">
            <Button 
              variant="default" 
              size="lg"
              className="px-8"
            >
              {buttonText}
            </Button>
          </Link>
        </div>
          
          {/* Navigation rapide pour mobile */}
          <div className="flex items-center gap-4 text-sm text-gray-500 md:hidden">
            <span className="font-medium">Navigation :</span>
            <span className="flex gap-1">
              <kbd className="px-2 py-1 bg-gray-100 rounded">← →</kbd>
              <span>pour naviguer</span>
            </span>
            <span className="flex gap-1">
              <kbd className="px-2 py-1 bg-gray-100 rounded">ESC</kbd>
              <span>pour fermer</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection;