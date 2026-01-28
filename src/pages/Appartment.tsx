import React, { memo, useState, useEffect, useCallback } from 'react';
import { Play, Newspaper, Check, Users, Bed, Edit3, Upload, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoPlayer from "@/components/VideoPlayer";
import { formatGuests, formatBedrooms, extractNumber } from "@/utils/numberExtractor";
import heroRoom from "@/assets/hero-room.jpg";
import room1 from "@/assets/room-1.jpg";
import room2 from "@/assets/room-2.jpg";
import room3 from "@/assets/room-3.jpg";
import room4 from "@/assets/room-4.jpg";
import room5 from "@/assets/room-5.jpg";
import room6 from "@/assets/room-6.jpg";
import room7 from "@/assets/room-7.jpg";
import room8 from "@/assets/room-8.jpg";
import room9 from "@/assets/room-9.jpg";
import bedroomSmall from "@/assets/bedroom-small.jpg";
import bedroomLarge from "@/assets/bedroom-large.jpg";
import showcaseRoom from "@/assets/appartement-photo.png";
import hotelRoomMain from "@/assets/hotel-room-main.jpg";
import hotelRoomView from "@/assets/hotel-room-view.jpg";
import hotelRoomDetail from "@/assets/hotel-room-detail.jpg";
import videoCover from "@/assets/video-cover.jpg";
import finalRoom1 from "@/assets/final-room-1.jpg";
import finalRoom2 from "@/assets/final-room-2.jpg";
import { apartmentApi, ApartmentPageData } from '@/services/apartmentApi';

// --- CONFIGURATION DE LA GRILLE UNIFIÉE ---
const GRID_CONTAINER = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

// --- IMAGES PAR DÉFAUT ---
const DEFAULT_IMAGES = {
  heroRoom,
  room1, room2, room3, room4, room5, room6, room7, room8, room9,
  bedroomSmall,
  bedroomLarge,
  showcaseRoom,
  hotelRoomMain,
  hotelRoomView,
  hotelRoomDetail,
  videoCover,
  finalRoom1,
  finalRoom2
};

// --- FONCTION POUR NORMALISER LES URLS D'IMAGES ---
const normalizeImageUrl = (url: string | any): string => {
  if (!url) return '';
  
  const urlStr = typeof url === 'string' ? url : String(url);
  
  // Si c'est une URL Cloudinary, la retourner telle quelle
  if (urlStr.includes('cloudinary.com')) {
    return urlStr;
  }
  
  if (urlStr.startsWith('http://') || urlStr.startsWith('https://')) {
    return urlStr;
  }
  
  if (urlStr.startsWith('/uploads')) {
    const backendOrigin = 'https://airbnb-backend.onrender.com';
    return `${backendOrigin}${urlStr}`;
  }
  
  // Mapper les chemins /assets/ aux assets importés
  if (urlStr.startsWith('/assets/')) {
    const assetName = urlStr.replace('/assets/', '');
    const assetKey = assetName.replace('.jpg', '').replace('.png', '');
    
    const assetMap: { [key: string]: string } = {
      'hero-room': heroRoom,
      'room-1': room1,
      'room-2': room2,
      'room-3': room3,
      'room-4': room4,
      'room-5': room5,
      'room-6': room6,
      'room-7': room7,
      'room-8': room8,
      'room-9': room9,
      'bedroom-small': bedroomSmall,
      'bedroom-large': bedroomLarge,
      'appartement-photo': showcaseRoom,
      'hotel-room-main': hotelRoomMain,
      'hotel-room-view': hotelRoomView,
      'hotel-room-detail': hotelRoomDetail,
      'video-cover': videoCover,
      'final-room-1': finalRoom1,
      'final-room-2': finalRoom2,
    };
    
    return assetMap[assetKey] || urlStr;
  }
  
  return urlStr;
};

// --- FONCTION POUR AJOUTER UN CACHE-BUSTER ---
const addCacheBuster = (url: string, version?: number, timestamp?: number): string => {
  if (!url) return url;
  
  const timestampParam = timestamp || Date.now();
  const versionParam = version ? `&version=${version}` : '';
  const random = Math.random().toString(36).substring(7);
  const cacheParam = `t=${timestampParam}${versionParam}&r=${random}`;
  
  return url.includes('?') ? `${url}&${cacheParam}` : `${url}?${cacheParam}`;
};

// ===================================================================
// ROOMCARD COMPONENT
// ===================================================================
interface RoomCardProps {
  image: string;
  title: string;
  description: string;
  guests: string;
  bedrooms: string;
  id: number;
  isAdmin?: boolean;
  onImageUpload?: (file: File) => Promise<string>;
  onUpdate?: (field: string, value: any) => void;
}

const RoomCard = memo(({ 
  image, 
  title, 
  description, 
  guests, 
  bedrooms, 
  id,
  isAdmin = false,
  onImageUpload,
  onUpdate
}: RoomCardProps) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const [tempDescription, setTempDescription] = useState(description);
  const [tempGuests, setTempGuests] = useState(guests);
  const [tempBedrooms, setTempBedrooms] = useState(bedrooms);
  const [isUploading, setIsUploading] = useState(false);

  const handleReserve = () => {
    navigate(`/apartment/${id}`);
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate('title', tempTitle);
      onUpdate('description', tempDescription);
      onUpdate('guests', tempGuests);
      onUpdate('bedrooms', tempBedrooms);
    }
    setIsEditing(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload || !onUpdate) return;

    setIsUploading(true);
    try {
      const result = await onImageUpload(file);
      onUpdate('image', result.url);
    } catch (error) {
      console.error('Erreur upload image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-card rounded-2xl shadow-lg overflow-hidden border-2 border-blue-500">
        <div className="aspect-[4/3] overflow-hidden relative">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          {isAdmin && (
            <label className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs cursor-pointer z-10 flex items-center gap-1">
              {isUploading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Upload className="w-3 h-3" />
              )}
              Changer
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            </label>
          )}
        </div>
        
        <div className="p-5">
          <input
            type="text"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            className="font-montserrat font-bold text-foreground text-lg mb-1 w-full border rounded p-2"
          />
          <textarea
            value={tempDescription}
            onChange={(e) => setTempDescription(e.target.value)}
            className="font-montserrat text-muted-foreground text-sm mb-4 w-full border rounded p-2 h-20"
          />
          
          <div className="flex flex-wrap gap-2 mb-5">
            <input
              type="text"
              value={tempGuests}
              onChange={(e) => setTempGuests(e.target.value)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-full text-sm font-montserrat w-full"
              placeholder="ex: jusqu'à 4 invités"
            />
            <input
              type="text"
              value={tempBedrooms}
              onChange={(e) => setTempBedrooms(e.target.value)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-full text-sm font-montserrat w-full"
              placeholder="ex: 2 chambres à coucher"
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleSave}
              className="bg-green-500 text-white font-montserrat font-semibold px-4 py-2 rounded-full flex-1"
            >
              Sauvegarder
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 text-gray-700 font-montserrat font-semibold px-4 py-2 rounded-full"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {isAdmin && (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-2 right-2 bg-black/70 text-white p-2 rounded-full hover:bg-black transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="font-montserrat font-bold text-foreground text-lg mb-1">
          {title}
        </h3>
        <p className="font-montserrat text-muted-foreground text-sm mb-4">
          {description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-full text-sm font-montserrat">
            <Users className="w-4 h-4" />
            {formatGuests(guests)}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-full text-sm font-montserrat">
            <Bed className="w-4 h-4" />
            {formatBedrooms(bedrooms)}
          </span>
        </div>
        
        {/* Button */}
        <button 
          onClick={handleReserve}
          className="bg-accent text-accent-foreground font-montserrat font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity w-full"
        >
          Reserver
        </button>
      </div>
    </div>
  );
});

// ===================================================================
// EDITABLE TEXT COMPONENT
// ===================================================================
interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  isAdmin?: boolean;
}

const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  className = '',
  multiline = false,
  placeholder = '',
  isAdmin = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  if (!isAdmin || !isEditing) {
    return (
      <div 
        onClick={() => isAdmin && setIsEditing(true)}
        className={`cursor-${isAdmin ? 'pointer' : 'default'} hover:${isAdmin ? 'bg-gray-50' : ''} p-1 rounded transition-colors ${className}`}
      >
        {multiline ? (
          <div className="whitespace-pre-wrap">{value || placeholder}</div>
        ) : (
          <div>{value || placeholder}</div>
        )}
        {isAdmin && !isEditing && (
          <Edit3 className="w-4 h-4 text-gray-400 mt-1" />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {multiline ? (
        <textarea
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          className={`w-full p-3 border rounded-lg ${className}`}
          rows={4}
          placeholder={placeholder}
          autoFocus
        />
      ) : (
        <input
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          className={`w-full p-3 border rounded-lg ${className}`}
          placeholder={placeholder}
          autoFocus
        />
      )}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-4 rounded-lg"
        >
          Sauvegarder
        </button>
        <button
          onClick={handleCancel}
          className="bg-gray-300 hover:bg-gray-400 text-sm py-2 px-4 rounded-lg"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

// ===================================================================
// EDITABLE IMAGE COMPONENT
// ===================================================================
interface EditableImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClass?: string;
  isAdmin?: boolean;
  onImageUpload?: (file: File) => Promise<string>;
  onUpdate?: (url: string) => void;
}

const EditableImage: React.FC<EditableImageProps> = ({
  src,
  alt,
  className = '',
  containerClass = '',
  isAdmin = false,
  onImageUpload,
  onUpdate
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload || !onUpdate) return;

    setIsUploading(true);
    try {
      const result = await onImageUpload(file);
      onUpdate(result.url);
    } catch (error) {
      console.error('Erreur upload image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`relative ${containerClass}`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
      />
      {isAdmin && (
        <label className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-md cursor-pointer z-10 flex items-center gap-2 hover:bg-white transition-colors">
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          Changer
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
};

// ===================================================================
// HEROSECTION COMPONENT
// ===================================================================
interface HeroSectionProps {
  data: ApartmentPageData['heroSection'];
  isAdmin?: boolean;
  onUpdate?: (section: string, field: string, value: any) => Promise<void>;
  onUploadImage?: (file: File) => Promise<string>;
}

const HeroSection: React.FC<HeroSectionProps> = memo(({ 
  data, 
  isAdmin = false, 
  onUpdate, 
  onUploadImage 
}) => {
  const handleUpdate = useCallback(async (field: string, value: any) => {
    if (onUpdate) {
      await onUpdate('heroSection', field, value);
    }
  }, [onUpdate]);

  const handleImageUpload = useCallback(async (file: File) => {
    if (onUploadImage && onUpdate) {
      const result = await onUploadImage(file);
      await onUpdate('heroSection', 'backgroundImage', result.url);
      return result;
    }
    return { url: '' };
  }, [onUploadImage, onUpdate]);

  const getImageSrc = useCallback(() => {
    if (!data?.backgroundImage) return heroRoom;
    
    const normalizedUrl = normalizeImageUrl(data.backgroundImage);
    if (normalizedUrl.includes('/uploads/')) {
      return addCacheBuster(normalizedUrl);
    }
    
    return normalizedUrl;
  }, [data?.backgroundImage]);

  if (!data) return null;

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className={GRID_CONTAINER}>
        <div className="flex flex-col lg:flex-row bg-[#EBEBEB] overflow-hidden rounded-sm min-h-[500px] lg:min-h-[600px]">
          
          {/* Colonne Gauche : Contenu texte */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-16 xl:p-24">
            <EditableText
              value={data.titleLine1 || 'INTERDUM,'}
              onChange={(value) => handleUpdate('titleLine1', value)}
              className="text-black font-sans font-black text-4xl md:text-5xl lg:text-[56px] xl:text-[75px] leading-[0.9] tracking-tighter uppercase mb-2"
              multiline={false}
              isAdmin={isAdmin}
            />
            <EditableText
              value={data.titleLine2 || 'AC ALIQUET'}
              onChange={(value) => handleUpdate('titleLine2', value)}
              className="text-black font-sans font-black text-4xl md:text-5xl lg:text-[56px] xl:text-[75px] leading-[0.9] tracking-tighter uppercase mb-2"
              multiline={false}
              isAdmin={isAdmin}
            />
            <EditableText
              value={data.titleLine3 || 'ODIO MATTIS.'}
              onChange={(value) => handleUpdate('titleLine3', value)}
              className="text-black font-sans font-black text-4xl md:text-5xl lg:text-[56px] xl:text-[75px] leading-[0.9] tracking-tighter uppercase mb-8"
              multiline={false}
              isAdmin={isAdmin}
            />
            <EditableText
              value={data.description || "Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis."}
              onChange={(value) => handleUpdate('description', value)}
              className="text-gray-800 font-sans text-sm sm:text-base md:text-lg max-w-md leading-relaxed font-medium"
              multiline={true}
              isAdmin={isAdmin}
            />
          </div>
          
          {/* Colonne Droite : Image */}
          <div className="w-full lg:w-1/2 h-[400px] lg:h-auto">
            <EditableImage
              src={getImageSrc()}
              alt="Luxury modern apartment"
              className="w-full h-full object-cover"
              isAdmin={isAdmin}
              onImageUpload={handleImageUpload}
              onUpdate={(url) => handleUpdate('backgroundImage', url)}
            />
          </div>
        </div>
      </div>
    </section>
  );
});

// ===================================================================
// ROOMSSECTION COMPONENT
// ===================================================================
interface RoomsSectionProps {
  data: ApartmentPageData['roomsSection'];
  isAdmin?: boolean;
  onUpdate?: (section: string, field: string, value: any) => Promise<void>;
  onUploadImage?: (file: File) => Promise<string>;
}

const INITIAL_ROOMS_COUNT = 6;
const LOAD_MORE_INCREMENT = 6;

const RoomsSection: React.FC<RoomsSectionProps> = memo(({ 
  data, 
  isAdmin = false, 
  onUpdate, 
  onUploadImage 
}) => {
  const [visibleRoomsCount, setVisibleRoomsCount] = useState(INITIAL_ROOMS_COUNT);
  
  const handleUpdate = useCallback(async (field: string, value: any) => {
    if (onUpdate) {
      await onUpdate('roomsSection', field, value);
    }
  }, [onUpdate]);

  const handleRoomUpdate = useCallback(async (roomIndex: number, field: string, value: any) => {
    if (onUpdate && data?.rooms) {
      const newRooms = [...data.rooms];
      newRooms[roomIndex] = { ...newRooms[roomIndex], [field]: value };
      await onUpdate('roomsSection', 'rooms', newRooms);
    }
  }, [onUpdate, data?.rooms]);

  const handleLoadMore = () => {
    setVisibleRoomsCount(prevCount => Math.min(prevCount + LOAD_MORE_INCREMENT, data?.rooms?.length || 0));
  };
  
  const handleShowLess = () => {
    setVisibleRoomsCount(INITIAL_ROOMS_COUNT);
  };
  
  const visibleRooms = data?.rooms?.slice(0, visibleRoomsCount) || [];
  const allRoomsVisible = visibleRoomsCount >= (data?.rooms?.length || 0);

  const getRoomImageSrc = useCallback((imageUrl: string) => {
    if (!imageUrl) return room1;
    
    const normalizedUrl = normalizeImageUrl(imageUrl);
    if (normalizedUrl.includes('/uploads/')) {
      return addCacheBuster(normalizedUrl);
    }
    
    return normalizedUrl;
  }, []);

  if (!data) return null;

  return (
    <section className="py-16 lg:py-24 bg-white font-sans">
      <div className={GRID_CONTAINER}>
        
        {/* --- EN-TÊTE : Titre et Description --- */}
        <div className="flex flex-col items-center text-center mb-12 lg:mb-20">
          <EditableText
            value={data.title || "Adipiscing elit amet consectetur."}
            onChange={(value) => handleUpdate('title', value)}
            className="text-3xl sm:text-4xl lg:text-[48px] font-bold text-black leading-[1.1] mb-6 tracking-tight"
            multiline={true}
            isAdmin={isAdmin}
          />
          <EditableText
            value={data.description || "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."}
            onChange={(value) => handleUpdate('description', value)}
            className="text-gray-600 text-sm sm:text-base max-w-2xl leading-relaxed font-medium"
            multiline={true}
            isAdmin={isAdmin}
          />
          
          {/* Compteur de chambres visibles */}
          <div className="mt-4 text-gray-500 text-sm font-medium">
            Affichage de {visibleRooms.length} sur {data.rooms?.length || 0} chambres disponibles
          </div>
        </div>
        
        {/* --- GRILLE DES CHAMBRES (3 colonnes sur Desktop) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {visibleRooms.map((room, index) => (
            <div key={room.id || index} className="flex justify-center">
              <RoomCard 
                {...room}
                image={getRoomImageSrc(room.image)}
                isAdmin={isAdmin}
                onImageUpload={onUploadImage}
                onUpdate={(field, value) => handleRoomUpdate(index, field, value)}
              />
            </div>
          ))}
        </div>
        
        {/* --- ACTIONS : Boutons de contrôle --- */}
        <div className="flex justify-center mt-16 lg:mt-24">
          {!allRoomsVisible ? (
            <button 
              onClick={handleLoadMore}
              className="bg-black hover:bg-[#1a1a1a] text-white font-bold px-12 py-4 rounded-[4px] transition-all duration-300 text-sm tracking-widest shadow-lg active:scale-95 hover:shadow-xl"
            >
              {data.loadMoreText || `Affichez plus de chambres (+${LOAD_MORE_INCREMENT})`}
            </button>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p className="text-gray-600 font-medium">
                Toutes nos chambres sont affichées
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={handleShowLess}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-8 py-3 rounded-[4px] transition-all duration-300 text-sm tracking-wider active:scale-95"
                >
                  {data.showLessText || "Réduire l'affichage"}
                </button>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="bg-black hover:bg-[#1a1a1a] text-white font-bold px-8 py-3 rounded-[4px] transition-all duration-300 text-sm tracking-wider active:scale-95"
                >
                  {data.backToTopText || "Retour en haut"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

// ===================================================================
// FEATURESECTION COMPONENT
// ===================================================================
interface FeatureSectionProps {
  data: ApartmentPageData['featureSection'];
  isAdmin?: boolean;
  onUpdate?: (section: string, field: string, value: any) => Promise<void>;
  onUploadImage?: (file: File) => Promise<string>;
}

const FeatureSection: React.FC<FeatureSectionProps> = memo(({ 
  data, 
  isAdmin = false, 
  onUpdate, 
  onUploadImage 
}) => {
  const handleUpdate = useCallback(async (field: string, value: any) => {
    if (onUpdate) {
      await onUpdate('featureSection', field, value);
    }
  }, [onUpdate]);

  const handleImageUpdate = useCallback(async (imageField: string, file: File) => {
    if (onUploadImage && onUpdate) {
      const result = await onUploadImage(file);
      await onUpdate('featureSection', `images.${imageField}`, result.url);
      return result;
    }
    return { url: '' };
  }, [onUploadImage, onUpdate]);

  const getImageSrc = useCallback((imageField: 'small' | 'large') => {
    if (!data?.images?.[imageField]) {
      return imageField === 'small' ? bedroomSmall : bedroomLarge;
    }
    
    const normalizedUrl = normalizeImageUrl(data.images[imageField]);
    if (normalizedUrl.includes('/uploads/')) {
      return addCacheBuster(normalizedUrl);
    }
    
    return normalizedUrl;
  }, [data?.images]);

  if (!data) return null;

  return (
    <section className="py-12 lg:py-20">
      <div className={GRID_CONTAINER}>
        <div className="bg-[#EBEBEB] py-12 lg:py-16 px-8 lg:px-12 rounded-lg">
          
          {/* Top Section */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-20">
            {/* Left Title */}
            <EditableText
              value={data.mainTitle || "Consectetur ipsum elit"}
              onChange={(value) => handleUpdate('mainTitle', value)}
              className="font-serif text-[42px] leading-[1.15] tracking-tight text-foreground lg:text-[52px]"
              multiline={true}
              isAdmin={isAdmin}
            />

            {/* Right Paragraph */}
            <EditableText
              value={data.mainDescription || "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."}
              onChange={(value) => handleUpdate('mainDescription', value)}
              className="text-base leading-[1.7] text-foreground lg:text-lg"
              multiline={true}
              isAdmin={isAdmin}
            />
          </div>

          {/* Cards Section */}
          <div className="mt-12 grid grid-cols-1 gap-6 lg:mt-16 lg:grid-cols-2 lg:gap-10">
            {/* Left Column - Cards */}
            <div className="flex flex-col gap-4">
              {/* Dark Card */}
              <div className="rounded-lg bg-black px-7 pb-7 pt-6 text-white">
                <EditableText
                  value={data.darkCard?.title || "Nunc vulputate libero et velit interdum, ac aliquet odio mattis."}
                  onChange={(value) => handleUpdate('darkCard.title', value)}
                  className="mb-8 text-lg font-normal leading-snug lg:text-xl"
                  multiline={true}
                  isAdmin={isAdmin}
                />

                <div className="flex items-end justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md border border-white/20 bg-gray-500">
                    <Newspaper className="h-5 w-5 opacity-80" />
                  </div>
                  <EditableText
                    value={data.darkCard?.footer || "Amet, consectetur adipiscing elit."}
                    onChange={(value) => handleUpdate('darkCard.footer', value)}
                    className="text-right text-[13px] leading-relaxed text-white/60"
                    multiline={true}
                    isAdmin={isAdmin}
                  />
                </div>
              </div>

              {/* Light Card */}
              <div className="overflow-hidden rounded-lg border border-border bg-white">
                <div className="flex">
                  <div className="flex flex-1 flex-col justify-center px-5 py-4">
                    <EditableText
                      value={data.lightCard?.title || "Nunc vulputate libero"}
                      onChange={(value) => handleUpdate('lightCard.title', value)}
                      className="text-[15px] font-semibold leading-snug text-black"
                      multiline={true}
                      isAdmin={isAdmin}
                    />
                  </div>
                  <div className="w-28 flex-shrink-0 lg:w-32">
                    <EditableImage
                      src={getImageSrc('small')}
                      alt="bedroom"
                      containerClass="h-full w-full"
                      isAdmin={isAdmin}
                      onImageUpload={(file) => handleImageUpdate('small', file)}
                      onUpdate={(url) => handleUpdate('images.small', url)}
                    />
                  </div>
                </div>
                <div className="flex items-end justify-between border-t border-border px-5 py-4">
                  <EditableText
                    value={data.lightCard?.description || "Rorem ipsum dolor sit amet, consectetur adipiscing elit"}
                    onChange={(value) => handleUpdate('lightCard.description', value)}
                    className="text-[13px] leading-relaxed text-gray-500"
                    multiline={true}
                    isAdmin={isAdmin}
                  />
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#FF2E63]">
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Large Image */}
            <div className="flex flex-col justify-end">
              <div className="overflow-hidden rounded-lg">
                <EditableImage
                  src={getImageSrc('large')}
                  alt="bedroom large"
                  containerClass="h-auto w-full lg:h-[200px]"
                  isAdmin={isAdmin}
                  onImageUpload={(file) => handleImageUpdate('large', file)}
                  onUpdate={(url) => handleUpdate('images.large', url)}
                />
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <div className="mt-12 flex flex-col justify-between gap-6 sm:flex-row lg:mt-16">
            {data.footerTexts?.map((text, index) => (
              <EditableText
                key={index}
                value={text || "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."}
                onChange={(value) => {
                  if (onUpdate) {
                    const newTexts = [...(data.footerTexts || [])];
                    newTexts[index] = value;
                    onUpdate('footerTexts', newTexts);
                  }
                }}
                className="text-[13px] leading-relaxed text-gray-500"
                multiline={true}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

// ===================================================================
// SHOWCASESECTION COMPONENT
// ===================================================================
interface ShowcaseSectionProps {
  data: ApartmentPageData['showcaseSection'];
  isAdmin?: boolean;
  onUpdate?: (section: string, field: string, value: any) => Promise<void>;
  onUploadImage?: (file: File) => Promise<string>;
}

const ShowcaseSection: React.FC<ShowcaseSectionProps> = memo(({ 
  data, 
  isAdmin = false, 
  onUpdate, 
  onUploadImage 
}) => {
  const handleUpdate = useCallback(async (field: string, value: any) => {
    if (onUpdate) {
      await onUpdate('showcaseSection', field, value);
    }
  }, [onUpdate]);

  const handleImageUpload = useCallback(async (file: File) => {
    if (onUploadImage && onUpdate) {
      const result = await onUploadImage(file);
      await onUpdate('showcaseSection', 'image', result.url);
      return result;
    }
    return { url: '' };
  }, [onUploadImage, onUpdate]);

  const handleCheckItemUpdate = useCallback(async (index: number, value: string) => {
    if (onUpdate && data?.checkItems) {
      const newCheckItems = [...data.checkItems];
      newCheckItems[index] = { text: value };
      await onUpdate('showcaseSection', 'checkItems', newCheckItems);
    }
  }, [onUpdate, data?.checkItems]);

  const getImageSrc = useCallback(() => {
    if (!data?.image) return showcaseRoom;
    
    const normalizedUrl = normalizeImageUrl(data.image);
    if (normalizedUrl.includes('/uploads/')) {
      return addCacheBuster(normalizedUrl);
    }
    
    return normalizedUrl;
  }, [data?.image]);

  if (!data) return null;

  return (
    <section className="py-12 lg:py-20 bg-white">
      <div className={GRID_CONTAINER}>
        <div className="bg-[#EBEBEB] rounded-lg py-16 lg:py-24 px-8 lg:px-16 xl:px-24 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left - Image with decorative elements */}
            <div className="relative">
              {/* Gray decorative rectangle - top */}
              <div 
                className="absolute -top-10 left-[80%] w-40 h-40 z-5"
                style={{ backgroundColor: data.decorativeElements?.grayRectangle || '#9CA3AF' }}
              />
              
              {/* Main image */}
              <div className="relative z-10 overflow-hidden rounded-sm">
                <EditableImage
                  src={getImageSrc()}
                  alt="Elegant bedroom"
                  className="w-full object-cover"
                  isAdmin={isAdmin}
                  onImageUpload={handleImageUpload}
                  onUpdate={(url) => handleUpdate('image', url)}
                />
              </div>
              
              {/* Pink decorative square - bottom left */}
              <div 
                className="absolute -bottom-8 -left-20 w-20 h-20 z-20"
                style={{ backgroundColor: data.decorativeElements?.pinkSquare || '#FF2E63' }}
              />
            </div>
            
            {/* Right - Content */}
            <div className="lg:pl-8 relative z-10">
              <EditableText
                value={data.title || "Elit amet, consectetur"}
                onChange={(value) => handleUpdate('title', value)}
                className="font-serif font-bold text-black text-3xl lg:text-4xl xl:text-[42px] leading-tight mb-6"
                multiline={true}
                isAdmin={isAdmin}
              />
              
              <EditableText
                value={data.description || "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."}
                onChange={(value) => handleUpdate('description', value)}
                className="text-gray-700 text-sm lg:text-base leading-relaxed mb-8 max-w-md"
                multiline={true}
                isAdmin={isAdmin}
              />
              
              {/* Check items grid */}
              <div className="grid grid-cols-2 gap-4">
                {data.checkItems?.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#FF2E63] flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <EditableText
                      value={item.text || "Lorem ipsum dolor"}
                      onChange={(value) => handleCheckItemUpdate(index, value)}
                      className="text-black font-semibold text-sm flex-1"
                      multiline={false}
                      isAdmin={isAdmin}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

// ===================================================================
// PERFECTSHOW COMPONENT
// ===================================================================
interface PerfectShowProps {
  data: ApartmentPageData['perfectShowSection'];
  isAdmin?: boolean;
  onUpdate?: (section: string, field: string, value: any) => Promise<void>;
  onUploadImage?: (file: File) => Promise<string>;
}

const PerfectShow: React.FC<PerfectShowProps> = memo(({ 
  data, 
  isAdmin = false, 
  onUpdate, 
  onUploadImage 
}) => {
  const handleUpdate = useCallback(async (field: string, value: any) => {
    if (onUpdate) {
      await onUpdate('perfectShowSection', field, value);
    }
  }, [onUpdate]);

  const handleImageUpload = useCallback(async (imageField: string, file: File) => {
    if (onUploadImage && onUpdate) {
      const result = await onUploadImage(file);
      await onUpdate('perfectShowSection', `images.${imageField}`, result.url);
      return result;
    }
    return { url: '' };
  }, [onUploadImage, onUpdate]);

  const getImageSrc = useCallback((imageField: 'main' | 'view' | 'detail') => {
    const defaultImages = {
      main: hotelRoomMain,
      view: hotelRoomView,
      detail: hotelRoomDetail
    };
    
    if (!data?.images?.[imageField]) {
      return defaultImages[imageField];
    }
    
    const normalizedUrl = normalizeImageUrl(data.images[imageField]);
    if (normalizedUrl.includes('/uploads/')) {
      return addCacheBuster(normalizedUrl);
    }
    
    return normalizedUrl;
  }, [data?.images]);

  if (!data) return null;

  return (
    <section className="bg-white py-8 sm:py-12 md:py-16 lg:py-0 overflow-hidden">
      <div className={`${GRID_CONTAINER}`}>
        <div className="bg-gray-200 relative rounded-2xl sm:rounded-3xl lg:rounded-[2rem] overflow-hidden py-8 sm:py-10 md:py-12 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
          
          {/* Gray Background Block - masqué sur mobile/tablette */}
          <div 
            className="hidden lg:block absolute left-[35%] top-[42%] w-[50%] h-[65%] bg-gray-400 z-0" 
          />
          
          <div className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-0">
              
              {/* Left Content Column */}
              <div className="lg:col-span-5 flex flex-col justify-start pt-4 lg:pt-8 order-2 lg:order-1 relative z-20">
                <EditableText
                  value={data.title || "Class aptent taciti sociosqu ad litora torquent."}
                  onChange={(value) => handleUpdate('title', value)}
                  className="font-display text-2xl xs:text-2.5xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.1] tracking-tight text-foreground mb-4 sm:mb-6 lg:mb-8 animate-fade-in uppercase"
                  multiline={true}
                  isAdmin={isAdmin}
                />
                
                <EditableText
                  value={data.description || "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."}
                  onChange={(value) => handleUpdate('description', value)}
                  className="font-body text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-8 lg:mb-10 max-w-full sm:max-w-md animate-fade-in"
                  multiline={true}
                  isAdmin={isAdmin}
                />
                
                <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10 animate-fade-in">
                  <div className="w-28 h-20 xs:w-32 xs:h-24 sm:w-36 sm:h-28 md:w-40 md:h-28 lg:w-44 lg:h-32 overflow-hidden rounded-lg shadow-sm">
                    <EditableImage
                      src={getImageSrc('view')}
                      alt="Vue de la suite"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      isAdmin={isAdmin}
                      onImageUpload={(file) => handleImageUpload('view', file)}
                      onUpdate={(url) => handleUpdate('images.view', url)}
                    />
                  </div>
                  <div className="w-24 h-20 xs:w-28 xs:h-24 sm:w-32 sm:h-28 md:w-36 md:h-28 lg:w-40 lg:h-32 overflow-hidden rounded-lg shadow-sm">
                    <EditableImage
                      src={getImageSrc('detail')}
                      alt="Détail élégant"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      isAdmin={isAdmin}
                      onImageUpload={(file) => handleImageUpload('detail', file)}
                      onUpdate={(url) => handleUpdate('images.detail', url)}
                    />
                  </div>
                </div>
                
                <div className="animate-fade-in w-full sm:w-fit">
                  <EditableText
                    value={data.buttonText || "Réserver maintenant"}
                    onChange={(value) => handleUpdate('buttonText', value)}
                    className="bg-accent text-accent-foreground font-montserrat font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity w-full sm:w-auto uppercase font-bold tracking-widest text-xs sm:text-xs md:text-xs"
                    multiline={false}
                    isAdmin={isAdmin}
                  />
                </div>
              </div>
              
              {/* Right Image Column */}
              <div className="lg:col-span-7 relative order-1 lg:order-2 mb-8 sm:mb-10 lg:mb-0">
                <div className="relative lg:ml-8 animate-slide-in-right z-10">
                  <div className="aspect-[4/3] xs:aspect-[5/4] sm:aspect-[4/3] md:aspect-[16/11] lg:aspect-[16/14] overflow-hidden shadow-xl sm:shadow-2xl rounded-xl">
                    <EditableImage
                      src={getImageSrc('main')}
                      alt="Chambre de luxe"
                      className="w-full h-full object-cover"
                      isAdmin={isAdmin}
                      onImageUpload={(file) => handleImageUpload('main', file)}
                      onUpdate={(url) => handleUpdate('images.main', url)}
                    />
                  </div>
                  
                  {/* Decorative Pink Square - masqué sur mobile */}
                  <div className="hidden lg:block absolute -bottom-10 left-[-5%] w-20 h-20 lg:w-24 lg:h-24 bg-primary z-20 shadow-xl" />
                </div>
                
                <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-20 lg:ml-8 lg:pl-32 animate-fade-in relative z-10 lg:right-[33%]">
                  <EditableText
                    value={data.footerText || "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia"}
                    onChange={(value) => handleUpdate('footerText', value)}
                    className="font-display text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground leading-relaxed sm:leading-relaxed"
                    multiline={true}
                    isAdmin={isAdmin}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

// ===================================================================
// MARQUEESECTION COMPONENT
// ===================================================================
interface MarqueeSectionProps {
  data: ApartmentPageData['marqueeSection'];
  isAdmin?: boolean;
  onUpdate?: (section: string, field: string, value: any) => Promise<void>;
}

const MarqueeSection: React.FC<MarqueeSectionProps> = memo(({ 
  data, 
  isAdmin = false, 
  onUpdate 
}) => {
  const handleUpdate = useCallback(async (field: string, value: any) => {
    if (onUpdate) {
      await onUpdate('marqueeSection', field, value);
    }
  }, [onUpdate]);

  if (!data) return null;

  return (
    <section className="w-full bg-white py-0 md:py-10 font-montserrat">
      <div className={GRID_CONTAINER}>
        <div 
          className="rounded-sm overflow-hidden py-8 sm:py-12 lg:py-5"
          style={{
            backgroundColor: data.backgroundColor || 'hsl(0 0% 98%)'
          }}
        >
          <div 
            className="whitespace-nowrap flex items-center gap-8 sm:gap-12 lg:gap-16 w-max"
            style={{
              animation: 'marquee-section 30s linear infinite'
            }}
          >
            {[...Array(10)].map((_, i) => (
              <EditableText
                key={i}
                value={data.text || "Lorem ipsum dolor •"}
                onChange={(value) => handleUpdate('text', value)}
                className="text-[40px] sm:text-[60px] lg:text-[80px] xl:text-[100px] font-bold tracking-tighter"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  color: data.textColor || 'hsla(0, 0%, 10%, 0.15)'
                }}
                multiline={false}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        </div>
      </div>
      
      <style>
        {`
          @keyframes marquee-section {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}
      </style>
    </section>
  );
});

// ===================================================================
// VIDEOSECTION COMPONENT
// ===================================================================
interface VideoSectionProps {
  data: ApartmentPageData['videoSection'];
  isAdmin?: boolean;
  onUpdate?: (section: string, field: string, value: any) => Promise<void>;
  onUploadImage?: (file: File) => Promise<string>;
}

const VideoSection: React.FC<VideoSectionProps> = memo(({ 
  data, 
  isAdmin = false, 
  onUpdate, 
  onUploadImage 
}) => {
  const handleUpdate = useCallback(async (field: string, value: any) => {
    if (onUpdate) {
      await onUpdate('videoSection', field, value);
    }
  }, [onUpdate]);

  const handleImageUpload = useCallback(async (file: File) => {
    if (onUploadImage && onUpdate) {
      const result = await onUploadImage(file);
      await onUpdate('videoSection', 'coverImage', result.url);
      return result;
    }
    return { url: '' };
  }, [onUploadImage, onUpdate]);

  const getImageSrc = useCallback(() => {
    if (!data?.coverImage) return videoCover;
    
    const normalizedUrl = normalizeImageUrl(data.coverImage);
    if (normalizedUrl.includes('/uploads/')) {
      return addCacheBuster(normalizedUrl);
    }
    
    return normalizedUrl;
  }, [data?.coverImage]);

  if (!data) return null;

  return (
    <section className="py-2 lg:py-0 bg-white">
      <div className={GRID_CONTAINER}>
        <div className="bg-[#EBEBEB] rounded-2xl p-8 md:p-12 lg:p-16 overflow-hidden">
          
          {/* Video container */}
          <div className="relative aspect-video lg:aspect-[16/7] overflow-hidden rounded-xl shadow-2xl group cursor-pointer">
            <EditableImage
              src={getImageSrc()}
              alt="Luxury hotel room video preview"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              isAdmin={isAdmin}
              onImageUpload={handleImageUpload}
              onUpdate={(url) => handleUpdate('coverImage', url)}
            />
            
            {/* Overlay sombre au survol */}
            <div 
              className="absolute inset-0 transition-all duration-300 z-0"
              style={{ 
                backgroundColor: data.overlayColor || 'rgba(0,0,0,0.1)',
                opacity: 'group-hover:opacity-30' as any
              }}
            ></div>
            
            {/* VideoPlayer with play button */}
            {data.videoUrl && (
              <div className="absolute inset-0 z-20">
                <VideoPlayer
                  videoUrl={data.videoUrl}
                  posterImage={getImageSrc()}
                  playButtonSize="large"
                />
              </div>
            )}

            {/* Placeholder play button when no video */}
            {!data.videoUrl && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-full border-2 border-white flex items-center justify-center bg-white/20 backdrop-blur-md shadow-lg">
                  <Play className="w-10 h-10 lg:w-14 lg:h-14 text-white fill-white ml-1" />
                </div>
              </div>
            )}

            {/* Légende en bas de vidéo */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <EditableText
                value={data.playButtonText || "Play Tour"}
                onChange={(value) => handleUpdate('playButtonText', value)}
                className="text-white text-[10px] font-black tracking-widest bg-black/20 backdrop-blur-md px-3 py-1 rounded"
                multiline={false}
                isAdmin={isAdmin}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

// ===================================================================
// FINALSECTION COMPONENT
// ===================================================================
interface FinalSectionProps {
  data: ApartmentPageData['finalSection'];
  isAdmin?: boolean;
  onUpdate?: (section: string, field: string, value: any) => Promise<void>;
  onUploadImage?: (file: File) => Promise<string>;
}

const FinalSection: React.FC<FinalSectionProps> = memo(({ 
  data, 
  isAdmin = false, 
  onUpdate, 
  onUploadImage 
}) => {
  const handleUpdate = useCallback(async (field: string, value: any) => {
    if (onUpdate) {
      await onUpdate('finalSection', field, value);
    }
  }, [onUpdate]);

  const handleImageUpload = useCallback(async (index: number, file: File) => {
    if (onUploadImage && onUpdate && data?.images) {
      const result = await onUploadImage(file);
      const newImages = [...data.images];
      newImages[index] = result.url;
      await onUpdate('finalSection', 'images', newImages);
      return result;
    }
    return { url: '' };
  }, [onUploadImage, onUpdate, data?.images]);

  const getImageSrc = useCallback((index: number) => {
    const defaultImages = [finalRoom1, finalRoom2];
    
    if (!data?.images?.[index]) {
      return defaultImages[index] || finalRoom1;
    }
    
    const normalizedUrl = normalizeImageUrl(data.images[index]);
    if (normalizedUrl.includes('/uploads/')) {
      return addCacheBuster(normalizedUrl);
    }
    
    return normalizedUrl;
  }, [data?.images]);

  if (!data) return null;

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 xl:px-24">
        {/* Conteneur pour titre et textes en ligne */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-12 lg:mb-16">
          
          {/* Titre */}
          <div className="lg:col-span-4">
            <EditableText
              value={data.title || "ADIPISCING ELIT AMET, CONSECTETUR."}
              onChange={(value) => handleUpdate('title', value)}
              className="font-montserrat font-black text-foreground text-2xl lg:text-3xl leading-tight uppercase"
              multiline={true}
              isAdmin={isAdmin}
            />
          </div>

          {/* Textes */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div>
              <EditableText
                value={data.subtitle || "Nunc vulputate libero"}
                onChange={(value) => handleUpdate('subtitle', value)}
                className="font-montserrat text-muted-foreground text-[10px] mb-2 uppercase tracking-widest"
                multiline={false}
                isAdmin={isAdmin}
              />
              <div className="border-t border-black/20 mb-4 w-full" />
              
              <EditableText
                value={data.text1 || "Class aptent taciti sociosqu ad litora torquent."}
                onChange={(value) => handleUpdate('text1', value)}
                className="font-montserrat font-semibold text-foreground text-sm mb-4"
                multiline={true}
                isAdmin={isAdmin}
              />
              
              <EditableText
                value={data.text2 || "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."}
                onChange={(value) => handleUpdate('text2', value)}
                className="font-montserrat text-muted-foreground text-sm leading-relaxed"
                multiline={true}
                isAdmin={isAdmin}
              />
            </div>
          </div>
        </div>

        {/* Conteneur pour les images en dessous */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
          {[0, 1].map((index) => (
            <div key={index} className="aspect-[4/5] lg:aspect-[3/4]">
              <EditableImage
                src={getImageSrc(index)}
                alt={index === 0 ? "Modern hotel suite" : "Elegant bedroom"}
                className="w-full h-full object-cover shadow-sm"
                isAdmin={isAdmin}
                onImageUpload={(file) => handleImageUpload(index, file)}
                onUpdate={(url) => {
                  if (onUpdate && data?.images) {
                    const newImages = [...data.images];
                    newImages[index] = url;
                    onUpdate('finalSection', 'images', newImages);
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

// ===================================================================
// MAIN APARTMENT COMPONENT
// ===================================================================
interface AppartmentProps {
  isAdmin?: boolean;
  onUpdate?: (section: string, field: string, value: any) => Promise<void>;
  onUploadImage?: (file: File) => Promise<string>;
}

const Appartment: React.FC<AppartmentProps> = ({ 
  isAdmin = false, 
  onUpdate, 
  onUploadImage 
}) => {
  const [pageData, setPageData] = useState<ApartmentPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const connection = await apartmentApi.checkConnection();
      
      if (!connection.connected) {
        const localData = await apartmentApi.loadLocalChanges();
        if (localData) {
          setPageData(localData);
          console.log('📦 Données chargées depuis le stockage local:', localData);
        } else {
          throw new Error('Pas de connexion et aucune donnée locale trouvée');
        }
      } else {
        const data = await apartmentApi.getApartmentPage();
        console.log('📦 Données chargées depuis le serveur:', data);
        setPageData(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdate = useCallback(async (section: string, fieldPath: string, value: any) => {
    if (!pageData || !onUpdate) return;

    try {
      console.log(`🔄 Mise à jour: ${section}.${fieldPath} = ${value}`);
      
      // Mettre à jour localement
      const updatedData = {
        ...pageData,
        [section]: {
          ...pageData[section as keyof ApartmentPageData],
          ...(fieldPath.includes('.') 
            ? (() => {
                const [nestedField, ...rest] = fieldPath.split('.');
                return { [nestedField]: value };
              })()
            : { [fieldPath]: value }
          )
        } as any,
        meta: {
          ...pageData.meta,
          updatedAt: new Date().toISOString(),
          version: pageData.meta.version + 1
        }
      };

      console.log(`✅ Données mises à jour localement:`, updatedData);
      setPageData(updatedData);

      // Sauvegarder localement
      await apartmentApi.saveLocalChanges(updatedData);

      // Appeler le callback parent si fourni
      if (onUpdate) {
        await onUpdate(section, fieldPath, value);
      }

      // Essayer de synchroniser avec le serveur
      try {
        await apartmentApi.updateSection(section, fieldPath, value);
        console.log(`📤 Synchronisé avec le serveur`);
        await apartmentApi.clearLocalChanges();
      } catch (serverError) {
        console.warn('⚠️ Échec synchronisation serveur, données sauvegardées localement', serverError);
      }
    } catch (err) {
      console.error('❌ Erreur mise à jour:', err);
    }
  }, [pageData, onUpdate]);

  const handleUploadImage = useCallback(async (file: File): Promise<string> => {
    try {
      const result = await apartmentApi.uploadImage(file);
      // Retourner directement l'URL
      return result.url || result;
    } catch (error) {
      console.error('Erreur upload:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Listen for cross-tab updates when admin saves changes in AppartmentEditor
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === 'apartment_updated') {
        try {
          loadData();
        } catch (err) {
          console.error('Failed to refetch apartment page after storage event', err);
        }
      }
    };

    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [loadData]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des appartements...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md p-6">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={loadData}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!pageData) {
    return (
      <main className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 text-4xl mb-4">🏢</div>
            <p className="text-gray-600">Aucune donnée d'appartement disponible</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background" id="appartements">
      {/* Bandeau Admin */}
      {isAdmin && (
        <div className="bg-black text-white py-3 px-6">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Mode Édition</span>
              <span className="text-xs bg-[#FF2E63] px-2 py-1 rounded">
                Version {pageData.meta.version}
              </span>
              <span className="text-xs text-gray-400">
                Dernière modif: {new Date(pageData.meta.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={loadData}
                className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded flex items-center gap-1"
              >
                Actualiser
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar />
      <HeroSection 
        data={pageData.heroSection} 
        isAdmin={isAdmin}
        onUpdate={handleUpdate}
        onUploadImage={handleUploadImage}
      />
      <RoomsSection 
        data={pageData.roomsSection} 
        isAdmin={isAdmin}
        onUpdate={handleUpdate}
        onUploadImage={handleUploadImage}
      />
      <FeatureSection 
        data={pageData.featureSection} 
        isAdmin={isAdmin}
        onUpdate={handleUpdate}
        onUploadImage={handleUploadImage}
      />
      <ShowcaseSection 
        data={pageData.showcaseSection} 
        isAdmin={isAdmin}
        onUpdate={handleUpdate}
        onUploadImage={handleUploadImage}
      />
      <PerfectShow 
        data={pageData.perfectShowSection} 
        isAdmin={isAdmin}
        onUpdate={handleUpdate}
        onUploadImage={handleUploadImage}
      />
      <MarqueeSection 
        data={pageData.marqueeSection} 
        isAdmin={isAdmin}
        onUpdate={handleUpdate}
      />
      <VideoSection 
        data={pageData.videoSection} 
        isAdmin={isAdmin}
        onUpdate={handleUpdate}
        onUploadImage={handleUploadImage}
      />
      <FinalSection 
        data={pageData.finalSection} 
        isAdmin={isAdmin}
        onUpdate={handleUpdate}
        onUploadImage={handleUploadImage}
      />
      <Footer />
    </main>
  );
};

export default Appartment;