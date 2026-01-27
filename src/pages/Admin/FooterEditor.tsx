import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, Upload, Image as ImageIcon, Trash2, Plus, 
  Eye, EyeOff, MoveUp, MoveDown, Settings, Palette,
  Link, Layers, Type, Grid, ArrowUpDown, ChevronUp,
  ChevronDown, ImagePlus, Image as ImageIcon2, Globe,
  Copyright, Hash, X, Menu, ArrowLeftRight
} from 'lucide-react';
import { useFooterData, FooterGalleryImage, FooterLinkGroup } from '@/services/footerApi';
import { footerServices } from '@/services/footerApi';

interface FooterFormData {
  galleryImages: FooterGalleryImage[];
  usefulLinks: FooterLinkGroup;
  legalPages: FooterLinkGroup;
  visualBanner: {
    title: string;
    backgroundColor: string;
  };
  copyright: {
    text: string;
    designText: string;
  };
  logo: {
    url: string;
    alt: string;
  };
}

const FooterEditor: React.FC = () => {
  const { footerData, loading, error, fetchFooterData, updateFooterData } = useFooterData();
  const [activeSection, setActiveSection] = useState<'gallery' | 'links' | 'banner' | 'logo' | 'copyright'>('gallery');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FooterFormData>({
    galleryImages: [],
    usefulLinks: {
      title: 'Liens Utiles',
      links: [
        { text: 'Nunc vulputate libero', url: '#' },
        { text: 'Curabitur tempus', url: '#' },
        { text: 'Vestibulum eu nisl', url: '#' },
        { text: 'Inceptos himenaeos', url: '#' }
      ]
    },
    legalPages: {
      title: 'Pages Légales',
      links: [
        { text: 'Mentions Légales', url: '/mentions-legales' },
        { text: 'Politique de confidentialité', url: '/confidentialite' },
        { text: 'Conditions Générales', url: '/conditions' },
        { text: 'Contact', url: '/contact' }
      ]
    },
    visualBanner: {
      title: 'Adipiscing elit',
      backgroundColor: '#E5E5E5'
    },
    copyright: {
      text: '© 2026 SWEETHOME. All rights reserved.',
      designText: 'Designed for Excellence'
    },
    logo: {
      url: './Logo.png',
      alt: 'SWEETHOME Logo'
    }
  });

  useEffect(() => {
    if (footerData) {
      setFormData({
        galleryImages: footerData.galleryImages,
        usefulLinks: footerData.usefulLinks,
        legalPages: footerData.legalPages,
        visualBanner: footerData.visualBanner,
        copyright: footerData.copyright,
        logo: footerData.logo
      });
    }
  }, [footerData]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const result = await updateFooterData(formData);
      setSaveMessage('✅ Footer sauvegardé avec succès!');
      
      // Notify other tabs
      try {
        localStorage.setItem('footer_updated', Date.now().toString());
      } catch (e) {}
      
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage('❌ Erreur lors de la sauvegarde');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await footerServices.uploadLogo(file, formData.logo.alt);
      setFormData(prev => ({
        ...prev,
        logo: {
          ...prev.logo,
          url: result.data.url || result.data.logo?.url
        }
      }));
    } catch (error) {
      console.error('Erreur lors de l\'upload du logo:', error);
    }
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(10);

    // Simuler une progression progressive
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const next = prev + Math.random() * 40;
        return next >= 90 ? 90 : next;
      });
    }, 300);

    try {
      if (files.length === 1) {
        const file = files[0];
        const result = await footerServices.uploadGalleryImage(
          file, 
          `Image ${formData.galleryImages.length + 1}`,
          formData.galleryImages.length
        );
        
        if (result.data?.galleryImages) {
          clearInterval(progressInterval);
          setUploadProgress(100);
          setFormData(prev => ({
            ...prev,
            galleryImages: result.data.galleryImages
          }));
          setSaveMessage('✅ Image ajoutée avec succès!');
          setTimeout(() => setSaveMessage(null), 3000);
        }
      } else {
        const altTexts = files.map((_, index) => `Image ${formData.galleryImages.length + index + 1}`);
        const result = await footerServices.uploadMultipleGalleryImages(files, altTexts);
        
        if (result.data?.galleryImages) {
          clearInterval(progressInterval);
          setUploadProgress(100);
          setFormData(prev => ({
            ...prev,
            galleryImages: result.data.galleryImages
          }));
          setSaveMessage(`✅ ${files.length} image(s) ajoutée(s) avec succès!`);
          setTimeout(() => setSaveMessage(null), 3000);
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload d\'images:', error);
      clearInterval(progressInterval);
      setSaveMessage('❌ Erreur lors de l\'upload');
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 500);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files || []).filter(file =>
      file.type.startsWith('image/')
    );

    if (files.length === 0) return;

    // Créer un événement synthétique pour réutiliser handleGalleryImageUpload
    const dataTransfer = new DataTransfer();
    files.forEach(file => dataTransfer.items.add(file));
    
    const input = fileInputRef.current;
    if (input) {
      input.files = dataTransfer.files;
      const event = new Event('change', { bubbles: true }) as any;
      event.target = input;
      handleGalleryImageUpload(event);
    }
  };

  const handleDeleteGalleryImage = async (imageId: string) => {
    try {
      const result = await footerServices.deleteGalleryImage(imageId);
      if (result.data?.galleryImages) {
        setFormData(prev => ({
          ...prev,
          galleryImages: result.data.galleryImages
        }));
        setSaveMessage('✅ Image supprimée avec succès!');
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setSaveMessage('❌ Erreur lors de la suppression');
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.galleryImages.length) return;

    const newImages = [...formData.galleryImages];
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    
    // Update order
    const updatedImages = newImages.map((img, idx) => ({ ...img, order: idx }));
    
    setFormData(prev => ({
      ...prev,
      galleryImages: updatedImages
    }));
  };

  const handleSaveGalleryOrder = async () => {
    try {
      await footerServices.updateGalleryOrder(formData.galleryImages);
      setSaveMessage('✅ Ordre des images sauvegardé!');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'ordre:', error);
    }
  };

  const addLink = (section: 'usefulLinks' | 'legalPages') => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        links: [...prev[section].links, { text: 'Nouveau lien', url: '#' }]
      }
    }));
  };

  const removeLink = (section: 'usefulLinks' | 'legalPages', index: number) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        links: prev[section].links.filter((_, i) => i !== index)
      }
    }));
  };

  const Preview = () => (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Aperçu du Footer</h2>
          <button
            onClick={() => setIsPreview(false)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Quitter l'aperçu
          </button>
        </div>
        
        {/* Aperçu du Footer */}
        <div className="bg-white border rounded-lg p-8">
          <div className="bg-[#E5E5E5] rounded-sm pt-8">
            <div className="px-8">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <img src={formData.logo.url} alt={formData.logo.alt} className="h-10 w-auto" />
              </div>
              
              <div className="border-t border-black/20 mb-6" />
              
              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
                {/* Galerie */}
                <div className="grid grid-cols-2 gap-2">
                  {formData.galleryImages.slice(0, 4).map((img, i) => (
                    <div key={i} className="aspect-square overflow-hidden rounded-sm">
                      <img src={img.image} className="w-full h-full object-cover" alt={img.alt} />
                    </div>
                  ))}
                </div>

                <div className="hidden lg:block" />

                {/* Liens Utiles */}
                <div className="flex flex-col">
                  <h4 className="font-bold text-[10px] tracking-[0.3em] uppercase mb-4">
                    {formData.usefulLinks.title}
                  </h4>
                  <ul className="space-y-2">
                    {formData.usefulLinks.links.map((link, i) => (
                      <li key={i}>
                        <a href={link.url} className="text-sm opacity-50 hover:opacity-100">
                          {link.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pages Légales */}
                <div className="flex flex-col">
                  <h4 className="font-bold text-[10px] tracking-[0.3em] uppercase mb-4">
                    {formData.legalPages.title}
                  </h4>
                  <ul className="space-y-2">
                    {formData.legalPages.links.map((link, i) => (
                      <li key={i}>
                        <a href={link.url} className="text-sm opacity-50 hover:opacity-100">
                          {link.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-black/20 mb-6" />

              {/* Bannière */}
              <div className="py-12">
                <h2 className="text-5xl font-medium text-center" style={{ color: formData.visualBanner.backgroundColor }}>
                  {formData.visualBanner.title}
                </h2>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 flex justify-between text-sm opacity-40">
            <p>{formData.copyright.text}</p>
            <p>{formData.copyright.designText}</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF2D75] mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du footer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {isPreview && <Preview />}
      
      {/* En-tête */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Éditeur du Footer</h1>
            <p className="text-gray-600">Modifiez tous les éléments de votre footer</p>
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

        {/* Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'gallery', label: 'Galerie', icon: Grid },
            { id: 'links', label: 'Liens', icon: Link },
            { id: 'banner', label: 'Bannière', icon: Type },
            { id: 'logo', label: 'Logo', icon: ImageIcon2 },
            { id: 'copyright', label: 'Copyright', icon: Copyright }
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
        <div className="lg:col-span-2">
          {/* Galerie */}
          {activeSection === 'gallery' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Grid size={24} />
                  Galerie d'images ({formData.galleryImages.length})
                </h3>
                <button
                  onClick={handleSaveGalleryOrder}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  disabled={formData.galleryImages.length === 0}
                >
                  <ArrowUpDown size={18} />
                  Sauvegarder l'ordre
                </button>
              </div>

              {/* Upload Zone avec Drag & Drop */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`mb-8 border-2 border-dashed rounded-xl p-8 transition-all ${
                  isDragOver
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryImageUpload}
                  disabled={isUploading}
                />

                <div className="text-center">
                  <ImagePlus
                    size={48}
                    className={`mx-auto mb-4 ${
                      isDragOver ? 'text-pink-500' : 'text-gray-400'
                    }`}
                  />
                  <p className="text-lg font-semibold mb-2">
                    {isUploading ? (
                      <>
                        Téléchargement en cours... ({Math.round(uploadProgress)}%)
                      </>
                    ) : (
                      'Glissez vos images ici'
                    )}
                  </p>
                  <p className="text-gray-500 mb-4">
                    ou cliquez sur le bouton ci-dessous pour sélectionner des fichiers
                  </p>

                  {/* Progress Bar */}
                  {isUploading && (
                    <div className="w-full max-w-xs mx-auto mb-4">
                      <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-pink-500 h-full transition-all duration-200"
                          style={{ width: `${Math.min(Math.round(uploadProgress), 100)}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-2 text-center font-semibold">
                        {Math.min(Math.round(uploadProgress), 100)}%
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isUploading ? (
                      <>
                        <span className="inline-block mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Téléchargement...
                      </>
                    ) : (
                      <>
                        <ImagePlus className="inline mr-2 h-5 w-5" />
                        Sélectionner des images
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Message de feedback */}
              {saveMessage && (
                <div className={`mb-6 p-4 rounded-lg ${
                  saveMessage.includes('✅')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {saveMessage}
                </div>
              )}

              <div className="space-y-4">
                {formData.galleryImages.length > 0 ? (
                  formData.galleryImages.map((img, index) => (
                    <div key={img._id || index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex gap-4 mb-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <img src={img.image} alt={img.alt} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">Image {index + 1}</h4>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleMoveImage(index, 'up')}
                                disabled={index === 0}
                                className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Déplacer vers le haut"
                              >
                                <ChevronUp size={20} />
                              </button>
                              <button
                                onClick={() => handleMoveImage(index, 'down')}
                                disabled={index === formData.galleryImages.length - 1}
                                className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Déplacer vers le bas"
                              >
                                <ChevronDown size={20} />
                              </button>
                              <button
                                onClick={() => img._id && handleDeleteGalleryImage(img._id)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded"
                                title="Supprimer l'image"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Texte alternatif</label>
                              <input
                                type="text"
                                value={img.alt}
                                onChange={(e) => {
                                  const newImages = [...formData.galleryImages];
                                  newImages[index].alt = e.target.value;
                                  setFormData(prev => ({ ...prev, galleryImages: newImages }));
                                }}
                                className="w-full border rounded-lg p-2"
                                placeholder="Description de l'image"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Ordre</label>
                              <input
                                type="number"
                                value={img.order}
                                onChange={(e) => {
                                  const newImages = [...formData.galleryImages];
                                  newImages[index].order = parseInt(e.target.value);
                                  setFormData(prev => ({ ...prev, galleryImages: newImages }));
                                }}
                                className="w-full border rounded-lg p-2"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg bg-gray-50">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 font-medium mb-4">Aucune image dans la galerie</p>
                    <p className="text-gray-400 text-sm mb-6">Commencez par ajouter vos premières images</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                    >
                      <ImagePlus className="inline mr-2 h-4 w-4" />
                      Ajouter des images
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Liens */}
          {activeSection === 'links' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Liens Utiles */}
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Link size={24} />
                      Liens Utiles
                    </h3>
                    <button
                      onClick={() => addLink('usefulLinks')}
                      className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                    >
                      <Plus size={18} />
                      Ajouter un lien
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Titre de la section</label>
                      <input
                        type="text"
                        value={formData.usefulLinks.title}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          usefulLinks: { ...prev.usefulLinks, title: e.target.value }
                        }))}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>

                    <div className="space-y-4">
                      {formData.usefulLinks.links.map((link, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                              Lien {index + 1}
                            </span>
                            <button
                              onClick={() => removeLink('usefulLinks', index)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Texte du lien</label>
                              <input
                                type="text"
                                value={link.text}
                                onChange={(e) => {
                                  const newLinks = [...formData.usefulLinks.links];
                                  newLinks[index].text = e.target.value;
                                  setFormData(prev => ({
                                    ...prev,
                                    usefulLinks: { ...prev.usefulLinks, links: newLinks }
                                  }));
                                }}
                                className="w-full border rounded-lg p-2"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">URL</label>
                              <input
                                type="text"
                                value={link.url}
                                onChange={(e) => {
                                  const newLinks = [...formData.usefulLinks.links];
                                  newLinks[index].url = e.target.value;
                                  setFormData(prev => ({
                                    ...prev,
                                    usefulLinks: { ...prev.usefulLinks, links: newLinks }
                                  }));
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

                {/* Pages Légales */}
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Globe size={24} />
                      Pages Légales
                    </h3>
                    <button
                      onClick={() => addLink('legalPages')}
                      className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                    >
                      <Plus size={18} />
                      Ajouter un lien
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Titre de la section</label>
                      <input
                        type="text"
                        value={formData.legalPages.title}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          legalPages: { ...prev.legalPages, title: e.target.value }
                        }))}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>

                    <div className="space-y-4">
                      {formData.legalPages.links.map((link, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                              Lien {index + 1}
                            </span>
                            <button
                              onClick={() => removeLink('legalPages', index)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Texte du lien</label>
                              <input
                                type="text"
                                value={link.text}
                                onChange={(e) => {
                                  const newLinks = [...formData.legalPages.links];
                                  newLinks[index].text = e.target.value;
                                  setFormData(prev => ({
                                    ...prev,
                                    legalPages: { ...prev.legalPages, links: newLinks }
                                  }));
                                }}
                                className="w-full border rounded-lg p-2"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">URL</label>
                              <input
                                type="text"
                                value={link.url}
                                onChange={(e) => {
                                  const newLinks = [...formData.legalPages.links];
                                  newLinks[index].url = e.target.value;
                                  setFormData(prev => ({
                                    ...prev,
                                    legalPages: { ...prev.legalPages, links: newLinks }
                                  }));
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
            </div>
          )}

          {/* Bannière */}
          {activeSection === 'banner' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Type size={24} />
                Bannière visuelle
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Texte de la bannière</label>
                  <textarea
                    value={formData.visualBanner.title}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      visualBanner: { ...prev.visualBanner, title: e.target.value }
                    }))}
                    className="w-full h-32 border rounded-lg p-3 text-2xl font-bold"
                    placeholder="Texte de la bannière..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Couleur de fond</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={formData.visualBanner.backgroundColor}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        visualBanner: { ...prev.visualBanner, backgroundColor: e.target.value }
                      }))}
                      className="w-12 h-12 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.visualBanner.backgroundColor}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        visualBanner: { ...prev.visualBanner, backgroundColor: e.target.value }
                      }))}
                      className="flex-1 border rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Aperçu de la bannière</h4>
                  <div 
                    className="h-32 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: formData.visualBanner.backgroundColor }}
                  >
                    <span className="text-white text-2xl font-bold">
                      {formData.visualBanner.title}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Logo */}
          {activeSection === 'logo' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <ImageIcon2 size={24} />
                Logo
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Logo actuel</label>
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <img 
                        src={formData.logo.url} 
                        alt={formData.logo.alt} 
                        className="max-w-full max-h-full"
                      />
                    </div>
                    <div>
                      <input
                        type="file"
                        ref={logoFileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                      <button
                        onClick={() => logoFileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 mb-4"
                      >
                        <Upload size={18} />
                        Changer le logo
                      </button>
                      <p className="text-sm text-gray-500">
                        Format recommandé : PNG transparent, minimum 200x200px
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Texte alternatif (alt)</label>
                  <input
                    type="text"
                    value={formData.logo.alt}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      logo: { ...prev.logo, alt: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3"
                    placeholder="Description du logo pour l'accessibilité"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">URL du logo</label>
                  <input
                    type="text"
                    value={formData.logo.url}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      logo: { ...prev.logo, url: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3 font-mono text-sm"
                    placeholder="URL de l'image du logo"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Laissez ce champ vide pour utiliser l'image téléchargée
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Copyright */}
          {activeSection === 'copyright' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Copyright size={24} />
                Copyright
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Texte de copyright</label>
                  <input
                    type="text"
                    value={formData.copyright.text}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      copyright: { ...prev.copyright, text: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3"
                    placeholder="© 2026 SWEETHOME. All rights reserved."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Texte de design</label>
                  <input
                    type="text"
                    value={formData.copyright.designText}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      copyright: { ...prev.copyright, designText: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3"
                    placeholder="Designed for Excellence"
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Aperçu</h4>
                  <div className="flex justify-between text-sm text-gray-600">
                    <p>{formData.copyright.text}</p>
                    <p>{formData.copyright.designText}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Panneau latéral */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Eye size={20} />
                Aperçu rapide
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Galerie</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Images: {formData.galleryImages.length}</p>
                    <div className="grid grid-cols-2 gap-1 mt-2">
                      {formData.galleryImages.slice(0, 4).map((img, i) => (
                        <div key={i} className="aspect-square overflow-hidden rounded">
                          <img src={img.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Liens</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Liens utiles: {formData.usefulLinks.links.length}</p>
                    <p>Pages légales: {formData.legalPages.links.length}</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Bannière</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Texte: {formData.visualBanner.title.substring(0, 20)}...</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span>Couleur:</span>
                      <span 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: formData.visualBanner.backgroundColor }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Logo</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                      <img src={formData.logo.url} alt="" className="max-w-full max-h-full" />
                    </div>
                    <span className="text-sm text-gray-600">{formData.logo.alt}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Settings size={20} />
                Actions rapides
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Mode</label>
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
                  <label className="block text-sm font-medium mb-2">Actions</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => fetchFooterData()}
                      className="w-full py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Recharger les données
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
                    <p>Total éléments: {
                      formData.galleryImages.length + 
                      formData.usefulLinks.links.length + 
                      formData.legalPages.links.length
                    }</p>
                    <p>Dernière sauvegarde: {saveMessage ? 'À l\'instant' : 'Jamais'}</p>
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

export default FooterEditor;