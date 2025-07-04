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
    // Update auth metadata with custom avatar in a separate field
    // This way we don't overwrite the original Google avatar_url
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        custom_avatar: avatarUrl ? true : false, // Flag to indicate user has set custom avatar
        custom_avatar_url: avatarUrl, // Store custom avatar in separate field
      },
    });

    if (authError) {
      return {
        success: false,
        error: `Auth güncelleme hatası: ${authError.message}`,
      };
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
