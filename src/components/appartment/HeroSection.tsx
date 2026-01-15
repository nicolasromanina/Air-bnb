import heroRoom from "@/assets/hero-room.jpg";

const HeroSection = () => {
  return (
    <section className="flex flex-col lg:flex-row min-h-[500px] lg:min-h-[600px]">
      {/* Left content */}
      <div className="flex-1 bg-secondary flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
        <h1 className="text-foreground font-montserrat font-black text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] leading-[1.1] tracking-tight uppercase mb-6">
          INTERDUM,
          <br />
          AC ALIQUET
          <br />
          ODIO MATTIS.
        </h1>
        <p className="text-muted-foreground font-montserrat text-sm lg:text-base max-w-md leading-relaxed">
          Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
          vulputate libero et velit interdum, ac aliquet odio mattis.
        </p>
      </div>
      
      {/* Right image */}
      <div className="flex-1 min-h-[300px] lg:min-h-0">
        <img
          src={heroRoom}
          alt="Luxury modern apartment with grey sofa and wooden partition"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
};

export default HeroSection;
