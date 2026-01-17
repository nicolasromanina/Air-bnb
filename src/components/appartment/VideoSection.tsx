import { Play } from "lucide-react";
// Assurez-vous que le chemin de l'image est correct ou remplacez par une URL pour tester
import videoCover from "@/assets/video-cover.jpg"; 

// Configuration de la grille unifiée
const GRID_CONTAINER = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

const VideoSection = () => {
  return (
    <section className="py-2 lg:py-0 bg-white">
      <div className={GRID_CONTAINER}>
        
        {/* BLOC GRIS ENCASTRÉ */}
        <div className="bg-[#EBEBEB] rounded-2xl p-8 md:p-12 lg:p-16 overflow-hidden">
          

          {/* Video container */}
          <div className="relative aspect-video lg:aspect-[16/7] overflow-hidden rounded-xl shadow-2xl group cursor-pointer">
            <img
              src={videoCover} // Utilise votre import
              alt="Luxury hotel room video preview"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Overlay sombre au survol */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all duration-300"></div>
            
            {/* Play button central */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="relative flex items-center justify-center">
                {/* Effet d'onde (Ping) */}
                <span className="absolute inline-flex h-24 w-24 rounded-full bg-white opacity-20 animate-ping"></span>
                
                {/* Bouton réel */}
                <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-8 h-8 lg:w-10 lg:h-10 text-black fill-black ml-1" />
                </div>
              </button>
            </div>

            {/* Légende en bas de vidéo */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <span className="text-white text-[10px] font-black  tracking-widest bg-black/20 backdrop-blur-md px-3 py-1 rounded">
                 Play Tour
               </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default VideoSection;