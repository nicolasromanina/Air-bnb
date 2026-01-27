import { Users, Bed, Play, ChevronDown, Minus, Plus, ArrowLeft, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SelectedOption } from '../reservation/AdditionalOptionsSelector';
import { api } from '@/services/api';
import { roomDetailApi, RoomDetail } from '@/services/roomDetailApi';
import { formatGuests, formatBedrooms } from '@/utils/numberExtractor';
import { toast } from 'sonner';

const PINK_ACCENT = "#FF385C";

function AppartmentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    console.log('[DETAIL] 🏠 AppartmentDetail component rendering for room ID:', id);
    
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
    const [roomDetail, setRoomDetail] = useState<RoomDetail | null>(null);
    const [loadingRoomDetail, setLoadingRoomDetail] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Fetch room details from API
    const fetchRoomDetail = useCallback(async () => {
        try {
            if (!id || isNaN(parseInt(id))) {
                console.error('[DETAIL] ❌ Invalid room ID:', id);
                setLoadingRoomDetail(false);
                return;
            }
            
            console.log('[DETAIL] 🔄 Fetching room detail for room ID:', id);
            const response = await roomDetailApi.getRoomDetail(parseInt(id));
            console.log('[DETAIL] 📥 API Response received:', { success: response.success, hasData: !!response.data });
            
            if (response.success && response.data) {
                console.log('[DETAIL] ✅ Room detail fetched successfully:', {
                    roomId: response.data.roomId,
                    title: response.data.title,
                    subtitle: response.data.subtitle,
                    price: response.data.price,
                    guests: response.data.guests,
                    bedrooms: response.data.bedrooms,
                    imagesCount: response.data.images?.length || 0,
                    includes: response.data.includes,
                    amenities: response.data.amenities,
                    features: response.data.features
                });
                setRoomDetail(response.data);
            } else {
                console.warn('[DETAIL] ⚠️ API returned no data, using fallback');
                // Fallback to hardcoded data if API fails
                setRoomDetail({
                    id: parseInt(id),
                    roomId: parseInt(id),
                    title: "Aptent taciti sociosqu ad litora",
                    subtitle: "Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
                    description: "Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.",
                    price: 300,
                    guests: "jusqu'à 4 invitées",
                    bedrooms: "2 chambres à coucher",
                    images: [
                        "https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=1200",
                        "https://picsum.photos/400/400?random=11",
                        "https://picsum.photos/400/400?random=12"
                    ],
                    features: ["Feature 1", "Feature 2", "Feature 3"]
                } as any);
            }
        } catch (error) {
                console.error('[FETCH] Error fetching room detail:', error);
                // Fallback to hardcoded data
                setRoomDetail({
                    id: parseInt(id || '0'),
                    roomId: parseInt(id || '0'),
                    title: "Aptent taciti sociosqu ad litora",
                    subtitle: "Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
                    description: "Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.",
                    price: 300,
                    guests: "jusqu'à 4 invitées",
                    bedrooms: "2 chambres à coucher",
                    images: [
                        "https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    ],
                    features: ["Feature 1", "Feature 2"]
                } as any);
            } finally {
                setLoadingRoomDetail(false);
            }
    }, [id]);

    // Listener for room detail updates
    useEffect(() => {
        console.log('[DETAIL] 🚀 Component mounted, fetching initial room detail for room:', id);
        fetchRoomDetail();

        // Écouter les mises à jour de données
        const handleDataUpdate = (event: Event) => {
            const customEvent = event as CustomEvent;
            const updatedRoomId = customEvent.detail?.roomId;
            const updatedData = customEvent.detail?.data;
            const timestamp = customEvent.detail?.timestamp;
            
            console.log('[DETAIL] 📢 Data update event received:', {
                eventType: (event as any).type,
                updatedRoomId,
                currentRoomId: parseInt(id || '0'),
                hasData: !!updatedData,
                timestamp: new Date(timestamp).toLocaleTimeString()
            });
            
            // Si c'est la chambre actuelle ou une mise à jour générale
            if (!updatedRoomId || updatedRoomId === parseInt(id || '0')) {
                console.log('[DETAIL] 🔄 Refetching room detail for room:', id, '| Updated at:', new Date(timestamp).toLocaleTimeString());
                fetchRoomDetail();
            } else {
                console.log('[DETAIL] ℹ️ Update is for a different room:', updatedRoomId, '| Current room:', id);
            }
        };

        window.addEventListener('roomDetailUpdated', handleDataUpdate);
        window.addEventListener('apartmentDataUpdated', handleDataUpdate);

        console.log('[DETAIL] ✅ Event listeners attached for room:', id);

        return () => {
            window.removeEventListener('roomDetailUpdated', handleDataUpdate);
            window.removeEventListener('apartmentDataUpdated', handleDataUpdate);
            console.log('[DETAIL] 🗑️ Event listeners removed for room:', id);
        };
    }, [id, fetchRoomDetail]);

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

    const apartment = roomDetail || { 
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
            image: roomDetail?.images?.[0] 
                ? (roomDetail.images[0].includes('cloudinary.com') || roomDetail.images[0].includes('airbnb-backend')
                    ? roomDetail.images[0]
                    : `https://airbnb-backend.onrender.com${roomDetail.images[0]}`)
                : 'https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
                    {/* Galerie d'images */}
                    <div className="space-y-4">
                        {/* Image principale */}
                        <div className="relative rounded-sm overflow-hidden aspect-[4/3] bg-gray-100 group">
                            {loadingRoomDetail ? (
                                <div className="flex items-center justify-center h-full bg-gray-200">
                                    <div className="text-gray-400">Chargement...</div>
                                </div>
                            ) : (
                                <>
                                    <img 
                                        src={
                                            roomDetail?.images?.[currentImageIndex] 
                                                ? (roomDetail.images[currentImageIndex].includes('cloudinary.com') || roomDetail.images[currentImageIndex].includes('airbnb-backend')
                                                    ? roomDetail.images[currentImageIndex]
                                                    : `https://airbnb-backend.onrender.com${roomDetail.images[currentImageIndex]}`)
                                                : "https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                        } 
                                        className="w-full h-full object-cover" 
                                        alt={`Room detail ${currentImageIndex + 1}`}
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = "https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=1200";
                                        }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition-transform">
                                            <Play size={24} fill="black" className="ml-1" />
                                        </div>
                                    </div>
                                    
                                    {/* Navigation arrows */}
                                    {roomDetail?.images && roomDetail.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={() => setCurrentImageIndex((prev) => (prev - 1 + roomDetail.images.length) % roomDetail.images.length)}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>
                                            <button
                                                onClick={() => setCurrentImageIndex((prev) => (prev + 1) % roomDetail.images.length)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                            
                                            {/* Image counter */}
                                            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                {currentImageIndex + 1} / {roomDetail.images.length}
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Miniatures */}
                        {roomDetail?.images && roomDetail.images.length > 1 && (
                            <div className="grid grid-cols-3 gap-4">
                                {roomDetail.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentImageIndex(i)}
                                        className={`aspect-square rounded-sm overflow-hidden border-2 transition-all ${
                                            currentImageIndex === i ? 'border-black' : 'border-gray-100 hover:border-gray-300'
                                        }`}
                                    >
                                        <img 
                                            src={
                                                img.includes('cloudinary.com') || img.includes('airbnb-backend')
                                                    ? img
                                                    : `https://airbnb-backend.onrender.com${img}`
                                            }
                                            className="w-full h-full object-cover" 
                                            alt={`Thumbnail ${i + 1}`}
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/150?text=Image+Error";
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-[42px] font-black leading-tight tracking-tight">{apartment.title}</h1>
                        <p className="text-gray-600 text-[15px] leading-relaxed">{apartment.subtitle}</p>
                        <div className="flex gap-3">
                            <span className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-[12px] font-bold text-gray-700 bg-gray-50 uppercase tracking-tight"><Users size={14} /> {formatGuests(apartment.guests)}</span>
                            <span className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-[12px] font-bold text-gray-700 bg-gray-50 uppercase tracking-tight"><Bed size={14} /> {formatBedrooms(apartment.bedrooms)}</span>
                        </div>
                        <div className="bg-[#F3F4F6] py-6 px-8 rounded-sm text-center text-sm font-medium text-gray-600">{roomDetail?.subtitle || 'Class aptent taciti per inceptos himenaeos.'}</div>
                        <div className="pt-4 border-t border-gray-100">
                            <h3 className="text-[17px] font-bold mb-4 uppercase tracking-tighter">Information générale</h3>
                            <InfoRow label="Prix standard" value={`${apartment.price}€ / nuit`} isBold />
                            <InfoRow label="Nombre de personnes" value={formatGuests(apartment.guests)} />
                            <InfoRow label="Nombre de chambres" value={formatBedrooms(apartment.bedrooms)} />
                            {roomDetail?.accommodationType && (
                                <InfoRow label="Type de logement" value={roomDetail.accommodationType} />
                            )}
                            {roomDetail?.includes && roomDetail.includes.length > 0 && (
                                <InfoRow label="Inclus" value={roomDetail.includes.join(', ')} isPink />
                            )}
                            {roomDetail?.amenities && roomDetail.amenities.length > 0 && (
                                <InfoRow label="Équipements et services" value={roomDetail.amenities.join(', ')} />
                            )}
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

                        {/* Caractéristiques de la chambre */}
                        {roomDetail?.features && roomDetail.features.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <h3 className="text-[17px] font-bold mb-4 uppercase tracking-tighter">Caractéristiques</h3>
                                <div className="space-y-2">
                                    {roomDetail.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <Check size={18} className="text-green-500" />
                                            <span className="text-[14px] text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* --- SECTION DÉTAILS & OPTIONS --- */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-16 border-t border-gray-100">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-[32px] font-bold mb-1">Détails de l’appartement</h2>
                            <p className="text-gray-500 text-sm">{roomDetail?.accommodationType || 'Détails complets du logement'}</p>
                        </div>
                        <div>
                            <h3 className="text-[20px] font-bold mb-4">Description</h3>
                            <div className="bg-[#F8F9FA] p-10 rounded-[32px] text-gray-700 leading-relaxed text-[15px]">
                                {apartment.description}
                            </div>
                        </div>

                        {/* Informations de capacité */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-lg border border-blue-200">
                            <h3 className="text-[17px] font-bold mb-4 uppercase tracking-tighter flex items-center gap-2 text-blue-900">
                                <span>👥</span> Capacité
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-blue-900 font-medium">Nombre d'invités:</span>
                                    <span className="font-bold text-lg text-blue-700">{formatGuests(roomDetail?.guests)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-blue-900 font-medium">Nombre de chambres:</span>
                                    <span className="font-bold text-lg text-blue-700">{formatBedrooms(roomDetail?.bedrooms)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Tarification */}
                        {roomDetail?.price && (
                            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-6 rounded-lg border border-amber-300">
                                <h3 className="text-[17px] font-bold mb-4 uppercase tracking-tighter flex items-center gap-2 text-amber-900">
                                    <span>💰</span> Tarification
                                </h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm text-amber-900">À partir de</span>
                                    <span className="text-5xl font-bold text-amber-700">{roomDetail.price}</span>
                                    <span className="text-xl text-amber-900">€</span>
                                    <span className="text-sm text-amber-900">par nuit</span>
                                </div>
                            </div>
                        )}

                        {/* Inclusions */}
                        {roomDetail?.includes && roomDetail.includes.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-[17px] font-bold uppercase tracking-tighter flex items-center gap-2 text-green-900">
                                    <span>✓</span> Inclus dans le tarif
                                </h3>
                                <div className="space-y-2">
                                    {roomDetail.includes.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-2 hover:bg-green-50 rounded transition-colors">
                                            <Check size={18} className="text-green-600 flex-shrink-0" />
                                            <span className="text-[14px] text-green-900">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Équipements */}
                        {roomDetail?.amenities && roomDetail.amenities.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-[17px] font-bold uppercase tracking-tighter flex items-center gap-2 text-purple-900">
                                    <span>🛠️</span> Équipements & Services
                                </h3>
                                <div className="space-y-2">
                                    {roomDetail.amenities.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-2 hover:bg-purple-50 rounded transition-colors">
                                            <Check size={18} className="text-purple-600 flex-shrink-0" />
                                            <span className="text-[14px] text-purple-900">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Caractéristiques principales */}
                        {roomDetail?.features && roomDetail.features.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-[17px] font-bold uppercase tracking-tighter flex items-center gap-2 text-orange-900">
                                    <span>⭐</span> Caractéristiques principales
                                </h3>
                                <div className="space-y-2">
                                    {roomDetail.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-2 hover:bg-orange-50 rounded transition-colors">
                                            <Check size={18} className="text-orange-600 flex-shrink-0" />
                                            <span className="text-[14px] text-orange-900">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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