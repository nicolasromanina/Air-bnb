import React, { memo, useState } from 'react';
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
import room10 from "@/assets/room-1.jpg";
import room11 from "@/assets/room-2.jpg";
import room12 from "@/assets/room-3.jpg";
import room13 from "@/assets/room-4.jpg";
import room14 from "@/assets/room-5.jpg";
import room15 from "@/assets/room-6.jpg";
import room16 from "@/assets/room-7.jpg";
import room17 from "@/assets/room-8.jpg";
import room18 from "@/assets/room-9.jpg";

// --- CONFIGURATION DE LA GRILLE UNIFIÉE ---
const GRID_CONTAINER = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

// Configuration du chargement progressif
const INITIAL_ROOMS_COUNT = 6;
const LOAD_MORE_INCREMENT = 6;

// Toutes les chambres disponibles
const allRooms = [
  { id: 1, image: room1, title: "Chambre Élégante", description: "Suite spacieuse avec vue panoramique", guests: "jusqu'à 4 invités", bedrooms: "2 chambres à coucher" },
  { id: 2, image: room2, title: "Suite Royale", description: "Luxueuse suite avec balcon privé", guests: "jusqu'à 6 invités", bedrooms: "3 chambres à coucher" },
  { id: 3, image: room3, title: "Chambre Familiale", description: "Parfaite pour les séjours en famille", guests: "jusqu'à 5 invités", bedrooms: "2 chambres à coucher" },
  { id: 4, image: room4, title: "Suite Romantique", description: "Ambiance intimiste et cosy", guests: "jusqu'à 2 invités", bedrooms: "1 chambre à coucher" },
  { id: 5, image: room5, title: "Penthouse Vue Mer", description: "Vue imprenable sur l'océan", guests: "jusqu'à 8 invités", bedrooms: "4 chambres à coucher" },
  { id: 6, image: room6, title: "Chambre Moderne", description: "Design contemporain et épuré", guests: "jusqu'à 3 invités", bedrooms: "1 chambre à coucher" },
  { id: 7, image: room7, title: "Suite Executive", description: "Idéale pour voyages d'affaires", guests: "jusqu'à 4 invités", bedrooms: "2 chambres à coucher" },
  { id: 8, image: room8, title: "Chambre Jardin", description: "Ouverture sur le jardin privé", guests: "jusqu'à 3 invités", bedrooms: "1 chambre à coucher" },
  { id: 9, image: room9, title: "Suite Présidentielle", description: "Le summum du luxe et du confort", guests: "jusqu'à 10 invités", bedrooms: "5 chambres à coucher" },
  { id: 10, image: room10, title: "Studio Urbain", description: "Parfait pour voyageurs solo", guests: "jusqu'à 2 invités", bedrooms: "1 chambre à coucher" },
  { id: 11, image: room11, title: "Chambre Vintage", description: "Décoration rétro et chaleureuse", guests: "jusqu'à 3 invités", bedrooms: "1 chambre à coucher" },
  { id: 12, image: room12, title: "Suite Spa", description: "Avec jacuzzi privatif", guests: "jusqu'à 4 invités", bedrooms: "2 chambres à coucher" },
  { id: 13, image: room13, title: "Chambre Montagne", description: "Vue sur les sommets enneigés", guests: "jusqu'à 5 invités", bedrooms: "3 chambres à coucher" },
  { id: 14, image: room14, title: "Suite Artistique", description: "Décoration par des artistes locaux", guests: "jusqu'à 3 invités", bedrooms: "2 chambres à coucher" },
  { id: 15, image: room15, title: "Chambre Minimaliste", description: "Design scandinave épuré", guests: "jusqu'à 2 invités", bedrooms: "1 chambre à coucher" },
  { id: 16, image: room16, title: "Suite Familiale Deluxe", description: "Espace de vie spacieux", guests: "jusqu'à 8 invités", bedrooms: "4 chambres à coucher" },
  { id: 17, image: room17, title: "Chambre Historique", description: "Dans un bâtiment classé", guests: "jusqu'à 4 invités", bedrooms: "2 chambres à coucher" },
  { id: 18, image: room18, title: "Suite Panoramique", description: "Vue à 360° sur la ville", guests: "jusqu'à 6 invités", bedrooms: "3 chambres à coucher" },
];

const RoomsSection = () => {
  const [visibleRoomsCount, setVisibleRoomsCount] = useState(INITIAL_ROOMS_COUNT);
  
  // Fonction pour charger plus de chambres
  const handleLoadMore = () => {
    setVisibleRoomsCount(prevCount => Math.min(prevCount + LOAD_MORE_INCREMENT, allRooms.length));
  };
  
  // Fonction pour réinitialiser l'affichage
  const handleShowLess = () => {
    setVisibleRoomsCount(INITIAL_ROOMS_COUNT);
  };
  
  // Chambres actuellement visibles
  const visibleRooms = allRooms.slice(0, visibleRoomsCount);
  
  // Vérifier si toutes les chambres sont affichées
  const allRoomsVisible = visibleRoomsCount >= allRooms.length;
  
  return (
    <section className="py-16 lg:py-24 bg-white font-sans">
      <div className={GRID_CONTAINER}>
        
        {/* --- EN-TÊTE : Titre et Description --- */}
        <div className="flex flex-col items-center text-center mb-12 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-bold text-black leading-[1.1] mb-6 tracking-tight">
            Adipiscing elit amet <br className="hidden sm:block" /> consectetur.
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl leading-relaxed font-medium">
            Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent
            taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
            Curabitur tempus urna at turpis condimentum lobortis.
          </p>
          
          {/* Compteur de chambres visibles */}
          <div className="mt-4 text-gray-500 text-sm font-medium">
            Affichage de {visibleRooms.length} sur {allRooms.length} chambres disponibles
          </div>
        </div>
        
        {/* --- GRILLE DES CHAMBRES (3 colonnes sur Desktop) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {visibleRooms.map((room) => (
            <div key={room.id} className="flex justify-center">
              <RoomCard {...room} />
            </div>
          ))}
        </div>
        
        {/* --- ACTIONS : Boutons de contrôle --- */}
        <div className="flex justify-center mt-16 lg:mt-24">
          {!allRoomsVisible ? (
            <button 
              onClick={handleLoadMore}
              className="bg-black hover:bg-[#1a1a1a] text-white font-bold px-12 py-4 rounded-[4px] transition-all duration-300 text-sm tracking-widest shadow-lg active:scale-95 hover:shadow-xl"
            >
              Affichez plus de chambres (+{LOAD_MORE_INCREMENT})
            </button>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p className="text-gray-600 font-medium">
                Toutes nos chambres sont affichées
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={handleShowLess}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-8 py-3 rounded-[4px] transition-all duration-300 text-sm tracking-wider active:scale-95"
                >
                  Réduire l'affichage
                </button>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="bg-black hover:bg-[#1a1a1a] text-white font-bold px-8 py-3 rounded-[4px] transition-all duration-300 text-sm tracking-wider active:scale-95"
                >
                  Retour en haut
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default memo(RoomsSection);