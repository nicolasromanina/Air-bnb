import { Wifi, Bed, TreePine, Car, Waves } from "lucide-react";
import PropertyCard from "@/components/home/PropertyCard";
import StatsBar from "@/components/home/StatsBar";
import propertyImage from "@/assets/image-card-property.png";

const StatsSection = () => {
  // COHÉRENCE GRID : Même max-width et paddings que le Hero, la Navbar et le Footer
  const gridContainer = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

  const propertyFeatures = [
    { icon: <Wifi className="w-4 h-4" />, label: "Wifi" },
    { icon: <Bed className="w-4 h-4" />, label: "4 chambres à coucher" },
    { icon: <TreePine className="w-4 h-4" />, label: "Terrasse" },
    { icon: <Car className="w-4 h-4" />, label: "Garage" },
    { icon: <Waves className="w-4 h-4" />, label: "Piscine" },
  ];

  const stats = [
    { value: "+15", label: "Lorem ispum dolor" },
    { value: "+20", label: "Class aptent taciti" },
    { value: "+2K", label: "Customer lorem dolor" },
    { value: "100%", label: "Guarantees apdent elit" },
  ];

  return (
    <section className="w-full bg-white py-16 md:py-24 font-montserrat">
      <div className={gridContainer}>

        {/* Espace de présentation de la carte */}
        <div className="flex justify-center mb-24 lg:mb-32">
          <div className="w-full lg:max-w-[1100px] transition-transform duration-700 hover:scale-[1.01]">
            <PropertyCard
              image={propertyImage}
              title="Per conubia nostra, per inceptos himenaeos"
              price={600}
              priceUnit="Nuit"
              features={propertyFeatures}
              description="Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra."
            />
          </div>
        </div>

        {/* Barre de Statistiques - On l'encapsule dans un bloc stylisé */}
        <div className="relative">
          {/* Un petit rappel de couleur en fond pour dynamiser la barre */}
          <div className="absolute inset-0 bg-[#F3F3F3] -rotate-1 transform scale-105 rounded-sm -z-10 opacity-50 hidden md:block" />
          
          <div className="bg-white py-12 px-6 shadow-xl border border-gray-100 rounded-sm">
            <StatsBar stats={stats} />
          </div>
        </div>

      </div>
    </section>
  );
};

export default StatsSection;