
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
    <footer 
      className="bg-background"
      style={{
        backgroundColor: 'hsl(0 0% 90%)'
      }}
    >
      {/* Separator line above logo */}
      <div 
        className="max-w-[1280px] mx-auto px-6 lg:px-12"
      >
        <div 
          className="border-t"
          style={{
            borderColor: 'hsla(0, 0%, 0%, 0.2)'
          }}
        />
      </div>

      {/* Upper footer */}
      <div 
        className="max-w-[1280px] mx-auto px-6 lg:px-12 py-12 lg:py-16"
      >
        {/* Logo centered on top */}
        <div className="flex justify-center mb-10">
          <img 
            src="./Logo.png" 
            alt="SWEETHOME Logo" 
            className="h-8 w-auto" 
          />
        </div>

      {/* Separator line above */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div 
          className="border-t"
          style={{
            borderColor: 'hsla(0, 0%, 0%, 0.2)'
          }}
        />
      </div>

      <br/>

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
            <h4 
              className="font-semibold text-sm tracking-wider uppercase mb-4"
              style={{
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Lien Utiles
            </h4>
            <ul className="space-y-2">
              {linksUtiles.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-sm transition-colors"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      color: 'hsla(0, 0%, 0%, 0.7)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'hsl(0 0% 0%)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'hsla(0, 0%, 0%, 0.7)';
                    }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages légales */}
          <div>
            <h4 
              className="font-semibold text-sm tracking-wider uppercase mb-4"
              style={{
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Pages Legales
            </h4>
            <ul className="space-y-2">
              {pagesLegales.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-sm transition-colors"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      color: 'hsla(0, 0%, 0%, 0.7)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'hsl(0 0% 0%)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'hsla(0, 0%, 0%, 0.7)';
                    }}
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
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div 
          className="border-t"
          style={{
            borderColor: 'hsla(0, 0%, 0%, 0.2)'
          }}
        />
      </div>

      {/* Banner */}
      <div 
        className="py-10 lg:py-16 overflow-hidden"
      >
        <h2 
          className="text-5xl md:text-7xl lg:text-[120px] xl:text-[160px] font-medium italic text-center leading-none tracking-tight"
          style={{
            color: 'hsl(0 0% 0%)',
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'normal'
          }}
        >
          Adipiscing elit
        </h2>
      </div>
    </footer>
  );
};

export default Footer;