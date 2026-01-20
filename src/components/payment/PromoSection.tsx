import bedroomPromo from "@/assets/bedroom-promo.jpg";
import promoCard from "@/assets/promo-card.jpg";

const PromoSection = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Left Image */}
        <div className="relative">
          <img
            src={bedroomPromo}
            alt="Chambre de luxe"
            className="w-full h-[400px] md:h-[500px] object-cover rounded-lg"
          />
        </div>

        {/* Right Content */}
        <div className="space-y-6">
          <div>
            <span className="font-bold text-foreground">
              Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
            </span>{" "}
            <span className="text-muted-foreground">
              Class aptent taciti sociosqu ad
            </span>{" "}
            <span className="font-bold text-foreground">
              litora torquent per conubia nostra, per inceptos himenaeos.
            </span>
          </div>

          {/* Promo Card */}
          <div className="bg-card rounded-lg overflow-hidden shadow-lg max-w-sm">
            <div className="relative">
              <div className="absolute top-4 left-4 bg-foreground/80 text-card px-3 py-2 rounded">
                <p className="text-xs font-semibold">Nunc vulputate</p>
                <p className="text-xs">libero</p>
              </div>
              <img
                src={promoCard}
                alt="Promotion"
                className="w-full h-40 object-cover"
              />
            </div>
            <div className="p-4 bg-foreground">
              <p className="text-xs text-card/80">
                Rorem ipsum dolor sit amet,
              </p>
              <p className="text-xs text-card/80">
                consectetur adipiscing elit
              </p>
              <div className="flex justify-end mt-2">
                <div className="w-6 h-6 rounded-full bg-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
