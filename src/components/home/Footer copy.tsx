import Logo from "./Logo";
import footer1 from "@/assets/footer-1.jpg";
import footer2 from "@/assets/footer-2.jpg";
import footer3 from "@/assets/footer-3.jpg";
import footer4 from "@/assets/footer-4.jpg";

const linksUtiles = [
  "Nunc vulputate libero",
  "Curabitur tempus",
  "Vestibulum eu nisl",
  "Inceptos himenaeos",
];

const pagesLegales = [
  "Curabitur tempus",
  "Inceptos himenaeos",
  "Nunc vulputate libero",
  "Vestibulum eu nisl",
];

const Footer = () => {
  return (
    <footer className="bg-background">
      {/* Separator line above logo */}
      <div className="section-container">
        <div className="border-t border-foreground/20" />
      </div>

      {/* Upper footer */}
      <div className="section-container py-12 lg:py-16">
        {/* Logo centered on top */}
        <div className="flex justify-center mb-10">
          <Logo />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Images grid */}
          <div className="col-span-2 md:col-span-1 grid grid-cols-2 gap-2">
            <img
              src={footer1}
              alt="Living room"
              className="w-full h-[80px] lg:h-[100px] object-cover"
            />
            <img
              src={footer2}
              alt="Modern interior"
              className="w-full h-[80px] lg:h-[100px] object-cover"
            />
            <img
              src={footer3}
              alt="Bedroom"
              className="w-full h-[80px] lg:h-[100px] object-cover"
            />
            <img
              src={footer4}
              alt="Modern bedroom"
              className="w-full h-[80px] lg:h-[100px] object-cover"
            />
          </div>

          {/* Spacer for alignment */}
          <div className="hidden md:block" />

          {/* Liens utiles */}
          <div>
            <h4 className="font-sans font-semibold text-sm tracking-wider uppercase mb-4">
              Lien Utiles
            </h4>
            <ul className="space-y-2">
              {linksUtiles.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="font-sans text-sm text-foreground/70 hover:text-foreground transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages légales */}
          <div>
            <h4 className="font-sans font-semibold text-sm tracking-wider uppercase mb-4">
              Pages Legales
            </h4>
            <ul className="space-y-2">
              {pagesLegales.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="font-sans text-sm text-foreground/70 hover:text-foreground transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Separator line above banner */}
      <div className="section-container">
        <div className="border-t border-foreground/20" />
      </div>

      {/* Banner */}
      <div className="py-10 lg:py-16 overflow-hidden">
        <h2 className="font-serif text-5xl md:text-7xl lg:text-[120px] xl:text-[160px] font-medium italic text-foreground text-center leading-none tracking-tight">
          Adipiscing elit
        </h2>
      </div>
    </footer>
  );
};

export default Footer;
