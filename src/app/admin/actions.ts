"use server";

import { revalidatePath } from "next/cache";
import type { AdminStats, AdminUser, AdminItem } from "@/types/admin";
import type { User } from "@supabase/supabase-js";

// Types for admin operations
interface UserRole {
  id: string;
  role: string;
}

// Dynamic import to handle missing environment variables
async function getSupabaseAdmin() {
  try {
    const { supabaseAdmin } = await import("@/lib/supabase/admin");
    return supabaseAdmin;
  } catch (error) {
    console.error("Admin client not available:", error);
    return null;
  }
}

export async function deleteUser(userId: string) {
  try {
    const supabaseAdmin = await getSupabaseAdmin();
    if (!supabaseAdmin) {
      return { success: false, error: "Admin access not configured" };
    }

    // First, delete user role entry
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("id", userId);

    if (roleError) {
      console.error("Error deleting user role:", roleError);
      // Continue anyway - the user might not have a role entry
    }

    // Delete user from auth (requires admin privileges)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
      userId
    );

    if (authError) {
      console.error("Error deleting user from auth:", authError);
      throw new Error("Kullanıcı silinirken hata oluştu: " + authError.message);
    }

    // Revalidate the dashboard page to refresh data
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error in deleteUser action:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu",
    };
  }
}

export async function deleteItem(itemId: string) {
  try {
    const supabaseAdmin = await getSupabaseAdmin();
    if (!supabaseAdmin) {
      return { success: false, error: "Admin access not configured" };
    }

    // For now, we'll just mock this since the actual items table structure is unclear
    // When you have the actual items table, uncomment and update this:
    /*
    const { error } = await supabaseAdmin
      .from("items")
      .delete()
      .eq("id", itemId);

    if (error) {
      throw new Error("Ürün silinirken hata oluştu: " + error.message);
    }
    */

    console.log("Mock delete item with ID:", itemId);

    // Revalidate the dashboard page to refresh data
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error in deleteItem action:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu",
    };
  }
}

export async function getDashboardData() {
  try {
    const supabaseAdmin = await getSupabaseAdmin();
    if (!supabaseAdmin) {
      // Return fallback data when admin client is not available
      return {
        users: [],
        items: [],
        stats: {
          totalUsers: 0,
          totalItems: 0,
          superAdminUsers: 0,
          activeItems: 0,
        },
      };
    }

    // Fetch auth users and their roles
    const { data: allUsers, error: usersError } =
      await supabaseAdmin.auth.admin.listUsers();
    const { data: userRoles, error: rolesError } = await supabaseAdmin
      .from("user_roles")
      .select("*");

    if (usersError) {
      console.error("Error fetching users:", usersError);
      throw new Error(`Failed to fetch users: ${usersError.message}`);
    }
    if (rolesError) {
      console.error("Error fetching roles:", rolesError);
      throw new Error(`Failed to fetch roles: ${rolesError.message}`);
    }

    const users = allUsers?.users || [];
    const roles = userRoles || [];

    // Merge users with their roles
    const usersWithRoles: AdminUser[] = users.map((authUser: User) => {
      const userRole = roles.find((role: UserRole) => role.id === authUser.id);
      return {
        id: authUser.id,
        email: authUser.email || "",
        role: userRole?.role || "user",
        created_at: authUser.created_at,
        last_sign_in_at: authUser.last_sign_in_at || null,
        email_confirmed_at: authUser.email_confirmed_at || null,
      };
    });

    // Mock items for now (you can replace this when you have an items table)
    const items: AdminItem[] = [];

    // Calculate statistics
    const totalUsers = users.length;
    const totalItems = items.length;
    const adminUsers = roles.filter((r: UserRole) => r.role === "admin").length;
    const superAdminUsers = roles.filter(
      (r: UserRole) => r.role === "super_admin"
    ).length;
    const activeItems = 0; // Since items is empty

    const stats: AdminStats = {
      totalUsers,
      totalItems,
      adminUsers,
      superAdminUsers,
      activeItems,
    };

    return {
      success: true,
      data: {
        users: usersWithRoles,
        items,
        stats,
      },
    };
  } catch (error) {
    console.error("Error in getDashboardData action:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch dashboard data",
    };
  }
}

export async function adminSignIn(email: string, password: string) {
  try {
    const supabaseAdmin = await getSupabaseAdmin();
    if (!supabaseAdmin) {
      return { success: false, error: "Admin access not configured" };
    }

    // Use admin client to sign in
    const { data, error: signInError } =
      await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError) {
      return {
        success: false,
        error: `Giriş başarısız: ${signInError.message}`,
      };
    }

    if (data.user) {
      // Check if user is admin
      const { data: userRole, error: roleError } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (roleError) {
        return {
          success: false,
          error: `Rol kontrolü başarısız: ${roleError.message}`,
        };
      }

      if (
        !userRole ||
        (userRole.role !== "admin" && userRole.role !== "super_admin")
      ) {
        return {
          success: false,
          error: `Bu hesap admin yetkisine sahip değil. Mevcut rol: ${
            userRole?.role || "bulunamadı"
          }`,
        };
      }

      return {
        success: true,
        user: data.user,
        role: userRole.role,
        session: data.session,
      };
    }

    return {
      success: false,
      error: "Kullanıcı bulunamadı",
    };
  } catch (error) {
    console.error("Error in adminSignIn action:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu",
    };
  }
}
