import bedroomMain from "@/assets/bedroom-main.jpg";
import bedroomSmall1 from "@/assets/bedroom-small-1.jpg";
import bedroomSmall2 from "@/assets/bedroom-small-2.jpg";

const GallerySection = () => {
  return (
    <section className="bg-card relative py-16 lg:py-24 overflow-hidden">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
          {/* Left content */}
          <div className="lg:pr-16 flex flex-col justify-center">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-[42px] font-medium leading-tight mb-6">
              Aptent taciti sociosqu<br className="hidden lg:block" />
              ad litora
            </h2>
            
            <p className="font-sans text-sm lg:text-[15px] leading-relaxed text-foreground/80 mb-10 max-w-[380px]">
              Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.
            </p>

            {/* Small gallery */}
            <div className="flex gap-4">
              <img
                src={bedroomSmall1}
                alt="Cozy bedroom interior"
                className="w-[140px] h-[100px] lg:w-[160px] lg:h-[120px] object-cover"
              />
              <img
                src={bedroomSmall2}
                alt="Modern bedroom with gallery wall"
                className="w-[140px] h-[100px] lg:w-[160px] lg:h-[120px] object-cover"
              />
            </div>
          </div>

          {/* Right - Large image with accent */}
          <div className="relative">
            <img
              src={bedroomMain}
              alt="Luxurious white bedroom"
              className="w-full lg:w-[calc(100%+100px)] h-[350px] lg:h-[500px] object-cover"
            />
            {/* Pink accent block */}
            <div className="absolute -bottom-8 lg:-bottom-12 right-0 lg:-right-8 w-[100px] h-[100px] lg:w-[140px] lg:h-[140px] bg-primary" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
