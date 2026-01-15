import { Users, Bed } from "lucide-react";

interface RoomCardProps {
  image: string;
  title: string;
  description: string;
  guests: string;
  bedrooms: string;
}

const RoomCard = ({ image, title, description, guests, bedrooms }: RoomCardProps) => {
  return (
    <div className="bg-card rounded-2xl shadow-lg overflow-hidden">
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="font-montserrat font-bold text-foreground text-lg mb-1">
          {title}
        </h3>
        <p className="font-montserrat text-muted-foreground text-sm mb-4">
          {description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-full text-sm font-montserrat">
            <Users className="w-4 h-4" />
            {guests}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-full text-sm font-montserrat">
            <Bed className="w-4 h-4" />
            {bedrooms}
          </span>
        </div>
        
        {/* Button */}
        <button className="bg-accent text-accent-foreground font-montserrat font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity">
          Reserver
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
