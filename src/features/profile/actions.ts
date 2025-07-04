"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ProfileFormData } from "@/types/app";

export async function updateProfile(userId: string, data: ProfileFormData) {
  try {
    const supabase = await createClient();

    // Update user metadata
    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        display_name: data.display_name,
        phone: data.phone,
        avatar_url: data.avatar_url,
        full_name: data.display_name, // Keep both for compatibility
      },
    });

    if (metadataError) {
      throw new Error(
        `Kullanıcı bilgileri güncellenemedi: ${metadataError.message}`
      );
    }

    // Check if profiles table exists and update/insert profile data
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: userId,
      full_name: data.display_name,
      phone: data.phone,
      avatar_url: data.avatar_url,
      updated_at: new Date().toISOString(),
    });

    // If profiles table doesn't exist, we can ignore this error
    if (profileError) {
      const errorMessage = profileError.message || "";
      if (!errorMessage.includes('relation "profiles" does not exist')) {
        console.warn("Profile table update failed:", profileError);
      }
    }

    // Revalidate the profile page to show updated data
    revalidatePath(`/profile/${userId}`);
    revalidatePath("/home");

    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Profil güncellenirken hata oluştu",
    };
  }
}

export async function getProfile(userId: string) {
  try {
    const supabase = await createClient();

    // Get user from auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Kullanıcı bulunamadı");
    }

    // Try to get profile from profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    // Combine auth user data with profile data
    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        display_name:
          profile?.full_name ||
          user.user_metadata?.display_name ||
          user.user_metadata?.full_name,
        phone: profile?.phone || user.user_metadata?.phone,
        avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
        created_at: user.created_at,
      },
    };
  } catch (error) {
    console.error("Error getting profile:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Profil alınırken hata oluştu",
    };
  }
}
