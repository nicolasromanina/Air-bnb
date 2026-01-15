import RoomCard from "./RoomCard";
import room1 from "@/assets/room-1.jpg";
import room2 from "@/assets/room-2.jpg";
import room3 from "@/assets/room-3.jpg";
import room4 from "@/assets/room-4.jpg";
import room5 from "@/assets/room-5.jpg";
import room6 from "@/assets/room-6.jpg";
import room7 from "@/assets/room-7.jpg";
import room8 from "@/assets/room-8.jpg";
import room9 from "@/assets/room-9.jpg";

const rooms = [
  { image: room1, title: "Curabitur tempus urna at turpis", description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit", guests: "jusqu'à 4 invités", bedrooms: "2 chambres à coucher" },
  { image: room2, title: "Curabitur tempus urna at turpis", description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit", guests: "jusqu'à 4 invités", bedrooms: "2 chambres à coucher" },
  { image: room3, title: "Curabitur tempus urna at turpis", description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit", guests: "jusqu'à 4 invités", bedrooms: "2 chambres à coucher" },
  { image: room4, title: "Curabitur tempus urna at turpis", description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit", guests: "jusqu'à 4 invités", bedrooms: "2 chambres à coucher" },
  { image: room5, title: "Curabitur tempus urna at turpis", description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit", guests: "jusqu'à 4 invités", bedrooms: "2 chambres à coucher" },
  { image: room6, title: "Curabitur tempus urna at turpis", description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit", guests: "jusqu'à 4 invités", bedrooms: "2 chambres à coucher" },
  { image: room7, title: "Curabitur tempus urna at turpis", description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit", guests: "jusqu'à 4 invités", bedrooms: "2 chambres à coucher" },
  { image: room8, title: "Curabitur tempus urna at turpis", description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit", guests: "jusqu'à 4 invités", bedrooms: "2 chambres à coucher" },
  { image: room9, title: "Curabitur tempus urna at turpis", description: "Rorem ipsum dolor sit amet, consectetur adipiscing elit", guests: "jusqu'à 4 invités", bedrooms: "2 chambres à coucher" },
];

const RoomsSection = () => {
  return (
    <section className="py-16 lg:py-24 px-6 lg:px-16 xl:px-24 bg-background">
      {/* Header */}
      <div className="text-center mb-12 lg:mb-16">
        <h2 className="font-montserrat font-bold text-foreground text-3xl lg:text-4xl xl:text-[42px] mb-4">
          Adipiscing elit amet
          <br />
          consectetur.
        </h2>
        <p className="font-montserrat text-muted-foreground text-sm lg:text-base max-w-2xl mx-auto leading-relaxed">
          Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent
          taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
          Curabitur tempus urna at turpis condimentum lobortis.
        </p>
      </div>
      
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
        {rooms.map((room, index) => (
          <RoomCard key={index} {...room} />
        ))}
      </div>
      
      {/* Show more button */}
      <div className="flex justify-center mt-12 lg:mt-16">
        <button className="bg-primary text-primary-foreground font-montserrat font-medium px-10 py-4 rounded-full hover:opacity-90 transition-opacity">
          Affichez plus
        </button>
      </div>
    </section>
  );
};

export default RoomsSection;
