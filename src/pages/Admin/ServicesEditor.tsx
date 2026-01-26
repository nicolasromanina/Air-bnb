import React, { useState, useEffect } from 'react';
import { serviceApi, ServicePageData } from '@/services/servicesApi';
import { 
  Save, Upload, Image as ImageIcon, Trash2, Plus, 
  Eye, EyeOff, MoveUp, MoveDown, Settings, Palette,
  ChevronDown, ChevronUp, Layout, Type, Image,
  FileText, Bed, Utensils, Umbrella, Sofa, Home,
  Gem, BedDouble, HelpCircle, Grid, Square,
  Copy, Edit3, Hash, Percent, BarChart3, Zap,
  Info, AlertCircle, Tag, DollarSign, Star,
  Grid3x3, Heading, List, Box, Palette as PaletteIcon,
  TextCursor, Film, Sliders, Target, Globe,
  Home as HomeIcon, Video, Play, Search, 
  CalendarDays, Users, Map, TreePine, Car,
  Waves, Diamond, Wifi, MessageSquare, User,
  Mail, Phone, Settings as SettingsIcon,
  RefreshCw, Download, Upload as UploadIcon,
  Database, WifiOff, AlertTriangle,
  CheckCircle, XCircle, Loader
} from 'lucide-react';

interface ServicePageDataState extends Omit<ServicePageData, 'meta'> {
  meta?: ServicePageData['meta'];
}

const ServicesEditor: React.FC = () => {
  const [activeSection, setActiveSection] = useState<
    'service1' | 'service2' | 'hero' | 'composition' | 'cta' | 
    'features' | 'dark' | 'faq' | 'gallery' | 'stats'
  >('service1');
  
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<{ connected: boolean; message?: string }>({ connected: true });

  // Données initiales
  const [pageData, setPageData] = useState<ServicePageDataState>({
    service1: {
      heroSection: {
        titleLine1: 'CONSECT',
        titleLine2: 'ADIPISCING',
        titleLine3: 'ELIT.',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum.',
        backgroundImage: '/assets/hero-service.png'
      },
      compositionSection: {
        mainImage: '/assets/livingroom-service-1.png',
        secondaryImage: '/assets/badroom-service-1.png',
        title: 'Lorem ipsum dolor sit.',
        description: 'Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent.',
        features: [
          { icon: 'Gem', title: 'Inceptos' },
          { icon: 'Home', title: 'Curabitur' }
        ],
        decorativeElements: {
          pinkSquare: '#FF1675',
          blackSquare: '#000000'
        }
      },
      ctaSection: {
        title: 'Adipiscing elit amet consectetur.',
        description: 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.',
        buttonText: 'Reserver',
        image: '/assets/bedroom-service-2.png',
        featureCards: [
          {
            icon: 'Bed',
            title: 'Inceptos himenaeos',
            description: 'Ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.'
          },
          {
            icon: 'Sofa',
            title: 'Class aptent taciti',
            description: 'Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.'
          }
        ],
        layout: 'split'
      },
      featuresSection: {
        title: 'Lorem ipsum dolor sit amet.',
        features: [
          {
            icon: 'FileText',
            title: 'Adipiscing elit amet, consectetur.',
            description: 'Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.'
          },
          {
            icon: 'Bed',
            title: 'Class aptent taciti sociosqu ad',
            description: 'Norem ipsum dolor sit amet, consectetur adipiscing elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.'
          },
          {
            icon: 'Utensils',
            title: 'A nunc vulputate libero et velit',
            description: 'Curabitur tempus urna at turpis condimentum lobortis. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent.'
          },
          {
            icon: 'Umbrella',
            title: 'Curabitur tempus urna at turpis condimentum',
            description: 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.'
          }
        ],
        decorativeText: 'Lorem ipsum dolor',
        backgroundColor: '#FAFAFA'
      },
      darkSection: {
        title: 'Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
        subtitle: 'Worem ipsum dolor sit amet',
        description: 'Qorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent.',
        image1: '/assets/bedroom-service-3.png',
        image2: '/assets/livingroom-service-2.png',
        buttonText: 'Reserver maintenant',
        accentColor: '#FF2E63',
        features: [
          { id: '01', text: 'Nunc vulputate libero et velit interdum' },
          { id: '02', text: 'Class aptent taciti sociosqu ad litora torquent' },
          { id: '03', text: 'Class aptent taciti sociosqu ad litora' },
          { id: '04', text: 'Taciti sociosqu ad litora torquent' }
        ]
      }
    },
    service2: {
      faqSection: {
        questions: [
          {
            question: 'Gorem ipsum dolor sit amet, consectetur adipiscing elit.',
            answer: 'Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.'
          },
          {
            question: 'Aptent taciti sociosqu ad litora torquent per conubia',
            answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
          },
          {
            question: 'Curabitur tempus urna at turpis condimentum lobortis',
            answer: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
          },
          {
            question: 'Ut commodo efficitur amet, consectetur adipiscing elit.',
            answer: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
          }
        ],
        title: 'Elit amet, consectetur tempus at turpis',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        image: '/assets/livingroom-service-3.png',
        decorativeElements: {
          pinkSquare: '#FF2E63',
          blackSquare: '#000000'
        }
      },
      gallerySection: {
        mainImage: '/assets/bedroom-service-4.png',
        secondaryImages: [
          '/assets/sofa-service-2.png',
          '/assets/sofa-service-1.png'
        ],
        title: 'Aptent taciti sociosqu ad litora',
        description: 'Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.',
        backgroundColor: '#F5F5F5',
        decorativeElements: {
          pinkSquare: '#FF2E63',
          blackSquare: '#000000'
        }
      }
    }
  });

  // Charger les données depuis l'API
  useEffect(() => {
    checkConnection();
    fetchPageData();
  }, []);

  const checkConnection = async () => {
    try {
      const status = await serviceApi.checkConnection();
      setConnectionStatus(status);
    } catch (error) {
      setConnectionStatus({ 
        connected: false, 
        message: 'Impossible de vérifier la connexion' 
      });
    }
  };

  const fetchPageData = async () => {
    setIsLoading(true);
    try {
      const data = await serviceApi.getServicePage();
      setPageData(data);
      setSaveMessage({ type: 'success', text: '✅ Données chargées avec succès!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setSaveMessage({ 
        type: 'error', 
        text: '❌ Erreur lors du chargement des données. Vérifiez la connexion.' 
      });
      
      // Charger les données locales si disponibles
      const localData = await serviceApi.loadLocalChanges();
      if (localData) {
        setPageData(localData);
        setSaveMessage({ 
          type: 'error', 
          text: '⚠️ Données locales chargées (mode hors ligne)' 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!connectionStatus.connected) {
      setSaveMessage({ 
        type: 'error', 
        text: '❌ Impossible de sauvegarder: connexion perdue' 
      });
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      // Sauvegarde locale d'abord
      await serviceApi.saveLocalChanges(pageData as ServicePageData);
      
      // Ensuite sauvegarde sur le serveur
      const savedData = await serviceApi.updateServicePage(pageData);
      setPageData(savedData);
      // notify other tabs/pages that services were updated
      try {
        localStorage.setItem('services_updated', String(Date.now()));
      } catch (err) {
        // ignore
      }
      
      setSaveMessage({ type: 'success', text: '✅ Page services sauvegardée avec succès!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setSaveMessage({ 
        type: 'error', 
        text: '❌ Erreur lors de la sauvegarde. Changements sauvegardés localement.' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldPath: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await serviceApi.uploadImage(file);
      updateField(fieldPath, result.url);
      setSaveMessage({ type: 'success', text: '✅ Image téléchargée avec succès!' });
      setTimeout(() => setSaveMessage(null), 2000);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      setSaveMessage({ type: 'error', text: '❌ Erreur lors du téléchargement de l\'image' });
    }
  };

  const updateField = (fieldPath: string, value: any) => {
    const path = fieldPath.split('.');
    setPageData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      let current: any = newData;
      
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
          current[path[i]] = {};
        }
        current = current[path[i]];
      }
      
      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  const addFAQItem = () => {
    const newQuestion = {
      question: 'Nouvelle question ?',
      answer: 'Réponse à la nouvelle question.'
    };

    setPageData(prev => ({
      ...prev,
      service2: {
        ...prev.service2,
        faqSection: {
          ...prev.service2.faqSection,
          questions: [...prev.service2.faqSection.questions, newQuestion]
        }
      }
    }));
  };

  const removeFAQItem = (index: number) => {
    setPageData(prev => ({
      ...prev,
      service2: {
        ...prev.service2,
        faqSection: {
          ...prev.service2.faqSection,
          questions: prev.service2.faqSection.questions.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const addFeature = (section: 'featuresSection' | 'darkSection') => {
    const newFeature = section === 'featuresSection' 
      ? { 
          icon: 'Plus', 
          title: 'Nouvelle fonctionnalité', 
          description: 'Description de la nouvelle fonctionnalité.' 
        }
      : { 
          id: (pageData.service1[section].features.length + 1).toString().padStart(2, '0'), 
          text: 'Nouveau texte de fonctionnalité' 
        };

    setPageData(prev => ({
      ...prev,
      service1: {
        ...prev.service1,
        [section]: {
          ...prev.service1[section],
          features: [...prev.service1[section].features, newFeature]
        }
      }
    }));
  };

  const removeFeature = (section: 'featuresSection' | 'darkSection', index: number) => {
    setPageData(prev => ({
      ...prev,
      service1: {
        ...prev.service1,
        [section]: {
          ...prev.service1[section],
          features: prev.service1[section].features.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const addFeatureCard = () => {
    const newCard = {
      icon: 'Plus',
      title: 'Nouvelle carte',
      description: 'Description de la nouvelle carte.'
    };

    setPageData(prev => ({
      ...prev,
      service1: {
        ...prev.service1,
        ctaSection: {
          ...prev.service1.ctaSection,
          featureCards: [...prev.service1.ctaSection.featureCards, newCard]
        }
      }
    }));
  };

  const removeFeatureCard = (index: number) => {
    setPageData(prev => ({
      ...prev,
      service1: {
        ...prev.service1,
        ctaSection: {
          ...prev.service1.ctaSection,
          featureCards: prev.service1.ctaSection.featureCards.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const addGalleryImage = () => {
    setPageData(prev => ({
      ...prev,
      service2: {
        ...prev.service2,
        gallerySection: {
          ...prev.service2.gallerySection,
          secondaryImages: [...prev.service2.gallerySection.secondaryImages, '/assets/new-image.png']
        }
      }
    }));
  };

  const removeGalleryImage = (index: number) => {
    setPageData(prev => ({
      ...prev,
      service2: {
        ...prev.service2,
        gallerySection: {
          ...prev.service2.gallerySection,
          secondaryImages: prev.service2.gallerySection.secondaryImages.filter((_, i) => i !== index)
        }
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

  const handleResetToDefaults = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données aux valeurs par défaut ?')) {
      try {
        const data = await serviceApi.resetToDefaults();
        setPageData(data);
        setSaveMessage({ type: 'success', text: '✅ Données réinitialisées avec succès!' });
      } catch (error) {
        setSaveMessage({ type: 'error', text: '❌ Erreur lors de la réinitialisation' });
      }
    }
  };

  const handleExportData = async () => {
    try {
      const { data, timestamp } = await serviceApi.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `services-backup-${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSaveMessage({ type: 'success', text: '✅ Données exportées avec succès!' });
    } catch (error) {
      setSaveMessage({ type: 'error', text: '❌ Erreur lors de l\'exportation' });
    }
  };

  const handleImportData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        const savedData = await serviceApi.importData(data);
        setPageData(savedData);
        setSaveMessage({ type: 'success', text: '✅ Données importées avec succès!' });
      } catch (error) {
        setSaveMessage({ type: 'error', text: '❌ Erreur lors de l\'importation: fichier invalide' });
      }
    };
    reader.readAsText(file);
  };

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
    fieldPath
  }: { 
    label: string; 
    value: string; 
    fieldPath: string;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-lg overflow-hidden border">
          <img 
            src={value} 
            alt="Preview" 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlNWU1ZTUiLz48cGF0aCBkPSJNMzUgNDVINTVWNjVINzVMNTAgODVMNzUgNjVWNjVINzVWNDVINTVWMjVINzVWMjVINzVWNDVINzVWNDVINzVWNDVINzVWNDVINzVWNDVINzVWNDVINzVWNDVINzVWNDVINzVWNDVINzVWNDVINzVWNDVINzUiIHN0cm9rZT0iIzk5OSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+';
            }}
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => updateField(fieldPath, e.target.value)}
            className="w-full border rounded-lg p-2 mb-2 text-sm"
            placeholder="URL de l'image"
          />
          <label className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 text-sm">
            <Upload size={16} />
            Télécharger une image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, fieldPath)}
            />
          </label>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600">Chargement des données services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Bannière de connexion */}
      {!connectionStatus.connected && (
        <div className="max-w-7xl mx-auto mb-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <WifiOff className="text-red-500" size={20} />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-700">Mode hors ligne</p>
              <p className="text-xs text-red-600">Les modifications seront sauvegardées localement</p>
            </div>
            <button
              onClick={checkConnection}
              className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
            >
              <RefreshCw size={14} />
              Reconnecter
            </button>
          </div>
        </div>
      )}

      {/* En-tête */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Éditeur de la page Services</h1>
            <p className="text-gray-600">Modifiez tous les éléments de votre page Services</p>
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
              {isSaving ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Sauvegarder
                </>
              )}
            </button>
          </div>
        </div>

        {saveMessage && (
          <div className={`p-4 rounded-lg mb-4 ${
            saveMessage.type === 'success' 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {saveMessage.type === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <XCircle size={20} />
              )}
              <span>{saveMessage.text}</span>
            </div>
          </div>
        )}

        {/* Navigation par section */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'service1', label: 'Service 1', icon: Layout },
            { id: 'hero', label: 'Hero', icon: HomeIcon },
            { id: 'composition', label: 'Composition', icon: Grid },
            { id: 'cta', label: 'CTA', icon: Zap },
            { id: 'features', label: 'Features', icon: List },
            { id: 'dark', label: 'Dark Section', icon: Square },
            { id: 'service2', label: 'Service 2', icon: Copy },
            { id: 'faq', label: 'FAQ', icon: HelpCircle },
            { id: 'gallery', label: 'Gallery', icon: Image },
            { id: 'stats', label: 'Statistiques', icon: BarChart3 }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeSection === id 
                  ? 'bg-black text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
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
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <HomeIcon size={24} />
                Hero Section - Service 1
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre (ligne 1)</label>
                  <input
                    type="text"
                    value={pageData.service1.heroSection.titleLine1}
                    onChange={(e) => updateField('service1.heroSection.titleLine1', e.target.value)}
                    className="w-full border rounded-lg p-3 font-bold text-lg uppercase"
                    placeholder="CONSECT"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Titre (ligne 2)</label>
                  <input
                    type="text"
                    value={pageData.service1.heroSection.titleLine2}
                    onChange={(e) => updateField('service1.heroSection.titleLine2', e.target.value)}
                    className="w-full border rounded-lg p-3 font-bold text-lg uppercase"
                    placeholder="ADIPISCING"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Titre (ligne 3)</label>
                  <input
                    type="text"
                    value={pageData.service1.heroSection.titleLine3}
                    onChange={(e) => updateField('service1.heroSection.titleLine3', e.target.value)}
                    className="w-full border rounded-lg p-3 font-bold text-lg uppercase"
                    placeholder="ELIT."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={pageData.service1.heroSection.description}
                    onChange={(e) => updateField('service1.heroSection.description', e.target.value)}
                    className="w-full border rounded-lg p-3 h-32"
                  />
                  <LineBreakInfo fieldName="la description" />
                </div>

                <ImageEditor
                  label="Image d'arrière-plan"
                  value={pageData.service1.heroSection.backgroundImage}
                  fieldPath="service1.heroSection.backgroundImage"
                />
              </div>
            </div>
          )}

          {activeSection === 'composition' && (
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Grid size={24} />
                Composition Section - Service 1
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre</label>
                  <textarea
                    value={pageData.service1.compositionSection.title}
                    onChange={(e) => updateField('service1.compositionSection.title', e.target.value)}
                    className="w-full border rounded-lg p-3 h-20"
                  />
                  <LineBreakInfo fieldName="le titre" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={pageData.service1.compositionSection.description}
                    onChange={(e) => updateField('service1.compositionSection.description', e.target.value)}
                    className="w-full border rounded-lg p-3 h-32"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ImageEditor
                    label="Image principale"
                    value={pageData.service1.compositionSection.mainImage}
                    fieldPath="service1.compositionSection.mainImage"
                  />
                  
                  <ImageEditor
                    label="Image secondaire"
                    value={pageData.service1.compositionSection.secondaryImage}
                    fieldPath="service1.compositionSection.secondaryImage"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Couleur du carré rose</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={pageData.service1.compositionSection.decorativeElements.pinkSquare}
                        onChange={(e) => updateField('service1.compositionSection.decorativeElements.pinkSquare', e.target.value)}
                        className="w-12 h-12 cursor-pointer border rounded"
                      />
                      <input
                        type="text"
                        value={pageData.service1.compositionSection.decorativeElements.pinkSquare}
                        onChange={(e) => updateField('service1.compositionSection.decorativeElements.pinkSquare', e.target.value)}
                        className="flex-1 border rounded-lg p-2 font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Couleur du carré noir</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={pageData.service1.compositionSection.decorativeElements.blackSquare}
                        onChange={(e) => updateField('service1.compositionSection.decorativeElements.blackSquare', e.target.value)}
                        className="w-12 h-12 cursor-pointer border rounded"
                      />
                      <input
                        type="text"
                        value={pageData.service1.compositionSection.decorativeElements.blackSquare}
                        onChange={(e) => updateField('service1.compositionSection.decorativeElements.blackSquare', e.target.value)}
                        className="flex-1 border rounded-lg p-2 font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">Fonctionnalités</h4>
                  <div className="space-y-4">
                    {pageData.service1.compositionSection.features.map((feature, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h5 className="font-medium">Fonctionnalité {index + 1}</h5>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const newFeatures = moveItem(pageData.service1.compositionSection.features, index, 'up');
                                updateField('service1.compositionSection.features', newFeatures);
                              }}
                              disabled={index === 0}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 border"
                            >
                              <ChevronUp size={20} />
                            </button>
                            <button
                              onClick={() => {
                                const newFeatures = moveItem(pageData.service1.compositionSection.features, index, 'down');
                                updateField('service1.compositionSection.features', newFeatures);
                              }}
                              disabled={index === pageData.service1.compositionSection.features.length - 1}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 border"
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
                                const newFeatures = [...pageData.service1.compositionSection.features];
                                newFeatures[index].icon = e.target.value;
                                updateField('service1.compositionSection.features', newFeatures);
                              }}
                              className="w-full border rounded-lg p-2"
                              placeholder="ex: Gem, Home, etc."
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Titre</label>
                            <input
                              type="text"
                              value={feature.title}
                              onChange={(e) => {
                                const newFeatures = [...pageData.service1.compositionSection.features];
                                newFeatures[index].title = e.target.value;
                                updateField('service1.compositionSection.features', newFeatures);
                              }}
                              className="w-full border rounded-lg p-2"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'cta' && (
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Zap size={24} />
                CTA Section - Service 1
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre</label>
                  <textarea
                    value={pageData.service1.ctaSection.title}
                    onChange={(e) => updateField('service1.ctaSection.title', e.target.value)}
                    className="w-full border rounded-lg p-3 h-20"
                  />
                  <LineBreakInfo fieldName="le titre" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={pageData.service1.ctaSection.description}
                    onChange={(e) => updateField('service1.ctaSection.description', e.target.value)}
                    className="w-full border rounded-lg p-3 h-32"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Texte du bouton</label>
                  <input
                    type="text"
                    value={pageData.service1.ctaSection.buttonText}
                    onChange={(e) => updateField('service1.ctaSection.buttonText', e.target.value)}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Layout</label>
                  <select
                    value={pageData.service1.ctaSection.layout}
                    onChange={(e) => updateField('service1.ctaSection.layout', e.target.value)}
                    className="w-full border rounded-lg p-3"
                  >
                    <option value="split">Split Layout</option>
                    <option value="grid">Grid Layout</option>
                  </select>
                </div>

                <ImageEditor
                  label="Image principale"
                  value={pageData.service1.ctaSection.image}
                  fieldPath="service1.ctaSection.image"
                />

                <div>
                  <h4 className="text-lg font-medium mb-4">Cartes de fonctionnalités</h4>
                  <div className="space-y-4">
                    {pageData.service1.ctaSection.featureCards.map((card, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h5 className="font-medium">Carte {index + 1}</h5>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const newCards = moveItem(pageData.service1.ctaSection.featureCards, index, 'up');
                                updateField('service1.ctaSection.featureCards', newCards);
                              }}
                              disabled={index === 0}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 border"
                            >
                              <ChevronUp size={20} />
                            </button>
                            <button
                              onClick={() => {
                                const newCards = moveItem(pageData.service1.ctaSection.featureCards, index, 'down');
                                updateField('service1.ctaSection.featureCards', newCards);
                              }}
                              disabled={index === pageData.service1.ctaSection.featureCards.length - 1}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 border"
                            >
                              <ChevronDown size={20} />
                            </button>
                            <button
                              onClick={() => removeFeatureCard(index)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded border"
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
                              value={card.icon}
                              onChange={(e) => {
                                const newCards = [...pageData.service1.ctaSection.featureCards];
                                newCards[index].icon = e.target.value;
                                updateField('service1.ctaSection.featureCards', newCards);
                              }}
                              className="w-full border rounded-lg p-2"
                              placeholder="ex: Bed, Sofa, etc."
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Titre</label>
                            <input
                              type="text"
                              value={card.title}
                              onChange={(e) => {
                                const newCards = [...pageData.service1.ctaSection.featureCards];
                                newCards[index].title = e.target.value;
                                updateField('service1.ctaSection.featureCards', newCards);
                              }}
                              className="w-full border rounded-lg p-2"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                              value={card.description}
                              onChange={(e) => {
                                const newCards = [...pageData.service1.ctaSection.featureCards];
                                newCards[index].description = e.target.value;
                                updateField('service1.ctaSection.featureCards', newCards);
                              }}
                              className="w-full border rounded-lg p-2 h-24"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      onClick={addFeatureCard}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 w-full border"
                    >
                      <Plus size={18} />
                      Ajouter une carte
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'features' && (
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <List size={24} />
                Features Section - Service 1
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre</label>
                  <input
                    type="text"
                    value={pageData.service1.featuresSection.title}
                    onChange={(e) => updateField('service1.featuresSection.title', e.target.value)}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Texte décoratif</label>
                  <input
                    type="text"
                    value={pageData.service1.featuresSection.decorativeText}
                    onChange={(e) => updateField('service1.featuresSection.decorativeText', e.target.value)}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Couleur de fond</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={pageData.service1.featuresSection.backgroundColor}
                      onChange={(e) => updateField('service1.featuresSection.backgroundColor', e.target.value)}
                      className="w-12 h-12 cursor-pointer border rounded"
                    />
                    <input
                      type="text"
                      value={pageData.service1.featuresSection.backgroundColor}
                      onChange={(e) => updateField('service1.featuresSection.backgroundColor', e.target.value)}
                      className="flex-1 border rounded-lg p-2 font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">Liste des fonctionnalités</h4>
                  <div className="space-y-4">
                    {pageData.service1.featuresSection.features.map((feature, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h5 className="font-medium">Fonctionnalité {index + 1}</h5>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const newFeatures = moveItem(pageData.service1.featuresSection.features, index, 'up');
                                updateField('service1.featuresSection.features', newFeatures);
                              }}
                              disabled={index === 0}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 border"
                            >
                              <ChevronUp size={20} />
                            </button>
                            <button
                              onClick={() => {
                                const newFeatures = moveItem(pageData.service1.featuresSection.features, index, 'down');
                                updateField('service1.featuresSection.features', newFeatures);
                              }}
                              disabled={index === pageData.service1.featuresSection.features.length - 1}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 border"
                            >
                              <ChevronDown size={20} />
                            </button>
                            <button
                              onClick={() => removeFeature('featuresSection', index)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded border"
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
                                const newFeatures = [...pageData.service1.featuresSection.features];
                                newFeatures[index].icon = e.target.value;
                                updateField('service1.featuresSection.features', newFeatures);
                              }}
                              className="w-full border rounded-lg p-2"
                              placeholder="ex: FileText, Bed, Utensils"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">Titre</label>
                            <input
                              type="text"
                              value={feature.title}
                              onChange={(e) => {
                                const newFeatures = [...pageData.service1.featuresSection.features];
                                newFeatures[index].title = e.target.value;
                                updateField('service1.featuresSection.features', newFeatures);
                              }}
                              className="w-full border rounded-lg p-2"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                              value={feature.description}
                              onChange={(e) => {
                                const newFeatures = [...pageData.service1.featuresSection.features];
                                newFeatures[index].description = e.target.value;
                                updateField('service1.featuresSection.features', newFeatures);
                              }}
                              className="w-full border rounded-lg p-2 h-24"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => addFeature('featuresSection')}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 w-full border"
                    >
                      <Plus size={18} />
                      Ajouter une fonctionnalité
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'dark' && (
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Square size={24} />
                Dark Section - Service 1
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre</label>
                  <textarea
                    value={pageData.service1.darkSection.title}
                    onChange={(e) => updateField('service1.darkSection.title', e.target.value)}
                    className="w-full border rounded-lg p-3 h-20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sous-titre</label>
                  <input
                    type="text"
                    value={pageData.service1.darkSection.subtitle}
                    onChange={(e) => updateField('service1.darkSection.subtitle', e.target.value)}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={pageData.service1.darkSection.description}
                    onChange={(e) => updateField('service1.darkSection.description', e.target.value)}
                    className="w-full border rounded-lg p-3 h-28"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ImageEditor
                    label="Image 1"
                    value={pageData.service1.darkSection.image1}
                    fieldPath="service1.darkSection.image1"
                  />
                  <ImageEditor
                    label="Image 2"
                    value={pageData.service1.darkSection.image2}
                    fieldPath="service1.darkSection.image2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Texte du bouton</label>
                  <input
                    type="text"
                    value={pageData.service1.darkSection.buttonText}
                    onChange={(e) => updateField('service1.darkSection.buttonText', e.target.value)}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Couleur d'accent</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={pageData.service1.darkSection.accentColor}
                      onChange={(e) => updateField('service1.darkSection.accentColor', e.target.value)}
                      className="w-12 h-12 cursor-pointer border rounded"
                    />
                    <input
                      type="text"
                      value={pageData.service1.darkSection.accentColor}
                      onChange={(e) => updateField('service1.darkSection.accentColor', e.target.value)}
                      className="flex-1 border rounded-lg p-2 font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">Points clés</h4>
                  <div className="space-y-4">
                    {pageData.service1.darkSection.features.map((f, idx) => (
                      <div key={f.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h5 className="font-medium">Point {idx + 1}</h5>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const newFeatures = moveItem(pageData.service1.darkSection.features, idx, 'up');
                                updateField('service1.darkSection.features', newFeatures);
                              }}
                              disabled={idx === 0}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 border"
                            >
                              <ChevronUp size={20} />
                            </button>
                            <button
                              onClick={() => {
                                const newFeatures = moveItem(pageData.service1.darkSection.features, idx, 'down');
                                updateField('service1.darkSection.features', newFeatures);
                              }}
                              disabled={idx === pageData.service1.darkSection.features.length - 1}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 border"
                            >
                              <ChevronDown size={20} />
                            </button>
                            <button
                              onClick={() => removeFeature('darkSection', idx)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded border"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">ID</label>
                          <input
                            type="text"
                            value={f.id}
                            onChange={(e) => {
                              const newF = [...pageData.service1.darkSection.features];
                              newF[idx].id = e.target.value;
                              updateField('service1.darkSection.features', newF);
                            }}
                            className="w-full border rounded-lg p-2 mb-2"
                          />

                          <label className="block text-sm font-medium mb-1">Texte</label>
                          <input
                            type="text"
                            value={f.text}
                            onChange={(e) => {
                              const newF = [...pageData.service1.darkSection.features];
                              newF[idx].text = e.target.value;
                              updateField('service1.darkSection.features', newF);
                            }}
                            className="w-full border rounded-lg p-2"
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => addFeature('darkSection')}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 w-full border"
                    >
                      <Plus size={18} />
                      Ajouter un point
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'faq' && (
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <HelpCircle size={24} />
                FAQ - Service 2
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre</label>
                  <input
                    type="text"
                    value={pageData.service2.faqSection.title}
                    onChange={(e) => updateField('service2.faqSection.title', e.target.value)}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={pageData.service2.faqSection.description}
                    onChange={(e) => updateField('service2.faqSection.description', e.target.value)}
                    className="w-full border rounded-lg p-3 h-24"
                  />
                </div>

                <ImageEditor
                  label="Image FAQ"
                  value={pageData.service2.faqSection.image}
                  fieldPath="service2.faqSection.image"
                />

                <div>
                  <h4 className="text-lg font-medium mb-4">Questions</h4>
                  <div className="space-y-4">
                    {pageData.service2.faqSection.questions.map((q, idx) => (
                      <div key={idx} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h5 className="font-medium">Question {idx + 1}</h5>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const newQs = moveItem(pageData.service2.faqSection.questions, idx, 'up');
                                updateField('service2.faqSection.questions', newQs);
                              }}
                              disabled={idx === 0}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 border"
                            >
                              <ChevronUp size={20} />
                            </button>
                            <button
                              onClick={() => {
                                const newQs = moveItem(pageData.service2.faqSection.questions, idx, 'down');
                                updateField('service2.faqSection.questions', newQs);
                              }}
                              disabled={idx === pageData.service2.faqSection.questions.length - 1}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 border"
                            >
                              <ChevronDown size={20} />
                            </button>
                            <button
                              onClick={() => removeFAQItem(idx)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded border"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">Question</label>
                            <input
                              type="text"
                              value={q.question}
                              onChange={(e) => {
                                const newQs = [...pageData.service2.faqSection.questions];
                                newQs[idx].question = e.target.value;
                                updateField('service2.faqSection.questions', newQs);
                              }}
                              className="w-full border rounded-lg p-2"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">Réponse</label>
                            <textarea
                              value={q.answer}
                              onChange={(e) => {
                                const newQs = [...pageData.service2.faqSection.questions];
                                newQs[idx].answer = e.target.value;
                                updateField('service2.faqSection.questions', newQs);
                              }}
                              className="w-full border rounded-lg p-2 h-24"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={addFAQItem}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 w-full border"
                    >
                      <Plus size={18} />
                      Ajouter une question
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'gallery' && (
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Image size={24} />
                Gallery - Service 2
              </h3>

              <div className="space-y-6">
                <ImageEditor
                  label="Image principale"
                  value={pageData.service2.gallerySection.mainImage}
                  fieldPath="service2.gallerySection.mainImage"
                />

                <div>
                  <label className="block text-sm font-medium mb-2">Titre</label>
                  <input
                    type="text"
                    value={pageData.service2.gallerySection.title}
                    onChange={(e) => updateField('service2.gallerySection.title', e.target.value)}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={pageData.service2.gallerySection.description}
                    onChange={(e) => updateField('service2.gallerySection.description', e.target.value)}
                    className="w-full border rounded-lg p-3 h-28"
                  />
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">Images secondaires</h4>
                  <div className="space-y-4">
                    {pageData.service2.gallerySection.secondaryImages.map((img, idx) => (
                      <div key={idx} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h5 className="font-medium">Image {idx + 1}</h5>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const newImgs = moveItem(pageData.service2.gallerySection.secondaryImages, idx, 'up');
                                updateField('service2.gallerySection.secondaryImages', newImgs);
                              }}
                              disabled={idx === 0}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 border"
                            >
                              <ChevronUp size={20} />
                            </button>
                            <button
                              onClick={() => {
                                const newImgs = moveItem(pageData.service2.gallerySection.secondaryImages, idx, 'down');
                                updateField('service2.gallerySection.secondaryImages', newImgs);
                              }}
                              disabled={idx === pageData.service2.gallerySection.secondaryImages.length - 1}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 border"
                            >
                              <ChevronDown size={20} />
                            </button>
                            <button
                              onClick={() => removeGalleryImage(idx)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded border"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">URL</label>
                          <input
                            type="text"
                            value={img}
                            onChange={(e) => {
                              const newImgs = [...pageData.service2.gallerySection.secondaryImages];
                              newImgs[idx] = e.target.value;
                              updateField('service2.gallerySection.secondaryImages', newImgs);
                            }}
                            className="w-full border rounded-lg p-2 mb-2"
                          />

                          <label className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 text-sm">
                            <Upload size={16} />
                            Télécharger
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                // reuse handleImageUpload and then replace the specific image url
                                const file = e.target.files?.[0];
                                if (!file) return;
                                serviceApi.uploadImage(file).then(res => {
                                  const newImgs = [...pageData.service2.gallerySection.secondaryImages];
                                  const cacheBusted = `${res.url}${res.url.includes('?') ? '&' : '?'}t=${Date.now()}`;
                                  newImgs[idx] = cacheBusted;
                                  updateField('service2.gallerySection.secondaryImages', newImgs);
                                  setSaveMessage({ type: 'success', text: '✅ Image téléchargée avec succès!' });
                                  setTimeout(() => setSaveMessage(null), 2000);
                                }).catch(err => {
                                  console.error(err);
                                  setSaveMessage({ type: 'error', text: '❌ Erreur lors du téléchargement de l\'image' });
                                });
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={addGalleryImage}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 w-full border"
                    >
                      <Plus size={18} />
                      Ajouter une image
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Couleur de fond</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={pageData.service2.gallerySection.backgroundColor}
                      onChange={(e) => updateField('service2.gallerySection.backgroundColor', e.target.value)}
                      className="w-12 h-12 cursor-pointer border rounded"
                    />
                    <input
                      type="text"
                      value={pageData.service2.gallerySection.backgroundColor}
                      onChange={(e) => updateField('service2.gallerySection.backgroundColor', e.target.value)}
                      className="flex-1 border rounded-lg p-2 font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'stats' && (
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <BarChart3 size={24} />
                Statistiques
              </h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-blue-600">7</div>
                    <div className="text-sm text-blue-800">Sections</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-green-600">
                      {pageData.service1.featuresSection.features.length +
                       pageData.service1.darkSection.features.length}
                    </div>
                    <div className="text-sm text-green-800">Fonctionnalités</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-purple-600">
                      {pageData.service2.faqSection.questions.length}
                    </div>
                    <div className="text-sm text-purple-800">Questions FAQ</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-orange-600">
                      {1 + // hero
                       2 + // composition
                       1 + // cta
                       2 + // dark
                       1 + // faq
                       1 + // gallery main
                       pageData.service2.gallerySection.secondaryImages.length}
                    </div>
                    <div className="text-sm text-orange-800">Images</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Actions de gestion</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={handleExportData}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      <Download size={20} />
                      Exporter les données
                    </button>
                    
                    <label className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer">
                      <UploadIcon size={20} />
                      Importer des données
                      <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleImportData}
                      />
                    </label>
                    
                    <button
                      onClick={handleResetToDefaults}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 md:col-span-2"
                    >
                      <RefreshCw size={20} />
                      Réinitialiser aux valeurs par défaut
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium">État du système</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <span className="font-medium">Connexion backend</span>
                      <div className="flex items-center gap-2">
                        {connectionStatus.connected ? (
                          <>
                            <CheckCircle className="text-green-500" size={20} />
                            <span className="text-green-600">Connecté</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="text-red-500" size={20} />
                            <span className="text-red-600">Hors ligne</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <span className="font-medium">Dernière sauvegarde</span>
                      <span className="text-gray-600">
                        {pageData.meta?.updatedAt 
                          ? new Date(pageData.meta.updatedAt).toLocaleString()
                          : 'Jamais'
                        }
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <span className="font-medium">Version</span>
                      <span className="text-gray-600">{pageData.meta?.version || 1}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Panneau d'aperçu */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-4 border">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Eye size={20} />
                Aperçu rapide
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-medium mb-2">Service 1 - Hero</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Titre: {pageData.service1.heroSection.titleLine1}...</p>
                    <p>Image: {pageData.service1.heroSection.backgroundImage.substring(0, 20)}...</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-medium mb-2">Service 1 - Features</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Nombre: {pageData.service1.featuresSection.features.length}</p>
                    <p>Texte décoratif: {pageData.service1.featuresSection.decorativeText}</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-medium mb-2">Service 2 - FAQ</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Questions: {pageData.service2.faqSection.questions.length}</p>
                    <p>Titre: {pageData.service2.faqSection.title.substring(0, 20)}...</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-medium mb-2">Statistiques globales</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Total sections: 7</p>
                    <p>Total fonctionnalités: {pageData.service1.featuresSection.features.length + 
                                             pageData.service1.darkSection.features.length}</p>
                    <p>Total images: {pageData.service2.gallerySection.secondaryImages.length + 5}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border">
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
                      className={`flex-1 py-2 rounded-lg ${!isPreview ? 'bg-black text-white' : 'bg-gray-100 border'}`}
                    >
                      Édition
                    </button>
                    <button
                      onClick={() => setIsPreview(true)}
                      className={`flex-1 py-2 rounded-lg ${isPreview ? 'bg-blue-500 text-white' : 'bg-gray-100 border'}`}
                    >
                      Aperçu
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Actions rapides</label>
                  <div className="space-y-2">
                    <button
                      onClick={fetchPageData}
                      className="w-full py-2 border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={16} />
                      Recharger les données
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <Loader className="animate-spin" size={16} />
                          Sauvegarde...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Sauvegarder maintenant
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Statistiques</label>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Dernière sauvegarde: {saveMessage ? 'À l\'instant' : 'Jamais'}</p>
                    <p>Version: {pageData.meta?.version || 1}</p>
                    <p>Mis à jour par: {pageData.meta?.updatedBy || 'system'}</p>
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

export default ServicesEditor;