export interface AdminStats {
  totalUsers: number;
  totalItems: number;
  adminUsers: number;
  superAdminUsers: number;
  activeItems: number;
}

export interface AdminUser {
  id: string;
  email: string | null;
  role: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
}

export interface UserRole {
  id: string;
  role: "user" | "admin" | "super_admin";
  created_at: string;
}

export interface AdminItem {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  status: string | null;
  created_at: string;
  user_id: string;
  user_email?: string | null;
}
