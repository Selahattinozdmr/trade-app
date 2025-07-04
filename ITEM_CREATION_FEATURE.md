# Item Creation Feature

This document describes the new item creation functionality added to the trade application.

## Components

### CreateItemModal

- **Location**: `src/components/items/CreateItemModal.tsx`
- **Description**: A modal component for creating new trade items
- **Features**:
  - Form validation
  - Category and city selection
  - Image URL input
  - Deal/offer toggle
  - Loading states and error handling

## Database Schema

### Items Table

```sql
create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  city_id int references public.cities(id) on delete set null,
  title text not null,
  description text,
  image_url text,
  is_deal boolean not null default false,
  created_at timestamp with time zone default now()
);
```

### Categories Table

```sql
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamp with time zone default now()
);
```

### Cities Table

```sql
create table if not exists public.cities (
  id serial primary key,
  name text unique not null
);
```

## Actions

### Item Actions

- **Location**: `src/features/items/actions.ts`
- **Functions**:
  - `createItem(itemData: CreateItemData)`: Creates a new item
  - `getCategories()`: Fetches all categories
  - `getCities()`: Fetches all cities
  - `getItems(filters?)`: Fetches items with optional filters
  - `getUserItems(userId)`: Fetches items for a specific user

## Types

### New Types Added

- `Category`: Represents a category object
- `City`: Represents a city object
- `CreateItemData`: Form data structure for creating items

### Updated Types

- `Item`: Updated to use category_id and city_id instead of category and city strings
- `ItemFilters`: Updated to use IDs instead of names

## Security

### Row Level Security (RLS)

- Items: Users can only insert/update/delete their own items, but can view all items
- Categories: Read-only for all authenticated users
- Cities: Read-only for all authenticated users

## Usage

### In Profile Page

The CreateItemModal is integrated into the ProfileActions component and can be accessed from the user's profile page.

### Example Usage

```tsx
import { CreateItemModal } from "@/components/items";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CreateItemModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSuccess={() => {
        // Handle success (e.g., refresh data)
        window.location.reload();
      }}
    />
  );
}
```

## Setup Instructions

1. Run the SQL commands in `DATABASE_SETUP.sql` to create the necessary tables and insert sample data
2. Ensure Supabase RLS policies are enabled
3. Import and use the CreateItemModal component where needed

## Sample Data

The setup includes sample categories like:

- Elektronik
- Ev & Yaşam
- Giyim & Aksesuar
- Kitap & Hobi
- etc.

And major Turkish cities like:

- İstanbul
- Ankara
- İzmir
- etc.
