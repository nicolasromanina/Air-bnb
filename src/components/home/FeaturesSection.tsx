import { Sofa, Home } from "lucide-react";
import livingMain from "@/assets/b-photo-center-feature.png";
import thumb1 from "@/assets/s-photo-feature-1.png";
import thumb2 from "@/assets/s-photo-feature-2.png";

const features = [
  {
    icon: Sofa,
    title: "Rorem ipsum dolor sit amet"
  },
  {
    icon: Home,
    title: "Rorem ipsum dolor sit amet"
  }
];

const FeaturesSection = () => {
  // COHÉRENCE HERO/FOOTER : Grid de 1440px
  const gridContainer = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

  return (
    <section className="w-full bg-white py-12 md:py-20 font-montserrat">
      {/* WRAPPER DE LA GRILLE (Marges extérieures pour Full HD) */}
      <div className={gridContainer}>
        
        {/* INNER BOX (Le fond gris délimité) */}
        <div className="bg-[#DEDEDE] rounded-sm py-16 md:py-24 px-6 md:px-12 lg:px-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-center">
            
            {/* 1. Colonne Gauche - Titre & Features */}
            <div className="space-y-10">
              <h2 
                className="text-4xl md:text-5xl font-bold leading-[1] tracking-tighter uppercase"
                style={{
                  color: 'hsl(0 0% 10%)',
                  fontFamily: "'Playfair Display', serif"
                }}
              >
                Elit amet<br />consectetur
              </h2>
              
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-5 p-5 rounded-sm bg-white shadow-sm transition-transform hover:translate-x-2 duration-300"
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-black">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-tight text-black">
                      {feature.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Colonne Centrale - Image Principale */}
            <div className="aspect-[3/4] overflow-hidden rounded-sm shadow-2xl relative group">
              <img
                src={livingMain}
                alt="Salon moderne"
                className="w-full h-full object-cover transition-all duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-110"
              />
              {/* Overlay subtil pour le look luxury */}
              <div className="absolute inset-0 border-[15px] border-white/10 pointer-events-none" />
            </div>

            {/* 3. Colonne Droite - Description & Miniatures */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 
                  className="text-2xl md:text-3xl font-bold leading-tight uppercase tracking-tight"
                  style={{
                    color: 'hsl(0 0% 10%)',
                    fontFamily: "'Playfair Display', serif"
                  }}
                >
                  Aptent taciti<br />sociosqu ad litora
                </h3>
                
                <p className="text-sm leading-relaxed text-gray-600 font-medium">
                  Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra.
                </p>
              </div>
              
              <div className="flex gap-4">
                <div className="w-1/2 aspect-square overflow-hidden rounded-sm shadow-lg group">
                  <img
                    src={thumb1}
                    alt="Intérieur"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div className="w-1/2 aspect-square overflow-hidden rounded-sm shadow-lg group">
                  <img
                    src={thumb2}
                    alt="Chambre"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;