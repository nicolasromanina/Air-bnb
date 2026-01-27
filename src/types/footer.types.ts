export interface IGalleryImage {
  _id?: string;
  image: string;
  cloudinaryPublicId?: string;
  alt: string;
  order: number;
}

export interface ILink {
  text: string;
  url: string;
}

export interface ILinkGroup {
  title: string;
  links: ILink[];
}

export interface IVisualBanner {
  title: string;
  backgroundColor: string;
}

export interface ICopyright {
  text: string;
  designText: string;
}

export interface ILogo {
  url: string;
  cloudinaryPublicId?: string;
  alt: string;
}

export interface IMeta {
  updatedAt: Date;
  updatedBy: string;
  version: number;
}

export interface IFooterData {
  galleryImages: IGalleryImage[];
  usefulLinks: ILinkGroup;
  legalPages: ILinkGroup;
  visualBanner: IVisualBanner;
  copyright: ICopyright;
  logo: ILogo;
  meta: IMeta;
}