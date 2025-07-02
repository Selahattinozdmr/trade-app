// Common UI Types
export interface IconProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

// Navigation Types
export interface NavigationItem {
  href: string;
  label: string;
  isExternal?: boolean;
}

export interface MobileMenuState {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

// Category Types
export interface Category {
  id: string;
  icon: React.ReactNode;
  label: string;
  description?: string;
  slug: string;
}

// Step Types (How It Works)
export interface Step {
  id: string;
  icon: React.ReactNode;
  label: string;
  description?: string;
  background: string;
}

// Statistics Types
export interface Statistic {
  id: string;
  value: string;
  label: string;
  description?: string;
}

// Social Media Types
export interface SocialLink {
  id: string;
  name: string;
  href: string;
  icon: React.ReactNode;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface SectionProps extends BaseComponentProps {
  id?: string;
}

// Landing Page Data Types
export interface LandingPageData {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
  };
  about: {
    title: string;
    description: string[];
    features: Array<{
      id: string;
      label: string;
      icon: React.ReactNode;
    }>;
    statistics: Statistic[];
  };
  categories: Category[];
  steps: Step[];
}
