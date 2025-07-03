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
    const { error: authError } = await supabase.auth.updateUser({
      data: { avatar_url: avatarUrl },
    });

    if (authError) {
      return {
        success: false,
        error: `Auth güncelleme hatası: ${authError.message}`,
      };
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", userId);

    if (profileError) {
      console.warn("Profil güncellenemedi:", profileError);
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
