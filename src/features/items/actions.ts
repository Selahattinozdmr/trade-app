import { createClient } from "@/lib/supabase/server";
import { supabase } from "@/lib/supabase/client";
import type { Item, ItemFilters } from "@/types/app";

export async function getItems(filters?: ItemFilters): Promise<Item[]> {
  const supabase = await createClient();

  let query = supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.city) {
    query = query.eq("city", filters.city);
  }

  if (filters?.category) {
    query = query.eq("category", filters.category);
  }

  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getUserItems(userId: string): Promise<Item[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

// Client-side function for getting user items
export async function getUserItemsClient(userId: string): Promise<Item[]> {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

// Client-side function for updating item status
export async function updateItemStatus(
  itemId: string,
  status: string
): Promise<void> {
  const { error } = await supabase
    .from("items")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", itemId);

  if (error) {
    throw new Error(error.message);
  }
}
