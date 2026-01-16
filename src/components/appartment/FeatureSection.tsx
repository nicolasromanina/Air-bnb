import { Bed } from "lucide-react";
import featureRoom from "@/assets/feature-room.jpg";
import smallRoom from "@/assets/small-room.jpg";

const FeatureSection = () => {
  return (
    <section className="py-16 lg:py-24 px-6 lg:px-16 xl:px-24 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left column */}
          <div>
            {/* Title */}
            <h2 className="font-montserrat font-bold text-foreground text-3xl lg:text-4xl xl:text-[42px] leading-tight mb-12">
              Consectetur
              <br />
              ipsum elit
            </h2>
            
            {/* Dark cards stack */}
            <div className="space-y-0">
              {/* Top dark card */}
              <div className="bg-black text-primary-foreground p-6 lg:p-12">
                <p className="font-montserrat font-semibold text-lg lg:text-xl mb-4">
                  Nunc vulputate libero et velit interdum, ac{" "}
                  <span className="text-gray-dark">aliquet odio mattis.</span>
                </p>
                <div className="flex flex-row items-center justify-between h-full py-2">
                  <div className="w-12 h-12 border border-primary-foreground/30 flex items-center justify-center">
                    <Bed className="w-6 h-6" />
                  </div>
                  <p className="font-montserrat text-sm text-primary-foreground/70 text-center">
                    Amet, consectetur
                    <br />
                    adipiscing elit.
                  </p>
                </div>
              </div>
              <br />
              
             {/* Bottom white card with image */}
              <div className="bg-white text-black flex lg:p-12">
                <div className="p-6 flex-1">
                  <p className="font-montserrat font-semibold text-sm mb-4 text-black">
                    Nunc vulputate
                    <br />
                    libero
                  </p>
                  <p className="font-montserrat text-xs text-black/70">
                    Rorem ipsum dolor sit amet,
                    <br />
                    consectetur adipiscing elit
                  </p>
                </div>
                <div className="w-32 lg:w-40">
                  <img
                    src={smallRoom}
                    alt="Room preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-end p-4">
                  <div className="w-10 h-10 rounded-full bg-accent" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column */}
          <div>
            {/* Mixed text */}
            <div className="mb-8 lg:mb-12">
              <p className="font-montserrat font-bold text-foreground text-xl lg:text-2xl leading-relaxed">
                Nunc vulputate libero et velit interdum, ac aliquet odio mattis.{" "}
                <span className="text-muted-foreground font-normal">
                  Class aptent taciti sociosqu ad
                </span>{" "}
                litora torquent per conubia nostra, per inceptos himenaeos.{" "}
                <span className="text-muted-foreground font-normal">
                  Curabitur tempus urna at turpis
                </span>{" "}
                condimentum lobortis.
              </p>
            </div>
            
            {/* Large image */}
            <div className="aspect-[4/3]">
              <img
                src={featureRoom}
                alt="Luxury bedroom with garden view"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        {/* New section for bottom texts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mt-12">
          {/* Left bottom text */}
          <div>
            <p className="font-montserrat text-muted-foreground text-sm max-w-sm">
              Class aptent taciti sociosqu ad litora
              torquent per conubia nostra, per
              inceptos himenaeos.
            </p>
          </div>
          
          {/* Right bottom text */}
          <div className="flex justify-end">
            <p className="font-montserrat text-muted-foreground text-sm max-w-xs text-right">
              Class aptent taciti sociosqu
              ad litora torquent .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;