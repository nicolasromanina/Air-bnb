import { Users, Bed, Play, ChevronDown, Minus, Plus, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Configuration de la grille unifiée
const GRID_CONTAINER = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

// Données des appartements
const apartments = [
  { id: 1, title: "Appartement Luxe Vue Mer", description: "Appartement moderne avec vue exceptionnelle sur la mer", guests: "jusqu'à 4 personnes", bedrooms: "2 Chambres", price: 300 },
  { id: 2, title: "Studio Centre Ville", description: "Studio parfaitement situé au cœur de la ville", guests: "jusqu'à 2 personnes", bedrooms: "1 Chambre", price: 150 },
  { id: 3, title: "Maison avec Jardin", description: "Maison spacieuse avec jardin privatif", guests: "jusqu'à 6 personnes", bedrooms: "3 Chambres", price: 450 },
  { id: 4, title: "Loft Industriel", description: "Loft design dans un bâtiment industriel rénové", guests: "jusqu'à 4 personnes", bedrooms: "2 Chambres", price: 350 },
  { id: 5, title: "Appartement Familial", description: "Grand appartement idéal pour les familles", guests: "jusqu'à 5 personnes", bedrooms: "3 Chambres", price: 400 },
  { id: 6, title: "Chalet Montagne", description: "Chalet chaleureux au pied des pistes", guests: "jusqu'à 8 personnes", bedrooms: "4 Chambres", price: 500 },
  { id: 7, title: "Penthouse Panoramique", description: "Penthouse avec terrasse et vue à 360°", guests: "jusqu'à 4 personnes", bedrooms: "2 Chambres", price: 600 },
  { id: 8, title: "Appartement Historique", description: "Appartement dans un bâtiment historique", guests: "jusqu'à 3 personnes", bedrooms: "1 Chambre", price: 250 },
  { id: 9, title: "Villa Piscine", description: "Villa privée avec piscine et jardin", guests: "jusqu'à 10 personnes", bedrooms: "5 Chambres", price: 800 },
];

function AppartmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [nights, setNights] = useState(2);

  // Trouver l'appartement par ID
  const apartment = apartments.find(apt => apt.id === parseInt(id)) || apartments[0];

  const toggleService = (service) => {
    setSelectedService(selectedService === service ? null : service);
  };

  const handleBack = () => {
    navigate('/');
  };

  // Nouvelle fonction pour rediriger vers la page de paiement
  const handleReservation = () => {
    // Stocker les données dans localStorage ou utiliser un contexte
    const reservationData = {
      apartmentId: apartment.id,
      title: apartment.title,
      description: apartment.description,
      guests: apartment.guests,
      bedrooms: apartment.bedrooms,
      price: apartment.price,
      nights: nights,
      total: apartment.price * nights,
      image: "https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=1200",
      includes: ["Petit déjeuner", selectedService === 'breakfast' ? 'Petit déjeuner' : null].filter(Boolean)
    };

    // Stocker dans localStorage pour la récupération sur la page de paiement
    localStorage.setItem('currentReservation', JSON.stringify(reservationData));
    
    // Rediriger vers la page de paiement
    navigate('/payment', { state: reservationData });
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* Bouton Retour discret */}
      <div className={GRID_CONTAINER + " pt-6"}>
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux chambres
        </button>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="pt-4 pb-12">
        <div className={GRID_CONTAINER}>
          <div className="bg-[#EBEBEB] rounded-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            <div className="flex items-center justify-start p-8 lg:p-16 xl:p-20">
              <div className="max-w-[500px]">
                <h1 className="text-[40px] lg:text-[52px] font-black leading-[1.1] tracking-tighter text-black mb-8 uppercase">
                  {apartment.title}
                </h1>
                <p className="text-[15px] leading-relaxed text-black font-medium">
                  {apartment.description}
                </p>
              </div>
            </div>
            <div className="relative h-[300px] lg:h-auto">
              <img
                src="https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt={apartment.title}
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
                  <img key={i} src={`https://picsum.photos/400/300?random=${i + apartment.id}`} className="w-full h-[100px] object-cover rounded-[4px]" alt={`Thumbnail ${i}`} />
                ))}
              </div>
            </div>

            {/* Info & Booking (7 colonnes) */}
            <div className="lg:col-span-7 space-y-8">
              <h2 className="text-3xl lg:text-[42px] font-black text-black leading-tight uppercase tracking-tighter">
                {apartment.title}
              </h2>
              <p className="text-base leading-relaxed text-gray-700">
                Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra.
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-5 py-2 border border-gray-200 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Users className="w-4 h-4" /> {apartment.guests}
                </div>
                <div className="flex items-center gap-2 px-5 py-2 border border-gray-200 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Bed className="w-4 h-4" /> {apartment.bedrooms}
                </div>
              </div>

              <div className="space-y-4 border-t border-gray-100 pt-8">
                <div className="flex justify-between items-center"><span className="text-sm font-bold uppercase text-gray-400">Prix standard</span><span className="text-lg font-black">{apartment.price}€</span></div>
                <div className="flex justify-between items-center"><span className="text-sm font-bold uppercase text-gray-400">Type</span><span className="text-sm font-bold uppercase">Non fumeur</span></div>
                <div className="flex justify-between items-center"><span className="text-sm font-bold uppercase text-gray-400">Offert</span><span className="text-sm font-bold uppercase text-[#FF2E63]">Petit déjeuné</span></div>
              </div>

              {/* Bouton Réserver maintenant - MODIFIÉ */}
              <button 
                onClick={handleReservation}
                className="w-full bg-black text-white py-5 rounded-[4px] font-bold uppercase tracking-widest hover:bg-zinc-900 transition-all"
              >
                Réserver maintenant
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
                            <p className="text-[32px] font-black">{apartment.price}€</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Par nuit</p>
                          </div>
                          <div className="flex items-center gap-4 bg-white p-2 rounded-md">
                            <button onClick={() => setNights(Math.max(1, nights - 1))} className="p-1"><Minus className="w-4 h-4"/></button>
                            <span className="font-bold">{nights}</span>
                            <button onClick={() => setNights(nights + 1)} className="p-1 bg-black text-white rounded"><Plus className="w-4 h-4"/></button>
                          </div>
                       </div>
                       <button className="w-full bg-[#FF2E63] text-white py-4 rounded font-bold uppercase tracking-widest">Payer {apartment.price * nights}€</button>
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