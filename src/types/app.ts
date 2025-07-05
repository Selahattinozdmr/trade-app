// Layout related types
export interface RootLayoutProps {
  children: React.ReactNode;
}

// Page related types
export interface PageProps {
  params?: Promise<Record<string, string>>;
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

// Category types
export interface Category {
  id: string;
  name: string;
}

// City types
export interface City {
  id: number;
  name: string;
}

// Item types
export interface Item {
  id: string;
  user_id: string;
  category_id?: string;
  city_id?: number;
  title: string;
  description?: string;
  image_url?: string;
  is_deal: boolean;
  created_at: string;
  // Joined data from categories and cities tables
  categories?: {
    name: string;
  };
  cities?: {
    name: string;
  };
}

// Item form data types
export interface CreateItemData {
  title: string;
  description?: string;
  category_id?: string;
  city_id?: number;
  image_url?: string;
  is_deal: boolean;
}

// Filter types
export interface ItemFilters {
  city?: number;
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
  created_at: string;
  full_name?: string;
  display_name?: string;
  phone?: string;
  avatar_url?: string;
  email_confirmed_at?: string;
  last_sign_in_at?: string;
  user_metadata?: {
    display_name?: string;
    full_name?: string;
    avatar_url?: string;
    phone?: string;
  };
}

// Profile form types
export interface ProfileFormData {
  display_name: string;
  phone: string;
  avatar_url?: string;
}

// Message types
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at?: string;
}

export interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  updated_at: string;
  // Joined user data
  user1?: User;
  user2?: User;
  // Latest message
  latest_message?: Message;
  // Unread count for current user
  unread_count?: number;
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[];
}

// Message form types
export interface SendMessageData {
  content: string;
  conversation_id: string;
}
