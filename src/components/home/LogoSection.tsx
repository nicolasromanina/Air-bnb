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

  return (
    <section className="bg-[#F8F9FA] px-8 lg:px-16 xl:px-24 py-20 lg:py-28">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[48px] lg:text-[56px] font-bold text-black mb-6 leading-tight">
            Elit amet,<br />consectetur
          </h2>

          <p className="text-[16px] leading-relaxed text-black/80 max-w-[800px] mx-auto">
            Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {logos.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 h-[140px] flex items-center justify-center hover:shadow-lg transition-shadow p-4"
            >
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <img 
                    src={item.logo} 
                    alt={item.name}
                    className="max-w-full max-h-[60px] object-contain"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LogoSection;