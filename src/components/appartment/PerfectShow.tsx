import hotelRoomMain from "@/assets/hotel-room-main.jpg";
import hotelRoomView from "@/assets/hotel-room-view.jpg";
import hotelRoomDetail from "@/assets/hotel-room-detail.jpg";
import { Button } from "@/components/ui/button";

const GRID_CONTAINER = "max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20";

const PerfectShow = () => {
  return (
    <section className="bg-white py-8 sm:py-12 md:py-16 lg:py-0 overflow-hidden">
      
      {/* Conteneur principal avec padding responsive */}
      <div className={`${GRID_CONTAINER}`}>
        <div className="bg-gray-200 relative rounded-2xl sm:rounded-3xl lg:rounded-[2rem] overflow-hidden py-8 sm:py-10 md:py-12 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
          
          {/* Gray Background Block - masqué sur mobile/tablette */}
          <div 
            className="hidden lg:block absolute left-[35%] top-[42%] w-[50%] h-[65%] bg-gray-400 z-0" 
          />
          
          <div className="relative z-10">
            {/* Layout Grid avec comportement responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-0">
              
              {/* Left Content Column */}
              <div className="lg:col-span-5 flex flex-col justify-start pt-4 lg:pt-8 order-2 lg:order-1 relative z-20">
                {/* Titre avec tailles responsive */}
                <h1 className="font-display text-2xl xs:text-2.5xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.1] tracking-tight text-foreground mb-4 sm:mb-6 lg:mb-8 animate-fade-in uppercase">
                  Class aptent taciti sociosqu ad litora torquent.
                </h1>
                
                {/* Texte avec tailles responsive */}
                <p className="font-body text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-8 lg:mb-10 max-w-full sm:max-w-md animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
                </p>
                
                {/* Small Images Grid avec dimensions responsive */}
                <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                  <div className="w-28 h-20 xs:w-32 xs:h-24 sm:w-36 sm:h-28 md:w-40 md:h-28 lg:w-44 lg:h-32 overflow-hidden rounded-lg shadow-sm">
                    <img 
                      src={hotelRoomView} 
                      alt="Vue de la suite" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="w-24 h-20 xs:w-28 xs:h-24 sm:w-32 sm:h-28 md:w-36 md:h-28 lg:w-40 lg:h-32 overflow-hidden rounded-lg shadow-sm">
                    <img 
                      src={hotelRoomDetail} 
                      alt="Détail élégant" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
                
                {/* Bouton avec taille responsive */}
                <div className="animate-fade-in w-full sm:w-fit" style={{ animationDelay: "0.6s" }}>
                  <Button 
                    style={{color:"white"}} 
                    variant="hero" 
                    size="sm" 
                    className="w-full sm:w-auto px-6 sm:px-8 md:px-10 uppercase font-bold tracking-widest text-xs sm:text-xs md:text-xs"
                  >
                    Réserver maintenant
                  </Button>
                </div>
              </div>
              
              {/* Right Image Column */}
              <div className="lg:col-span-7 relative order-1 lg:order-2 mb-8 sm:mb-10 lg:mb-0">
                {/* Image principale avec ratios responsive */}
                <div className="relative lg:ml-8 animate-slide-in-right z-10">
                  <div className="aspect-[4/3] xs:aspect-[5/4] sm:aspect-[4/3] md:aspect-[16/11] lg:aspect-[16/14] overflow-hidden shadow-xl sm:shadow-2xl rounded-xl">
                    <img 
                      src={hotelRoomMain} 
                      alt="Chambre de luxe" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Decorative Pink Square - masqué sur mobile */}
                  <div className="hidden lg:block absolute -bottom-10 left-[-5%] w-20 h-20 lg:w-24 lg:h-24 bg-primary z-20 shadow-xl" />
                </div>
                
                {/* Bottom Text Block avec repositionnement responsive */}
                <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-20 lg:ml-8 lg:pl-32 animate-fade-in relative z-10 lg:right-[33%]" style={{ animationDelay: "0.8s" }}>
                  <p className="font-display text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground leading-relaxed sm:leading-relaxed">
                    Nunc vulputate <span className="text-white">libero et velit</span> interdum, ac aliquet odio mattis. <span className="text-white">Class aptent taciti sociosqu ad</span> litora torquent per conubia
                  </p>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerfectShow;