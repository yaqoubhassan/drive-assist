// resources/js/types/maintenance.ts

export interface Step {
  step_number: number;
  title: string;
  description: string;
}

export interface Task {
  task: string;
  description: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface MaintenanceGuide {
  id: number;
  title: string;
  slug: string;
  category: 'fluid_check' | 'filter_replacement' | 'tire_maintenance' | 'brake_maintenance' | 'engine_maintenance' | 'electrical' | 'seasonal' | 'general';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_time_minutes: number;
  description: string;
  tools_required: string[]; // JSON array in DB
  materials_needed: string[]; // JSON array in DB
  steps: Step[]; // JSON array in DB
  safety_warnings: string | null;
  tips_and_tricks: string | null;
  estimated_cost_min: number | null;
  estimated_cost_max: number | null;
  featured_image: string | null;
  video_url: string | null;
  view_count: number;
  helpful_count: number;
  is_popular: boolean;
  // Appended attributes from backend
  category_label: string;
  difficulty_badge: {
    label: string;
    color: string;
    bg_class: string;
  };
  formatted_time: string;
  formatted_cost_range: string;
}

export interface MaintenanceSchedule {
  id: number;
  title: string;
  slug: string;
  interval: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semi_annually' | 'annually';
  mileage_interval: number | null;
  description: string;
  tasks: Task[]; // JSON array in DB
  priority: 'low' | 'medium' | 'high' | 'critical';
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'all';
  estimated_cost_min: number | null;
  estimated_cost_max: number | null;
  diy_possible: boolean;
  view_count: number;
  helpful_count: number;
  // Appended attributes from backend
  interval_label: string;
  badge_class: string;
  formatted_interval: string;
  formatted_cost_range: string;
  formatted_time: string;
}

export interface FluidGuide {
  id: number;
  name: string;
  slug: string;
  fluid_type: string | null;
  description: string;
  function: string;
  check_procedure: string;
  change_procedure: string | null;
  check_interval_miles: number | null;
  check_interval_months: number | null;
  change_interval_miles: number | null;
  change_interval_months: number | null;
  warning_signs: string;
  typical_capacity_min: number | null;
  typical_capacity_max: number | null;
  estimated_cost_min: number | null;
  estimated_cost_max: number | null;
  color_when_good: string | null;
  color_when_bad: string | null;
  icon: string | null;
  view_count: number;
  helpful_count: number;
  is_critical: boolean;
  // Appended attributes from backend
  check_interval_text: string;
  change_interval_text: string;
  formatted_cost_range: string;
  formatted_capacity: string;
}

export interface WarningLight {
  id: number;
  name: string;
  slug: string;
  icon_description: string;
  color: 'red' | 'yellow' | 'orange' | 'green' | 'blue' | 'white';
  severity: 'critical' | 'warning' | 'advisory' | 'information';
  what_it_means: string;
  what_to_do: string;
  can_continue_driving: boolean;
  typical_causes: string[];
  estimated_repair_cost_min: number | null;
  estimated_repair_cost_max: number | null;
  prevention_tips: string | null;
  icon_image: string | null;
  view_count: number;
  helpful_count: number;
  is_common: boolean;
  // Appended attributes from backend
  severity_badge: {
    label: string;
    color: string;
    bg_class: string;
    icon_class: string;
  };
  color_badge: {
    label: string;
    color: string;
    bg_class: string;
  };
  formatted_cost_range: string;
}

export interface ChecklistItem {
  item: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface SeasonInfo {
  emoji: string;
  color: string;
  bg_class: string;
}

export interface SeasonalChecklist {
  id: number;
  title: string;
  slug: string;
  season: 'spring' | 'summer' | 'fall' | 'winter';
  description: string;
  checklist_items: ChecklistItem[];
  why_important: string;
  additional_tips: string | null;
  estimated_cost_min: number | null;
  estimated_cost_max: number | null;
  estimated_time_hours: number;
  view_count: number;
  helpful_count: number;
  // Appended attributes from backend
  season_info: SeasonInfo;
  formatted_cost_range: string;
  formatted_time: string;
}

// Pagination interface
export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}

// Props interfaces for pages
export interface MaintenanceIndexProps {
  stats: {
    total_guides: number;
    total_schedules: number;
    total_fluids: number;
    total_warning_lights: number;
    total_seasonal_checklists: number;
  };
  popularGuides: MaintenanceGuide[];      // Added
  criticalFluids: FluidGuide[];           // Added
  commonWarningLights: WarningLight[];
}

export interface GuidesIndexProps {
  guides: PaginatedData<MaintenanceGuide>;
  categories: Record<string, string>;
  popularGuides: MaintenanceGuide[];
  searchQuery?: string;
  currentCategory?: string;
  currentSort?: string;
}

export interface GuideShowProps {
  guide: MaintenanceGuide;
  relatedGuides: MaintenanceGuide[];
}

export interface SchedulesIndexProps {
  schedules: PaginatedData<MaintenanceSchedule>;
  intervals: Record<string, string>;
  searchQuery?: string;
  currentInterval?: string;
  currentSort?: string;
}

export interface ScheduleShowProps {
  schedule: MaintenanceSchedule;
  relatedSchedules: MaintenanceSchedule[];
}

export interface FluidsIndexProps {
  fluids: PaginatedData<FluidGuide>;
  fluidTypes: Record<string, string>;
  searchQuery?: string;
  currentType?: string;
  currentSort?: string;
}

export interface FluidShowProps {
  fluid: FluidGuide;
  relatedFluids: FluidGuide[];
}

export interface WarningLightsIndexProps {
  warningLights: PaginatedData<WarningLight>;
  severities: Record<string, string>;
  colors: Record<string, string>;
  searchQuery?: string;
  currentSeverity?: string;
  currentColor?: string;
  currentSort?: string;
}

export interface WarningLightShowProps {
  warningLight: WarningLight;
  relatedLights: WarningLight[];
}

export interface SeasonalChecklistsIndexProps {
  checklists: PaginatedData<SeasonalChecklist>;
  seasons: Record<string, string>;
  searchQuery?: string;
  currentSeason?: string;
  currentSort?: string;
}

export interface SeasonalChecklistShowProps {
  checklist: SeasonalChecklist;
  relatedChecklists: SeasonalChecklist[];
}