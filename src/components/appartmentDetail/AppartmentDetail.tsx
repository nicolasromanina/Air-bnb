import { Users, Bed, Building2, Tv, Armchair, BedDouble, Play, ChevronDown, Minus, Plus } from 'lucide-react';
import { useState } from 'react';

// Configuration de la grille unifiée
const GRID_CONTAINER = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

function AppartmentDetail() {
  const [selectedService, setSelectedService] = useState(null);
  const [nights, setNights] = useState(2);

  const toggleService = (service) => {
    setSelectedService(selectedService === service ? null : service);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* --- HERO SECTION --- */}
      <section className="pt-8 pb-12">
        <div className={GRID_CONTAINER}>
          <div className="bg-[#EBEBEB] rounded-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            <div className="flex items-center justify-start p-8 lg:p-16 xl:p-20">
              <div className="max-w-[500px]">
                <h1 className="text-[40px] lg:text-[52px] font-black leading-[1.1] tracking-tighter text-black mb-8 uppercase">
                  CONSECTETUR ADIPISCING ELIT.
                </h1>
                <p className="text-[15px] leading-relaxed text-black font-medium">
                  Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
                </p>
              </div>
            </div>
            <div className="relative h-[300px] lg:h-auto">
              <img
                src="https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Modern bedroom"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- GALLERY & MAIN INFO --- */}
      <section className="py-12">
        <div className={GRID_CONTAINER}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Galerie (5 colonnes) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative group">
                <img
                  src="https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Main view"
                  className="w-full h-[360px] object-cover rounded-[4px]"
                />
                <button className="absolute inset-0 m-auto w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-black ml-1 fill-black" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <img key={i} src={`https://picsum.photos/400/300?random=${i}`} className="w-full h-[100px] object-cover rounded-[4px]" alt="Thumb" />
                ))}
              </div>
            </div>

            {/* Info & Booking (7 colonnes) */}
            <div className="lg:col-span-7 space-y-8">
              <h2 className="text-3xl lg:text-[42px] font-black text-black leading-tight uppercase tracking-tighter">
                Aptent taciti sociosqu ad litora
              </h2>
              <p className="text-base leading-relaxed text-gray-700">
                Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra.
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-5 py-2 border border-gray-200 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Users className="w-4 h-4" /> Jusqu'à 4 personnes
                </div>
                <div className="flex items-center gap-2 px-5 py-2 border border-gray-200 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Bed className="w-4 h-4" /> 2 Chambres
                </div>
              </div>

              <div className="space-y-4 border-t border-gray-100 pt-8">
                <div className="flex justify-between items-center"><span className="text-sm font-bold uppercase text-gray-400">Prix standard</span><span className="text-lg font-black">300€</span></div>
                <div className="flex justify-between items-center"><span className="text-sm font-bold uppercase text-gray-400">Type</span><span className="text-sm font-bold uppercase">Non fumeur</span></div>
                <div className="flex justify-between items-center"><span className="text-sm font-bold uppercase text-gray-400">Offert</span><span className="text-sm font-bold uppercase text-[#FF2E63]">Petit déjeuné</span></div>
              </div>

              <button className="w-full bg-black text-white py-5 rounded-[4px] font-bold uppercase tracking-widest hover:bg-zinc-900 transition-all">
                Reserver maintenant
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- SERVICES SECTION (BG GRIS BOXED) --- */}
      <section className="py-12">
        <div className={GRID_CONTAINER}>
          <div className="bg-[#EBEBEB] rounded-lg p-8 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5">
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-6">Détails & Services</h2>
                <div className="bg-white p-6 rounded-[4px] shadow-sm mb-6">
                  <p className="text-sm font-bold uppercase leading-tight">Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus.</p>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                {/* Accordion Service */}
                <div className="bg-white rounded-[4px] overflow-hidden border border-gray-100">
                  <button onClick={() => toggleService('breakfast')} className="w-full flex items-center justify-between p-6">
                    <span className="font-bold uppercase text-sm tracking-widest">Petit déjeuner</span>
                    <ChevronDown className={`transition-transform ${selectedService === 'breakfast' ? 'rotate-180' : ''}`} />
                  </button>
                  {selectedService === 'breakfast' && (
                    <div className="p-8 border-t border-gray-50 bg-gray-50/50">
                       <div className="flex justify-between items-end mb-6">
                          <div>
                            <p className="text-[32px] font-black">300€</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Par nuit</p>
                          </div>
                          <div className="flex items-center gap-4 bg-white p-2 rounded-md">
                            <button onClick={() => setNights(Math.max(1, nights - 1))} className="p-1"><Minus className="w-4 h-4"/></button>
                            <span className="font-bold">{nights}</span>
                            <button onClick={() => setNights(nights + 1)} className="p-1 bg-black text-white rounded"><Plus className="w-4 h-4"/></button>
                          </div>
                       </div>
                       <button className="w-full bg-[#FF2E63] text-white py-4 rounded font-bold uppercase tracking-widest">Payer 800€</button>
                    </div>
                  )}
                </div>
                {/* Autres boutons simplifiés */}
                {['Entre romantique', 'Ménage quotidien', 'Service pressing'].map((item) => (
                  <button key={item} className="w-full flex items-center justify-between p-6 bg-white rounded-[4px] font-bold uppercase text-sm tracking-widest opacity-60">
                    {item} <ChevronDown className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- LOGO SECTION --- */}
      <section className="py-20">
        <div className={GRID_CONTAINER}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 border border-gray-100 rounded flex items-center justify-center grayscale opacity-50 hover:opacity-100 transition-all">
                <span className="font-black text-xs uppercase tracking-widest">Logoipsum</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

export default AppartmentDetail;