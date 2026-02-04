import { createClient } from '@supabase/supabase-js';

// NOT: Bu dosyayı çalıştırmadan önce .env dosyanızda VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY tanımlı olmalıdır.
// Çalıştırmak için: node src/utils/seedSupabase.js (Node ortamında import/export sorunu olabilir, bu yüzden tarayıcı konsolundan veya geçici bir bileşenden çağırmak daha kolaydır)

export const seedDatabase = async (supabase) => {
    console.log("Veri tabanı yükleniyor...");

    const initialProducts = [
        { id: 1, name: "Pro Compression Tayt", price: 899, category: "Tayt", gender: "female", image: "https://images.unsplash.com/photo-1506629082928-03820f487d7b?q=80&w=1974&auto=format&fit=crop", images: ["https://images.unsplash.com/photo-1506629082928-03820f487d7b?q=80&w=1974&auto=format&fit=crop"], discount: 15, isBestSeller: true },
        { id: 2, name: "Breathable Mesh Tişört", price: 549, category: "Tişört", gender: "male", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1974&auto=format&fit=crop", images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1974&auto=format&fit=crop"], discount: 0, isBestSeller: true },
        { id: 3, name: "Performance Oversize Sweat", price: 1299, category: "Sweat", gender: "female", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1974&auto=format&fit=crop", images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1974&auto=format&fit=crop"], discount: 20, isBestSeller: true },
        { id: 4, name: "Elite Training Tayt", price: 949, category: "Tayt", gender: "female", image: "https://images.unsplash.com/photo-1539109132381-31a1C97427a1?q=80&w=1974&auto=format&fit=crop", images: ["https://images.unsplash.com/photo-1539109132381-31a1C97427a1?q=80&w=1974&auto=format&fit=crop"], discount: 10, isBestSeller: true }
    ];

    const initialCategories = [
        { name: "Tayt", gender: "female" },
        { name: "Tişört", gender: "unisex" },
        { name: "Sweat", gender: "unisex" },
        { name: "Aksesuar", gender: "unisex" }
    ];

    // 1. Ürünleri Yükle
    const { error: productError } = await supabase.from('products').upsert(initialProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        gender: p.gender,
        image: p.image,
        images: p.images,
        discount: p.discount,
        is_best_seller: p.isBestSeller // Veritabanında snake_case olabilir, kontrol lazım
    })));

    if (productError) console.error("Ürün yükleme hatası:", productError);
    else console.log("Ürünler yüklendi!");

    // 2. Kategorileri Yükle
    const { error: catError } = await supabase.from('categories').upsert(initialCategories);

    if (catError) console.error("Kategori yükleme hatası:", catError);
    else console.log("Kategoriler yüklendi!");

    alert("Veritabanı kurulumu tamamlandı!");
};
