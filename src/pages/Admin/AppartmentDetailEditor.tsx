// components/admin/AppartmentDetailEditor.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Save, Upload, Trash2, Plus, Eye, EyeOff, ChevronUp, ChevronDown, 
  Edit3, Image as ImageIcon, Type, Grid, Settings, Check, X,
  MoveUp, MoveDown, Copy, Link, ExternalLink, Maximize2, Minimize2,
  Palette, RefreshCw, Download, Upload as UploadIcon, Database,
  CheckCircle, XCircle, Loader, ChevronRight, Filter, Search,
  BarChart3, PieChart, TrendingUp, Users, Bed, Home, DollarSign,
  ArrowLeft, Play, Calendar, Shield, Coffee, Tv, Car, Wifi,
  Globe, Phone, Mail, Wind, TreePine, Waves, Shield as ShieldIcon,
  AlertTriangle, Info, Clock
} from 'lucide-react';
import { apartmentDetailApi, ApartmentDetailData } from '@/services/apartmentDetailApi';
import { additionalOptionsApi } from '@/services/additionalOptionsApi';
import { apartmentApi } from '@/services/apartmentApi';
import { toast } from 'sonner';

interface AppartmentDetailEditorProps {
  apartmentId?: number;
  onClose?: () => void;
}

const AppartmentDetailEditor: React.FC<AppartmentDetailEditorProps> = ({ 
  apartmentId: propApartmentId,
  onClose 
}) => {
  // Get apartmentId from URL params if available, otherwise use prop
  const { id } = useParams<{ id: string }>();
  
  // Debug logging
  console.log('AppartmentDetailEditor - URL id:', id, 'Prop id:', propApartmentId);
  
  // Prioritize URL params over props, default to 1 if neither provided
  let finalApartmentId = 1; // Default apartment ID
  if (id && !isNaN(parseInt(id, 10))) {
    finalApartmentId = parseInt(id, 10);
  } else if (propApartmentId && propApartmentId > 0) {
    finalApartmentId = propApartmentId;
  }
  
  const [activeSection, setActiveSection] = useState<
    'gallery' | 'lastSection' | 'options' | 'preview'
  >('gallery');
  
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [allOptions, setAllOptions] = useState<any[]>([]);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; index: number } | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [editingOptionImages, setEditingOptionImages] = useState<Record<string, string>>({}); // Store option images being edited
  const [optionImageUploading, setOptionImageUploading] = useState<string | null>(null); // Track which option image is uploading
  
  const [detailData, setDetailData] = useState<ApartmentDetailData>({
    apartmentId: finalApartmentId,
    hero: {
      title: '',
      subtitle: '',
      description: '',
      price: 300,
      guests: "jusqu'à 4 invités",
      bedrooms: "2 chambres à coucher",
      mainImage: '',
      galleryImages: []
    },
    details: {
      title: 'Détails de l\'appartement',
      subtitle: 'Class aptent taciti per inceptos himenaeos.',
      description: '',
      highlights: [],
      features: []
    },
    gallery: {
      title: 'Nunc vulputate libero et',
      subtitle: 'velit interdum, ac aliquet odio mattis.',
      images: [],
      buttonText: 'Nous contacter'
    },
    lastSection: {
      title: 'Consectetur ipsum elit',
      description: 'Sorem ipsum dolor sit amet, consectetur adipiscing elit.',
      features: [],
      image: '',
      tagline: 'Consectetur adipiscing'
    },
    meta: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin',
      version: 1
    }
  });

  // Auto-save timer
  useEffect(() => {
    if (!autoSaveEnabled || !hasUnsavedChanges) return;

    const timer = setTimeout(async () => {
      if (hasUnsavedChanges && !isSaving) {
        console.log('Auto-saving changes...');
        await handleSave(true); // Auto-save silently
      }
    }, 30000); // 30 secondes

    return () => clearTimeout(timer);
  }, [hasUnsavedChanges, autoSaveEnabled, isSaving]);

  // Warn on page leave if unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (finalApartmentId && finalApartmentId > 0) {
      loadData();
    }
  }, [finalApartmentId]);

  const loadData = async () => {
    // finalApartmentId should always be valid now (defaults to 1)
    setIsLoading(true);
    try {
      // Charger les détails
      const detailResponse = await apartmentDetailApi.getDetailByApartmentId(finalApartmentId);
      if (detailResponse.success) {
        setDetailData(detailResponse.data);
        setLastSavedAt(new Date());
        setHasUnsavedChanges(false);
      }
      
      // Charger toutes les options disponibles
      const optionsResponse = await additionalOptionsApi.getAllOptions();
      if (optionsResponse.success) {
        const allOptionsFlat = Object.values(optionsResponse.data?.options || {}).flat();
        setAllOptions(allOptionsFlat);
      }
    } catch (error) {
      console.error('Erreur chargement données:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (isAutoSave: boolean = false) => {
    if (!isAutoSave) {
      setIsSaving(true);
    }
    setSaveMessage(null);
    
    try {
      // Validation basique
      if (!detailData.gallery.title.trim()) {
        throw new Error('Le titre de la galerie est requis');
      }
      if (!detailData.lastSection.title.trim()) {
        throw new Error('Le titre de la dernière section est requis');
      }

      // Exclure les champs meta lors de l'envoi au backend
      const { meta, ...dataToSend } = detailData;
      const response = await apartmentDetailApi.updateDetail(finalApartmentId, dataToSend);
      
      if (response.success) {
        setDetailData(response.data);
        setLastSavedAt(new Date());
        setHasUnsavedChanges(false);
        
        if (!isAutoSave) {
          setSaveMessage({ type: 'success', text: '✅ Détails sauvegardés avec succès!' });
          toast.success('Détails sauvegardés');
        }
        
        // Notifier les autres onglets
        try {
          localStorage.setItem(`apartment_detail_${finalApartmentId}_updated`, String(Date.now()));
        } catch (err) {
          // ignore
        }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erreur lors de la sauvegarde';
      setSaveMessage({ type: 'error', text: `❌ ${errorMsg}` });
      if (!isAutoSave) {
        toast.error(errorMsg);
      }
      
      // Sauvegarder localement
      await apartmentDetailApi.saveLocalChanges(finalApartmentId, detailData);
    } finally {
      if (!isAutoSave) {
        setIsSaving(false);
        setTimeout(() => setSaveMessage(null), 3000);
      }
    }
  };

  const handleSyncWithMain = async () => {
    try {
      // Récupérer les données de la chambre depuis la page principale
      const mainPageData = await apartmentApi.getApartmentPage();
      const room = mainPageData.roomsSection.rooms.find(r => r.id === finalApartmentId);
      
      if (room) {
        const response = await apartmentDetailApi.syncWithMainPage(finalApartmentId, room);
        
        if (response.success) {
          setDetailData(response.data);
          toast.success('Synchronisé avec la page principale');
        }
      } else {
        toast.error('Chambre non trouvée dans la page principale');
      }
    } catch (error) {
      console.error('Erreur synchronisation:', error);
      toast.error('Erreur lors de la synchronisation');
    }
  };

  const handleImageUpload = async (fieldPath: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image valide');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image dépasse 5 MB');
      return;
    }

    setIsUploading(true);
    try {
      // Utiliser l'API d'upload existante
      const result = await apartmentApi.uploadImage(file);
      
      // Mettre à jour le champ approprié
      const path = fieldPath.split('.');
      setDetailData(prev => {
        const newData = JSON.parse(JSON.stringify(prev));
        let current: any = newData;
        
        for (let i = 0; i < path.length - 1; i++) {
          if (!current[path[i]]) {
            current[path[i]] = {};
          }
          current = current[path[i]];
        }
        
        if (Array.isArray(current[path[path.length - 1]])) {
          current[path[path.length - 1]].push(result.url);
        } else {
          current[path[path.length - 1]] = result.url;
        }
        
        return newData;
      });

      setHasUnsavedChanges(true);
      toast.success('Image téléchargée avec succès');
    } catch (error) {
      console.error('Erreur upload:', error);
      const errorMsg = error instanceof Error ? error.message : 'Erreur lors du téléchargement';
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddFeature = (section: 'details' | 'lastSection') => {
    const newId = (detailData[section].features.length + 1).toString().padStart(2, '0');
    const newFeature = { id: newId, text: 'Nouvelle caractéristique' };
    
    setDetailData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        features: [...prev[section].features, newFeature]
      }
    }));
    
    setHasUnsavedChanges(true);
  };

  const handleAddGalleryImage = () => {
    const newImage = {
      src: '',
      alt: 'Nouvelle image'
    };
    
    setDetailData(prev => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        images: [...prev.gallery.images, newImage]
      }
    }));
    
    setHasUnsavedChanges(true);
  };

  // Handle option image upload
  const handleOptionImageUpload = async (optionId: string, file: File) => {
    setOptionImageUploading(optionId);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://airbnb-backend-l640.onrender.com/api'}/upload/image`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      const imageUrl = data.data?.imageUrl || data.imageUrl || '';
      
      if (imageUrl) {
        // Update the editing state with the image URL
        setEditingOptionImages(prev => ({
          ...prev,
          [optionId]: imageUrl
        }));
        toast.success('Image de l\'option téléchargée avec succès');
      }
    } catch (error) {
      console.error('Erreur upload image option:', error);
      toast.error('Erreur lors du téléchargement de l\'image');
    } finally {
      setOptionImageUploading(null);
    }
  };

  const handleToggleOption = (optionId: string) => {
    const currentOptions = detailData.additionalOptions || [];
    
    setDetailData(prev => ({
      ...prev,
      additionalOptions: currentOptions.includes(optionId)
        ? currentOptions.filter(id => id !== optionId)
        : [...currentOptions, optionId]
    }));
    
    setHasUnsavedChanges(true);
  };

  const updateField = (fieldPath: string, value: any) => {
    const path = fieldPath.split('.');
    setDetailData(prev => {
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
    
    // Mark as changed
    setHasUnsavedChanges(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* En-tête */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <h1 className="text-3xl font-bold text-gray-900">
                Éditeur Détails Appartement #{finalApartmentId}
              </h1>
              {hasUnsavedChanges && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                  <AlertTriangle size={16} />
                  Modifications non sauvegardées
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <p className="text-gray-600">Modifiez les détails de cette page d'appartement</p>
              {lastSavedAt && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={14} />
                  Sauvegardé à {lastSavedAt.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              {isPreview ? <EyeOff size={20} /> : <Eye size={20} />}
              {isPreview ? 'Masquer' : 'Aperçu'}
            </button>
            
            <button
              onClick={loadData}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
              Recharger
            </button>
            
            <button
              onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                autoSaveEnabled 
                  ? 'bg-green-100 text-green-700 border border-green-300' 
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
              title={autoSaveEnabled ? 'Auto-save activé' : 'Auto-save désactivé'}
            >
              {autoSaveEnabled ? <Check size={20} /> : <X size={20} />}
              Auto-save
            </button>
            
            <button
              onClick={() => handleSave(false)}
              disabled={isSaving || !hasUnsavedChanges}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition"
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
          <div className={`p-4 rounded-lg mb-4 flex items-center gap-2 animate-in ${
            saveMessage.type === 'success' 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {saveMessage.type === 'success' ? 
              <CheckCircle size={20} /> : <XCircle size={20} />
            }
            <span>{saveMessage.text}</span>
          </div>
        )}

        {/* Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'gallery', label: 'Galerie', icon: Grid },
            { id: 'lastSection', label: 'Dernière Section', icon: CheckCircle },
            { id: 'options', label: 'Options', icon: Settings },
            { id: 'preview', label: 'Aperçu', icon: Eye }
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
        <div className="lg:col-span-2">
          {activeSection === 'gallery' && (
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Grid size={24} />
                Galerie
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre</label>
                  <input
                    type="text"
                    value={detailData.gallery.title}
                    onChange={(e) => updateField('gallery.title', e.target.value)}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sous-titre</label>
                  <input
                    type="text"
                    value={detailData.gallery.subtitle}
                    onChange={(e) => updateField('gallery.subtitle', e.target.value)}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Texte du bouton</label>
                  <input
                    type="text"
                    value={detailData.gallery.buttonText}
                    onChange={(e) => updateField('gallery.buttonText', e.target.value)}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium">Images ({detailData.gallery.images.length})</label>
                    <button
                      onClick={handleAddGalleryImage}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                    >
                      <Plus size={16} />
                      Ajouter une image
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {detailData.gallery.images.map((image, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-24 h-24 rounded-lg overflow-hidden border bg-gray-100">
                            {image.src ? (
                              <img 
                                src={image.src} 
                                alt={image.alt}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ImageIcon size={24} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-3">
                            <div>
                              <label className="block text-xs font-medium mb-1">URL de l'image</label>
                              <input
                                type="text"
                                value={image.src}
                                onChange={(e) => {
                                  const newImages = [...detailData.gallery.images];
                                  newImages[index].src = e.target.value;
                                  updateField('gallery.images', newImages);
                                }}
                                className="w-full border rounded-lg p-2 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">Texte alternatif</label>
                              <input
                                type="text"
                                value={image.alt}
                                onChange={(e) => {
                                  const newImages = [...detailData.gallery.images];
                                  newImages[index].alt = e.target.value;
                                  updateField('gallery.images', newImages);
                                }}
                                className="w-full border rounded-lg p-2 text-sm"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <label className={`flex items-center gap-2 px-3 py-1 rounded-lg cursor-pointer text-sm transition ${
                            isUploading 
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`} style={{ pointerEvents: isUploading ? 'none' : 'auto' }}>
                            <Upload size={14} />
                            {isUploading ? 'Upload...' : 'Changer'}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={isUploading}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleImageUpload(`gallery.images.${index}.src`, file);
                                }
                              }}
                            />
                          </label>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'galleryImage', index })}
                            className="px-3 py-1 text-red-500 hover:bg-red-50 rounded-lg text-sm transition"
                          >
                            <Trash2 size={14} className="inline" />
                          </button>
                        </div>

                        {deleteConfirm?.type === 'galleryImage' && deleteConfirm?.index === index && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                            <p className="text-sm text-red-800 mb-2">Confirmez la suppression de cette image?</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  const newImages = detailData.gallery.images.filter((_, i) => i !== index);
                                  updateField('gallery.images', newImages);
                                  setDeleteConfirm(null);
                                }}
                                className="flex-1 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                              >
                                Supprimer
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                              >
                                Annuler
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'lastSection' && (
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle size={24} />
                Dernière Section
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre</label>
                  <textarea
                    value={detailData.lastSection.title}
                    onChange={(e) => updateField('lastSection.title', e.target.value)}
                    className="w-full border rounded-lg p-3 h-20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={detailData.lastSection.description}
                    onChange={(e) => updateField('lastSection.description', e.target.value)}
                    className="w-full border rounded-lg p-3 h-32"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tagline</label>
                  <input
                    type="text"
                    value={detailData.lastSection.tagline}
                    onChange={(e) => updateField('lastSection.tagline', e.target.value)}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium">Caractéristiques ({detailData.lastSection.features.length})</label>
                    <button
                      onClick={() => handleAddFeature('lastSection')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                    >
                      <Plus size={16} />
                      Ajouter
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {detailData.lastSection.features.map((feature, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center gap-4 mb-3">
                          <input
                            type="text"
                            value={feature.id}
                            onChange={(e) => {
                              const newFeatures = [...detailData.lastSection.features];
                              newFeatures[index].id = e.target.value;
                              updateField('lastSection.features', newFeatures);
                            }}
                            className="w-16 border rounded-lg p-2 text-center font-mono"
                          />
                          <input
                            type="text"
                            value={feature.text}
                            onChange={(e) => {
                              const newFeatures = [...detailData.lastSection.features];
                              newFeatures[index].text = e.target.value;
                              updateField('lastSection.features', newFeatures);
                            }}
                            className="flex-1 border rounded-lg p-2"
                            placeholder="Texte de la caractéristique"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const newFeatures = [...detailData.lastSection.features];
                                if (index > 0) {
                                  [newFeatures[index], newFeatures[index - 1]] = [newFeatures[index - 1], newFeatures[index]];
                                  updateField('lastSection.features', newFeatures);
                                }
                              }}
                              className="p-2 hover:bg-gray-100 rounded-lg border"
                            >
                              <ChevronUp size={18} />
                            </button>
                            <button
                              onClick={() => {
                                const newFeatures = [...detailData.lastSection.features];
                                if (index < newFeatures.length - 1) {
                                  [newFeatures[index], newFeatures[index + 1]] = [newFeatures[index + 1], newFeatures[index]];
                                  updateField('lastSection.features', newFeatures);
                                }
                              }}
                              className="p-2 hover:bg-gray-100 rounded-lg border"
                            >
                              <ChevronDown size={18} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'lastSectionFeature', index })}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg border transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        {deleteConfirm?.type === 'lastSectionFeature' && deleteConfirm?.index === index && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                            <p className="text-sm text-red-800 mb-2">Confirmez la suppression de cette caractéristique?</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  const newFeatures = detailData.lastSection.features.filter((_, i) => i !== index);
                                  updateField('lastSection.features', newFeatures);
                                  setDeleteConfirm(null);
                                }}
                                className="flex-1 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                              >
                                Supprimer
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                              >
                                Annuler
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-32 rounded-lg overflow-hidden border bg-gray-100">
                      {detailData.lastSection.image ? (
                        <img 
                          src={detailData.lastSection.image} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ImageIcon size={32} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={detailData.lastSection.image}
                        onChange={(e) => updateField('lastSection.image', e.target.value)}
                        className="w-full border rounded-lg p-2 mb-2"
                        placeholder="URL de l'image"
                      />
                      <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg cursor-pointer text-sm transition ${
                        isUploading 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`} style={{ pointerEvents: isUploading ? 'none' : 'auto' }}>
                        <Upload size={16} />
                        {isUploading ? 'Upload...' : 'Télécharger'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isUploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload('lastSection.image', file);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'options' && (
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Settings size={24} />
                Options Supplémentaires
              </h3>
              
              <div className="space-y-6">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium">Options disponibles</h4>
                    <span className="text-sm text-gray-500">
                      {detailData.additionalOptions?.length || 0} sélectionnées
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Sélectionnez les options supplémentaires disponibles pour cet appartement.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allOptions.map((option) => (
                    <div
                      key={option._id}
                      className={`border rounded-lg p-4 transition-all ${
                        detailData.additionalOptions?.includes(option._id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {/* Image section */}
                      <div className="mb-3">
                        {editingOptionImages[option._id] || option.image ? (
                          <div className="relative rounded-lg overflow-hidden bg-gray-100 h-32 mb-2">
                            <img 
                              src={editingOptionImages[option._id] || option.image} 
                              alt={option.name}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => setEditingOptionImages(prev => {
                                const { [option._id]: _, ...rest } = prev;
                                return rest;
                              })}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded hover:bg-red-600"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="bg-gray-100 h-32 rounded-lg mb-2 flex items-center justify-center">
                            <ImageIcon size={24} className="text-gray-400" />
                          </div>
                        )}
                        <label className="relative block">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={optionImageUploading === option._id}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleOptionImageUpload(option._id, file);
                            }}
                          />
                          <span className={`block text-center py-2 px-3 rounded text-sm font-medium transition cursor-pointer ${
                            optionImageUploading === option._id
                              ? 'bg-gray-300 text-gray-600'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          }`}>
                            {optionImageUploading === option._id ? 'Upload...' : 'Ajouter une image'}
                          </span>
                        </label>
                      </div>

                      {/* Option details */}
                      <div 
                        className="cursor-pointer"
                        onClick={() => handleToggleOption(option._id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{option.name}</h5>
                            <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                              {option.price}€
                            </span>
                            {detailData.additionalOptions?.includes(option._id) && (
                              <Check className="text-blue-500" size={18} />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            {option.category}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            {option.pricingType}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {allOptions.length === 0 && (
                  <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
                    <Settings size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Aucune option disponible</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Créez d'abord des options dans l'éditeur principal
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'preview' && (
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-xl font-bold mb-6">Aperçu de la page</h3>
              
              <div className="space-y-8">
                {/* Aperçu Galerie */}
                <div>
                  <h4 className="text-lg font-medium mb-4 border-b pb-2">Galerie</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-bold text-lg mb-2">{detailData.gallery.title}</h5>
                    <p className="text-sm text-gray-600 mb-4">{detailData.gallery.subtitle}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {detailData.gallery.images.slice(0, 6).map((image, i) => (
                        <div key={i} className="aspect-square bg-gray-200 rounded overflow-hidden">
                          {image.src ? (
                            <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Grid size={24} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <button className="px-6 py-2 bg-gray-700 text-white rounded text-sm">
                        {detailData.gallery.buttonText}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Aperçu Dernière Section */}
                <div>
                  <h4 className="text-lg font-medium mb-4 border-b pb-2">Dernière Section</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-bold text-lg mb-2">{detailData.lastSection.title}</h5>
                        <p className="text-sm text-gray-600 mb-4">{detailData.lastSection.description}</p>
                        <div className="text-xs font-bold text-gray-600 border-l-4 border-pink-500 pl-2">
                          {detailData.lastSection.tagline}
                        </div>
                      </div>
                      <div className="h-32 bg-gray-200 rounded overflow-hidden">
                        {detailData.lastSection.image ? (
                          <img src={detailData.lastSection.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Image finale
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Aperçu Options */}
                {detailData.additionalOptions && detailData.additionalOptions.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium mb-4 border-b pb-2">Options sélectionnées</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {allOptions
                          .filter(opt => detailData.additionalOptions?.includes(opt._id))
                          .map((option, i) => (
                            <div key={i} className="border rounded p-3 bg-white">
                              <div className="flex justify-between items-start">
                                <span className="font-medium">{option.name}</span>
                                <span className="text-sm font-bold">{option.price}€</span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{option.description}</p>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Panneau latéral */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-bold mb-4">Actions rapides</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleSave(false)}
                  disabled={isSaving || !hasUnsavedChanges}
                  className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2 transition"
                >
                  {isSaving ? (
                    <Loader className="animate-spin" size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  Sauvegarder maintenant
                </button>
                
                <button
                  onClick={loadData}
                  disabled={isLoading}
                  className="w-full py-3 border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 disabled:opacity-50 transition"
                >
                  <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                  Recharger
                </button>
                
                {onClose && (
                  <button
                    onClick={onClose}
                    className="w-full py-3 border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition"
                  >
                    <ArrowLeft size={18} />
                    Retour
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock size={20} />
                État d'enregistrement
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Dernière sauvegarde</div>
                  <div className="font-medium text-gray-900">
                    {lastSavedAt 
                      ? lastSavedAt.toLocaleTimeString('fr-FR')
                      : 'Jamais sauvegardé'
                    }
                  </div>
                </div>

                {hasUnsavedChanges && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2">
                    <AlertTriangle size={16} className="text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-orange-900">Modifications non sauvegardées</div>
                      <div className="text-xs text-orange-800 mt-1">
                        L'auto-save sauvegardеra dans {autoSaveEnabled ? '30s' : 'jamais'}
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-xs text-blue-600 mb-1">Version</div>
                  <div className="font-medium text-blue-900">v{detailData.meta.version}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-bold mb-4">Statistiques</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {detailData.gallery.images.length}
                    </div>
                    <div className="text-xs text-blue-800">Images Galerie</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {detailData.lastSection.features.length}
                    </div>
                    <div className="text-xs text-green-800">Caractéristiques</div>
                  </div>
                </div>
                
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dernière modification:</span>
                    <span className="font-medium">
                      {new Date(detailData.meta.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Version:</span>
                    <span className="font-medium">{detailData.meta.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Options:</span>
                    <span className="font-medium">
                      {detailData.additionalOptions?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-bold mb-4">Liens utiles</h3>
              
              <div className="space-y-3">
                <a
                  href={`/apartment/${finalApartmentId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 group"
                >
                  <div className="flex items-center gap-3">
                    <ExternalLink size={16} className="text-gray-400" />
                    <span>Voir la page publique</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600" />
                </a>
                
                <a
                  href="/admin/appartements"
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 group"
                >
                  <div className="flex items-center gap-3">
                    <Grid size={16} className="text-gray-400" />
                    <span>Éditeur principal</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppartmentDetailEditor;