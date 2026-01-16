import { Play } from "lucide-react";
import welcomeRoom1 from "@/assets/video-bg-welcome.png";
import welcomeRoom2 from "@/assets/photo-welcome1.png";
import welcomeRoom3 from "@/assets/photo-welcome2.png";
import welcomeicon from "@/assets/icon (7).png";
import welcomeicon1 from "@/assets/icon (8).png";

const WelcomeSection = () => {
  const containerStyles = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

  return (
    <section className="bg-white py-20 lg:py-32">
      <div className={containerStyles}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          
          {/* Left - Image Grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div className="row-span-2 relative group cursor-pointer overflow-hidden rounded-xl">
              <img src={welcomeRoom1} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 aspect-[4/5]" alt="" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                  <Play className="w-6 h-6 text-black fill-black ml-1" />
                </div>
              </div>
            </div>
            <img src={welcomeRoom2} className="rounded-xl aspect-square object-cover hover:scale-105 transition-all duration-500" alt="" />
            <img src={welcomeRoom3} className="rounded-xl aspect-square object-cover hover:scale-105 transition-all duration-500" alt="" />
          </div>

          {/* Right - Content */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black tracking-tight leading-tight">
                Welcome to <br /> lorem consectetur
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
                Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra.
              </p>
            </div>

            <div className="flex flex-col sm:row bg-black text-white rounded-xl overflow-hidden shadow-xl">
              <div className="flex items-center gap-4 px-6 py-5 flex-1 border-b sm:border-b-0 sm:border-r border-white/10">
                <img className="w-6 h-6 invert" src={welcomeicon1} alt="" />
                <span className="text-sm font-semibold uppercase tracking-wider">Luxe & Confort</span>
              </div>
              <div className="flex items-center gap-4 px-6 py-5 flex-1">
                <img className="w-6 h-6 invert" src={welcomeicon} alt="" />
                <span className="text-sm font-semibold uppercase tracking-wider">Service Premium</span>
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