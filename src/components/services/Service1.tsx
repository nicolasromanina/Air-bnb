import React, { memo, useMemo } from 'react';
import { 
  Home, 
  Gem, 
  Bed, 
  BookOpen, 
  Utensils, 
  Umbrella 
} from 'lucide-react';

// --- CONFIGURATION DE LA GRILLE ---
const GRID_CONTAINER = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

// Composants optimisés (Inchangés)
const IconCard = memo(({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-sm flex flex-col items-start h-full hover:shadow-md transition-shadow duration-300">
    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded flex items-center justify-center mb-4 sm:mb-6">
      <Icon className="text-white w-5 h-5 sm:w-6 sm:h-6" />
    </div>
    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{title}</h3>
    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
      {description}
    </p>
  </div>
));

IconCard.displayName = 'IconCard';

const NumberItem = memo(({ 
  number, 
  title, 
  subtitle 
}: { 
  number: string;
  title: string;
  subtitle: string;
}) => (
  <div className="flex items-start gap-3 sm:gap-4">
    <span className="text-3xl sm:text-[40px] font-bold text-gray-600 leading-none flex-shrink-0">
      {number}
    </span>
    <div className="flex-1 min-w-0">
      <strong className="text-white block mb-1 text-sm sm:text-base font-semibold">
        {title}
      </strong>
      <span className="text-gray-300 text-xs sm:text-sm leading-relaxed block">
        {subtitle}
      </span>
    </div>
  </div>
));

NumberItem.displayName = 'NumberItem';

const OptimizedImage = memo(({
  src,
  alt,
  className = "",
  containerClass = "",
  priority = false
}: {
  src: string;
  alt: string;
  className?: string;
  containerClass?: string;
  priority?: boolean;
}) => (
  <div className={`relative overflow-hidden ${containerClass}`}>
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      width="800"
      height="600"
    />
  </div>
));

OptimizedImage.displayName = 'OptimizedImage';

// Données statiques (Inchangées)
const featureItems = [
  {
    icon: Gem,
    title: "Inceptos himenaeos",
    description: "Corem ipsum dolor sit amet, consectetur adipiscing elit."
  },
  {
    icon: Home,
    title: "Curabitur tempus",
    description: "Corem ipsum dolor sit amet, consectetur adipiscing elit."
  }
];

const iconCards = [
  {
    icon: BookOpen,
    title: "Adipiscing elit amet, consectetur.",
    description: "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
  },
  {
    icon: Bed,
    title: "Class aptent taciti sociosqu ad",
    description: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
  },
  {
    icon: Utensils,
    title: "A nunc vulputate libero et velit",
    description: "Curabitur tempus urna at turpis condimentum lobortis. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent."
  },
  {
    icon: Umbrella,
    title: "Curabitur tempus urna at turpis",
    description: "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis."
  }
];

const numberItems = [
  { number: "01", title: "Nunc vulputate libero et velit", subtitle: "interdum" },
  { number: "03", title: "Class aptent taciti sociosqu", subtitle: "ad litora" },
  { number: "02", title: "Class aptent taciti sociosqu ad", subtitle: "litora torquent" },
  { number: "04", title: "Taciti sociosqu ad litora", subtitle: "torquent" }
];

// Composant principal
const Service1: React.FC = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="font-sans text-gray-900 bg-white overflow-x-hidden selection:bg-pink-500 selection:text-white">
      
      {/* SECTION 1: HERO */}
      <section className="flex flex-col lg:flex-row min-h-[90vh] bg-[#EBEBEB]">
        {/* Left Content - Boxed Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 lg:py-0">
          <div className={`${GRID_CONTAINER} lg:mx-0 lg:ml-auto lg:pr-16`}>
            <div className="max-w-xl">
              <h1 className="text-4xl sm:text-5xl md:text-[50px] xl:text-[60px] leading-[0.95] font-black text-black tracking-tight mb-6 sm:mb-8">
                CONSECT<span className="block">ADIPISCING</span><span className="block">ELIT.</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed max-w-md font-medium">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
              </p>
            </div>
          </div>
        </div>
        {/* Right Image - Full bleed on its half */}
        <div className="w-full lg:w-1/2 h-[40vh] sm:h-[50vh] lg:h-auto">
          <OptimizedImage
            src="https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg"
            alt="Hero Bedroom"
            className="w-full h-full object-cover"
            priority={true}
          />
        </div>
      </section>

      {/* SECTION 2: OVERLAP & INTRO */}
      <section className="py-16 sm:py-24 lg:py-32 bg-white">
        <div className={GRID_CONTAINER}>
          <div className="flex flex-col xl:flex-row gap-12 sm:gap-16 xl:gap-20 items-start xl:items-center">
            
            {/* Left: Image Composition */}
            <div className="w-full xl:w-1/2 relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px]">
              <div className="absolute top-[20%] sm:top-[33%] right-[-2%] sm:right-[-3%] w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-[#FF1675] z-0"></div>
              
              <div className="absolute top-12 sm:top-16 md:top-20 left-0 sm:left-4 md:left-8 lg:left-10 w-[68%] sm:w-[70%] z-10 shadow-lg">
                <OptimizedImage
                  src="https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg"
                  alt="Modern Kitchen"
                  containerClass="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px]"
                />
              </div>

              <div className="absolute top-[220px] sm:top-[280px] md:top-[320px] lg:top-[360px] right-0 sm:right-4 md:right-8 lg:right-10 w-[63%] sm:w-[65%] z-20 shadow-lg">
                <OptimizedImage
                  src="https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg"
                  alt="Bedroom Detail"
                  containerClass="w-full h-[240px] sm:h-[280px] md:h-[320px] lg:h-[350px] xl:h-[400px]"
                />
              </div>

              <div className="absolute bottom-[-40px] sm:bottom-[-50px] md:bottom-[-80px] left-4 sm:left-8 md:left-12 lg:left-16 xl:left-40 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-black z-30"></div>
            </div>

            {/* Right: Text Content */}
            <div className="w-full xl:w-1/2 mt-80 sm:mt-96 md:mt-[420px] lg:mt-[460px] xl:mt-0 pl-0 xl:pl-8 2xl:pl-16">
              <h2 className="text-3xl sm:text-4xl md:text-[40px] lg:text-5xl xl:text-[56px] 2xl:text-[60px] font-black leading-[1.1] text-black mb-6 sm:mb-8 lg:mb-10 uppercase">
                Lorem ipsum<br />dolor sit<br />amet.
              </h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-8 sm:mb-10 lg:mb-12 max-w-lg font-medium">
                Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.
              </p>

              <div className="space-y-8 sm:space-y-10">
                {featureItems.map((item, index) => (
                  <div key={index} className="flex gap-4 sm:gap-6">
                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#FF1675] flex items-center justify-center">
                      <item.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-black mb-1 sm:mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: GRID ICONS */}
      <section className="py-16 sm:py-24 bg-[#FAFAFA] relative overflow-hidden">
        <div className={GRID_CONTAINER}>
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[36px] xl:text-[42px] 2xl:text-[48px] font-bold text-black leading-tight">
              Lorem ipsum dolor sit<br />amet.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 relative z-10">
            {iconCards.map((card, index) => (
              <IconCard
                key={index}
                icon={card.icon}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>

          {/* Background Big Text */}
          <div className="text-center mt-12 sm:mt-24 select-none pointer-events-none opacity-30 sm:opacity-50">
             <span className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] xl:text-[100px] 2xl:text-[120px] font-bold text-[#9CA3AF] leading-none tracking-tighter block truncate">
               Lorem ipsum dolor
             </span>
          </div>
        </div>
      </section>

      {/* SECTION 4: HEADER STRIP & CTA */}
      <section className="bg-white py-16 sm:py-24">
        <div className={GRID_CONTAINER}>
          {/* Header Strip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-12 sm:mb-20">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-[#FF1675] flex items-center justify-center flex-shrink-0">
                 <Home className="text-white w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[10px] sm:text-xs md:text-sm text-gray-400 uppercase tracking-widest">
                  Worem ipsum
                </span>
                <span className="font-bold text-base sm:text-lg md:text-xl text-black">
                  dolor sit amet
                </span>
              </div>
            </div>
            <div className="text-left sm:text-right">
               <p className="font-bold text-black text-sm sm:text-base md:text-lg">
                 Sorem ipsum dolor sit amet,
               </p>
               <p className="text-black text-sm sm:text-base md:text-lg">
                 consectetur adipiscing elit.
               </p>
            </div>
          </div>

          {/* Feature Content Block */}
          <div className="flex flex-col lg:flex-row w-full gap-0 overflow-hidden rounded-sm">
             <div className="w-full lg:w-[45%] h-[300px] sm:h-[400px] lg:h-[600px]">
               <OptimizedImage
                 src="https://images.pexels.com/photos/6782342/pexels-photo-6782342.jpeg"
                 alt="Clean Bedroom"
                 className="w-full h-full object-cover"
               />
             </div>
             <div className="w-full lg:w-[55%] bg-[#E5E7EB] p-6 sm:p-10 lg:p-16 2xl:p-24 flex flex-col justify-center">
                <h2 className="text-2xl sm:text-3xl md:text-[32px] lg:text-4xl xl:text-[38px] 2xl:text-[42px] font-bold text-black leading-tight mb-6 sm:mb-8">
                  Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
                </h2>
                <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-8 sm:mb-10 max-w-xl">
                  Qorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis. Ut commodo efficitur neque. Ut diam quam, semper iaculis condimentum ac, vestibulum eu nisl.
                </p>
                <div>
                  <button 
                    className="bg-[#FF1675] hover:bg-[#D9045D] text-white font-bold py-3 sm:py-4 px-8 sm:px-10 rounded shadow transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 text-sm sm:text-base uppercase tracking-wider"
                    aria-label="Réserver maintenant"
                  >
                    Reserver maintenant
                  </button>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: DARK FOOTER */}
      <section className="bg-black text-white w-full">
        <div className="flex flex-col xl:flex-row">
           {/* Dark Content Area - Boxed */}
           <div className="w-full xl:w-[70%] py-12 sm:py-20">
             <div className={`${GRID_CONTAINER} lg:mx-0 lg:ml-auto lg:pr-10 xl:pr-20`}>
               <h2 className="text-2xl sm:text-3xl md:text-[32px] lg:text-4xl xl:text-[38px] 2xl:text-[42px] font-medium text-gray-300 mb-10 sm:mb-16 max-w-2xl">
                 Class <span className="text-white font-bold">aptent taciti sociosqu quad</span> litora torquent .
               </h2>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-10 sm:gap-y-14">
                  {numberItems.map((item) => (
                    <NumberItem
                      key={item.number}
                      number={item.number}
                      title={item.title}
                      subtitle={item.subtitle}
                    />
                  ))}
               </div>

               <div className="mt-12 sm:mt-24 pt-6 sm:pt-8 border-t border-gray-800">
                 <p className="text-gray-500 text-xs sm:text-sm">
                   © {currentYear} ServicePage. Tous droits réservés.
                 </p>
               </div>
             </div>
           </div>

           {/* Vertical Image Strip */}
           <div className="w-full xl:w-[30%] min-h-[300px] xl:min-h-full">
             <OptimizedImage
               src="https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg"
               alt="Vertical Bedroom"
               className="w-full h-full object-cover grayscale opacity-70"
             />
           </div>
        </div>
      </section>

      {/* Inline styles (Inchangés) */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        img { content-visibility: auto; }
        .truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
};

export default memo(Service1);