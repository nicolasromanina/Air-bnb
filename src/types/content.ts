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
  videoUrl: string;
  images: {
    video: string;
    photo1: string;
    photo2: string;
  };
}

export interface MarqueeContent {
  text: string;
  speed: number;
}

export interface DestinationSearchContent {
  title: string;
  labels: {
    location: string;
    checkIn: string;
    checkOut: string;
    guests: string;
    searchButton: string;
  };
  placeholders: {
    location: string;
    checkIn: string;
    checkOut: string;
    guests: string;
  };
}

export interface FeatureRoomContent {
  title: string;
  description: string;
  cards: Array<{
    title: string;
    description: string;
    image: string;
    icon: string;
  }>;
}

export interface VideoSectionContent {
  title: string;
  description: string;
  videoUrl: string;
  coverImage: string;
  galleryImages: string[];
}

export interface ServicesSectionContent {
  title: string;
  services: Array<{
    image: string;
    title: string;
    description: string;
  }>;
  ctaButton: string;
}

export interface FeaturesSectionContent {
  title: string;
  features: Array<{
    icon: string;
    title: string;
  }>;
  images: string[];
}

export interface StatsSectionContent {
  stats: Array<{
    value: string;
    label: string;
  }>;
  propertyCard: {
    image: string;
    title: string;
    price: number;
    priceUnit: string;
    features: Array<{ icon: string; label: string }>;
    description: string;
  };
}

export interface LogoSectionContent {
  title: string;
  logos: string[];
}

export interface ThreeCardsSectionContent {
  cards: Array<{
    title: string;
    description: string;
    buttonText?: string;
    style: 'gray' | 'black' | 'white';
  }>;
}

// Home page contains 14 sections
export interface HomeContent {
  hero: HeroContent;
  welcome: WelcomeContent;
  marquee: MarqueeContent;
  destinationSearch: DestinationSearchContent;
  featureRoom: FeatureRoomContent;
  marqueeBlack: MarqueeContent;
  videoSection: VideoSectionContent;
  servicesSection: ServicesSectionContent;
  featuresSection: FeaturesSectionContent;
  statsSection: StatsSectionContent;
  logoSection: LogoSectionContent;
  threeCards: ThreeCardsSectionContent;
}

// Service1 contains 5 sections
export interface Service1Content {
  hero: {
    title: string[];
    description: string;
    image: string;
  };
  compositionImages: {
    title: string;
    description: string;
    images: string[];
    features: Array<{ icon: string; title: string }>;
  };
  ctaSplit: {
    title: string;
    description: string;
    buttonText: string;
    image: string;
    cards: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  featuresGrid: {
    title: string;
    features: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  darkSection: {
    title: string;
    description: string;
    ctaButton: string;
    images: string[];
    listItems: Array<{
      id: string;
      text: string;
    }>;
  };
}

// Service2 contains 2 sections
export interface Service2Content {
  faqSection: {
    title: string;
    description: string;
    image: string;
    faqItems: Array<{
      question: string;
      answer: string;
    }>;
  };
  bedroomSection: {
    title: string;
    description: string;
    images: string[];
  };
}

export interface ServiceContent {
  service1: Service1Content;
  service2: Service2Content;
}

// Apartments page (8 sections)
export interface ApartmentHeroContent {
  title: string[];
  description: string;
  image: string;
}

export interface RoomsSectionContent {
  title: string;
  description: string;
}

export interface ApartmentFeatureSectionContent {
  title: string;
  description: string;
  darkCard: {
    title: string;
    subtitle: string;
    icon: string;
  };
  lightCard: {
    title: string;
    description: string;
    image: string;
  };
  largeImage: string;
  footerTexts: string[];
}

export interface ShowcaseSectionContent {
  title: string;
  description: string;
  image: string;
  checkItems: string[];
}

export interface PerfectShowContent {
  title: string;
  description: string;
  images: string[];
  buttonText: string;
}

export interface ApartmentVideoSectionContent {
  coverImage: string;
  videoUrl: string;
  galleryImages: string[];
}

export interface FinalSectionContent {
  title: string;
  subtitle: string;
  description: string;
  images: string[];
}

export interface ApartmentRoom {
  id: string;
  image: string;
  title: string;
  description: string;
  guests: string;
  bedrooms: string;
  price: number;
  priceUnit: string;
  isPublished: boolean;
  slug: string;
  gallery: string[];
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  amenities: Array<{ icon: string; label: string }>;
}

export interface ApartmentContent {
  hero: ApartmentHeroContent;
  roomsSection: RoomsSectionContent;
  featureSection: ApartmentFeatureSectionContent;
  showcaseSection: ShowcaseSectionContent;
  perfectShow: PerfectShowContent;
  marquee: MarqueeContent;
  videoSection: ApartmentVideoSectionContent;
  finalSection: FinalSectionContent;
  rooms: ApartmentRoom[];
}

// Apartment Detail Page
export interface ApartmentDetailContent {
  defaultTitle: string;
  defaultPrice: number;
  defaultPriceUnit: string;
  defaultDescription: string;
  bookingLabels: {
    checkIn: string;
    checkOut: string;
    guests: string;
    bookButton: string;
  };
  gallerySection: {
    title: string;
    images?: string[];
  };
  lastSection: {
    title: string;
    description: string;
    features: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
    image: string;
  };
  tags?: string[];
  // options supplémentaires configurables pour la réservation
  options?: Array<{
    id: string;
    title: string;
    description?: string;
    price: number;
    category?: string;
  }>;
}

export interface PaymentContent {
  title: string;
  subtitle: string;
  cardTitle: string;
  cardNumberLabel: string;
  expiryLabel: string;
  cvvLabel: string;
  nameLabel: string;
  totalLabel: string;
  submitButton: string;
  securityText: string;
  paymentMethods: Array<{ name: string; icon: string }>;
}

export interface ConfirmationContent {
  title: string;
  subtitle: string;
  successMessage: string;
  reservationLabels: {
    bookingId: string;
    checkIn: string;
    checkOut: string;
    guests: string;
    totalPrice: string;
  };
  actions: {
    viewBooking: string;
    backHome: string;
    printReceipt: string;
  };
  additionalInfo: string;
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
  home: HomeContent;
  services: ServiceContent;
  apartments: ApartmentContent;
  apartmentDetail: ApartmentDetailContent;
  payment: PaymentContent;
  confirmation: ConfirmationContent;
  pricing: PricingContent;
  contact: ContactContent;
  footer: FooterContent;
}
