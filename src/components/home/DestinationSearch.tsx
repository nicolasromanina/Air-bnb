import { Search, CalendarDays, Users, Map } from "lucide-react";
import { useState } from "react";
// Import de vos assets
import heroMain from "@/assets/vertical-photo-destination.png";
import heroSecondary from "@/assets/left-photo-destination.png";

const RotatingBadge = () => (
  <div className="w-[110px] h-[110px] xl:w-[130px] xl:h-[130px] relative flex-shrink-0">
    <svg 
      viewBox="0 0 120 120" 
      className="w-full h-full animate-[spin_20s_linear_infinite]"
    >
      <defs>
        <path
          id="circlePath"
          d="M 60, 60 m -45, 0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0"
        />
      </defs>
      <circle cx="60" cy="60" r="50" fill="hsl(0 0% 12%)" />
      <text fill="white" fontSize="9.5" fontWeight="500" letterSpacing="2">
        <textPath href="#circlePath" startOffset="0%">
          LOREM IPSUM DOLOR • LOREM IPSUM DOLOR • 
        </textPath>
      </text>
      <circle cx="60" cy="60" r="18" fill="transparent" />
      <polygon
        points="60,48 63,55 71,56 65,61 67,69 60,65 53,69 55,61 49,56 57,55"
        fill="white"
      />
    </svg>
  </div>
);

const DestinationSearch = () => {
  const [searchHover, setSearchHover] = useState(false);

  const InputField = ({ label, placeholder, icon: Icon }: { 
    label: string, 
    placeholder: string, 
    icon: any 
  }) => (
    <div className="mb-4">
      <label className="block text-[13px] font-bold mb-1.5 uppercase tracking-tight text-gray-800">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-white border border-transparent rounded-lg px-5 py-4 text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-gray-200 outline-none transition-all shadow-sm"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#1a1a1a] rounded-md flex items-center justify-center text-white">
          <Icon size={18} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );

  return (
    <section className="min-h-screen bg-[#e9e9e9] relative flex items-center justify-center p-4 lg:p-12 overflow-hidden font-sans">
      
      {/* Carré noir décoratif en haut à droite */}
      <div className="absolute top-0 right-0 w-24 h-24 lg:w-44 lg:h-44 bg-black" />

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        
        {/* Titre principal décalé vers la droite */}
        <div className="lg:col-span-12 mb-8 lg:mb-4 lg:pl-[35%]">
           <h1 className="text-4xl md:text-5xl lg:text-[68px] font-extrabold leading-[0.9] uppercase tracking-tighter text-[#1a1a1a]">
            Sit amet,<br />
            consectetur<br />
            adipiscing elit.
          </h1>
        </div>

        {/* Colonne de Gauche : Composition d'images */}
        <div className="lg:col-span-7 grid grid-cols-12 gap-4 relative">
          
          {/* Badge rotatif positionné par-dessus l'image de gauche */}
          <div className="absolute -top-16 left-[10%] z-20">
            <RotatingBadge />
          </div>

          {/* Image secondaire (Chambre) - Décalée vers le bas */}
          <div className="col-span-5 pt-24">
            <img 
              src={heroSecondary} 
              alt="Intérieur secondaire" 
              className="w-full aspect-[3/4] object-cover rounded-sm"
            />
          </div>

          {/* Image principale (Salon) */}
          <div className="col-span-7">
            <img 
              src={heroMain} 
              alt="Intérieur principal" 
              className="w-full aspect-[4/5] object-cover rounded-sm shadow-xl"
            />
          </div>
        </div>

        {/* Colonne de Droite : Formulaire de recherche */}
        <div className="lg:col-span-5 lg:pl-16 pt-6">
          <div className="max-w-[380px]">
            <h2 className="text-3xl font-bold leading-tight text-[#1a1a1a] mb-2 tracking-tight">
              Lorem ipsum dolor<br />sit amet
            </h2>
            <p className="text-gray-500 text-sm mb-10 leading-relaxed">
              Consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
            </p>

            <div className="space-y-3">
              <InputField label="Votre destination" placeholder="Rechercher une destination" icon={Map} />
              <InputField label="Date" placeholder="Fixer une date" icon={CalendarDays} />
              <InputField label="Voyageur" placeholder="Ajouter des voyageurs" icon={Users} />

              <button 
                onMouseEnter={() => setSearchHover(true)}
                onMouseLeave={() => setSearchHover(false)}
                className={`w-full mt-8 py-4 rounded-xl flex items-center justify-center gap-3 text-white font-bold transition-all duration-300 shadow-lg ${
                  searchHover ? 'bg-[#ff1e6d] -translate-y-0.5' : 'bg-[#ff385c]'
                }`}
              >
                <span className="text-lg">Rechercher</span>
                <Search size={22} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DestinationSearch;