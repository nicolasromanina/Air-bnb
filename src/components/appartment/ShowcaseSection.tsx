import { Check } from "lucide-react";
import showcaseRoom from "@/assets/appartement-photo.png";

const GRID_CONTAINER = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

const checkItems = [
  { text: "Lorem ipsum dolor" },
  { text: "Sit amet, consectetur" },
  { text: "Adipiscing elit." },
  { text: "Curabitur tempus" },
];

const ShowcaseSection = () => {
  return (
    <section className="py-12 lg:py-20 bg-white">
      <div className={GRID_CONTAINER}>
        
        {/* Conteneur avec background gris aligné sur le grid */}
        <div className="bg-[#EBEBEB] rounded-lg py-16 lg:py-24 px-8 lg:px-16 xl:px-24 overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left - Image with decorative elements */}
            <div className="relative">
              {/* Gray decorative rectangle - top */}
              <div className="absolute -top-10 left-[80%] w-40 h-40 bg-gray-400/50 z-5" />
              
              {/* Main image */}
              <div className="relative z-10 overflow-hidden rounded-sm ">
                <img
                  src={showcaseRoom}
                  alt="Elegant bedroom"
                  className="w-full object-cover"
                />
              </div>
              
              {/* Pink decorative square - bottom left */}
              <div className="absolute -bottom-8 -left-20 w-20 h-20 bg-[#FF2E63] z-20" />
            </div>
            
            {/* Right - Content */}
            <div className="lg:pl-8 relative z-10">
              <h2 className="font-serif font-bold text-black text-3xl lg:text-4xl xl:text-[42px] leading-tight mb-6">
                Elit amet,
                <br />
                consectetur
              </h2>
              
              <p className="text-gray-700 text-sm lg:text-base leading-relaxed mb-8 max-w-md">
                Nunc vulputate libero et velit interdum, ac aliquet odio
                mattis. Class aptent taciti sociosqu ad litora torquent
                per conubia nostra, per inceptos himenaeos. Curabitur
                tempus urna at turpis condimentum lobortis.
              </p>
              
              {/* Check items grid */}
              <div className="grid grid-cols-2 gap-4">
                {checkItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#FF2E63] flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-black font-semibold text-sm">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;