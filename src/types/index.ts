export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  sort_order: number;
  active: boolean;
  count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string;
  sort_order: number;
  caption?: string;
}

export interface ProjectFeature {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  sort_order: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  category_id: string;
  category_name?: string;
  cover_image: string;
  demo_url?: string;
  featured: boolean;
  status: 'published' | 'draft';
  sort_order: number;
  tags: string[];
  client_name?: string;
  year?: string;
  metrics?: { label: string; value: string }[];
  images?: ProjectImage[];
  features?: ProjectFeature[];
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  testimonial?: string;
  author?: string;
  role?: string;
  sector?: string;
  sort_order: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Partnership {
  id: string;
  name: string;
  logo_url: string;
  country: string;
  city?: string;
  description: string;
  partnership_type: string;
  website_url?: string;
  featured: boolean;
  sort_order: number;
  active: boolean;
  highlight?: string;
  created_at?: string;
  updated_at?: string;
}

export type LeadStatus = 'nuevo' | 'contactado' | 'propuesta_enviada' | 'cerrado' | 'descartado';

export interface Lead {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  message: string;
  project_id?: string;
  project_title?: string;
  service: string;
  budget_range: string;
  status: LeadStatus;
  notes?: string;
  source?: 'chat_ia' | 'formulario' | 'manual';
  requirements_summary?: string;
  chat_history?: { role: string; text: string; timestamp?: string }[];
  updated_at?: string;
  created_at: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}
