import { Play, Bed, Wifi } from "lucide-react";
import welcomeRoom1 from "@/assets/welcome-room-1.jpg";
import welcomeRoom2 from "@/assets/welcome-room-2.jpg";
import welcomeRoom3 from "@/assets/welcome-room-3.jpg";

const WelcomeSection = () => {
  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left - Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Large image with play button */}
            <div className="row-span-2 relative group cursor-pointer">
              <img
                src={welcomeRoom1}
                alt="Chambre d'hôtel luxueuse"
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-background/80 rounded-full flex items-center justify-center group-hover:bg-background transition-colors">
                  <Play className="w-6 h-6 text-foreground fill-foreground ml-1" />
                </div>
              </div>
            </div>

            {/* Top right image */}
            <div>
              <img
                src={welcomeRoom2}
                alt="Suite élégante"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Bottom right image */}
            <div>
              <img
                src={welcomeRoom3}
                alt="Chambre avec vue"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Welcome to lorem consectetur
            </h2>

            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
              Class aptent taciti sociosqu ad litora torquent per conubia
              nostra, per inceptos himenaeos. Curabitur tempus urna at turpis
              condimentum lobortis.
            </p>

            {/* Feature badges */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center gap-2 bg-foreground text-background px-6 py-4 rounded-lg">
                <Bed className="w-6 h-6" />
                <span className="text-sm font-medium text-center">
                  Lorem ipsum dolor sit amet
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 bg-foreground text-background px-6 py-4 rounded-lg">
                <Wifi className="w-6 h-6" />
                <span className="text-sm font-medium text-center">
                  Lorem ipsum dolor sit amet
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
              Faire une reservation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
