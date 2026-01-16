import { Play } from "lucide-react";
import welcomeRoom1 from "@/assets/video-bg-welcome.png";
import welcomeRoom2 from "@/assets/photo-welcome1.png";
import welcomeRoom3 from "@/assets/photo-welcome2.png";
import welcomeicon from "@/assets/icon (7).png";
import welcomeicon1 from "@/assets/icon (8).png";

const WelcomeSection = () => {
  const containerStyles =
    "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

  return (
    <section className="bg-white py-20 lg:py-32">
      <div className={containerStyles}>

        {/* DESKTOP GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[auto_auto_1fr] gap-12 items-start">

          {/* VIDEO (square) */}
          <div className="relative aspect-square w-full max-w-[420px] overflow-hidden rounded-xl group cursor-pointer">
            <img
              src={welcomeRoom1}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt="Welcome video"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl transition-transform group-hover:scale-110">
                <Play className="w-5 h-5 text-black fill-black ml-1" />
              </div>
            </div>
          </div>

          {/* IMAGES COLUMN (same height as video) */}
          <div className="grid grid-rows-2 gap-4 w-[220px] h-full">
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={welcomeRoom2}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                alt="Image 1"
              />
            </div>

            <div className="relative overflow-hidden rounded-xl">
              <img
                src={welcomeRoom3}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                alt="Image 2"
              />
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex flex-col justify-center space-y-6 max-w-xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black tracking-tight leading-tight">
              Welcome to <br /> lorem consectetur
            </h2>

            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
              Class aptent taciti sociosqu ad litora torquent per conubia nostra.
            </p>

            <div className="flex flex-col sm:flex-row bg-black text-white rounded-xl overflow-hidden shadow-xl">
              {/* Luxe & Confort */}
              <div className="flex items-center gap-4 px-6 py-5 flex-1">
                <img className="w-5 h-5 invert" src={welcomeicon1} alt="" />
                <span className="text-xs font-semibold uppercase tracking-widest">
                  Luxe & Confort
                </span>
              </div>

              {/* Vertical Divider */}
              <div className="hidden sm:block w-px bg-white/100" />

              {/* Service Premium */}
              <div className="flex items-center gap-4 px-6 py-5 flex-1">
                <img className="w-5 h-5 invert" src={welcomeicon} alt="" />
                <span className="text-xs font-semibold uppercase tracking-widest">
                  Service Premium
                </span>
              </div>
            </div>


            <button className="w-fit bg-[#FF1B7C] text-white px-10 py-4 rounded-md font-bold uppercase tracking-widest hover:bg-black transition-all">
              Faire une réservation
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
