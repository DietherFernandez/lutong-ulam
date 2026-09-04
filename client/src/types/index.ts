// Shared TypeScript interfaces for the restaurant website.
// Matches the Supabase/PostgreSQL schema in database/migrations/01_schema.sql.

export interface User {
  id: string;       // Supabase auth.users uses UUID strings, not integers.
  username: string;
  email: string;
  role: string;
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  sort_order?: number;
  dish_count?: number;
  created_at?: string;
}

export interface Dish {
  id: number;
  name: string;
  description?: string;
  price: number;
  category_id?: number | null;
  category_name?: string | null;
  image?: string | null;
  is_available: boolean;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Image {
  id: number;
  filename: string;
  original_name?: string;
  file_path: string;
  public_url?: string;
  file_size?: number;
  mime_type?: string;
  alt_text?: string;
  created_at?: string;
}

export interface RestaurantSettings {
  restaurant_name?: string;
  tagline?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  google_maps_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  logo_url?: string;
  message_retention_days?: string;
  // Website text fields
  featured_section_title?: string;
  featured_section_subtitle?: string;
  menu_page_title?: string;
  menu_page_subtitle?: string;
  contact_page_title?: string;
  contact_page_subtitle?: string;
  contact_form_title?: string;
  about_story_title?: string;
  about_chef_title?: string;
  about_values_title?: string;
}

export interface OpeningHours {
  id: number;
  day: string;
  opening_time: string;
  closing_time: string;
  is_closed: boolean;
}

export interface HomepageSection {
  id: number;
  section_key: string;
  title: string;
  subtitle: string;
  image: string;
  is_enabled: boolean;
}

export interface DashboardStats {
  dishes: { total: number; available: number; featured: number };
  categories: { total: number };
  images: { total: number; totalSize: number };
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
