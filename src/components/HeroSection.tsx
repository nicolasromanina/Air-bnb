import heroInterior1 from "@/assets/hero-interior-1.jpg";
import heroInterior2 from "@/assets/hero-interior-2.jpg";
import heroInterior3 from "@/assets/hero-interior-3.jpg";
import heroInterior4 from "@/assets/hero-interior-4.jpg";
import heroPerson from "@/assets/hero-person.jpg";

const HeroSection = () => {
  return (
    <section className="min-h-screen bg-background overflow-hidden">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column */}
          <div className="flex flex-col gap-8 lg:gap-12">
            {/* Title and CTA */}
            <div className="space-y-6">
              <h1 className="hero-title text-foreground">
                LOREM
                <br />
                IPSUM
                <br />
                DOLOR SIT
              </h1>

              <p className="text-muted-foreground text-base md:text-lg max-w-md leading-relaxed">
                Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                vulputate libero et velit interdum, ac aliquet odio mattis.
              </p>

              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity w-fit">
                Reserver
              </button>
            </div>

            {/* Person Card */}
            <div className="flex items-start gap-4 max-w-md">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-hero-gray -translate-x-2 translate-y-2 w-28 h-32" />
                <img
                  src={heroPerson}
                  alt="Homme assis"
                  className="relative w-28 h-32 object-cover object-top"
                />
              </div>
              <div className="pt-2 space-y-2">
                <h3 className="font-semibold text-foreground text-lg">
                  Lorem ipsum dolor sit amet
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Korem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                  vulputate libero et velit interdum, ac aliquet odio mattis.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Image Collage with Gray Background */}
          <div className="relative h-[500px] md:h-[600px] lg:h-[700px]">
            {/* Gray Background Container */}
            <div className="absolute inset-0 bg-hero-gray rounded-3xl -right-4 md:-right-8 lg:-right-12" />
            
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-40 md:w-40 md:h-52 bg-hero-pink z-10" />
            <div className="absolute bottom-16 left-0 md:left-8 w-24 h-24 md:w-32 md:h-32 bg-hero-gray z-0" />
            <div className="absolute bottom-0 left-16 md:left-24 w-16 h-16 md:w-20 md:h-20 bg-hero-pink z-10" />

            {/* Main Images */}
            <img
              src={heroInterior1}
              alt="Salon moderne"
              className="absolute top-8 left-0 md:left-8 w-48 md:w-64 lg:w-72 h-56 md:h-72 lg:h-80 object-cover shadow-lg z-20 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            />
            <img
              src={heroInterior2}
              alt="Chambre élégante"
              className="absolute top-1/3 left-1/4 md:left-1/3 w-44 md:w-56 lg:w-64 h-40 md:h-48 lg:h-52 object-cover shadow-lg z-30 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            />
            <img
              src={heroInterior3}
              alt="Appartement vue ville"
              className="absolute top-16 right-0 w-36 md:w-44 lg:w-48 h-44 md:h-52 lg:h-56 object-cover shadow-lg z-20 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            />
            <img
              src={heroInterior4}
              alt="Cuisine moderne"
              className="absolute bottom-24 right-0 w-40 md:w-48 lg:w-52 h-32 md:h-40 lg:h-44 object-cover shadow-lg z-20 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
