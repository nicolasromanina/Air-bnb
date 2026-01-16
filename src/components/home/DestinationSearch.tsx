import { Search, CalendarDays, Users, Map } from "lucide-react";
import { useState } from "react";
import heroMain from "@/assets/vertical-photo-destination.png";
import heroSecondary from "@/assets/left-photo-destination.png";

/* ================= ROTATING BADGE ================= */
const RotatingBadge = () => (
  <div className="w-[100px] h-[100px] xl:w-[120px] xl:h-[120px] relative flex-shrink-0">
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

      <text
        fill="white"
        fontSize="8"
        fontWeight="600"
        letterSpacing="2"
        className="font-montserrat"
      >
        <textPath href="#circlePath">
          LOREM IPSUM • LOREM IPSUM •
        </textPath>
      </text>

      <polygon
        points="60,48 63,55 71,56 65,61 67,69 60,65 53,69 55,61 49,56 57,55"
        fill="white"
      />
    </svg>
  </div>
);

/* ================= MAIN COMPONENT ================= */
const DestinationSearch = () => {
  const [searchHover, setSearchHover] = useState(false);

  const gridContainer =
    "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

  const InputField = ({ label, placeholder, icon: Icon }) => (
    <div className="mb-4 font-montserrat">
      <label className="block text-[11px] font-bold mb-2 tracking-[0.1em] text-gray-800">
        {label}
      </label>

      <div className="relative group">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-white border border-gray-100 rounded-lg px-5 py-4 text-sm
                     placeholder:text-gray-400 focus:ring-2 focus:ring-black/5
                     outline-none transition-all shadow-sm"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9
                        bg-[#1a1a1a] rounded-md flex items-center justify-center
                        text-white group-hover:bg-black transition-colors">
          <Icon size={16} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );

  return (
    <section className="bg-white py-12 md:py-20 overflow-hidden font-montserrat">
      <div className={gridContainer}>
        <div className="bg-[#E5E5E5] rounded-sm relative z-10 py-20 px-6 md:px-12 lg:px-16">

          {/* Décor carré noir */}
          <div className="absolute top-0 right-0 w-20 h-20 lg:w-32 lg:h-32 bg-black z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 items-center relative z-10">

            {/* ================= IMAGES ================= */}
            <div className="lg:col-span-7 grid grid-cols-12 gap-4 relative items-end">


              <div className="absolute -top-[0%] left-[5%] z-20">
                <RotatingBadge />
              </div>

              {/* Petite image */}
              <div className="col-span-5 pt-20 xl:pt-28">
                <div className="overflow-hidden rounded-sm shadow-xl bg-white/20">
                  <img
                    src={heroSecondary}
                    alt="Interior"
                    className="w-full aspect-[3/4] object-cover grayscale
                               hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
              </div>

              {/* ================= TITRE + IMAGE MAIN ================= */}
              <div className="col-span-7 flex flex-col gap-6">

                {/* TITRE AU-DESSUS DE L'IMAGE MAIN */}
                <h1 className="text-2xl md:text-3xl xl:text-4xl
                               font-black uppercase tracking-tight
                               leading-[1.1] text-[#1a1a1a]">
                  Sit amet,<br />
                  consectetur<br />
                  adipiscing elit.
                </h1>

                <div className="overflow-hidden rounded-sm shadow-xl bg-white/20">
                  <img
                    src={heroMain}
                    alt="Main Lounge"
                    className="w-full aspect-[4/5] object-cover grayscale
                               hover:grayscale-0 transition-all duration-1000"
                  />
                </div>

              </div>
            </div>

            {/* ================= FORMULAIRE ================= */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="max-w-[420px]">
                <h2 className="text-2xl xl:text-3xl font-extrabold leading-tight
                               text-[#1a1a1a] mb-4 tracking-tight">
                  Lorem ipsum dolor<br />sit amet
                </h2>

                <p className="text-gray-600 text-sm mb-10 leading-relaxed font-medium">
                  Consectetur adipiscing elit. Nunc vulputate libero et velit
                  interdum, ac aliquet odio mattis.
                </p>

                <InputField
                  label="Votre destination"
                  placeholder="Rechercher une destination"
                  icon={Map}
                />
                <InputField
                  label="Date"
                  placeholder="Fixer une date"
                  icon={CalendarDays}
                />
                <InputField
                  label="Voyageur"
                  placeholder="Ajouter des voyageurs"
                  icon={Users}
                />

                <button
                  onMouseEnter={() => setSearchHover(true)}
                  onMouseLeave={() => setSearchHover(false)}
                  className={`w-full mt-6 py-5 rounded-sm flex items-center
                              justify-center gap-3 text-white font-bold
                              transition-all duration-500 shadow-lg ${
                                searchHover
                                  ? "bg-black scale-[1.01]"
                                  : "bg-[#FF1B7C]"
                              }`}
                >
                  <span className="text-sm  tracking-widest">
                    Rechercher
                  </span>
                  <Search size={18} strokeWidth={3} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default DestinationSearch;
