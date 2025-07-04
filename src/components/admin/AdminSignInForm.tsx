"use client";

import React, { useState } from "react";
import { useSupabase } from "@/components/providers/SupabaseSessionProvider";
import { Button } from "@/components/ui/Button";

export const AdminSignInForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { supabase } = useSupabase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Sign in with email and password
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        setError(`Giriş başarısız: ${signInError.message}`);
        return;
      }

      if (data.user) {
        console.log("User signed in:", data.user.id);

        // Check if user is admin
        const { data: userRole, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        console.log("Role check result:", { userRole, roleError });

        if (roleError) {
          await supabase.auth.signOut();
          setError(`Rol kontrolü başarısız: ${roleError.message}`);
          return;
        }

        if (
          !userRole ||
          (userRole.role !== "admin" && userRole.role !== "super_admin")
        ) {
          await supabase.auth.signOut();
          setError(
            `Bu hesap admin yetkisine sahip değil. Mevcut rol: ${
              userRole?.role || "bulunamadı"
            }`
          );
          return;
        }

        console.log("Admin access granted, redirecting...");

        // Wait for session to fully establish before redirecting
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Force page reload to ensure server picks up the session
        window.location.href = "/admin/dashboard";
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setError(
        `Bir hata oluştu: ${
          error instanceof Error ? error.message : "Bilinmeyen hata"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-orange-800 mb-2"
        >
          E-posta
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-orange-50/50 text-orange-900 placeholder-orange-400"
          placeholder="admin@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-orange-800 mb-2"
        >
          Şifre
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-orange-50/50 text-orange-900 placeholder-orange-400"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
      </Button>
    </form>
  );
};
