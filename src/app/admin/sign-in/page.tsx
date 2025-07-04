import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminSignInForm } from "@/components/admin";

export default async function AdminSignInPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if user is already signed in and is admin
  if (user) {
    // Check if user is admin
    const { data: userRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userRole?.role === "admin" || userRole?.role === "super_admin") {
      redirect("/admin/dashboard");
    } else {
      redirect("/");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-orange-600 mb-2">
              Takas Go
            </h1>
            <div className="w-12 h-1 bg-orange-500 mx-auto rounded-full"></div>
          </div>
          <h2 className="text-2xl font-semibold text-orange-800 mb-2">
            Admin Panel
          </h2>
          <p className="text-orange-600">Yönetici hesabınızla giriş yapın</p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-orange-200/50 p-8">
          <AdminSignInForm />
        </div>

        <div className="text-center mt-6">
          <p className="text-orange-600 text-sm">Güvenli admin girişi</p>
        </div>
      </div>
    </div>
  );
}
