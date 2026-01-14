import { Home } from "lucide-react";
import featureBedroom from "@/assets/horizontal-photo-room.png";
import featureLiving from "@/assets/square-photo-room.png";

const FeatureRoom = () => {
  return (
    <section 
      className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-8 lg:px-12 xl:px-20"
      style={{
        backgroundColor: 'hsl(0 0% 100%)' // CHANGÉ: blanc au lieu de gris clair (91%)
      }}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 lg:gap-20 mb-12 lg:mb-16">
        <h2 
          className="text-[28px] sm:text-[36px] lg:text-[44px] xl:text-[52px] font-bold leading-[1.05] tracking-tight uppercase max-w-[400px]"
          style={{
            color: 'hsl(0 0% 8%)', // foreground color
            fontFamily: "'Playfair Display', serif"
          }}
        >
          Adipiscing<br />
          Elit Amet<br />
          Consectetur .
        </h2>
        <p 
          className="text-sm sm:text-base leading-relaxed max-w-md lg:pt-2"
          style={{
            color: 'hsl(0 0% 8%)', // foreground color
            fontFamily: "'Inter', sans-serif"
          }}
        >
          Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.
        </p>
      </div>

      {/* Grid content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          {/* Feature cards */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Dark card */}
            <div 
              className="p-6 sm:p-8 flex flex-col items-center text-center flex-1"
              style={{
                backgroundColor: 'hsl(0 0% 8%)', // primary color
                color: 'hsl(0 0% 100%)' // primary-foreground
              }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-5"
                style={{
                  backgroundColor: 'hsl(0 0% 100%)' // white
                }}
              >
                <Home 
                  className="w-5 h-5"
                  style={{
                    color: 'hsl(0 0% 8%)' // foreground
                  }}
                />
              </div>
              <h3 
                className="text-lg sm:text-xl font-semibold mb-3"
                style={{
                  fontFamily: "'Playfair Display', serif"
                }}
              >
                Lorem ipsum dolor sit amet
              </h3>
              <p 
                className="text-sm leading-relaxed"
                style={{
                  opacity: 0.8 // primary-foreground/80
                }}
              >
                Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia
              </p>
            </div>

            {/* Light card */}
            <div 
              className="p-6 sm:p-8 flex flex-col items-center text-center flex-1"
              style={{
                backgroundColor: 'hsl(0 0% 96%)', // secondary color
                color: 'hsl(0 0% 8%)' // foreground
              }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-5"
                style={{
                  backgroundColor: 'hsl(0 0% 8%)' // primary color
                }}
              >
                <Home 
                  className="w-5 h-5"
                  style={{
                    color: 'hsl(0 0% 100%)' // primary-foreground
                  }}
                />
              </div>
              <h3 
                className="text-lg sm:text-xl font-semibold mb-3"
                style={{
                  fontFamily: "'Playfair Display', serif"
                }}
              >
                Nunc vulputate libero et velit
              </h3>
              <p 
                className="text-sm leading-relaxed"
                style={{
                  color: 'hsl(0 0% 45%)' // muted-foreground
                }}
              >
                Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia
              </p>
            </div>
          </div>

          {/* Bedroom image */}
          <div className="w-full h-[200px] sm:h-[260px] lg:h-[300px] overflow-hidden">
            <img
              src={featureBedroom}
              alt="Luxury bedroom interior"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right column - Living room image */}
        <div className="w-full h-[300px] sm:h-[400px] lg:h-full min-h-[400px] overflow-hidden">
          <img
            src={featureLiving}
            alt="Modern living room interior"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default FeatureRoom;