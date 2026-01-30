import React, { useState, useEffect } from 'react';
import { homeApi } from '@/services/homeApi';
import VideoUploader from '@/components/admin/VideoUploader';
import { 
  Save, Upload, Image as ImageIcon, Trash2, Plus, 
  Eye, EyeOff, MoveUp, MoveDown, Settings, Palette,
  Mail, Phone, MessageSquare, User, Type, Layout,
  ChevronDown, ChevronUp, Home as HomeIcon, Video,
  Play, Search, CalendarDays, Users, Map, Sofa,
  Bed, TreePine, Car, Waves, Diamond, Wifi,
  Info, AlertCircle, Tag, DollarSign, Star,
  Grid3x3, FileText, Heading, Image, List,
  Box, Palette as PaletteIcon, TextCursor,
  Film, Sliders, Target, Globe, Zap,
  Copy, Edit3, Hash, Percent, BarChart3
} from 'lucide-react';

// Types pour la page Home
interface HeroSectionData {
  mainTitle: {
    line1: string;
    line2: string;
    line3: string;
  };
  description: string;
  buttonText: string;
  testimonial: {
    image: string;
    title: string;
    subtitle: string;
  };
  images: {
    main: string;
    secondary: string;
    bedroom: string;
  };
  accentColor: string;
}

interface WelcomeSectionData {
  videoImage: string;
  videoUrl: string; // YouTube URL
  image1: string;
  image2: string;
  title: string;
  description: string;
  features: {
    feature1: string;
    feature2: string;
  };
  buttonText: string;
}

interface MarqueeSectionData {
  text: string;
  color: string;
  backgroundColor: string;
}

interface DestinationSearchData {
  title: string;
  description: string;
  images: {
    small: string;
    main: string;
  };
  rotatingText?: string;
  formLabels: {
    destination: string;
    date: string;
    travelers: string;
    button: string;
  };
}

interface FeatureRoomFeature {
  icon: string;
  title: string;
  description: string;
  backgroundColor: string;
}

interface FeatureRoomData {
  title: string;
  subtitle: string;
  description: string;
  features: FeatureRoomFeature[];
  images: {
    bedroom: string;
    living: string;
  };
}

interface VideoSectionData {
  title: string;
  description: string;
  mainImage: string;
  videoUrl: string; // YouTube URL
  galleryImages: string[];
  buttonText: string;
  accentColor: string;
}

interface Service {
  image: string;
  title: string;
  description: string;
}

interface ServicesSectionData {
  title: string;
  services: Service[];
  buttonText: string;
}

interface Feature {
  icon: string;
  title: string;
}

interface FeaturesSectionData {
  title: string;
  features: Feature[];
  mainImage: string;
  thumbnails: string[];
  description: string;
  subtitle: string;
  backgroundColor: string;
}

interface PropertyFeature {
  icon: string;
  label: string;
}

interface PropertyCardData {
  image: string;
  title: string;
  price: number;
  priceUnit: string;
  features: PropertyFeature[];
  description: string;
  buttonText: string;
}

interface Stat {
  value: string;
  label: string;
}

interface StatsSectionData {
  propertyCard: PropertyCardData;
  stats: Stat[];
}

interface Logo {
  name: string;
  image: string;
}

interface LogoSectionData {
  title: string;
  description: string;
  logos: Logo[];
  backgroundColor: string;
}

interface Card {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  backgroundColor: string;
  textColor: string;
  icon?: string;
}

interface ThreeCardsSectionData {
  cards: Card[];
}

interface HomePageData {
  heroSection: HeroSectionData;
  welcomeSection: WelcomeSectionData;
  marqueeSection: MarqueeSectionData;
  destinationSearch: DestinationSearchData;
  featureRoom: FeatureRoomData;
  marqueeBlackSection: MarqueeSectionData;
  videoSection: VideoSectionData;
  servicesSection: ServicesSectionData;
  featuresSection: FeaturesSectionData;
  statsSection: StatsSectionData;
  logoSection: LogoSectionData;
  threeCardsSection: ThreeCardsSectionData;
}

const HomeEditor: React.FC = () => {
  const [activeSection, setActiveSection] = useState<
    'hero' | 'welcome' | 'marquee' | 'destination' | 
    'featureRoom' | 'marqueeBlack' | 'video' | 'services' | 
    'features' | 'stats' | 'logos' | 'cards'
  >('hero');
  
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Données initiales complètes
  const [pageData, setPageData] = useState<HomePageData>({
    heroSection: {
      mainTitle: {
        line1: 'Lorem',
        line2: 'Ipsum',
        line3: 'Dolor Sit'
      },
      description: 'Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
      buttonText: 'Réserver',
      testimonial: {
        image: 'https://images.pexels.com/photos/3777570/pexels-photo-3777570.jpeg?auto=compress&cs=tinysrgb&w=200',
        title: 'Lorem ipsum dolor sit amet',
        subtitle: 'Korem ipsum dolor sit amet, consectetur adipiscing elit.'
      },
      images: {
        main: '/assets/image-principale-hero.png',
        secondary: '/assets/Image-Grise-hero.png',
        bedroom: '/assets/Image-Lit-hero.png'
      },
      accentColor: '#FF1B7C'
    },
    welcomeSection: {
      videoImage: '/assets/video-bg-welcome.png',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Default YouTube URL
      image1: '/assets/photo-welcome1.png',
      image2: '/assets/photo-welcome2.png',
      title: 'Welcome to lorem consectetur',
      description: 'Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra.',
      features: {
        feature1: 'Luxe & Confort',
        feature2: 'Service Premium'
      },
      buttonText: 'Faire une réservation'
    },
    marqueeSection: {
      text: 'Lorem ipsum dolor •',
      color: 'hsla(0, 0%, 10%, 0.15)',
      backgroundColor: 'hsl(0 0% 98%)'
    },
    destinationSearch: {
      title: 'Sit amet, consectetur adipiscing elit.',
      description: 'Consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
      rotatingText: 'LOREM IPSUM • LOREM IPSUM • LOREM IPSUM •',
      images: {
        small: '/assets/left-photo-destination.png',
        main: '/assets/vertical-photo-destination.png'
      },
      formLabels: {
        destination: 'Votre destination',
        date: 'Date',
        travelers: 'Voyageur',
        button: 'Rechercher'
      }
    },
    featureRoom: {
      title: 'Adipiscing Elit Amet Consectetur',
      subtitle: 'Adipiscing Elit Amet Consectetur',
      description: 'Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
      features: [
        {
          icon: 'Home',
          title: 'Lorem ipsum dolor sit amet',
          description: 'Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
          backgroundColor: '#1a1a1a'
        },
        {
          icon: 'Home',
          title: 'Nunc vulputate libero et velit',
          description: 'Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
          backgroundColor: '#F5F5F5'
        }
      ],
      images: {
        bedroom: '/assets/horizontal-photo-room.png',
        living: '/assets/square-photo-room.png'
      }
    },
    marqueeBlackSection: {
      text: 'Lorem ipsum dolor •',
      color: '#1a1a1a',
      backgroundColor: '#FFFFFF'
    },
    videoSection: {
      title: 'Adipiscing elit amet, consectetur.',
      description: 'Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra.',
      mainImage: '/assets/bedroom-main.png',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Default YouTube URL
      galleryImages: [
        '/assets/image-above.png',
        '/assets/image-center.png',
        '/assets/image-below.png'
      ],
      buttonText: 'Réserver maintenant',
      accentColor: '#FF1B7C'
    },
    servicesSection: {
      title: 'Adipiscing elit amet, consectetur.',
      services: [
        {
          image: '/assets/photo-serivece-1.png',
          title: 'Lorem ipsum dolor sit amet',
          description: 'Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra.'
        },
        {
          image: '/assets/photo-service-2.png',
          title: 'Class aptent taciti sociosqu ad litora',
          description: 'Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra.'
        },
        {
          image: '/assets/photo-service-3.png',
          title: 'Torquent per conubia nostra, per inceptos',
          description: 'Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra.'
        }
      ],
      buttonText: 'Réserver maintenant'
    },
    featuresSection: {
      title: 'Elit amet consectetur',
      features: [
        {
          icon: 'Sofa',
          title: 'Rorem ipsum dolor sit amet'
        },
        {
          icon: 'Home',
          title: 'Rorem ipsum dolor sit amet'
        }
      ],
      mainImage: '/assets/b-photo-center-feature.png',
      thumbnails: [
        '/assets/s-photo-feature-1.png',
        '/assets/s-photo-feature-2.png'
      ],
      description: 'Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra.',
      subtitle: 'Aptent taciti sociosqu ad litora',
      backgroundColor: '#DEDEDE'
    },
    statsSection: {
      propertyCard: {
        image: '/assets/image-card-property.png',
        title: 'Per conubia nostra, per inceptos himenaeos',
        price: 600,
        priceUnit: 'Nuit',
        features: [
          { icon: 'Wifi', label: 'Wifi' },
          { icon: 'Bed', label: '4 chambres à coucher' },
          { icon: 'TreePine', label: 'Terrasse' },
          { icon: 'Car', label: 'Garage' },
          { icon: 'Waves', label: 'Piscine' }
        ],
        description: 'Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra.',
        buttonText: 'Reserver maintenant'
      },
      stats: [
        { value: '+15', label: 'Lorem ispum dolor' },
        { value: '+20', label: 'Class aptent taciti' },
        { value: '+2K', label: 'Customer lorem dolor' },
        { value: '100%', label: 'Guarantees apdent elit' }
      ]
    },
    logoSection: {
      title: 'Elit amet, consectetur',
      description: 'Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra.',
      logos: [
        { name: 'Logoipsum 1', image: '/assets/p-logo1.png' },
        { name: 'Logoipsum 2', image: '/assets/p-logo2.png' },
        { name: 'Logoipsum 3', image: '/assets/p-logo3.png' },
        { name: 'Logoipsum 4', image: '/assets/p-logo4.png' },
        { name: 'Logoipsum 5', image: '/assets/p-logo5.png' },
        { name: 'Logoipsum 6', image: '/assets/p-logo6.png' },
        { name: 'Logoipsum 7', image: '/assets/p-logo7.png' },
        { name: 'Logoipsum 8', image: '/assets/p-logo8.png' }
      ],
      backgroundColor: '#F3F3F3'
    },
    threeCardsSection: {
      cards: [
        {
          title: 'Sorem ipsum dolor sit amet',
          subtitle: 'Origine',
          description: 'Class aptent taciti socios quad litora torquent.',
          buttonText: '',
          backgroundColor: '#F3F3F3',
          textColor: '#000000'
        },
        {
          title: 'Sit amet, consectetur elit.',
          subtitle: '',
          description: 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
          buttonText: 'Réserver maintenant',
          backgroundColor: '#000000',
          textColor: '#FFFFFF'
        },
        {
          title: 'Inceptos himenaeos.',
          subtitle: '',
          description: 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
          buttonText: '',
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
          icon: 'Diamond'
        }
      ]
    }
  });

  // Charger les données depuis l'API
  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchPageData = async () => {
    try {
      const data = await homeApi.getHomePage();
      setPageData(data as any);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      await homeApi.updateHomePage(pageData as any);
      setSaveMessage('✅ Page sauvegardée avec succès!');
      // Notify other tabs (public page) that home page changed
      try {
        localStorage.setItem('home_updated', Date.now().toString());
      } catch (e) {
        // ignore
      }
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage('❌ Erreur lors de la sauvegarde');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, section: keyof HomePageData, nestedPath?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      
      if (nestedPath) {
        // Pour les chemins imbriqués comme heroSection.images.main
        const pathParts = nestedPath.split('.');
        setPageData(prev => {
          const newData = { ...prev };
          let current: any = newData[section];
          
          for (let i = 0; i < pathParts.length - 1; i++) {
            current = current[pathParts[i]];
          }
          
          current[pathParts[pathParts.length - 1]] = imageUrl;
          return newData;
        });
      } else {
        setPageData(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            [field]: imageUrl
          }
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const addGalleryImage = (section: keyof HomePageData, field: string) => {
    setPageData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...(prev[section] as any)[field], '/assets/new-image.png']
      }
    }));
  };

  const removeGalleryImage = (section: keyof HomePageData, field: string, index: number) => {
    setPageData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: (prev[section] as any)[field].filter((_: any, i: number) => i !== index)
      }
    }));
  };

  const addService = () => {
    const newService: Service = {
      image: '/assets/new-service.png',
      title: 'Nouveau service',
      description: 'Description du nouveau service...'
    };

    setPageData(prev => ({
      ...prev,
      servicesSection: {
        ...prev.servicesSection,
        services: [...prev.servicesSection.services, newService]
      }
    }));
  };

  const removeService = (index: number) => {
    setPageData(prev => ({
      ...prev,
      servicesSection: {
        ...prev.servicesSection,
        services: prev.servicesSection.services.filter((_, i) => i !== index)
      }
    }));
  };

  const addLogo = () => {
    const newLogo: Logo = {
      name: 'Nouveau logo',
      image: '/assets/new-logo.png'
    };

    setPageData(prev => ({
      ...prev,
      logoSection: {
        ...prev.logoSection,
        logos: [...prev.logoSection.logos, newLogo]
      }
    }));
  };

  const removeLogo = (index: number) => {
    setPageData(prev => ({
      ...prev,
      logoSection: {
        ...prev.logoSection,
        logos: prev.logoSection.logos.filter((_, i) => i !== index)
      }
    }));
  };

  const addCard = () => {
    const newCard: Card = {
      title: 'Nouvelle carte',
      subtitle: '',
      description: 'Description de la nouvelle carte...',
      buttonText: '',
      backgroundColor: '#FFFFFF',
      textColor: '#000000'
    };

    setPageData(prev => ({
      ...prev,
      threeCardsSection: {
        ...prev.threeCardsSection,
        cards: [...prev.threeCardsSection.cards, newCard]
      }
    }));
  };

  const removeCard = (index: number) => {
    setPageData(prev => ({
      ...prev,
      threeCardsSection: {
        ...prev.threeCardsSection,
        cards: prev.threeCardsSection.cards.filter((_: any, i: number) => i !== index)
      }
    }));
  };

  const addFeature = () => {
    const newFeature = { icon: 'Sofa', title: 'Nouvelle feature' };

    setPageData(prev => ({
      ...prev,
      featuresSection: {
        ...prev.featuresSection,
        features: [...prev.featuresSection.features, newFeature]
      }
    }));
  };

  const removeFeature = (index: number) => {
    setPageData(prev => ({
      ...prev,
      featuresSection: {
        ...prev.featuresSection,
        features: prev.featuresSection.features.filter((_: any, i: number) => i !== index)
      }
    }));
  };

  const addStat = () => {
    const newStat: Stat = {
      value: 'Nouveau',
      label: 'Description'
    };

    setPageData(prev => ({
      ...prev,
      statsSection: {
        ...prev.statsSection,
        stats: [...prev.statsSection.stats, newStat]
      }
    }));
  };

  const removeStat = (index: number) => {
    setPageData(prev => ({
      ...prev,
      statsSection: {
        ...prev.statsSection,
        stats: prev.statsSection.stats.filter((_, i) => i !== index)
      }
    }));
  };

  const moveItem = (array: any[], index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= array.length) return array;
    
    const newArray = [...array];
    [newArray[index], newArray[newIndex]] = [newArray[newIndex], newArray[index]];
    return newArray;
  };

  // Composant d'aperçu
  const Preview = () => (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Aperçu de la page d'accueil</h2>
          <button
            onClick={() => setIsPreview(false)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Quitter l'aperçu
          </button>
        </div>
        
        {/* Aperçu de la Hero Section */}
        <div className="bg-gray-100 rounded-2xl p-8 mb-6">
          <h1 className="text-4xl font-black uppercase mb-4">
            {pageData.heroSection.mainTitle.line1}<br />
            {pageData.heroSection.mainTitle.line2}<br />
            {pageData.heroSection.mainTitle.line3}
          </h1>
          <p className="text-gray-600 mb-4">{pageData.heroSection.description}</p>
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-lg overflow-hidden">
              <img 
                src={pageData.heroSection.images.main} 
                alt="Main" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-24 h-24 rounded-lg overflow-hidden">
              <img 
                src={pageData.heroSection.images.secondary} 
                alt="Secondary" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Composant d'information pour les sauts de ligne
  const LineBreakInfo = ({ fieldName }: { fieldName: string }) => (
    <div className="flex items-start gap-2 mt-1 text-xs text-gray-500 bg-blue-50 p-2 rounded">
      <Info size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-medium">Sauts de ligne pour {fieldName}:</p>
        <p>• Utilisez <code className="bg-gray-100 px-1 py-0.5 rounded">Alt+Entrée</code> pour aller à la ligne</p>
        <p>• Ou tapez <code className="bg-gray-100 px-1 py-0.5 rounded">\n</code> pour un saut de ligne automatique</p>
      </div>
    </div>
  );

  // Composant pour l'édition d'image avec prévisualisation
  const ImageEditor = ({ 
    label, 
    value, 
    onChange,
    section,
    field,
    nestedPath 
  }: { 
    label: string; 
    value: string; 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    section: keyof HomePageData;
    field?: string;
    nestedPath?: string;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-lg overflow-hidden">
          <img 
            src={value} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={value}
            onChange={onChange}
            className="w-full border rounded-lg p-2 mb-2"
            placeholder="URL de l'image"
          />
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
            <Upload size={18} />
            Télécharger une image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (nestedPath) {
                  handleImageUpload(e, '', section, nestedPath);
                } else if (field) {
                  handleImageUpload(e, field, section);
                }
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {isPreview && <Preview />}
      
      {/* En-tête */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Éditeur de la page d'accueil</h1>
            <p className="text-gray-600">Modifiez tous les éléments de votre page d'accueil</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {isPreview ? <EyeOff size={20} /> : <Eye size={20} />}
              {isPreview ? 'Masquer l\'aperçu' : 'Aperçu'}
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              <Save size={20} />
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </div>

        {saveMessage && (
          <div className={`p-4 rounded-lg mb-4 ${saveMessage.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {saveMessage}
          </div>
        )}

        {/* Navigation par section */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'hero', label: 'Hero Section', icon: Layout },
            { id: 'welcome', label: 'Welcome', icon: HomeIcon },
            { id: 'marquee', label: 'Marquee', icon: Tag },
            { id: 'destination', label: 'Destination', icon: Map },
            { id: 'featureRoom', label: 'Feature Room', icon: Sofa },
            { id: 'marqueeBlack', label: 'Marquee Noir', icon: Tag },
            { id: 'video', label: 'Vidéo', icon: Video },
            { id: 'services', label: 'Services', icon: Grid3x3 },
            { id: 'features', label: 'Features', icon: Zap },
            { id: 'stats', label: 'Stats', icon: BarChart3 },
            { id: 'logos', label: 'Logos', icon: Image },
            { id: 'cards', label: 'Cartes', icon: Copy }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeSection === id 
                  ? 'bg-black text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Éditeur principal */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Panneau d'édition */}
        <div className="lg:col-span-2">
          {activeSection === 'hero' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Layout size={24} />
                Hero Section
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre principal</label>
                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="text"
                      value={pageData.heroSection.mainTitle.line1}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        heroSection: {
                          ...prev.heroSection,
                          mainTitle: { ...prev.heroSection.mainTitle, line1: e.target.value }
                        }
                      }))}
                      className="w-full border rounded-lg p-3 font-bold text-lg"
                      placeholder="Première ligne"
                    />
                    <input
                      type="text"
                      value={pageData.heroSection.mainTitle.line2}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        heroSection: {
                          ...prev.heroSection,
                          mainTitle: { ...prev.heroSection.mainTitle, line2: e.target.value }
                        }
                      }))}
                      className="w-full border rounded-lg p-3 font-bold text-lg"
                      placeholder="Deuxième ligne"
                    />
                    <input
                      type="text"
                      value={pageData.heroSection.mainTitle.line3}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        heroSection: {
                          ...prev.heroSection,
                          mainTitle: { ...prev.heroSection.mainTitle, line3: e.target.value }
                        }
                      }))}
                      className="w-full border rounded-lg p-3 font-bold text-lg"
                      placeholder="Troisième ligne"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={pageData.heroSection.description}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      heroSection: { ...prev.heroSection, description: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3 h-32"
                  />
                  <LineBreakInfo fieldName="la description" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Texte du bouton</label>
                  <input
                    type="text"
                    value={pageData.heroSection.buttonText}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      heroSection: { ...prev.heroSection, buttonText: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Couleur d'accent</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={pageData.heroSection.accentColor}
                        onChange={(e) => setPageData(prev => ({
                          ...prev,
                          heroSection: { ...prev.heroSection, accentColor: e.target.value }
                        }))}
                        className="w-12 h-12 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={pageData.heroSection.accentColor}
                        onChange={(e) => setPageData(prev => ({
                          ...prev,
                          heroSection: { ...prev.heroSection, accentColor: e.target.value }
                        }))}
                        className="flex-1 border rounded-lg p-2 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">Images de la Hero Section</h4>
                  <div className="space-y-4">
                    <ImageEditor
                      label="Image principale"
                      value={pageData.heroSection.images.main}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        heroSection: {
                          ...prev.heroSection,
                          images: { ...prev.heroSection.images, main: e.target.value }
                        }
                      }))}
                      section="heroSection"
                      nestedPath="images.main"
                    />
                    
                    <ImageEditor
                      label="Image secondaire"
                      value={pageData.heroSection.images.secondary}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        heroSection: {
                          ...prev.heroSection,
                          images: { ...prev.heroSection.images, secondary: e.target.value }
                        }
                      }))}
                      section="heroSection"
                      nestedPath="images.secondary"
                    />
                    
                    <ImageEditor
                      label="Image de la chambre"
                      value={pageData.heroSection.images.bedroom}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        heroSection: {
                          ...prev.heroSection,
                          images: { ...prev.heroSection.images, bedroom: e.target.value }
                        }
                      }))}
                      section="heroSection"
                      nestedPath="images.bedroom"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">Témoignage</h4>
                  <div className="space-y-4">
                    <ImageEditor
                      label="Image du témoignage"
                      value={pageData.heroSection.testimonial.image}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        heroSection: {
                          ...prev.heroSection,
                          testimonial: { ...prev.heroSection.testimonial, image: e.target.value }
                        }
                      }))}
                      section="heroSection"
                      nestedPath="testimonial.image"
                    />
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Titre du témoignage</label>
                      <textarea
                        value={pageData.heroSection.testimonial.title}
                        onChange={(e) => setPageData(prev => ({
                          ...prev,
                          heroSection: {
                            ...prev.heroSection,
                            testimonial: { ...prev.heroSection.testimonial, title: e.target.value }
                          }
                        }))}
                        className="w-full border rounded-lg p-3 h-20"
                      />
                      <LineBreakInfo fieldName="le titre du témoignage" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Sous-titre du témoignage</label>
                      <textarea
                        value={pageData.heroSection.testimonial.subtitle}
                        onChange={(e) => setPageData(prev => ({
                          ...prev,
                          heroSection: {
                            ...prev.heroSection,
                            testimonial: { ...prev.heroSection.testimonial, subtitle: e.target.value }
                          }
                        }))}
                        className="w-full border rounded-lg p-3 h-16"
                      />
                      <LineBreakInfo fieldName="le sous-titre du témoignage" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'features' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Zap size={24} />
                Features Section
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre</label>
                  <textarea
                    value={pageData.featuresSection.title}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      featuresSection: { ...prev.featuresSection, title: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3 h-20"
                  />
                  <LineBreakInfo fieldName="le titre" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sous-titre</label>
                  <textarea
                    value={pageData.featuresSection.subtitle}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      featuresSection: { ...prev.featuresSection, subtitle: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3 h-16"
                  />
                  <LineBreakInfo fieldName="le sous-titre" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={pageData.featuresSection.description}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      featuresSection: { ...prev.featuresSection, description: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3 h-28"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Couleur de fond</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={pageData.featuresSection.backgroundColor}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        featuresSection: { ...prev.featuresSection, backgroundColor: e.target.value }
                      }))}
                      className="w-12 h-12 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={pageData.featuresSection.backgroundColor}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        featuresSection: { ...prev.featuresSection, backgroundColor: e.target.value }
                      }))}
                      className="flex-1 border rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">Image principale</h4>
                  <ImageEditor
                    label="Image principale"
                    value={pageData.featuresSection.mainImage}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      featuresSection: { ...prev.featuresSection, mainImage: e.target.value }
                    }))}
                    section="featuresSection"
                    field="mainImage"
                  />
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">Miniatures</h4>
                  <div className="space-y-2">
                    {pageData.featuresSection.thumbnails.map((thumb, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-16 h-16 rounded overflow-hidden">
                          <img src={thumb} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                        </div>
                        <input
                          type="text"
                          value={thumb}
                          onChange={(e) => {
                            const newThumbs = [...pageData.featuresSection.thumbnails];
                            newThumbs[idx] = e.target.value;
                            setPageData(prev => ({
                              ...prev,
                              featuresSection: { ...prev.featuresSection, thumbnails: newThumbs }
                            }));
                          }}
                          className="flex-1 border rounded-lg p-2"
                        />
                        <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                          <Upload size={16} />
                          Télécharger
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, '', 'featuresSection', `thumbnails.${idx}`)}
                          />
                        </label>
                        <button
                          onClick={() => removeGalleryImage('featuresSection', 'thumbnails', idx)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addGalleryImage('featuresSection', 'thumbnails')}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 w-full"
                    >
                      <Plus size={18} />
                      Ajouter une miniature
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">Fonctionnalités</h4>
                  <div className="space-y-4">
                    {pageData.featuresSection.features.map((feature, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h5 className="font-medium">Feature {index + 1}</h5>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const newFeatures = moveItem(pageData.featuresSection.features, index, 'up');
                                setPageData(prev => ({
                                  ...prev,
                                  featuresSection: { ...prev.featuresSection, features: newFeatures }
                                }));
                              }}
                              disabled={index === 0}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                            >
                              <ChevronUp size={20} />
                            </button>
                            <button
                              onClick={() => {
                                const newFeatures = moveItem(pageData.featuresSection.features, index, 'down');
                                setPageData(prev => ({
                                  ...prev,
                                  featuresSection: { ...prev.featuresSection, features: newFeatures }
                                }));
                              }}
                              disabled={index === pageData.featuresSection.features.length - 1}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                            >
                              <ChevronDown size={20} />
                            </button>
                            <button
                              onClick={() => removeFeature(index)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Icône</label>
                            <input
                              type="text"
                              value={feature.icon}
                              onChange={(e) => {
                                const newFeatures = [...pageData.featuresSection.features];
                                newFeatures[index].icon = e.target.value;
                                setPageData(prev => ({
                                  ...prev,
                                  featuresSection: { ...prev.featuresSection, features: newFeatures }
                                }));
                              }}
                              className="w-full border rounded-lg p-2"
                              placeholder="ex: Sofa, Home, etc."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">Titre</label>
                            <input
                              type="text"
                              value={feature.title}
                              onChange={(e) => {
                                const newFeatures = [...pageData.featuresSection.features];
                                newFeatures[index].title = e.target.value;
                                setPageData(prev => ({
                                  ...prev,
                                  featuresSection: { ...prev.featuresSection, features: newFeatures }
                                }));
                              }}
                              className="w-full border rounded-lg p-2"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={addFeature}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 w-full"
                    >
                      <Plus size={18} />
                      Ajouter une fonctionnalité
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'welcome' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <HomeIcon size={24} />
                Welcome Section
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre</label>
                  <input
                    type="text"
                    value={pageData.welcomeSection.title}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      welcomeSection: { ...prev.welcomeSection, title: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={pageData.welcomeSection.description}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      welcomeSection: { ...prev.welcomeSection, description: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3 h-32"
                  />
                  <LineBreakInfo fieldName="la description" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Texte du bouton</label>
                  <input
                    type="text"
                    value={pageData.welcomeSection.buttonText}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      welcomeSection: { ...prev.welcomeSection, buttonText: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Fonctionnalité 1</label>
                    <input
                      type="text"
                      value={pageData.welcomeSection.features.feature1}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        welcomeSection: {
                          ...prev.welcomeSection,
                          features: { ...prev.welcomeSection.features, feature1: e.target.value }
                        }
                      }))}
                      className="w-full border rounded-lg p-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Fonctionnalité 2</label>
                    <input
                      type="text"
                      value={pageData.welcomeSection.features.feature2}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        welcomeSection: {
                          ...prev.welcomeSection,
                          features: { ...prev.welcomeSection.features, feature2: e.target.value }
                        }
                      }))}
                      className="w-full border rounded-lg p-3"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">URL Vidéo YouTube</label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    value={pageData.welcomeSection.videoUrl}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      welcomeSection: { ...prev.welcomeSection, videoUrl: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2">Utilisez l'URL YouTube en format embed (avec /embed/)</p>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">Vidéo Cloudinary</h4>
                  <VideoUploader
                    value={pageData.welcomeSection.videoUrl}
                    onChange={(url) => setPageData(prev => ({
                      ...prev,
                      welcomeSection: { ...prev.welcomeSection, videoUrl: url }
                    }))}
                    label="Télécharger une vidéo"
                  />
                  <p className="text-xs text-gray-500 mt-2">Vous pouvez utiliser une vidéo Cloudinary à la place de YouTube</p>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">Images</h4>
                  <div className="space-y-4">
                    <ImageEditor
                      label="Image vidéo"
                      value={pageData.welcomeSection.videoImage}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        welcomeSection: { ...prev.welcomeSection, videoImage: e.target.value }
                      }))}
                      section="welcomeSection"
                      field="videoImage"
                    />
                    
                    <ImageEditor
                      label="Image 1"
                      value={pageData.welcomeSection.image1}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        welcomeSection: { ...prev.welcomeSection, image1: e.target.value }
                      }))}
                      section="welcomeSection"
                      field="image1"
                    />
                    
                    <ImageEditor
                      label="Image 2"
                      value={pageData.welcomeSection.image2}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        welcomeSection: { ...prev.welcomeSection, image2: e.target.value }
                      }))}
                      section="welcomeSection"
                      field="image2"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'marquee' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Tag size={24} />
                Marquee Section
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Texte du marquee</label>
                  <input
                    type="text"
                    value={pageData.marqueeSection.text}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      marqueeSection: { ...prev.marqueeSection, text: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Couleur du texte</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={pageData.marqueeSection.color}
                        onChange={(e) => setPageData(prev => ({
                          ...prev,
                          marqueeSection: { ...prev.marqueeSection, color: e.target.value }
                        }))}
                        className="w-12 h-12 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={pageData.marqueeSection.color}
                        onChange={(e) => setPageData(prev => ({
                          ...prev,
                          marqueeSection: { ...prev.marqueeSection, color: e.target.value }
                        }))}
                        className="flex-1 border rounded-lg p-2 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Couleur de fond</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={pageData.marqueeSection.backgroundColor}
                        onChange={(e) => setPageData(prev => ({
                          ...prev,
                          marqueeSection: { ...prev.marqueeSection, backgroundColor: e.target.value }
                        }))}
                        className="w-12 h-12 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={pageData.marqueeSection.backgroundColor}
                        onChange={(e) => setPageData(prev => ({
                          ...prev,
                          marqueeSection: { ...prev.marqueeSection, backgroundColor: e.target.value }
                        }))}
                        className="flex-1 border rounded-lg p-2 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'destination' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Map size={24} />
                Destination Search
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre</label>
                  <textarea
                    value={pageData.destinationSearch.title}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      destinationSearch: { ...prev.destinationSearch, title: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3 h-20"
                  />
                  <LineBreakInfo fieldName="le titre" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={pageData.destinationSearch.description}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      destinationSearch: { ...prev.destinationSearch, description: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3 h-32"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Texte animation (badge rotatif)</label>
                  <textarea
                    value={pageData.destinationSearch.rotatingText}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      destinationSearch: { ...prev.destinationSearch, rotatingText: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3 h-20"
                  />
                  <LineBreakInfo fieldName="le texte du badge rotatif" />
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">Labels du formulaire</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Destination</label>
                      <input
                        type="text"
                        value={pageData.destinationSearch.formLabels.destination}
                        onChange={(e) => setPageData(prev => ({
                          ...prev,
                          destinationSearch: {
                            ...prev.destinationSearch,
                            formLabels: { ...prev.destinationSearch.formLabels, destination: e.target.value }
                          }
                        }))}
                        className="w-full border rounded-lg p-3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Date</label>
                      <input
                        type="text"
                        value={pageData.destinationSearch.formLabels.date}
                        onChange={(e) => setPageData(prev => ({
                          ...prev,
                          destinationSearch: {
                            ...prev.destinationSearch,
                            formLabels: { ...prev.destinationSearch.formLabels, date: e.target.value }
                          }
                        }))}
                        className="w-full border rounded-lg p-3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Voyageurs</label>
                      <input
                        type="text"
                        value={pageData.destinationSearch.formLabels.travelers}
                        onChange={(e) => setPageData(prev => ({
                          ...prev,
                          destinationSearch: {
                            ...prev.destinationSearch,
                            formLabels: { ...prev.destinationSearch.formLabels, travelers: e.target.value }
                          }
                        }))}
                        className="w-full border rounded-lg p-3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Bouton</label>
                      <input
                        type="text"
                        value={pageData.destinationSearch.formLabels.button}
                        onChange={(e) => setPageData(prev => ({
                          ...prev,
                          destinationSearch: {
                            ...prev.destinationSearch,
                            formLabels: { ...prev.destinationSearch.formLabels, button: e.target.value }
                          }
                        }))}
                        className="w-full border rounded-lg p-3"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">Images</h4>
                  <div className="space-y-4">
                    <ImageEditor
                      label="Petite image"
                      value={pageData.destinationSearch.images.small}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        destinationSearch: {
                          ...prev.destinationSearch,
                          images: { ...prev.destinationSearch.images, small: e.target.value }
                        }
                      }))}
                      section="destinationSearch"
                      nestedPath="images.small"
                    />
                    
                    <ImageEditor
                      label="Image principale"
                      value={pageData.destinationSearch.images.main}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        destinationSearch: {
                          ...prev.destinationSearch,
                          images: { ...prev.destinationSearch.images, main: e.target.value }
                        }
                      }))}
                      section="destinationSearch"
                      nestedPath="images.main"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'marqueeBlack' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Tag size={24} />
                Marquee Noir Section
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Texte du marquee</label>
                  <input
                    type="text"
                    value={pageData.marqueeBlackSection.text}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      marqueeBlackSection: { ...prev.marqueeBlackSection, text: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3"
                    placeholder="Entrez le texte à afficher"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Couleur du texte</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={pageData.marqueeBlackSection.color}
                        onChange={(e) => setPageData(prev => ({
                          ...prev,
                          marqueeBlackSection: { ...prev.marqueeBlackSection, color: e.target.value }
                        }))}
                        className="w-12 h-12 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={pageData.marqueeBlackSection.color}
                        onChange={(e) => setPageData(prev => ({
                          ...prev,
                          marqueeBlackSection: { ...prev.marqueeBlackSection, color: e.target.value }
                        }))}
                        className="flex-1 border rounded-lg p-2 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Couleur de fond</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={pageData.marqueeBlackSection.backgroundColor}
                        onChange={(e) => setPageData(prev => ({
                          ...prev,
                          marqueeBlackSection: { ...prev.marqueeBlackSection, backgroundColor: e.target.value }
                        }))}
                        className="w-12 h-12 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={pageData.marqueeBlackSection.backgroundColor}
                        onChange={(e) => setPageData(prev => ({
                          ...prev,
                          marqueeBlackSection: { ...prev.marqueeBlackSection, backgroundColor: e.target.value }
                        }))}
                        className="flex-1 border rounded-lg p-2 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'featureRoom' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Sofa size={24} />
                Feature Room
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre</label>
                  <textarea
                    value={pageData.featureRoom.title}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      featureRoom: { ...prev.featureRoom, title: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3 h-20"
                  />
                  <LineBreakInfo fieldName="le titre" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sous-titre</label>
                  <textarea
                    value={pageData.featureRoom.subtitle}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      featureRoom: { ...prev.featureRoom, subtitle: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3 h-16"
                  />
                  <LineBreakInfo fieldName="le sous-titre" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={pageData.featureRoom.description}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      featureRoom: { ...prev.featureRoom, description: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3 h-32"
                  />
                  <LineBreakInfo fieldName="la description" />
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">Fonctionnalités</h4>
                  <div className="space-y-4">
                    {pageData.featureRoom.features.map((feature, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h5 className="font-medium">Fonctionnalité {index + 1}</h5>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const newFeatures = moveItem(pageData.featureRoom.features, index, 'up');
                                setPageData(prev => ({
                                  ...prev,
                                  featureRoom: { ...prev.featureRoom, features: newFeatures }
                                }));
                              }}
                              disabled={index === 0}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                            >
                              <ChevronUp size={20} />
                            </button>
                            <button
                              onClick={() => {
                                const newFeatures = moveItem(pageData.featureRoom.features, index, 'down');
                                setPageData(prev => ({
                                  ...prev,
                                  featureRoom: { ...prev.featureRoom, features: newFeatures }
                                }));
                              }}
                              disabled={index === pageData.featureRoom.features.length - 1}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                            >
                              <ChevronDown size={20} />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Icône</label>
                            <input
                              type="text"
                              value={feature.icon}
                              onChange={(e) => {
                                const newFeatures = [...pageData.featureRoom.features];
                                newFeatures[index].icon = e.target.value;
                                setPageData(prev => ({
                                  ...prev,
                                  featureRoom: { ...prev.featureRoom, features: newFeatures }
                                }));
                              }}
                              className="w-full border rounded-lg p-2"
                              placeholder="ex: Home, Sofa, etc."
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Titre</label>
                            <input
                              type="text"
                              value={feature.title}
                              onChange={(e) => {
                                const newFeatures = [...pageData.featureRoom.features];
                                newFeatures[index].title = e.target.value;
                                setPageData(prev => ({
                                  ...prev,
                                  featureRoom: { ...prev.featureRoom, features: newFeatures }
                                }));
                              }}
                              className="w-full border rounded-lg p-2"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                              value={feature.description}
                              onChange={(e) => {
                                const newFeatures = [...pageData.featureRoom.features];
                                newFeatures[index].description = e.target.value;
                                setPageData(prev => ({
                                  ...prev,
                                  featureRoom: { ...prev.featureRoom, features: newFeatures }
                                }));
                              }}
                              className="w-full border rounded-lg p-2 h-20"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Couleur de fond</label>
                            <div className="flex items-center gap-4">
                              <input
                                type="color"
                                value={feature.backgroundColor}
                                onChange={(e) => {
                                  const newFeatures = [...pageData.featureRoom.features];
                                  newFeatures[index].backgroundColor = e.target.value;
                                  setPageData(prev => ({
                                    ...prev,
                                    featureRoom: { ...prev.featureRoom, features: newFeatures }
                                  }));
                                }}
                                className="w-10 h-10 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={feature.backgroundColor}
                                onChange={(e) => {
                                  const newFeatures = [...pageData.featureRoom.features];
                                  newFeatures[index].backgroundColor = e.target.value;
                                  setPageData(prev => ({
                                    ...prev,
                                    featureRoom: { ...prev.featureRoom, features: newFeatures }
                                  }));
                                }}
                                className="flex-1 border rounded-lg p-2 font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">Images</h4>
                  <div className="space-y-4">
                    <ImageEditor
                      label="Image de la chambre"
                      value={pageData.featureRoom.images.bedroom}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        featureRoom: {
                          ...prev.featureRoom,
                          images: { ...prev.featureRoom.images, bedroom: e.target.value }
                        }
                      }))}
                      section="featureRoom"
                      nestedPath="images.bedroom"
                    />
                    
                    <ImageEditor
                      label="Image du salon"
                      value={pageData.featureRoom.images.living}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        featureRoom: {
                          ...prev.featureRoom,
                          images: { ...prev.featureRoom.images, living: e.target.value }
                        }
                      }))}
                      section="featureRoom"
                      nestedPath="images.living"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'video' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Video size={24} />
                Video Section
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre</label>
                  <input
                    type="text"
                    value={pageData.videoSection.title}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      videoSection: { ...prev.videoSection, title: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={pageData.videoSection.description}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      videoSection: { ...prev.videoSection, description: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3 h-32"
                  />
                  <LineBreakInfo fieldName="la description" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Texte du bouton</label>
                  <input
                    type="text"
                    value={pageData.videoSection.buttonText}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      videoSection: { ...prev.videoSection, buttonText: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Couleur d'accent</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={pageData.videoSection.accentColor}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        videoSection: { ...prev.videoSection, accentColor: e.target.value }
                      }))}
                      className="w-12 h-12 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={pageData.videoSection.accentColor}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        videoSection: { ...prev.videoSection, accentColor: e.target.value }
                      }))}
                      className="flex-1 border rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">URL Vidéo YouTube</label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    value={pageData.videoSection.videoUrl}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      videoSection: { ...prev.videoSection, videoUrl: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2">Utilisez l'URL YouTube en format embed (avec /embed/)</p>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">Vidéo Cloudinary</h4>
                  <VideoUploader
                    value={pageData.videoSection.videoUrl}
                    onChange={(url) => setPageData(prev => ({
                      ...prev,
                      videoSection: { ...prev.videoSection, videoUrl: url }
                    }))}
                    label="Télécharger une vidéo"
                  />
                  <p className="text-xs text-gray-500 mt-2">Vous pouvez utiliser une vidéo Cloudinary à la place de YouTube</p>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">Images</h4>
                  <div className="space-y-4">
                    <ImageEditor
                      label="Image principale"
                      value={pageData.videoSection.mainImage}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        videoSection: { ...prev.videoSection, mainImage: e.target.value }
                      }))}
                      section="videoSection"
                      field="mainImage"
                    />
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Galerie d'images</label>
                      <div className="space-y-2">
                        {pageData.videoSection.galleryImages.map((image, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-16 h-16 rounded overflow-hidden">
                              <img src={image} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                            </div>
                            <input
                              type="text"
                              value={image}
                              onChange={(e) => {
                                const newImages = [...pageData.videoSection.galleryImages];
                                newImages[index] = e.target.value;
                                setPageData(prev => ({
                                  ...prev,
                                  videoSection: { ...prev.videoSection, galleryImages: newImages }
                                }));
                              }}
                              className="flex-1 border rounded-lg p-2"
                            />
                            <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                              <Upload size={16} />
                              Télécharger
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageUpload(e, '', 'videoSection', `galleryImages.${index}`)}
                              />
                            </label>
                            <button
                              onClick={() => removeGalleryImage('videoSection', 'galleryImages', index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addGalleryImage('videoSection', 'galleryImages')}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                          <Plus size={18} />
                          Ajouter une image
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'services' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Grid3x3 size={24} />
                Services Section
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre de la section</label>
                  <input
                    type="text"
                    value={pageData.servicesSection.title}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      servicesSection: { ...prev.servicesSection, title: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Texte du bouton</label>
                  <input
                    type="text"
                    value={pageData.servicesSection.buttonText}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      servicesSection: { ...prev.servicesSection, buttonText: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">Services</h4>
                  <div className="space-y-4">
                    {pageData.servicesSection.services.map((service, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h5 className="font-medium">Service {index + 1}</h5>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const newServices = moveItem(pageData.servicesSection.services, index, 'up');
                                setPageData(prev => ({
                                  ...prev,
                                  servicesSection: { ...prev.servicesSection, services: newServices }
                                }));
                              }}
                              disabled={index === 0}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                            >
                              <ChevronUp size={20} />
                            </button>
                            <button
                              onClick={() => {
                                const newServices = moveItem(pageData.servicesSection.services, index, 'down');
                                setPageData(prev => ({
                                  ...prev,
                                  servicesSection: { ...prev.servicesSection, services: newServices }
                                }));
                              }}
                              disabled={index === pageData.servicesSection.services.length - 1}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                            >
                              <ChevronDown size={20} />
                            </button>
                            <button
                              onClick={() => removeService(index)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <ImageEditor
                            label="Image du service"
                            value={service.image}
                            onChange={(e) => {
                              const newServices = [...pageData.servicesSection.services];
                              newServices[index].image = e.target.value;
                              setPageData(prev => ({
                                ...prev,
                                servicesSection: { ...prev.servicesSection, services: newServices }
                              }));
                            }}
                            section="servicesSection"
                            nestedPath={`services.${index}.image`}
                          />
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Titre</label>
                            <input
                              type="text"
                              value={service.title}
                              onChange={(e) => {
                                const newServices = [...pageData.servicesSection.services];
                                newServices[index].title = e.target.value;
                                setPageData(prev => ({
                                  ...prev,
                                  servicesSection: { ...prev.servicesSection, services: newServices }
                                }));
                              }}
                              className="w-full border rounded-lg p-2"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                              value={service.description}
                              onChange={(e) => {
                                const newServices = [...pageData.servicesSection.services];
                                newServices[index].description = e.target.value;
                                setPageData(prev => ({
                                  ...prev,
                                  servicesSection: { ...prev.servicesSection, services: newServices }
                                }));
                              }}
                              className="w-full border rounded-lg p-2 h-24"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      onClick={addService}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 w-full"
                    >
                      <Plus size={18} />
                      Ajouter un service
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'stats' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <BarChart3 size={24} />
                Stats Section
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium mb-4">Carte de propriété</h4>
                  <div className="border rounded-lg p-4">
                    <ImageEditor
                      label="Image de la propriété"
                      value={pageData.statsSection.propertyCard.image}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        statsSection: {
                          ...prev.statsSection,
                          propertyCard: { ...prev.statsSection.propertyCard, image: e.target.value }
                        }
                      }))}
                      section="statsSection"
                      nestedPath="propertyCard.image"
                    />
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-2">Titre</label>
                      <input
                        type="text"
                        value={pageData.statsSection.propertyCard.title}
                        onChange={(e) => setPageData(prev => ({
                          ...prev,
                          statsSection: {
                            ...prev.statsSection,
                            propertyCard: { ...prev.statsSection.propertyCard, title: e.target.value }
                          }
                        }))}
                        className="w-full border rounded-lg p-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Prix</label>
                        <input
                          type="number"
                          value={pageData.statsSection.propertyCard.price}
                          onChange={(e) => setPageData(prev => ({
                            ...prev,
                            statsSection: {
                              ...prev.statsSection,
                              propertyCard: { ...prev.statsSection.propertyCard, price: parseFloat(e.target.value) }
                            }
                          }))}
                          className="w-full border rounded-lg p-3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Unité de prix</label>
                        <input
                          type="text"
                          value={pageData.statsSection.propertyCard.priceUnit}
                          onChange={(e) => setPageData(prev => ({
                            ...prev,
                            statsSection: {
                              ...prev.statsSection,
                              propertyCard: { ...prev.statsSection.propertyCard, priceUnit: e.target.value }
                            }
                          }))}
                          className="w-full border rounded-lg p-3"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea
                        value={pageData.statsSection.propertyCard.description}
                        onChange={(e) => setPageData(prev => ({
                          ...prev,
                          statsSection: {
                            ...prev.statsSection,
                            propertyCard: { ...prev.statsSection.propertyCard, description: e.target.value }
                          }
                        }))}
                        className="w-full border rounded-lg p-3 h-32"
                      />
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-2">Texte du bouton</label>
                      <input
                        type="text"
                        value={pageData.statsSection.propertyCard.buttonText}
                        onChange={(e) => setPageData(prev => ({
                          ...prev,
                          statsSection: {
                            ...prev.statsSection,
                            propertyCard: { ...prev.statsSection.propertyCard, buttonText: e.target.value }
                          }
                        }))}
                        className="w-full border rounded-lg p-3"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">Statistiques</h4>
                  <div className="space-y-4">
                    {pageData.statsSection.stats.map((stat, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h5 className="font-medium">Statistique {index + 1}</h5>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const newStats = moveItem(pageData.statsSection.stats, index, 'up');
                                setPageData(prev => ({
                                  ...prev,
                                  statsSection: { ...prev.statsSection, stats: newStats }
                                }));
                              }}
                              disabled={index === 0}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                            >
                              <ChevronUp size={20} />
                            </button>
                            <button
                              onClick={() => {
                                const newStats = moveItem(pageData.statsSection.stats, index, 'down');
                                setPageData(prev => ({
                                  ...prev,
                                  statsSection: { ...prev.statsSection, stats: newStats }
                                }));
                              }}
                              disabled={index === pageData.statsSection.stats.length - 1}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                            >
                              <ChevronDown size={20} />
                            </button>
                            <button
                              onClick={() => removeStat(index)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Valeur</label>
                            <input
                              type="text"
                              value={stat.value}
                              onChange={(e) => {
                                const newStats = [...pageData.statsSection.stats];
                                newStats[index].value = e.target.value;
                                setPageData(prev => ({
                                  ...prev,
                                  statsSection: { ...prev.statsSection, stats: newStats }
                                }));
                              }}
                              className="w-full border rounded-lg p-2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Label</label>
                            <input
                              type="text"
                              value={stat.label}
                              onChange={(e) => {
                                const newStats = [...pageData.statsSection.stats];
                                newStats[index].label = e.target.value;
                                setPageData(prev => ({
                                  ...prev,
                                  statsSection: { ...prev.statsSection, stats: newStats }
                                }));
                              }}
                              className="w-full border rounded-lg p-2"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      onClick={addStat}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 w-full"
                    >
                      <Plus size={18} />
                      Ajouter une statistique
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'logos' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Image size={24} />
                Logo Section
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre</label>
                  <input
                    type="text"
                    value={pageData.logoSection.title}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      logoSection: { ...prev.logoSection, title: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={pageData.logoSection.description}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      logoSection: { ...prev.logoSection, description: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3 h-32"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Couleur de fond</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={pageData.logoSection.backgroundColor}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        logoSection: { ...prev.logoSection, backgroundColor: e.target.value }
                      }))}
                      className="w-12 h-12 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={pageData.logoSection.backgroundColor}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        logoSection: { ...prev.logoSection, backgroundColor: e.target.value }
                      }))}
                      className="flex-1 border rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">Logos</h4>
                  <div className="space-y-4">
                    {pageData.logoSection.logos.map((logo, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h5 className="font-medium">Logo {index + 1}</h5>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const newLogos = moveItem(pageData.logoSection.logos, index, 'up');
                                setPageData(prev => ({
                                  ...prev,
                                  logoSection: { ...prev.logoSection, logos: newLogos }
                                }));
                              }}
                              disabled={index === 0}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                            >
                              <ChevronUp size={20} />
                            </button>
                            <button
                              onClick={() => {
                                const newLogos = moveItem(pageData.logoSection.logos, index, 'down');
                                setPageData(prev => ({
                                  ...prev,
                                  logoSection: { ...prev.logoSection, logos: newLogos }
                                }));
                              }}
                              disabled={index === pageData.logoSection.logos.length - 1}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                            >
                              <ChevronDown size={20} />
                            </button>
                            <button
                              onClick={() => removeLogo(index)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Nom</label>
                            <input
                              type="text"
                              value={logo.name}
                              onChange={(e) => {
                                const newLogos = [...pageData.logoSection.logos];
                                newLogos[index].name = e.target.value;
                                setPageData(prev => ({
                                  ...prev,
                                  logoSection: { ...prev.logoSection, logos: newLogos }
                                }));
                              }}
                              className="w-full border rounded-lg p-2"
                            />
                          </div>
                          
                          <ImageEditor
                            label="Image du logo"
                            value={logo.image}
                            onChange={(e) => {
                              const newLogos = [...pageData.logoSection.logos];
                              newLogos[index].image = e.target.value;
                              setPageData(prev => ({
                                ...prev,
                                logoSection: { ...prev.logoSection, logos: newLogos }
                              }));
                            }}
                            section="logoSection"
                            nestedPath={`logos.${index}.image`}
                          />
                        </div>
                      </div>
                    ))}
                    
                    <button
                      onClick={addLogo}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 w-full"
                    >
                      <Plus size={18} />
                      Ajouter un logo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'cards' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Copy size={24} />
                Three Cards Section
              </h3>

              <div className="space-y-6">
                {pageData.threeCardsSection.cards.map((card, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h5 className="font-medium">Carte {index + 1}</h5>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const newCards = moveItem(pageData.threeCardsSection.cards, index, 'up');
                            setPageData(prev => ({
                              ...prev,
                              threeCardsSection: { ...prev.threeCardsSection, cards: newCards }
                            }));
                          }}
                          disabled={index === 0}
                          className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                        >
                          <ChevronUp size={18} />
                        </button>
                        <button
                          onClick={() => {
                            const newCards = moveItem(pageData.threeCardsSection.cards, index, 'down');
                            setPageData(prev => ({
                              ...prev,
                              threeCardsSection: { ...prev.threeCardsSection, cards: newCards }
                            }));
                          }}
                          disabled={index === pageData.threeCardsSection.cards.length - 1}
                          className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                        >
                          <ChevronDown size={18} />
                        </button>
                        <button
                          onClick={() => removeCard(index)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Titre</label>
                        <textarea
                          value={card.title}
                          onChange={(e) => {
                            const newCards = [...pageData.threeCardsSection.cards];
                            newCards[index].title = e.target.value;
                            setPageData(prev => ({
                              ...prev,
                              threeCardsSection: { ...prev.threeCardsSection, cards: newCards }
                            }));
                          }}
                          className="w-full border rounded-lg p-2 h-20"
                        />
                        <LineBreakInfo fieldName={`le titre de la carte ${index + 1}`} />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Sous-titre</label>
                        <textarea
                          value={card.subtitle}
                          onChange={(e) => {
                            const newCards = [...pageData.threeCardsSection.cards];
                            newCards[index].subtitle = e.target.value;
                            setPageData(prev => ({
                              ...prev,
                              threeCardsSection: { ...prev.threeCardsSection, cards: newCards }
                            }));
                          }}
                          className="w-full border rounded-lg p-2 h-16"
                        />
                        <LineBreakInfo fieldName={`le sous-titre de la carte ${index + 1}`} />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                          value={card.description}
                          onChange={(e) => {
                            const newCards = [...pageData.threeCardsSection.cards];
                            newCards[index].description = e.target.value;
                            setPageData(prev => ({
                              ...prev,
                              threeCardsSection: { ...prev.threeCardsSection, cards: newCards }
                            }));
                          }}
                          className="w-full border rounded-lg p-2 h-28"
                        />
                        <LineBreakInfo fieldName={`la description de la carte ${index + 1}`} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Texte du bouton</label>
                          <input
                            type="text"
                            value={card.buttonText}
                            onChange={(e) => {
                              const newCards = [...pageData.threeCardsSection.cards];
                              newCards[index].buttonText = e.target.value;
                              setPageData(prev => ({
                                ...prev,
                                threeCardsSection: { ...prev.threeCardsSection, cards: newCards }
                              }));
                            }}
                            className="w-full border rounded-lg p-2"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Icône (nom lucide)</label>
                          <input
                            type="text"
                            value={(card as any).icon || ''}
                            onChange={(e) => {
                              const newCards = [...pageData.threeCardsSection.cards];
                              (newCards[index] as any).icon = e.target.value;
                              setPageData(prev => ({
                                ...prev,
                                threeCardsSection: { ...prev.threeCardsSection, cards: newCards }
                              }));
                            }}
                            className="w-full border rounded-lg p-2"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 items-end">
                        <div>
                          <label className="block text-sm font-medium mb-1">Couleur de fond</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={card.backgroundColor}
                              onChange={(e) => {
                                const newCards = [...pageData.threeCardsSection.cards];
                                newCards[index].backgroundColor = e.target.value;
                                setPageData(prev => ({
                                  ...prev,
                                  threeCardsSection: { ...prev.threeCardsSection, cards: newCards }
                                }));
                              }}
                              className="w-10 h-10 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={card.backgroundColor}
                              onChange={(e) => {
                                const newCards = [...pageData.threeCardsSection.cards];
                                newCards[index].backgroundColor = e.target.value;
                                setPageData(prev => ({
                                  ...prev,
                                  threeCardsSection: { ...prev.threeCardsSection, cards: newCards }
                                }));
                              }}
                              className="flex-1 border rounded-lg p-2 font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Couleur du texte</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={card.textColor}
                              onChange={(e) => {
                                const newCards = [...pageData.threeCardsSection.cards];
                                newCards[index].textColor = e.target.value;
                                setPageData(prev => ({
                                  ...prev,
                                  threeCardsSection: { ...prev.threeCardsSection, cards: newCards }
                                }));
                              }}
                              className="w-10 h-10 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={card.textColor}
                              onChange={(e) => {
                                const newCards = [...pageData.threeCardsSection.cards];
                                newCards[index].textColor = e.target.value;
                                setPageData(prev => ({
                                  ...prev,
                                  threeCardsSection: { ...prev.threeCardsSection, cards: newCards }
                                }));
                              }}
                              className="flex-1 border rounded-lg p-2 font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addCard}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 w-full"
                >
                  <Plus size={18} />
                  Ajouter une carte
                </button>
              </div>
            </div>
          )}

          {/* Sections restantes à implémenter de la même manière... */}
          
        </div>

        {/* Panneau d'aperçu */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Eye size={20} />
                Aperçu rapide
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Hero Section</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Titre: {pageData.heroSection.mainTitle.line1}...</p>
                    <p>Bouton: {pageData.heroSection.buttonText}</p>
                    <p>Couleur: 
                      <span 
                        className="inline-block w-3 h-3 rounded-full ml-2"
                        style={{ backgroundColor: pageData.heroSection.accentColor }}
                      ></span>
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Welcome Section</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Titre: {pageData.welcomeSection.title.substring(0, 20)}...</p>
                    <p>Fonctionnalités: 2</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Services</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Nombre: {pageData.servicesSection.services.length}</p>
                    <p>Titre: {pageData.servicesSection.title.substring(0, 20)}...</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Statistiques</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Nombre: {pageData.statsSection.stats.length}</p>
                    <p>Prix: {pageData.statsSection.propertyCard.price}€</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Settings size={20} />
                Réglages rapides
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Mode édition</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsPreview(false)}
                      className={`flex-1 py-2 rounded-lg ${!isPreview ? 'bg-black text-white' : 'bg-gray-100'}`}
                    >
                      Édition
                    </button>
                    <button
                      onClick={() => setIsPreview(true)}
                      className={`flex-1 py-2 rounded-lg ${isPreview ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                    >
                      Aperçu
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Actions rapides</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        if (confirm('Voulez-vous réinitialiser toutes les modifications ?')) {
                          fetchPageData();
                        }
                      }}
                      className="w-full py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Réinitialiser les modifications
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                    >
                      {isSaving ? 'Sauvegarde...' : 'Sauvegarder maintenant'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Statistiques</label>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Dernière sauvegarde: {saveMessage ? 'À l\'instant' : 'Jamais'}</p>
                    <p>Sections: 12</p>
                    <p>Total d'éléments: {
                      pageData.servicesSection.services.length + 
                      pageData.statsSection.stats.length + 
                      pageData.logoSection.logos.length
                    }</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeEditor;