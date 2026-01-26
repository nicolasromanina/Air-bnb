import React from 'react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';

// Configuration de la grille unifiée
const GRID_CONTAINER = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

function OrderConfirmation() {
  return (
    <div className="min-h-screen bg-white font-sans py-12 lg:py-20">
      
      {/* CONTENEUR PRINCIPAL ALIGNÉ */}
      <div className={GRID_CONTAINER}>
        
        {/* BLOC GRIS ENCASTRÉ (HERO) */}
        <div className="bg-[#EBEBEB] rounded-t-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row items-stretch min-h-[400px]">
            
            {/* Texte de confirmation */}
            <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <div className="mb-6">
                <img src="/Logo.png" alt="Logo" className="w-28 h-auto mb-4" />
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-[#FF2E63] w-8 h-8" />
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-black">Paiement réussi</span>
                </div>
              </div>
              <h1 className="text-[42px] md:text-[56px] font-black leading-[0.9] text-black mb-8 uppercase tracking-tighter">
                COMMANDE <br /> CONFIRMÉE
              </h1>
              <p className="text-base text-gray-800 max-w-md leading-relaxed font-medium">
                Un email de confirmation vous sera envoyé à : <br />
                <span className="font-bold text-black text-lg">exemple@gmail.com</span>
              </p>
              <p className="mt-8 text-[11px] font-black uppercase tracking-widest text-gray-500">
                Commande n° #00045225
              </p>
            </div>

            {/* Image Hero */}
            <div className="flex-1 min-h-[300px] lg:min-h-full">
              <img
                src="https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260"
                alt="Hotel room"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* BLOC BLANC ENCASTRÉ (DÉTAILS) */}
        <div className="bg-white border-x border-b border-gray-100 rounded-b-2xl p-8 md:p-12 lg:p-16 shadow-sm">
          
          <h2 className="text-3xl md:text-4xl font-black text-black mb-12 uppercase tracking-tight">
            Détail de votre commande
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
            
            {/* COLONNE GAUCHE (7/12) */}
            <div className="lg:col-span-7 space-y-12">
              <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <h3 className="text-lg font-black uppercase tracking-tight">
                  Transactions
                </h3>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1">
                  Filtrer <ChevronDown className="w-3 h-3" />
                </button>
              </div>

              {/* Liste des transactions */}
              {[1, 2].map((item) => (
                <div key={item} className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-gray-50 last:border-0">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF2E63]">Client</h4>
                    <p className="font-bold text-lg">Jon Doe Lorem</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Paiement</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-5 bg-black rounded flex items-center justify-center -space-x-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#EB001B]"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#F79E1B]"></div>
                      </div>
                      <span className="text-sm font-bold">**** 5632</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total</h4>
                    <p className="text-2xl font-black italic text-black">900€</p>
                  </div>
                </div>
              ))}
            </div>

            {/* COLONNE DROITE - RÉCAPITULATIF (5/12) */}
            <div className="lg:col-span-5">
              <div className="sticky top-10 bg-[#F8F8F8] rounded-2xl p-8 border border-gray-100">
                <div className="aspect-video w-full overflow-hidden rounded-xl mb-8">
                  <img
                    src="https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=1260"
                    alt="Appartement"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h3 className="text-2xl font-black uppercase tracking-tight mb-6">
                  Nunc Ipsum Suite
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-xs font-bold uppercase">
                    <span className="text-gray-500">3 Nuits</span>
                    <span className="text-black">400€</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold uppercase">
                    <span className="text-gray-500">Services</span>
                    <span className="text-black">500€</span>
                  </div>
                  <div className="pt-6 mt-6 border-t-2 border-white flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest">Total</span>
                    <span className="text-4xl font-black text-[#FF2E63]">900€</span>
                  </div>
                </div>

                <button className="w-full bg-black text-white font-black uppercase tracking-[0.2em] text-[11px] py-5 rounded-xl hover:bg-[#FF2E63] transition-all shadow-xl shadow-black/10">
                  Gérer ma réservation
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default OrderConfirmation;