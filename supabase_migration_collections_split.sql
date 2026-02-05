-- 1. Create Collections Table
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    image TEXT,
    description TEXT,
    show_on_home BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add collection column to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS collection TEXT;

-- 3. Enable RLS
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

-- 4. Policies for Collections
DROP POLICY IF EXISTS "Public can view collections" ON public.collections;
CREATE POLICY "Public can view collections" ON public.collections
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage collections" ON public.collections;
CREATE POLICY "Admins can manage collections" ON public.collections
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );
