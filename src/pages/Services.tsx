import React, { useState, useCallback, memo, useMemo, useEffect, useRef } from 'react';
import { 
  Home, 
  Gem, 
  Bed, 
  Utensils, 
  Umbrella, 
  Sofa,
  FileText,
  BedDouble,
  Plus, 
  Minus,
  Loader2,
  RefreshCw,
  AlertCircle,
  Save,
  Upload
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { serviceApi, ServicePageData } from '@/services/servicesApi';
import { config } from '@/config/env';

// --- IMAGES STATIQUES (Remplacez par vos chemins d'importation réels) ---
import heroService from '@/assets/hero-service.png';
import bedroomService1 from '@/assets/badroom-service-1.png';
import bedroomService2 from '@/assets/bedroom-service-2.png';
import livingrooService1 from '@/assets/livingroom-service-1.png';
import bedroomService3 from '@/assets/bedroom-service-3.png';
import livingrooService2 from '@/assets/livingroom-service-2.png';
import livingroomService3 from '@/assets/livingroom-service-3.png';
import sofaService1 from '@/assets/sofa-service-1.png';
import sofaService2 from '@/assets/sofa-service-2.png';
import bedroomService4 from '@/assets/bedroom-service-4.png';

// --- CONFIGURATION DE LA GRILLE UNIFIÉE ---
const GRID_CONTAINER = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

// --- URLS DES IMAGES PAR DÉFAUT (servies par Vite) ---
const DEFAULT_IMAGES = {
  heroService,
  bedroomService1,
  bedroomService2,
  livingrooService1,
  bedroomService3,
  livingrooService2,
  livingroomService3,
  sofaService1,
  sofaService2,
  bedroomService4
};

// --- ANIMATIONS PERSONNALISÉES ---
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
};

const slideInFromLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
};

const slideInFromRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
};

const zoomIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

// --- FONCTION UTILITAIRE POUR NORMALISER LES URLS D'IMAGES ---
const normalizeImageUrl = (url: string | any): string => {
  if (!url) return '';
  
  const urlStr = typeof url === 'string' ? url : String(url);
  
  if (urlStr.includes('cloudinary.com')) {
    return urlStr;
  }
  
  if (urlStr.startsWith('http://') || urlStr.startsWith('https://')) {
    return urlStr;
  }
  
  if (urlStr.startsWith('/uploads')) {
    const backendOrigin = config.apiBaseUrl.replace(/\/api\/?$/, '');
    return `${backendOrigin}${urlStr}`;
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

// --- COMPOSANTS RÉUTILISABLES ---
const OptimizedImage = memo(({ src, alt, className = "", containerClass = "", priority = false, animation = false }: any) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className={`relative overflow-hidden ${containerClass}`}>
      <img
        key={src}
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-700 ${loaded && animation ? 'opacity-100' : 'opacity-0'} ${className}`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
      {!loaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
      )}
    </div>
  );
});

const FAQItem = memo(({ item, index, isOpen, onToggle }: any) => {
  return (
    <div className="bg-[#1F1F1F] rounded-[4px] overflow-hidden mb-3">
      <button 
        onClick={() => onToggle(index)}
        className="w-full text-white px-4 sm:px-6 py-4 flex items-center justify-between transition-all duration-300 hover:bg-[#2A2A2A] focus:outline-none"
      >
        <span className="text-left text-sm font-medium pr-4">{item.question}</span>
        {isOpen ? (
          <Minus className="w-5 h-5 text-[#FF2E63] flex-shrink-0 transition-transform duration-300" strokeWidth={3} />
        ) : (
          <Plus className="w-5 h-5 text-[#FF2E63] flex-shrink-0 transition-transform duration-300" strokeWidth={3} />
        )}
      </button>
      <div 
        className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ maxHeight: isOpen ? '300px' : '0px', opacity: isOpen ? 1 : 0 }}
      >
        <div className="px-6 pb-5 pt-2">
          <p className="text-sm text-gray-300 leading-relaxed font-medium">{item.answer}</p>
        </div>
      </div>
    </div>
  );
});

// --- COMPOSANT DE CHARGEMENT ---
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <Loader2 className="w-12 h-12 text-[#FF2E63] animate-spin" />
  </div>
);

// --- COMPOSANT D'ERREUR ---
const ErrorDisplay = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto my-8 animate-fadeIn">
    <div className="flex items-center gap-3 mb-4">
      <AlertCircle className="w-6 h-6 text-red-600 animate-pulse" />
      <h3 className="text-lg font-semibold text-red-800">Erreur de chargement</h3>
    </div>
    <p className="text-red-700 mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95"
    >
      <RefreshCw className="w-4 h-4" />
      Réessayer
    </button>
  </div>
);

// --- COMPOSANT D'ÉDITION (Pour mode admin) ---
const EditableField = ({
  value,
  onChange,
  type = 'text',
  className = '',
  placeholder = '',
  multiline = false
}: {
  value: string;
  onChange: (value: string) => void;
  type?: string;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
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

  if (!isEditing) {
    return (
      <div 
        onClick={() => setIsEditing(true)}
        className={`cursor-pointer hover:bg-gray-50 p-1 rounded transition-all duration-200 ${className}`}
      >
        {multiline ? (
          <div className="whitespace-pre-wrap">{value || placeholder}</div>
        ) : (
          <span>{value || placeholder}</span>
        )}
      </div>
    );
  }

  if (multiline) {
    return (
      <div className="space-y-2 animate-fadeIn">
        <textarea
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          className={`w-full p-2 border rounded transition-all duration-200 focus:ring-2 focus:ring-[#FF2E63] focus:border-transparent ${className}`}
          rows={4}
          placeholder={placeholder}
          autoFocus
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white text-sm py-1 px-3 rounded transition-all duration-200 hover:scale-105"
          >
            Sauvegarder
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-sm py-1 px-3 rounded transition-all duration-200 hover:scale-105"
          >
            Annuler
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 animate-fadeIn">
      <input
        type={type}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        className={`w-full p-2 border rounded transition-all duration-200 focus:ring-2 focus:ring-[#FF2E63] focus:border-transparent ${className}`}
        placeholder={placeholder}
        autoFocus
      />
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white text-sm py-1 px-3 rounded transition-all duration-200 hover:scale-105"
        >
          Sauvegarder
        </button>
        <button
          onClick={handleCancel}
          className="bg-gray-300 hover:bg-gray-400 text-sm py-1 px-3 rounded transition-all duration-200 hover:scale-105"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

// --- COMPOSANT ANIMÉ POUR LES SECTIONS ---
const AnimatedSection = ({ children, delay = 0, className = '' }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- COMPOSANT SERVICE1 ---
interface Service1Props {
  data: ServicePageData['service1'];
  metaVersion?: number;
  metaTimestamp?: number;
  isAdmin?: boolean;
  onUpdate?: (section: string, field: string, data: any) => Promise<void>;
  onUploadImage?: (file: File) => Promise<string>;
}

const Service1: React.FC<Service1Props> = ({ 
  data, 
  metaVersion, 
  metaTimestamp, 
  isAdmin = false, 
  onUpdate, 
  onUploadImage 
}) => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const [isSaving, setIsSaving] = useState(false);
  const [localImages, setLocalImages] = useState<Record<string, string>>({});
  const [imageVersion, setImageVersion] = useState<number>(Date.now());
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredIcon, setHoveredIcon] = useState<number | null>(null);

  // Réinitialiser les images locales quand les données changent
  useEffect(() => {
    setLocalImages({});
    setImageVersion(Date.now());
  }, [data]);

  const handleUpdate = useCallback(async (section: string, field: string, value: any) => {
    if (onUpdate && !isSaving) {
      setIsSaving(true);
      try {
        await onUpdate(section, field, value);
      } finally {
        setIsSaving(false);
      }
    }
  }, [onUpdate, isSaving]);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (!e.target.files?.[0] || !onUploadImage) return;

    const file = e.target.files[0];
    try {
      const imageUrl = await onUploadImage(file);
      const normalizedUrl = normalizeImageUrl(imageUrl);
      const timestamp = Date.now();
      const cachedUrl = addCacheBuster(normalizedUrl, metaVersion, timestamp);
      
      setLocalImages(prev => ({ ...prev, [field]: cachedUrl }));
      setImageVersion(timestamp);
      
      if (onUpdate) {
        const sectionMap: Record<string, string> = {
          backgroundImage: 'heroSection',
          mainImage: 'compositionSection',
          secondaryImage: 'compositionSection',
          image: 'ctaSection',
          image1: 'darkSection',
          image2: 'darkSection'
        };

        const section = sectionMap[field];
        if (section) {
          await onUpdate(section, field, imageUrl);
        }
      }
    } catch (error) {
      console.error('Erreur upload image:', error);
      alert('Erreur lors de l\'upload de l\'image');
    }
  }, [onUploadImage, onUpdate, metaVersion]);

  const getImageSrc = useCallback((fieldPath: string, defaultImageKey: keyof typeof DEFAULT_IMAGES) => {
    if (localImages[fieldPath]) {
      return localImages[fieldPath];
    }
    
    let dataValue: any = data;
    const keys = fieldPath.split('.');
    for (const key of keys) {
      dataValue = dataValue?.[key];
    }
    
    if (dataValue && typeof dataValue === 'string' && dataValue.trim() !== '') {
      const normalizedUrl = normalizeImageUrl(dataValue);
      
      if (normalizedUrl.includes('/uploads/') || normalizedUrl.includes('https://api.wmsignaturegroup.com')) {
        return addCacheBuster(normalizedUrl, metaVersion, metaTimestamp || imageVersion);
      }
      
      return normalizedUrl;
    }
    
    const defaultUrl = DEFAULT_IMAGES[defaultImageKey];
    return defaultUrl;
  }, [data, localImages, metaVersion, metaTimestamp, imageVersion]);

  const iconComponents = {
    FileText, Bed, Utensils, Umbrella, Sofa, Gem, Home, BedDouble
  };

  if (!data) {
    return <LoadingSpinner />;
  }

  return (
    <div className="text-gray-900 bg-white overflow-x-hidden selection:bg-pink-500 selection:text-white"
         style={{ fontFamily: "'Montserrat', sans-serif" }}>
      
      {isSaving && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 flex items-center gap-2 animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin" />
          Sauvegarde...
        </div>
      )}

      {/* SECTION 1: HERO */}
      <AnimatedSection delay={100}>
        <section className="py-8 sm:py-12 lg:py-16 bg-white">
          <div className={GRID_CONTAINER}>
            <div className="flex flex-col lg:flex-row bg-[#EBEBEB] overflow-hidden rounded-sm animate-scaleIn">
              <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-16 xl:p-20">
                {isAdmin ? (
                  <div className="space-y-4">
                    <EditableField
                      value={data.heroSection?.titleLine1 || ''}
                      onChange={(value) => handleUpdate('heroSection', 'titleLine1', value)}
                      className="text-4xl sm:text-5xl md:text-[60px] xl:text-[75px] leading-[0.9] font-black text-black tracking-tighter uppercase"
                      multiline={false}
                    />
                    <EditableField
                      value={data.heroSection?.titleLine2 || ''}
                      onChange={(value) => handleUpdate('heroSection', 'titleLine2', value)}
                      className="text-4xl sm:text-5xl md:text-[60px] xl:text-[75px] leading-[0.9] font-black text-black tracking-tighter uppercase"
                      multiline={false}
                    />
                    <EditableField
                      value={data.heroSection?.titleLine3 || ''}
                      onChange={(value) => handleUpdate('heroSection', 'titleLine3', value)}
                      className="text-4xl sm:text-5xl md:text-[60px] xl:text-[75px] leading-[0.9] font-black text-black tracking-tighter uppercase"
                      multiline={false}
                    />
                    <EditableField
                      value={data.heroSection?.description || ''}
                      onChange={(value) => handleUpdate('heroSection', 'description', value)}
                      className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed max-w-md font-medium"
                      multiline={true}
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-4xl sm:text-5xl md:text-[60px] xl:text-[75px] leading-[0.9] font-black text-black tracking-tighter mb-6 uppercase animate-slideInFromLeft"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      <span className="inline-block animate-fadeInUp" style={{ animationDelay: '0.1s' }}>{data.heroSection?.titleLine1}</span><br/>
                      <span className="inline-block animate-fadeInUp" style={{ animationDelay: '0.2s' }}>{data.heroSection?.titleLine2}</span><br/>
                      <span className="inline-block animate-fadeInUp" style={{ animationDelay: '0.3s' }}>{data.heroSection?.titleLine3}</span>
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed max-w-md font-medium animate-fadeInUp"
                       style={{ animationDelay: '0.4s', fontFamily: "'Montserrat', sans-serif" }}>
                      {data.heroSection?.description}
                    </p>
                  </>
                )}
              </div>
              <div className="w-full lg:w-1/2 relative animate-slideInFromRight">
                {isAdmin && (
                  <label className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-md cursor-pointer z-10 flex items-center gap-2 hover:bg-white transition-all duration-300 hover:scale-105">
                    <Upload className="w-4 h-4" />
                    Changer image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, 'backgroundImage')}
                    />
                  </label>
                )}
                <OptimizedImage 
                  src={getImageSrc('heroSection.backgroundImage', 'heroService')} 
                  alt="Hero" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" 
                  priority={true}
                  animation={true}
                />
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* SECTION 2: COMPOSITION IMAGES */}
      <AnimatedSection delay={200}>
        <section className="py-16 sm:py-24 lg:py-32 bg-white">
          <div className={GRID_CONTAINER}>
            <div className="flex flex-col xl:flex-row gap-16 items-center">
              <div className="w-full xl:w-1/2 relative min-h-[400px] sm:min-h-[600px] animate-fadeIn">
                <div className="absolute top-[15%] right-[0%] w-32 h-32 bg-[#FF1675] z-0 animate-pulseSlow"></div>
                <div className="absolute bottom-[0%] left-[28%] w-16 h-16 bg-black z-30 animate-bounceSlow"></div>

                <div className="absolute top-0 left-0 w-[75%] z-10 shadow-xl animate-slideInFromLeft">
                  {isAdmin && (
                    <label className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs cursor-pointer z-20 flex items-center gap-1 hover:scale-105 transition-transform">
                      <Upload className="w-3 h-3" />
                      Image 1
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'mainImage')}
                      />
                    </label>
                  )}
                  <OptimizedImage 
                    src={getImageSrc('compositionSection.mainImage', 'livingrooService1')} 
                    alt="Living" 
                    containerClass="h-[300px] sm:h-[400px] hover:scale-105 transition-transform duration-700" 
                    animation={true}
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-[65%] z-20 shadow-2xl border-[10px] border-white animate-slideInFromRight" style={{ animationDelay: '0.2s' }}>
                  {isAdmin && (
                    <label className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs cursor-pointer z-20 flex items-center gap-1 hover:scale-105 transition-transform">
                      <Upload className="w-3 h-3" />
                      Image 2
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'secondaryImage')}
                      />
                    </label>
                  )}
                  <OptimizedImage 
                    src={getImageSrc('compositionSection.secondaryImage', 'bedroomService1')} 
                    alt="Detail" 
                    containerClass="h-[250px] sm:h-[350px] hover:scale-105 transition-transform duration-700" 
                    animation={true}
                  />
                </div>
              </div>
              <div className="w-full xl:w-1/2 lg:pl-12 animate-fadeInUp">
                {isAdmin ? (
                  <div className="space-y-6">
                    <EditableField
                      value={data.compositionSection?.title || ''}
                      onChange={(value) => handleUpdate('compositionSection', 'title', value)}
                      className="text-4xl sm:text-6xl font-black text-black mb-8 uppercase tracking-tighter"
                      multiline={true}
                    />
                    <EditableField
                      value={data.compositionSection?.description || ''}
                      onChange={(value) => handleUpdate('compositionSection', 'description', value)}
                      className="text-gray-600 mb-10 max-w-lg"
                      multiline={true}
                    />
                    <div className="space-y-8">
                      {data.compositionSection?.features?.map((item, i) => {
                        const IconComponent = iconComponents[item.icon as keyof typeof iconComponents] || Gem;
                        return (
                          <div key={i} className="flex gap-4 items-center group">
                            <div 
                              className="w-14 h-14 rounded-full bg-[#FF1675] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                              onMouseEnter={() => setHoveredIcon(i)}
                              onMouseLeave={() => setHoveredIcon(null)}
                            >
                              <IconComponent className={`text-white w-6 h-6 transition-all duration-300 ${hoveredIcon === i ? 'rotate-12' : ''}`} />
                            </div>
                            <EditableField
                              value={item.title}
                              onChange={(value) => handleUpdate('compositionSection', `features[${i}].title`, value)}
                              className="font-bold text-xl uppercase tracking-tight group-hover:text-[#FF1675] transition-colors duration-300"
                              multiline={false}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-4xl sm:text-6xl font-black text-black mb-8 uppercase tracking-tighter animate-fadeInUp"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {data.compositionSection?.title}
                    </h2>
                    <p className="text-gray-600 mb-10 max-w-lg animate-fadeInUp"
                       style={{ animationDelay: '0.1s', fontFamily: "'Montserrat', sans-serif" }}>
                      {data.compositionSection?.description}
                    </p>
                    <div className="space-y-8">
                      {data.compositionSection?.features?.map((item, i) => {
                        const IconComponent = iconComponents[item.icon as keyof typeof iconComponents] || Gem;
                        return (
                          <div 
                            key={i} 
                            className="flex gap-4 items-center group animate-fadeInUp"
                            style={{ animationDelay: `${0.2 + i * 0.1}s` }}
                            onMouseEnter={() => setHoveredIcon(i)}
                            onMouseLeave={() => setHoveredIcon(null)}
                          >
                            <div className="w-14 h-14 rounded-full bg-[#FF1675] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-500">
                              <IconComponent className={`text-white w-6 h-6 transition-all duration-500 ${hoveredIcon === i ? 'rotate-12 scale-125' : ''}`} />
                            </div>
                            <h3 className="font-bold text-xl uppercase tracking-tight group-hover:text-[#FF1675] transition-all duration-500"
                                style={{ fontFamily: "'Montserrat', sans-serif" }}>
                              {item.title}
                            </h3>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* SECTION 3: CTA SPLIT */}
      <AnimatedSection delay={300}>
        <section className="bg-white py-12 lg:py-16">
          <div className={GRID_CONTAINER}>
            <div className="bg-[#EBEBEB] flex flex-col lg:flex-row overflow-hidden rounded-sm animate-scaleIn">
              {/* COLONNE GAUCHE */}
              <div className="w-full lg:w-1/3 p-8 sm:p-12 lg:p-16 flex flex-col justify-center animate-fadeIn">
                {isAdmin ? (
                  <div className="space-y-4">
                    <EditableField
                      value={data.ctaSection?.title || ''}
                      onChange={(value) => handleUpdate('ctaSection', 'title', value)}
                      className="text-3xl sm:text-4xl font-bold text-black leading-tight uppercase tracking-tight"
                      multiline={true}
                    />
                    <EditableField
                      value={data.ctaSection?.description || ''}
                      onChange={(value) => handleUpdate('ctaSection', 'description', value)}
                      className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-sm"
                      multiline={true}
                    />
                    <EditableField
                      value={data.ctaSection?.buttonText || ''}
                      onChange={(value) => handleUpdate('ctaSection', 'buttonText', value)}
                      className="bg-[#1A1A1A] text-white font-bold py-4 px-10 rounded-md w-fit text-sm uppercase tracking-wider hover:scale-105 transition-transform duration-300"
                      multiline={false}
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-3xl sm:text-4xl font-bold text-black leading-tight mb-6 uppercase tracking-tight animate-fadeInUp"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {data.ctaSection?.title}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-10 max-w-sm animate-fadeInUp"
                       style={{ animationDelay: '0.1s', fontFamily: "'Montserrat', sans-serif" }}>
                      {data.ctaSection?.description}
                    </p>
                    <button 
                      className="bg-[#1A1A1A] hover:bg-black text-white font-bold py-4 px-10 rounded-md w-fit transition-all duration-500 hover:scale-105 active:scale-95 text-sm uppercase tracking-wider animate-fadeInUp"
                      aria-label={data.ctaSection?.buttonText}
                      onClick={() => window.location.href = '/appartement'}
                      style={{ animationDelay: '0.2s', fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {data.ctaSection?.buttonText}
                    </button>
                  </>
                )}
              </div>
              
              {/* COLONNE CENTRALE */}
              <div className="w-full lg:w-1/3 h-[400px] lg:h-auto border-x border-gray-300/30 relative animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                {isAdmin && (
                  <label className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-md cursor-pointer z-10 flex items-center gap-2 hover:scale-105 transition-transform">
                    <Upload className="w-4 h-4" />
                    Changer image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, 'image')}
                    />
                  </label>
                )}
                <img 
                  src={getImageSrc('ctaSection.image', 'bedroomService2')}
                  alt="Chambre de luxe design" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                  loading="lazy"
                />
              </div>
              
              {/* COLONNE DROITE */}
              <div className="w-full lg:w-1/3 p-8 sm:p-10 lg:p-12 flex flex-col gap-6 justify-center animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                {data.ctaSection?.featureCards?.map((card, index) => {
                  const IconComponent = iconComponents[card.icon as keyof typeof iconComponents] || Bed;
                  return (
                    <div 
                      key={index} 
                      className="bg-white p-8 rounded-sm shadow-sm flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-500 animate-fadeInUp"
                      style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                      onMouseEnter={() => setHoveredCard(index)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${hoveredCard === index ? 'bg-[#FF2E63] scale-110' : 'bg-[#1A1A1A]'}`}>
                        <IconComponent className={`w-6 h-6 transition-all duration-500 ${hoveredCard === index ? 'text-white rotate-12' : 'text-white'}`} />
                      </div>
                      {isAdmin ? (
                        <div className="space-y-2 w-full">
                          <EditableField
                            value={card.title}
                            onChange={(value) => handleUpdate('ctaSection', `featureCards[${index}].title`, value)}
                            className="font-bold text-black uppercase tracking-tight"
                            multiline={false}
                          />
                          <EditableField
                            value={card.description}
                            onChange={(value) => handleUpdate('ctaSection', `featureCards[${index}].description`, value)}
                            className="text-xs text-gray-600 leading-relaxed"
                            multiline={true}
                          />
                        </div>
                      ) : (
                        <>
                          <h4 className="font-bold text-black mb-3 uppercase tracking-tight transition-colors duration-300 group-hover:text-[#FF2E63]"
                              style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            {card.title}
                          </h4>
                          <p className="text-xs text-gray-600 leading-relaxed"
                             style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            {card.description}
                          </p>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* SECTION 4: FEATURES GRID */}
      <AnimatedSection delay={400}>
        <section className="w-full bg-[#FAFAFA] pt-20 lg:pt-28 pb-10 relative overflow-hidden"
                 style={{ fontFamily: "'Montserrat', sans-serif" }}>
          <div className={GRID_CONTAINER}>
            <div className="text-center mb-16 lg:mb-24 animate-fadeInUp">
              {isAdmin ? (
                <EditableField
                  value={data.featuresSection?.title || ''}
                  onChange={(value) => handleUpdate('featuresSection', 'title', value)}
                  className="text-3xl sm:text-4xl lg:text-[56px] font-bold text-[#1A1A1A] leading-[1.1] tracking-tight"
                  multiline={true}
                />
              ) : (
                <h2 className="text-3xl sm:text-4xl lg:text-[56px] font-bold text-[#1A1A1A] leading-[1.1] tracking-tight"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {data.featuresSection?.title}
                </h2>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative z-10 mb-20 lg:mb-32">
              {data.featuresSection?.features?.map((feature, index) => {
                const IconComponent = iconComponents[feature.icon as keyof typeof iconComponents] || FileText;
                return (
                  <div 
                    key={index} 
                    className="bg-white p-8 sm:p-10 rounded-[4px] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-6 mb-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#1A1A1A] rounded-[4px] flex items-center justify-center group-hover:bg-[#FF2E63] transition-all duration-500">
                        <IconComponent className="w-5 h-5 text-white transition-all duration-500 group-hover:rotate-12" strokeWidth={2} />
                      </div>
                      {isAdmin ? (
                        <div className="space-y-2 flex-1">
                          <EditableField
                            value={feature.title}
                            onChange={(value) => handleUpdate('featuresSection', `features[${index}].title`, value)}
                            className="text-lg sm:text-xl font-bold text-[#1A1A1A] leading-snug group-hover:text-[#FF2E63] transition-colors duration-300"
                            multiline={false}
                          />
                          <EditableField
                            value={feature.description}
                            onChange={(value) => handleUpdate('featuresSection', `features[${index}].description`, value)}
                            className="text-sm sm:text-[15px] text-gray-600 leading-relaxed font-medium"
                            multiline={true}
                          />
                        </div>
                      ) : (
                        <>
                          <h3 className="text-lg sm:text-xl font-bold text-[#1A1A1A] pt-1 leading-snug group-hover:text-[#FF2E63] transition-colors duration-300"
                              style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            {feature.title}
                          </h3>
                        </>
                      )}
                    </div>
                    {!isAdmin && (
                      <p className="text-sm sm:text-[15px] text-gray-600 leading-relaxed font-medium"
                         style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {feature.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {isAdmin ? (
            <div className="w-full overflow-hidden select-none pointer-events-none mt-10 pb-20 lg:pb-20">
              <EditableField
                value={data.featuresSection?.decorativeText || ''}
                onChange={(value) => handleUpdate('featuresSection', 'decorativeText', value)}
                className="text-center font-bold text-[#808080] opacity-40 text-[12vw] lg:text-[110px] leading-[0.8] tracking-tighter whitespace-nowrap"
                multiline={false}
              />
            </div>
          ) : (
            <div className="w-full overflow-hidden select-none pointer-events-none mt-10 pb-20 lg:pb-20 animate-marquee">
              <div className="text-center font-bold text-[#808080] opacity-40 text-[12vw] lg:text-[110px] leading-[0.8] tracking-tighter whitespace-nowrap transform translate-y-4"
                   style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {data.featuresSection?.decorativeText}
              </div>
            </div>
          )}
        </section>
      </AnimatedSection>

      {/* SECTION 5: DARK */}
      <AnimatedSection delay={500}>
        <section className="bg-white py-12 lg:py-20"
                 style={{ fontFamily: "'Montserrat', sans-serif" }}>
          <div className={GRID_CONTAINER}>
            
            {/* EN-TÊTE DE SECTION */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 lg:mb-14 gap-6 animate-fadeIn">
              {isAdmin ? (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FF2E63] flex items-center justify-center text-white shadow-sm flex-shrink-0 hover:rotate-180 transition-transform duration-1000">
                    <BedDouble size={24} strokeWidth={2} />
                  </div>
                  <EditableField
                    value={data.darkSection?.subtitle || ''}
                    onChange={(value) => handleUpdate('darkSection', 'subtitle', value)}
                    className="text-sm font-bold leading-tight uppercase text-black tracking-wide"
                    multiline={true}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-4 animate-fadeInLeft">
                  <div className="w-12 h-12 rounded-full bg-[#FF2E63] flex items-center justify-center text-white shadow-sm flex-shrink-0 hover:rotate-180 transition-transform duration-1000">
                    <BedDouble size={24} strokeWidth={2} />
                  </div>
                  <div className="text-sm font-bold leading-tight uppercase text-black tracking-wide"
                       style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {data.darkSection?.subtitle}
                  </div>
                </div>
              )}
              
              {isAdmin ? (
                <EditableField
                  value={data.darkSection?.description || ''}
                  onChange={(value) => handleUpdate('darkSection', 'description', value)}
                  className="text-left sm:text-right max-w-xs text-sm font-semibold text-gray-800 leading-snug"
                  multiline={true}
                />
              ) : (
                <div className="text-left sm:text-right max-w-xs text-sm font-semibold text-gray-800 leading-snug animate-fadeInRight"
                     style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {data.darkSection?.description}
                </div>
              )}
            </div>

            {/* GRILLE PRINCIPALE */}
            <div className="flex flex-col gap-6 lg:gap-8">
              
              {/* LIGNE 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 animate-fadeInUp">
                {/* IMAGE 1 */}
                <div className="lg:col-span-5 h-[300px] w-full rounded-[4px] overflow-hidden relative hover:shadow-2xl transition-shadow duration-500">
                  {isAdmin && (
                    <label className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-md cursor-pointer z-10 flex items-center gap-2 hover:scale-105 transition-transform">
                      <Upload className="w-4 h-4" />
                      Changer image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'image1')}
                      />
                    </label>
                  )}
                  <img 
                    src={getImageSrc('darkSection.image1', 'bedroomService3')}
                    alt="Chambre beige lumineuse" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                    loading="lazy"
                  />
                </div>

                {/* CARTE GRISE */}
                <div className="lg:col-span-7 bg-[#E5E5E5] p-8 lg:p-12 flex flex-col justify-center rounded-[4px] min-h-[300px] hover:shadow-xl transition-all duration-500">
                  {isAdmin ? (
                    <div className="space-y-4">
                      <EditableField
                        value={data.darkSection?.title || ''}
                        onChange={(value) => handleUpdate('darkSection', 'title', value)}
                        className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#1A1A1A] leading-[1.2]"
                        multiline={true}
                      />
                      <EditableField
                        value={data.darkSection?.description || ''}
                        onChange={(value) => handleUpdate('darkSection', 'description', value)}
                        className="text-sm text-gray-600 leading-relaxed font-medium max-w-2xl"
                        multiline={true}
                      />
                      <EditableField
                        value={data.darkSection?.buttonText || ''}
                        onChange={(value) => handleUpdate('darkSection', 'buttonText', value)}
                        className="bg-[#FF2E63] text-white font-bold py-3 px-8 rounded-[4px] w-fit text-sm uppercase tracking-wide shadow-md hover:scale-105 transition-transform duration-300"
                        multiline={false}
                      />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#1A1A1A] leading-[1.2] mb-5"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {data.darkSection?.title}
                      </h2>
                      <p className="text-sm text-gray-600 leading-relaxed mb-8 font-medium max-w-2xl"
                         style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {data.darkSection?.description}
                      </p>
                      <button className="bg-[#FF2E63] hover:bg-[#e02655] text-white font-bold py-3 px-8 rounded-[4px] w-fit text-sm uppercase tracking-wide transition-all duration-500 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                              onClick={() => window.location.href = '/appartement'}
                              style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {data.darkSection?.buttonText}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* LIGNE 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                {/* CARTE NOIRE */}
                <div className="lg:col-span-7 bg-black p-8 lg:p-12 flex flex-col justify-center rounded-[4px] min-h-[300px] hover:shadow-2xl transition-all duration-500">
                  {isAdmin ? (
                    <div className="space-y-6">
                      <h2 className="text-2xl sm:text-3xl text-white mb-8 lg:mb-10 leading-tight"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        <span className="text-gray-500 font-light block sm:inline mr-2">Class</span>
                        <span className="font-bold">aptent taciti sociosqu quad litora torquent .</span>
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10">
                        {data.darkSection?.features?.map((item, idx) => (
                          <div key={idx} className="flex flex-row items-center gap-4 group hover:translate-x-2 transition-transform duration-300">
                            <span className="text-5xl font-bold text-gray-500 font-mono opacity-60 group-hover:text-[#FF2E63] transition-colors duration-300">{item.id}</span>
                            <EditableField
                              value={item.text}
                              onChange={(value) => handleUpdate('darkSection', `features[${idx}].text`, value)}
                              className="text-sm sm:text-base text-gray-300 font-medium leading-snug group-hover:text-white transition-colors duration-300"
                              multiline={true}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl sm:text-3xl text-white mb-8 lg:mb-10 leading-tight"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        <span className="text-gray-500 font-light block sm:inline mr-2">Class</span>
                        <span className="font-bold">aptent taciti sociosqu quad litora torquent .</span>
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10">
                        {data.darkSection?.features?.map((item, idx) => (
                          <div key={idx} className="flex flex-row items-center gap-4 group hover:translate-x-2 transition-all duration-500">
                            <span className="text-5xl font-bold text-gray-500 font-mono opacity-60 group-hover:text-[#FF2E63] transition-colors duration-500">{item.id}</span>
                            <p className="text-sm sm:text-base text-gray-300 font-medium leading-snug group-hover:text-white transition-colors duration-500"
                               style={{ fontFamily: "'Montserrat', sans-serif" }}>
                              {item.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* IMAGE 2 */}
                <div className="lg:col-span-5 h-[300px] w-full rounded-[4px] overflow-hidden relative hover:shadow-2xl transition-shadow duration-500">
                  {isAdmin && (
                    <label className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-md cursor-pointer z-10 flex items-center gap-2 hover:scale-105 transition-transform">
                      <Upload className="w-4 h-4" />
                      Changer image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'image2')}
                      />
                    </label>
                  )}
                  <img 
                    src={getImageSrc('darkSection.image2', 'livingrooService2')}
                    alt="Détail chambre bois" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
};

// --- COMPOSANT SERVICE2 ---
interface Service2Props {
  data: ServicePageData['service2'];
  metaVersion?: number;
  metaTimestamp?: number;
  isAdmin?: boolean;
  onUpdate?: (section: string, subsection: string, data: any) => Promise<void>;
  onUploadImage?: (file: File) => Promise<string>;
}

const Service2: React.FC<Service2Props> = ({ 
  data, 
  metaVersion, 
  metaTimestamp, 
  isAdmin = false, 
  onUpdate, 
  onUploadImage 
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [localImages, setLocalImages] = useState<Record<string, string>>({});
  const [imageVersion, setImageVersion] = useState<number>(Date.now());
  const [hoveredFAQ, setHoveredFAQ] = useState<number | null>(null);

  // Réinitialiser les images locales quand les données changent
  useEffect(() => {
    setLocalImages({});
    setImageVersion(Date.now());
  }, [data]);

  const toggleFAQ = useCallback((index: number) => {
    setOpenIndex(curr => curr === index ? null : index);
  }, []);

  const handleUpdate = useCallback(async (section: string, field: string, value: any) => {
    if (onUpdate && !isSaving) {
      setIsSaving(true);
      try {
        await onUpdate(section, field, value);
      } finally {
        setIsSaving(false);
      }
    }
  }, [onUpdate, isSaving]);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (!e.target.files?.[0] || !onUploadImage) return;

    const file = e.target.files[0];
    try {
      const imageUrl = await onUploadImage(file);
      const normalizedUrl = normalizeImageUrl(imageUrl);
      const timestamp = Date.now();
      const cachedUrl = addCacheBuster(normalizedUrl, metaVersion, timestamp);
      
      setLocalImages(prev => ({ ...prev, [field]: cachedUrl }));
      setImageVersion(timestamp);
      
      if (onUpdate) {
        const sectionMap: Record<string, string> = {
          image: 'faqSection',
          mainImage: 'gallerySection'
        };

        const section = sectionMap[field];
        if (section) {
          await onUpdate(section, field, imageUrl);
        }
      }
    } catch (error) {
      console.error('Erreur upload image:', error);
      alert('Erreur lors de l\'upload de l\'image');
    }
  }, [onUploadImage, onUpdate, metaVersion]);

  const getImageSrc = useCallback((fieldPath: string, defaultImageKey: keyof typeof DEFAULT_IMAGES) => {
    if (localImages[fieldPath]) {
      return localImages[fieldPath];
    }
    
    let dataValue: any = data;
    const keys = fieldPath.split('.');
    for (const key of keys) {
      dataValue = dataValue?.[key];
    }
    
    if (dataValue && typeof dataValue === 'string' && dataValue.trim() !== '') {
      const normalizedUrl = normalizeImageUrl(dataValue);
      
      if (normalizedUrl.includes('/uploads/') || normalizedUrl.includes('https://api.wmsignaturegroup.com')) {
        return addCacheBuster(normalizedUrl, metaVersion, metaTimestamp || imageVersion);
      }
      
      return normalizedUrl;
    }
    
    const defaultUrl = DEFAULT_IMAGES[defaultImageKey];
    return defaultUrl;
  }, [data, localImages, metaVersion, metaTimestamp, imageVersion]);

  if (!data) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full bg-white py-12 lg:py-16" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      
      {isSaving && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 flex items-center gap-2 animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin" />
          Sauvegarde...
        </div>
      )}

      {/* SECTION 1 */}
      <AnimatedSection delay={100}>
        <section className="mb-16 lg:mb-24">
          <div className={GRID_CONTAINER}>
            <div className="relative bg-[#E5E5E5] rounded-sm overflow-hidden p-8 sm:p-12 lg:p-20 animate-scaleIn">
              
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#FF2E63] z-10 animate-pulseSlow"></div>
              <div className="absolute bottom-8 left-8 w-20 h-20 bg-black z-30 hidden md:block animate-bounceSlow"></div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 relative z-20">
                {/* Left Column */}
                <div className="flex flex-col gap-8 animate-fadeInLeft">
                  {isAdmin ? (
                    <div className="space-y-4">
                      <EditableField
                        value={data.faqSection?.title || ''}
                        onChange={(value) => handleUpdate('faqSection', 'title', value)}
                        className="text-3xl sm:text-4xl lg:text-[52px] font-bold leading-[1.15] text-[#1A1A1A]"
                        multiline={true}
                      />
                    </div>
                  ) : (
                    <h2 className="text-3xl sm:text-4xl lg:text-[52px] font-bold leading-[1.15] text-[#1A1A1A]">
                      {data.faqSection?.title}
                    </h2>
                  )}
                  <div className="w-full lg:w-[85%] h-[300px] sm:h-[450px] overflow-hidden rounded-sm relative group">
                    {isAdmin && (
                      <label className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-md cursor-pointer z-10 flex items-center gap-2 hover:scale-105 transition-transform">
                        <Upload className="w-4 h-4" />
                        Changer image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'image')}
                        />
                      </label>
                    )}
                    <img 
                      src={getImageSrc('faqSection.image', 'livingroomService3')} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                      alt="Bathroom" 
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col justify-center animate-fadeInRight">
                  {isAdmin ? (
                    <div className="space-y-4 mb-8 lg:mb-12">
                      <EditableField
                        value={data.faqSection?.description || ''}
                        onChange={(value) => handleUpdate('faqSection', 'description', value)}
                        className="text-sm sm:text-base leading-[1.8] text-[#4A4A4A] font-medium"
                        multiline={true}
                      />
                    </div>
                  ) : (
                    <div className="mb-8 lg:mb-12">
                      <p className="text-sm sm:text-base leading-[1.8] text-[#4A4A4A] font-medium">
                        {data.faqSection?.description}
                      </p>
                    </div>
                  )}
                  <div className="flex flex-col">
                    {data.faqSection?.questions?.map((item, index) => (
                      <div 
                        key={index} 
                        className="bg-[#1F1F1F] rounded-[4px] overflow-hidden mb-3 hover:shadow-lg transition-all duration-300"
                        onMouseEnter={() => setHoveredFAQ(index)}
                        onMouseLeave={() => setHoveredFAQ(null)}
                      >
                        {isAdmin ? (
                          <div className="space-y-2 p-4">
                            <EditableField
                              value={item.question}
                              onChange={(value) => handleUpdate('faqSection', `questions[${index}].question`, value)}
                              className="text-white text-sm font-medium"
                              placeholder="Question"
                              multiline={false}
                            />
                            <EditableField
                              value={item.answer}
                              onChange={(value) => handleUpdate('faqSection', `questions[${index}].answer`, value)}
                              className="text-gray-300 text-sm"
                              placeholder="Réponse"
                              multiline={true}
                            />
                            <button
                              onClick={() => {
                                const newQuestions = data.faqSection?.questions?.filter((_, i) => i !== index) || [];
                                handleUpdate('faqSection', 'questions', newQuestions);
                              }}
                              className="text-red-400 text-xs hover:text-red-300 transition-colors duration-300"
                            >
                              Supprimer
                            </button>
                          </div>
                        ) : (
                          <div className={`transition-all duration-300 ${hoveredFAQ === index ? 'bg-[#2A2A2A]' : ''}`}>
                            <FAQItem 
                              item={item} 
                              index={index} 
                              isOpen={openIndex === index} 
                              onToggle={toggleFAQ} 
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    {isAdmin && (
                      <button
                        onClick={() => {
                          const newQuestions = [...(data.faqSection?.questions || []), { question: '', answer: '' }];
                          handleUpdate('faqSection', 'questions', newQuestions);
                        }}
                        className="bg-[#FF2E63] text-white py-3 rounded-[4px] flex items-center justify-center gap-2 mt-4 hover:scale-105 transition-transform duration-300"
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter une question
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* SECTION 2 */}
      <AnimatedSection delay={200}>
        <section className="mb-16 lg:mb-20">
          <div className={GRID_CONTAINER}>
            <div className="relative bg-[#F5F5F5] rounded-sm overflow-hidden border border-gray-100 p-8 sm:p-12 lg:p-20 animate-fadeIn">
              
              <div className="absolute bottom-0 right-0 w-[20%] h-[170px] bg-[#FF2E63] z-0 hidden lg:block animate-pulseSlow"></div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                {/* Left Column */}
                <div className="flex flex-col justify-center animate-fadeInLeft">
                  {isAdmin ? (
                    <div className="space-y-4">
                      <EditableField
                        value={data.gallerySection?.title || ''}
                        onChange={(value) => handleUpdate('gallerySection', 'title', value)}
                        className="text-3xl lg:text-[42px] font-bold leading-tight text-[#1A1A1A]"
                        multiline={true}
                      />
                      <EditableField
                        value={data.gallerySection?.description || ''}
                        onChange={(value) => handleUpdate('gallerySection', 'description', value)}
                        className="text-sm sm:text-base leading-[1.8] text-[#4A4A4A] font-medium max-w-[550px]"
                        multiline={true}
                      />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-3xl lg:text-[42px] font-bold mb-6 leading-tight text-[#1A1A1A]">
                        {data.gallerySection?.title}
                      </h2>
                      <p className="text-sm sm:text-base leading-[1.8] text-[#4A4A4A] font-medium mb-10 max-w-[550px]">
                        {data.gallerySection?.description}
                      </p>
                    </>
                  )}
                  <div className="grid grid-cols-2 gap-4 lg:max-w-[500px]">
                    <div className="aspect-square overflow-hidden rounded-sm bg-gray-200 hover:scale-105 transition-transform duration-700">
                      <img 
                        src={getImageSrc('gallerySection.secondaryImages.0', 'sofaService2')} 
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" 
                        alt="Detail 1" 
                      />
                    </div>
                    <div className="aspect-square overflow-hidden rounded-sm bg-gray-200 hover:scale-105 transition-transform duration-700" style={{ transitionDelay: '0.1s' }}>
                      <img 
                        src={getImageSrc('gallerySection.secondaryImages.1', 'sofaService1')} 
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" 
                        alt="Detail 2" 
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="h-[350px] lg:h-[600px] w-full relative animate-fadeInRight">
                  {isAdmin && (
                    <label className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-md cursor-pointer z-10 flex items-center gap-2 hover:scale-105 transition-transform">
                      <Upload className="w-4 h-4" />
                      Changer image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'mainImage')}
                      />
                    </label>
                  )}
                  <div className="w-full h-full overflow-hidden rounded-sm shadow-xl hover:shadow-2xl transition-all duration-500">
                    <img 
                      src={getImageSrc('gallerySection.mainImage', 'bedroomService4')}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" 
                      alt="Bedroom" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
};

// --- PAGE SERVICES PRINCIPALE ---
const Services = () => {
  const [pageData, setPageData] = useState<ServicePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Essayer de charger depuis le serveur d'abord
      try {
        const data = await serviceApi.getServicePage();
        if (data && typeof data === 'object') {
          setPageData(data);
          return;
        }
      } catch (serverError) {
        console.warn('⚠️ Impossible de charger du serveur, tentative de lecture locale...', serverError);
      }

      // Fallback : charger les données locales
      const localData = await serviceApi.loadLocalChanges();
      if (localData && typeof localData === 'object') {
        setPageData(localData);
      } else {
        throw new Error('Pas de connexion et aucune donnée locale trouvée');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
      setTimeout(() => setIsPageLoaded(true), 100);
    }
  }, []);

  const handleUpdate = useCallback(async (service: 'service1' | 'service2', sectionPath: string, data: any) => {
    if (!pageData) {
      console.warn('Aucune donnée de page disponible');
      return;
    }

    try {
      const [section, field] = sectionPath.split('.');
      
      if (!section || !field) {
        console.error('Format de chemin invalide:', sectionPath);
        return;
      }

      const updatedData = {
        ...pageData,
        [service]: {
          ...pageData[service],
          [section]: {
            ...(pageData[service] as any)[section],
            [field]: data
          }
        },
        meta: {
          ...pageData.meta,
          updatedAt: new Date().toISOString(),
          version: (pageData.meta?.version || 0) + 1
        }
      };

      setPageData(updatedData);
      
      // Sauvegarder localement d'abord
      try {
        await serviceApi.saveLocalChanges(updatedData);
      } catch (localError) {
        console.warn('⚠️ Erreur lors de la sauvegarde locale:', localError);
      }

      // Essayer de synchroniser avec le serveur
      try {
        await serviceApi.updateSection(service, sectionPath, data);
        await serviceApi.clearLocalChanges();
      } catch (serverError) {
        console.warn('⚠️ Échec synchronisation serveur, données sauvegardées localement', serverError);
      }
    } catch (err) {
      console.error('❌ Erreur mise à jour:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    }
  }, [pageData]);

  const handleUploadImage = useCallback(async (file: File): Promise<string> => {
    try {
      if (!file || !file.type.startsWith('image/')) {
        throw new Error('Veuillez sélectionner une image valide');
      }

      const result = await serviceApi.uploadImage(file);
      
      if (!result) {
        throw new Error('Aucune réponse du serveur lors de l\'upload');
      }

      const imageUrl = typeof result === 'string' ? result : result.url;
      
      if (!imageUrl) {
        throw new Error('URL d\'image non reçue du serveur');
      }

      return imageUrl;
    } catch (error) {
      console.error('Erreur upload:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'upload de l\'image';
      setError(errorMessage);
      throw error;
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === 'services_updated') {
        try {
          loadData();
        } catch (err) {
          console.error('Failed to refetch services page after storage event', err);
        }
      }
    };

    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [loadData]);

  const handleRefresh = () => {
    loadData();
  };

  const handleExportData = async () => {
    try {
      const exportData = await serviceApi.exportData();
      
      if (!exportData) {
        console.error('Aucune donnée à exporter');
        setError('Aucune donnée disponible pour l\'export');
        return;
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `services-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur export:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'export des données');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <LoadingSpinner />
        <Footer />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <ErrorDisplay message={error} onRetry={handleRefresh} />
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
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune donnée disponible</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className={`min-h-screen bg-white ${isPageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
      <Navbar />
      
      {/* Bandeau Admin */}
      {isAdmin && (
        <div className="bg-[#1A1A1A] text-white py-3 px-6 animate-fadeInDown">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Mode Édition</span>
              <span className="text-xs bg-[#FF2E63] px-2 py-1 rounded animate-pulse">
                Version {pageData.meta.version}
              </span>
              <span className="text-xs text-gray-400">
                Dernière modif: {new Date(pageData.meta.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportData}
                className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded flex items-center gap-1 transition-all duration-300 hover:scale-105"
              >
                <Save className="w-3 h-3" />
                Exporter
              </button>
              <button
                onClick={handleRefresh}
                className="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded flex items-center gap-1 transition-all duration-300 hover:scale-105"
              >
                <RefreshCw className="w-3 h-3" />
                Actualiser
              </button>
            </div>
          </div>
        </div>
      )}

      <Service1 
        data={pageData.service1} 
        metaVersion={pageData.meta?.version}
        metaTimestamp={pageData.meta?.updatedAt ? Date.parse(pageData.meta.updatedAt) : undefined}
        isAdmin={isAdmin}
        onUpdate={(section, field, data) => handleUpdate('service1', `${section}.${field}`, data)}
        onUploadImage={handleUploadImage}
      />
      
      <br />
      <br />
      <br />
      
      <Service2 
        data={pageData.service2} 
        metaVersion={pageData.meta?.version}
        metaTimestamp={pageData.meta?.updatedAt ? Date.parse(pageData.meta.updatedAt) : undefined}
        isAdmin={isAdmin}
        onUpdate={(section, field, data) => handleUpdate('service2', `${section}.${field}`, data)}
        onUploadImage={handleUploadImage}
      />
      
      <Footer />
      
      {/* Styles CSS pour les animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes pulseSlow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-fadeInLeft {
          animation: fadeInLeft 0.8s ease-out forwards;
        }
        
        .animate-fadeInRight {
          animation: fadeInRight 0.8s ease-out forwards;
        }
        
        .animate-fadeInDown {
          animation: fadeInDown 0.5s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.6s ease-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .animate-pulseSlow {
          animation: pulseSlow 3s ease-in-out infinite;
        }
        
        .animate-bounceSlow {
          animation: bounceSlow 3s ease-in-out infinite;
        }
        
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        
        /* Transitions personnalisées */
        .transition-transform-custom {
          transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Smooth image loading */
        img {
          transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), 
                     opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        
        /* Hover effects */
        .hover-lift {
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
                     box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        /* Staggered children */
        .stagger-children > * {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        /* Smooth page transition */
        .page-transition {
          transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>
    </main>
  );
};

export default memo(Services);