// services/apartmentDetailApi.ts
import { api } from './api';

const BACKEND_URL = 'http://localhost:3000/api/apartment-details';

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface FeatureItem {
  id: string;
  text: string;
}

export interface HeroSection {
  title: string;
  subtitle: string;
  description: string;
  price: number;
  guests: string;
  bedrooms: string;
  mainImage: string;
  galleryImages: string[];
}

export interface DetailsSection {
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  features: FeatureItem[];
}

export interface GallerySection {
  title: string;
  subtitle: string;
  images: GalleryImage[];
  buttonText: string;
}

export interface LastSection {
  title: string;
  description: string;
  features: FeatureItem[];
  image: string;
  tagline: string;
}

export interface AdditionalOption {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  pricingType: string;
  icon?: string;
}

export interface ApartmentDetailData {
  apartmentId: number;
  hero: HeroSection;
  details: DetailsSection;
  gallery: GallerySection;
  lastSection: LastSection;
  additionalOptions?: string[];
  availableOptions?: AdditionalOption[];
  meta: {
    createdAt: string;
    updatedAt: string;
    updatedBy: string;
    version: number;
  };
}

const makeRequest = async <T>(
  url: string,
  method: string = 'GET',
  data?: any
): Promise<T> => {
  const token = api.getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
  
  const config: RequestInit = {
    method,
    headers,
    credentials: 'include',
    ...(data && { body: JSON.stringify(data) }),
  };
  
  try {
    const response = await fetch(`${BACKEND_URL}${url}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erreur HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erreur ${method} ${url}:`, error);
    throw error;
  }
};

export const apartmentDetailApi = {
  // Récupérer tous les détails
  async getAllDetails(): Promise<{ success: boolean; data: ApartmentDetailData[] }> {
    return await makeRequest<{ success: boolean; data: ApartmentDetailData[] }>('');
  },
  
  // Récupérer un détail par apartmentId
  async getDetailByApartmentId(apartmentId: number): Promise<{ success: boolean; data: ApartmentDetailData }> {
    return await makeRequest<{ success: boolean; data: ApartmentDetailData }>(`/${apartmentId}`);
  },
  
  // Mettre à jour un détail
  async updateDetail(apartmentId: number, data: Partial<ApartmentDetailData>): Promise<{ success: boolean; data: ApartmentDetailData }> {
    return await makeRequest<{ success: boolean; data: ApartmentDetailData }>(`/${apartmentId}`, 'PUT', data);
  },
  
  // Mettre à jour une section
  async updateSection(apartmentId: number, section: string, data: any): Promise<{ success: boolean; data: ApartmentDetailData }> {
    return await makeRequest<{ success: boolean; data: ApartmentDetailData }>(`/${apartmentId}/section/${section}`, 'PUT', data);
  },
  
  // Mettre à jour les options supplémentaires
  async updateAdditionalOptions(apartmentId: number, optionIds: string[]): Promise<{ success: boolean; data: ApartmentDetailData }> {
    return await makeRequest<{ success: boolean; data: ApartmentDetailData }>(`/${apartmentId}/options`, 'PUT', { optionIds });
  },
  
  // Synchroniser avec la page principale
  async syncWithMainPage(apartmentId: number, roomData: any): Promise<{ success: boolean; data: ApartmentDetailData }> {
    return await makeRequest<{ success: boolean; data: ApartmentDetailData }>(`/${apartmentId}/sync`, 'POST', { roomData });
  },
  
  // Supprimer un détail
  async deleteDetail(apartmentId: number): Promise<{ success: boolean; message: string }> {
    return await makeRequest<{ success: boolean; message: string }>(`/${apartmentId}`, 'DELETE');
  },
  
  // Gestion du cache local
  async saveLocalChanges(apartmentId: number, data: ApartmentDetailData): Promise<void> {
    localStorage.setItem(`apartmentDetail_${apartmentId}_draft`, JSON.stringify(data));
  },
  
  async loadLocalChanges(apartmentId: number): Promise<ApartmentDetailData | null> {
    const draft = localStorage.getItem(`apartmentDetail_${apartmentId}_draft`);
    return draft ? JSON.parse(draft) : null;
  },
  
  async clearLocalChanges(apartmentId: number): Promise<void> {
    localStorage.removeItem(`apartmentDetail_${apartmentId}_draft`);
  }
};