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

    // Delete the item from the database
    const { error } = await supabaseAdmin
      .from("items")
      .delete()
      .eq("id", itemId);

    if (error) {
      throw new Error("Ürün silinirken hata oluştu: " + error.message);
    }

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
    console.log("getDashboardData: Starting to fetch data...");
    const supabaseAdmin = await getSupabaseAdmin();
    if (!supabaseAdmin) {
      console.log("getDashboardData: Admin client not available");
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

    console.log("getDashboardData: Fetching users and roles...");
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
    console.log(
      "getDashboardData: Fetched",
      users.length,
      "users and",
      roles.length,
      "roles"
    );

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

    console.log("getDashboardData: Fetching items...");

    // Fetch items from the database with error handling for joined tables
    const { data: itemsData, error: itemsError } = await supabaseAdmin
      .from("items")
      .select(
        `
        id,
        title,
        description,
        category_id,
        city_id,
        image_url,
        created_at,
        user_id,
        is_deal
      `
      )
      .order("created_at", { ascending: false });

    if (itemsError) {
      console.error("Error fetching items:", itemsError);
      // Return early with empty items if there's an error
      const stats: AdminStats = {
        totalUsers: users.length,
        totalItems: 0,
        adminUsers: roles.filter((r: UserRole) => r.role === "admin").length,
        superAdminUsers: roles.filter((r: UserRole) => r.role === "super_admin")
          .length,
        activeItems: 0,
      };

      return {
        success: true,
        data: {
          users: usersWithRoles,
          items: [],
          stats,
        },
      };
    } else {
      console.log("Successfully fetched", itemsData?.length || 0, "items");
    }

    // Try to fetch categories and cities separately for better error handling
    const categoriesMap = new Map();
    const citiesMap = new Map();

    try {
      const { data: categoriesData, error: categoriesError } =
        await supabaseAdmin.from("categories").select("id, name");

      if (categoriesError) {
        console.warn(
          "Warning: Could not fetch categories:",
          categoriesError.message
        );
      } else if (categoriesData) {
        categoriesData.forEach((cat: { id: string; name: string }) =>
          categoriesMap.set(cat.id, cat.name)
        );
      }
    } catch {
      console.warn("Categories table not accessible");
    }

    try {
      const { data: citiesData, error: citiesError } = await supabaseAdmin
        .from("cities")
        .select("id, name");

      if (citiesError) {
        console.warn("Warning: Could not fetch cities:", citiesError.message);
      } else if (citiesData) {
        citiesData.forEach((city: { id: string; name: string }) =>
          citiesMap.set(city.id, city.name)
        );
      }
    } catch {
      console.warn("Cities table not accessible");
    }

    if (itemsError) {
      console.error("Error fetching items:", itemsError);
    } else {
      console.log("Successfully fetched", itemsData?.length || 0, "items");
    }

    // Create a map of user_id to email from the auth users we already fetched
    const userEmailMap = new Map();
    users.forEach((user: User) => {
      if (user.email) {
        userEmailMap.set(user.id, user.email);
      }
    });

    // Also try to fetch profiles as a fallback for additional email data
    const { data: profilesData, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select("id, email");

    if (profilesError) {
      console.warn(
        "Warning: Could not fetch profiles table (this is normal if profiles table doesn't exist):",
        profilesError.message
      );
    } else if (profilesData) {
      // Merge profile emails with auth user emails
      profilesData.forEach((profile: { id: string; email: string }) => {
        if (profile.email && !userEmailMap.has(profile.id)) {
          userEmailMap.set(profile.id, profile.email);
        }
      });
    }

    // Transform items data to match AdminItem interface
    const items: AdminItem[] = (itemsData || []).map(
      (item: {
        id: string;
        title: string;
        description: string;
        category_id: string;
        is_deal: boolean;
        city_id: string;
        user_id: string;
        created_at: string;
        image_url?: string;
      }) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: categoriesMap.get(item.category_id) || null,
        status: item.is_deal ? "completed" : "active",
        created_at: item.created_at,
        user_id: item.user_id,
        user_email: userEmailMap.get(item.user_id) || null,
        image_url: item.image_url || null,
      })
    );

    console.log("getDashboardData: Calculating stats...");
    // Calculate statistics
    const totalUsers = users.length;
    const totalItems = items.length;
    const adminUsers = roles.filter((r: UserRole) => r.role === "admin").length;
    const superAdminUsers = roles.filter(
      (r: UserRole) => r.role === "super_admin"
    ).length;
    const activeItems = items.filter((item) => item.status === "active").length;

    const stats: AdminStats = {
      totalUsers,
      totalItems,
      adminUsers,
      superAdminUsers,
      activeItems,
    };

    console.log("getDashboardData: Final stats:", stats);
    console.log("getDashboardData: Returning", items.length, "items");

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

export async function makeAdmin(userId: string) {
  try {
    const supabaseAdmin = await getSupabaseAdmin();
    if (!supabaseAdmin) {
      return { success: false, error: "Admin access not configured" };
    }

    // Check if user exists
    const { data: user, error: userError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (userError || !user.user) {
      return { success: false, error: "Kullanıcı bulunamadı" };
    }

    // Insert or update user role
    const { error: roleError } = await supabaseAdmin.from("user_roles").upsert(
      {
        id: userId,
        role: "admin",
      },
      {
        onConflict: "id",
      }
    );

    if (roleError) {
      console.error("Error updating user role:", roleError);
      return {
        success: false,
        error: "Kullanıcı rol güncellenirken hata oluştu: " + roleError.message,
      };
    }

    // Revalidate the dashboard page to refresh data
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error in makeAdmin action:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu",
    };
  }
}

export async function removeAdmin(userId: string) {
  try {
    const supabaseAdmin = await getSupabaseAdmin();
    if (!supabaseAdmin) {
      return { success: false, error: "Admin access not configured" };
    }

    // Check if user exists
    const { data: user, error: userError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (userError || !user.user) {
      return { success: false, error: "Kullanıcı bulunamadı" };
    }

    // Update user role to regular user
    const { error: roleError } = await supabaseAdmin.from("user_roles").upsert(
      {
        id: userId,
        role: "user",
      },
      {
        onConflict: "id",
      }
    );

    if (roleError) {
      console.error("Error updating user role:", roleError);
      return {
        success: false,
        error: "Kullanıcı rol güncellenirken hata oluştu: " + roleError.message,
      };
    }

    // Revalidate the dashboard page to refresh data
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error in removeAdmin action:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu",
    };
  }
}

// Test function to debug database access
export async function testDatabaseAccess() {
  try {
    const supabaseAdmin = await getSupabaseAdmin();
    if (!supabaseAdmin) {
      return { success: false, error: "Admin client not available" };
    }

    console.log("Testing database access...");

    // Test basic table access
    const { data: itemsTest, error: itemsTestError } = await supabaseAdmin
      .from("items")
      .select("id, title, user_id, is_deal")
      .limit(5);

    console.log("Items test:", {
      count: itemsTest?.length || 0,
      items: itemsTest,
      error: itemsTestError,
    });

    // Test categories access
    let categoriesTest = null;
    let categoriesError = null;
    try {
      const result = await supabaseAdmin
        .from("categories")
        .select("id, name")
        .limit(3);
      categoriesTest = result.data;
      categoriesError = result.error;
    } catch (error) {
      categoriesError = error;
    }

    console.log("Categories test:", { categoriesTest, categoriesError });

    // Test cities access
    let citiesTest = null;
    let citiesError = null;
    try {
      const result = await supabaseAdmin
        .from("cities")
        .select("id, name")
        .limit(3);
      citiesTest = result.data;
      citiesError = result.error;
    } catch (error) {
      citiesError = error;
    }

    console.log("Cities test:", { citiesTest, citiesError });

    return {
      success: true,
      data: {
        items: itemsTest,
        categories: categoriesTest,
        cities: citiesTest,
        errors: {
          itemsTestError,
          categoriesError,
          citiesError,
        },
      },
    };
  } catch (error) {
    console.error("Test database access error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
