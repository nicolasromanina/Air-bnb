import React, { memo } from 'react';
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

// --- CONFIGURATION DE LA GRILLE UNIFIÉE ---
const GRID_CONTAINER = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

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
    <section className="py-16 lg:py-24 bg-white font-sans">
      <div className={GRID_CONTAINER}>
        
        {/* --- EN-TÊTE : Titre et Description --- */}
        <div className="flex flex-col items-center text-center mb-12 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-bold text-black leading-[1.1] mb-6  tracking-tight">
            Adipiscing elit amet <br className="hidden sm:block" /> consectetur.
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl leading-relaxed font-medium">
            Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent
            taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
            Curabitur tempus urna at turpis condimentum lobortis.
          </p>
        </div>
        
        {/* --- GRILLE DES CHAMBRES (3 colonnes sur Desktop) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {rooms.map((room, index) => (
            <div key={index} className="flex justify-center">
              <RoomCard {...room} />
            </div>
          ))}
        </div>
        
        {/* --- ACTIONS : Bouton Affichez plus --- */}
        <div className="flex justify-center mt-16 lg:mt-24">
          <button 
            className="bg-black hover:bg-[#1a1a1a] text-white font-bold px-12 py-4 rounded-[4px] transition-all duration-300 text-sm tracking-widest shadow-lg active:scale-95"
          >
            Affichez plus
          </button>
        </div>

      </div>
    </section>
  );
};

export default memo(RoomsSection);