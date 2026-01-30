import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
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
  Play, Check, X
} from 'lucide-react';
import VideoUploader from '@/components/admin/VideoUploader';
import { apartmentApi, ApartmentPageData } from '@/services/apartmentApi';
import { roomDetailApi, RoomDetail } from '@/services/roomDetailApi';
import { api } from '@/services/api';
import { imageUploadService } from '@/services/imageUploadService';

interface ApartmentPageDataState extends Omit<ApartmentPageData, 'meta'> {
  meta?: ApartmentPageData['meta'];
}

const AppartmentEditor: React.FC = () => {
  const [activeSection, setActiveSection] = useState<
    'hero' | 'rooms' | 'roomDetail' | 'features' | 'showcase' | 'perfectshow' | 
    'marquee' | 'video' | 'final' | 'stats' | 'newRoom' | 'promotion'
  >('hero');
  
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<{ connected: boolean; message?: string }>({ connected: true });
  const [isEditingRoom, setIsEditingRoom] = useState<number | null>(null);
  const [selectedRoomForDetail, setSelectedRoomForDetail] = useState<number | null>(null);
  const [roomDetail, setRoomDetail] = useState<RoomDetail | null>(null);
  const [isLoadingRoomDetail, setIsLoadingRoomDetail] = useState(false);
  const [roomDetailErrors, setRoomDetailErrors] = useState<string[]>([]);
  const [heroInfoTab, setHeroInfoTab] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [roomDetailHasChanges, setRoomDetailHasChanges] = useState(false);
  const [roomDetailLastSaved, setRoomDetailLastSaved] = useState<Date | null>(null);
  const [deleteConfirmImage, setDeleteConfirmImage] = useState<number | null>(null);
  const [autoSaveRoomDetail, setAutoSaveRoomDetail] = useState(true);
  const [availableOptions, setAvailableOptions] = useState<Record<string, any[]>>({});
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [newOptionForm, setNewOptionForm] = useState({
    name: '',
    price: '',
    pricingType: 'fixed' as 'fixed' | 'per_day' | 'per_guest'
  });
  const [uploadingOptionImages, setUploadingOptionImages] = useState<Record<string, boolean>>({});
  const [promotionData, setPromotionData] = useState<any>(null);
  const [isLoadingPromotion, setIsLoadingPromotion] = useState(false);
  const [uploadingPromoImage, setUploadingPromoImage] = useState(false);
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
      videoUrl: '',
      playButtonText: 'Play Tour',
      overlayColor: 'rgba(0,0,0,0.1)',
      galleryImages: []
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

  // Auto-save roomDetail
  useEffect(() => {
    if (!autoSaveRoomDetail || !roomDetailHasChanges || isSaving) return;

    const timer = setTimeout(async () => {
      if (roomDetailHasChanges && !isSaving) {
        console.log('[ADMIN] 🔄 Auto-saving room detail...');
        await saveRoomDetail(true); // Auto-save silently
      }
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, [roomDetailHasChanges, autoSaveRoomDetail, isSaving]);

  // Auto-save main page data when it changes (debounced)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (isSaving) return;
      try {
        console.log('[ADMIN] 🔄 Auto-saving apartment page...');
        await apartmentApi.updateApartmentPage(pageData);
      } catch (error) {
        console.error('[ADMIN] Auto-save failed:', error);
      }
    }, 3000); // 3 seconds after last change

    return () => clearTimeout(timer);
  }, [pageData, isSaving]);

  // Auto-save promotion data when it changes (debounced)
  useEffect(() => {
    if (!selectedRoomForDetail || !promotionData) return;

    const timer = setTimeout(async () => {
      if (isSaving) return;
      try {
        console.log('[ADMIN] 🔄 Auto-saving promotion...', {
          roomId: selectedRoomForDetail,
          title: promotionData.title,
          hasImage: !!promotionData.image,
          hasCardImage: !!promotionData.cardImage,
          isActive: promotionData.isActive,
          fieldsCount: Object.keys(promotionData).length
        });
        const response = await api.updatePromotion(selectedRoomForDetail, promotionData);
        if (response.success) {
          console.log('[ADMIN] ✅ Promotion auto-saved successfully!', {
            savedRoomId: response.data?.roomId,
            savedTitle: response.data?.title,
            savedImage: !!response.data?.image,
            timestamp: new Date().toLocaleTimeString()
          });
          // Mettre à jour les données locales avec la réponse du serveur
          if (response.data) {
            setPromotionData(response.data);
            console.log('[ADMIN] 🔄 Promotion data updated from server');
          }
          toast.success('✅ Promotion auto-sauvegardée');
        } else {
          console.error('[ADMIN] ❌ Auto-save failed - Server error:', response.error);
          toast.error('❌ Erreur auto-save: ' + response.error);
        }
      } catch (error) {
        console.error('[ADMIN] ❌ Auto-save exception:', error);
        toast.error('Erreur lors de la sauvegarde auto');
      }
    }, 5000); // 5 seconds after last change

    return () => clearTimeout(timer);
  }, [promotionData, selectedRoomForDetail, isSaving]);

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
      
      // Notifier les autres onglets et composants
      try {
        const timestamp = String(Date.now());
        localStorage.setItem('apartment_updated', timestamp);
        // Dispatch un événement personnalisé pour forcer le rafraîchissement
        window.dispatchEvent(new CustomEvent('apartmentDataUpdated', { 
          detail: { timestamp, data: savedData } 
        }));
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

  // Charger les détails d'une chambre
  const loadRoomDetail = async (roomId: number) => {
    console.log('[ADMIN] 🔄 Starting to load room details for roomId:', roomId);
    setIsLoadingRoomDetail(true);
    try {
      console.log('[ADMIN] Calling roomDetailApi.getRoomDetail...');
      const response = await roomDetailApi.getRoomDetail(roomId);
      console.log('[ADMIN] API Response received:', { success: response.success, hasData: !!response.data, response });
      
      if (response.success && response.data) {
        console.log('[ADMIN] ✅ Room details loaded successfully:', {
          roomId: response.data?.roomId,
          title: response.data?.title,
          price: response.data?.price,
          guests: response.data?.guests,
          bedrooms: response.data?.bedrooms,
          imagesCount: response.data?.images?.length || 0,
          includes: response.data?.includes,
          amenities: response.data?.amenities,
          features: response.data?.features
        });
        setRoomDetail(response.data);
        setSelectedRoomForDetail(roomId);
        setActiveSection('roomDetail');
        
        // Charger la promotion pour cette chambre
        loadPromotion(roomId);
        
        // Charger les options disponibles
        loadAvailableOptions();
      } else {
        console.warn('[ADMIN] ⚠️ API returned invalid response:', { success: response.success, hasData: !!response.data });
        setSaveMessage({ type: 'error', text: '❌ Impossible de charger les détails' });
      }
    } catch (error) {
      console.error('[ADMIN] ❌ Error loading room details:', error);
      setSaveMessage({ type: 'error', text: '❌ Erreur lors du chargement des détails' });
    } finally {
      setIsLoadingRoomDetail(false);
      console.log('[ADMIN] 🏁 Room detail loading completed');
    }
  };

  // Charger les options supplémentaires disponibles
  const loadAvailableOptions = async () => {
    setIsLoadingOptions(true);
    try {
      const response = await api.getAdditionalOptions(selectedRoomForDetail || undefined);
      if (response.success && response.data?.options) {
        setAvailableOptions(response.data.options);
      }
    } catch (error) {
      console.error('[ADMIN] Error loading available options:', error);
    } finally {
      setIsLoadingOptions(false);
    }
  };

  // Charger la promotion pour une chambre
  const loadPromotion = async (roomId: number) => {
    setIsLoadingPromotion(true);
    try {
      console.log('[ADMIN] 📥 Loading promotion for roomId:', roomId);
      const response = await api.getPromotion(roomId);
      if (response.success && response.data) {
        console.log('[ADMIN] ✅ Promotion loaded successfully:', {
          roomId: response.data.roomId,
          title: response.data.title,
          hasImage: !!response.data.image,
          hasCardImage: !!response.data.cardImage,
          isActive: response.data.isActive,
          fieldsCount: Object.keys(response.data).length
        });
        setPromotionData(response.data);
      } else {
        console.log('[ADMIN] ⚠️ No promotion found, initializing defaults for roomId:', roomId);
        // Si pas de promotion, initialiser avec les données par défaut
        setPromotionData({
          roomId: roomId,
          title: 'Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
          description: 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
          image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
          badge: {
            label: 'Option Premium',
            color: '#10b981'
          },
          features: [
            { text: 'Rorem ipsum dolor sit amet,' },
            { text: 'consectetur adipiscing elit' }
          ],
          bottomMessage: 'Cette option premium est automatiquement incluse dans votre réservation. Aucun coût supplémentaire.',
          isActive: true
        });
      }
    } catch (error) {
      console.error('[ADMIN] Error loading promotion:', error);
      setSaveMessage({ type: 'error', text: '❌ Erreur lors du chargement de la promotion' });
    } finally {
      setIsLoadingPromotion(false);
    }
  };

  // Sauvegarder la promotion
  const savePromotion = async () => {
    if (!selectedRoomForDetail || !promotionData) {
      console.error('[ADMIN] ❌ Missing data for save:', { selectedRoomForDetail, hasPromotionData: !!promotionData });
      toast.error('Erreur: données manquantes');
      return;
    }

    setIsSaving(true);
    try {
      console.log('[ADMIN] 💾 Manual save promotion:', {
        roomId: selectedRoomForDetail,
        title: promotionData.title,
        hasImage: !!promotionData.image,
        hasCardImage: !!promotionData.cardImage,
        isActive: promotionData.isActive
      });
      const response = await api.updatePromotion(selectedRoomForDetail, promotionData);
      if (response.success) {
        console.log('[ADMIN] ✅ Manual save SUCCESS:', {
          savedRoomId: response.data?.roomId,
          savedTitle: response.data?.title,
          timestamp: new Date().toLocaleTimeString()
        });
        // Mettre à jour les données locales avec la réponse du serveur
        if (response.data) {
          setPromotionData(response.data);
          console.log('[ADMIN] 🔄 Promotion data updated from server');
        }
        setSaveMessage({ type: 'success', text: '✅ Promotion sauvegardée!' });
        toast.success('Promotion sauvegardée');
      } else {
        console.error('[ADMIN] ❌ Manual save FAILED:', response.error);
        setSaveMessage({ type: 'error', text: '❌ Erreur lors de la sauvegarde' });
        toast.error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('[ADMIN] Error saving promotion:', error);
      setSaveMessage({ type: 'error', text: '❌ Erreur lors de la sauvegarde' });
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  // Upload image promotion
  const uploadPromotionImage = async (file: File) => {
    if (!selectedRoomForDetail) {
      console.error('[ADMIN] ❌ No room selected for upload');
      return;
    }

    setUploadingPromoImage(true);
    try {
      console.log('[ADMIN] 📤 Uploading main image:', { roomId: selectedRoomForDetail, fileName: file.name, fileSize: file.size });
      const response = await api.uploadPromotionImage(selectedRoomForDetail, file);
      if (response.success && response.data?.url) {
        console.log('[ADMIN] ✅ Image uploaded to Cloudinary:', { url: response.data.url });
        const updatedData = {
          ...promotionData,
          image: response.data.url
        };
        setPromotionData(updatedData);
        
        // Sauvegarder immédiatement après l'upload
        console.log('[ADMIN] 💾 Saving after image upload...');
        const saveResponse = await api.updatePromotion(selectedRoomForDetail, updatedData);
        if (saveResponse.success) {
          console.log('[ADMIN] ✅ Image saved to database successfully');
          toast.success('Image principale uploadée et sauvegardée');
        } else {
          console.error('[ADMIN] ❌ Save after upload failed:', saveResponse.error);
          toast.error('Upload réussi mais sauvegarde échouée');
        }
      } else {
        console.error('[ADMIN] ❌ Image upload failed:', response.error);
        toast.error('Erreur lors de l\'upload');
      }
    } catch (error) {
      console.error('[ADMIN] ❌ Upload exception:', error);
      toast.error('Erreur lors de l\'upload');
    } finally {
      setUploadingPromoImage(false);
    }
  };

  const uploadPromotionCardImage = async (file: File) => {
    if (!selectedRoomForDetail) return;

    setUploadingPromoImage(true);
    const fileName = file.name;
    const fileSize = file.size;
    console.log('[ADMIN] 📤 Uploading card image:', { roomId: selectedRoomForDetail, fileName, fileSize });

    try {
      const response = await api.uploadPromotionCardImage(selectedRoomForDetail, file);
      if (response.success && response.data?.url) {
        console.log('[ADMIN] ✅ Card image uploaded to Cloudinary:', { url: response.data.url });
        
        const updatedData = {
          ...promotionData,
          cardImage: response.data.url
        };
        setPromotionData(updatedData);
        
        // Sauvegarder immédiatement après l'upload
        console.log('[ADMIN] 💾 Saving card image after upload...');
        const saveResponse = await api.updatePromotion(selectedRoomForDetail, updatedData);
        if (saveResponse.success) {
          console.log('[ADMIN] ✅ Card image saved to database successfully');
          toast.success('Image carte uploadée et sauvegardée');
        } else {
          console.error('[ADMIN] ❌ Card image save after upload failed:', saveResponse.error);
          toast.error('Upload réussi mais sauvegarde échouée');
        }
      } else {
        console.error('[ADMIN] ❌ Card image upload failed:', response.error);
        toast.error('Erreur lors de l\'upload');
      }
    } catch (error) {
      console.error('[ADMIN] ❌ Card image upload exception:', error);
      toast.error('Erreur lors de l\'upload');
    } finally {
      setUploadingPromoImage(false);
    }
  };

  // Mettre à jour les détails d'une chambre
  const saveRoomDetail = async (isAutoSave: boolean = false) => {
    if (!isAutoSave) {
      console.clear();
      console.log('%c🔴 🔴 🔴 SAVE BUTTON CLICKED! 🔴 🔴 🔴', 'color: #ff0000; font-size: 18px; font-weight: bold;');
    }
    console.log('[ADMIN] 💾 Starting to save room detail for roomId:', selectedRoomForDetail);
    console.log('[ADMIN] 📋 Current roomDetail state BEFORE save:', roomDetail);
    
    if (!roomDetail || !selectedRoomForDetail) {
      console.warn('[ADMIN] ⚠️ Missing roomDetail or selectedRoomForDetail');
      if (!isAutoSave) {
        toast.error('Erreur: données manquantes');
      }
      return;
    }
    
    // Valider les données
    console.log('[ADMIN] 🔍 Validating room detail data...');
    const validation = roomDetailApi.validateRoomDetail(roomDetail);
    console.log('[ADMIN] Validation result:', { valid: validation.valid, errorCount: validation.errors.length });
    
    if (!validation.valid) {
      console.error('[ADMIN] ❌ Validation errors:', validation.errors);
      setRoomDetailErrors(validation.errors);
      if (!isAutoSave) {
        setSaveMessage({ type: 'error', text: '❌ Erreur de validation des données' });
        toast.error('Erreur de validation');
      }
      return;
    }
    console.log('[ADMIN] ✅ Validation passed');
    
    setRoomDetailErrors([]);
    if (!isAutoSave) {
      setIsSaving(true);
    }
    try {
      // Prepare data without MongoDB _id field
      const { _id, ...cleanData } = roomDetail as any;
      console.log('[ADMIN] 📤 Preparing to send update request with data:', {
        roomId: selectedRoomForDetail,
        title: cleanData.title,
        price: cleanData.price,
        guests: cleanData.guests,
        bedrooms: cleanData.bedrooms,
        includes: cleanData.includes,
        amenities: cleanData.amenities,
        featuresCount: cleanData.features?.length || 0,
        imagesCount: cleanData.images?.length || 0
      });
      const response = await roomDetailApi.updateRoomDetail(selectedRoomForDetail, cleanData);
      console.log('[ADMIN] 📥 Update response received:', { success: response.success, hasData: !!response.data });
      
      if (response.success) {
        // Mettre à jour le state avec la réponse du serveur
        const updatedData = response.data || roomDetail; // Fallback si le serveur ne retourne pas les données
        setRoomDetail(updatedData);
        setRoomDetailHasChanges(false);
        setRoomDetailLastSaved(new Date());
        console.log('[ADMIN] ✅ Room detail saved successfully:', {
          roomId: selectedRoomForDetail,
          title: updatedData.title,
          price: updatedData.price,
          guests: updatedData.guests,
          bedrooms: updatedData.bedrooms,
          includes: updatedData.includes,
          amenities: updatedData.amenities
        });
        
        if (!isAutoSave) {
          setSaveMessage({ type: 'success', text: '✅ Détails de la chambre sauvegardés!' });
          toast.success('Détails de la chambre sauvegardés');
        }
        
        // Notifier les autres composants de la mise à jour
        try {
          console.log('[ADMIN] 📢 Broadcasting events to other components...');
          window.dispatchEvent(new CustomEvent('roomDetailUpdated', { 
            detail: { 
              roomId: selectedRoomForDetail, 
              data: updatedData,
              timestamp: Date.now() 
            } 
          }));
          console.log('[ADMIN] ✅ Event roomDetailUpdated dispatched');
          
          // Aussi notifier la mise à jour générale pour le client
          window.dispatchEvent(new CustomEvent('apartmentDataUpdated', { 
            detail: { 
              roomId: selectedRoomForDetail,
              data: updatedData,
              timestamp: Date.now() 
            } 
          }));
          console.log('[ADMIN] ✅ Event apartmentDataUpdated dispatched');
        } catch (err) {
          console.error('[ADMIN] ❌ Error dispatching events:', err);
        }
        
        // 🔍 VERIFICATION: Log the roomDetail state AFTER save
        console.log('[ADMIN] ✅ DATABASE SAVED - Verifying persisted data:');
        console.log('[ADMIN] roomDetail.roomId:', updatedData.roomId);
        console.log('[ADMIN] roomDetail.title:', updatedData.title);
        console.log('[ADMIN] roomDetail.price:', updatedData.price);
        console.log('[ADMIN] roomDetail.guests:', updatedData.guests);
        console.log('[ADMIN] roomDetail.bedrooms:', updatedData.bedrooms);
        console.log('[ADMIN] roomDetail.includes:', updatedData.includes);
        console.log('[ADMIN] roomDetail.amenities:', updatedData.amenities);
        console.log('[ADMIN] 📦 FULL SAVED OBJECT:', updatedData);
        
        setTimeout(() => setSaveMessage(null), 2000);
      } else {
        console.error('[ADMIN] ❌ Update response success: false');
        console.error('[ADMIN] ❌ Full response:', response);
        if (!isAutoSave) {
          setSaveMessage({ type: 'error', text: '❌ Erreur: réponse serveur invalide' });
          toast.error('Erreur serveur');
        }
      }
    } catch (error) {
      console.error('[ADMIN] ❌ Error saving room detail:', error);
      console.error('[ADMIN] ❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : '',
        type: typeof error
      });
      if (!isAutoSave) {
        setSaveMessage({ type: 'error', text: '❌ Erreur lors de la sauvegarde' });
        toast.error('Erreur lors de la sauvegarde');
      }
    } finally {
      if (!isAutoSave) {
        setIsSaving(false);
      }
      console.log('[ADMIN] 🏁 Room detail save operation completed');
      console.log('[ADMIN] 🔄 Current roomDetail in state AFTER save completed:', roomDetail);
    }
  };

  // Sauvegarder et synchroniser les brouillons locaux
  const syncRoomDetailChanges = async () => {
    if (!roomDetail || !selectedRoomForDetail) return;
    
    setIsSaving(true);
    try {
      await roomDetailApi.saveLocalDraft(selectedRoomForDetail, roomDetail);
      const response = await roomDetailApi.syncLocalChanges(selectedRoomForDetail);
      if (response.success) {
        setRoomDetail(response.data);
        setSaveMessage({ type: 'success', text: '✅ Changements synchronisés avec succès!' });
        setTimeout(() => setSaveMessage(null), 2000);
      }
    } catch (error) {
      console.error('Erreur sync détails chambre:', error);
      setSaveMessage({ type: 'error', text: '❌ Erreur lors de la synchronisation' });
    } finally {
      setIsSaving(false);
    }
  };

  // Mettre à jour un champ des détails de la chambre
  const updateRoomDetailField = (field: string, value: any) => {
    console.log('[ADMIN] 📝 Updating field:', field, '| new value:', value);
    if (!roomDetail) {
      console.warn('[ADMIN] ⚠️ roomDetail is null, cannot update field');
      return;
    }
    
    setRoomDetail(prev => {
      if (!prev) return null;
      const path = field.split('.');
      const newData = JSON.parse(JSON.stringify(prev));
      let current: any = newData;
      
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      
      current[path[path.length - 1]] = value;
      
      return newData;
    });
    
    setRoomDetailHasChanges(true);
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
            ...(selectedRoomForDetail ? [{ id: 'promotion', label: 'Promotion', icon: Tag }] : []),
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
                              onClick={() => loadRoomDetail(room.id)}
                              title="Éditer les détails de cette chambre"
                              className="p-1 text-purple-500 hover:bg-purple-50 rounded border"
                            >
                              <Settings size={18} />
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

          {activeSection === 'roomDetail' && (
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              {isLoadingRoomDetail ? (
                <div className="flex justify-center py-12">
                  <Loader className="animate-spin h-8 w-8 text-blue-500" />
                </div>
              ) : roomDetail ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Bed size={24} />
                      Détails Chambre #{selectedRoomForDetail}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setHeroInfoTab(!heroInfoTab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          heroInfoTab ? 'bg-blue-500 text-white' : 'bg-gray-100'
                        }`}
                      >
                        {heroInfoTab ? '👀 Info Hero' : 'Détails'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                  {/* Messages d'erreur de validation */}
                  {roomDetailErrors.length > 0 && (
                    <div className="bg-red-50 border border-red-300 rounded-lg p-4">
                      <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                        <AlertCircle size={18} />
                        Erreurs de validation
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-red-600 text-sm">
                        {roomDetailErrors.map((error, idx) => (
                          <li key={idx}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* TAB: Informations Hero */}
                  {heroInfoTab && (
                    <div className="space-y-6 bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                      <h4 className="text-lg font-bold flex items-center gap-2 text-blue-900">
                        <Layout size={20} />
                        Section Hero - Informations Principales
                      </h4>

                      <div>
                        <label className="block text-sm font-medium mb-2 font-semibold">Titre (Hero)</label>
                        <input
                          type="text"
                          value={roomDetail.title}
                          onChange={(e) => updateRoomDetailField('title', e.target.value)}
                          className="w-full border-2 border-blue-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                          placeholder="Ex: Aptent taciti sociosqu ad litora"
                        />
                        <p className="text-xs text-gray-500 mt-1">Ce titre s'affiche en grand sur la page d'accueil</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 font-semibold">Sous-titre (Hero)</label>
                        <input
                          type="text"
                          value={roomDetail.subtitle}
                          onChange={(e) => updateRoomDetailField('subtitle', e.target.value)}
                          className="w-full border-2 border-blue-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                          placeholder="Ex: Nunc vulputate libero et velit interdum..."
                        />
                        <p className="text-xs text-gray-500 mt-1">Description courte pour la section héro</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 font-semibold">Type de logement</label>
                        <input
                          type="text"
                          value={roomDetail.accommodationType || ''}
                          onChange={(e) => updateRoomDetailField('accommodationType', e.target.value)}
                          className="w-full border-2 border-blue-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                          placeholder="Ex: Logement sans fumeur"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 font-semibold">Description complète</label>
                        <textarea
                          value={roomDetail.description}
                          onChange={(e) => updateRoomDetailField('description', e.target.value)}
                          className="w-full border-2 border-blue-300 rounded-lg p-3 h-32 focus:outline-none focus:border-blue-500"
                          placeholder="Description détaillée du logement..."
                        />
                      </div>

                      {/* Section Images du Hero */}
                      <div className="border-t-2 border-blue-200 pt-4">
                        <label className="block text-sm font-medium mb-3 font-semibold">Images du Hero</label>
                        <div className="space-y-3">
                          {/* Preview des images */}
                          {roomDetail.images.length > 0 && (
                            <div className="bg-white p-3 rounded-lg border">
                              <p className="text-xs font-semibold text-gray-600 mb-2">Aperçu : Image #{currentImageIndex + 1}/{roomDetail.images.length}</p>
                              <div className="flex gap-2">
                                {roomDetail.images[currentImageIndex] && (
                                  <div className="flex-1">
                                    {roomDetail.images[currentImageIndex].startsWith('/uploads/') ? (
                                      <img 
                                        src={`https://airbnb-backend.onrender.com${roomDetail.images[currentImageIndex]}`} 
                                        alt={`Hero ${currentImageIndex + 1}`}
                                        className="w-full h-48 object-cover rounded border"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2214%22 fill=%22%23999%22%3EErreur image%3C/text%3E%3C/svg%3E';
                                        }}
                                      />
                                    ) : (
                                      <div className="w-full h-48 bg-gray-200 rounded border flex items-center justify-center text-xs text-gray-500">
                                        URL externe
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                                  disabled={currentImageIndex === 0}
                                  className="px-3 py-1 bg-gray-200 rounded text-sm disabled:opacity-50"
                                >
                                  ← Précédente
                                </button>
                                <button
                                  onClick={() => setCurrentImageIndex(Math.min(roomDetail.images.length - 1, currentImageIndex + 1))}
                                  disabled={currentImageIndex === roomDetail.images.length - 1}
                                  className="px-3 py-1 bg-gray-200 rounded text-sm disabled:opacity-50"
                                >
                                  Suivante →
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Upload Section */}
                          <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
                            <label className="block text-sm font-medium mb-2 text-blue-900">Télécharger des images</label>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={async (e) => {
                                const files = e.target.files;
                                if (!files || files.length === 0) return;
                                
                                try {
                                  setIsSaving(true);
                                  let newImages = [...roomDetail.images];
                                  let successCount = 0;
                                  let errorCount = 0;
                                  
                                  // Upload each file
                                  for (let i = 0; i < files.length; i++) {
                                    try {
                                      const response = await roomDetailApi.uploadImage(files[i]);
                                      if (response.success) {
                                        newImages.push(response.url);
                                        successCount++;
                                      }
                                    } catch (err) {
                                      console.error(`Erreur upload fichier ${i}:`, err);
                                      errorCount++;
                                    }
                                  }
                                  
                                  // Update images list
                                  updateRoomDetailField('images', newImages);
                                  
                                  // Show result message
                                  if (successCount > 0) {
                                    setSaveMessage({ 
                                      type: 'success', 
                                      text: `✅ ${successCount} image(s) téléchargée(s) avec succès!` 
                                    });
                                  }
                                  if (errorCount > 0) {
                                    setSaveMessage({ 
                                      type: 'error', 
                                      text: `❌ ${errorCount} image(s) échouée(s)` 
                                    });
                                  }
                                  
                                  // Reset input
                                  e.target.value = '';
                                } catch (error) {
                                  console.error('Erreur upload:', error);
                                  setSaveMessage({ type: 'error', text: '❌ Erreur lors du téléchargement' });
                                } finally {
                                  setIsSaving(false);
                                }
                              }}
                              className="w-full border rounded-lg p-2 text-sm cursor-pointer"
                              disabled={isSaving}
                            />
                            <p className="text-xs text-gray-500 mt-2">PNG, JPG, JPEG (Max 5MB par image) - Vous pouvez sélectionner plusieurs fichiers</p>
                          </div>

                          {/* Images List */}
                          {roomDetail.images.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                              {roomDetail.images.map((img, idx) => (
                                <div 
                                  key={idx} 
                                  className={`border rounded-lg p-2 cursor-pointer transition-all ${
                                    currentImageIndex === idx ? 'bg-blue-200 border-blue-500' : 'bg-gray-50'
                                  }`}
                                  onClick={() => setCurrentImageIndex(idx)}
                                >
                                  <div className="flex gap-2 mb-2">
                                    <span className="text-xs font-semibold text-gray-600">#{idx + 1}</span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteConfirmImage(idx);
                                      }}
                                      className="ml-auto p-1 text-red-500 hover:bg-red-100 rounded transition"
                                      title="Supprimer l'image"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>

                                  {deleteConfirmImage === idx && (
                                    <div className="bg-red-50 border border-red-300 rounded p-2 mb-2 text-xs">
                                      <p className="text-red-700 font-semibold mb-2">Supprimer cette image?</p>
                                      <div className="flex gap-1">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const newImages = roomDetail.images.filter((_, i) => i !== idx);
                                            updateRoomDetailField('images', newImages);
                                            setDeleteConfirmImage(null);
                                            if (currentImageIndex >= newImages.length) {
                                              setCurrentImageIndex(Math.max(0, newImages.length - 1));
                                            }
                                          }}
                                          className="flex-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                                        >
                                          Oui
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteConfirmImage(null);
                                          }}
                                          className="flex-1 px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-xs"
                                        >
                                          Non
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                  {img && img.startsWith('/uploads/') && (
                                    <img 
                                      src={`https://airbnb-backend.onrender.com${img}`} 
                                      alt={`Room ${idx + 1}`}
                                      className="w-full h-20 object-cover rounded border text-xs"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E';
                                      }}
                                    />
                                  )}
                                  {img && !img.startsWith('/uploads/') && (
                                    <div className="w-full h-20 bg-gray-200 rounded border flex items-center justify-center text-xs text-gray-500">
                                      URL externe
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <button
                            onClick={() => updateRoomDetailField('images', [...roomDetail.images, ''])}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 text-sm w-full justify-center"
                          >
                            <Plus size={16} />
                            Ajouter une image par URL
                          </button>
                        </div>
                      </div>

                      {/* Section Vidéo */}
                      <div className="border-t-2 border-blue-200 pt-4">
                        <label className="block text-sm font-medium mb-3 font-semibold">Vidéo de la chambre</label>
                        <div className="space-y-3">
                          {/* Aperçu vidéo */}
                          {roomDetail.videoUrl && (
                            <div className="bg-white p-3 rounded-lg border">
                              <p className="text-xs font-semibold text-gray-600 mb-2">Aperçu vidéo</p>
                              <video
                                src={roomDetail.videoUrl}
                                controls
                                className="w-full max-h-64 rounded border bg-black"
                              />
                              <button
                                onClick={() => updateRoomDetailField('videoUrl', '')}
                                className="mt-2 px-3 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200 flex items-center gap-2"
                              >
                                <Trash2 size={14} />
                                Supprimer la vidéo
                              </button>
                            </div>
                          )}

                          {/* Upload vidéo */}
                          <VideoUploader
                            value={roomDetail.videoUrl}
                            onChange={(url: string) => {
                              updateRoomDetailField('videoUrl', url);
                            }}
                            uploadType="room-detail"
                            label="Télécharger la vidéo de la chambre"
                          />

                          {/* Champ URL de la vidéo */}
                          <div className="bg-gray-50 p-3 rounded-lg border">
                            <label className="block text-sm font-medium mb-2 font-semibold">URL de la vidéo</label>
                            <textarea
                              value={roomDetail.videoUrl || ''}
                              onChange={(e) => updateRoomDetailField('videoUrl', e.target.value)}
                              className="w-full border rounded-lg p-3 h-20 font-mono text-xs focus:outline-none focus:border-blue-500"
                              placeholder="URL Cloudinary de la vidéo (générée après upload ou entrée manuelle)"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              {roomDetail.videoUrl ? '✅ URL stockée' : '⚠️ Aucune URL enregistrée'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB: Détails */}
                  {!heroInfoTab && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                        <div>
                          <label className="block text-sm font-medium mb-2 font-semibold">💰 Prix par nuit (€)</label>
                          <input
                            type="number"
                            value={roomDetail.price}
                            onChange={(e) => updateRoomDetailField('price', parseFloat(e.target.value) || 0)}
                            className="w-full border-2 border-yellow-300 rounded-lg p-3 focus:outline-none focus:border-yellow-500 text-lg"
                            min="0"
                            step="0.01"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 font-semibold">👥 Nombre d'invités</label>
                          <input
                            type="text"
                            value={roomDetail.guests}
                            onChange={(e) => updateRoomDetailField('guests', e.target.value)}
                            className="w-full border-2 border-yellow-300 rounded-lg p-3 focus:outline-none focus:border-yellow-500"
                            placeholder="ex: jusqu'à 4 invités"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 font-semibold">🛏️ Nombre de chambres</label>
                          <input
                            type="text"
                            value={roomDetail.bedrooms}
                            onChange={(e) => updateRoomDetailField('bedrooms', e.target.value)}
                            className="w-full border-2 border-yellow-300 rounded-lg p-3 focus:outline-none focus:border-yellow-500"
                            placeholder="ex: 2 chambres"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 font-semibold">🏙️ Ville</label>
                          <input
                            type="text"
                            value={roomDetail.city || ''}
                            onChange={(e) => updateRoomDetailField('city', e.target.value)}
                            className="w-full border-2 border-yellow-300 rounded-lg p-3 focus:outline-none focus:border-yellow-500"
                            placeholder="ex: Paris"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 font-semibold">🌍 Pays</label>
                          <input
                            type="text"
                            value={roomDetail.country || ''}
                            onChange={(e) => updateRoomDetailField('country', e.target.value)}
                            className="w-full border-2 border-yellow-300 rounded-lg p-3 focus:outline-none focus:border-yellow-500"
                            placeholder="ex: France"
                          />
                        </div>
                      </div>

                      {/* Équipements inclus */}
                      <div className="border rounded-lg p-4 bg-green-50">
                        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-900">
                          <CheckCircle size={20} />
                          Équipements inclus
                        </h4>
                        <div className="space-y-2">
                          {(roomDetail.includes || []).map((item, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => {
                                  const newIncludes = [...(roomDetail.includes || [])];
                                  newIncludes[idx] = e.target.value;
                                  updateRoomDetailField('includes', newIncludes);
                                }}
                                className="flex-1 border rounded-lg p-2 text-sm"
                                placeholder="ex: Thé, café"
                              />
                              <button
                                onClick={() => {
                                  const newIncludes = (roomDetail.includes || []).filter((_, i) => i !== idx);
                                  updateRoomDetailField('includes', newIncludes);
                                }}
                                className="p-2 text-red-500 hover:bg-red-100 rounded border"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => updateRoomDetailField('includes', [...(roomDetail.includes || []), ''])}
                            className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 text-sm w-full justify-center"
                          >
                            <Plus size={16} />
                            Ajouter un équipement
                          </button>
                        </div>
                      </div>

                      {/* Équipements sécurité/confort */}
                      <div className="border rounded-lg p-4 bg-purple-50">
                        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-900">
                          <Shield size={20} />
                          Équipements et services
                        </h4>
                        <div className="space-y-2">
                          {(roomDetail.amenities || []).map((item, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => {
                                  const newAmenities = [...(roomDetail.amenities || [])];
                                  newAmenities[idx] = e.target.value;
                                  updateRoomDetailField('amenities', newAmenities);
                                }}
                                className="flex-1 border rounded-lg p-2 text-sm"
                                placeholder="ex: Parking sécurisé, WiFi, Climatisation"
                              />
                              <button
                                onClick={() => {
                                  const newAmenities = (roomDetail.amenities || []).filter((_, i) => i !== idx);
                                  updateRoomDetailField('amenities', newAmenities);
                                }}
                                className="p-2 text-red-500 hover:bg-red-100 rounded border"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => updateRoomDetailField('amenities', [...(roomDetail.amenities || []), ''])}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 text-sm w-full justify-center"
                          >
                            <Plus size={16} />
                            Ajouter un équipement
                          </button>
                        </div>
                      </div>

                      {/* Caractéristiques */}
                      <div className="border rounded-lg p-4 bg-orange-50">
                        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-orange-900">
                          <Star size={20} />
                          Caractéristiques principales
                        </h4>
                        <div className="space-y-2">
                          {roomDetail.features.map((feature, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input
                                type="text"
                                value={feature}
                                onChange={(e) => {
                                  const newFeatures = [...roomDetail.features];
                                  newFeatures[idx] = e.target.value;
                                  updateRoomDetailField('features', newFeatures);
                                }}
                                className="flex-1 border rounded-lg p-2 text-sm"
                                placeholder="Caractéristique"
                              />
                              <button
                                onClick={() => {
                                  const newFeatures = roomDetail.features.filter((_, i) => i !== idx);
                                  updateRoomDetailField('features', newFeatures);
                                }}
                                className="p-2 text-red-500 hover:bg-red-100 rounded border"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => updateRoomDetailField('features', [...roomDetail.features, ''])}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 text-sm w-full justify-center"
                          >
                            <Plus size={16} />
                            Ajouter une caractéristique
                          </button>
                        </div>
                      </div>

                      {/* Options supplémentaires */}
                      <div className="border rounded-lg p-4 bg-indigo-50">
                        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-900">
                          <Tag size={20} />
                          Options supplémentaires
                        </h4>
                        
                        {isLoadingOptions ? (
                          <div className="text-center py-4 text-gray-600">
                            <Loader size={24} className="animate-spin mx-auto mb-2" />
                            Chargement des options...
                          </div>
                        ) : (
                          <>
                            {/* Créer une nouvelle option personnalisée */}
                            <div className="border-b border-indigo-200 pb-4 mb-4">
                              <h5 className="font-semibold text-sm text-indigo-800 mb-3">📝 Créer une nouvelle option:</h5>
                              <div className="space-y-3 bg-white p-3 rounded border border-indigo-100">
                                <div>
                                  <label className="text-xs font-semibold text-gray-700 block mb-1">Nom de l'option</label>
                                  <input
                                    type="text"
                                    value={newOptionForm.name}
                                    onChange={(e) => setNewOptionForm({ ...newOptionForm, name: e.target.value })}
                                    placeholder="ex: Nettoyage supplémentaire"
                                    className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-400"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-xs font-semibold text-gray-700 block mb-1">Prix (€)</label>
                                    <input
                                      type="number"
                                      value={newOptionForm.price}
                                      onChange={(e) => setNewOptionForm({ ...newOptionForm, price: e.target.value })}
                                      placeholder="ex: 50"
                                      min="0"
                                      step="0.01"
                                      className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-400"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs font-semibold text-gray-700 block mb-1">Type de tarification</label>
                                    <select
                                      value={newOptionForm.pricingType}
                                      onChange={(e) => setNewOptionForm({ ...newOptionForm, pricingType: e.target.value as 'fixed' | 'per_day' | 'per_guest' })}
                                      className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-400"
                                    >
                                      <option value="fixed">Fixe</option>
                                      <option value="per_day">Par nuit</option>
                                      <option value="per_guest">Par personne</option>
                                    </select>
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    if (newOptionForm.name.trim() && newOptionForm.price.trim()) {
                                      const newOption = {
                                        optionId: `custom_${Date.now()}`,
                                        name: newOptionForm.name.trim(),
                                        price: parseFloat(newOptionForm.price),
                                        quantity: 1,
                                        pricingType: newOptionForm.pricingType
                                      };
                                      updateRoomDetailField('additionalOptions', [
                                        ...(roomDetail.additionalOptions || []),
                                        newOption
                                      ]);
                                      setNewOptionForm({ name: '', price: '', pricingType: 'fixed' });
                                      toast.success('Option ajoutée avec succès!');
                                    } else {
                                      toast.error('Veuillez remplir tous les champs');
                                    }
                                  }}
                                  className="w-full px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 text-sm font-semibold flex items-center gap-2 justify-center transition-all"
                                >
                                  <Plus size={16} />
                                  Créer l'option
                                </button>
                              </div>
                            </div>

                            {/* Afficher les options sélectionnées */}
                            {(roomDetail.additionalOptions || []).length > 0 && (
                              <div className="space-y-3 mb-4">
                                <h5 className="font-semibold text-sm text-indigo-800">Options sélectionnées:</h5>
                                {roomDetail.additionalOptions.map((option, idx) => (
                                  <div key={idx} className="bg-white p-4 rounded border border-indigo-200 space-y-3">
                                    <div className="flex gap-2 items-start justify-between">
                                      <div className="flex-1">
                                        <p className="text-sm font-semibold">{option.name}</p>
                                        <p className="text-xs text-gray-600">
                                          {option.price}€ ({option.pricingType === 'fixed' ? 'Fixe' : option.pricingType === 'per_day' ? 'Par nuit' : 'Par personne'})
                                          {option.quantity > 1 && ` × ${option.quantity}`}
                                        </p>
                                      </div>
                                      <button
                                        onClick={() => {
                                          const newOptions = roomDetail.additionalOptions!.filter((_, i) => i !== idx);
                                          updateRoomDetailField('additionalOptions', newOptions);
                                        }}
                                        className="p-2 text-red-500 hover:bg-red-100 rounded border"
                                      >
                                        <Trash2 size={18} />
                                      </button>
                                    </div>
                                    
                                    {/* Image upload pour l'option */}
                                    <div className="border-t border-indigo-100 pt-3">
                                      <label className="text-xs font-semibold text-gray-700 block mb-2">Image de l'option (optionnelle)</label>
                                      <div className="flex gap-2">
                                        {option.image && (
                                          <div className="w-20 h-20 rounded-lg overflow-hidden border border-indigo-200 flex-shrink-0">
                                            <img
                                              src={option.image}
                                              alt={option.name}
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                        )}
                                        <div className="flex-1">
                                          <input
                                            type="file"
                                            accept="image/*"
                                            onChange={async (e) => {
                                              const file = e.currentTarget.files?.[0];
                                              if (!file) return;

                                              setUploadingOptionImages({ ...uploadingOptionImages, [idx]: true });
                                              try {
                                                const response = await imageUploadService.uploadOptionImage(file);
                                                if (response.success && response.data?.url) {
                                                  const updatedOptions = [...(roomDetail.additionalOptions || [])];
                                                  updatedOptions[idx] = { ...updatedOptions[idx], image: response.data.url };
                                                  updateRoomDetailField('additionalOptions', updatedOptions);
                                                  toast.success('Image téléchargée avec succès!');
                                                }
                                              } catch (error) {
                                                console.error('Upload error:', error);
                                                toast.error('Erreur lors du téléchargement');
                                              } finally {
                                                setUploadingOptionImages({ ...uploadingOptionImages, [idx]: false });
                                              }
                                            }}
                                            disabled={uploadingOptionImages[idx]}
                                            className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm cursor-pointer hover:border-indigo-400 disabled:opacity-50"
                                          />
                                          {uploadingOptionImages[idx] && (
                                            <p className="text-xs text-indigo-600 mt-1">Téléchargement...</p>
                                          )}
                                        </div>
                                        {option.image && (
                                          <button
                                            onClick={() => {
                                              const updatedOptions = [...(roomDetail.additionalOptions || [])];
                                              updatedOptions[idx] = { ...updatedOptions[idx], image: undefined };
                                              updateRoomDetailField('additionalOptions', updatedOptions);
                                            }}
                                            className="p-2 text-red-500 hover:bg-red-100 rounded border flex-shrink-0"
                                          >
                                            <Trash2 size={16} />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Ajouter des options */}
                            {Object.keys(availableOptions).length > 0 ? (
                              <div className="space-y-3">
                                <h5 className="font-semibold text-sm text-indigo-800">Ajouter une option:</h5>
                                {Object.entries(availableOptions).map(([category, options]) => (
                                  <div key={category}>
                                    <p className="text-xs font-semibold text-indigo-700 mb-2">{category}</p>
                                    <div className="space-y-1">
                                      {Array.isArray(options) && options.map((option: any) => {
                                        const isSelected = roomDetail.additionalOptions?.some((o) => o.optionId === option._id);
                                        return (
                                          <button
                                            key={option._id}
                                            onClick={() => {
                                              if (isSelected) {
                                                const newOptions = roomDetail.additionalOptions!.filter((o) => o.optionId !== option._id);
                                                updateRoomDetailField('additionalOptions', newOptions);
                                              } else {
                                                const newOption = {
                                                  optionId: option._id,
                                                  name: option.name,
                                                  price: option.price,
                                                  quantity: 1,
                                                  pricingType: option.pricingType || 'fixed'
                                                };
                                                updateRoomDetailField('additionalOptions', [
                                                  ...(roomDetail.additionalOptions || []),
                                                  newOption
                                                ]);
                                              }
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded border text-sm transition-all ${
                                              isSelected
                                                ? 'bg-indigo-200 border-indigo-400 text-indigo-900 font-semibold'
                                                : 'bg-white border-indigo-100 text-gray-700 hover:border-indigo-300'
                                            }`}
                                          >
                                            <div className="flex justify-between items-center">
                                              <span>{option.name}</span>
                                              <span className="text-xs font-semibold">{option.price}€</span>
                                            </div>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-600 text-sm">Aucune option supplémentaire disponible</p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Status bar */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        {roomDetailHasChanges && (
                          <div className="flex items-center gap-2 text-blue-700 text-sm">
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                            Modifications non sauvegardées
                          </div>
                        )}
                        {!roomDetailHasChanges && roomDetailLastSaved && (
                          <div className="flex items-center gap-2 text-green-700 text-sm">
                            <Check size={14} />
                            Sauvegardé à {roomDetailLastSaved.toLocaleTimeString('fr-FR')}
                          </div>
                        )}
                      </div>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoSaveRoomDetail}
                          onChange={(e) => setAutoSaveRoomDetail(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-gray-700">Auto-save (30s)</span>
                      </label>
                    </div>
                  </div>

                  {/* --- SECTION PROMOTION --- */}
                  <div className="mt-8 pt-6 border-t">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-1 h-6 bg-yellow-500 rounded-full"></div>
                      <h4 className="text-xl font-bold flex items-center gap-2">
                        <Star size={24} className="text-yellow-500" />
                        Promotion de cette chambre
                      </h4>
                    </div>

                    {isLoadingPromotion ? (
                      <div className="flex justify-center py-12">
                        <Loader className="animate-spin h-8 w-8 text-yellow-500" />
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl space-y-6 border border-yellow-100">
                        {/* Image Upload */}
                        <div>
                          <label className="block text-sm font-bold mb-3 text-gray-900 uppercase tracking-tight">Images</label>
                          
                          {/* Main Image */}
                          <div className="mb-6">
                            <p className="text-xs font-semibold text-gray-600 mb-2">📷 Image principale (grande)</p>
                            <div className="flex gap-4">
                              {promotionData?.image && (
                                <div className="relative w-28 h-28 rounded-lg overflow-hidden border-2 border-yellow-200 shadow-sm flex-shrink-0">
                                  <img src={promotionData.image} alt="Promo" className="w-full h-full object-cover" />
                                  <button
                                    onClick={() => setPromotionData({ ...promotionData, image: '' })}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-lg"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              )}
                              <label className="flex-1 border-2 border-dashed border-yellow-300 rounded-lg p-4 text-center cursor-pointer hover:bg-yellow-100/50 transition bg-white">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) uploadPromotionImage(e.target.files[0]);
                                  }}
                                  disabled={uploadingPromoImage}
                                  className="hidden"
                                />
                                <Upload size={24} className="mx-auto mb-2 text-yellow-600" />
                                <p className="text-sm font-semibold text-gray-700">Uploader image</p>
                                <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG</p>
                              </label>
                            </div>
                          </div>

                          {/* Card Image */}
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-2">🎴 Image carte (petite)</p>
                            <div className="flex gap-4">
                              {promotionData?.cardImage && (
                                <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-orange-200 shadow-sm flex-shrink-0">
                                  <img src={promotionData.cardImage} alt="Card" className="w-full h-full object-cover" />
                                  <button
                                    onClick={() => setPromotionData({ ...promotionData, cardImage: '' })}
                                    className="absolute top-0.5 right-0.5 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              )}
                              <label className="flex-1 border-2 border-dashed border-orange-300 rounded-lg p-4 text-center cursor-pointer hover:bg-orange-100/50 transition bg-white">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) uploadPromotionCardImage(e.target.files[0]);
                                  }}
                                  disabled={uploadingPromoImage}
                                  className="hidden"
                                />
                                <Upload size={24} className="mx-auto mb-2 text-orange-600" />
                                <p className="text-sm font-semibold text-gray-700">Uploader image</p>
                                <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG</p>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Title and Description */}
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-sm font-bold mb-2 text-gray-900 uppercase tracking-tight">Titre principal</label>
                            <input
                              type="text"
                              value={promotionData?.title || ''}
                              onChange={(e) => setPromotionData({ ...promotionData, title: e.target.value })}
                              className="w-full border-2 border-yellow-200 rounded-lg px-4 py-2 bg-white font-semibold text-gray-900 placeholder-gray-400"
                              placeholder="Ex: Nunc vulputate libero..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold mb-2 text-gray-900 uppercase tracking-tight">Description</label>
                            <textarea
                              value={promotionData?.description || ''}
                              onChange={(e) => setPromotionData({ ...promotionData, description: e.target.value })}
                              className="w-full border-2 border-yellow-200 rounded-lg px-4 py-2 h-24 bg-white text-gray-900 placeholder-gray-400"
                              placeholder="Description détaillée de la promotion..."
                            />
                          </div>
                        </div>

                        {/* Badge - Styled like component */}
                        <div>
                          <label className="block text-sm font-bold mb-3 text-gray-900 uppercase tracking-tight">Badge</label>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold mb-2 text-gray-700">Label</label>
                              <input
                                type="text"
                                value={promotionData?.badge?.label || ''}
                                onChange={(e) => setPromotionData({
                                  ...promotionData,
                                  badge: { ...promotionData?.badge, label: e.target.value }
                                })}
                                className="w-full border-2 border-yellow-200 rounded-lg px-3 py-2 bg-white"
                                placeholder="Option Premium"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold mb-2 text-gray-700">Couleur</label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={promotionData?.badge?.color || '#10b981'}
                                  onChange={(e) => setPromotionData({
                                    ...promotionData,
                                    badge: { ...promotionData?.badge, color: e.target.value }
                                  })}
                                  className="w-12 h-10 border-2 border-yellow-200 rounded-lg cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={promotionData?.badge?.color || ''}
                                  onChange={(e) => setPromotionData({
                                    ...promotionData,
                                    badge: { ...promotionData?.badge, color: e.target.value }
                                  })}
                                  className="flex-1 border-2 border-yellow-200 rounded-lg px-2 py-1 font-mono text-xs bg-white"
                                  placeholder="#10b981"
                                />
                              </div>
                            </div>
                          </div>
                          {/* Badge Preview */}
                          <div className="mt-3 p-3 bg-white rounded-lg">
                            <div 
                              className="inline-block rounded-full px-4 py-2"
                              style={{ backgroundColor: promotionData?.badge?.color || '#10b981' }}
                            >
                              <p className="text-xs font-bold text-white tracking-wide">
                                {promotionData?.badge?.label || 'Badge Preview'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Features */}
                        <div>
                          <label className="block text-sm font-bold mb-3 text-gray-900 uppercase tracking-tight">Caractéristiques (★ incluses)</label>
                          <div className="space-y-2 bg-white p-4 rounded-lg border border-yellow-200">
                            {promotionData?.features?.map((feature: any, idx: number) => (
                              <div key={idx} className="flex gap-2">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-200 flex-shrink-0">
                                  <Star size={14} className="text-yellow-700" />
                                </div>
                                <input
                                  type="text"
                                  value={feature.text}
                                  onChange={(e) => {
                                    const newFeatures = [...(promotionData.features || [])];
                                    newFeatures[idx].text = e.target.value;
                                    setPromotionData({ ...promotionData, features: newFeatures });
                                  }}
                                  className="flex-1 border rounded-lg px-3 py-1.5 text-sm bg-white"
                                  placeholder="Caractéristique..."
                                />
                                <button
                                  onClick={() => {
                                    const newFeatures = promotionData.features.filter((_: any, i: number) => i !== idx);
                                    setPromotionData({ ...promotionData, features: newFeatures });
                                  }}
                                  className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                const newFeatures = [...(promotionData?.features || []), { text: '', icon: '' }];
                                setPromotionData({ ...promotionData, features: newFeatures });
                              }}
                              className="w-full px-3 py-2.5 border-2 border-dashed border-yellow-300 rounded-lg text-sm font-semibold text-yellow-700 hover:bg-yellow-50 transition"
                            >
                              + Ajouter caractéristique
                            </button>
                          </div>
                        </div>

                        {/* Bottom Message */}
                        <div>
                          <label className="block text-sm font-bold mb-2 text-gray-900 uppercase tracking-tight">Message rassurant (bas)</label>
                          <textarea
                            value={promotionData?.bottomMessage || ''}
                            onChange={(e) => setPromotionData({ ...promotionData, bottomMessage: e.target.value })}
                            className="w-full border-2 border-yellow-200 rounded-lg px-4 py-2 h-20 bg-white text-gray-900 placeholder-gray-400"
                            placeholder="✓ Cette option premium est automatiquement incluse..."
                          />
                        </div>

                        {/* Active toggle */}
                        <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-yellow-200">
                          <input
                            type="checkbox"
                            checked={promotionData?.isActive || false}
                            onChange={(e) => setPromotionData({ ...promotionData, isActive: e.target.checked })}
                            className="w-5 h-5 rounded border-2 border-yellow-300 cursor-pointer"
                          />
                          <span className="font-semibold text-gray-900">Promotion active</span>
                          {promotionData?.isActive && (
                            <span className="ml-auto text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                              ✓ Visible sur la page publique
                            </span>
                          )}
                        </div>

                        {/* Save button */}
                        <button
                          onClick={savePromotion}
                          disabled={uploadingPromoImage}
                          className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 font-bold transition flex items-center justify-center gap-2 shadow-lg"
                        >
                          {uploadingPromoImage ? (
                            <>
                              <Loader className="animate-spin w-5 h-5" />
                              Upload en cours...
                            </>
                          ) : (
                            <>
                              <Save size={20} />
                              Sauvegarder la promotion
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-6 border-t flex-wrap">
                    <button
                      onClick={() => saveRoomDetail(false)}
                      disabled={isSaving || !roomDetailHasChanges}
                      className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition"
                    >
                      {isSaving ? (
                        <>
                          <Loader className="animate-spin w-4 h-4" />
                          Sauvegarde...
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          Sauvegarder
                        </>
                      )}
                    </button>
                    <button
                      onClick={syncRoomDetailChanges}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition"
                    >
                      {isSaving ? (
                        <>
                          <Loader className="animate-spin w-4 h-4" />
                          Sync...
                        </>
                      ) : (
                        <>
                          <RefreshCw size={20} />
                          Synchroniser
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setActiveSection('rooms');
                        setSelectedRoomForDetail(null);
                        setRoomDetail(null);
                        setRoomDetailHasChanges(false);
                        setHeroInfoTab(false);
                        setCurrentImageIndex(0);
                      }}
                      className="px-6 py-3 border rounded-lg hover:bg-gray-50 font-semibold transition"
                    >
                      Retour
                    </button>
                  </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <AlertCircle size={48} className="text-gray-400 mb-4" />
                  <p className="text-gray-600">Aucun détail de chambre sélectionné</p>
                </div>
              )}
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
                  <label className="block text-sm font-medium mb-2">URL Vidéo (YouTube ou autre URL)</label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    value={pageData.videoSection.videoUrl}
                    onChange={(e) => updateField('videoSection.videoUrl', e.target.value)}
                    className="w-full border rounded-lg p-3 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2">Entrez une URL de vidéo YouTube ou un autre service vidéo</p>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">Ou télécharger une vidéo Cloudinary</h4>
                  <VideoUploader
                    value={pageData.videoSection.videoUrl}
                    onChange={(url) => updateField('videoSection.videoUrl', url)}
                    label="Télécharger une vidéo"
                    uploadType="apartment"
                  />
                  <p className="text-xs text-gray-500 mt-2">Vous pouvez télécharger une vidéo locale (max 100MB)</p>
                </div>

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