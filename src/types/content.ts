// Types for all editable content in the dashboard

export interface NavbarContent {
  logo: string;
  links: Array<{ label: string; href: string; sectionId?: string }>;
  ctaButton: string;
}

export interface HeroContent {
  title: string[];
  subtitle: string;
  ctaButton: string;
  testimonial: {
    image: string;
    name: string;
    quote: string;
  };
  images: {
    main: string;
    secondary: string;
    tertiary: string;
  };
}

export interface WelcomeContent {
  title: string;
  description: string;
  features: Array<{ icon: string; label: string }>;
  ctaButton: string;
  images: {
    video: string;
    photo1: string;
    photo2: string;
  };
}

export interface ServiceContent {
  hero: {
    title: string[];
    description: string;
    image: string;
  };
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
}

export interface ApartmentContent {
  hero: {
    title: string[];
    description: string;
    image: string;
  };
  sectionTitle: string;
  sectionDescription: string;
  rooms: Array<{
    image: string;
    title: string;
    description: string;
    guests: string;
    bedrooms: string;
  }>;
}

export interface ApartmentDetailContent {
  title: string;
  price: number;
  priceUnit: string;
  description: string;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  images: string[];
  amenities: Array<{ icon: string; label: string }>;
}

export interface PricingContent {
  title: string;
  description: string;
  plans: Array<{
    name: string;
    price: number;
    period: string;
    features: string[];
    isPopular?: boolean;
  }>;
}

export interface ContactContent {
  title: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  formFields: {
    name: string;
    phone: string;
    email: string;
    address: string;
    message: string;
  };
  submitButton: string;
  image: string;
}

export interface FooterContent {
  logo: string;
  usefulLinks: Array<{ label: string; href: string }>;
  legalLinks: Array<{ label: string; href: string }>;
  galleryImages: string[];
  tagline: string;
  copyright: string;
}

export interface PageContent {
  id: string;
  name: string;
  icon: string;
}

export interface SiteContent {
  navbar: NavbarContent;
  home: {
    hero: HeroContent;
    welcome: WelcomeContent;
  };
  services: ServiceContent;
  apartments: ApartmentContent;
  apartmentDetail: ApartmentDetailContent;
  pricing: PricingContent;
  contact: ContactContent;
  footer: FooterContent;
}
