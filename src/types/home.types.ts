// src/types/home.types.ts

export interface IHeroSection {
  mainTitle: {
    line1: string;
    line2: string;
    line3: string;
  };
  description: string;
  buttonText: string;
  testimonial: {
    image: string;
    title: string;
    subtitle: string;
  };
  images: {
    main: string;
    secondary: string;
    bedroom: string;
  };
  accentColor: string;
}

export interface IWelcomeSection {
  videoImage: string;
  videoUrl: string;
  image1: string;
  image2: string;
  title: string;
  description: string;
  features: {
    feature1: string;
    feature2: string;
  };
  buttonText: string;
}

export interface IMarqueeSection {
  text: string;
  color: string;
  backgroundColor: string;
}

export interface IDestinationSearch {
  title: string;
  description: string;
  images: {
    small: string;
    main: string;
  };
  formLabels: {
    destination: string;
    date: string;
    travelers: string;
    button: string;
  };
}

export interface IFeatureRoom {
  title: string;
  subtitle: string;
  description: string;
  features: Array<{
    icon: string;
    title: string;
    description: string;
    backgroundColor: string;
  }>;
  images: {
    bedroom: string;
    living: string;
  };
}

export interface IVideoSection {
  title: string;
  description: string;
  mainImage: string;
  videoUrl: string;
  galleryImages: string[];
  buttonText: string;
  accentColor: string;
}

export interface IService {
  image: string;
  title: string;
  description: string;
}

export interface IServicesSection {
  title: string;
  services: IService[];
  buttonText: string;
}

export interface IFeature {
  icon: string;
  title: string;
}

export interface IFeaturesSection {
  title: string;
  features: IFeature[];
  mainImage: string;
  thumbnails: string[];
  description: string;
  subtitle: string;
  backgroundColor: string;
}

export interface IPropertyCard {
  image: string;
  title: string;
  price: number;
  priceUnit: string;
  features: Array<{
    icon: string;
    label: string;
  }>;
  description: string;
  buttonText: string;
}

export interface IStat {
  value: string;
  label: string;
}

export interface IStatsSection {
  propertyCard: IPropertyCard;
  stats: IStat[];
}

export interface ILogo {
  name: string;
  image: string;
}

export interface ILogoSection {
  title: string;
  description: string;
  logos: ILogo[];
  backgroundColor: string;
}

export interface ICard {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  backgroundColor: string;
  textColor: string;
  icon?: string;
}

export interface IThreeCardsSection {
  cards: ICard[];
}

export interface IMetaData {
  updatedAt: Date;
  updatedBy: string;
  version: number;
}

export interface IHomePage {
  heroSection: IHeroSection;
  welcomeSection: IWelcomeSection;
  marqueeSection: IMarqueeSection;
  destinationSearch: IDestinationSearch;
  featureRoom: IFeatureRoom;
  marqueeBlackSection: IMarqueeSection;
  videoSection: IVideoSection;
  servicesSection: IServicesSection;
  featuresSection: IFeaturesSection;
  statsSection: IStatsSection;
  logoSection: ILogoSection;
  threeCardsSection: IThreeCardsSection;
  meta: IMetaData;
}

// Type pour la réponse de l'API
export type HomePageData = IHomePage;

// Type pour les mises à jour partielles
export type PartialHomePageData = Partial<IHomePage>;