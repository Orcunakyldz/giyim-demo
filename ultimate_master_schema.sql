-- ============================================================
-- GIYIM SPORTS - ULTIMATE MASTER SCHEMA (V1.3)
-- Purpose: Consolidates all tables, columns, and policies.
-- ============================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLES INITIALIZATION
-- Products
CREATE TABLE IF NOT EXISTS public.products (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  price numeric NOT NULL,
  category text NOT NULL,
  collection text, -- Split Architecture
  gender text DEFAULT 'female',
  image text,
  images text[] DEFAULT '{}',
  discount numeric DEFAULT 0,
  stock integer DEFAULT 50,
  size_stock jsonb DEFAULT '{"S": 10, "M": 10, "L": 10, "XL": 10}',
  is_best_seller boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Categories (Functional Type Management)
CREATE TABLE IF NOT EXISTS public.categories (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL UNIQUE,
  gender text DEFAULT 'unisex',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Collections (Split Management - Curated Lines)
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    image TEXT,
    description TEXT,
    gender TEXT DEFAULT 'female',
    show_on_home BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid REFERENCES auth.users(id),
  items jsonb NOT NULL,
  total numeric NOT NULL,
  status text DEFAULT 'pending',
  customer_details jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  email text,
  role text DEFAULT 'customer',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Banners
CREATE TABLE IF NOT EXISTS public.banners (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title text NOT NULL,
  subtitle text,
  image text,
  cta text DEFAULT 'Keşfet',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Announcements
CREATE TABLE IF NOT EXISTS public.announcements (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Site Settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Social Gallery
CREATE TABLE IF NOT EXISTS public.social_gallery (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  image text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. COLUMN SYNC (Ensures missing columns are added to existing tables)
DO $$ 
BEGIN
    -- Products Sync
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' and column_name='collection') THEN
        ALTER TABLE public.products ADD COLUMN collection text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' and column_name='size_stock') THEN
        ALTER TABLE public.products ADD COLUMN size_stock jsonb DEFAULT '{"S": 10, "M": 10, "L": 10, "XL": 10}';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' and column_name='stock') THEN
        ALTER TABLE public.products ADD COLUMN stock integer DEFAULT 50;
    END IF;

    -- Collections Gender Field
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='collections' and column_name='gender') THEN
        ALTER TABLE public.collections ADD COLUMN gender TEXT DEFAULT 'female';
    END IF;
END $$;

-- 4. SECURITY & RLS POLICIES (Idempotent)

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_gallery ENABLE ROW LEVEL SECURITY;

-- Products Policies
DROP POLICY IF EXISTS "Public Select Products" ON public.products;
DROP POLICY IF EXISTS "Public Insert Products" ON public.products;
DROP POLICY IF EXISTS "Public Update Products" ON public.products;
DROP POLICY IF EXISTS "Public Delete Products" ON public.products;
CREATE POLICY "Public Select Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Insert Products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Public Delete Products" ON public.products FOR DELETE USING (true);

-- Categories Policies
DROP POLICY IF EXISTS "Public Select Categories" ON public.categories;
DROP POLICY IF EXISTS "Public Insert Categories" ON public.categories;
DROP POLICY IF EXISTS "Public Delete Categories" ON public.categories;
CREATE POLICY "Public Select Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Insert Categories" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Delete Categories" ON public.categories FOR DELETE USING (true);

-- Collections Policies
DROP POLICY IF EXISTS "Public Select Collections" ON public.collections;
DROP POLICY IF EXISTS "Public Insert Collections" ON public.collections;
DROP POLICY IF EXISTS "Public Update Collections" ON public.collections;
DROP POLICY IF EXISTS "Public Delete Collections" ON public.collections;
CREATE POLICY "Public Select Collections" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Public Insert Collections" ON public.collections FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Collections" ON public.collections FOR UPDATE USING (true);
CREATE POLICY "Public Delete Collections" ON public.collections FOR DELETE USING (true);

-- Social Gallery Policies
DROP POLICY IF EXISTS "Public Select Social" ON public.social_gallery;
DROP POLICY IF EXISTS "Public Insert Social" ON public.social_gallery;
DROP POLICY IF EXISTS "Public Delete Social" ON public.social_gallery;
CREATE POLICY "Public Select Social" ON public.social_gallery FOR SELECT USING (true);
CREATE POLICY "Public Insert Social" ON public.social_gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Delete Social" ON public.social_gallery FOR DELETE USING (true);

-- Banners Policies
DROP POLICY IF EXISTS "Public Select Banners" ON public.banners;
DROP POLICY IF EXISTS "Public Manage Banners" ON public.banners;
CREATE POLICY "Public Select Banners" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Public Manage Banners" ON public.banners FOR ALL USING (true);

-- Site Settings Policies
DROP POLICY IF EXISTS "Public Select Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public Manage Settings" ON public.site_settings;
CREATE POLICY "Public Select Settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public Manage Settings" ON public.site_settings FOR ALL USING (true);

-- Orders Policies
DROP POLICY IF EXISTS "Public Manage Orders" ON public.orders;
CREATE POLICY "Public Manage Orders" ON public.orders FOR ALL USING (true);

-- Profiles Policies
DROP POLICY IF EXISTS "Public Select Profiles" ON public.profiles;
CREATE POLICY "Public Select Profiles" ON public.profiles FOR SELECT USING (true);

-- ============================================================
-- ULTIMATE MASTER SCHEMA COMPLETE ✅
-- Instructions: Copy and paste this entire code into Supabase SQL Editor.
-- ============================================================
