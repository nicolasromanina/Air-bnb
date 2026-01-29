import { Users, Bed, Play, ChevronDown, Minus, Plus, ArrowLeft, Check, ChevronLeft, ChevronRight, X, Maximize2, Heart, Share2, Calendar, Clock, Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SelectedOption } from '../reservation/AdditionalOptionsSelector';
import { api } from '@/services/api';
import { roomDetailApi, RoomDetail } from '@/services/roomDetailApi';
import { formatGuests, formatBedrooms } from '@/utils/numberExtractor';
import { toast } from 'sonner';
import ImprovedDatePicker from '../ImprovedDatePicker';
import { motion, AnimatePresence } from 'framer-motion';
import VideoPlayer from '../VideoPlayer';

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
    const [roomDetail, setRoomDetail] = useState<RoomDetail | null>(null);
    const [loadingRoomDetail, setLoadingRoomDetail] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showFullScreenGallery, setShowFullScreenGallery] = useState(false);
    const [imageLoading, setImageLoading] = useState<boolean[]>([]);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchStartFullScreen, setTouchStartFullScreen] = useState<number | null>(null);
    const [isScrolling, setIsScrolling] = useState(false);
    const galleryRef = useRef<HTMLDivElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    // Fetch room details from API
    const fetchRoomDetail = useCallback(async () => {
        try {
            if (!id || isNaN(parseInt(id))) {
                toast.error('ID de chambre invalide');
                setLoadingRoomDetail(false);
                return;
            }
            
            const response = await roomDetailApi.getRoomDetail(parseInt(id));
            
            if (response.success && response.data) {
                setRoomDetail(response.data);
                // Initialize loading states for images
                if (response.data.images) {
                    setImageLoading(new Array(response.data.images.length).fill(true));
                }
            } else {
                // Fallback data
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
                        "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1200",
                        "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    ],
                    features: ["Wi-Fi gratuit", "Climatisation", "Cuisine équipée"]
                } as any);
                setImageLoading(new Array(3).fill(true));
            }
        } catch (error) {
            console.error('Error fetching room detail:', error);
            toast.error('Erreur de chargement des détails');
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
                features: ["Wi-Fi gratuit", "Climatisation"]
            } as any);
            setImageLoading(new Array(1).fill(true));
        } finally {
            setLoadingRoomDetail(false);
        }
    }, [id]);

    // Listen for updates
    useEffect(() => {
        fetchRoomDetail();

        const handleDataUpdate = (event: Event) => {
            const customEvent = event as CustomEvent;
            const updatedRoomId = customEvent.detail?.roomId;
            
            if (!updatedRoomId || updatedRoomId === parseInt(id || '0')) {
                fetchRoomDetail();
            }
        };

        window.addEventListener('roomDetailUpdated', handleDataUpdate);
        window.addEventListener('apartmentDataUpdated', handleDataUpdate);

        return () => {
            window.removeEventListener('roomDetailUpdated', handleDataUpdate);
            window.removeEventListener('apartmentDataUpdated', handleDataUpdate);
        };
    }, [id, fetchRoomDetail]);

    // Initialize dates
    useEffect(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 2);
        
        const formatDate = (date: Date) => date.toISOString().split('T')[0];
        setCheckInDate(formatDate(today));
        setCheckOutDate(formatDate(tomorrow));
    }, []);

    // Calculate nights
    useEffect(() => {
        if (checkInDate && checkOutDate) {
            const diffDays = Math.ceil(
                (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)
            );
            if (diffDays > 0) {
                setNights(diffDays);
            }
        }
    }, [checkInDate, checkOutDate]);

    // Fetch options
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

    // Handle image loading
    const handleImageLoad = (index: number) => {
        setImageLoading(prev => {
            const newState = [...prev];
            newState[index] = false;
            return newState;
        });
    };

    const handleImageError = (index: number) => {
        setImageLoading(prev => {
            const newState = [...prev];
            newState[index] = false;
            return newState;
        });
    };

    // Image navigation with keyboard support - FULLSCREEN ONLY
    useEffect(() => {
        if (!showFullScreenGallery || !roomDetail?.images) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // ONLY process if fullscreen gallery is open
            if (e.key === 'Escape') {
                e.preventDefault();
                setShowFullScreenGallery(false);
            } else if (e.key === 'ArrowRight' || e.key === 'd') {
                e.preventDefault();
                navigateNextImage();
            } else if (e.key === 'ArrowLeft' || e.key === 'q') {
                e.preventDefault();
                navigatePrevImage();
            }
        };

        // Add listener only when fullscreen is active
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showFullScreenGallery, roomDetail?.images]);

    // Navigation functions
    const navigateNextImage = useCallback(() => {
        if (!roomDetail?.images) return;
        setCurrentImageIndex(prev => 
            (prev + 1) % roomDetail.images.length
        );
    }, [roomDetail?.images]);

    const navigatePrevImage = useCallback(() => {
        if (!roomDetail?.images) return;
        setCurrentImageIndex(prev => 
            (prev - 1 + roomDetail.images.length) % roomDetail.images.length
        );
    }, [roomDetail?.images]);

    // Touch handling for mobile - Main gallery
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart === null || !roomDetail?.images) return;
        
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                navigateNextImage();
            } else {
                navigatePrevImage();
            }
        }
        setTouchStart(null);
    };

    // Touch handling for Full Screen gallery - STABLE & RELIABLE
    const handleFullScreenTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            setTouchStartFullScreen(e.touches[0].clientX);
        }
    };

    const handleFullScreenTouchEnd = (e: React.TouchEvent) => {
        if (touchStartFullScreen === null || !roomDetail?.images) return;
        
        if (e.changedTouches.length === 1) {
            const touchEnd = e.changedTouches[0].clientX;
            const diff = touchStartFullScreen - touchEnd;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    navigateNextImage();
                } else {
                    navigatePrevImage();
                }
            }
        }
        setTouchStartFullScreen(null);
    };

    // Improved date validation
    const validateDates = (checkIn: string, checkOut: string): boolean => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        
        if (checkInDate < today) {
            toast.error("La date d'arrivée ne peut pas être dans le passé");
            return false;
        }
        
        if (checkOutDate <= checkInDate) {
            toast.error("La date de départ doit être après la date d'arrivée");
            return false;
        }
        
        return true;
    };

    // Date change handlers with validation
    const handleCheckInChange = (date: string) => {
        setCheckInDate(date);
        
        // If check-out is before or equal to new check-in, adjust it
        if (checkOutDate && new Date(checkOutDate) <= new Date(date)) {
            const newCheckOut = new Date(date);
            newCheckOut.setDate(newCheckOut.getDate() + 1);
            setCheckOutDate(newCheckOut.toISOString().split('T')[0]);
        }
    };

    const handleCheckOutChange = (date: string) => {
        if (new Date(date) > new Date(checkInDate)) {
            setCheckOutDate(date);
        } else {
            toast.error("La date de départ doit être après la date d'arrivée");
        }
    };

    // Calculate option price
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
            toast.success(`${option.name} retiré des options`);
        } else {
            setSelectedOptions([...selectedOptions, {
                optionId: option._id, 
                name: option.name, 
                price: option.price,
                quantity: option.pricingType === 'per_day' ? nights : (option.pricingType === 'per_guest' ? guests : 1),
                pricingType: option.pricingType
            }]);
            setOptionsPrice(prev => prev + currentOptionPrice);
            toast.success(`${option.name} ajouté aux options`);
        }
    };

    // Enhanced reservation handler
    const handleReservation = () => {
        if (!validateDates(checkInDate, checkOutDate)) {
            return;
        }

        // Animation feedback
        setIsScrolling(true);
        setTimeout(() => setIsScrolling(false), 1000);

        // Build reservation data
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

        // Persist and navigate with smooth transition
        localStorage.setItem('currentReservation', JSON.stringify(reservationData));
        
        toast.success('Réservation en cours...');
        setTimeout(() => {
            navigate('/payment', { 
                state: reservationData,
                replace: true 
            });
        }, 500);
    };

    // Share functionality
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: apartment.title,
                    text: apartment.subtitle,
                    url: window.location.href,
                });
                toast.success('Partagé avec succès');
            } catch (error) {
                console.log('Partage annulé');
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Lien copié dans le presse-papier');
        }
    };

    const apartment = roomDetail || { 
        title: "Aptent taciti sociosqu ad litora",
        subtitle: "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra.",
        price: 300,
        guests: "jusqu'à 4 invitées",
        bedrooms: "2 chambres à coucher",
        description: "Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
    };

    // Full-screen gallery component - MODE PLEIN ÉCRAN STABLE ET FONCTIONNEL
    const FullScreenGallery = () => {
        if (!showFullScreenGallery || !roomDetail?.images) return null;

        const handleBackdropClick = (e: React.MouseEvent) => {
            // Fermer UNIQUEMENT si clic sur le fond noir (pas sur les enfants)
            if (e.target === e.currentTarget) {
                setShowFullScreenGallery(false);
            }
        };

        const handleCloseClick = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setShowFullScreenGallery(false);
        };

        const handleNavClick = (callback: () => void) => (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            callback();
        };

        return (
            <div
                className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
                onClick={handleBackdropClick}
                onTouchStart={handleFullScreenTouchStart}
                onTouchEnd={handleFullScreenTouchEnd}
            >
                {/* Close button - X */}
                <button
                    className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50 bg-black/50 hover:bg-black/70 rounded-full p-3"
                    onClick={handleCloseClick}
                    aria-label="Fermer la galerie"
                >
                    <X size={24} />
                </button>

                {/* Main image container */}
                <div className="relative w-full h-[80vh] max-w-[90vw] flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center">
                        {imageLoading[currentImageIndex] && (
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                                <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                            </div>
                        )}
                        <img
                            src={
                                roomDetail.images[currentImageIndex]?.includes('cloudinary.com') || 
                                roomDetail.images[currentImageIndex]?.includes('airbnb-backend')
                                    ? roomDetail.images[currentImageIndex]
                                    : `https://airbnb-backend.onrender.com${roomDetail.images[currentImageIndex]}`
                            }
                            alt={`Image ${currentImageIndex + 1}`}
                            className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
                                imageLoading[currentImageIndex] ? 'opacity-0' : 'opacity-100'
                            }`}
                            onLoad={() => handleImageLoad(currentImageIndex)}
                            onError={() => handleImageError(currentImageIndex)}
                        />
                    </div>

                    {/* Navigation arrows */}
                    {roomDetail.images.length > 1 && (
                        <>
                            <button
                                onClick={handleNavClick(navigatePrevImage)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all z-20 hover:scale-110"
                                aria-label="Image précédente"
                                type="button"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={handleNavClick(navigateNextImage)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all z-20 hover:scale-110"
                                aria-label="Image suivante"
                                type="button"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}
                </div>

                {/* Image counter and description */}
                <div className="mt-4 text-center text-white">
                    <div className="text-lg font-semibold">
                        {currentImageIndex + 1} / {roomDetail.images.length}
                    </div>
                    <div className="text-sm text-gray-300 mt-2">
                        {apartment.title} - Image {currentImageIndex + 1}
                    </div>
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2 mt-6 overflow-x-auto py-2 max-w-full px-4">
                    {roomDetail.images.map((img, index) => (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageIndex(index);
                            }}
                            className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all z-10 hover:z-20 ${
                                currentImageIndex === index 
                                    ? 'border-white scale-110' 
                                    : 'border-transparent hover:border-white/50'
                            }`}
                            type="button"
                        >
                            <img
                                src={
                                    img.includes('cloudinary.com') || img.includes('airbnb-backend')
                                        ? img
                                        : `https://airbnb-backend.onrender.com${img}`
                                }
                                alt={`Miniature ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    // Loading skeleton
    if (loadingRoomDetail) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Chargement des détails...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-[#1A1A1A] pb-20">
            {/* Full-screen gallery */}
            <FullScreenGallery />

            {/* Header with action buttons */}
            <nav className="max-w-[1140px] mx-auto px-6 py-6 flex justify-between items-center">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest group"
                >
                    <motion.div
                        whileHover={{ x: -3 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <ArrowLeft size={18} />
                    </motion.div>
                    Retour
                </button>
                
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleShare}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Partager"
                    >
                        <Share2 size={18} />
                    </button>
                    <button
                        onClick={() => setIsFavorite(!isFavorite)}
                        className={`p-2 rounded-full transition-colors ${
                            isFavorite 
                                ? 'bg-red-50 text-red-500' 
                                : 'hover:bg-gray-100 text-gray-600'
                        }`}
                        aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                        <Heart size={18} fill={isFavorite ? "#FF385C" : "none"} />
                    </button>
                </div>
            </nav>

            <div className="max-w-[1140px] mx-auto px-6 space-y-24">
                
                {/* --- SECTION VIDEO & INFOS --- */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Video Background with Clickable Images Below */}
                    <div className="space-y-6">
                        {/* Video Section - Background Style like Apartment Page */}
                        <div className="relative rounded-sm overflow-hidden aspect-[4/3] bg-gray-100 group cursor-pointer">
                            {/* Video Background */}
                            {roomDetail?.videoUrl ? (
                                <div className="relative w-full h-full">
                                    <img
                                        src={
                                            roomDetail.images?.[0] 
                                                ? (roomDetail.images[0].includes('cloudinary.com') || roomDetail.images[0].includes('airbnb-backend')
                                                    ? roomDetail.images[0]
                                                    : `https://airbnb-backend.onrender.com${roomDetail.images[0]}`)
                                                : "https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                        }
                                        className="w-full h-full object-cover"
                                        alt="Video poster"
                                    />
                                    {/* Dark overlay for play button visibility */}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    
                                    {/* VideoPlayer Component with Play Button */}
                                    <VideoPlayer
                                        videoUrl={roomDetail.videoUrl}
                                        posterImage={
                                            roomDetail.images?.[0] 
                                                ? (roomDetail.images[0].includes('cloudinary.com') || roomDetail.images[0].includes('airbnb-backend')
                                                    ? roomDetail.images[0]
                                                    : `https://airbnb-backend.onrender.com${roomDetail.images[0]}`)
                                                : undefined
                                        }
                                        playButtonSize="large"
                                    />
                                </div>
                            ) : (
                                // Fallback to first image if no video
                                <>
                                    {imageLoading[0] && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-5">
                                            <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
                                        </div>
                                    )}
                                    <img
                                        src={
                                            roomDetail?.images?.[0] 
                                                ? (roomDetail.images[0].includes('cloudinary.com') || roomDetail.images[0].includes('airbnb-backend')
                                                    ? roomDetail.images[0]
                                                    : `https://airbnb-backend.onrender.com${roomDetail.images[0]}`)
                                                : "https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                        }
                                        className={`w-full h-full object-cover transition-opacity duration-300 ${
                                            imageLoading[0] ? 'opacity-0' : 'opacity-100'
                                        }`}
                                        alt="Image principale"
                                        onLoad={() => handleImageLoad(0)}
                                        onError={() => handleImageError(0)}
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </>
                            )}
                        </div>

                        {/* Clickable Images Grid Below Video */}
                        {roomDetail?.images && roomDetail.images.length > 0 && (
                            <div className="space-y-3">
                                <div className="grid grid-cols-3 gap-3">
                                    {roomDetail.images.map((img, i) => (
                                        <motion.button
                                            key={i}
                                            onClick={() => {
                                                setCurrentImageIndex(i);
                                                setShowFullScreenGallery(true);
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`relative aspect-square rounded-sm overflow-hidden border-2 transition-all group/img cursor-zoom-in ${
                                                currentImageIndex === i 
                                                    ? 'border-black shadow-lg' 
                                                    : 'border-gray-100 hover:border-gray-300'
                                            }`}
                                            aria-label={`Voir l'image ${i + 1}`}
                                        >
                                            {imageLoading[i] && (
                                                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-5">
                                                    <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                                                </div>
                                            )}
                                            <img 
                                                src={
                                                    img.includes('cloudinary.com') || img.includes('airbnb-backend')
                                                        ? img
                                                        : `https://airbnb-backend.onrender.com${img}`
                                                }
                                                className={`w-full h-full object-cover transition-all duration-300 ${
                                                    imageLoading[i] ? 'opacity-0' : 'opacity-100'
                                                } group-hover/img:scale-110`}
                                                alt={`Image ${i + 1}`}
                                                onLoad={() => handleImageLoad(i)}
                                                onError={(e) => {
                                                    (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/150?text=Image+Error";
                                                    handleImageError(i);
                                                }}
                                            />
                                            {/* Overlay on hover */}
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <Maximize2 size={20} className="text-white" />
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Info section */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div>
                            <h1 className="text-[42px] font-black leading-tight tracking-tight mb-3">{apartment.title}</h1>
                            <p className="text-gray-600 text-[15px] leading-relaxed">{apartment.subtitle}</p>
                        </div>
                        
                        <div className="flex gap-3">
                            <motion.span 
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-[12px] font-bold text-gray-700 bg-gray-50 uppercase tracking-tight"
                            >
                                <Users size={14} /> {formatGuests(apartment.guests)}
                            </motion.span>
                            <motion.span 
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-[12px] font-bold text-gray-700 bg-gray-50 uppercase tracking-tight"
                            >
                                <Bed size={14} /> {formatBedrooms(apartment.bedrooms)}
                            </motion.span>
                        </div>
                        
                        <div className="bg-[#F3F4F6] py-6 px-8 rounded-sm text-center text-sm font-medium text-gray-600">
                            {roomDetail?.subtitle || 'Class aptent taciti per inceptos himenaeos.'}
                        </div>
                        
                        <div className="pt-4 border-t border-gray-100">
                            <h3 className="text-[17px] font-bold mb-4 tracking-tighter flex items-center gap-2">
                                <Calendar size={18} />
                                Informations générales
                            </h3>
                            <InfoRow label="Prix standard" value={`${apartment.price}€ / nuit`} isBold />
                            <InfoRow label="Nombre de personnes" value={formatGuests(apartment.guests)} />
                            <InfoRow label="Nombre de chambres" value={formatBedrooms(apartment.bedrooms)} />
                            {roomDetail?.city && <InfoRow label="Ville" value={roomDetail.city} />}
                            {roomDetail?.country && <InfoRow label="Pays" value={roomDetail.country} />}
                            {roomDetail?.accommodationType && <InfoRow label="Type de logement" value={roomDetail.accommodationType} />}
                            {roomDetail?.includes && roomDetail.includes.length > 0 && (
                                <InfoRow label="Inclus" value={roomDetail.includes.join(', ')} isPink />
                            )}
                            {roomDetail?.amenities && roomDetail.amenities.length > 0 && (
                                <InfoRow label="Équipements et services" value={roomDetail.amenities.join(', ')} />
                            )}
                        </div>

                        {/* Enhanced date picker */}
                        <div className="mt-6 space-y-4">
                            <h4 className="text-[15px] font-bold flex items-center gap-2">
                                <Clock size={16} />
                                Sélectionnez vos dates
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-2 block">Date d'arrivée</label>
                                    <ImprovedDatePicker
                                        value={checkInDate}
                                        onChange={handleCheckInChange}
                                        minDate={new Date().toISOString().split('T')[0]}
                                        highlightToday={true}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-2 block">Date de départ</label>
                                    <ImprovedDatePicker
                                        value={checkOutDate}
                                        onChange={handleCheckOutChange}
                                        minDate={checkInDate || new Date().toISOString().split('T')[0]}
                                        disabled={!checkInDate}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Reservation button with enhanced feedback */}
                        <motion.button 
                            onClick={handleReservation}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            animate={isScrolling ? { y: [0, -5, 0] } : {}}
                            transition={{ y: { repeat: 2, duration: 0.3 } }}
                            className={`w-full mt-4 bg-black text-white py-5 rounded-md font-bold text-[16px] uppercase tracking-widest hover:bg-zinc-800 transition-all relative overflow-hidden ${
                                isScrolling ? 'ring-2 ring-black ring-opacity-20' : ''
                            }`}
                        >
                            <span className="relative z-10">Réserver maintenant</span>
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ duration: 1, repeat: Infinity }}
                            />
                        </motion.button>

                        {/* Features with animations */}
                        {roomDetail?.features && roomDetail.features.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mt-6 pt-6 border-t border-gray-100"
                            >
                                <h3 className="text-[17px] font-bold mb-4 uppercase tracking-tighter">Caractéristiques</h3>
                                <div className="space-y-2">
                                    {roomDetail.features.map((feature, idx) => (
                                        <motion.div 
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded transition-colors"
                                        >
                                            <Check size={18} className="text-green-500 flex-shrink-0" />
                                            <span className="text-[14px] text-gray-700">{feature}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </section>

                {/* --- SECTION DÉTAILS & OPTIONS --- */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-16 border-t border-gray-100">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-[32px] font-bold mb-1">Détails de l'appartement</h2>
                            <p className="text-gray-500 text-sm">{roomDetail?.accommodationType || 'Détails complets du logement'}</p>
                        </div>
                        
                        <div>
                            <h3 className="text-[20px] font-bold mb-4">Description</h3>
                            <div className="bg-[#F8F9FA] p-10 rounded-[32px] text-gray-700 leading-relaxed text-[15px]">
                                {apartment.description}
                            </div>
                        </div>

                        {/* Main features */}
                        {roomDetail?.features && roomDetail.features.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-[17px] font-bold uppercase tracking-tighter flex items-center gap-2 text-orange-900">
                                    <span>⭐</span> Caractéristiques principales
                                </h3>
                                <div className="space-y-2">
                                    {roomDetail.features.map((feature, idx) => (
                                        <motion.div 
                                            key={idx}
                                            whileHover={{ x: 5 }}
                                            className="flex items-center gap-3 p-2 hover:bg-orange-50 rounded transition-colors"
                                        >
                                            <Check size={18} className="text-orange-600 flex-shrink-0" />
                                            <span className="text-[14px] text-orange-900">{feature}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Options section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-[#F8F9FA] rounded-[40px] p-8 md:p-12 border border-gray-100"
                    >
                        <div className="text-center mb-8">
                            <h3 className="text-[22px] font-bold mb-1">Options supplémentaires</h3>
                            <p className="text-gray-500 text-sm">Personnalisez votre séjour</p>
                        </div>
                        
                        {roomDetail?.additionalOptions && roomDetail.additionalOptions.length > 0 ? (
                            <>
                                {/* Option images preview */}
                                <div className="flex justify-center gap-3 mb-10 flex-wrap">
                                    {roomDetail.additionalOptions.slice(0, 4).map((option, i) => (
                                        <motion.div 
                                            key={i}
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer"
                                            onClick={() => setExpandedOption(option.optionId)}
                                        >
                                            {option.image ? (
                                                <img
                                                    src={option.image}
                                                    alt={option.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                                                        (e.currentTarget as HTMLImageElement).parentElement!.innerHTML = '✨';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-2xl bg-gradient-to-br from-pink-100 to-pink-50">
                                                    ✨
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Options list */}
                                <div className="space-y-3">
                                    {roomDetail.additionalOptions.map((option) => (
                                        <motion.div 
                                            key={option.optionId}
                                            layout
                                            className={`bg-white border border-gray-200 rounded-xl overflow-hidden transition-all ${
                                                expandedOption === option.optionId ? 'shadow-xl ring-1 ring-black/5' : ''
                                            }`}
                                        >
                                            <button 
                                                onClick={() => setExpandedOption(expandedOption === option.optionId ? null : option.optionId)} 
                                                className="w-full p-5 flex justify-between items-center group gap-4"
                                            >
                                                <motion.div 
                                                    whileHover={{ rotate: 10 }}
                                                    className="w-12 h-12 rounded-lg flex-shrink-0 bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center text-xl overflow-hidden"
                                                >
                                                    {option.image ? (
                                                        <img
                                                            src={option.image}
                                                            alt={option.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span>✨</span>
                                                    )}
                                                </motion.div>
                                                <span className={`text-[15px] font-bold flex-1 transition-colors text-left ${
                                                    selectedOptions.some(o => o.optionId === option.optionId) ? 'text-[#FF385C]' : 'text-gray-800'
                                                }`}>
                                                    {option.name}
                                                    {selectedOptions.some(o => o.optionId === option.optionId) && (
                                                        <Check size={14} className="inline ml-2" />
                                                    )}
                                                </span>
                                                <motion.div 
                                                    animate={{ rotate: expandedOption === option.optionId ? 180 : 0 }}
                                                    className="bg-gray-50 p-1.5 rounded-full group-hover:bg-gray-100 transition-colors"
                                                >
                                                    <ChevronDown size={18} className="text-gray-400" />
                                                </motion.div>
                                            </button>

                                            <AnimatePresence>
                                                {expandedOption === option.optionId && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="p-8 pt-0 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-8">
                                                            <div className="space-y-4">
                                                                <div className="w-full h-48 bg-gradient-to-br from-pink-100 to-pink-50 rounded-lg flex items-center justify-center text-5xl overflow-hidden">
                                                                    {option.image ? (
                                                                        <img
                                                                            src={option.image}
                                                                            alt={option.name}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <span>✨</span>
                                                                    )}
                                                                </div>
                                                                <h4 className="text-[12px] font-black uppercase text-black tracking-widest">{option.name}</h4>
                                                                <p className="text-[13px] text-gray-400 leading-relaxed font-medium">Option supplémentaire pour votre séjour</p>
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
                                                                            <button 
                                                                                onClick={() => option.pricingType === 'per_guest' ? setGuests(Math.max(1, guests-1)) : setNights(Math.max(1, nights-1))} 
                                                                                className="text-white p-1 hover:text-gray-300"
                                                                            >
                                                                                <Minus size={14}/>
                                                                            </button>
                                                                            <span className="text-white px-3 text-sm font-bold min-w-[20px] text-center">
                                                                                {option.pricingType === 'per_guest' ? guests : nights}
                                                                            </span>
                                                                            <button 
                                                                                onClick={() => option.pricingType === 'per_guest' ? setGuests(guests+1) : setNights(nights+1)} 
                                                                                className="text-white p-1 hover:text-gray-300"
                                                                            >
                                                                                <Plus size={14}/>
                                                                            </button>
                                                                        </div>
                                                                        <span className="font-black text-[22px] text-gray-900">{calculateOptionPrice(option)}€</span>
                                                                    </div>
                                                                </div>
                                                                <motion.button 
                                                                    onClick={() => handleOptionToggle(option)}
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    className={`w-full mt-8 py-4 rounded-xl font-black text-[12px] uppercase tracking-widest transition-all ${
                                                                        selectedOptions.some(o => o.optionId === option.optionId) 
                                                                            ? 'bg-gray-100 text-gray-500' 
                                                                            : 'bg-[#FF385C] text-white hover:brightness-110 shadow-lg shadow-pink-200'
                                                                    }`}
                                                                >
                                                                    {selectedOptions.some(o => o.optionId === option.optionId) ? 'Retirer du panier' : 'Ajouter au séjour'}
                                                                </motion.button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <p className="text-sm font-medium">Aucune option supplémentaire pour cette chambre</p>
                            </div>
                        )}
                        
                        {/* Options summary */}
                        {selectedOptions.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 text-center"
                            >
                                <div className="text-[12px] font-bold uppercase text-gray-400 tracking-widest mb-2">
                                    Total des options
                                </div>
                                <div className="text-2xl font-black text-[#FF385C]">
                                    {optionsPrice}€
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </section>
            </div>
        </div>
    );
}

function InfoRow({ label, value, isBold, isPink }: any) {
    return (
        <motion.div 
            whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
            className="flex justify-between items-baseline py-3 px-2 rounded transition-colors border-b border-gray-50 last:border-0"
        >
            <span className="text-gray-400 text-[13px] font-semibold uppercase tracking-tight">{label}</span>
            <span className={`${isBold ? 'text-[20px] font-black' : 'text-[14px] font-bold'} ${isPink ? 'text-[#FF385C]' : 'text-gray-900'}`}>
                {value}
            </span>
        </motion.div>
    );
}

export default AppartmentDetail;