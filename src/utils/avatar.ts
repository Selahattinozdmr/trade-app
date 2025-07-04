import { SupabaseClient } from "@supabase/supabase-js";

export async function uploadAvatar(
  supabase: SupabaseClient,
  file: File,
  userId: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const ext = file.name.split(".").pop() ?? "png";
    const fileName = `${userId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      return {
        success: false,
        error: `Yükleme hatası: ${uploadError.message}`,
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(fileName);

    return {
      success: true,
      url: publicUrl,
    };
  } catch (err) {
    console.error("uploadAvatar error:", err);
    return {
      success: false,
      error: "Beklenmeyen bir hata oluştu",
    };
  }
}

export async function updateUserAvatar(
  supabase: SupabaseClient,
  userId: string,
  avatarUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Update both auth metadata and profiles table to ensure persistence
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        avatar_url: avatarUrl,
        custom_avatar: avatarUrl ? true : false, // Flag to indicate user has set custom avatar
      },
    });

    if (authError) {
      return {
        success: false,
        error: `Auth güncelleme hatası: ${authError.message}`,
      };
    }

    // Also update the profiles table for redundancy
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (profileError) {
      console.warn("Profil güncellenemedi:", profileError);
      // Don't fail the operation if profiles table update fails
    }

    return { success: true };
  } catch (err) {
    console.error("updateUserAvatar error:", err);
    return {
      success: false,
      error: "Profil güncelleme sırasında hata oluştu",
    };
  }
}
