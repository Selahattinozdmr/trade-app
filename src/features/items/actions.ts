import { createClient } from "@/lib/supabase/server";
import type { Item, ItemFilters } from "@/types/app";

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export async function getItems(filters?: ItemFilters): Promise<Item[]> {
  const supabase = await createClient();

  let query = supabase
    .from("items")
    .select(
      `
      *,
      categories(name),
      cities(name)
    `
    )
    .order("created_at", { ascending: false });

  if (filters?.city) {
    query = query.eq("city_id", filters.city);
  }

  if (filters?.category) {
    query = query.eq("category_id", filters.category);
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
    .select(
      `
      *,
      categories(name),
      cities(name)
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getUserItemsPaginated(
  userId: string,
  params: PaginationParams = {}
): Promise<PaginatedResponse<Item>> {
  const supabase = await createClient();
  const page = params.page || 1;
  const limit = params.limit || 12;
  const offset = (page - 1) * limit;

  // Get total count
  const { count, error: countError } = await supabase
    .from("items")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (countError) {
    throw new Error(countError.message);
  }

  // Get paginated items
  const { data, error } = await supabase
    .from("items")
    .select(
      `
      *,
      categories(name),
      cities(name)
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(error.message);
  }

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    data: data || [],
    count: totalCount,
    totalPages,
    currentPage: page,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

export async function deleteItem(itemId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("items").delete().eq("id", itemId);

  if (error) {
    throw new Error(error.message);
  }
}
