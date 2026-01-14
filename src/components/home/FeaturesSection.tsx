import { Sofa, Home } from "lucide-react";
import livingMain from "@/assets/b-photo-center-feature.png";
import thumb1 from "@/assets/s-photo-feature-1.png";
import thumb2 from "@/assets/s-photo-feature-2.png";

const features = [
  {
    icon: Sofa,
    title: "Rorem ipsum dolor sit amet"
  },
  {
    icon: Home,
    title: "Rorem ipsum dolor sit amet"
  }
];

const FeaturesSection = () => {
  return (
    <section 
      className="py-20"
      style={{
        backgroundColor: 'hsl(0 0% 87%)'
      }}
    >
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
          {/* Left Column - Title & Features */}
          <div className="space-y-8">
            <h2 
              className="text-3xl md:text-4xl font-medium leading-tight"
              style={{
                color: 'hsl(0 0% 10%)',
                fontFamily: "'Playfair Display', serif"
              }}
            >
              Elit amet<br />consectetur
            </h2>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-sm"
                  style={{
                    backgroundColor: 'hsl(0 0% 100%)'
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: 'hsl(0 0% 10%)'
                    }}
                  >
                    <feature.icon 
                      className="w-5 h-5"
                      style={{
                        color: 'hsl(0 0% 87%)'
                      }}
                    />
                  </div>
                  <span 
                    className="text-sm font-medium"
                    style={{
                      color: 'hsl(0 0% 10%)'
                    }}
                  >
                    {feature.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Center Column - Main Image */}
          <div className="aspect-[3/4] overflow-hidden rounded-sm">
            <img
              src={livingMain}
              alt="Salon moderne avec TV"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Right Column - Description & Thumbnails */}
          <div className="space-y-6">
            <h3 
              className="text-2xl md:text-3xl font-semibold leading-tight"
              style={{
                color: 'hsl(0 0% 10%)',
                fontFamily: "'Playfair Display', serif"
              }}
            >
              Aptent taciti sociosqu<br />ad litora
            </h3>
            
            <p 
              className="text-xs leading-relaxed"
              style={{
                color: 'hsl(0 0% 40%)'
              }}
            >
              Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.
            </p>
            
            <div className="flex gap-4">
              <div className="w-1/2 aspect-square overflow-hidden rounded-sm">
                <img
                  src={thumb1}
                  alt="Intérieur moderne"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="w-1/2 aspect-square overflow-hidden rounded-sm">
                <img
                  src={thumb2}
                  alt="Chambre design"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;