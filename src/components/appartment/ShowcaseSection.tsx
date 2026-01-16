import { Check } from "lucide-react";
import showcaseRoom from "@/assets/showcase-room.jpg";

const checkItems = [
  { text: "Lorem ipsum dolor" },
  { text: "Sit amet, consectetur" },
  { text: "Adipiscing elit." },
  { text: "Curabitur tempus" },
];

const ShowcaseSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Image with decorative elements */}
          <div className="relative">
            {/* Gray decorative rectangle - top -  */}
            <div className="absolute -top-10 -left-[-80%] w-40 h-40 bg-gray-500 lg:block z-5" />
            
            {/* Main image */}
            <div className="relative z-10">
              <img
                src={showcaseRoom}
                alt="Elegant bedroom with dark blue curtains"
                className="w-full object-cover"
              />
            </div>
            
            {/* Pink decorative square - bottom left */}
            <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-accent lg:block z-10" />
          </div>
          
          {/* Right - Content */}
          <div className="lg:pl-8">
            <h2 className="font-montserrat font-bold text-foreground text-3xl lg:text-4xl xl:text-[42px] leading-tight mb-6">
              Elit amet,
              <br />
              consectetur
            </h2>
            
            <p className="font-montserrat text-muted-foreground text-sm lg:text-base leading-relaxed mb-8 max-w-md">
              Nunc vulputate libero et velit interdum, ac aliquet odio
              mattis. Class aptent taciti sociosqu ad litora torquent
              per conubia nostra, per inceptos himenaeos. Curabitur
              tempus urna at turpis condimentum lobortis.
            </p>
            
            {/* Check items grid */}
            <div className="grid grid-cols-2 gap-3">
              {checkItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-accent-foreground" />
                  </div>
                  <span className="font-montserrat text-foreground text-sm">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;