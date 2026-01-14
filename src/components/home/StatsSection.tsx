import { Wifi, Bed, TreePine, Car, Waves } from "lucide-react";
import PropertyCard from "@/components/home/PropertyCard";
import StatsBar from "@/components/home/StatsBar";
import propertyImage from "@/assets/image-card-property.png";

const StatsSection = () => {
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
    <div className="min-h-screen bg-background py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Property Card */}
        <PropertyCard
          image={propertyImage}
          title="Per conubia nostra, per inceptos himenaeos"
          price={600}
          priceUnit="Nuit"
          features={propertyFeatures}
          description="Lorem ispum dolor"
        />
      <br/>
       <br/>
        {/* Stats Bar */}
        <StatsBar stats={stats} />
      </div>
    </div>
  );
};

export default StatsSection;
