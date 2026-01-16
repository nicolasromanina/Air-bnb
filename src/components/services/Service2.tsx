import React, { useState, useCallback, memo } from 'react';
import { Plus, Minus } from 'lucide-react';

// Séparation des données statiques
const faqItems = [
  {
    question: "Gorem ipsum dolor sit amet, consectetur adipiscing elit.",
    answer: "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis."
  },
  {
    question: "Aptent taciti sociosqu ad litora torquent per conubia",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
  },
  {
    question: "Curabitur tempus urna at turpis condimentum lobortis",
    answer: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    question: "Ut commodo efficitur amet, consectetur adipiscing elit.",
    answer: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
  }
];

// Composant FAQItem mémoïsé
const FAQItem = memo(({ 
  item, 
  index, 
  isOpen, 
  onToggle 
}: { 
  item: typeof faqItems[0];
  index: number;
  isOpen: boolean;
  onToggle: (index: number) => void;
}) => {
  const animationDelay = `${0.8 + index * 0.1}s`;

  return (
    <div 
      className="bg-[#1F1F1F] rounded-[4px] overflow-hidden group hover:bg-[#333333] transition-all duration-300"
      style={{
        opacity: 0,
        transform: 'translateY(10px)',
        animation: `fadeInUp 0.5s ease-out ${animationDelay} forwards`
      }}
    >
      <button 
        onClick={() => onToggle(index)}
        className="w-full text-white px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF2E63] focus:ring-opacity-50 rounded-[4px]"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <span className="text-left text-sm lg:text-[15px] font-medium pr-3 sm:pr-4 flex-1">
          {item.question}
        </span>
        {isOpen ? (
          <Minus 
            className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#FF2E63] flex-shrink-0 transition-transform duration-300" 
            strokeWidth={3} 
            aria-hidden="true"
          />
        ) : (
          <Plus 
            className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#FF2E63] flex-shrink-0 transition-transform duration-300" 
            strokeWidth={3} 
            aria-hidden="true"
          />
        )}
      </button>
      
      <div 
        id={`faq-answer-${index}`}
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{
          maxHeight: isOpen ? '300px' : '0px',
          opacity: isOpen ? 1 : 0
        }}
        role="region"
        aria-labelledby={`faq-question-${index}`}
      >
        <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-2">
          <p className="text-sm lg:text-[15px] text-gray-300 leading-relaxed font-medium">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
});

FAQItem.displayName = 'FAQItem';

// Composant Image optimisé avec lazy loading
const OptimizedImage = memo(({
  src,
  alt,
  className,
  containerClass,
  animationStyle
}: {
  src: string;
  alt: string;
  className?: string;
  containerClass?: string;
  animationStyle?: React.CSSProperties;
}) => (
  <div 
    className={`relative overflow-hidden ${containerClass || ''}`}
    style={animationStyle}
  >
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover ${className || ''}`}
      loading="lazy"
      decoding="async"
      width="800"
      height="600"
    />
  </div>
));

OptimizedImage.displayName = 'OptimizedImage';

// Composant principal
const Service2 = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = useCallback((index: number) => {
    setOpenIndex(current => current === index ? null : index);
  }, []);

  return (
    <div className="w-full overflow-hidden" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      
      {/* ---------------- SECTION 1 (Bathroom / Dark Buttons) ---------------- */}
      <section className="relative w-full bg-[#E5E5E5] py-12 md:py-16 lg:py-[100px] overflow-hidden">
        
        {/* Decorative Pink Box (Top Right) */}
        <div 
          className="absolute top-0 right-0 w-20 h-20 sm:w-[100px] sm:h-[100px] lg:w-[100px] lg:h-[100px] bg-[#FF2E63] z-10"
          style={{
            animation: 'slideInRight 0.6s ease-out 0.3s both'
          }}
          aria-hidden="true"
        />
        
        {/* Decorative Black Box (Bottom Left) */}
        <div 
          className="absolute bottom-8 sm:bottom-12 left-4 sm:left-8 md:left-12 lg:left-20 w-24 h-20 sm:w-32 sm:h-24 lg:w-[140px] lg:h-[100px] bg-black z-30"
          style={{
            animation: 'slideInLeft 0.6s ease-out 0.5s both'
          }}
          aria-hidden="true"
        />

        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-20">
            
            {/* Left Column: Title + Main Image */}
            <div className="flex flex-col gap-6 sm:gap-8 lg:gap-12">
              <h2 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-[52px] font-bold leading-[1.15] text-[#1A1A1A]"
                style={{
                  opacity: 0,
                  transform: 'translateY(20px)',
                  animation: 'fadeInUp 0.8s ease-out 0.2s forwards'
                }}
              >
                Elit amet, consectetur <br className="hidden lg:block"/> tempus at turpis
              </h2>

              <OptimizedImage
                src="https://images.pexels.com/photos/3965521/pexels-photo-3965521.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Modern bathroom interior with oval mirror"
                containerClass="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[550px] lg:w-[85%]"
                className="shadow-sm hover:scale-105 transition-transform duration-700"
                animationStyle={{
                  opacity: 0,
                  transform: 'scale(0.95)',
                  animation: 'scaleIn 0.8s ease-out 0.4s forwards'
                }}
              />
            </div>

            {/* Right Column: Subtitle + Text + FAQ */}
            <div className="flex flex-col justify-center lg:pt-12">
              <div 
                className="mb-8 sm:mb-10 lg:mb-12"
                style={{
                  opacity: 0,
                  transform: 'translateY(20px)',
                  animation: 'fadeInUp 0.8s ease-out 0.6s forwards'
                }}
              >
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-[28px] font-bold mb-4 sm:mb-6 leading-tight text-[#1A1A1A]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </h3>
                <p className="text-sm sm:text-base leading-[1.8] text-[#4A4A4A] font-medium">
                  Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate
                  libero et velit interdum, ac aliquet odio mattis. Class aptent taciti
                  sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
                  Curabitur tempus urna at turpis condimentum lobortis. Ut commodo
                  efficitur neque.
                </p>
              </div>

              {/* FAQ Accordion */}
              <div className="flex flex-col gap-3 sm:gap-4">
                {faqItems.map((item, index) => (
                  <FAQItem
                    key={index}
                    item={item}
                    index={index}
                    isOpen={openIndex === index}
                    onToggle={toggleFAQ}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- SECTION 2 (Bedroom / Split Images) ---------------- */}
      <section className="relative w-full bg-[#F5F5F5] py-12 md:py-16 lg:py-[120px] overflow-hidden">
        
        {/* Large Pink Background Box (Bottom Right) */}
        <div 
          className="absolute bottom-0 right-0 w-[20%] h-64 sm:h-80 lg:h-[200px] bg-[#FF2E63] z-0 hidden lg:block"
          style={{
            opacity: 0,
            transform: 'translateX(100px)',
            animation: 'slideInRight 0.8s ease-out 0.4s forwards'
          }}
          aria-hidden="true"
        />
        <div 
          className="absolute bottom-0 right-0 w-full h-20 sm:h-24 bg-[#FF2E63] z-0 lg:hidden"
          style={{
            opacity: 0,
            transform: 'translateY(50px)',
            animation: 'fadeInUp 0.8s ease-out 0.4s forwards'
          }}
          aria-hidden="true"
        />

        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-20">
            
            {/* Left Column: Heading + Text + 2 Small Images */}
            <div className="flex flex-col justify-center">
              <h2 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight text-[#1A1A1A]"
                style={{
                  opacity: 0,
                  transform: 'translateY(20px)',
                  animation: 'fadeInUp 0.8s ease-out 0.2s forwards'
                }}
              >
                Aptent taciti sociosqu <br/> ad litora
              </h2>
              
              <p 
                className="text-sm sm:text-base leading-[1.8] text-[#4A4A4A] font-medium mb-8 sm:mb-10 lg:mb-14 max-w-[550px]"
                style={{
                  opacity: 0,
                  transform: 'translateY(20px)',
                  animation: 'fadeInUp 0.8s ease-out 0.4s forwards'
                }}
              >
                Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
                Class aptent taciti sociosqu ad litora torquent per conubia
                nostra, per inceptos himenaeos. Curabitur tempus urna at turpis
                condimentum lobortis.
              </p>

              {/* Two small images grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 w-full lg:max-w-[500px]">
                <div 
                  className="aspect-square w-full overflow-hidden"
                  style={{
                    opacity: 0,
                    transform: 'translateX(-20px)',
                    animation: 'fadeInLeft 0.6s ease-out 0.6s forwards'
                  }}
                >
                  <img 
                    src="https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=400" 
                    alt="Detail of bed linens" 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="400"
                  />
                </div>
                <div 
                  className="aspect-square w-full overflow-hidden"
                  style={{
                    opacity: 0,
                    transform: 'translateX(20px)',
                    animation: 'fadeInRight 0.6s ease-out 0.6s forwards'
                  }}
                >
                  <img 
                    src="https://images.pexels.com/photos/1648768/pexels-photo-1648768.jpeg?auto=compress&cs=tinysrgb&w=400" 
                    alt="Bedroom wall decor" 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="400"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Large Bedroom Image */}
            <div className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[650px] w-full flex items-end justify-end mt-8 lg:mt-0">
              <div 
                className="relative w-full h-full z-10 bg-gray-200 overflow-hidden"
                style={{
                  opacity: 0,
                  transform: 'scale(0.95)',
                  animation: 'scaleIn 0.8s ease-out 0.8s forwards'
                }}
              >
                <img 
                  src="https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=1200" 
                  alt="Modern luxurious bedroom main view" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  decoding="async"
                  width="1200"
                  height="800"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Animation keyframes inline style - optimisé avec will-change */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Optimisation des animations */
        [style*="animation"] {
          will-change: transform, opacity;
          backface-visibility: hidden;
        }

        /* Amélioration du rendu des polices sur mobile */
        @media (max-width: 640px) {
          html {
            text-rendering: optimizeSpeed;
          }
        }
      `}</style>
    </div>
  );
};

export default memo(Service2);