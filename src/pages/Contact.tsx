import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NavbarSpacer from '@/components/NavbarSpacer';
import apartment1 from "@/assets/apartment-1.jpg";
import apartment2 from "@/assets/apartment-2.jpg";
import bedroomTestimonial from "@/assets/bedroom-testimonial.jpg";
import avatar from "@/assets/avatar.jpg";
import { useContactPage, contactServices } from '@/services/contactApi';
import { IContactPage } from '@/types/contact.types';

// Configuration de la grille unifiée
const GRID_CONTAINER = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

// --- Icônes ---
const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9 7 9-7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="22 7 12 14 2 7"/></svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
);

// Données par défaut
const defaultContactPage: IContactPage = {
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
      {
        id: '1',
        label: 'Nom complet',
        placeholder: 'Votre nom',
        type: 'text',
        required: true
      },
      {
        id: '2',
        label: 'Téléphone',
        placeholder: 'Votre numéro',
        type: 'tel',
        required: true
      },
      {
        id: '3',
        label: 'Email',
        placeholder: 'votre@email.com',
        type: 'email',
        required: true
      },
      {
        id: '4',
        label: 'Message',
        placeholder: 'Comment pouvons-nous vous aider ?',
        type: 'textarea',
        required: true
      }
    ],
    consentText: 'J\'accepte la politique de confidentialité et la récolte de données.',
    submitButtonText: 'Envoyer le message'
  },
  testimonialSection: {
    title: 'CLASS APTENT TACITI SOCIOSQU AD LITORA TORQUENT',
    description: 'Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    testimonials: [
      {
        id: '1',
        name: 'John Doe',
        role: 'Curabitur tempus urna<br />at turpis',
        avatar: avatar,
        quote: 'Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
        rating: 5
      }
    ],
    featuredImage: bedroomTestimonial,
    accentColor: '#FF2D75'
  },
  gallerySection: {
    title: 'Gorem ipsum <br /> dolor sit amet, <br /> consectetur',
    description: 'Sorem ipsum dolor sit amet, consectetur <br /> adipiscing elit. Nunc vulputate et velit <br /> interdum, ac aliquet odio mattis.',
    items: [
      {
        id: '1',
        image: apartment1,
        alt: 'Salon moderne',
        title: 'Salon moderne',
        description: 'Salon élégant'
      },
      {
        id: '2',
        image: apartment2,
        alt: 'Chambre minimaliste',
        title: 'Chambre minimaliste',
        description: 'Chambre paisible'
      }
    ],
    accentColor: '#FF2D75'
  },
  meta: {
    updatedAt: new Date(),
    updatedBy: 'system',
    version: 1
  }
};

const Contact: React.FC = () => {
  const { pageData, loading, error, fetchPageData } = useContactPage();
  
  // Listen for cross-tab updates and refetch when admin saves changes
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === 'contact_updated') {
        try {
          fetchPageData && fetchPageData();
        } catch (err) {
          console.error('Failed to refetch contact page after storage event', err);
        }
      }
    };

    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('storage', handler);
    };
  }, [fetchPageData]);

  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const [formState, setFormState] = useState({
    fullName: '',
    phone: '',
    email: '',
    message: '',
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Utiliser les données du backend ou les données par défaut
  const data = pageData || defaultContactPage;

  const handlePrevTestimonial = () => {
    setActiveTestimonialIndex(prev => 
      prev === 0 ? data.testimonialSection.testimonials.length - 1 : prev - 1
    );
  };

  const handleNextTestimonial = () => {
    setActiveTestimonialIndex(prev => 
      prev === data.testimonialSection.testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormState(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormState(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await contactServices.submitContactForm({
        fullName: formState.fullName,
        phone: formState.phone,
        email: formState.email,
        message: formState.message,
        consent: formState.consent
      });

      if (response.status === 201 || response.status === 200) {
        setSubmitMessage({
          type: 'success',
          text: response.message || 'Votre message a été envoyé avec succès!'
        });
        setFormState({
          fullName: '',
          phone: '',
          email: '',
          message: '',
          consent: false
        });
        // Masquer le message de succès après 5 secondes
        setTimeout(() => {
          setSubmitMessage(null);
        }, 5000);
      } else {
        setSubmitMessage({
          type: 'error',
          text: response.message || 'Une erreur est survenue'
        });
      }
    } catch (error) {
      let errorText = 'Une erreur est survenue lors de l\'envoi du message';
      
      if (error instanceof Error) {
        errorText = error.message;
        
        // Gestion spécifique des erreurs de timeout
        if (error.message.includes('Délai d\'attente') || error.message.includes('timeout')) {
          errorText = 'La requête a expiré. Le serveur met trop de temps à répondre. Veuillez vérifier votre connexion internet et réessayer dans quelques instants.';
        } else if (error.message.includes('Impossible de contacter')) {
          errorText = 'Impossible de contacter le serveur. Veuillez vérifier votre connexion internet.';
        }
      }
      
      setSubmitMessage({
        type: 'error',
        text: errorText
      });
      
      // Log l'erreur pour le debugging
      console.error('Erreur lors de la soumission du formulaire:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen font-sans">
        <Navbar />
        <NavbarSpacer />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF2D75] mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement de la page contact...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    console.log('Using default data due to error:', error);
  }

  const activeTestimonial = data.testimonialSection.testimonials[activeTestimonialIndex];

  return (
    <div className="bg-white min-h-screen font-sans">
      <Navbar />
      <NavbarSpacer />

      <main className="py-0 lg:py-0">
        
        {/* --- SECTION 1: HERO & FORM (Fond gris encastré) --- */}
        <div className={GRID_CONTAINER}>
          <section className="bg-[#EBEBEB] rounded-2xl overflow-hidden shadow-sm">
            <div className="flex flex-col lg:flex-row items-stretch">
              
              {/* Côté Gauche: Visuel & Info */}
              <div className="lg:w-[45%] p-8 md:p-12 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-1.5 bg-[#FF2D75] mb-8"></div>
                  <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-8 text-black">
                    {data.heroSection.title.split(/\r?\n/).map((line, index, arr) => (
                      <React.Fragment key={index}>
                        {line}
                        {index < arr.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </h1>
                </div>

                <div className="space-y-6">
                  <div className="h-[300px] rounded-xl overflow-hidden shadow-lg">
                    <img 
                      src={data.heroSection.backgroundImage} 
                      alt="Chambre" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1000&auto=format&fit=crop';
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white/80 backdrop-blur-md p-4 rounded-xl flex items-center gap-3 border border-white">
                      <div className="bg-black text-white p-2.5 rounded-lg"><MailIcon /></div>
                      <span className="text-[13px] font-bold text-black truncate">{data.heroSection.email}</span>
                    </div>
                    <div className="bg-white/80 backdrop-blur-md p-4 rounded-xl flex items-center gap-3 border border-white">
                      <div className="bg-black text-white p-2.5 rounded-lg"><PhoneIcon /></div>
                      <span className="text-[13px] font-bold text-black">{data.heroSection.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Côté Droit: Formulaire (Card Blanche) */}
              <div className="lg:w-[55%] p-4 md:p-8 lg:p-12">
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl h-full">
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    {submitMessage && (
                      <div className={`p-4 rounded-lg text-sm font-medium ${
                        submitMessage.type === 'success' 
                          ? 'bg-green-100 text-green-800 border border-green-300' 
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}>
                        {submitMessage.text}
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black tracking-widest text-gray-400">Nom complet</label>
                        <input 
                          type="text" 
                          name="fullName"
                          value={formState.fullName}
                          onChange={handleInputChange}
                          placeholder="Votre nom" 
                          className="w-full bg-gray-50 border border-gray-100 p-4 rounded-lg outline-none focus:border-[#FF2D75] transition-all text-sm" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black tracking-widest text-gray-400">Téléphone</label>
                        <input 
                          type="tel" 
                          name="phone"
                          value={formState.phone}
                          onChange={handleInputChange}
                          placeholder="Votre numéro" 
                          className="w-full bg-gray-50 border border-gray-100 p-4 rounded-lg outline-none focus:border-[#FF2D75] transition-all text-sm" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black tracking-widest text-gray-400">Email</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formState.email}
                        onChange={handleInputChange}
                        placeholder="votre@email.com" 
                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-lg outline-none focus:border-[#FF2D75] transition-all text-sm" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black tracking-widest text-gray-400">Message</label>
                      <textarea 
                        rows={4} 
                        name="message"
                        value={formState.message}
                        onChange={handleInputChange}
                        placeholder="Comment pouvons-nous vous aider ?" 
                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-lg outline-none focus:border-[#FF2D75] transition-all text-sm resize-none"
                      ></textarea>
                    </div>
                    
                    <div className="flex items-center gap-3 py-2">
                      <input 
                        type="checkbox" 
                        id="consent" 
                        name="consent"
                        checked={formState.consent}
                        onChange={handleInputChange}
                        className="w-4 h-4 accent-[#FF2D75] cursor-pointer" 
                      />
                      <label htmlFor="consent" className="text-[10px] text-gray-400 font-medium cursor-pointer tracking-tight">
                        {data.contactForm.consentText.split(/\r?\n/).map((line, i, arr) => (
                          <React.Fragment key={i}>
                            {line}
                            {i < arr.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </label>
                    </div>

                    <button 
                      type="submit"
                      disabled={!formState.consent || isSubmitting}
                      className="w-full bg-black text-white font-black tracking-[0.2em] py-5 rounded-xl hover:bg-[#FF2D75] transition-all transform active:scale-[0.98] text-xs shadow-lg shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Envoi en cours...' : data.contactForm.submitButtonText.split(/\r?\n/).map((line, i, arr) => (
                        <React.Fragment key={i}>
                          {line}
                          {i < arr.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* --- SECTION 2: TESTIMONIAL --- */}
        <section className="section-dark py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left Side - Text Content */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase leading-tight mb-6">
                    {data.testimonialSection.title.split(/\r?\n/).map((line, i, arr) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < arr.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </h2>
                  <p className="text-dark-muted text-sm leading-relaxed">
                    {data.testimonialSection.description.split(/\r?\n/).map((line, i, arr) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < arr.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </p>
                </div>

                {/* Testimonial Card */}
                <div className="bg-background text-foreground p-6 lg:p-8">
                  <div className="testimonial-quote mb-4">"</div>
                  <p className="text-sm leading-relaxed mb-6">
                    {activeTestimonial.quote.split(/\r?\n/).map((line, i, arr) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < arr.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={activeTestimonial.avatar}
                        alt={activeTestimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = avatar;
                        }}
                      />
                      <div>
                        <p className="font-semibold text-sm">{activeTestimonial.name}</p>
                        <p 
                          className="text-xs text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: activeTestimonial.role }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={handlePrevTestimonial}
                        className="w-8 h-8 border border-foreground rounded-full flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={handleNextTestimonial}
                        className="w-8 h-8 border border-foreground rounded-full flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Image with Accent */}
              <div className="relative">
                <div 
                  className="absolute top-[50px] left-0 w-20 h-20 bg-primary -translate-x-4 z-10"
                  style={{ backgroundColor: data.testimonialSection.accentColor }}
                />
                <img
                  src={data.testimonialSection.featuredImage}
                  alt="Chambre moderne avec canapé terracotta"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                  onError={(e) => {
                    e.currentTarget.src = bedroomTestimonial;
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 3: IMAGES GALLERY --- */}
       <section className="bg-white py-12 lg:py-16">
        <div className={GRID_CONTAINER}>
          
          {/* Le fond (bg-secondary ou bg-background) est limité ici par le grid */}
          <div className="bg-white rounded-[2rem] px-8 py-12 md:px-12 lg:px-16 lg:py-20 shadow-sm">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Texte de gauche - occupe 3 colonnes sur 12 */}
              <div className="lg:col-span-6">
                <h3 className="text-xl md:text-2xl font-bold leading-tight mb-4 text-black uppercase tracking-tighter">
                  {data.gallerySection.title.split(/\r?\n/).map((line, index, arr) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {data.gallerySection.description.split(/\r?\n/).map((line, index, arr) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </div>

              {/* Section centrale/droite - occupe 9 colonnes sur 12 */}
              <div className="lg:col-span-6">
                <div className="flex flex-col">
                  
                  {/* Texte au-dessus des images */}
                  <div className="mb-6 lg:mb-8">
                    <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-black font-medium">
                      Nunc vulputate <span className="text-[#FF2D75] font-bold">libero et velit</span> interdum, ac <br className="hidden lg:block"/> aliquet odio mattis.
                    </p>
                  </div>
                  
                  {/* Images côte à côte */}
                  <div className="flex gap-4">
                    {data.gallerySection.items.slice(0, 2).map((item, index) => (
                      <div key={item.id} className="w-1/2 aspect-[4/5] overflow-hidden rounded-xl shadow-lg">
                        <img
                          src={item.image}
                          alt={item.alt}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = index === 0 ? apartment1 : apartment2;
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;