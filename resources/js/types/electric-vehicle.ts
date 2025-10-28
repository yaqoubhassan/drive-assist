// resources/js/types/electric-vehicle.ts

export interface ElectricVehicle {
  id: number;
  title: string;
  slug: string;
  category: 'buying_guide' | 'charging' | 'battery_maintenance' | 'cost_comparison' | 'tax_incentives' | 'model_reviews' | 'technology' | 'environmental' | 'infrastructure' | 'general';
  description: string;
  content: string;
  key_takeaways: string[] | null;
  pros: string[] | null;
  cons: string[] | null;
  estimated_cost_min: number | null;
  estimated_cost_max: number | null;
  cost_range: string;
  featured_image: string | null;
  video_url: string | null;
  reading_time_minutes: number;
  view_count: number;
  helpful_count: number;
  not_helpful_count: number;
  is_featured: boolean;
  is_popular: boolean;
  is_published: boolean;
  order: number;
  icon: string | null;
  category_label: string;
  created_at: string;
  updated_at: string;
  related_articles?: ElectricVehicle[];
}

export interface ElectricVehicleIndexProps {
  articles: {
    data: ElectricVehicle[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
  categories: Record<string, string>;
  stats: {
    total_articles: number;
    categories_count: number;
    total_views: number;
  };
  featuredArticles: ElectricVehicle[];
  filters: {
    search: string | null;
    category: string | null;
    sort: string;
  };
}

export interface ElectricVehicleShowProps {
  article: ElectricVehicle & {
    related_articles: ElectricVehicle[];
  };
  userFeedback: {
    is_helpful: boolean;
  } | null;
}