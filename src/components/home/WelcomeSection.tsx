import { Play, Bed, Wifi } from "lucide-react";
import welcomeRoom1 from "@/assets/video-bg-welcome.png";
import welcomeRoom2 from "@/assets/photo-welcome1.png";
import welcomeRoom3 from "@/assets/photo-welcome2.png";
import welcomeicon from "@/assets/icon (7).png";
import welcomeicon1 from "@/assets/icon (8).png";

//icon (7).png

const WelcomeSection = () => {
  return (
    <section className="bg-background py-12 sm:py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left - Image Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Large image with play button */}
            <div className="row-span-2 relative group cursor-pointer">
              <img
                src={welcomeRoom1}
                alt="Chambre d'hôtel luxueuse"
                className="w-full h-full object-cover rounded-lg aspect-[4/5] sm:aspect-auto"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-background/80 rounded-full flex items-center justify-center group-hover:bg-background transition-colors">
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 text-foreground fill-foreground ml-1" />
                </div>
              </div>
            </div>

            {/* Top right image */}
            <div>
              <img
                src={welcomeRoom2}
                alt="Suite élégante"
                className="w-full h-full object-cover rounded-lg aspect-square"
              />
            </div>

            {/* Bottom right image */}
            <div>
              <img
                src={welcomeRoom3}
                alt="Chambre avec vue"
                className="w-full h-full object-cover rounded-lg aspect-square"
              />
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Welcome to lorem consectetur
            </h2>

            <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">
              Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
              Class aptent taciti sociosqu ad litora torquent per conubia
              nostra, per inceptos himenaeos. Curabitur tempus urna at turpis
              condimentum lobortis.
            </p>

            {/* Feature badges - Stack on mobile */}
            <div className="flex flex-col sm:flex-row bg-foreground text-background rounded-lg overflow-hidden">
              {/* Première section avec Bed */}
              <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 flex-1">
                <img className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" src={welcomeicon1} alt="" />
                <span className="text-xs sm:text-sm font-medium">
                  Lorem ipsum dolor sit amet
                </span>
              </div>
              
              {/* Ligne verticale/horizontale séparatrice */}
              <div className="hidden sm:block w-px bg-background/20" />
              <div className="block sm:hidden w-full h-px bg-background/20" />
              
              
              <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 flex-1">
                <img className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" src={welcomeicon} alt="" />
                <span className="text-xs sm:text-sm font-medium">
                  Lorem ipsum dolor sit amet
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <button className="w-full sm:w-auto bg-primary text-primary-foreground px-6 sm:px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm sm:text-base">
              Faire une reservation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;