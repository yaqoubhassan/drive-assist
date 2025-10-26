export interface Expert {
  id: number;
  name: string;
  businessName: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  distance: string;
  specialties: string[];
  avatarUrl?: string;
  isOpen: boolean;
  responseTime: string;
  pricing: 'budget' | 'moderate' | 'premium';
}

export interface MapViewport {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}

export interface ExpertPin {
  expert: Expert;
  position: {
    x: number;
    y: number;
  };
}