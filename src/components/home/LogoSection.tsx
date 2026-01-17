import logo1 from "@/assets/p-logo1.png";
import logo2 from "@/assets/p-logo2.png";
import logo3 from "@/assets/p-logo3.png";
import logo4 from "@/assets/p-logo4.png";
import logo5 from "@/assets/p-logo5.png";
import logo6 from "@/assets/p-logo6.png";
import logo7 from "@/assets/p-logo7.png";
import logo8 from "@/assets/p-logo8.png";

function LogoSection() {
  const logos = [
    { name: "Logoipsum 1", logo: logo1 },
    { name: "Logoipsum 2", logo: logo2 },
    { name: "Logoipsum 3", logo: logo3 },
    { name: "Logoipsum 4", logo: logo4 },
    { name: "Logoipsum 5", logo: logo5 },
    { name: "Logoipsum 6", logo: logo6 },
    { name: "Logoipsum 7", logo: logo7 },
    { name: "Logoipsum 8", logo: logo8 }
  ];

  // COHÉRENCE GRID : 1440px max-width pour s'aligner sur le reste du site
  const gridContainer = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

  return (
    <section className="bg-white py-16 md:py-24" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className={gridContainer}>
        
        {/* INNER BOX (Le fond gris clair structuré) */}
        <div className="bg-[#F3F3F3] rounded-sm py-16 md:py-24 px-6 md:px-12 lg:px-16">
          
          {/* Header Section */}
          <div className="text-center mb-16 max-w-[800px] mx-auto">
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-8 leading-[0.9] uppercase tracking-tighter"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Elit amet,<br />consectetur
            </h2>

            <p className="text-sm md:text-base leading-relaxed text-gray-600 font-medium"
               style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra.
            </p>
          </div>

          {/* Logos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {logos.map((item, index) => (
              <div
                key={index}
                className="group bg-white h-[120px] lg:h-[150px] flex items-center justify-center transition-all duration-500 hover:bg-[#FF1493]"
              >
                <div className="flex items-center justify-center p-6">
                  <img 
                    src={item.logo} 
                    alt={item.name}
                    className="max-w-full max-h-[50px] object-contain transition-all duration-500 group-hover:invert group-hover:scale-110"
                  />
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}

export default LogoSection;