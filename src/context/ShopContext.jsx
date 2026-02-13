import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [banners, setBanners] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [orders, setOrders] = useState([]);
    const [aboutData, setAboutData] = useState(null);
    const [cart, setCart] = useState(() => {
        const localCart = localStorage.getItem('giyim_cart');
        return localCart ? JSON.parse(localCart) : [];
    });
    const [socialGallery, setSocialGallery] = useState([]);
    const [allProfiles, setAllProfiles] = useState([]);
    const [collections, setCollections] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [reviews, setReviews] = useState([]);

    // Fetch initial data from Supabase
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);

                // Parallel fetch for initial speed boost
                const results = await Promise.all([
                    supabase.from('products').select('*').order('created_at', { ascending: false }),
                    supabase.from('categories').select('*'),
                    supabase.from('banners').select('*').order('created_at', { ascending: false }),
                    supabase.from('announcements').select('*').order('created_at', { ascending: false }),
                    supabase.from('site_settings').select('data').eq('id', 'about_data').single(),
                    supabase.from('social_gallery').select('*').order('created_at', { ascending: false }),
                    supabase.from('collections').select('*').order('created_at', { ascending: false }),
                    supabase.from('coupons').select('*').order('created_at', { ascending: false }),
                    supabase.from('reviews').select('*').order('created_at', { ascending: false }),
                    supabase.auth.getSession()
                ]);

                // Map results to data and check for individual errors
                const [
                    { data: productsData, error: pErr },
                    { data: categoriesData, error: catErr },
                    { data: bannersData, error: bErr },
                    { data: announcementsData, error: aErr },
                    { data: settingsData, error: sErr },
                    { data: socialData, error: socErr },
                    { data: collectionsData, error: colErr },
                    { data: couponsData, error: coupErr },
                    { data: reviewsData, error: revErr },
                    { data: authData, error: authErr }
                ] = results;

                if (pErr) console.error("Error fetching products:", pErr);
                if (catErr) console.error("Error fetching categories:", catErr);
                if (bErr) console.error("Error fetching banners:", bErr);
                if (aErr) console.error("Error fetching announcements:", aErr);
                if (socErr) console.error("Error fetching social gallery:", socErr);
                if (colErr) console.error("Error fetching collections:", colErr);
                if (coupErr) console.error("Error fetching coupons (migration check?):", coupErr);
                if (revErr) console.error("Error fetching reviews (migration check?):", revErr);

                const session = authData?.session;

                // 1. Set Products
                if (productsData) {
                    setProducts(productsData.map(p => ({
                        ...p,
                        images: Array.isArray(p.images) ? p.images : (p.image ? [p.image] : []),
                        isBestSeller: p.is_best_seller,
                        stock: p.stock ?? 50,
                        size_stock: p.size_stock || { S: 10, M: 10, L: 10, XL: 10 }
                    })));
                }

                // 2. Set Categories
                if (categoriesData) setCategories(categoriesData);

                // 3. Set Banners
                if (bannersData) setBanners(bannersData);

                // 4. Set Announcements
                if (announcementsData) setAnnouncements(announcementsData);

                // 5. Set About Data
                if (settingsData && settingsData.data) setAboutData(settingsData.data);

                // 6. Set Social Gallery
                if (socialData) setSocialGallery(socialData);

                // 7. Set Collections
                if (collectionsData) setCollections(collectionsData);

                // 8. Set Coupons
                if (couponsData) setCoupons(couponsData);

                // 9. Set Reviews
                if (reviewsData) setReviews(reviewsData);

                // 10. Set Orders (If user logged in)
                if (session?.user) {
                    const { data: ordersData, error: oErr } = await supabase.from('orders').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
                    if (oErr) console.error("Error fetching user orders:", oErr);
                    if (ordersData) setOrders(ordersData);
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // Supabase Auth Listener & Profile Sync
    useEffect(() => {
        const fetchProfile = async (userId) => {
            const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
            if (!error && data) {
                setCurrentUser(prev => ({ ...prev, profile: data }));
            }
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const user = session?.user ?? null;
            setCurrentUser(user);

            if (user) {
                fetchProfile(user.id);
                supabase.from('orders').select('*').eq('user_id', user.id).then(({ data }) => {
                    if (data) setOrders(data);
                });
            } else {
                setOrders([]);
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    const updateProfile = async (profileData) => {
        if (!currentUser) return { error: 'Giriş yapılmadı.' };
        const { error } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', currentUser.id);

        if (!error) {
            setCurrentUser(prev => ({
                ...prev,
                profile: { ...prev.profile, ...profileData }
            }));
        }
        return { error };
    };

    const updateCartQuantity = (id, size, delta) => {
        setCart((prev) => {
            return prev.map(item => {
                if (item.id === id && item.size === size) {
                    const newQty = Math.max(1, item.quantity + delta);
                    const product = products.find(p => p.id === id);
                    if (product && newQty > product.stock) {
                        return item;
                    }
                    return { ...item, quantity: newQty };
                }
                return item;
            });
        });
    };

    const addToCart = (product, size = 'M') => {
        if (product.stock === 0) return;

        setCart((prev) => {
            const existing = prev.find(item => item.id === product.id && item.size === size);
            if (existing) {
                if (existing.quantity + 1 > product.stock) return prev;
                return prev.map(item => (item.id === product.id && item.size === size) ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1, size }];
        });
    };

    const removeFromCart = (id, size) => {
        setCart((prev) => prev.filter(item => !(item.id === id && item.size === size)));
    };

    const placeOrder = async (customerDetails) => {
        const total = cart.reduce((acc, item) => acc + (item.price * (1 - item.discount / 100)) * item.quantity, 0);
        const orderData = {
            user_id: currentUser?.id || null,
            items: cart,
            total: total,
            customer_details: customerDetails,
            status: 'pending'
        };
        const { data, error } = await supabase.from('orders').insert([orderData]).select();
        if (error) {
            console.error('Order Error:', error);
            return null;
        }

        // --- Automatic Stock Reduction ---
        for (const item of cart) {
            const product = products.find(p => p.id === item.id);
            if (product) {
                const newStock = Math.max(0, product.stock - item.quantity);
                await supabase.from('products').update({ stock: newStock }).eq('id', item.id);
                // Update local state is handled by the fetch or manual sync
                setProducts(prev => prev.map(p => p.id === item.id ? { ...p, stock: newStock } : p));
            }
        }

        setOrders(prev => [data[0], ...prev]);
        setCart([]);
        return data[0].id;
    };

    const deleteOrder = async (id) => {
        const { error } = await supabase.from('orders').delete().eq('id', id);
        if (!error) setOrders(prev => prev.filter(order => order.id !== id));
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        const { data, error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId)
            .select();

        if (!error && data && data[0]) {
            setOrders(prev => prev.map(order => order.id === orderId ? data[0] : order));
            return { success: true };
        }
        return { success: false, error };
    };

    // --- Product & Category Actions ---
    const addProduct = async (product) => {
        const { isBestSeller, ...rest } = product;
        const dbProduct = {
            ...rest,
            is_best_seller: !!isBestSeller,
            stock: product.stock ?? 50,
            gender: product.gender || 'female',
            images: Array.isArray(product.images) ? product.images : [],
            size_stock: product.size_stock || { S: 10, M: 10, L: 10, XL: 10 }
        };

        const { data, error } = await supabase.from('products').insert([dbProduct]).select();

        if (error) {
            console.error('Add Product Error:', error);
            return { data: null, error };
        }

        if (data && data[0]) {
            const mapped = {
                ...data[0],
                isBestSeller: data[0].is_best_seller,
                stock: data[0].stock ?? 50
            };
            setProducts(prev => [mapped, ...prev]);
            return { data: mapped, error: null };
        }
        return { data: null, error: error?.message || 'Unknown error' };
    };

    const updateProduct = async (product) => {
        const { id, isBestSeller, ...rest } = product;
        const dbProduct = {
            ...rest,
            is_best_seller: !!isBestSeller,
            stock: product.stock ?? 50,
            gender: product.gender || 'female',
            images: Array.isArray(product.images) ? product.images : [],
            size_stock: product.size_stock || { S: 10, M: 10, L: 10, XL: 10 }
        };

        const { data, error } = await supabase.from('products').update(dbProduct).eq('id', id).select();

        if (error) {
            console.error('Update Product Error:', error);
            return { data: null, error };
        }

        if (data && data[0]) {
            const mapped = {
                ...data[0],
                isBestSeller: data[0].is_best_seller,
                stock: data[0].stock ?? 50
            };
            setProducts(prev => prev.map(p => p.id === id ? mapped : p));
            return { data: mapped, error: null };
        }
        return { data: null, error: 'Unknown error' };
    };

    const removeProduct = async (id) => {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) setProducts(prev => prev.filter(p => p.id !== id));
        return { error };
    };

    const addCategory = async (category) => {
        const { data, error } = await supabase.from('categories').insert([category]).select();
        if (!error && data) setCategories(prev => [...prev, data[0]]);
        return { data, error };
    };

    const updateCategory = async (category) => {
        const { id, ...rest } = category;
        const { data, error } = await supabase.from('categories').update(rest).eq('id', id).select();
        if (!error && data && data[0]) {
            setCategories(prev => prev.map(c => c.id === id ? data[0] : c));
        }
        return { data, error };
    };

    const removeCategory = async (id) => {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (!error) setCategories(prev => prev.filter(c => c.id !== id));
        return { error };
    };

    // --- Collections Actions ---
    const addCollection = async (collection) => {
        const { data, error } = await supabase.from('collections').insert([collection]).select();
        if (!error && data) setCollections(prev => [...prev, data[0]]);
        return { data, error };
    };

    const updateCollection = async (collection) => {
        const { id, ...rest } = collection;
        const { data, error } = await supabase.from('collections').update(rest).eq('id', id).select();
        if (!error && data && data[0]) {
            setCollections(prev => prev.map(c => c.id === id ? data[0] : c));
        }
        return { data, error };
    };

    const removeCollection = async (id) => {
        const { error } = await supabase.from('collections').delete().eq('id', id);
        if (!error) setCollections(prev => prev.filter(c => c.id !== id));
        return { error };
    };

    // --- Banners, Announcements, Site Settings ---
    const addBanner = async (banner) => {
        const { data, error } = await supabase.from('banners').insert([banner]).select();
        if (!error && data && data[0]) {
            setBanners(prev => [data[0], ...prev]);
        }
        return { data, error };
    };

    const updateBanner = async (banner) => {
        const { id, ...rest } = banner;
        const { data, error } = await supabase.from('banners').update(rest).eq('id', id).select();
        if (!error && data && data[0]) {
            setBanners(prev => prev.map(b => b.id === id ? data[0] : b));
        }
        return { data, error };
    };

    const deleteBanner = async (id) => {
        const { error } = await supabase.from('banners').delete().eq('id', id);
        if (!error) setBanners(prev => prev.filter(b => b.id !== id));
        return { error };
    };

    const addAnnouncement = async (content) => {
        const { data, error } = await supabase.from('announcements').insert([{ content }]).select();
        if (!error && data) setAnnouncements(prev => [data[0], ...prev]);
        return { data, error };
    };

    const updateAnnouncement = async (id, content) => {
        const { data, error } = await supabase.from('announcements').update({ content }).eq('id', id).select();
        if (!error && data) setAnnouncements(prev => prev.map(a => a.id === id ? data[0] : a));
        return { data, error };
    };

    const deleteAnnouncement = async (id) => {
        const { error } = await supabase.from('announcements').delete().eq('id', id);
        if (!error) setAnnouncements(prev => prev.filter(a => a.id !== id));
        return { error };
    };

    const updateAboutData = async (data) => {
        const { error } = await supabase.from('site_settings').upsert({
            id: 'about_data',
            data,
            updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

        if (!error) setAboutData(data);
        return { error };
    };

    const addSocialImage = async (image) => {
        const { data, error } = await supabase.from('social_gallery').insert([{ image }]).select();
        if (!error && data) setSocialGallery(prev => [data[0], ...prev]);
        return { data, error };
    };

    const deleteSocialImage = async (id) => {
        const { error } = await supabase.from('social_gallery').delete().eq('id', id);
        if (!error) setSocialGallery(prev => prev.filter(item => item.id !== id));
        return { error };
    };

    const fetchCustomers = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error && data) setAllProfiles(data);
        return { data, error };
    };

    // --- Coupons Action ---
    const addCoupon = async (coupon) => {
        const { data, error } = await supabase.from('coupons').insert([coupon]).select();
        if (!error && data) setCoupons(prev => [data[0], ...prev]);
        return { data, error };
    };

    const deleteCoupon = async (id) => {
        const { error } = await supabase.from('coupons').delete().eq('id', id);
        if (!error) setCoupons(prev => prev.filter(c => c.id !== id));
        return { error };
    };

    // --- Reviews Actions ---
    const addReview = async (review) => {
        const { data, error } = await supabase.from('reviews').insert([review]).select();
        if (!error && data) setReviews(prev => [data[0], ...prev]);
        return { data, error };
    };

    const deleteReview = async (id) => {
        const { error } = await supabase.from('reviews').delete().eq('id', id);
        if (!error) setReviews(prev => prev.filter(r => r.id !== id));
        return { error };
    };

    // --- Authentication ---
    const register = async (email, password) => {
        // First check if user exists in profiles to give a clear error
        const { data: existingUser } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            throw new Error('Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapın veya şifrenizi sıfırlayın.');
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) throw error;
        return data;
    };

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setCart([]);
        localStorage.removeItem('giyim_cart');
    };

    const resetPassword = async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
    };

    const updatePassword = async (newPassword) => {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });
        if (error) throw error;
    };

    // --- Persistent Cart Sync ---
    // 1. Local Storage Sync (Every change)
    useEffect(() => {
        localStorage.setItem('giyim_cart', JSON.stringify(cart));
    }, [cart]);

    // 2. Fetch cart from DB on login & Merge
    useEffect(() => {
        if (currentUser) {
            const syncDBCart = async () => {
                const { data, error } = await supabase
                    .from('cart')
                    .select('items')
                    .eq('user_id', currentUser.id)
                    .single();

                if (!error && data?.items) {
                    // Merge logic: DB cart takes priority, but we can combine or just replace
                    // Replacement is safer for "one source of truth"
                    setCart(data.items);
                } else if (cart.length > 0) {
                    // If DB is empty but we have local items, upload them
                    await supabase.from('cart').upsert({ user_id: currentUser.id, items: cart });
                }
            };
            syncDBCart();
        }
    }, [currentUser?.id]);

    // 3. Save cart to DB with debounce
    useEffect(() => {
        if (currentUser && cart.length > 0) {
            const timer = setTimeout(async () => {
                await supabase
                    .from('cart')
                    .upsert({ user_id: currentUser.id, items: cart }, { onConflict: 'user_id' });
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [cart, currentUser?.id]);

    return (
        <ShopContext.Provider value={{
            products, setProducts,
            banners, setBanners,
            announcements, setAnnouncements,
            categories, setCategories,
            cart, addToCart, removeFromCart, updateCartQuantity,
            orders, placeOrder, deleteOrder, updateOrderStatus,
            currentUser, loading,
            aboutData, setAboutData,
            addProduct, updateProduct, removeProduct,
            addCategory, updateCategory, removeCategory,
            collections, addCollection, updateCollection, removeCollection,
            addBanner, updateBanner, deleteBanner,
            addAnnouncement, updateAnnouncement, deleteAnnouncement,
            updateAboutData, updateProfile,
            socialGallery, addSocialImage, deleteSocialImage,
            coupons, addCoupon, deleteCoupon,
            reviews, addReview, deleteReview,
            register, login, logout, resetPassword, updatePassword,
            allProfiles, fetchCustomers
        }}>
            {children}
        </ShopContext.Provider>
    );
};

export const useShop = () => useContext(ShopContext);
