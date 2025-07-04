import { supabase } from "@/lib/supabase/client";

export interface UploadImageResult {
  url: string;
  path: string;
}

export async function uploadItemImage(file: File): Promise<UploadImageResult> {
  try {
    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error("User must be authenticated to upload images");
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are allowed");
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error("Image size must be less than 5MB");
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from("itemsimages")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("itemsimages").getPublicUrl(fileName);

    return {
      url: publicUrl,
      path: fileName,
    };
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown upload error");
  }
}

export async function deleteItemImage(path: string): Promise<void> {
  try {
    const { error } = await supabase.storage.from("itemsimages").remove([path]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown delete error");
  }
}
