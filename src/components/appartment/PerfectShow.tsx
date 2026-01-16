import React from 'react';
import BedroomImage from '@/assets/bedroom-main.jpg'; 

const PerfectShow: React.FC = () => {
  const IMG_THUMB_1 = "https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1000&auto=format&fit=crop";
  const IMG_THUMB_2 = "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1000&auto=format&fit=crop";

  return (
    <div className="w-full min-h-screen font-['Montserrat'] bg-white">
      
      <section className="relative w-full bg-[#DCDCDC] overflow-hidden flex flex-col xl:flex-row">
        
        {/* PANNEAU GAUCHE */}
        <div className="w-full xl:w-[45%] flex flex-col justify-between px-6 py-12 md:px-12 xl:pl-[8%] xl:pr-12 xl:py-20 relative z-10 bg-[#DCDCDC]">
          <div>
            <h1 className="text-black font-bold text-3xl md:text-5xl xl:text-[42px] leading-[1.1] uppercase mb-8 tracking-tighter">
              Class aptent taciti<br />
              sociosqu ad litora<br />
              torquent .
            </h1>
            <p className="text-gray-800 text-sm md:text-base leading-relaxed max-w-md font-medium">
              Nunc vulputate libero et velit interdum, ac aliquet odio mattis. 
              Class aptent taciti sociosqu ad litora torquent per conubia nostra.
            </p>
          </div>

          {/* Miniatures : cachées sur mobile très petit, ou en wrap */}
          <div className="flex flex-wrap md:flex-row gap-4 md:gap-6 my-8 md:my-12">
            <div className="w-[140px] md:w-[180px] h-[100px] md:h-[130px] overflow-hidden shadow-sm">
              <img src={IMG_THUMB_1} alt="Dining" className="w-full h-full object-cover grayscale-[0.2]" />
            </div>
            <div className="w-[140px] md:w-[180px] h-[100px] md:h-[130px] overflow-hidden shadow-sm">
              <img src={IMG_THUMB_2} alt="Bedroom" className="w-full h-full object-cover grayscale-[0.2]" />
            </div>
          </div>

          <button className="w-full md:w-fit bg-[#FF2E79] hover:bg-[#e6266d] transition-all text-white text-[13px] font-bold py-4 px-10 rounded-md tracking-widest shadow-md">
            Reserver maintenant
          </button>
        </div>

        {/* PANNEAU DROITE */}
        <div className="w-full xl:w-[55%] flex flex-col relative bg-[#DCDCDC] pb-20 xl:pb-0">
          
          {/* 1. L'IMAGE : Responsive height */}
          <div className="h-[350px] md:h-[500px] xl:h-[65vh] w-full relative z-30">
            <img src={BedroomImage} alt="Main Bedroom" className="w-full h-full object-cover shadow-lg" />
            
            {/* 2. LE CARRÉ ROSE : Position ajustée pour mobile et desktop */}
            <div className="absolute -bottom-10 left-6 md:left-20 xl:left-[-80px] w-24 h-24 md:w-32 md:h-32 xl:w-[150px] xl:h-[150px] bg-[#FF2E79] shadow-2xl z-50"></div>
          </div>

          {/* 3. LE RECTANGLE GRIS */}
          <div className="
              relative z-20 bg-[#C4C4C4] 
              w-[90%] md:w-[80%] xl:w-[50%] 
              h-auto min-h-[250px] xl:min-h-[380px] 
              mt-0 xl:-mt-[80px] 
              mx-auto xl:ml-0
              flex items-end p-6 md:p-12 xl:pb-16
              xl:left-[-160px]
              shadow-xl xl:shadow-2xl
          ">
            <div className="w-full">
              <p className="text-base md:text-xl xl:text-[24px] leading-[1.4] font-light text-black">
                Nunc vulputate <span className="text-white font-normal">libero et velit</span><br className="hidden md:block" />
                <span className="text-white font-normal">interdum,</span> ac aliquet odio mattis.<br className="hidden md:block" />
                <span className="text-white font-normal">Class aptent taciti sociosqu ad</span> <span className="font-bold text-black underline decoration-2 underline-offset-4 xl:underline-offset-8">litora</span>
              </p>
            </div>
          </div>
          
          <div className="h-10 xl:h-32"></div>
        </div>
      </section>

      {/* SECTION BAS : Responsive Text Size */}
      <section className="w-full bg-white py-12 md:py-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 xl:pl-[8%]">
            <h2 className="font-bold text-[#A0A0A0] text-3xl md:text-6xl xl:text-8xl mb-0 leading-[0.9] md:leading-none tracking-tighter">
              Lorem ipsum <br className="md:hidden" /> dolor sit amet
            </h2>
        </div>
      </section>
    </div>
  );
};

export default PerfectShow;