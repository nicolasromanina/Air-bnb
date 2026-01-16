import React, { useState, useCallback, memo } from 'react';
import { Plus, Minus } from 'lucide-react';

import livingroomService3 from '@/assets/livingroom-service-3.png';
import sofaService1 from '@/assets/sofa-service-1.png';
import sofaService2 from '@/assets/sofa-service-2.png';
import bedroomService4 from '@/assets/bedroom-service-4.png';

// --- CONFIGURATION DE LA GRILLE (Identique à Service1 pour alignement parfait) ---
const GRID_CONTAINER = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

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

const FAQItem = memo(({ item, index, isOpen, onToggle }: any) => {
  return (
    <div className="bg-[#1F1F1F] rounded-[4px] overflow-hidden mb-3">
      <button 
        onClick={() => onToggle(index)}
        className="w-full text-white px-4 sm:px-6 py-4 flex items-center justify-between transition-all duration-300 focus:outline-none"
      >
        <span className="text-left text-sm font-medium pr-4">{item.question}</span>
        {isOpen ? (
          <Minus className="w-5 h-5 text-[#FF2E63] flex-shrink-0" strokeWidth={3} />
        ) : (
          <Plus className="w-5 h-5 text-[#FF2E63] flex-shrink-0" strokeWidth={3} />
        )}
      </button>
      <div 
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? '300px' : '0px', opacity: isOpen ? 1 : 0 }}
      >
        <div className="px-6 pb-5 pt-2">
          <p className="text-sm text-gray-300 leading-relaxed font-medium">{item.answer}</p>
        </div>
      </div>
    </div>
  );
});

const Service2 = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleFAQ = useCallback((index: number) => setOpenIndex(curr => curr === index ? null : index), []);

  return (
    <div className="w-full bg-white py-12 lg:py-16" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      
      {/* ---------------- SECTION 1 (Bathroom / Dark Buttons) ---------------- */}
      <section className="mb-16 lg:mb-24">
        <div className={GRID_CONTAINER}>
          <div className="relative bg-[#E5E5E5] rounded-sm overflow-hidden p-8 sm:p-12 lg:p-20">
            
            {/* Elements décoratifs confinés au conteneur */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#FF2E63] z-10" />
            <div className="absolute bottom-8 left-8 w-20 h-20 bg-black z-30 hidden md:block" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 relative z-20">
              {/* Left Column */}
              <div className="flex flex-col gap-8">
                <h2 className="text-3xl sm:text-4xl lg:text-[52px] font-bold leading-[1.15] text-[#1A1A1A]">
                  Elit amet, consectetur <br className="hidden lg:block"/> tempus at turpis
                </h2>
                <div className="w-full lg:w-[85%] h-[300px] sm:h-[450px] overflow-hidden rounded-sm">
                  <img 
                    src={livingroomService3} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                    alt="Bathroom" 
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col justify-center">
                <div className="mb-8 lg:mb-12">
                  <h3 className="text-lg sm:text-2xl font-bold mb-6 text-[#1A1A1A]">
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
                <div className="flex flex-col">
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
        </div>
      </section>

      {/* ---------------- SECTION 2 (Bedroom / Split Images) ---------------- */}
      <section className="mb-16 lg:mb-20">
        <div className={GRID_CONTAINER}>
          <div className="relative bg-[#F5F5F5] rounded-sm overflow-hidden border border-gray-100 p-8 sm:p-12 lg:p-20">
            
            {/* Carré rose confiné au conteneur */}
            <div className="absolute bottom-0 right-0 w-[20%] h-[170px] bg-[#FF2E63] z-0 hidden lg:block" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
              {/* Left Column */}
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl lg:text-[42px] font-bold mb-6 leading-tight text-[#1A1A1A]">
                  Aptent taciti sociosqu <br/> ad litora
                </h2>
                <p className="text-sm sm:text-base leading-[1.8] text-[#4A4A4A] font-medium mb-10 max-w-[550px]">
                  Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
                  Class aptent taciti sociosqu ad litora torquent per conubia
                  nostra, per inceptos himenaeos. Curabitur tempus urna at turpis
                  condimentum lobortis.
                </p>
                <div className="grid grid-cols-2 gap-4 lg:max-w-[500px]">
                  <div className="aspect-square overflow-hidden rounded-sm bg-gray-200">
                    <img src={sofaService2} className="w-full h-full object-cover" alt="Detail 1" />
                  </div>
                  <div className="aspect-square overflow-hidden rounded-sm bg-gray-200">
                    <img src={sofaService1} className="w-full h-full object-cover" alt="Detail 2" />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="h-[350px] lg:h-[600px] w-full">
                <div className="w-full h-full overflow-hidden rounded-sm shadow-xl">
                  <img 
                    src={bedroomService4}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                    alt="Bedroom" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .grid > div {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default memo(Service2);