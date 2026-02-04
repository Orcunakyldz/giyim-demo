-- ==========================================
-- Giyim Sports - Tam Veritabanı Şeması
-- ==========================================

-- 1. Uzantılar
create extension if not exists "uuid-ossp";

-- 2. Tablolar
create table if not exists public.products (
  id bigint primary key generated always as identity,
  name text not null,
  price numeric not null,
  category text not null,
  gender text default 'female',
  image text,
  images text[] default '{}',
  discount numeric default 0,
  stock integer default 50,
  size_stock jsonb default '{"S": 10, "M": 10, "L": 10, "XL": 10}'::jsonb,
  is_best_seller boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.categories (
  id bigint primary key generated always as identity,
  name text not null unique,
  gender text default 'unisex',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.orders (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id),
  items jsonb not null,
  total numeric not null,
  status text default 'pending',
  customer_details jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.profiles (
  id uuid references auth.users(id) primary key,
  email text,
  role text default 'customer',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.banners (
  id bigint primary key generated always as identity,
  title text not null,
  subtitle text,
  image text,
  cta text default 'Keşfet',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.announcements (
  id bigint primary key generated always as identity,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.site_settings (
  id text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Eksik Sütun Kontrolü (Mevcut tablolar varsa)
do $$ 
begin
    if not exists (select 1 from information_schema.columns where table_name='products' and column_name='stock') then
        alter table public.products add column stock integer default 50;
    end if;
    if not exists (select 1 from information_schema.columns where table_name='products' and column_name='gender') then
        alter table public.products add column gender text default 'female';
    end if;
    if not exists (select 1 from information_schema.columns where table_name='products' and column_name='images') then
        alter table public.products add column images text[] default '{}';
    end if;
end $$;

-- 3. Cart Table (Shopping Carts)
CREATE TABLE IF NOT EXISTS public.cart (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    items JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME_ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Profiles check (Ensure it exists)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    role TEXT DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME_ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Trigger for Automatic Profile & Cart Creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'customer');
  
  INSERT INTO public.cart (user_id)
  VALUES (new.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. RLS (Güvenlik) Ayarları
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.orders enable row level security;
alter table public.profiles enable row level security;
alter table public.banners enable row level security;
alter table public.announcements enable row level security;
alter table public.site_settings enable row level security;
-- Enable RLS for Cart
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;

-- 5. Politikalar (Conflict önlemek için önce siliyoruz)

-- Products
drop policy if exists "Herkes ürünleri görebilir" on public.products;
drop policy if exists "Herkes ürün ekleyebilir" on public.products;
drop policy if exists "Herkes ürün güncelleyebilir" on public.products;
drop policy if exists "Herkes ürün silebilir" on public.products;
create policy "Herkes ürünleri görebilir" on public.products for select using (true);
create policy "Herkes ürün ekleyebilir" on public.products for insert with check (true);
create policy "Herkes ürün güncelleyebilir" on public.products for update using (true);
create policy "Herkes ürün silebilir" on public.products for delete using (true);

-- Categories
drop policy if exists "Herkes kategorileri görebilir" on public.categories;
drop policy if exists "Herkes kategori ekleyebilir" on public.categories;
drop policy if exists "Herkes kategori silebilir" on public.categories;
create policy "Herkes kategorileri görebilir" on public.categories for select using (true);
create policy "Herkes kategori ekleyebilir" on public.categories for insert with check (true);
create policy "Herkes kategori silebilir" on public.categories for delete using (true);

-- Orders
drop policy if exists "Siparis goruntuleme" on public.orders;
drop policy if exists "Siparis ekleme" on public.orders;
create policy "Siparis goruntuleme" on public.orders for select using (true);
create policy "Siparis ekleme" on public.orders for insert with check (true);

-- Site Settings
drop policy if exists "Herkes ayarları görebilir" on public.site_settings;
drop policy if exists "Herkes ayar güncelleyebilir" on public.site_settings;
drop policy if exists "Herkes ayar güncelleyebilir_update" on public.site_settings;
create policy "Herkes ayarları görebilir" on public.site_settings for select using (true);
create policy "Herkes ayar güncelleyebilir" on public.site_settings for insert with check (true);
create policy "Herkes ayar güncelleyebilir_update" on public.site_settings for update using (true);
-- Cart Policies
drop policy if exists "Users can view own cart" on public.cart;
drop policy if exists "Users can update own cart" on public.cart;
drop policy if exists "Users can insert own cart" on public.cart;
drop policy if exists "Users can delete own cart" on public.cart;

create policy "Users can view own cart" on public.cart for select using (auth.uid() = user_id);
create policy "Users can update own cart" on public.cart for update using (auth.uid() = user_id);
create policy "Users can insert own cart" on public.cart for insert with check (auth.uid() = user_id);
create policy "Users can delete own cart" on public.cart for delete using (auth.uid() = user_id);

-- Profile Policies
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
