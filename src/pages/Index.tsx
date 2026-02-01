import React, { useEffect, useState, useRef,useCallback  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Search, CalendarDays, Users, Map, Home, Sofa, ChevronLeft, ChevronRight, Wifi, Bed, TreePine, Car, Waves, Diamond } from 'lucide-react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoPlayer from "@/components/VideoPlayer";
import ImprovedDatePicker from "@/components/ImprovedDatePicker";

import { homeApi } from '@/services/homeApi';
import { destinationApi } from '@/services/destinationApi';
import type { HomePageData, IHeroSection, IWelcomeSection } from '@/types/home.types';
//import images
import imagePrincipale from "@/assets/image-principale-hero.png";
import imageGrise from "@/assets/Image-Grise-hero.png";
import imageLit from "@/assets/Image-Lit-hero.png";
import welcomeRoom1 from "@/assets/video-bg-welcome.png";
import welcomeRoom2 from "@/assets/photo-welcome1.png";
import welcomeRoom3 from "@/assets/photo-welcome2.png";
import welcomeicon from "@/assets/icon (8).png";
import welcomeicon1 from "@/assets/icon (7).png";
import heroMain from "@/assets/vertical-photo-destination.png";
import heroSecondary from "@/assets/left-photo-destination.png";
import featureBedroom from "@/assets/horizontal-photo-room.png";
import featureLiving from "@/assets/square-photo-room.png";
import bedroomMain from "@/assets/bedroom-main.png";
import bedroom1 from "@/assets/image-above.png";
import bedroom2 from "@/assets/image-center.png";
import bedroom3 from "@/assets/image-below.png";
import room1 from "@/assets/photo-serivece-1.png";
import room2 from "@/assets/photo-service-2.png";
import room3 from "@/assets/photo-service-3.png";
import livingMain from "@/assets/b-photo-center-feature.png";
import thumb1 from "@/assets/s-photo-feature-1.png";
import thumb2 from "@/assets/s-photo-feature-2.png";
import propertyImage from "@/assets/image-card-property.png";
import logo1 from "@/assets/p-logo1.png";
import logo2 from "@/assets/p-logo2.png";
import logo3 from "@/assets/p-logo3.png";
import logo4 from "@/assets/p-logo4.png";
import logo5 from "@/assets/p-logo5.png";
import logo6 from "@/assets/p-logo6.png";
import logo7 from "@/assets/p-logo7.png";
import logo8 from "@/assets/p-logo8.png";
import { useScroll } from '@/context/ScrollContext';

/* ================= HERO SECTION ================= */
function HeroSection({ data }: { data?: IHeroSection | null }) {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);
  const imagesRef = useRef([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);

    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / window.innerHeight));
        setScrollProgress(progress);
      }
    };

    const handleMouseMove = (e) => {
      if (window.matchMedia("(pointer: coarse)").matches) return;
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        imagesRef.current.forEach(img => {
          if (img && Math.random() > 0.7) {
            img.style.transform = `translateX(${(Math.random() - 0.5) * 4}px)`;
            setTimeout(() => {
              if (img) img.style.transform = 'translateX(0)';
            }, 100);
          }
        });
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(glitchInterval);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative flex items-center justify-center bg-white lg:bg-transparent min-h-screen overflow-hidden"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >

      {/* MAIN GRID CONTAINER */}
      <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20 py-12 md:py-20 lg:py-28 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          
          {/* ----- COLONNE GAUCHE (TEXTE) ----- */}
          <div className="flex flex-col justify-center relative text-left order-2 lg:order-1">
            <div 
              className="absolute -top-20 -left-20 w-64 h-64 bg-[#FF1B7C]/5 rounded-full blur-[100px] pointer-events-none hidden lg:block"
              style={{
                transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                transition: 'transform 0.3s ease-out'
              }}
            />

            <h1 className="text-[42px] xs:text-[50px] sm:text-[60px] md:text-[70px] lg:text-[75px] xl:text-[85px] 2xl:text-[100px] font-black leading-[0.85] tracking-tighter text-black mb-6 md:mb-8 uppercase"
                style={{ fontFamily: "'Montserrat', sans-serif" }}>
              <span 
                className={`inline-block transition-all duration-700 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{ transform: isVisible ? `translateY(0) translateX(${mousePosition.x * 0.05}px)` : 'translateY(8px)' }}
              >
                {data?.mainTitle?.line1 ?? ''}
              </span>
              <br />
              <span 
                className={`inline-block transition-all duration-700 ease-out delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{ transform: isVisible ? `translateY(0) translateX(${mousePosition.x * 0.1}px)` : 'translateY(8px)' }}
              >
                {data?.mainTitle?.line2 ?? ''}
              </span>
              <br />
              <span 
                className={`inline-block transition-all duration-700 ease-out delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{ transform: isVisible ? `translateY(0) translateX(${mousePosition.x * 0.15}px)` : 'translateY(8px)' }}
              >
                {data?.mainTitle?.line3 ?? ''}
              </span>
            </h1>

            <p className={`text-base md:text-lg leading-relaxed text-gray-700 mb-8 md:mb-10 max-w-[460px] font-medium transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
               style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {data?.description ?? ''}
            </p>

            <div className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <Link to="/appartement" className="w-full sm:w-auto bg-[#FF1B7C] hover:bg-black text-white font-bold px-10 py-4 rounded-[4px] transition-all duration-500 shadow-lg hover:shadow-[#FF1B7C]/20 relative overflow-hidden group inline-block"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative z-10">{data?.buttonText ?? ''}</span>
              </Link>
            </div>

            {/* TESTIMONIAL BLOC */}
            <div 
              className={`mt-12 lg:mt-20 bg-white p-4 sm:p-5 rounded-xl inline-flex gap-4 sm:gap-5 items-center max-w-sm shadow-xl shadow-black/5 border border-gray-100 transition-all duration-700 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'} group`}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                <img
                  src={data?.testimonial?.image ?? 'https://images.pexels.com/photos/3777570/pexels-photo-3777570.jpeg?auto=compress&cs=tinysrgb&w=200'}
                  alt="Client"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  ref={el => imagesRef.current[0] = el}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-[15px] font-bold text-black mb-1 leading-tight"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {data?.testimonial?.title ? (
                    <>{data.testimonial.title.split('\n').map((l: string, i: number) => (<span key={i}>{l}<br/></span>))}</>
                  ) : ''}
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-500"
                   style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {data?.testimonial?.subtitle ? (
                    <>{data.testimonial.subtitle.split('\n').map((l: string, i: number) => (<span key={i}>{l}<br/></span>))}</>
                  ) : ''}
                </p>
              </div>
            </div>
          </div>

          {/* ----- COLONNE DROITE (COLLAGE) ----- */}
          <div className="relative h-[400px] xs:h-[500px] sm:h-[600px] lg:h-[650px] w-full order-1 lg:order-2 lg:pl-12">
              
              {/* 1. Image Principale */}
              <div 
                className={`absolute top-0 
                  left-0 xl:left-[-22%] lg:left-[-12%] 
                  w-[80%] sm:w-[75%] h-[65%] z-20 shadow-2xl transition-all duration-1000 
                  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                style={{ transform: `translate3d(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px, 0)` }}
              >
                <div className="relative w-full h-full overflow-hidden rounded-sm">
                  <img src={data?.images?.main ?? imagePrincipale} className="w-full h-full object-cover" alt="Interior" />
                </div>
              </div>

              {/* 2. Grand Carré Rose */}
              <div 
                className="absolute top-[25%] right-[6%] lg:right-[15%] xl:right-[23%] w-[20%] aspect-square bg-[#FF1B7C] z-10 shadow-lg rounded-[4px]"
                style={{ 
                  animation: 'pulse-glow 3s infinite, float-slow 6s infinite',
                  transform: `rotate(${scrollProgress * 15}deg)`
                }}
              />

              {/* 3. Image Grise (TV) */}
              <div 
                className={`absolute top-[45%] right-0 w-[40%] lg:w-[45%] h-[28%] z-30 shadow-2xl transition-all duration-1000 delay-200 
                  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                style={{ transform: `translate3d(${mousePosition.x * 0.15}px, ${mousePosition.y * 0.15}px, 0)` }}
              >
                <div className="relative w-full h-full overflow-hidden rounded-sm group">
                  <img src={data?.images?.secondary ?? imageGrise} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="TV Area" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 animate-scan pointer-events-none" />
                </div>
              </div>

              {/* 4. LE PETIT CARRÉ ROSE (POSITION RÉPARÉE) */}
              <div 
                className={`absolute bottom-[3%] 
                  left-[5%] lg:left-[-10%] xl:left-[-20%] 
                  w-[12%] aspect-square bg-[#FF1B7C] z-[50] shadow-2xl rounded-sm animate-bounce 
                  ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
                style={{ 
                  boxShadow: '0 0 25px rgba(255, 27, 124, 0.6)',
                  animationDuration: '2.5s'
                }}
              />

              {/* 5. Image Lit */}
              <div 
                className={`absolute bottom-[-4%] 
                  left-[10%] lg:left-[-5%] xl:left-[2%] 
                  w-[55%] lg:w-[52%] h-[38%] z-40 shadow-2xl transition-all duration-1000 delay-400 
                  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                style={{ transform: `translate3d(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px, 0)` }}
              >
                <div className="relative w-full h-full overflow-hidden rounded-sm border-2 border-white/20">
                  <img src={data?.images?.bedroom ?? imageLit} className="w-full h-full object-cover" alt="Bedroom" />
                </div>
              </div>
            </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 27, 124, 0.4); }
          50% { box-shadow: 0 0 40px rgba(255, 27, 124, 0.6); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan { animation: scan 3s linear infinite; }
        
        section { contain: paint; }
        img { will-change: transform; backface-visibility: hidden; }

        @media (max-width: 480px) {
          h1 { line-height: 0.9; }
        }
      `}</style>
    </section>
  );
}

/* ================= VIDEO MODAL COMPONENT ================= */
const VideoModal = ({ isOpen, videoUrl, onClose }: { isOpen: boolean; videoUrl?: string; onClose: () => void }) => {
  if (!isOpen || !videoUrl) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/90 hover:bg-white text-black rounded-full w-10 h-10 flex items-center justify-center z-10 transition-colors"
        >
          ✕
        </button>
        <iframe
          width="100%"
          height="100%"
          src={`${videoUrl}?autoplay=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

/* ================= WELCOME SECTION ================= */
const WelcomeSection = ({ data }: { data?: IWelcomeSection | null }) => {
  const containerStyles =
    "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

  // Déterminer si c'est une vidéo Cloudinary ou YouTube
  const isCloudinaryVideo = data?.videoUrl && data.videoUrl.includes('cloudinary.com');

  return (
    <>
      <section className="bg-white py-20 lg:py-32" style={{ fontFamily: "'Montserrat', sans-serif" }}>
        <div className={containerStyles}>

          {/* ================= MOBILE MEDIA ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 lg:hidden">
            {/* VIDEO */}
            <div 
              className="relative aspect-square w-full overflow-hidden rounded-xl group"
            >
              <img
                src={data?.videoImage ?? welcomeRoom1}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                alt="Welcome video"
              />
              {isCloudinaryVideo && (
                <VideoPlayer
                  videoUrl={data?.videoUrl}
                  posterImage={data?.videoImage}
                  playButtonSize="medium"
                />
              )}
            </div>

          {/* IMAGE 1 */}
          <div className="relative aspect-square w-full overflow-hidden rounded-xl">
            <img
              src={data?.image1 ?? welcomeRoom2}
              className="w-full h-full object-cover"
              alt="Image 1"
            />
          </div>

          {/* IMAGE 2 */}
          <div className="relative aspect-square w-full overflow-hidden rounded-xl">
            <img
              src={data?.image2 ?? welcomeRoom3}
              className="w-full h-full object-cover"
              alt="Image 2"
            />
          </div>
        </div>

        {/* ================= MOBILE CONTENT ================= */}
        <div className="flex flex-col space-y-6 max-w-xl lg:hidden">
          <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight leading-tight"
              style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {data?.title ?? ''}
          </h2>

          <p className="text-gray-600 text-base md:text-lg leading-relaxed"
             style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {data?.description ?? ''}
          </p>

          <div className="flex flex-col bg-black text-white rounded-xl overflow-hidden shadow-xl">
            <div className="flex items-center gap-4 px-6 py-5">
              <img className="w-5 h-5 invert" src={welcomeicon1} alt="" />
                <span className="text-xs font-semibold  tracking-widest"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {data?.features?.feature1 ?? ''}
              </span>
            </div>

            <div className="h-px bg-white/20" />

            <div className="flex items-center gap-4 px-6 py-5">
              <img className="w-5 h-5 invert" src={welcomeicon} alt="" />
                <span className="text-xs font-semibold  tracking-widest"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {data?.features?.feature2 ?? ''}
              </span>
            </div>
          </div>

          <Link to="/appartement" className="w-fit bg-[#FF1B7C] text-white px-10 py-4 rounded-md font-bold  tracking-widest hover:bg-black transition-all inline-block"
                style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {data?.buttonText ?? ''}
          </Link>
        </div>

        {/* ================= DESKTOP GRID (STRICTEMENT INCHANGÉ) ================= */}
        <div className="hidden lg:grid grid-cols-[auto_auto_1fr] gap-12 items-start">

          {/* VIDEO */}
          <div 
            className="relative aspect-square w-full max-w-[420px] overflow-hidden rounded-xl group"
          >
            <img
              src={data?.videoImage ?? welcomeRoom1}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt="Welcome video"
            />
            {isCloudinaryVideo && (
              <VideoPlayer
                videoUrl={data?.videoUrl}
                posterImage={data?.videoImage}
                playButtonSize="medium"
              />
            )}
          </div>

          {/* IMAGES COLUMN */}
          <div className="grid grid-rows-2 gap-4 w-[220px] h-full">
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={data?.image1 ?? welcomeRoom2}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                alt="Image 1"
              />
            </div>

            <div className="relative overflow-hidden rounded-xl">
              <img
                src={data?.image2 ?? welcomeRoom3}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                alt="Image 2"
              />
            </div>
          </div>

          {/* CONTENT (DESKTOP ORIGINAL) */}
          <div className="flex flex-col justify-center space-y-6 max-w-xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black tracking-tight leading-tight"
                style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {data?.title ?? ''}
            </h2>

            <p className="text-gray-600 text-base md:text-lg leading-relaxed"
               style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {data?.description ?? ''}
            </p>

            <div className="flex flex-col sm:flex-row bg-black text-white rounded-xl overflow-hidden shadow-xl">
              <div className="flex items-center gap-4 px-6 py-5 flex-1">
                <img className="w-5 h-5 invert" src={welcomeicon1} alt="" />
                <span className="text-xs font-semibold  tracking-widest"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {data?.features?.feature1 ?? ''}
                </span>
              </div>

              <div className="hidden sm:block w-px bg-white" />

              <div className="flex items-center gap-4 px-6 py-5 flex-1">
                <img className="w-5 h-5 invert" src={welcomeicon} alt="" />
                <span className="text-xs font-semibold  tracking-widest"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {data?.features?.feature2 ?? ''}
                </span>
              </div>
            </div>

            <Link to="/appartement" className="w-fit bg-[#FF1B7C] text-white px-10 py-4 rounded-md font-bold  tracking-widest hover:bg-black transition-all inline-block"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {data?.buttonText ?? ''}
            </Link>
          </div>
        </div>

      </div>
    </section>
    </>
  );
};

/* ================= MARQUEE SECTION ================= */
const MarqueeSection = ({ data }: { data?: any | null }) => {
  // COHÉRENCE HERO : Même max-width et paddings extérieurs
  const gridContainer = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

  return (
    <section className="w-full bg-white py-6 md:py-10 font-montserrat">
      {/* WRAPPER DE LA GRILLE (Marges extérieures) */}
      <div className={gridContainer}>
        
        {/* INNER BOX (Le fond gris délimité comme le Footer/Destination) */}
        <div 
          className="rounded-sm overflow-hidden py-8 sm:py-12 lg:py-16"
          style={{
            backgroundColor: 'hsl(0 0% 98%)' // Gris cohérent avec le reste
          }}
        >
          {/* Conteneur de l'animation */}
          <div 
            className="whitespace-nowrap flex items-center gap-8 sm:gap-12 lg:gap-16 w-max"
            style={{
              animation: 'marquee-section 30s linear infinite'
            }}
          >
            {[...Array(10)].map((_, i) => (
              <span
                key={i}
                className="text-[40px] sm:text-[60px] lg:text-[80px] xl:text-[100px] font-bold tracking-tighter"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  color: data?.color ?? 'hsla(0, 0%, 10%, 0.15)'
                }}
              >
                {data?.text ?? ''}
              </span>
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
};

/* ================= ROTATING BADGE (for DestinationSearch) ================= */
const RotatingBadge = ({ text }: { text?: string }) => (
  <div className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px] xl:w-[200px] xl:h-[200px] relative flex-shrink-0">
    <svg
      viewBox="0 0 140 140"
      className="w-full h-full animate-[spin_20s_linear_infinite]"
    >
      <defs>
        <path
          id="innerCirclePath"
          d="M70,70 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
        />
      </defs>

      <circle cx="70" cy="70" r="60" fill="hsl(0 0% 12%)" />

      <text
        fill="white"
        fontSize="10"
        fontWeight="600"
        letterSpacing="2"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <textPath href="#innerCirclePath">
          {text ?? ''}
        </textPath>
      </text>

      <polygon
        points="70,55 73,62 81,63 75,68 77,76 70,72 63,76 65,68 59,63 67,62"
        fill="white"
      />
    </svg>
  </div>
);

/* ================= INPUT FIELD COMPONENT WITH SUGGESTIONS ================= */
const InputField = ({ label, placeholder, icon: Icon, type = 'text', value, onChange, error = '', min = undefined, suggestions = [] }: any) => {
  const hasError = error.length > 0;
  const isValid = value && !hasError;
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  // Filtrer les suggestions basées sur l'input
  useEffect(() => {
    if (type === 'text' && value && suggestions.length > 0) {
      const filtered = suggestions.filter((suggestion: string) =>
        suggestion.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [value, suggestions, type]);

  const handleSuggestionClick = (suggestion: string) => {
    onChange({ target: { value: suggestion } });
    setShowSuggestions(false);
  };
  
  return (
    <div className="mb-6 relative" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-[10px] xs:text-[11px] font-bold tracking-[0.1em] text-gray-800"
               style={{ fontFamily: "'Montserrat', sans-serif" }}>
          {label}
        </label>
        {isValid && (
          <span className="text-[10px] text-green-600 font-semibold">✓ Valide</span>
        )}
      </div>

      <div className={`relative group transition-all ${hasError ? 'mb-1' : ''}`}>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => {
            if (type === 'text' && value && filteredSuggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          min={min}
          className={`w-full bg-white border rounded-lg px-4 xs:px-5 py-3 xs:py-4 text-sm
                     placeholder:text-gray-400 outline-none transition-all shadow-sm
                     ${
                       hasError
                         ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                         : isValid
                         ? 'border-green-400 focus:ring-2 focus:ring-green-200'
                         : 'border-gray-100 focus:ring-2 focus:ring-black/5'
                     }`}
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        />
        <div className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 xs:w-9 xs:h-9
                        rounded-md flex items-center justify-center
                        text-white group-hover:opacity-90 transition-all
                        ${
                          hasError
                            ? 'bg-red-500'
                            : isValid
                            ? 'bg-green-500'
                            : 'bg-[#1a1a1a] group-hover:bg-black'
                        }`}>
          {hasError ? (
            <span className="text-lg">⚠</span>
          ) : isValid ? (
            <span className="text-lg">✓</span>
          ) : (
            <Icon size={16} strokeWidth={2.5} />
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
            {filteredSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 xs:px-5 py-2 xs:py-2.5 text-sm hover:bg-[#FF1B7C]/10 
                         transition-colors border-b border-gray-100 last:border-b-0 font-medium text-gray-800"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <Map className="inline w-3 h-3 mr-2 text-[#FF1B7C]" />
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {hasError && (
        <p className="text-[11px] xs:text-[12px] text-red-500 font-medium mt-1.5 flex items-center gap-1">
          <span>✕</span>
          {error}
        </p>
      )}
    </div>
  );
};

/* ================= DESTINATION SEARCH ================= */
const DestinationSearch = ({ data }: { data?: any | null }) => {
  const navigate = useNavigate();
  const { setDestinationRef, isScrollingToDestination } = useScroll();
  const sectionRef = useRef<HTMLElement>(null);
  
  const [searchHover, setSearchHover] = useState(false);
  const [destination, setDestination] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [travelers, setTravelers] = useState('');
  const [errors, setErrors] = useState({ destination: '', checkInDate: '', travelers: '' });
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const gridContainer = "max-w-[1440px] w-full mx-auto px-4 xs:px-5 sm:px-6 md:px-10 lg:px-16 xl:px-20";

  // Charger les suggestions de destinations depuis l'API
  useEffect(() => {
    const loadDestinationSuggestions = async () => {
      try {
        const suggestions = await destinationApi.getAllDestinationOptions();
        setDestinationSuggestions(suggestions);
        console.log('✓ Suggestions de destinations chargées:', suggestions.length);
      } catch (error) {
        console.error('Erreur lors du chargement des suggestions:', error);
        // Fallback en cas d'erreur
        setDestinationSuggestions([]);
      }
    };

    loadDestinationSuggestions();
  }, []);

  // Enregistrer la référence dans le contexte
  useEffect(() => {
    if (sectionRef.current) {
      setDestinationRef(sectionRef.current);
      
      // Si le contexte indique qu'on doit scroller (venant de la navbar)
      if (isScrollingToDestination) {
        // Ajouter un effet visuel
        sectionRef.current.classList.add('highlight-section');
        
        // Focus sur le premier input
        setTimeout(() => {
          const input = sectionRef.current?.querySelector('input');
          if (input) {
            input.focus({ preventScroll: true });
          }
        }, 1000);
      }
    }
  }, [setDestinationRef, isScrollingToDestination]);

  // Validation en temps réel pour destination
  const validateDestination = (value: string) => {
    if (!value.trim()) {
      return 'Veuillez entrer une destination';
    }
    if (value.trim().length < 2) {
      return 'La destination doit contenir au moins 2 caractères';
    }
    return '';
  };

  // Validation en temps réel pour la date
  const validateCheckInDate = (value: string) => {
    if (!value) {
      return 'Veuillez sélectionner une date d\'arrivée';
    }
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return 'La date d\'arrivée doit être aujourd\'hui ou plus tard';
    }
    return '';
  };

  // Validation en temps réel pour les voyageurs
  const validateTravelers = (value: string) => {
    if (!value) {
      return 'Veuillez indiquer le nombre de voyageurs';
    }
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1) {
      return 'Le nombre doit être au minimum 1';
    }
    if (num > 20) {
      return 'Le nombre maximum est 20';
    }
    return '';
  };

  // Handlers avec validation
  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDestination(value);
    setErrors(prev => ({ ...prev, destination: validateDestination(value) }));
    
    // Filtrer les suggestions basées sur l'input de l'utilisateur
    // Utiliser startsWith pour une meilleure expérience (afficher suggestions commençant par le texte)
    if (value.length > 0) {
      const filtered = destinationSuggestions.filter(suggestion =>
        suggestion.toLowerCase().startsWith(value.toLowerCase())
      );
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleCheckInDateChange = useCallback((value: string) => {
    setCheckInDate(value);
    setErrors(prev => ({ ...prev, checkInDate: validateCheckInDate(value) }));
  }, []);

  const handleTravelersChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.value;
    setTravelers(value);
    setErrors(prev => ({ ...prev, travelers: validateTravelers(value) }));
  };

  const selectSuggestion = (city: string) => {
    setDestination(city);
    setShowSuggestions(false);
    setErrors(prev => ({ ...prev, destination: '' }));
  };

  // Valider tout avant la recherche
  const isFormValid = (): boolean => {
    const destError = validateDestination(destination);
    const dateError = validateCheckInDate(checkInDate);
    const travelersError = validateTravelers(travelers);
    
    return !destError && !dateError && !travelersError;
  };

  const handleSearch = () => {
    // Valider et mettre à jour les erreurs
    const destError = validateDestination(destination);
    const dateError = validateCheckInDate(checkInDate);
    const travelersError = validateTravelers(travelers);
    
    setErrors({
      destination: destError,
      checkInDate: dateError,
      travelers: travelersError
    });

    if (destError || dateError || travelersError) {
      return;
    }

    // Redirection vers la page d'appartements avec les paramètres de recherche
    const searchParams = new URLSearchParams({
      destination: destination.trim(),
      checkIn: checkInDate,
      travelers: travelers
    });
    
    console.log('🔍 Recherche initiée:', { destination, checkInDate, travelers });
    
    navigate(`/appartement?${searchParams.toString()}`);
  };

  return (
    <section 
      ref={sectionRef}
      id="destinationsearch"
      className={`bg-white py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 overflow-hidden transition-all duration-300 ${
        isScrollingToDestination ? 'ring-2 ring-[#FF1B7C] ring-opacity-30' : ''
      }`}
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className={gridContainer}>
        <div className="bg-[#E5E5E5] rounded-sm relative z-10 py-10 sm:py-14 md:py-16 lg:py-20 px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">

          {/* Décor carré noir - ajusté pour mobile */}
          <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-32 xl:h-32 bg-black z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20 items-center relative z-10">

            {/* ================= IMAGES ================= */}
            <div className="lg:col-span-7 grid grid-cols-12 gap-3 xs:gap-4 sm:gap-5 relative items-end">

              {/* Badge rotatif - position responsive */}
              <div className="absolute -top-[5%] xs:-top-[3%] sm:-top-[2%] md:-top-[1%] lg:-top-[0%] 
                             left-[2%] xs:left-[3%] sm:left-[4%] md:left-[5%] z-20">
                <RotatingBadge text={data?.rotatingText} />
              </div>

              {/* Petite image */}
              <div className="col-span-5 pt-16 xs:pt-20 sm:pt-24 md:pt-28 lg:pt-32 xl:pt-28">
                <div className="overflow-hidden rounded-sm shadow-lg sm:shadow-xl bg-white/20">
                  <img
                    src={data?.images?.small ?? '/placeholder.jpg'}
                    alt="Interior"
                    className="w-full aspect-[3/4] object-cover grayscale
                               hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
              </div>

              {/* ================= TITRE + IMAGE MAIN ================= */}
              <div className="col-span-7 flex flex-col gap-4 sm:gap-5 md:gap-6">

                {/* TITRE AU-DESSUS DE L'IMAGE MAIN */}
                <h1 className="text-xl xs:text-2xl sm:text-2xl md:text-3xl xl:text-4xl
                               font-black uppercase tracking-tight
                               leading-[1.1] text-[#1a1a1a]"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {data?.title ? (
                    <>{data.title.split('\n').map((l: string, idx: number) => (<span key={idx}>{l}<br/></span>))}</>
                  ) : (
                    <>Sit amet,<br />consectetur<br />adipiscing elit.</>
                  )}
                </h1>

                <div className="overflow-hidden rounded-sm shadow-lg sm:shadow-xl bg-white/20">
                  <img
                    src={data?.images?.main ?? '/placeholder.jpg'}
                    alt="Main Lounge"
                    className="w-full aspect-[4/5] object-cover grayscale
                               hover:grayscale-0 transition-all duration-1000"
                  />
                </div>

              </div>
            </div>

            {/* ================= FORMULAIRE ================= */}
            <div id="search-form" className="lg:col-span-5 flex flex-col justify-center">
              <div className="w-full max-w-[320px] xs:max-w-[360px] sm:max-w-[400px] md:max-w-[420px] mx-auto lg:mx-0">
                <h2 className="text-xl xs:text-2xl sm:text-2xl md:text-3xl xl:text-3xl 
                               font-extrabold leading-tight text-[#1a1a1a] 
                               mb-3 xs:mb-4 tracking-tight"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {data?.descriptionTitle ?? ''}
                </h2>

                <p className="text-gray-600 text-xs xs:text-sm mb-8 xs:mb-10 
                             leading-relaxed font-medium"
                   style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {data?.description ?? ''}
                </p>

                {/* Destination avec suggestions */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-tight">
                    {data?.formLabels?.destination ?? 'Destination'}
                  </label>
                  <div className="relative">
                    <div className="flex items-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-all">
                      <Map size={18} className="text-gray-600 flex-shrink-0" />
                      <input
                        type="text"
                        placeholder={data?.formLabels?.destination ?? 'Où allez-vous ?'}
                        value={destination}
                        onChange={handleDestinationChange}
                        onFocus={() => destination.length > 0 && setShowSuggestions(true)}
                        className="flex-1 bg-transparent outline-none text-sm font-medium"
                        autoFocus={isScrollingToDestination}
                      />
                    </div>
                    
                    {/* Suggestions de destinations */}
                    {showSuggestions && destination.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                        {destinationSuggestions
                          .filter(suggestion => 
                            suggestion.toLowerCase().startsWith(destination.toLowerCase())
                          )
                          .map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => selectSuggestion(suggestion)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm font-medium text-gray-900 border-b last:border-0 transition-colors"
                            >
                              📍 {suggestion}
                            </button>
                          ))}
                      </div>
                    )}
                    
                    {errors.destination && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{errors.destination}</p>
                    )}
                  </div>
                </div>

                {/* Date d'arrivée avec ImprovedDatePicker */}
                <div className="mb-6">
                  <ImprovedDatePicker
                    label={data?.formLabels?.date ?? 'Date d\'arrivée'}
                    placeholder={data?.formLabels?.date ?? 'Sélectionner une date'}
                    value={checkInDate}
                    onChange={handleCheckInDateChange}
                    minDate={new Date().toISOString().split('T')[0]}
                    error={errors.checkInDate}
                  />
                </div>

                {/* Nombre de voyageurs */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-tight">
                    {data?.formLabels?.travelers ?? 'Voyageurs'}
                  </label>
                  <div className="relative">
                    <div className="flex items-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-all">
                      <Users size={18} className="text-gray-600 flex-shrink-0" />
                      <select
                        value={travelers}
                        onChange={handleTravelersChange}
                        className="flex-1 bg-transparent outline-none text-sm font-medium appearance-none cursor-pointer"
                      >
                        <option value="">Sélectionner le nombre</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'voyageur' : 'voyageurs'}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.travelers && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{errors.travelers}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleSearch}
                  onMouseEnter={() => setSearchHover(true)}
                  onMouseLeave={() => setSearchHover(false)}
                  disabled={!isFormValid()}
                  className={`w-full mt-6 py-4 xs:py-5 rounded-sm flex items-center
                              justify-center gap-2 xs:gap-3 text-white font-bold
                              transition-all duration-500 shadow-lg ${
                                !isFormValid()
                                  ? "bg-gray-400 cursor-not-allowed opacity-60"
                                  : searchHover
                                  ? "bg-black scale-[1.01]"
                                  : "bg-[#FF1B7C]"
                              }`}
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  <span className="text-xs xs:text-sm tracking-widest">
                    Rechercher
                  </span>
                  <Search
                    className="w-4 h-4 xs:w-[18px] xs:h-[18px]"
                    strokeWidth={3}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


/* ================= FEATURE ROOM ================= */
const FeatureRoom = ({ data }: { data?: any | null }) => {
  // COHÉRENCE HERO & FOOTER : Grid de 1440px avec marges réactives
  const gridContainer = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

  return (
    <section className="w-full py-16 md:py-24 bg-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className={gridContainer}>
        
        {/* Header : Aligné sur la grille */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-8 mb-16 md:mb-20">
            <div className="max-w-[500px]">
            <h2 
              className="text-[32px] sm:text-[42px] lg:text-[52px] xl:text-[62px] font-bold leading-[1] tracking-tighter uppercase"
              style={{
                color: 'hsl(0 0% 8%)',
                fontFamily: "'Montserrat', sans-serif"
              }}
            >
                {data?.title ?? ''}
                <br />
                {data?.subtitle ?? ''}
            </h2>
          </div>
          
          <div className="max-w-md">
            <p 
              className="text-sm sm:text-base leading-relaxed text-gray-600 border-l-2 border-black/10 pl-6"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {data?.description ?? ''}
            </p>
          </div>
        </div>

        {/* Grid content : 2 colonnes principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Colonne Gauche */}
          <div className="flex flex-col gap-8">
            {/* Cartes de caractéristiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Dark card */}
              <div 
                className="p-8 md:p-10 flex flex-col items-start text-left rounded-sm transition-transform hover:-translate-y-1 duration-500"
                style={{
                  backgroundColor: (data?.features && data.features[0]?.backgroundColor) ?? 'hsl(0 0% 8%)',
                  color: 'hsl(0 0% 100%)'
                }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6 bg-white">
                  <Home className="w-5 h-5 text-black" />
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {(data?.features && data.features[0]?.title) ?? ''}
                </h3>
                <p className="text-sm leading-relaxed opacity-70"
                   style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {(data?.features && data.features[0]?.description) ?? ''}
                </p>
              </div>

              {/* Light card (Gris très clair pour subtilité) */}
              <div 
                className="p-8 md:p-10 flex flex-col items-start text-left rounded-sm bg-[#F5F5F5] transition-transform hover:-translate-y-1 duration-500"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6 bg-black">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {(data?.features && data.features[1]?.title) ?? ''}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500"
                   style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {(data?.features && data.features[1]?.description) ?? ''}
                </p>
              </div>
            </div>

            {/* Bedroom image (Horizontal) */}
            <div className="w-full aspect-[16/9] overflow-hidden rounded-sm group">
              <img
                src={data?.images?.bedroom ?? featureBedroom}
                alt="Luxury bedroom interior"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
              />
            </div>
          </div>

          {/* Colonne Droite - Grande image verticale */}
          <div className="w-full h-full min-h-[500px] lg:min-h-full overflow-hidden rounded-sm group">
            <img
              src={data?.images?.living ?? featureLiving}
              alt="Modern living room interior"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

/* ================= MARQUEE BLACK SECTION ================= */
const MarqueeBlackSection = ({ data }: { data?: any | null }) => {
  // COHÉRENCE GRID : Toujours aligné sur le max-width du site
  const gridContainer = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

  return (
    <section className="w-full bg-white py-6 md:py-10 font-montserrat">
      {/* WRAPPER DE LA GRILLE */}
      <div className={gridContainer}>
        
        {/* INNER BOX : Fond gris identique aux autres sections */}
        <div 
          className="rounded-sm overflow-hidden py-10 sm:py-14 lg:py-20 shadow-inner"
          style={{
            backgroundColor: 'hsl(0, 0%, 100%)' // Gris secondaire cohérent
          }}
        >
          <div className="whitespace-nowrap flex items-center gap-12 sm:gap-16 lg:gap-24 animate-marquee hover:pause">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="text-[48px] sm:text-[72px] lg:text-[96px] xl:text-[115px] font-black tracking-tighter inline-block transition-transform duration-500 hover:scale-105"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  color: data?.color ?? '#1a1a1a',
                  animation: `reveal-text 1s cubic-bezier(0.2, 1, 0.3, 1) ${i * 0.1}s both`
                }}
              >
                {data?.text ?? ''} <span className="ml-8 text-[#FF1B7C]">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style>
        {`
          @keyframes reveal-text {
            0% {
              opacity: 0;
              transform: translateY(30px) skewY(2deg);
            }
            100% {
              opacity: 1;
              transform: translateY(0) skewY(0);
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
          
          .animate-marquee {
            display: flex;
            width: max-content;
            animation: marquee 40s linear infinite;
          }

          .hover\\:pause:hover {
            animation-play-state: paused;
          }

          /* Optimisation pour des mouvements fluides */
          .animate-marquee div {
            will-change: transform;
          }
        `}
      </style>
    </section>
  );
};

/* ================= VIDEO SECTION ================= */
const VideoSection = ({ data }: { data?: any | null }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  
  const galleryImages = data?.galleryImages ?? [bedroom1, bedroom2, bedroom3];
  
  // Déterminer si c'est une vidéo Cloudinary ou YouTube
  const isCloudinaryVideo = data?.videoUrl && data.videoUrl.includes('cloudinary.com');
  
  // COHÉRENCE GRID : 1440px max-width pour l'alignement global
  const gridContainer = "max-w-[1440px] w-full mx-auto px-4 xs:px-5 sm:px-6 md:px-10 lg:px-16 xl:px-20";

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <>
      <section className="w-full bg-white py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20" 
               style={{ fontFamily: "'Montserrat', sans-serif" }}>
        <div className={gridContainer}>
          
          {/* INNER BOX : Le fond gris et les éléments décoratifs sont limités ici */}
          <div className="relative bg-[#E5E5E5] rounded-sm py-10 xs:py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24 
                         px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 overflow-hidden">
            
            {/* Blocs décoratifs alignés aux coins de l'INNER BOX (pas de l'écran) */}
            <div className="absolute top-0 left-0 w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-32 xl:h-32 bg-black z-0" />
            <div className="absolute bottom-0 right-0 w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 xl:w-40 xl:h-40 bg-[#FF1B7C] z-0" />

            {/* Header Text */}
            <div className="text-center mb-8 xs:mb-10 sm:mb-12 md:mb-14 lg:mb-16 relative z-10">
              <h2 
                className="mb-4 xs:mb-5 sm:mb-6 font-bold text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
                         leading-[1.1] sm:leading-[1.05] tracking-tighter uppercase"
                style={{
                  color: 'hsl(0 0% 8%)',
                  fontFamily: "'Montserrat', sans-serif"
                }}
              >
                {data?.title ?? ''}<br />{data?.subtitle ?? ''}
              </h2>
              <p className="text-xs xs:text-sm sm:text-base leading-relaxed max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl 
                          mx-auto text-gray-600 font-medium px-2 xs:px-0"
                 style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {data?.description ?? ''}
              </p>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 xs:gap-5 sm:gap-6 mb-8 xs:mb-10 sm:mb-12 md:mb-14 lg:mb-16 relative z-10">
              
              {/* Main Video Block */}
              <div className="lg:col-span-3 relative aspect-video xs:aspect-[16/10] overflow-hidden rounded-sm group shadow-lg sm:shadow-xl bg-gray-200">
                <img
                  src={data?.mainImage ?? bedroomMain}
                  alt={data?.mainImageAlt ?? 'Chambre luxueuse'}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 
                           transition-all duration-1000 group-hover:scale-105"
                />
                {isCloudinaryVideo && (
                  <VideoPlayer
                    videoUrl={data?.videoUrl}
                    posterImage={data?.mainImage}
                    playButtonSize="large"
                  />
                )}
              </div>

            {/* Side Gallery - DESKTOP (inchangé) */}
            <div className="hidden lg:flex flex-col gap-3 xs:gap-4">
              {galleryImages.map((img: string, idx: number) => (
                <div key={idx} className="flex-1 overflow-hidden rounded-sm shadow-md sm:shadow-lg group">
                  <img
                    src={img}
                    alt={`Vue ${idx}`}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 
                             transition-all duration-700"
                  />
                </div>
              ))}
            </div>

            {/* Mobile Gallery Slider */}
            <div className="lg:hidden relative">
              <div className="relative overflow-hidden rounded-sm">
                <div 
                  ref={sliderRef}
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {galleryImages.map((img, idx) => (
                    <div 
                      key={idx}
                      className="w-full flex-shrink-0"
                    >
                      <div className="mx-1 xs:mx-2 sm:mx-3">
                        <div className="overflow-hidden rounded-sm shadow-md">
                          <img
                            src={img}
                            alt={`Vue ${idx}`}
                            className="w-full h-40 xs:h-44 sm:h-48 md:h-56 object-cover grayscale hover:grayscale-0 
                                     transition-all duration-700"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Navigation buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-2 xs:left-3 sm:left-4 top-1/2 -translate-y-1/2 
                         w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-full bg-black/80 text-white 
                         flex items-center justify-center transition-all duration-300 
                         hover:bg-[#FF1B7C] hover:scale-110 z-20"
                aria-label="Image précédente"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <ChevronLeft className="w-4 h-4 xs:w-5 xs:h-5" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-2 xs:right-3 sm:right-4 top-1/2 -translate-y-1/2 
                         w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-full bg-black/80 text-white 
                         flex items-center justify-center transition-all duration-300 
                         hover:bg-[#FF1B7C] hover:scale-110 z-20"
                aria-label="Image suivante"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <ChevronRight className="w-4 h-4 xs:w-5 xs:h-5" />
              </button>
              
              {/* Dots indicator */}
              <div className="flex justify-center mt-4 xs:mt-5 sm:mt-6 space-x-2">
                {galleryImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                      currentSlide === idx 
                        ? 'bg-black scale-125' 
                        : 'bg-gray-400 hover:bg-gray-600'
                    }`}
                    aria-label={`Aller à l'image ${idx + 1}`}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center relative z-10">
            <Link
              to="/appartement"
              className="bg-black text-white px-6 xs:px-7 sm:px-8 md:px-9 lg:px-10 
                       py-3 xs:py-3.5 sm:py-4 rounded-sm 
                       text-xs xs:text-xs sm:text-[13px] md:text-[13.5px] lg:text-[14px] 
                       font-bold tracking-[0.15em] xs:tracking-[0.17em] sm:tracking-[0.19em] md:tracking-[0.2em]
                       transition-all duration-500 hover:bg-[#FF1B7C] hover:-translate-y-1 shadow-lg
                       min-w-[180px] xs:min-w-[200px] sm:min-w-[220px] md:min-w-[240px] inline-block"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {data?.buttonText ?? ''}
            </Link>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

/* ================= SERVICES SECTION ================= */
const services = [
  {
    image: room1,
    title: "Lorem ipsum dolor sit amet",
    description: "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra."
  },
  {
    image: room2,
    title: "Class aptent taciti sociosqu ad litora",
    description: "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra."
  },
  {
    image: room3,
    title: "Torquent per conubia nostra, per inceptos",
    description: "Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra."
  }
];

const ServicesSection = ({ data }: { data?: any | null }) => {
  // COHÉRENCE GRID : 1440px max-width pour l'alignement global
  const gridContainer = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

  return (
    <section className="w-full py-20 md:py-28 bg-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className={gridContainer}>
        
        {/* Section Title - Impact visuel aligné sur la grille */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tighter mb-6"
            style={{
              color: 'hsl(0 0% 10%)',
              fontFamily: "'Montserrat', sans-serif"
            }}
          >
            {data?.title ?? ''}<br />{data?.subtitle ?? ''}
          </h2>
          <div className="w-20 h-1 bg-[#FF1B7C] mx-auto"></div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 mb-20">
          {(data?.services ?? services).map((service: any, index: number) => (
            <div key={index} className="group flex flex-col items-start">
              {/* Image avec effet de cadre luxury */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm mb-8 bg-gray-100 shadow-sm">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                />
                {/* Overlay discret au survol */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              </div>
              
              {/* Content */}
              <h3 
                className="mb-4 font-bold text-xl md:text-2xl leading-tight tracking-tight"
                style={{
                  color: 'hsl(0 0% 10%)',
                  fontFamily: "'Montserrat', sans-serif"
                }}
              >
                {service.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500 font-medium border-l-2 border-black/10 pl-6"
                 style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            to="/appartement"
            className="px-12 py-5 rounded-sm text-[12px] font-bold  tracking-[0.2em] transition-all duration-500 shadow-xl hover:-translate-y-1 inline-block"
            style={{
              backgroundColor: '#FF1B7C',
              color: 'white',
              fontFamily: "'Montserrat', sans-serif"
            }}
          >
            {data?.buttonText ?? ''}
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ================= FEATURES SECTION ================= */
const features = [
  {
    icon: Sofa,
    title: "Rorem ipsum dolor sit amet"
  },
  {
    icon: Home,
    title: "Rorem ipsum dolor sit amet"
  }
];

const FeaturesSection = ({ data }: { data?: any | null }) => {
  // COHÉRENCE HERO/FOOTER : Grid de 1440px
  const gridContainer = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

  return (
    <section className="w-full bg-white py-12 md:py-20" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {/* WRAPPER DE LA GRILLE (Marges extérieures pour Full HD) */}
      <div className={gridContainer}>
        
        {/* INNER BOX (Le fond gris délimité) */}
        <div className="bg-[#DEDEDE] rounded-sm py-16 md:py-24 px-6 md:px-12 lg:px-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-center">
            
            {/* 1. Colonne Gauche - Titre & Features */}
            <div className="space-y-10">
              <h2 
                className="text-4xl md:text-5xl font-bold leading-[1] tracking-tighter uppercase"
                style={{
                  color: 'hsl(0 0% 10%)',
                  fontFamily: "'Montserrat', sans-serif"
                }}
              >
                {data?.title?.split('\n').map((l: string, idx: number) => (<span key={idx}>{l}<br/></span>))}
              </h2>
              
              <div className="space-y-4">
                {(data?.features ?? features).map((feature: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-5 p-5 rounded-sm bg-white shadow-sm transition-transform hover:translate-x-2 duration-300"
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-black">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-tight text-black"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {feature.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Colonne Centrale - Image Principale */}
            <div className="aspect-[3/4] overflow-hidden rounded-sm shadow-2xl relative group">
              <img
                src={data?.mainImage ?? livingMain}
                alt="Salon moderne"
                className="w-full h-full object-cover transition-all duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-110"
              />
              {/* Overlay subtil pour le look luxury */}
              <div className="absolute inset-0 border-[15px] border-white/10 pointer-events-none" />
            </div>

            {/* 3. Colonne Droite - Description & Miniatures */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 
                  className="text-2xl md:text-3xl font-bold leading-tight uppercase tracking-tight"
                  style={{
                    color: 'hsl(0 0% 10%)',
                    fontFamily: "'Montserrat', sans-serif"
                  }}
                >
                  {data?.subtitle?.split('\n').map((l: string, idx: number) => (<span key={idx}>{l}<br/></span>))}
                </h3>
                
                <p className="text-sm leading-relaxed text-gray-600 font-medium"
                   style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {data?.description ?? ''}
                </p>
              </div>
              
              <div className="flex gap-4">
                <div className="w-1/2 aspect-square overflow-hidden rounded-sm shadow-lg group">
                  <img
                    src={(data?.thumbnails && data.thumbnails[0]) ?? thumb1}
                    alt="Intérieur"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div className="w-1/2 aspect-square overflow-hidden rounded-sm shadow-lg group">
                  <img
                    src={(data?.thumbnails && data.thumbnails[1]) ?? thumb2}
                    alt="Chambre"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ================= PROPERTY CARD ================= */
const PropertyCard = ({
  image,
  title,
  price,
  priceUnit,
  features,
  description,
  buttonText
}: {
  image: string;
  title: string;
  price: number;
  priceUnit: string;
  features: { icon: React.ReactNode; label: string }[];
  description: string;
  buttonText?: string;
}) => {
  const [buttonHover, setButtonHover] = useState(false);
  const [featureHoverIndex, setFeatureHoverIndex] = useState<number | null>(null);
  const [diamondHover, setDiamondHover] = useState(false);

  return (
    <div 
      className="flex flex-col md:flex-row overflow-hidden rounded-2xl max-w-4xl mx-auto"
      style={{
        backgroundColor: 'hsl(0 0% 6%)',
        borderRadius: '0.75rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}
    >
      {/* Image Section */}
      <div className="md:w-1/2 h-64 md:h-auto">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h2 
            className="text-xl md:text-2xl italic mb-4 leading-tight"
            style={{
              color: 'hsl(0 0% 98%)',
              fontFamily: "'Montserrat', sans-serif",
              fontStyle: 'normal'
            }}
          >
            {title}
          </h2>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-6">
            <span 
              className="text-4xl md:text-5xl font-bold"
              style={{
                color: 'hsl(0 0% 98%)',
                fontFamily: "'Montserrat', sans-serif"
              }}
            >
              {price}€
            </span>
            <span 
              className="text-lg"
              style={{
                color: 'hsl(0 0% 65%)',
                fontFamily: "'Montserrat', sans-serif"
              }}
            >
              / {priceUnit}
            </span>
          </div>

          {/* CTA Button */}
          <button 
            className="w-full font-medium py-3.5 px-6 rounded-full transition-all duration-300 mb-6"
            style={{
              backgroundColor: buttonHover ? 'hsla(340, 100%, 59%, 0.9)' : 'hsl(340 100% 59%)',
              color: 'hsl(0 0% 100%)',
              borderRadius: '9999px',
              transform: buttonHover ? 'scale(1.02)' : 'scale(1)',
              fontFamily: "'Montserrat', sans-serif"
            }}
            onMouseEnter={() => setButtonHover(true)}
            onMouseLeave={() => setButtonHover(false)}
          >
            {buttonText ?? ''}
          </button>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-6">
            {features.map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors"
                style={{
                  border: `1px solid ${featureHoverIndex === index ? 'hsla(340, 100%, 59%, 0.5)' : 'hsl(0 0% 20%)'}`,
                  color: 'hsl(0 0% 65%)',
                  borderRadius: '9999px',
                  fontFamily: "'Montserrat', sans-serif"
                }}
                onMouseEnter={() => setFeatureHoverIndex(index)}
                onMouseLeave={() => setFeatureHoverIndex(null)}
              >
                {feature.icon}
                {feature.label}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div 
          className="flex items-center justify-between pt-4"
          style={{
            borderTop: '1px solid hsl(0 0% 20%)'
          }}
        >
          <p 
            className="text-sm"
            style={{
              color: 'hsl(0 0% 65%)',
              fontFamily: "'Montserrat', sans-serif"
            }}
          >
            {description}
          </p>
          <button 
            className="p-2 rounded-full transition-colors"
            style={{
              border: `1px solid ${diamondHover ? 'hsl(340 100% 59%)' : 'hsl(0 0% 20%)'}`,
              borderRadius: '9999px'
            }}
            onMouseEnter={() => setDiamondHover(true)}
            onMouseLeave={() => setDiamondHover(false)}
          >
            <Diamond 
              className="w-5 h-5 transition-colors"
              style={{
                color: diamondHover ? 'hsl(340 100% 59%)' : 'hsl(0 0% 65%)'
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= STATS BAR ================= */
const StatsBar = ({ stats }: { stats: { value: string; label: string }[] }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<string[]>([]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRefs = useRef<number[]>([]);
  const hasTriggeredAnimation = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    const initialValues = stats.map(stat => {
      const match = stat.value.match(/^([^0-9]*)([\d,.]+)([^0-9]*)$/);
      
      if (match) {
        const [, prefix, numberStr, suffix] = match;
        return `${prefix}0${suffix}`;
      }
      
      return stat.value;
    });
    setAnimatedValues(initialValues);

    return () => {
      clearTimeout(timer);
      animationRefs.current.forEach(id => cancelAnimationFrame(id));
      animationRefs.current = [];
    };
  }, [stats]);

  const startNumberAnimations = () => {
    if (hasTriggeredAnimation.current) return;
    hasTriggeredAnimation.current = true;
    
    setHasAnimated(true);
    
    stats.forEach((stat, index) => {
      const match = stat.value.match(/^([^0-9]*)([\d,.]+)([^0-9]*)$/);
      
      if (match) {
        const [, prefix, numberStr, suffix] = match;
        
        let multiplier = 1;
        let displaySuffix = suffix;
        
        if (suffix.toLowerCase().includes('k')) {
          multiplier = 1000;
          displaySuffix = suffix.replace(/k/gi, '');
        }
        
        const cleanNumberStr = numberStr.replace(/,/g, '');
        const numericValue = parseFloat(cleanNumberStr) * multiplier;
        
        const duration = 2000;
        const startTime = Date.now();
        const startValue = 0;
        
        const animate = () => {
          const currentTime = Date.now();
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          const currentValue = Math.floor(startValue + (numericValue - startValue) * easeOutQuart);
          
          let displayValue = currentValue.toString();
          
          if (multiplier === 1000 && currentValue >= 1000) {
            displayValue = (currentValue / 1000).toFixed(1).replace('.0', '');
            displaySuffix = suffix;
          }
          
          const formattedValue = `${prefix}${displayValue}${displaySuffix}`;
          
          setAnimatedValues(prev => {
            const newValues = [...prev];
            newValues[index] = formattedValue;
            return newValues;
          });
          
          if (progress < 1) {
            const animationId = requestAnimationFrame(animate);
            animationRefs.current[index] = animationId;
          } else {
            setAnimatedValues(prev => {
              const newValues = [...prev];
              newValues[index] = stat.value;
              return newValues;
            });
          }
        };
        
        setTimeout(() => {
          const animationId = requestAnimationFrame(animate);
          animationRefs.current[index] = animationId;
        }, index * 150);
      } else {
        setAnimatedValues(prev => {
          const newValues = [...prev];
          newValues[index] = stat.value;
          return newValues;
        });
      }
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || hasTriggeredAnimation.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const triggerPoint = windowHeight * 0.6;
      
      if (rect.top < triggerPoint && rect.bottom > 0) {
        setIsVisible(true);
        startNumberAnimations();
        window.removeEventListener('scroll', handleScroll);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasTriggeredAnimation.current) {
            setIsVisible(true);
            setTimeout(() => {
              startNumberAnimations();
            }, 300);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-50px 0px -100px 0px'
      }
    );

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    setTimeout(() => {
      handleScroll();
    }, 500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="rounded-2xl py-8 px-6 md:px-12 max-w-4xl mx-auto shadow-2xl"
      style={{
        backgroundColor: 'hsl(0 0% 6%)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        transform: 'translateY(20px)',
        opacity: 0,
        animation: isVisible ? 'slideUpFadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'none',
        fontFamily: "'Montserrat', sans-serif"
      }}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="text-center"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
              transition: `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 100}ms, 
                         transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 100}ms`
            }}
          >
            <div className="relative inline-block mb-2">
              <span 
                className="text-3xl md:text-5xl font-bold"
                style={{
                  color: 'hsl(0 0% 100%)',
                  fontFamily: "'Montserrat', sans-serif",
                  display: 'inline-block',
                  minWidth: '50px'
                }}
              >
                {animatedValues[index] || stat.value}
              </span>
              <div 
                className="absolute -bottom-1 left-0 right-0 h-0.5"
                style={{
                  backgroundColor: 'hsl(340 100% 59%)',
                  transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: `transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${(index * 100) + 300}ms`
                }}
              />
            </div>
            <p 
              className="text-sm mt-3"
              style={{
                color: 'hsl(0 0% 65%)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                transition: `opacity 0.5s ease-out ${(index * 100) + 400}ms, 
                           transform 0.5s ease-out ${(index * 100) + 400}ms`,
                fontFamily: "'Montserrat', sans-serif"
              }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>
      
      <style jsx global>{`
        @keyframes slideUpFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        .hover-pulse:hover {
          animation: pulse 0.3s ease-in-out;
        }
      `}</style>
      
      <style jsx>{`
        .text-center:hover span {
          transform: scale(1.05);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

/* ================= STATS SECTION ================= */
const StatsSection = ({ data }: { data?: any | null }) => {
  // COHÉRENCE GRID : Même max-width et paddings que le Hero, la Navbar et le Footer
  const gridContainer = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

  const propertyFeatures = data?.propertyFeatures ?? [
    { icon: <Wifi className="w-4 h-4" />, label: "Wifi" },
    { icon: <Bed className="w-4 h-4" />, label: "4 chambres à coucher" },
    { icon: <TreePine className="w-4 h-4" />, label: "Terrasse" },
    { icon: <Car className="w-4 h-4" />, label: "Garage" },
    { icon: <Waves className="w-4 h-4" />, label: "Piscine" },
  ];

  const stats = data?.stats ?? [
    { value: "+15", label: "Lorem ispum dolor" },
    { value: "+20", label: "Class aptent taciti" },
    { value: "+2K", label: "Customer lorem dolor" },
    { value: "100%", label: "Guarantees apdent elit" },
  ];

  return (
    <section className="w-full bg-white py-16 md:py-24 font-montserrat">
      <div className={gridContainer}>

        {/* Espace de présentation de la carte */}
        <div className="flex justify-center mb-24 lg:mb-32">
          <div className="w-full lg:max-w-[1100px] transition-transform duration-700 hover:scale-[1.01]">
            <PropertyCard
              image={data?.propertyCard?.image ?? propertyImage}
              title={data?.propertyCard?.title ?? 'Per conubia nostra, per inceptos himenaeos'}
              price={data?.propertyCard?.price ?? 600}
              priceUnit={data?.propertyCard?.priceUnit ?? 'Nuit'}
              features={data?.propertyCard?.features ?? propertyFeatures}
              description={data?.propertyCard?.description ?? ''}
              buttonText={data?.propertyCard?.buttonText ?? ''}
            />
          </div>
        </div>

        {/* Barre de Statistiques - On l'encapsule dans un bloc stylisé */}
        <div className="relative">
          {/* Un petit rappel de couleur en fond pour dynamiser la barre */}
          <div className="absolute inset-0 bg-[#F3F3F3] -rotate-1 transform scale-105 rounded-sm -z-10 opacity-50 hidden md:block" />
          
          <div className="bg-white py-12 px-6 shadow-xl border border-gray-100 rounded-sm">
            <StatsBar stats={stats} />
          </div>
        </div>
      </div>
    </section>
  );
};

/* ================= LOGO SECTION ================= */
function LogoSection({ data }: { data?: any | null }) {
  const logos = data?.logos ?? [
    { name: "Logoipsum 1", image: logo1 },
    { name: "Logoipsum 2", image: logo2 },
    { name: "Logoipsum 3", image: logo3 },
    { name: "Logoipsum 4", image: logo4 },
    { name: "Logoipsum 5", image: logo5 },
    { name: "Logoipsum 6", image: logo6 },
    { name: "Logoipsum 7", image: logo7 },
    { name: "Logoipsum 8", image: logo8 }
  ];

  // COHÉRENCE GRID : 1440px max-width pour s'aligner sur le reste du site
  const gridContainer = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

  return (
    <section className="bg-white py-16 md:py-24" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className={gridContainer}>
        
        {/* INNER BOX (Le fond gris clair structuré) */}
        <div className={`rounded-sm py-16 md:py-24 px-6 md:px-12 lg:px-16`} style={{ backgroundColor: data?.backgroundColor ?? '#F3F3F3' }}>
          
          {/* Header Section */}
          <div className="text-center mb-16 max-w-[800px] mx-auto">
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-8 leading-[0.9] uppercase tracking-tighter"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {data?.title ?? 'Elit amet, consectetur'}
            </h2>

            <p className="text-sm md:text-base leading-relaxed text-gray-600 font-medium"
               style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {data?.description ?? ''}
            </p>
          </div>

          {/* Logos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {logos.map((item, index) => (
              <div
                key={index}
                className="group bg-white h-[120px] lg:h-[150px] flex items-center justify-center transition-all duration-500 hover:bg-[#FF1493]"
              >
                <div className="flex items-center justify-center p-6">
                  <img 
                    src={item.image ?? (item.logo as string)} 
                    alt={item.name}
                    className="max-w-full max-h-[50px] object-contain transition-all duration-500 group-hover:invert group-hover:scale-110"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= THREE CARDS SECTION ================= */
function ThreeCardsSection({ data }: { data?: any | null }) {
  // COHÉRENCE GRID : 1440px pour l'alignement parfait avec les sections supérieures
  const gridContainer = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

  return (
    <section className="bg-white py-16 md:py-24" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className={gridContainer}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {(data?.cards ?? []).map((card: any, idx: number) => (
            <div key={idx} className={`rounded-sm p-10 lg:p-12 flex flex-col justify-between min-h-[450px] transition-transform duration-500 hover:-translate-y-2 ${card.backgroundColor === '#000000' ? 'bg-black text-white shadow-2xl relative overflow-hidden' : card.backgroundColor === '#FFFFFF' ? 'bg-white border border-gray-200' : 'bg-[#F3F3F3]'}`}>
              {card.icon && (
                <div className="absolute top-10 right-10">
                  <div className="w-14 h-14 bg-[#FF1B7C] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <Diamond className="w-6 h-6 text-white" fill="currentColor" />
                  </div>
                </div>
              )}

              <div>
                <h3 className={`text-[28px] lg:text-[32px] font-bold ${card.textColor === '#FFFFFF' ? 'text-white' : 'text-black'} leading-tight uppercase tracking-tighter mb-6`} style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {card.title.split('\n').map((l: string, i: number) => (<span key={i}>{l}<br/></span>))}
                </h3>

                <p className={`text-sm leading-relaxed ${card.textColor === '#FFFFFF' ? 'text-gray-300' : 'text-gray-500'} mb-10 font-medium`} style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {card.description}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-8">
                <h4 className="text-[18px] lg:text-[20px] font-bold text-black leading-tight  tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {card.subtitle || ''}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= MAIN INDEX PAGE ================= */
const Index = () => {
  const [homeData, setHomeData] = useState<HomePageData | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const data = await homeApi.getHomePage();
        if (mounted) setHomeData(data as HomePageData);
      } catch (err) {
        console.error('Failed to load home page in Index:', err);
      }
    };

    fetchData();

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'home_updated') {
        fetchData();
      }
    };

    const onVisibility = () => {
      if (!document.hidden) fetchData();
    };

    const onFocus = () => fetchData();

    window.addEventListener('storage', onStorage);
    window.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', onFocus);

    return () => {
      mounted = false;
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  return (
    <main className="relative bg-white min-h-screen overflow-x-hidden">
      {/* ----- PLAQUE GRISE DÉCORATIVE ----- */}
      <div className="absolute 
        top-0             /* Commence tout en haut (derrière Navbar) */
        right-[8%]           /* Alignée à droite */
        w-[44%]           /* Largeur de la plaque */
        h-[730px]         /* Hauteur : elle descend jusque sous le collage */
        bg-[#E5E7EB]      /* Couleur grise */
        hidden lg:block   /* Visible uniquement sur grand écran */
        z-0"              /* Niveau 0 : elle est au fond */
      />
      
      {/* ----- CONTENU (NAVBAR + HERO) ----- */}
      <div className="relative z-10"> {/* z-10 : passe devant la plaque grise */}
        <Navbar />
        <HeroSection data={homeData?.heroSection} />
      </div>

      {/* Reste du site */}
      <div className="relative z-20 bg-white">
        <WelcomeSection data={homeData?.welcomeSection} />
        <MarqueeSection data={homeData?.marqueeSection} />
        <DestinationSearch data={homeData?.destinationSearch} />
        <FeatureRoom data={homeData?.featureRoom} />
        <MarqueeBlackSection data={homeData?.marqueeBlackSection} />
        <VideoSection data={homeData?.videoSection} />
        <ServicesSection data={homeData?.servicesSection} />
        <FeaturesSection data={homeData?.featuresSection} />
        <StatsSection data={homeData?.statsSection} />
        <LogoSection data={homeData?.logoSection} />
        <ThreeCardsSection data={homeData?.threeCardsSection} />
        <Footer />
      </div>
    </main>
  );
};

export default Index;