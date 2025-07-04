import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin";
import { getDashboardData } from "@/app/admin/actions";

// Force dynamic rendering to avoid build-time issues with admin client
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/admin/sign-in");
  }

  // Check if user is admin
  console.log("Dashboard: Checking role for user:", user.id);

  const { data: userRole, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("id", user.id)
    .single();

  console.log("Dashboard: Role check result:", { userRole, roleError });

  if (
    !userRole?.role ||
    (userRole.role !== "admin" && userRole.role !== "super_admin")
  ) {
    console.log("Dashboard: Access denied, redirecting");
    redirect("/admin/sign-in");
  }

  console.log("Dashboard: Access granted, loading data...");

  try {
    const result = await getDashboardData();

    if (!result.success || !result.data) {
      console.error("Dashboard: Failed to load data", result.error);
      throw new Error(result.error || "Failed to load dashboard data");
    }

    const { users, items, stats } = result.data;

    console.log("Dashboard: Data loaded successfully", {
      stats,
      usersCount: users.length,
    });

    return (
      <div className="min-h-screen bg-gray-50">
        <AdminDashboard
          users={users}
          items={items}
          stats={stats}
          currentUser={user}
        />
      </div>
    );
  } catch (error) {
    console.error("Dashboard: Failed to load data", error);
    throw error;
  }
}
