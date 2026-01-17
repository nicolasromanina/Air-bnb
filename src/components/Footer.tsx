import footer1 from "@/assets/footer-1.jpg";
import footer2 from "@/assets/footer-2.jpg";
import footer3 from "@/assets/footer-3.jpg";
import footer4 from "@/assets/footer-4.jpg";

const Footer = () => {
  // COHÉRENCE TOTALE AVEC LE HERO : 
  // On reprend exactement "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20"
  const gridContainer = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

  return (
    <footer className="w-full bg-white pb-12 text-black" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {/* L'enveloppe ci-dessous applique la marge (gridContainer).
          Le fond gris (#E5E5E5) s'arrête là où la grille s'arrête.
      */}
      <div className={gridContainer}>
        <div className="bg-[#E5E5E5] rounded-sm pt-20 overflow-hidden">
          
          {/* Contenu interne avec un padding pour ne pas coller aux bords du bloc gris */}
          <div className="px-8 md:px-12 lg:px-16">
            
            {/* Bordure haute interne */}
           

            {/* Logo Centré */}
            <div className="flex justify-center mb-24">
              <img src="./Logo.png" alt="SWEETHOME" className="h-10 w-auto" />
            </div>
            <div className="border-t border-black/20 mb-5" />
            {/* Grille de contenu 4 colonnes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-20">
              
              {/* Galerie - Col 1 */}
              <div className="grid grid-cols-2 gap-2">
                {[footer1, footer2, footer3, footer4].map((img, i) => (
                  <div key={i} className="aspect-square overflow-hidden rounded-sm bg-black/5">
                    <img 
                      src={img} 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                      alt="" 
                    />
                  </div>
                ))}
              </div>

              {/* Spacer Luxe - Col 2 */}
              <div className="hidden lg:block" />

              {/* Liens Utiles - Col 3 */}
              <div className="flex flex-col">
                <h4 className="font-bold text-[10px] tracking-[0.3em] uppercase mb-8 opacity-90"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Liens Utiles
                </h4>
                <ul className="space-y-4">
                  {["Nunc vulputate libero", "Curabitur tempus", "Vestibulum eu nisl", "Inceptos himenaeos"].map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm opacity-50 hover:opacity-100 transition-opacity"
                         style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pages Légales - Col 4 */}
              <div className="flex flex-col">
                <h4 className="font-bold text-[10px] tracking-[0.3em] uppercase mb-8 opacity-90"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Pages Légales
                </h4>
                <ul className="space-y-4">
                  {["Mentions Légales", "Politique de confidentialité", "Conditions Générales", "Contact"].map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm opacity-50 hover:opacity-100 transition-opacity"
                         style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
             <div className="border-t border-black/20 mb-5" />

            {/* Bannière Visuelle - Texte Gigantesque */}
            <div className="border-t border-black/5">
              <div className="py-20 lg:py-32">
                <h2 
                  className="text-[10vw] lg:text-[130px] font-medium text-center leading-none tracking-tighter" 
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Adipiscing elit
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COPYRIGHT - Aligné sur la même grille extérieure */}
      <div className={`${gridContainer} mt-8`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] tracking-[0.2em] opacity-40 px-2">
          <p style={{ fontFamily: "'Montserrat', sans-serif" }}>© 2026 SWEETHOME. All rights reserved.</p>
          <p style={{ fontFamily: "'Montserrat', sans-serif" }}>Designed for Excellence</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;