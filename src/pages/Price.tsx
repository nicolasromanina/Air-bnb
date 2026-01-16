import React from 'react';

const PriceSection: React.FC = () => {
  return (
    <section className="font-['Montserrat'] bg-white py-12 px-4 md:px-8 xl:px-0">
      <div className="max-w-[1280px] mx-auto overflow-x-auto">
        {/* Conteneur avec scroll horizontal sur mobile pour préserver l'alignement si nécessaire */}
        <div className="min-w-[1000px] xl:min-w-full">
          
          {/* --- EN-TÊTE DU TABLEAU --- */}
          <div className="grid grid-cols-4 mb-10 border-b border-transparent">
            <h2 className="text-[20px] font-bold uppercase tracking-tight text-black">Client</h2>
            <h2 className="text-[20px] font-bold uppercase tracking-tight text-black">Paiement</h2>
            <h2 className="text-[20px] font-bold uppercase tracking-tight text-black">Montant</h2>
            <h2 className="text-[20px] font-bold uppercase tracking-tight text-black">Comande Total</h2>
          </div>

          {/* --- CONTENU DU TABLEAU --- */}
          <div className="grid grid-cols-4 items-start">
            
            {/* Colonne CLIENT */}
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-[22px] font-bold text-black leading-tight">Jon Doe Lorem</h3>
                <p className="text-[16px] text-[#9CA3AF] leading-tight mt-1">
                  Appartment lorem<br />ipsum
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-[16px] font-bold text-black">Période :</span>
                <span className="text-[16px] text-[#9CA3AF]">3 Jours</span>
              </div>

              <div>
                <span className="text-[16px] font-bold text-black block mb-1">Inclus</span>
                <p className="text-[14px] text-[#9CA3AF] leading-relaxed">
                  Petit déjeuner<br />Pressing
                </p>
              </div>

              <div className="text-[16px] font-bold text-black pt-2">
                Appartement n° 205
              </div>
            </div>

            {/* Colonne PAIEMENT */}
            <div className="flex items-center gap-4 pt-1">
              <div className="w-[60px]">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
                  alt="Mastercard" 
                  className="w-full h-auto"
                />
              </div>
              <span className="text-[28px] font-medium text-black tracking-tighter">**** 4852</span>
            </div>

            {/* Colonne MONTANT */}
            <div className="pt-1">
              <span className="text-[28px] font-bold text-black">800€</span>
            </div>

            {/* Colonne COMANDE TOTAL */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-[20px] font-bold text-black">Prix</span>
                <span className="text-[22px] font-bold text-black">500€</span>
              </div>
              
              <div className="flex justify-between items-center text-[#4B5563]">
                <span className="text-[18px]">Petit déjeuner</span>
                <span className="text-[20px]">100€</span>
              </div>
              
              <div className="flex justify-between items-center text-[#4B5563]">
                <span className="text-[18px]">Pressing</span>
                <span className="text-[20px]">200€</span>
              </div>

              {/* Ligne de séparation et Total */}
              <div className="mt-4 pt-6 border-t-[1.5px] border-black flex justify-between items-center">
                <span className="text-[24px] font-bold text-black">Total</span>
                <span className="text-[28px] font-bold text-black">800€</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceSection;