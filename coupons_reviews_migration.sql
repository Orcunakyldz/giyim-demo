-- Giyim Sports: Coupons & Reviews Migration
-- Enables Sponsor Coupons and Product Review/Rating System

-- 1. Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_percent INTEGER NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id bigint REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    title TEXT NOT NULL,
    comment TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RLS Policies for Coupons
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Public can Read coupons (to validate during checkout)
CREATE POLICY "Public can read coupons" 
ON public.coupons FOR SELECT 
USING (true);

-- Admin can manage coupons
CREATE POLICY "Admin can manage coupons" 
ON public.coupons FOR ALL 
USING (auth.jwt() ->> 'email' = 'admin@giyim.com'); -- Replace with your actual admin identifier if different

-- 4. RLS Policies for Reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public can Read reviews
CREATE POLICY "Public can read reviews" 
ON public.reviews FOR SELECT 
USING (true);

-- Authenticated/Public can Insert reviews
CREATE POLICY "Anyone can insert reviews" 
ON public.reviews FOR INSERT 
WITH CHECK (true);

-- Users can delete their own reviews, Admin can delete all
CREATE POLICY "Delete own or admin delete all" 
ON public.reviews FOR DELETE 
USING (
    auth.uid() = user_id OR 
    auth.jwt() ->> 'email' = 'admin@giyim.com'
);

-- 5. Helper Index (Optional but recommended)
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
