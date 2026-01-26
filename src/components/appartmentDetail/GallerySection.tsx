import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useFadeInOnScroll, useStaggerChildren, useChildFadeIn } from "@/hooks/useSrollAnimation";

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
}

interface GallerySectionProps {
  title?: string;
  subtitle?: string;
  images?: GalleryImage[];
  buttonText?: string;
}

const defaultGalleryImages = [
  { src: gallery1, alt: "Modern bedroom with artwork" },
  { src: gallery2, alt: "Open plan living space" },
  { src: gallery3, alt: "Grey toned bedroom" },
  { src: gallery4, alt: "Bedroom with round mirror" },
  { src: gallery5, alt: "Dining area with pendant lights" },
  { src: gallery6, alt: "Minimalist bedroom with line art" },
  { src: gallery7, alt: "Bedroom with pendant light" },
  { src: gallery8, alt: "Apartment with staircase" },
  { src: gallery9, alt: "Luxury grey bedroom" },
];

const GallerySection: React.FC<GallerySectionProps> = ({ 
  title = "Nunc vulputate libero et\nvelit interdum, ac aliquet\nodio mattis.",
  subtitle,
  images,
  buttonText = "Nous contacter"
}) => {
  const fadeIn = useFadeInOnScroll();
  const stagger = useStaggerChildren(0.05);
  const childVariants = useChildFadeIn();

  // Use provided images or filter out empty ones from default
  const galleryImages = images && images.length > 0 
    ? images.filter(img => img.src && img.alt)
    : defaultGalleryImages;

  // Parse title if it contains line breaks
  const titleLines = title.split('\n').map(line => line.trim()).filter(line => line);

  return (
    <section className="section-muted py-16 lg:py-24">
      <div className="container max-w-[900px] mx-auto px-6">
        {/* Header */}
        <motion.h2
          {...fadeIn}
          className="heading-section text-center mb-10 lg:mb-14 italic"
        >
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
        </motion.h2>

        {/* Gallery grid with stagger */}
        <motion.div
          {...stagger}
          className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-3 mb-10"
        >
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              variants={childVariants}
              className="aspect-square overflow-hidden"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E';
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Contact button */}
        <motion.div {...fadeIn} className="flex justify-center">
          <Button variant="default">{buttonText}</Button>
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection;
