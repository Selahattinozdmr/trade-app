import { supabase } from "@/lib/supabase/client";
import type { Item, CreateItemData, Category, City } from "@/types/app";

// Client-side function for creating an item
export async function createItem(itemData: CreateItemData): Promise<Item> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized: Please sign in to create an item");
  }

  const { data, error } = await supabase
    .from("items")
    .insert({
      user_id: user.id,
      title: itemData.title,
      description: itemData.description,
      short_description: itemData.short_description,
      category_id: itemData.category_id,
      city_id: itemData.city_id,
      image_url: itemData.image_url,
      is_deal: false,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Client-side function for getting categories
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

// Client-side function for getting cities
export async function getCities(): Promise<City[]> {
  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

// Client-side function for getting user items
export async function getUserItems(userId: string): Promise<Item[]> {
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

// Client-side function for updating item status
export async function updateItemStatus(
  itemId: string,
  status: string
): Promise<void> {
  const { error } = await supabase
    .from("items")
    .update({
      status,
    })
    .eq("id", itemId);

  if (error) {
    throw new Error(error.message);
  }
}

// Client-side function for updating an item
export async function updateItem(
  itemId: string,
  itemData: Partial<CreateItemData>
): Promise<Item> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized: Please sign in to update an item");
  }

  // Build update object with only defined values
  const updateData: Record<
    string,
    string | number | boolean | null | undefined
  > = {};

  if (itemData.title !== undefined) updateData.title = itemData.title;
  if (itemData.description !== undefined)
    updateData.description = itemData.description;
  if (itemData.short_description !== undefined)
    updateData.short_description = itemData.short_description;
  if (itemData.category_id !== undefined)
    updateData.category_id = itemData.category_id;
  if (itemData.city_id !== undefined) updateData.city_id = itemData.city_id;
  if (itemData.image_url !== undefined)
    updateData.image_url = itemData.image_url;
  if (itemData.is_deal !== undefined) updateData.is_deal = itemData.is_deal;

  console.log("Update data being sent to Supabase:", updateData);

  const { data, error } = await supabase
    .from("items")
    .update(updateData)
    .eq("id", itemId)
    .eq("user_id", user.id) // Ensure user can only update their own items
    .select(
      `
      *,
      categories(name),
      cities(name)
    `
    )
    .single();

  if (error) {
    console.error("Supabase update error:", error);
    throw new Error(error.message);
  }

  console.log("Updated item from database:", data);
  return data;
}

// Client-side function for deleting an item
export async function deleteItem(itemId: string): Promise<void> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized: Please sign in to delete an item");
  }

  const { error } = await supabase
    .from("items")
    .delete()
    .eq("id", itemId)
    .eq("user_id", user.id); // Ensure user can only delete their own items

  if (error) {
    throw new Error(error.message);
  }
}

// Client-side function for getting user items with pagination
export async function getUserItemsPaginated(
  userId: string,
  params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
  } = {}
): Promise<{
  data: Item[];
  count: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}> {
  const page = params.page || 1;
  const limit = params.limit || 12;
  const offset = (page - 1) * limit;

  // Build query for count
  let countQuery = supabase
    .from("items")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // Build query for data
  let dataQuery = supabase
    .from("items")
    .select(
      `
      *,
      categories(name),
      cities(name)
    `
    )
    .eq("user_id", userId);

  // Apply filters
  if (params.search) {
    const searchFilter = `title.ilike.%${params.search}%,description.ilike.%${params.search}%`;
    countQuery = countQuery.or(searchFilter);
    dataQuery = dataQuery.or(searchFilter);
  }

  if (params.status) {
    if (params.status === "active") {
      countQuery = countQuery.eq("is_deal", false);
      dataQuery = dataQuery.eq("is_deal", false);
    } else if (params.status === "completed") {
      countQuery = countQuery.eq("is_deal", true);
      dataQuery = dataQuery.eq("is_deal", true);
    }
  }

  if (params.category) {
    countQuery = countQuery.eq("category_id", params.category);
    dataQuery = dataQuery.eq("category_id", params.category);
  }

  // Get total count
  const { count, error: countError } = await countQuery;

  if (countError) {
    throw new Error(countError.message);
  }

  // Get paginated items
  const { data, error } = await dataQuery
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
