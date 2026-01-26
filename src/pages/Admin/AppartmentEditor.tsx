import React, { useState, useEffect } from 'react';
import { 
  Save, Upload, Image as ImageIcon, Trash2, Plus, 
  Eye, EyeOff, ChevronUp, ChevronDown, Settings, 
  Users, Bed, Home, MapPin, DollarSign, 
  Grid, Layout, Type, Image, Star, Tag,
  MoveUp, MoveDown, Copy, Edit3, Hash, 
  Info, AlertCircle, Calendar, Globe,
  Phone, Mail, Wifi, Car, TreePine,
  Waves, Coffee, Tv, Wind, Shield,
  RefreshCw, Download, Upload as UploadIcon,
  Database, CheckCircle, XCircle, Loader,
  ChevronRight, ExternalLink, Link,
  Maximize2, Minimize2, Palette, Lock,
  Unlock, Eye as EyeIcon, EyeOff as EyeOffIcon,
  Filter, Search, List, Grid3x3,
  BarChart3, PieChart, TrendingUp,
  Play
} from 'lucide-react';
import { apartmentApi, ApartmentPageData } from '@/services/apartmentApi';

interface ApartmentPageDataState extends Omit<ApartmentPageData, 'meta'> {
  meta?: ApartmentPageData['meta'];
}

const AppartmentEditor: React.FC = () => {
  const [activeSection, setActiveSection] = useState<
    'hero' | 'rooms' | 'features' | 'showcase' | 'perfectshow' | 
    'marquee' | 'video' | 'final' | 'stats' | 'newRoom'
  >('hero');
  
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<{ connected: boolean; message?: string }>({ connected: true });
  const [isEditingRoom, setIsEditingRoom] = useState<number | null>(null);
  const [newRoom, setNewRoom] = useState<any>({
    title: '',
    description: '',
    guests: '',
    bedrooms: '',
    price: '',
    amenities: [],
    image: ''
  });

  // Données initiales
  const [pageData, setPageData] = useState<ApartmentPageDataState>({
    heroSection: {
      titleLine1: 'INTERDUM,',
      titleLine2: 'AC ALIQUET',
      titleLine3: 'ODIO MATTIS.',
      description: 'Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
      backgroundImage: '/assets/hero-room.jpg'
    },
    roomsSection: {
      title: 'Adipiscing elit amet consectetur.',
      description: 'Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
      rooms: [
        {
          id: 1,
          image: '/assets/room-1.jpg',
          title: 'Chambre Élégante',
          description: 'Suite spacieuse avec vue panoramique',
          guests: 'jusqu\'à 4 invités',
          bedrooms: '2 chambres à coucher'
        },
        {
          id: 2,
          image: '/assets/room-2.jpg',
          title: 'Suite Royale',
          description: 'Luxueuse suite avec balcon privé',
          guests: 'jusqu\'à 6 invités',
          bedrooms: '3 chambres à coucher'
        },
        {
          id: 3,
          image: '/assets/room-3.jpg',
          title: 'Chambre Familiale',
          description: 'Parfaite pour les séjours en famille',
          guests: 'jusqu\'à 5 invités',
          bedrooms: '2 chambres à coucher'
        },
        {
          id: 4,
          image: '/assets/room-4.jpg',
          title: 'Suite Romantique',
          description: 'Ambiance intimiste et cosy',
          guests: 'jusqu\'à 2 invités',
          bedrooms: '1 chambre à coucher'
        },
        {
          id: 5,
          image: '/assets/room-5.jpg',
          title: 'Penthouse Vue Mer',
          description: 'Vue imprenable sur l\'océan',
          guests: 'jusqu\'à 8 invités',
          bedrooms: '4 chambres à coucher'
        },
        {
          id: 6,
          image: '/assets/room-6.jpg',
          title: 'Chambre Moderne',
          description: 'Design contemporain et épuré',
          guests: 'jusqu\'à 3 invités',
          bedrooms: '1 chambre à coucher'
        }
      ],
      loadMoreText: 'Affichez plus de chambres (+6)',
      showLessText: 'Réduire l\'affichage',
      backToTopText: 'Retour en haut'
    },
    featureSection: {
      mainTitle: 'Consectetur ipsum elit',
      mainDescription: 'Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
      darkCard: {
        title: 'Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
        footer: 'Amet, consectetur adipiscing elit.'
      },
      lightCard: {
        title: 'Nunc vulputate libero',
        description: 'Rorem ipsum dolor sit amet, consectetur adipiscing elit'
      },
      images: {
        small: '/assets/bedroom-small.jpg',
        large: '/assets/bedroom-large.jpg'
      },
      footerTexts: [
        'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
        'Class aptent taciti sociosqu ad litora torquent.'
      ]
    },
    showcaseSection: {
      title: 'Elit amet, consectetur',
      description: 'Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
      image: '/assets/appartement-photo.png',
      checkItems: [
        { text: 'Lorem ipsum dolor' },
        { text: 'Sit amet, consectetur' },
        { text: 'Adipiscing elit.' },
        { text: 'Curabitur tempus' }
      ],
      decorativeElements: {
        grayRectangle: '#9CA3AF',
        pinkSquare: '#FF2E63'
      }
    },
    perfectShowSection: {
      title: 'Class aptent taciti sociosqu ad litora torquent.',
      description: 'Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
      buttonText: 'Réserver maintenant',
      images: {
        main: '/assets/hotel-room-main.jpg',
        view: '/assets/hotel-room-view.jpg',
        detail: '/assets/hotel-room-detail.jpg'
      },
      footerText: 'Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia'
    },
    marqueeSection: {
      text: 'Lorem ipsum dolor •',
      backgroundColor: '#FAFAFA',
      textColor: 'hsla(0, 0%, 10%, 0.15)'
    },
    videoSection: {
      coverImage: '/assets/video-cover.jpg',
      playButtonText: 'Play Tour',
      overlayColor: 'rgba(0,0,0,0.1)'
    },
    finalSection: {
      title: 'ADIPISCING ELIT AMET, CONSECTETUR.',
      subtitle: 'Nunc vulputate libero',
      text1: 'Class aptent taciti sociosqu ad litora torquent.',
      text2: 'Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
      images: [
        '/assets/final-room-1.jpg',
        '/assets/final-room-2.jpg'
      ]
    }
  });

  // Charger les données depuis l'API
  useEffect(() => {
    checkConnection();
    fetchPageData();
  }, []);

  const checkConnection = async () => {
    try {
      const status = await apartmentApi.checkConnection();
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
      const data = await apartmentApi.getApartmentPage();
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
      const localData = await apartmentApi.loadLocalChanges();
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
      await apartmentApi.saveLocalChanges(pageData as ApartmentPageData);
      
      // Ensuite sauvegarde sur le serveur
      const savedData = await apartmentApi.updateApartmentPage(pageData);
      setPageData(savedData);
      
      // Notifier les autres onglets
      try {
        localStorage.setItem('apartment_updated', String(Date.now()));
      } catch (err) {
        // ignore
      }
      
      setSaveMessage({ type: 'success', text: '✅ Page appartements sauvegardée avec succès!' });
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
      const result = await apartmentApi.uploadImage(file);
      
      // Traiter les chemins avec indices de tableau (pour les chambres)
      const roomMatch = fieldPath.match(/roomsSection\.rooms\[(\d+)\]\.(.+)/);
      if (roomMatch) {
        const roomIndex = parseInt(roomMatch[1]);
        const fieldName = roomMatch[2];
        updateRoom(roomIndex, fieldName, result.url);
      } else {
        updateField(fieldPath, result.url);
      }
      
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

  const addRoom = () => {
    const newRoomData = {
      id: Date.now(),
      image: '/assets/room-default.jpg',
      title: 'Nouvelle chambre',
      description: 'Description de la nouvelle chambre',
      guests: 'jusqu\'à 2 invités',
      bedrooms: '1 chambre à coucher'
    };

    setPageData(prev => ({
      ...prev,
      roomsSection: {
        ...prev.roomsSection,
        rooms: [...prev.roomsSection.rooms, newRoomData]
      }
    }));

    setSaveMessage({ type: 'success', text: '✅ Nouvelle chambre ajoutée!' });
    setTimeout(() => setSaveMessage(null), 2000);
  };

  const updateRoom = (index: number, field: string, value: any) => {
    const newRooms = [...pageData.roomsSection.rooms];
    newRooms[index] = { ...newRooms[index], [field]: value };
    
    setPageData(prev => ({
      ...prev,
      roomsSection: {
        ...prev.roomsSection,
        rooms: newRooms
      }
    }));
  };

  const deleteRoom = (index: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette chambre ?')) {
      const newRooms = pageData.roomsSection.rooms.filter((_, i) => i !== index);
      
      setPageData(prev => ({
        ...prev,
        roomsSection: {
          ...prev.roomsSection,
          rooms: newRooms
        }
      }));

      setSaveMessage({ type: 'success', text: '✅ Chambre supprimée!' });
      setTimeout(() => setSaveMessage(null), 2000);
    }
  };

  const moveRoom = (index: number, direction: 'up' | 'down') => {
    const newRooms = [...pageData.roomsSection.rooms];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= newRooms.length) return;
    
    [newRooms[index], newRooms[newIndex]] = [newRooms[newIndex], newRooms[index]];
    
    setPageData(prev => ({
      ...prev,
      roomsSection: {
        ...prev.roomsSection,
        rooms: newRooms
      }
    }));
  };

  const addCheckItem = () => {
    const newItems = [...pageData.showcaseSection.checkItems, { text: 'Nouvel élément' }];
    updateField('showcaseSection.checkItems', newItems);
  };

  const updateCheckItem = (index: number, value: string) => {
    const newItems = [...pageData.showcaseSection.checkItems];
    newItems[index].text = value;
    updateField('showcaseSection.checkItems', newItems);
  };

  const deleteCheckItem = (index: number) => {
    const newItems = pageData.showcaseSection.checkItems.filter((_, i) => i !== index);
    updateField('showcaseSection.checkItems', newItems);
  };

  const handleResetToDefaults = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données aux valeurs par défaut ?')) {
      try {
        const data = await apartmentApi.resetToDefaults();
        setPageData(data);
        setSaveMessage({ type: 'success', text: '✅ Données réinitialisées avec succès!' });
      } catch (error) {
        setSaveMessage({ type: 'error', text: '❌ Erreur lors de la réinitialisation' });
      }
    }
  };

  const handleExportData = async () => {
    try {
      const { data, timestamp } = await apartmentApi.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `apartments-backup-${timestamp}.json`;
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
        const savedData = await apartmentApi.importData(data);
        setPageData(savedData);
        setSaveMessage({ type: 'success', text: '✅ Données importées avec succès!' });
      } catch (error) {
        setSaveMessage({ type: 'error', text: '❌ Erreur lors de l\'importation: fichier invalide' });
      }
    };
    reader.readAsText(file);
  };

  // Composant d'édition d'image avec prévisualisation
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
        <div className="w-24 h-24 rounded-lg overflow-hidden border bg-gray-100">
          <img 
            src={value} 
            alt="Preview" 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlNWU1ZTUiLz48cGF0aCBkPSJNMzUgNDVINTVWNjVINzVMNTAgODVMNzUgNjVWNjVINzVWNDVINTVWMjVINzVWMjVINzVWNDVINzVWNDVINzVWNDVINzVWNDVINzVWNDVINzVWNDVINzVWNDVINzVWNDVINzVWNDVINzVWNDVINzVWNDVINzVWNDVINzUiIHN0cm9rZT0iIzk5OSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+';
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
          <p className="mt-4 text-gray-600">Chargement des données appartements...</p>
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
            <AlertCircle className="text-red-500" size={20} />
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
            <h1 className="text-3xl font-bold text-gray-900">Éditeur de la page Appartements</h1>
            <p className="text-gray-600">Modifiez tous les éléments de votre page Appartements</p>
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
            { id: 'hero', label: 'Hero', icon: Home },
            { id: 'rooms', label: 'Chambres', icon: Bed },
            { id: 'features', label: 'Features', icon: Star },
            { id: 'showcase', label: 'Showcase', icon: Grid },
            { id: 'perfectshow', label: 'Perfect Show', icon: EyeIcon },
            { id: 'marquee', label: 'Marquee', icon: TrendingUp },
            { id: 'video', label: 'Vidéo', icon: Play },
            { id: 'final', label: 'Final Section', icon: CheckCircle },
            { id: 'stats', label: 'Statistiques', icon: BarChart3 },
            { id: 'newRoom', label: '+ Chambre', icon: Plus }
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
                <Home size={24} />
                Hero Section
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre (ligne 1)</label>
                  <input
                    type="text"
                    value={pageData.heroSection.titleLine1}
                    onChange={(e) => updateField('heroSection.titleLine1', e.target.value)}
                    className="w-full border rounded-lg p-3 font-bold text-lg uppercase"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Titre (ligne 2)</label>
                  <input
                    type="text"
                    value={pageData.heroSection.titleLine2}
                    onChange={(e) => updateField('heroSection.titleLine2', e.target.value)}
                    className="w-full border rounded-lg p-3 font-bold text-lg uppercase"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Titre (ligne 3)</label>
                  <input
                    type="text"
                    value={pageData.heroSection.titleLine3}
                    onChange={(e) => updateField('heroSection.titleLine3', e.target.value)}
                    className="w-full border rounded-lg p-3 font-bold text-lg uppercase"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={pageData.heroSection.description}
                    onChange={(e) => updateField('heroSection.description', e.target.value)}
                    className="w-full border rounded-lg p-3 h-32"
                  />
                </div>

                <ImageEditor
                  label="Image d'arrière-plan"
                  value={pageData.heroSection.backgroundImage}
                  fieldPath="heroSection.backgroundImage"
                />
              </div>
            </div>
          )}

          {activeSection === 'rooms' && (
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Bed size={24} />
                Section Chambres
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre de la section</label>
                  <input
                    type="text"
                    value={pageData.roomsSection.title}
                    onChange={(e) => updateField('roomsSection.title', e.target.value)}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={pageData.roomsSection.description}
                    onChange={(e) => updateField('roomsSection.description', e.target.value)}
                    className="w-full border rounded-lg p-3 h-32"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Texte "Afficher plus"</label>
                  <input
                    type="text"
                    value={pageData.roomsSection.loadMoreText}
                    onChange={(e) => updateField('roomsSection.loadMoreText', e.target.value)}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">Gestion des chambres ({pageData.roomsSection.rooms.length})</h4>
                  <div className="space-y-4">
                    {pageData.roomsSection.rooms.map((room, index) => (
                      <div key={room.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h5 className="font-medium">Chambre {index + 1}: {room.title}</h5>
                          <div className="flex gap-2">
                            <button
                              onClick={() => moveRoom(index, 'up')}
                              disabled={index === 0}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 border"
                            >
                              <ChevronUp size={20} />
                            </button>
                            <button
                              onClick={() => moveRoom(index, 'down')}
                              disabled={index === pageData.roomsSection.rooms.length - 1}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 border"
                            >
                              <ChevronDown size={20} />
                            </button>
                            <button
                              onClick={() => setIsEditingRoom(isEditingRoom === index ? null : index)}
                              className={`p-1 rounded border ${
                                isEditingRoom === index 
                                  ? 'bg-blue-100 text-blue-600' 
                                  : 'hover:bg-gray-100'
                              }`}
                            >
                              <Edit3 size={18} />
                            </button>
                            <button
                              onClick={() => deleteRoom(index)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded border"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        {isEditingRoom === index ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">Titre</label>
                                <input
                                  type="text"
                                  value={room.title}
                                  onChange={(e) => updateRoom(index, 'title', e.target.value)}
                                  className="w-full border rounded-lg p-2"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium mb-1">ID</label>
                                <input
                                  type="number"
                                  value={room.id}
                                  onChange={(e) => updateRoom(index, 'id', parseInt(e.target.value))}
                                  className="w-full border rounded-lg p-2"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1">Description</label>
                              <textarea
                                value={room.description}
                                onChange={(e) => updateRoom(index, 'description', e.target.value)}
                                className="w-full border rounded-lg p-2 h-20"
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">Nombre d'invités</label>
                                <input
                                  type="text"
                                  value={room.guests}
                                  onChange={(e) => updateRoom(index, 'guests', e.target.value)}
                                  className="w-full border rounded-lg p-2"
                                  placeholder="ex: jusqu'à 4 invités"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium mb-1">Chambres à coucher</label>
                                <input
                                  type="text"
                                  value={room.bedrooms}
                                  onChange={(e) => updateRoom(index, 'bedrooms', e.target.value)}
                                  className="w-full border rounded-lg p-2"
                                  placeholder="ex: 2 chambres à coucher"
                                />
                              </div>
                            </div>

                            <ImageEditor
                              label="Image de la chambre"
                              value={room.image}
                              fieldPath={`roomsSection.rooms[${index}].image`}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded overflow-hidden">
                              <img src={room.image} alt={room.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-medium">{room.title}</p>
                              <p className="text-sm text-gray-600">{room.description}</p>
                              <div className="flex gap-2 mt-1">
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {room.guests}
                                </span>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {room.bedrooms}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <button
                      onClick={addRoom}
                      className="flex items-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full justify-center"
                    >
                      <Plus size={20} />
                      Ajouter une nouvelle chambre
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'features' && (
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Star size={24} />
                Feature Section
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre principal</label>
                  <input
                    type="text"
                    value={pageData.featureSection.mainTitle}
                    onChange={(e) => updateField('featureSection.mainTitle', e.target.value)}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description principale</label>
                  <textarea
                    value={pageData.featureSection.mainDescription}
                    onChange={(e) => updateField('featureSection.mainDescription', e.target.value)}
                    className="w-full border rounded-lg p-3 h-32"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Carte sombre</h4>
                    <div>
                      <label className="block text-sm font-medium mb-1">Titre</label>
                      <textarea
                        value={pageData.featureSection.darkCard.title}
                        onChange={(e) => updateField('featureSection.darkCard.title', e.target.value)}
                        className="w-full border rounded-lg p-2 h-20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Texte de pied</label>
                      <input
                        type="text"
                        value={pageData.featureSection.darkCard.footer}
                        onChange={(e) => updateField('featureSection.darkCard.footer', e.target.value)}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Carte claire</h4>
                    <div>
                      <label className="block text-sm font-medium mb-1">Titre</label>
                      <input
                        type="text"
                        value={pageData.featureSection.lightCard.title}
                        onChange={(e) => updateField('featureSection.lightCard.title', e.target.value)}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        value={pageData.featureSection.lightCard.description}
                        onChange={(e) => updateField('featureSection.lightCard.description', e.target.value)}
                        className="w-full border rounded-lg p-2 h-20"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageEditor
                    label="Image petite"
                    value={pageData.featureSection.images.small}
                    fieldPath="featureSection.images.small"
                  />
                  
                  <ImageEditor
                    label="Image grande"
                    value={pageData.featureSection.images.large}
                    fieldPath="featureSection.images.large"
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Textes de pied</h4>
                  {pageData.featureSection.footerTexts.map((text, index) => (
                    <div key={index} className="flex gap-2">
                      <textarea
                        value={text}
                        onChange={(e) => {
                          const newTexts = [...pageData.featureSection.footerTexts];
                          newTexts[index] = e.target.value;
                          updateField('featureSection.footerTexts', newTexts);
                        }}
                        className="flex-1 border rounded-lg p-2 h-20"
                      />
                      <button
                        onClick={() => {
                          const newTexts = pageData.featureSection.footerTexts.filter((_, i) => i !== index);
                          updateField('featureSection.footerTexts', newTexts);
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg border"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newTexts = [...pageData.featureSection.footerTexts, 'Nouveau texte'];
                      updateField('featureSection.footerTexts', newTexts);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    <Plus size={18} />
                    Ajouter un texte
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'showcase' && (
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Grid size={24} />
                Showcase Section
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre</label>
                  <input
                    type="text"
                    value={pageData.showcaseSection.title}
                    onChange={(e) => updateField('showcaseSection.title', e.target.value)}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={pageData.showcaseSection.description}
                    onChange={(e) => updateField('showcaseSection.description', e.target.value)}
                    className="w-full border rounded-lg p-3 h-32"
                  />
                </div>

                <ImageEditor
                  label="Image principale"
                  value={pageData.showcaseSection.image}
                  fieldPath="showcaseSection.image"
                />

                <div className="space-y-4">
                  <h4 className="font-medium">Éléments à cocher ({pageData.showcaseSection.checkItems.length})</h4>
                  <div className="space-y-3">
                    {pageData.showcaseSection.checkItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={item.text}
                            onChange={(e) => updateCheckItem(index, e.target.value)}
                            className="w-full border rounded-lg p-2"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const newItems = [...pageData.showcaseSection.checkItems];
                              const newIndex = index - 1;
                              if (newIndex >= 0) {
                                [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
                                updateField('showcaseSection.checkItems', newItems);
                              }
                            }}
                            disabled={index === 0}
                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 border"
                          >
                            <ChevronUp size={18} />
                          </button>
                          <button
                            onClick={() => {
                              const newItems = [...pageData.showcaseSection.checkItems];
                              const newIndex = index + 1;
                              if (newIndex < newItems.length) {
                                [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
                                updateField('showcaseSection.checkItems', newItems);
                              }
                            }}
                            disabled={index === pageData.showcaseSection.checkItems.length - 1}
                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 border"
                          >
                            <ChevronDown size={18} />
                          </button>
                          <button
                            onClick={() => deleteCheckItem(index)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded border"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      onClick={addCheckItem}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      <Plus size={18} />
                      Ajouter un élément
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Couleur rectangle gris</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={pageData.showcaseSection.decorativeElements.grayRectangle}
                        onChange={(e) => updateField('showcaseSection.decorativeElements.grayRectangle', e.target.value)}
                        className="w-12 h-12 cursor-pointer border rounded"
                      />
                      <input
                        type="text"
                        value={pageData.showcaseSection.decorativeElements.grayRectangle}
                        onChange={(e) => updateField('showcaseSection.decorativeElements.grayRectangle', e.target.value)}
                        className="flex-1 border rounded-lg p-2 font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Couleur carré rose</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={pageData.showcaseSection.decorativeElements.pinkSquare}
                        onChange={(e) => updateField('showcaseSection.decorativeElements.pinkSquare', e.target.value)}
                        className="w-12 h-12 cursor-pointer border rounded"
                      />
                      <input
                        type="text"
                        value={pageData.showcaseSection.decorativeElements.pinkSquare}
                        onChange={(e) => updateField('showcaseSection.decorativeElements.pinkSquare', e.target.value)}
                        className="flex-1 border rounded-lg p-2 font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'perfectshow' && (
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <EyeIcon size={24} />
                Perfect Show Section
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre</label>
                  <textarea
                    value={pageData.perfectShowSection.title}
                    onChange={(e) => updateField('perfectShowSection.title', e.target.value)}
                    className="w-full border rounded-lg p-3 h-20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={pageData.perfectShowSection.description}
                    onChange={(e) => updateField('perfectShowSection.description', e.target.value)}
                    className="w-full border rounded-lg p-3 h-32"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Texte du bouton</label>
                  <input
                    type="text"
                    value={pageData.perfectShowSection.buttonText}
                    onChange={(e) => updateField('perfectShowSection.buttonText', e.target.value)}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ImageEditor
                    label="Image principale"
                    value={pageData.perfectShowSection.images.main}
                    fieldPath="perfectShowSection.images.main"
                  />
                  
                  <ImageEditor
                    label="Image vue"
                    value={pageData.perfectShowSection.images.view}
                    fieldPath="perfectShowSection.images.view"
                  />
                  
                  <ImageEditor
                    label="Image détail"
                    value={pageData.perfectShowSection.images.detail}
                    fieldPath="perfectShowSection.images.detail"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Texte de pied</label>
                  <textarea
                    value={pageData.perfectShowSection.footerText}
                    onChange={(e) => updateField('perfectShowSection.footerText', e.target.value)}
                    className="w-full border rounded-lg p-3 h-20"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'marquee' && (
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp size={24} />
                Marquee Section
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Texte défilant</label>
                  <input
                    type="text"
                    value={pageData.marqueeSection.text}
                    onChange={(e) => updateField('marqueeSection.text', e.target.value)}
                    className="w-full border rounded-lg p-3"
                    placeholder="Texte avec • séparateurs"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Le texte sera répété automatiquement. Utilisez " • " pour séparer les éléments.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Couleur de fond</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={pageData.marqueeSection.backgroundColor}
                        onChange={(e) => updateField('marqueeSection.backgroundColor', e.target.value)}
                        className="w-12 h-12 cursor-pointer border rounded"
                      />
                      <input
                        type="text"
                        value={pageData.marqueeSection.backgroundColor}
                        onChange={(e) => updateField('marqueeSection.backgroundColor', e.target.value)}
                        className="flex-1 border rounded-lg p-2 font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Couleur du texte</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={pageData.marqueeSection.textColor}
                        onChange={(e) => updateField('marqueeSection.textColor', e.target.value)}
                        className="w-12 h-12 cursor-pointer border rounded"
                      />
                      <input
                        type="text"
                        value={pageData.marqueeSection.textColor}
                        onChange={(e) => updateField('marqueeSection.textColor', e.target.value)}
                        className="flex-1 border rounded-lg p-2 font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'video' && (
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Play size={24} />
                Video Section
              </h3>
              
              <div className="space-y-6">
                <ImageEditor
                  label="Image de couverture"
                  value={pageData.videoSection.coverImage}
                  fieldPath="videoSection.coverImage"
                />

                <div>
                  <label className="block text-sm font-medium mb-2">Texte du bouton play</label>
                  <input
                    type="text"
                    value={pageData.videoSection.playButtonText}
                    onChange={(e) => updateField('videoSection.playButtonText', e.target.value)}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Couleur d'overlay</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={pageData.videoSection.overlayColor}
                      onChange={(e) => updateField('videoSection.overlayColor', e.target.value)}
                      className="w-12 h-12 cursor-pointer border rounded"
                    />
                    <input
                      type="text"
                      value={pageData.videoSection.overlayColor}
                      onChange={(e) => updateField('videoSection.overlayColor', e.target.value)}
                      className="flex-1 border rounded-lg p-2 font-mono text-sm"
                      placeholder="rgba(0,0,0,0.1)"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'final' && (
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle size={24} />
                Final Section
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre</label>
                  <textarea
                    value={pageData.finalSection.title}
                    onChange={(e) => updateField('finalSection.title', e.target.value)}
                    className="w-full border rounded-lg p-3 h-20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sous-titre</label>
                  <input
                    type="text"
                    value={pageData.finalSection.subtitle}
                    onChange={(e) => updateField('finalSection.subtitle', e.target.value)}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Texte 1</label>
                  <input
                    type="text"
                    value={pageData.finalSection.text1}
                    onChange={(e) => updateField('finalSection.text1', e.target.value)}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Texte 2</label>
                  <textarea
                    value={pageData.finalSection.text2}
                    onChange={(e) => updateField('finalSection.text2', e.target.value)}
                    className="w-full border rounded-lg p-3 h-32"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ImageEditor
                    label="Image 1"
                    value={pageData.finalSection.images[0]}
                    fieldPath="finalSection.images.0"
                  />
                  
                  <ImageEditor
                    label="Image 2"
                    value={pageData.finalSection.images[1]}
                    fieldPath="finalSection.images.1"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'newRoom' && (
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus size={24} />
                Ajouter une nouvelle chambre
              </h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Titre</label>
                    <input
                      type="text"
                      value={newRoom.title}
                      onChange={(e) => setNewRoom({...newRoom, title: e.target.value})}
                      className="w-full border rounded-lg p-3"
                      placeholder="ex: Suite Présidentielle"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">ID unique</label>
                    <input
                      type="number"
                      value={newRoom.id}
                      onChange={(e) => setNewRoom({...newRoom, id: parseInt(e.target.value)})}
                      className="w-full border rounded-lg p-3"
                      placeholder="ex: 10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={newRoom.description}
                    onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
                    className="w-full border rounded-lg p-3 h-24"
                    placeholder="ex: Le summum du luxe et du confort"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Capacité d'invités</label>
                    <input
                      type="text"
                      value={newRoom.guests}
                      onChange={(e) => setNewRoom({...newRoom, guests: e.target.value})}
                      className="w-full border rounded-lg p-3"
                      placeholder="ex: jusqu'à 10 invités"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre de chambres</label>
                    <input
                      type="text"
                      value={newRoom.bedrooms}
                      onChange={(e) => setNewRoom({...newRoom, bedrooms: e.target.value})}
                      className="w-full border rounded-lg p-3"
                      placeholder="ex: 5 chambres à coucher"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-32 rounded-lg overflow-hidden border bg-gray-100">
                      {newRoom.image ? (
                        <img src={newRoom.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ImageIcon size={32} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={newRoom.image}
                        onChange={(e) => setNewRoom({...newRoom, image: e.target.value})}
                        className="w-full border rounded-lg p-2 mb-2"
                        placeholder="URL de l'image"
                      />
                      <label className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 text-sm">
                        <Upload size={16} />
                        Télécharger une image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            
                            try {
                              const result = await apartmentApi.uploadImage(file);
                              setNewRoom({...newRoom, image: result.url});
                              setSaveMessage({ type: 'success', text: '✅ Image téléchargée!' });
                              setTimeout(() => setSaveMessage(null), 2000);
                            } catch (error) {
                              setSaveMessage({ type: 'error', text: '❌ Erreur lors du téléchargement' });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      const roomToAdd = {
                        id: newRoom.id || Date.now(),
                        image: newRoom.image || '/assets/room-default.jpg',
                        title: newRoom.title || 'Nouvelle chambre',
                        description: newRoom.description || 'Description de la nouvelle chambre',
                        guests: newRoom.guests || 'jusqu\'à 2 invités',
                        bedrooms: newRoom.bedrooms || '1 chambre à coucher'
                      };

                      addRoom();
                      setNewRoom({
                        title: '',
                        description: '',
                        guests: '',
                        bedrooms: '',
                        price: '',
                        amenities: [],
                        image: ''
                      });
                    }}
                    className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    Ajouter la chambre
                  </button>
                  
                  <button
                    onClick={() => {
                      setNewRoom({
                        title: '',
                        description: '',
                        guests: '',
                        bedrooms: '',
                        price: '',
                        amenities: [],
                        image: ''
                      });
                    }}
                    className="px-6 py-3 border rounded-lg hover:bg-gray-50"
                  >
                    Réinitialiser
                  </button>
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
                    <div className="text-2xl font-bold text-blue-600">8</div>
                    <div className="text-sm text-blue-800">Sections</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-green-600">
                      {pageData.roomsSection.rooms.length}
                    </div>
                    <div className="text-sm text-green-800">Chambres</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-purple-600">
                      {pageData.showcaseSection.checkItems.length}
                    </div>
                    <div className="text-sm text-purple-800">Éléments checklist</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-orange-600">
                      {1 + // hero
                       3 + // feature section images
                       1 + // showcase image
                       3 + // perfect show images
                       1 + // video cover
                       2 + // final images
                       pageData.roomsSection.rooms.length}
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
                  <h4 className="font-medium mb-2">Hero Section</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Titre: {pageData.heroSection.titleLine1}...</p>
                    <p>Image: {pageData.heroSection.backgroundImage.substring(0, 20)}...</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-medium mb-2">Chambres</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Nombre: {pageData.roomsSection.rooms.length}</p>
                    <p>Titre section: {pageData.roomsSection.title.substring(0, 20)}...</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-medium mb-2">Showcase</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Check items: {pageData.showcaseSection.checkItems.length}</p>
                    <p>Image: {pageData.showcaseSection.image.substring(0, 20)}...</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-medium mb-2">Statistiques globales</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Total sections: 8</p>
                    <p>Total chambres: {pageData.roomsSection.rooms.length}</p>
                    <p>Total images: {pageData.roomsSection.rooms.length + 11}</p>
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

export default AppartmentEditor;