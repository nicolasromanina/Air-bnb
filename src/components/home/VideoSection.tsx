import { Play } from "lucide-react";
import bedroomMain from "@/assets/bedroom-main.png";
import bedroom1 from "@/assets/image-above.png";
import bedroom2 from "@/assets/image-center.png";
import bedroom3 from "@/assets/image-below.png";

const VideoSection = () => {
  return (
    <section 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundColor: 'hsl(0 0% 87%)'
      }}
    >
      {/* Decorative black block - top left - MODIFIÉ pour atteindre les bords */}
      <div className="absolute top-0 left-0 w-24 h-24 md:w-32 md:h-32 bg-[hsl(0_0%_10%)]" />
      
      {/* Decorative pink block - bottom right */}
      <div className="absolute bottom-0 right-0 w-24 h-24 md:w-40 md:h-40 bg-[hsl(342_90%_55%)]" />

      <div className="container mx-auto px-8 pt-32 pb-16">
        {/* Header Text */}
        <div className="text-center mb-12">
          <h1 
            className="mb-6 font-medium text-4xl md:text-5xl lg:text-[3.5rem] leading-tight tracking-tight"
            style={{
              color: 'hsl(0 0% 10%)',
              fontFamily: "'Playfair Display', serif"
            }}
          >
            Adipiscing elit amet,<br />consectetur.
          </h1>
          <p 
            className="px-4 text-sm md:text-base leading-relaxed max-w-2xl mx-auto"
            style={{
              color: 'hsl(0 0% 40%)'
            }}
          >
            Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti
            sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur
            tempus urna at turpis condimentum lobortis.
          </p>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-12">
          {/* Main large image with play button */}
          <div className="lg:col-span-3 relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden rounded-sm group">
            <img
              src={bedroomMain}
              alt="Chambre luxueuse moderne"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button 
                className="w-16 h-16 rounded-full border-2 border-white/80 flex items-center justify-center backdrop-blur-sm bg-white/10 transition-all duration-300 hover:bg-white/20 hover:scale-110"
                aria-label="Lire la vidéo"
              >
                <Play className="w-6 h-6 text-white fill-white ml-1" />
              </button>
            </div>
          </div>

          {/* Right side gallery - 3 stacked images */}
          <div className="hidden lg:flex flex-col gap-4">
            <div className="flex-1 overflow-hidden rounded-sm">
              <img
                src={bedroom1}
                alt="Vue de la chambre"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="flex-1 overflow-hidden rounded-sm">
              <img
                src={bedroom2}
                alt="Détail de la chambre"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="flex-1 overflow-hidden rounded-sm">
              <img
                src={bedroom3}
                alt="Perspective de la chambre"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button 
            className="px-8 py-3 rounded-sm text-sm tracking-wide transition-all duration-300 hover:bg-black/80"
            style={{
              backgroundColor: 'hsl(0 0% 10%)',
              color: 'hsl(0 0% 87%)',
              fontFamily: "'Playfair Display', serif"
            }}
          >
            Reserver maintenant
          </button>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;