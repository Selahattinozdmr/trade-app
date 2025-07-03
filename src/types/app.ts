// Layout related types
export interface RootLayoutProps {
  children: React.ReactNode;
}

// Page related types
export interface PageProps {
  params?: Record<string, string>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

// Metadata types
export interface MetadataConfig {
  title: string;
  description: string;
  keywords?: string[];
  openGraph?: {
    title: string;
    description: string;
    images?: string[];
  };
}

// Item types
export interface Item {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  city?: string;
  category?: string;
  image_url?: string;
  is_deal: boolean;
  created_at: string;
}

// Filter types
export interface ItemFilters {
  city?: string;
  category?: string;
  search?: string;
}

// Profile menu types
export interface ProfileMenuOption {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  separator?: boolean;
}

// User types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  display_name: string;
  phone: string;
  avatar_url?: string;
  created_at: string;
}

// Profile form types
export interface ProfileFormData {
  display_name: string;
  phone: string;
  avatar_url?: string;
}
