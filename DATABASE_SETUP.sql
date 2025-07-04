-- Categories Table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamp with time zone default now()
);

-- Cities Table
create table if not exists public.cities (
  id serial primary key,
  name text unique not null
);

-- Items Table (Updated structure)
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

-- Insert sample categories
INSERT INTO public.categories (name) VALUES 
  ('Elektronik'),
  ('Ev & Yaşam'),
  ('Giyim & Aksesuar'),
  ('Kitap & Hobi'),
  ('Spor & Outdoor'),
  ('Araç & Taşıt'),
  ('Emlak'),
  ('İş & Sanayi'),
  ('Hayvanlar'),
  ('Diğer')
ON CONFLICT (name) DO NOTHING;

-- Insert sample cities (Major Turkish cities)
INSERT INTO public.cities (name) VALUES 
  ('İstanbul'),
  ('Ankara'),
  ('İzmir'),
  ('Bursa'),
  ('Antalya'),
  ('Adana'),
  ('Konya'),
  ('Şanlıurfa'),
  ('Gaziantep'),
  ('Kocaeli'),
  ('Mersin'),
  ('Diyarbakır'),
  ('Hatay'),
  ('Manisa'),
  ('Kayseri'),
  ('Samsun'),
  ('Balıkesir'),
  ('Kahramanmaraş'),
  ('Van'),
  ('Aydın'),
  ('Denizli'),
  ('Muğla'),
  ('Tekirdağ'),
  ('Trabzon'),
  ('Elazığ')
ON CONFLICT (name) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- Create policies for items
CREATE POLICY "Users can insert their own items" ON public.items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all items" ON public.items
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own items" ON public.items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own items" ON public.items
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for categories (read-only for all users)
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

-- Create policies for cities (read-only for all users)
CREATE POLICY "Anyone can view cities" ON public.cities
  FOR SELECT USING (true);
