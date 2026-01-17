import { Search, CalendarDays, Users, Map } from "lucide-react";
import { useState } from "react";
import heroMain from "@/assets/vertical-photo-destination.png";
import heroSecondary from "@/assets/left-photo-destination.png";

/* ================= ROTATING BADGE ================= */
const RotatingBadge = () => (
  <div className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px] xl:w-[200px] xl:h-[200px] relative flex-shrink-0">
    <svg
      viewBox="0 0 140 140"
      className="w-full h-full animate-[spin_20s_linear_infinite]"
    >
      <defs>
        <path
          id="innerCirclePath"
          d="M70,70 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
        />
      </defs>

      <circle cx="70" cy="70" r="60" fill="hsl(0 0% 12%)" />

      <text
        fill="white"
        fontSize="10"
        fontWeight="600"
        letterSpacing="2"
        className="font-montserrat"
      >
        <textPath href="#innerCirclePath">
          LOREM IPSUM • LOREM IPSUM • LOREM IPSUM •
        </textPath>
      </text>

      <polygon
        points="70,55 73,62 81,63 75,68 77,76 70,72 63,76 65,68 59,63 67,62"
        fill="white"
      />
    </svg>
  </div>
);

/* ================= MAIN COMPONENT ================= */
const DestinationSearch = () => {
  const [searchHover, setSearchHover] = useState(false);

  const gridContainer =
    "max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20";

  const InputField = ({ label, placeholder, icon: Icon }) => (
    <div className="mb-4 font-montserrat">
      <label className="block text-[10px] xs:text-[11px] font-bold mb-2 tracking-[0.1em] text-gray-800">
        {label}
      </label>

      <div className="relative group">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-white border border-gray-100 rounded-lg px-4 xs:px-5 py-3 xs:py-4 text-sm
                     placeholder:text-gray-400 focus:ring-2 focus:ring-black/5
                     outline-none transition-all shadow-sm"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 xs:w-9 xs:h-9
                        bg-[#1a1a1a] rounded-md flex items-center justify-center
                        text-white group-hover:bg-black transition-colors">
          <Icon size={16} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );

  return (
    <section className="bg-white py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 overflow-hidden font-montserrat">
      <div className={gridContainer}>
        <div className="bg-[#E5E5E5] rounded-sm relative z-10 py-10 sm:py-14 md:py-16 lg:py-20 px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">

          {/* Décor carré noir - ajusté pour mobile */}
          <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-32 xl:h-32 bg-black z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20 items-center relative z-10">

            {/* ================= IMAGES ================= */}
            <div className="lg:col-span-7 grid grid-cols-12 gap-3 xs:gap-4 sm:gap-5 relative items-end">

              {/* Badge rotatif - position responsive */}
              <div className="absolute -top-[5%] xs:-top-[3%] sm:-top-[2%] md:-top-[1%] lg:-top-[0%] 
                             left-[2%] xs:left-[3%] sm:left-[4%] md:left-[5%] z-20">
                <RotatingBadge />
              </div>

              {/* Petite image */}
              <div className="col-span-5 pt-16 xs:pt-20 sm:pt-24 md:pt-28 lg:pt-32 xl:pt-28">
                <div className="overflow-hidden rounded-sm shadow-lg sm:shadow-xl bg-white/20">
                  <img
                    src={heroSecondary}
                    alt="Interior"
                    className="w-full aspect-[3/4] object-cover grayscale
                               hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
              </div>

              {/* ================= TITRE + IMAGE MAIN ================= */}
              <div className="col-span-7 flex flex-col gap-4 sm:gap-5 md:gap-6">

                {/* TITRE AU-DESSUS DE L'IMAGE MAIN */}
                <h1 className="text-xl xs:text-2xl sm:text-2xl md:text-3xl xl:text-4xl
                               font-black uppercase tracking-tight
                               leading-[1.1] text-[#1a1a1a]">
                  Sit amet,<br />
                  consectetur<br />
                  adipiscing elit.
                </h1>

                <div className="overflow-hidden rounded-sm shadow-lg sm:shadow-xl bg-white/20">
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
              <div className="w-full max-w-[320px] xs:max-w-[360px] sm:max-w-[400px] md:max-w-[420px] mx-auto lg:mx-0">
                <h2 className="text-xl xs:text-2xl sm:text-2xl md:text-3xl xl:text-3xl 
                               font-extrabold leading-tight text-[#1a1a1a] 
                               mb-3 xs:mb-4 tracking-tight">
                  Lorem ipsum dolor<br />sit amet
                </h2>

                <p className="text-gray-600 text-xs xs:text-sm mb-8 xs:mb-10 
                             leading-relaxed font-medium">
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
                  className={`w-full mt-6 py-4 xs:py-5 rounded-sm flex items-center
                              justify-center gap-2 xs:gap-3 text-white font-bold
                              transition-all duration-500 shadow-lg ${
                                searchHover
                                  ? "bg-black scale-[1.01]"
                                  : "bg-[#FF1B7C]"
                              }`}
                >
                  <span className="text-xs xs:text-sm tracking-widest">
                    Rechercher
                  </span>
                  <Search
                    className="w-4 h-4 xs:w-[18px] xs:h-[18px]"
                    strokeWidth={3}
                  />

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