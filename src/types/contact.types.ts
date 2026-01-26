export interface IHeroSection {
  title: string;
  subtitle: string;
  backgroundImage: string;
  email: string;
  phone: string;
  emailIcon: string;
  phoneIcon: string;
}

export interface IFormField {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'checkbox';
  required: boolean;
}

export interface IContactForm {
  title: string;
  fields: IFormField[];
  consentText: string;
  submitButtonText: string;
}

export interface ITestimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

export interface ITestimonialSection {
  title: string;
  description: string;
  testimonials: ITestimonial[];
  featuredImage: string;
  accentColor: string;
}

export interface IGalleryItem {
  id: string;
  image: string;
  alt: string;
  title: string;
  description: string;
}

export interface IGallerySection {
  title: string;
  description: string;
  items: IGalleryItem[];
  accentColor: string;
}

export interface IContactPage {
  heroSection: IHeroSection;
  contactForm: IContactForm;
  testimonialSection: ITestimonialSection;
  gallerySection: IGallerySection;
  meta: {
    updatedAt: Date;
    updatedBy: string;
    version: number;
  };
}

// Types pour les requêtes
export interface UpdateContactPageRequest {
  heroSection?: Partial<IHeroSection>;
  contactForm?: Partial<IContactForm>;
  testimonialSection?: Partial<ITestimonialSection>;
  gallerySection?: Partial<IGallerySection>;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}