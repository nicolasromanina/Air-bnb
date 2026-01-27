import React, { useState, useEffect } from 'react';
import { 
  Save, Upload, Image as ImageIcon, Trash2, Plus, 
  Eye, EyeOff, MoveUp, MoveDown, Settings, Palette,
  Mail, Phone, MessageSquare, User, Type, Layout,
  ChevronDown, ChevronUp
} from 'lucide-react';

// Types
interface HeroSectionData {
  title: string;
  subtitle: string;
  backgroundImage: string;
  email: string;
  phone: string;
  emailIcon: string;
  phoneIcon: string;
}

interface FormField {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'checkbox';
  required: boolean;
}

interface ContactFormData {
  title: string;
  fields: FormField[];
  consentText: string;
  submitButtonText: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

interface TestimonialSectionData {
  title: string;
  description: string;
  testimonials: Testimonial[];
  featuredImage: string;
  accentColor: string;
}

interface GalleryItem {
  id: string;
  image: string;
  alt: string;
  title: string;
  description: string;
}

interface GallerySectionData {
  title: string;
  description: string;
  items: GalleryItem[];
  accentColor: string;
}

interface ContactPageData {
  heroSection: HeroSectionData;
  contactForm: ContactFormData;
  testimonialSection: TestimonialSectionData;
  gallerySection: GallerySectionData;
}

const ContactEditor: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'hero' | 'form' | 'testimonials' | 'gallery'>('hero');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Données initiales
  const [pageData, setPageData] = useState<ContactPageData>({
    heroSection: {
      title: 'CONTACTEZ\nNOUS',
      subtitle: 'Nous sommes là pour vous aider',
      backgroundImage: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1000&auto=format&fit=crop',
      email: 'contact@example.com',
      phone: '+33 00 00 000',
      emailIcon: 'mail',
      phoneIcon: 'phone'
    },
    contactForm: {
      title: 'Contactez-nous',
      fields: [
        { id: '1', label: 'Nom complet', placeholder: 'Votre nom', type: 'text', required: true },
        { id: '2', label: 'Téléphone', placeholder: 'Votre numéro', type: 'tel', required: true },
        { id: '3', label: 'Email', placeholder: 'votre@email.com', type: 'email', required: true },
        { id: '4', label: 'Message', placeholder: 'Comment pouvons-nous vous aider ?', type: 'textarea', required: true }
      ],
      consentText: 'J\'accepte la politique de confidentialité et la récolte de données.',
      submitButtonText: 'Envoyer le message'
    },
    testimonialSection: {
      title: 'CLASS APTENT TACITI SOCIOSQU AD LITORA TORQUENT',
      description: 'Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
      testimonials: [
        { id: '1', name: 'John Doe', role: 'Client satisfait', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', quote: 'Excellent service ! L\'équipe a été très réactive et professionnelle.', rating: 5 }
      ],
      featuredImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop',
      accentColor: '#FF2D75'
    },
    gallerySection: {
      title: 'Gorem ipsum dolor sit amet, consectetur',
      description: 'Sorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate et velit interdum, ac aliquet odio mattis.',
      items: [
        { id: '1', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop', alt: 'Salon moderne', title: 'Salon élégant', description: 'Espace de vie moderne et confortable' },
        { id: '2', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000&auto=format&fit=crop', alt: 'Chambre minimaliste', title: 'Chambre paisible', description: 'Ambiance calme et reposante' }
      ],
      accentColor: '#FF2D75'
    }
  });

  // Charger les données depuis l'API
  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchPageData = async () => {
    try {
      const response = await fetch('https://airbnb-backend-l640.onrender.com/api/contact');
      if (response.ok) {
        const data = await response.json();
        setPageData(data);
      } else {
        const text = await response.text();
        console.error('Failed to load contact page:', response.status, text);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch('https://airbnb-backend-l640.onrender.com/api/contact', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
          },
        body: JSON.stringify(pageData)
      });

      if (response.ok) {
        setSaveMessage('✅ Page sauvegardée avec succès!');
        // Notify other tabs (public page) that contact page changed
        try {
          localStorage.setItem('contact_updated', Date.now().toString());
        } catch (e) {
          // ignore
        }
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        let errMsg = 'Erreur lors de la sauvegarde';
        try {
          const json = await response.json();
          errMsg = json?.error || JSON.stringify(json);
        } catch (e) {
          const txt = await response.text();
          errMsg = txt || errMsg;
        }
        console.error('Save failed:', response.status, errMsg);
        throw new Error(errMsg);
      }
    } catch (error) {
      setSaveMessage('❌ Erreur lors de la sauvegarde');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, section: keyof ContactPageData) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Ici, vous implémenteriez l'upload vers votre serveur
    // Pour l'exemple, on utilise un service d'upload simulé
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      setPageData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: imageUrl
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const addFormField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      label: 'Nouveau champ',
      placeholder: 'Placeholder',
      type: 'text',
      required: false
    };

    setPageData(prev => ({
      ...prev,
      contactForm: {
        ...prev.contactForm,
        fields: [...prev.contactForm.fields, newField]
      }
    }));
  };

  const removeFormField = (id: string) => {
    setPageData(prev => ({
      ...prev,
      contactForm: {
        ...prev.contactForm,
        fields: prev.contactForm.fields.filter(field => field.id !== id)
      }
    }));
  };

  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      name: 'Nouveau client',
      role: 'Client',
      avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
      quote: 'Témoignage à éditer...',
      rating: 5
    };

    setPageData(prev => ({
      ...prev,
      testimonialSection: {
        ...prev.testimonialSection,
        testimonials: [...prev.testimonialSection.testimonials, newTestimonial]
      }
    }));
  };

  const addGalleryItem = () => {
    const newItem: GalleryItem = {
      id: Date.now().toString(),
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop',
      alt: 'Nouvelle image',
      title: 'Nouvel élément',
      description: 'Description à éditer'
    };

    setPageData(prev => ({
      ...prev,
      gallerySection: {
        ...prev.gallerySection,
        items: [...prev.gallerySection.items, newItem]
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
          <h2 className="text-2xl font-bold">Aperçu de la page Contact</h2>
          <button
            onClick={() => setIsPreview(false)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Quitter l'aperçu
          </button>
        </div>
        
        {/* Aperçu de la Hero Section */}
        <div className="bg-gray-100 rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-1.5 bg-pink-500"></div>
            <h1 className="text-4xl font-black uppercase whitespace-pre-line">
              {pageData.heroSection.title}
            </h1>
          </div>
          <div className="h-48 rounded-xl overflow-hidden">
            <img 
              src={pageData.heroSection.backgroundImage} 
              alt="Hero" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Aperçu du formulaire */}
        <div className="bg-white rounded-2xl p-8 border mb-6">
          <h3 className="text-xl font-bold mb-4">Formulaire de contact</h3>
          <div className="space-y-4">
            {pageData.contactForm.fields.map(field => (
              <div key={field.id}>
                <label className="block text-sm font-medium mb-1">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea 
                    className="w-full border rounded-lg p-2" 
                    placeholder={field.placeholder}
                    rows={3}
                    disabled
                  />
                ) : (
                  <input 
                    type={field.type}
                    className="w-full border rounded-lg p-2"
                    placeholder={field.placeholder}
                    disabled
                  />
                )}
              </div>
            ))}
            <button className="bg-black text-white w-full py-3 rounded-lg">
              {pageData.contactForm.submitButtonText}
            </button>
          </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Éditeur de la page Contact</h1>
            <p className="text-gray-600">Modifiez tous les éléments de votre page de contact</p>
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
            { id: 'form', label: 'Formulaire', icon: MessageSquare },
            { id: 'testimonials', label: 'Témoignages', icon: User },
            { id: 'gallery', label: 'Galerie', icon: ImageIcon }
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
                  <textarea
                    value={pageData.heroSection.title}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      heroSection: { ...prev.heroSection, title: e.target.value }
                    }))}
                    className="w-full h-32 border rounded-lg p-3 font-bold text-lg"
                    placeholder="Titre sur plusieurs lignes"
                  />
                  <p className="text-sm text-gray-500 mt-1">Appuyez sur Entrée pour insérer des sauts de ligne</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sous-titre</label>
                  <textarea
                    value={pageData.heroSection.subtitle}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      heroSection: { ...prev.heroSection, subtitle: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3 h-20"
                    placeholder="Sous-titre (plusieurs lignes possibles)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Image d'arrière-plan</label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden">
                      <img 
                        src={pageData.heroSection.backgroundImage} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={pageData.heroSection.backgroundImage}
                        onChange={(e) => setPageData(prev => ({
                          ...prev,
                          heroSection: { ...prev.heroSection, backgroundImage: e.target.value }
                        }))}
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
                          onChange={(e) => handleImageUpload(e, 'backgroundImage', 'heroSection')}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <div className="flex items-center gap-2">
                      <Mail size={20} className="text-gray-500" />
                      <input
                        type="email"
                        value={pageData.heroSection.email}
                        onChange={(e) => setPageData(prev => ({
                          ...prev,
                          heroSection: { ...prev.heroSection, email: e.target.value }
                        }))}
                        className="flex-1 border rounded-lg p-3"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Téléphone</label>
                    <div className="flex items-center gap-2">
                      <Phone size={20} className="text-gray-500" />
                      <input
                        type="tel"
                        value={pageData.heroSection.phone}
                        onChange={(e) => setPageData(prev => ({
                          ...prev,
                          heroSection: { ...prev.heroSection, phone: e.target.value }
                        }))}
                        className="flex-1 border rounded-lg p-3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'form' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <MessageSquare size={24} />
                  Formulaire de contact
                </h3>
                <button
                  onClick={addFormField}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  <Plus size={18} />
                  Ajouter un champ
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre du formulaire</label>
                  <textarea
                    value={pageData.contactForm.title}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      contactForm: { ...prev.contactForm, title: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3 h-20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-4">Champs du formulaire</label>
                  <div className="space-y-4">
                    {pageData.contactForm.fields.map((field, index) => (
                      <div key={field.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                              {field.type}
                            </span>
                            {field.required && (
                              <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">
                                Requis
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const newFields = moveItem(pageData.contactForm.fields, index, 'up');
                                setPageData(prev => ({
                                  ...prev,
                                  contactForm: { ...prev.contactForm, fields: newFields }
                                }));
                              }}
                              disabled={index === 0}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                            >
                              <ChevronUp size={20} />
                            </button>
                            <button
                              onClick={() => {
                                const newFields = moveItem(pageData.contactForm.fields, index, 'down');
                                setPageData(prev => ({
                                  ...prev,
                                  contactForm: { ...prev.contactForm, fields: newFields }
                                }));
                              }}
                              disabled={index === pageData.contactForm.fields.length - 1}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                            >
                              <ChevronDown size={20} />
                            </button>
                            <button
                              onClick={() => removeFormField(field.id)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Label</label>
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) => {
                                const newFields = [...pageData.contactForm.fields];
                                newFields[index].label = e.target.value;
                                setPageData(prev => ({
                                  ...prev,
                                  contactForm: { ...prev.contactForm, fields: newFields }
                                }));
                              }}
                              className="w-full border rounded-lg p-2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select
                              value={field.type}
                              onChange={(e) => {
                                const newFields = [...pageData.contactForm.fields];
                                newFields[index].type = e.target.value as any;
                                setPageData(prev => ({
                                  ...prev,
                                  contactForm: { ...prev.contactForm, fields: newFields }
                                }));
                              }}
                              className="w-full border rounded-lg p-2"
                            >
                              <option value="text">Texte</option>
                              <option value="email">Email</option>
                              <option value="tel">Téléphone</option>
                              <option value="textarea">Zone de texte</option>
                              <option value="checkbox">Case à cocher</option>
                            </select>
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-1">Placeholder</label>
                          <input
                            type="text"
                            value={field.placeholder}
                            onChange={(e) => {
                              const newFields = [...pageData.contactForm.fields];
                              newFields[index].placeholder = e.target.value;
                              setPageData(prev => ({
                                ...prev,
                                contactForm: { ...prev.contactForm, fields: newFields }
                              }));
                            }}
                            className="w-full border rounded-lg p-2"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`required-${field.id}`}
                            checked={field.required}
                            onChange={(e) => {
                              const newFields = [...pageData.contactForm.fields];
                              newFields[index].required = e.target.checked;
                              setPageData(prev => ({
                                ...prev,
                                contactForm: { ...prev.contactForm, fields: newFields }
                              }));
                            }}
                            className="rounded"
                          />
                          <label htmlFor={`required-${field.id}`} className="text-sm">
                            Champ obligatoire
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Texte de consentement</label>
                  <textarea
                    value={pageData.contactForm.consentText}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      contactForm: { ...prev.contactForm, consentText: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3 h-24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Texte du bouton d'envoi</label>
                  <input
                    type="text"
                    value={pageData.contactForm.submitButtonText}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      contactForm: { ...prev.contactForm, submitButtonText: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'testimonials' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <User size={24} />
                  Section Témoignages
                </h3>
                <button
                  onClick={addTestimonial}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  <Plus size={18} />
                  Ajouter un témoignage
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre de la section</label>
                  <textarea
                    value={pageData.testimonialSection.title}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      testimonialSection: { ...prev.testimonialSection, title: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3 h-20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={pageData.testimonialSection.description}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      testimonialSection: { ...prev.testimonialSection, description: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3 h-32"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Image principale</label>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-32 rounded-lg overflow-hidden">
                      <img 
                        src={pageData.testimonialSection.featuredImage} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={pageData.testimonialSection.featuredImage}
                        onChange={(e) => setPageData(prev => ({
                          ...prev,
                          testimonialSection: { ...prev.testimonialSection, featuredImage: e.target.value }
                        }))}
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
                          onChange={(e) => handleImageUpload(e, 'featuredImage', 'testimonialSection')}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-4">Témoignages</label>
                  <div className="space-y-4">
                    {pageData.testimonialSection.testimonials.map((testimonial, index) => (
                      <div key={testimonial.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden">
                              <img 
                                src={testimonial.avatar} 
                                alt={testimonial.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{testimonial.name}</h4>
                              <p className="text-sm text-gray-500">{testimonial.role}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const newTestimonials = moveItem(pageData.testimonialSection.testimonials, index, 'up');
                                setPageData(prev => ({
                                  ...prev,
                                  testimonialSection: { ...prev.testimonialSection, testimonials: newTestimonials }
                                }));
                              }}
                              disabled={index === 0}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                            >
                              <ChevronUp size={20} />
                            </button>
                            <button
                              onClick={() => {
                                const newTestimonials = moveItem(pageData.testimonialSection.testimonials, index, 'down');
                                setPageData(prev => ({
                                  ...prev,
                                  testimonialSection: { ...prev.testimonialSection, testimonials: newTestimonials }
                                }));
                              }}
                              disabled={index === pageData.testimonialSection.testimonials.length - 1}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                            >
                              <ChevronDown size={20} />
                            </button>
                            <button
                              onClick={() => {
                                const newTestimonials = pageData.testimonialSection.testimonials.filter(t => t.id !== testimonial.id);
                                setPageData(prev => ({
                                  ...prev,
                                  testimonialSection: { ...prev.testimonialSection, testimonials: newTestimonials }
                                }));
                              }}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-1">Citation</label>
                          <textarea
                            value={testimonial.quote}
                            onChange={(e) => {
                              const newTestimonials = [...pageData.testimonialSection.testimonials];
                              newTestimonials[index].quote = e.target.value;
                              setPageData(prev => ({
                                ...prev,
                                testimonialSection: { ...prev.testimonialSection, testimonials: newTestimonials }
                              }));
                            }}
                            className="w-full border rounded-lg p-2 h-24"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Nom</label>
                            <input
                              type="text"
                              value={testimonial.name}
                              onChange={(e) => {
                                const newTestimonials = [...pageData.testimonialSection.testimonials];
                                newTestimonials[index].name = e.target.value;
                                setPageData(prev => ({
                                  ...prev,
                                  testimonialSection: { ...prev.testimonialSection, testimonials: newTestimonials }
                                }));
                              }}
                              className="w-full border rounded-lg p-2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Rôle/Fonction</label>
                            <input
                              type="text"
                              value={testimonial.role}
                              onChange={(e) => {
                                const newTestimonials = [...pageData.testimonialSection.testimonials];
                                newTestimonials[index].role = e.target.value;
                                setPageData(prev => ({
                                  ...prev,
                                  testimonialSection: { ...prev.testimonialSection, testimonials: newTestimonials }
                                }));
                              }}
                              className="w-full border rounded-lg p-2"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">Avatar URL</label>
                          <input
                            type="text"
                            value={testimonial.avatar}
                            onChange={(e) => {
                              const newTestimonials = [...pageData.testimonialSection.testimonials];
                              newTestimonials[index].avatar = e.target.value;
                              setPageData(prev => ({
                                ...prev,
                                testimonialSection: { ...prev.testimonialSection, testimonials: newTestimonials }
                              }));
                            }}
                            className="w-full border rounded-lg p-2"
                          />
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">Note</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => {
                                  const newTestimonials = [...pageData.testimonialSection.testimonials];
                                  newTestimonials[index].rating = star;
                                  setPageData(prev => ({
                                    ...prev,
                                    testimonialSection: { ...prev.testimonialSection, testimonials: newTestimonials }
                                  }));
                                }}
                                className={`text-2xl ${star <= testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Couleur d'accent</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={pageData.testimonialSection.accentColor}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        testimonialSection: { ...prev.testimonialSection, accentColor: e.target.value }
                      }))}
                      className="w-12 h-12 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={pageData.testimonialSection.accentColor}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        testimonialSection: { ...prev.testimonialSection, accentColor: e.target.value }
                      }))}
                      className="flex-1 border rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'gallery' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <ImageIcon size={24} />
                  Galerie d'images
                </h3>
                <button
                  onClick={addGalleryItem}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  <Plus size={18} />
                  Ajouter une image
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre de la section</label>
                  <textarea
                    value={pageData.gallerySection.title}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      gallerySection: { ...prev.gallerySection, title: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3 h-20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={pageData.gallerySection.description}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      gallerySection: { ...prev.gallerySection, description: e.target.value }
                    }))}
                    className="w-full border rounded-lg p-3 h-24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-4">Images de la galerie</label>
                  <div className="space-y-4">
                    {pageData.gallerySection.items.map((item, index) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex gap-4 mb-4">
                          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.alt}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{item.title}</h4>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    const newItems = moveItem(pageData.gallerySection.items, index, 'up');
                                    setPageData(prev => ({
                                      ...prev,
                                      gallerySection: { ...prev.gallerySection, items: newItems }
                                    }));
                                  }}
                                  disabled={index === 0}
                                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                                >
                                  <ChevronUp size={20} />
                                </button>
                                <button
                                  onClick={() => {
                                    const newItems = moveItem(pageData.gallerySection.items, index, 'down');
                                    setPageData(prev => ({
                                      ...prev,
                                      gallerySection: { ...prev.gallerySection, items: newItems }
                                    }));
                                  }}
                                  disabled={index === pageData.gallerySection.items.length - 1}
                                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                                >
                                  <ChevronDown size={20} />
                                </button>
                                <button
                                  onClick={() => {
                                    const newItems = pageData.gallerySection.items.filter(i => i.id !== item.id);
                                    setPageData(prev => ({
                                      ...prev,
                                      gallerySection: { ...prev.gallerySection, items: newItems }
                                    }));
                                  }}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <label className="block text-xs font-medium mb-1">Titre de l'image</label>
                                <textarea
                                  value={item.title}
                                  onChange={(e) => {
                                    const newItems = [...pageData.gallerySection.items];
                                    newItems[index].title = e.target.value;
                                    setPageData(prev => ({
                                      ...prev,
                                      gallerySection: { ...prev.gallerySection, items: newItems }
                                    }));
                                  }}
                                  className="w-full border rounded-lg p-2 text-sm h-16"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1">Description</label>
                                <textarea
                                  value={item.description}
                                  onChange={(e) => {
                                    const newItems = [...pageData.gallerySection.items];
                                    newItems[index].description = e.target.value;
                                    setPageData(prev => ({
                                      ...prev,
                                      gallerySection: { ...prev.gallerySection, items: newItems }
                                    }));
                                  }}
                                  className="w-full border rounded-lg p-2 text-sm h-20"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium mb-1">URL de l'image</label>
                            <input
                              type="text"
                              value={item.image}
                              onChange={(e) => {
                                const newItems = [...pageData.gallerySection.items];
                                newItems[index].image = e.target.value;
                                setPageData(prev => ({
                                  ...prev,
                                  gallerySection: { ...prev.gallerySection, items: newItems }
                                }));
                              }}
                              className="w-full border rounded-lg p-2 text-sm"
                            />
                            <label className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 text-xs mt-2 w-fit">
                              <Upload size={14} />
                              Changer l'image
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  // Gérer l'upload d'image pour cet élément spécifique
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      const newItems = [...pageData.gallerySection.items];
                                      newItems[index].image = reader.result as string;
                                      setPageData(prev => ({
                                        ...prev,
                                        gallerySection: { ...prev.gallerySection, items: newItems }
                                      }));
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Texte alternatif (alt)</label>
                            <input
                              type="text"
                              value={item.alt}
                              onChange={(e) => {
                                const newItems = [...pageData.gallerySection.items];
                                newItems[index].alt = e.target.value;
                                setPageData(prev => ({
                                  ...prev,
                                  gallerySection: { ...prev.gallerySection, items: newItems }
                                }));
                              }}
                              className="w-full border rounded-lg p-2 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Couleur d'accent</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={pageData.gallerySection.accentColor}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        gallerySection: { ...prev.gallerySection, accentColor: e.target.value }
                      }))}
                      className="w-12 h-12 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={pageData.gallerySection.accentColor}
                      onChange={(e) => setPageData(prev => ({
                        ...prev,
                        gallerySection: { ...prev.gallerySection, accentColor: e.target.value }
                      }))}
                      className="flex-1 border rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
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
                    <p>Titre: {pageData.heroSection.title.split('\n')[0].substring(0, 30)}...</p>
                    <p>Email: {pageData.heroSection.email}</p>
                    <p>Téléphone: {pageData.heroSection.phone}</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Formulaire</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Champs: {pageData.contactForm.fields.length}</p>
                    <p>Bouton: {pageData.contactForm.submitButtonText.substring(0, 20)}...</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Témoignages</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Nombre: {pageData.testimonialSection.testimonials.length}</p>
                    <p>Couleur: 
                      <span 
                        className="inline-block w-3 h-3 rounded-full ml-2"
                        style={{ backgroundColor: pageData.testimonialSection.accentColor }}
                      ></span>
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Galerie</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Images: {pageData.gallerySection.items.length}</p>
                    <p>Couleur: 
                      <span 
                        className="inline-block w-3 h-3 rounded-full ml-2"
                        style={{ backgroundColor: pageData.gallerySection.accentColor }}
                      ></span>
                    </p>
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
                    <p>Version: {pageData.testimonialSection.testimonials.length + pageData.gallerySection.items.length}</p>
                    <p>Total d'éléments: {
                      pageData.contactForm.fields.length + 
                      pageData.testimonialSection.testimonials.length + 
                      pageData.gallerySection.items.length
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

export default ContactEditor;