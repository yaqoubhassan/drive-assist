// Type definitions for Expert Onboarding

export interface ExpertData {
  current_step: number;
  phone: string;
  business_name: string;
  business_type: string;
  bio: string | null;
  years_experience: number | null;
  employee_count: number | null;
  service_radius_km: number;
  business_address: string;
  location_latitude: number | null;
  location_longitude: number | null;
  specialties: string[];
  hourly_rate_min: number | null;
  hourly_rate_max: number | null;
  diagnostic_fee: number | null;
  accepts_emergency: boolean;
  monday_open: string | null;
  monday_close: string | null;
  tuesday_open: string | null;
  tuesday_close: string | null;
  wednesday_open: string | null;
  wednesday_close: string | null;
  thursday_open: string | null;
  thursday_close: string | null;
  friday_open: string | null;
  friday_close: string | null;
  saturday_open: string | null;
  saturday_close: string | null;
  sunday_open: string | null;
  sunday_close: string | null;
}

export interface OnboardingProps {
  expert: ExpertData;
  businessTypes: Record<string, string>;
  availableSpecialties: Record<string, string>;
}

export interface StepProps {
  data: ExpertData;
  setData: (key: keyof ExpertData, value: any) => void;
  errors: Partial<Record<keyof ExpertData, string>>;
}

export interface Step {
  number: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';