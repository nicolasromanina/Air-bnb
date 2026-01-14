import room1 from "@/assets/photo-serivece-1.png";
import room2 from "@/assets/photo-service-2.png";
import room3 from "@/assets/photo-service-3.png";

const services = [
  {
    image: room1,
    title: "Lorem ipsum dolor sit amet",
    description: "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
  },
  {
    image: room2,
    title: "Class aptent taciti sociosqu ad litora",
    description: "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
  },
  {
    image: room3,
    title: "Torquent per conubia nostra, per inceptos",
    description: "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
  }
];

const ServicesSection = () => {
  return (
    <section 
      className="py-20"
      style={{
        backgroundColor: 'hsl(0 0% 100%)'
      }}
    >
      <div className="container mx-auto px-8">
        {/* Section Title */}
        <h2 
          className="text-center mb-16 font-medium text-4xl md:text-5xl lg:text-[3.5rem] leading-tight tracking-tight uppercase"
          style={{
            color: 'hsl(0 0% 10%)',
            fontFamily: "'Playfair Display', sans-serif"
          }}
        >
          Adipiscing elit amet,<br />consectetur.
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div key={index} className="group">
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden rounded-sm mb-6">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              
              {/* Content */}
              <h3 
                className="mb-3 font-semibold text-lg md:text-xl leading-tight"
                style={{
                  color: 'hsl(0 0% 10%)',
                  fontFamily: "'Playfair Display', serif"
                }}
              >
                {service.title}
              </h3>
              <p 
                className="text-xs leading-relaxed"
                style={{
                  color: 'hsl(0 0% 40%)'
                }}
              >
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button 
            className="px-8 py-3 rounded-full text-sm font-medium tracking-wide transition-all duration-300 hover:opacity-90"
            style={{
              backgroundColor: 'hsl(342 90% 55%)',
              color: 'hsl(0 0% 100%)'
            }}
          >
            Reserver maintenant
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;