import finalRoom1 from "@/assets/final-room-1.jpg";
import finalRoom2 from "@/assets/final-room-2.jpg";

const FinalSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 xl:px-24">
        {/* Conteneur pour titre et textes en ligne */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-12 lg:mb-16">
          
          {/* Titre */}
          <div className="lg:col-span-4">
            <h2 className="font-montserrat font-black text-foreground text-2xl lg:text-3xl leading-tight uppercase">
              ADIPISCING ELIT AMET,
              <br />
              CONSECTETUR.
            </h2>
          </div>

          {/* Textes */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div>
              <p className="font-montserrat text-muted-foreground text-[10px] mb-2 uppercase tracking-widest">
                Nunc vulputate libero
              </p>
              <div className="border-t border-black/20 mb-4 w-full" />
              
              <p className="font-montserrat font-semibold text-foreground text-sm mb-4">
                Class aptent taciti sociosqu ad litora torquent.
              </p>
              
              <p className="font-montserrat text-muted-foreground text-sm leading-relaxed">
                Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class
                aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos
                himenaeos. Curabitur tempus urna at turpis condimentum lobortis.
              </p>
            </div>
          </div>

        </div>

        {/* Conteneur pour les images en dessous */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
          <div className="aspect-[4/5] lg:aspect-[3/4]">
            <img
              src={finalRoom1}
              alt="Modern hotel suite"
              className="w-full h-full object-cover shadow-sm"
            />
          </div>
          <div className="aspect-[4/5] lg:aspect-[3/4]">
            <img
              src={finalRoom2}
              alt="Elegant bedroom"
              className="w-full h-full object-cover shadow-sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalSection;