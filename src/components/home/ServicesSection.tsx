import room1 from "@/assets/photo-serivece-1.png";
import room2 from "@/assets/photo-service-2.png";
import room3 from "@/assets/photo-service-3.png";

const services = [
  {
    image: room1,
    title: "Lorem ipsum dolor sit amet",
    description: "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra."
  },
  {
    image: room2,
    title: "Class aptent taciti sociosqu ad litora",
    description: "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra."
  },
  {
    image: room3,
    title: "Torquent per conubia nostra, per inceptos",
    description: "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra."
  }
];

const ServicesSection = () => {
  // COHÉRENCE GRID : 1440px max-width pour l'alignement global
  const gridContainer = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

  return (
    <section className="w-full py-20 md:py-28 bg-white font-montserrat">
      <div className={gridContainer}>
        
        {/* Section Title - Impact visuel aligné sur la grille */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tighter mb-6"
            style={{
              color: 'hsl(0 0% 10%)',
              fontFamily: "'Playfair Display', serif"
            }}
          >
            Adipiscing elit amet,<br />consectetur.
          </h2>
          <div className="w-20 h-1 bg-[#FF1B7C] mx-auto"></div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 mb-20">
          {services.map((service, index) => (
            <div key={index} className="group flex flex-col items-start">
              {/* Image avec effet de cadre luxury */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm mb-8 bg-gray-100 shadow-sm">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                />
                {/* Overlay discret au survol */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              </div>
              
              {/* Content */}
              <h3 
                className="mb-4 font-bold text-xl md:text-2xl leading-tight tracking-tight"
                style={{
                  color: 'hsl(0 0% 10%)',
                  fontFamily: "'Playfair Display', serif"
                }}
              >
                {service.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500 font-medium border-l-2 border-black/10 pl-6">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button 
            className="px-12 py-5 rounded-sm text-[12px] font-bold  tracking-[0.2em] transition-all duration-500 shadow-xl hover:-translate-y-1"
            style={{
              backgroundColor: '#FF1B7C',
              color: 'white'
            }}
          >
            Réserver maintenant
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;