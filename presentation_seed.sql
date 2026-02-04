-- ==========================================================
-- GİYİM SPORTS - PROFESYONEL SUNUM DATASI (GENİŞLETİLMİŞ)
-- ==========================================================

-- 1. ADIM: Tabloyu Hazırla
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS size_stock JSONB DEFAULT '{"S": 10, "M": 10, "L": 10, "XL": 10}'::jsonb;

-- 2. ADIM: Mevcut Ürünleri Temizle (Sunumun tertemiz ve düzenli gözükmesi için önerilir)
TRUNCATE public.products RESTART IDENTITY CASCADE;

-- 3. ADIM: Tüm Kategoriler İçin 2şer Ürün Ekle
INSERT INTO public.products (name, price, category, gender, image, images, discount, stock, is_best_seller, size_stock) VALUES

-- TİŞÖRTLER (2 Ürün)
('Aero-Cool Performance Tişört', 389, 'Tişört', 'male', 
'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1374&auto=format&fit=crop', 
'{"https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1374&auto=format&fit=crop"}', 
10, 50, true, '{"S": 15, "M": 20, "L": 10, "XL": 5}'),

('Cotton-Soft Günlük Spor Tee', 299, 'Tişört', 'female', 
'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=1300&auto=format&fit=crop', 
'{"https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=1300&auto=format&fit=crop"}', 
0, 40, false, '{"S": 10, "M": 10, "L": 10, "XL": 10}'),

-- TAYTLAR (2 Ürün)
('Sculpt-Max Yüksek Bel Tayt', 649, 'Tayt', 'female', 
'https://images.unsplash.com/photo-1506191652621-18f4224039ec?q=80&w=1470&auto=format&fit=crop', 
'{"https://images.unsplash.com/photo-1506191652621-18f4224039ec?q=80&w=1470&auto=format&fit=crop", "https://images.unsplash.com/photo-1548691905-57c36cc8d93f?q=80&w=1469&auto=format&fit=crop"}', 
20, 35, true, '{"S": 0, "M": 15, "L": 10, "XL": 10}'),

('Infinity Seamless Dikişsiz Tayt', 729, 'Tayt', 'female', 
'https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?q=80&w=1572&auto=format&fit=crop', 
'{"https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?q=80&w=1572&auto=format&fit=crop"}', 
0, 25, true, '{"S": 5, "M": 5, "L": 10, "XL": 5}'),

-- ŞORTLAR (2 Ürün)
('Fast-Dry Atletik Şort', 349, 'Şort', 'male', 
'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=1470&auto=format&fit=crop', 
'{"https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=1470&auto=format&fit=crop"}', 
10, 30, false, '{"S": 8, "M": 12, "L": 10, "XL": 0}'),

('Active-Vibe Koşu Şortu', 319, 'Şort', 'female', 
'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1440&auto=format&fit=crop', 
'{"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1440&auto=format&fit=crop"}', 
15, 45, true, '{"S": 10, "M": 15, "L": 15, "XL": 5}'),

-- EŞOFMANLAR (2 Ürün)
('Cargo-Style Jogger Eşofman', 849, 'Eşofman', 'unisex', 
'https://images.unsplash.com/photo-1515434126000-961d90ff09db?q=80&w=1470&auto=format&fit=crop', 
'{"https://images.unsplash.com/photo-1515434126000-961d90ff09db?q=80&w=1470&auto=format&fit=crop"}', 
5, 18, true, '{"S": 0, "M": 4, "L": 8, "XL": 6}'),

('Ultra-Soft Polar Eşofman Altı', 799, 'Eşofman', 'female', 
'https://images.unsplash.com/photo-1552664110-ad30427b095a?q=80&w=1374&auto=format&fit=crop', 
'{"https://images.unsplash.com/photo-1552664110-ad30427b095a?q=80&w=1374&auto=format&fit=crop"}', 
0, 20, false, '{"S": 5, "M": 5, "L": 5, "XL": 5}');
