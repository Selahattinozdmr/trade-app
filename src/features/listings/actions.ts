import { createClient } from "@/lib/supabase/server";
import type { Item, ItemFilters } from "@/types/app";

export async function getItems(filters?: ItemFilters): Promise<Item[]> {
  const supabase = await createClient();

  let query = supabase
    .from("items")
    .select("*")
    .eq("status", "active")
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
