import finalRoom1 from "@/assets/final-room-1.jpg";
import finalRoom2 from "@/assets/final-room-2.jpg";

const FinalSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 xl:px-24">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-12">
          {/* Left - Title */}
          <div>
            <h2 className="font-montserrat font-black text-foreground text-2xl lg:text-3xl xl:text-4xl leading-tight uppercase">
              ADIPISCING ELIT AMET,
              <br />
              CONSECTETUR.
            </h2>
          </div>
          
          {/* Right - Text */}
          <div>
            <p className="font-montserrat text-muted-foreground text-xs mb-2">
              Nunc vulputate
              <br />
              libero
            </p>
            <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
              <div 
                className="border-t"
                style={{
                  borderColor: 'hsla(0, 0%, 0%, 0.2)'
                }}
              />
            </div>
            <p className="font-montserrat font-semibold text-foreground text-sm mb-4">
              Class aptent taciti sociosqu ad
              <br />
              litora torquent .
            </p>
            <p className="font-montserrat text-muted-foreground text-sm leading-relaxed max-w-md">
              Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class
              aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos
              himenaeos. Curabitur tempus urna at turpis condimentum lobortis.
              Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate
              libero et velit interdum, ac aliquet odio mattis.
            </p>
          </div>
        </div>
        
        {/* Images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="aspect-[4/3]">
            <img
              src={finalRoom1}
              alt="Modern hotel suite with wooden wardrobe"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-[4/3]">
            <img
              src={finalRoom2}
              alt="Elegant bedroom with ambient lighting"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalSection;
