import hotelRoomMain from "@/assets/hotel-room-main.jpg";
import hotelRoomView from "@/assets/hotel-room-view.jpg";
import hotelRoomDetail from "@/assets/hotel-room-detail.jpg";
import { Button } from "@/components/ui/button";

const GRID_CONTAINER = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

const PerfectShow = () => {
  return (
    // La section extérieure est maintenant blanche
    <section className="bg-white py-8 lg:py-20 overflow-hidden">
      
      {/* Le fond gray-200 est maintenant appliqué ici, limité par le GRID_CONTAINER */}
      <div className={`${GRID_CONTAINER}`}>
        <div className="bg-gray-200 relative rounded-[2rem] overflow-hidden py-12 lg:py-24 px-6 md:px-12 lg:px-20">
          
          {/* Gray Background Block Décoratif (le rectangle gris plus foncé) */}
          <div 
            className="hidden lg:block absolute left-[35%] top-[42%] w-[50%] h-[65%] bg-gray-400 z-0" 
          />
          
          <div className="relative z-10">
            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-0">
              
              {/* Left Content Column */}
              <div className="lg:col-span-5 flex flex-col justify-start pt-4 lg:pt-8 order-2 lg:order-1 relative z-20">
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.1] tracking-tight text-foreground mb-6 lg:mb-8 animate-fade-in uppercase">
                  Class aptent taciti sociosqu ad litora torquent.
                </h1>
                
                <p className="font-body text-muted-foreground text-sm md:text-base leading-relaxed mb-8 lg:mb-10 max-w-md animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
                </p>
                
                {/* Small Images Grid */}
                <div className="flex gap-4 mb-8 lg:mb-10 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                  <div className="w-32 h-24 md:w-40 md:h-28 lg:w-44 lg:h-32 overflow-hidden rounded-lg shadow-sm">
                    <img 
                      src={hotelRoomView} 
                      alt="Suite luxueuse" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="w-28 h-24 md:w-36 md:h-28 lg:w-40 lg:h-32 overflow-hidden rounded-lg shadow-sm">
                    <img 
                      src={hotelRoomDetail} 
                      alt="Détail élégant" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
                
                <div className="animate-fade-in bg-primary w-fit" style={{ animationDelay: "0.6s" }}>
                  <Button style={{color:"white"}} variant="hero" size="lg" className="px-10 uppercase font-bold tracking-widest text-xs">
                    Reserver maintenant
                  </Button>
                </div>
              </div>
              
              {/* Right Image Column */}
              <div className="lg:col-span-7 relative order-1 lg:order-2">
                <div className="relative lg:ml-8 animate-slide-in-right z-10">
                  <div className="aspect-[4/3] lg:aspect-[16/14] overflow-hidden shadow-2xl rounded-xl">
                    <img 
                      src={hotelRoomMain} 
                      alt="Chambre de luxe" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Decorative Pink Square */}
                  <div className="hidden lg:block absolute -bottom-10 left-[-5%] w-20 h-20 lg:w-24 lg:h-24 bg-primary z-20 shadow-xl" />
                </div>
                
                {/* Bottom Text Block */}
                <div className="mt-16 lg:mt-20 lg:ml-8 lg:pl-32 animate-fade-in relative z-10 lg:right-[33%]" style={{ animationDelay: "0.8s" }}>
                  <p className="font-display text-xl md:text-2xl lg:text-3xl text-foreground leading-relaxed">
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