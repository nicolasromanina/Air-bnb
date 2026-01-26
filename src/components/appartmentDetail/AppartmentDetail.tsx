import { Users, Bed, Play, ChevronDown, Minus, Plus, ArrowLeft, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SelectedOption } from '../reservation/AdditionalOptionsSelector';
import { api } from '@/services/api';
import { toast } from 'sonner';

const PINK_ACCENT = "#FF385C";

function AppartmentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // --- ÉTATS ET LOGIQUE ---
    const [checkInDate, setCheckInDate] = useState<string>('');
    const [checkOutDate, setCheckOutDate] = useState<string>('');
    const [nights, setNights] = useState(2);
    const [guests, setGuests] = useState(2);
    const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
    const [optionsPrice, setOptionsPrice] = useState(0);
    const [allOptions, setAllOptions] = useState<Record<string, any[]>>({});
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [expandedOption, setExpandedOption] = useState<string | null>(null);

    // Initialisation dates
    useEffect(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 2);
        setCheckInDate(today.toISOString().split('T')[0]);
        setCheckOutDate(tomorrow.toISOString().split('T')[0]);
    }, []);

    // Calcul des nuits
    useEffect(() => {
        if (checkInDate && checkOutDate) {
            const diffDays = Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays > 0) setNights(diffDays);
        }
    }, [checkInDate, checkOutDate]);

    // Fetch API des options
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await api.getAdditionalOptions();
                if (response.success && response.data?.options) {
                    setAllOptions(response.data.options);
                }
            } catch (error) {
                console.error('Error fetching options:', error);
            } finally {
                setLoadingOptions(false);
            }
        };
        fetchOptions();
    }, []);

    const apartment = { 
        title: "Aptent taciti sociosqu ad litora",
        subtitle: "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra.",
        price: 300,
        guests: "jusqu'à 4 invitées",
        bedrooms: "2 chambres à coucher",
        description: "Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
    };

    // Calcul du prix dynamique par option
    const calculateOptionPrice = (option: any): number => {
        switch (option.pricingType) {
            case 'per_day': return option.price * nights;
            case 'per_guest': return option.price * guests;
            default: return option.price;
        }
    };

    const handleOptionToggle = (option: any) => {
        const isSelected = selectedOptions.some(o => o.optionId === option._id);
        const currentOptionPrice = calculateOptionPrice(option);

        if (isSelected) {
            setSelectedOptions(selectedOptions.filter(o => o.optionId !== option._id));
            setOptionsPrice(prev => prev - currentOptionPrice);
        } else {
            setSelectedOptions([...selectedOptions, {
                optionId: option._id, 
                name: option.name, 
                price: option.price,
                quantity: option.pricingType === 'per_day' ? nights : (option.pricingType === 'per_guest' ? guests : 1),
                pricingType: option.pricingType
            }]);
            setOptionsPrice(prev => prev + currentOptionPrice);
        }
    };

    const handleReservation = () => {
        // Build a complete reservation object matching backend schema requirements
        const aptIdNum = id ? Number(id) : undefined;
        const extractNumber = (val: any) => {
            if (typeof val === 'number' && !isNaN(val)) return val;
            if (typeof val === 'string') {
                const m = val.match(/\d+/);
                return m ? Number(m[0]) : 1;
            }
            return 1;
        };

        const bedroomsNum = extractNumber(apartment.bedrooms);

        const basePrice = Number(apartment.price) || 0;
        const computedTotal = Number((basePrice * nights) + Number(optionsPrice || 0));

        const reservationData = {
            apartmentId: aptIdNum,
            apartmentNumber: apartment.title || `Appartement ${aptIdNum}`,
            title: apartment.title || 'Réservation',
            image: 'https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=1200',
            includes: [],
            checkIn: checkInDate,
            checkOut: checkOutDate,
            nights: Number(nights) || 1,
            guests: Number(guests) || 1,
            bedrooms: bedroomsNum,
            totalPrice: computedTotal,
            pricePerNight: basePrice,
            basePrice: basePrice,
            optionsPrice: Number(optionsPrice || 0),
            selectedOptions: selectedOptions || [],
        };

        // Persist for Payment page and navigate
        localStorage.setItem('currentReservation', JSON.stringify(reservationData));
        navigate('/payment', { state: reservationData });
    };

    return (
        <div className="min-h-screen bg-white font-sans text-[#1A1A1A] pb-20">
            <nav className="max-w-[1140px] mx-auto px-6 py-10">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest">
                    <ArrowLeft size={18} /> Retour
                </button>
            </nav>

            <div className="max-w-[1140px] mx-auto px-6 space-y-24">
                
                {/* --- SECTION VIDEO & INFOS --- */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div className="space-y-4">
                        <div className="relative rounded-sm overflow-hidden aspect-[4/3] bg-gray-100">
                            <img src="https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=1200" className="w-full h-full object-cover" alt="Main" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition-transform">
                                    <Play size={24} fill="black" className="ml-1" />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="aspect-square rounded-sm overflow-hidden border border-gray-100">
                                    <img src={`https://picsum.photos/400/400?random=${i+10}`} className="w-full h-full object-cover" alt="" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-[42px] font-black leading-tight tracking-tight">{apartment.title}</h1>
                        <p className="text-gray-600 text-[15px] leading-relaxed">{apartment.subtitle}</p>
                        <div className="flex gap-3">
                            <span className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-[12px] font-bold text-gray-700 bg-gray-50 uppercase tracking-tight"><Users size={14} /> {apartment.guests}</span>
                            <span className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-[12px] font-bold text-gray-700 bg-gray-50 uppercase tracking-tight"><Bed size={14} /> {apartment.bedrooms}</span>
                        </div>
                        <div className="bg-[#F3F4F6] py-6 px-8 rounded-sm text-center text-sm font-medium text-gray-600">Class aptent taciti per inceptos himenaeos.</div>
                        <div className="pt-4 border-t border-gray-100">
                            <h3 className="text-[17px] font-bold mb-4 uppercase tracking-tighter">Information générale</h3>
                            <InfoRow label="Prix standard" value={`${apartment.price}€`} isBold />
                            <InfoRow label="Nombre de personne" value={guests} />
                            <InfoRow label="Type de logement" value="Logement sans fumeur" />
                            <InfoRow label="Offert" value="Thé, café, petit déjeuné" isPink />
                            <InfoRow label="Sécurité" value="Parking sécurisé" />
                        </div>

                        {/* Date picker for reservation */}
                        <div className="mt-6 grid grid-cols-2 gap-3 items-end">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Arrivée</label>
                                <input type="date" value={checkInDate} onChange={e => setCheckInDate(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Départ</label>
                                <input type="date" value={checkOutDate} onChange={e => setCheckOutDate(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" />
                            </div>
                        </div>

                        <button onClick={handleReservation} className="w-full mt-4 bg-black text-white py-5 rounded-md font-bold text-[16px] uppercase tracking-widest hover:bg-zinc-800 transition-all">Reserver maintenant</button>
                    </div>
                </section>

                {/* --- SECTION DÉTAILS & OPTIONS --- */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-16 border-t border-gray-100">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-[32px] font-bold mb-1">Détails de l’appartement</h2>
                            <p className="text-gray-500 text-sm">Class aptent taciti per inceptos himenaeos.</p>
                        </div>
                        <div className="bg-white border border-gray-200 py-5 px-6 rounded-md text-center text-[15px] font-medium text-gray-800 italic">Appartement lorem ipsum dolor sit amet</div>
                        <div>
                            <h3 className="text-[20px] font-bold mb-4">Description</h3>
                            <div className="bg-[#F8F9FA] p-10 rounded-[32px] text-gray-700 leading-relaxed text-[15px]">{apartment.description}</div>
                        </div>
                    </div>

                    {/* Bloc Incluses et sur demande (API) */}
                    <div className="bg-[#F8F9FA] rounded-[40px] p-8 md:p-12 border border-gray-100">
                        <div className="text-center mb-8">
                            <h3 className="text-[22px] font-bold mb-1">Incluses et sur demande</h3>
                            <p className="text-gray-500 text-sm">Class aptent taciti per inceptos himenaeos.</p>
                        </div>
                        <div className="flex justify-center gap-3 mb-10">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                                    <img src={`https://picsum.photos/200/200?random=${i+50}`} className="w-full h-full object-cover" alt="" />
                                </div>
                            ))}
                        </div>

                        {/* BOUCLE DYNAMIQUE SUR LES OPTIONS DE L'API */}
                        <div className="space-y-3">
                            {loadingOptions ? (
                                <div className="text-center py-10 text-gray-400 font-medium">Chargement des services...</div>
                            ) : (
                                Object.values(allOptions).flat().map((option: any) => (
                                    <div key={option._id} className={`bg-white border border-gray-200 rounded-xl overflow-hidden transition-all ${expandedOption === option._id ? 'shadow-xl ring-1 ring-black/5' : ''}`}>
                                        <button 
                                            onClick={() => setExpandedOption(expandedOption === option._id ? null : option._id)} 
                                            className="w-full p-5 flex justify-between items-center group"
                                        >
                                            <span className={`text-[15px] font-bold flex-1 text-center transition-colors ${selectedOptions.some(o => o.optionId === option._id) ? 'text-[#FF385C]' : 'text-gray-800'}`}>
                                                {option.name}
                                                {selectedOptions.some(o => o.optionId === option._id) && <Check size={14} className="inline ml-2" />}
                                            </span>
                                            <div className="bg-gray-50 p-1.5 rounded-full group-hover:bg-gray-100 transition-colors">
                                                <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${expandedOption === option._id ? 'rotate-180' : ''}`} />
                                            </div>
                                        </button>

                                        {expandedOption === option._id && (
                                            <div className="p-8 pt-0 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="space-y-4">
                                                    <h4 className="text-[12px] font-black uppercase text-black tracking-widest">{option.name}</h4>
                                                    <p className="text-[13px] text-gray-400 leading-relaxed font-medium">{option.description || "Service exclusif pour votre séjour."}</p>
                                                    <div className="text-2xl font-black text-gray-900">{option.price}€</div>
                                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Disponible pour : {apartment.title}</div>
                                                </div>
                                                <div className="flex flex-col justify-between">
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                                            <span>{option.pricingType === 'per_guest' ? 'Nombre de pers.' : 'Nombre de nuit'}</span>
                                                            <span>Prix</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex items-center bg-black rounded-lg p-1 px-2">
                                                                <button onClick={() => option.pricingType === 'per_guest' ? setGuests(Math.max(1, guests-1)) : setNights(Math.max(1, nights-1))} className="text-white p-1 hover:text-gray-300"><Minus size={14}/></button>
                                                                <span className="text-white px-3 text-sm font-bold min-w-[20px] text-center">{option.pricingType === 'per_guest' ? guests : nights}</span>
                                                                <button onClick={() => option.pricingType === 'per_guest' ? setGuests(guests+1) : setNights(nights+1)} className="text-white p-1 hover:text-gray-300"><Plus size={14}/></button>
                                                            </div>
                                                            <span className="font-black text-[22px] text-gray-900">{calculateOptionPrice(option)}€</span>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleOptionToggle(option)}
                                                        className={`w-full mt-8 py-4 rounded-xl font-black text-[12px] uppercase tracking-widest transition-all ${selectedOptions.some(o => o.optionId === option._id) ? 'bg-gray-100 text-gray-500' : 'bg-[#FF385C] text-white hover:brightness-110 shadow-lg shadow-pink-200'}`}
                                                    >
                                                        {selectedOptions.some(o => o.optionId === option._id) ? 'Retirer du panier' : 'Passer au paiement'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                        {/* Résumé du prix total des options */}
                        {selectedOptions.length > 0 && (
                           <div className="mt-6 text-center text-[12px] font-bold uppercase text-gray-400 tracking-widest animate-pulse">
                               Total options : {optionsPrice}€
                           </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

function InfoRow({ label, value, isBold, isPink }: any) {
    return (
        <div className="flex justify-between items-baseline py-2 border-b border-gray-50 last:border-0">
            <span className="text-gray-400 text-[13px] font-semibold uppercase tracking-tight">{label}</span>
            <span className={`${isBold ? 'text-[20px] font-black' : 'text-[14px] font-bold'} ${isPink ? 'text-[#FF385C]' : 'text-gray-900'}`}>
                {value}
            </span>
        </div>
    );
}

export default AppartmentDetail;