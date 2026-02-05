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
    const [cart, setCart] = useState([]);
    const [socialGallery, setSocialGallery] = useState([]);
    const [allProfiles, setAllProfiles] = useState([]);
    const [collections, setCollections] = useState([]);

    // Fetch initial data from Supabase
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);

                // 1. Products
                const { data: productsData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
                if (productsData) {
                    setProducts(productsData.map(p => ({
                        ...p,
                        images: Array.isArray(p.images) ? p.images : (p.image ? [p.image] : []),
                        isBestSeller: p.is_best_seller,
                        stock: p.stock ?? 50,
                        size_stock: p.size_stock || { S: 10, M: 10, L: 10, XL: 10 }
                    })));
                }

                // 2. Categories
                const { data: categoriesData } = await supabase.from('categories').select('*');
                if (categoriesData) setCategories(categoriesData);

                // 3. Banners
                const { data: bannersData } = await supabase.from('banners').select('*').order('created_at', { ascending: false });
                if (bannersData) setBanners(bannersData);

                // 4. Announcements
                const { data: announcementsData } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
                if (announcementsData) setAnnouncements(announcementsData);

                // 5. About Settings
                const { data: settingsData } = await supabase.from('site_settings').select('data').eq('id', 'about_data').single();
                if (settingsData) setAboutData(settingsData.data);

                // 6. Social Gallery
                const { data: socialData } = await supabase.from('social_gallery').select('*').order('created_at', { ascending: false });
                if (socialData) setSocialGallery(socialData);

                // 7. Collections
                const { data: collectionsData } = await supabase.from('collections').select('*').order('created_at', { ascending: false });
                if (collectionsData) setCollections(collectionsData);

                // 8. Orders (If user logged in)
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    const { data: ordersData } = await supabase.from('orders').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
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

    // Supabase Auth Listener
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setCurrentUser(session?.user ?? null);
            if (session?.user) {
                supabase.from('orders').select('*').eq('user_id', session.user.id).then(({ data }) => {
                    if (data) setOrders(data);
                });
            } else {
                setOrders([]);
            }
        });
        return () => subscription.unsubscribe();
    }, []);

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
    // Fetch cart from DB on login
    useEffect(() => {
        if (currentUser) {
            const fetchCart = async () => {
                const { data, error } = await supabase
                    .from('cart')
                    .select('items')
                    .eq('user_id', currentUser.id)
                    .single();

                if (!error && data?.items) {
                    setCart(data.items);
                }
            };
            fetchCart();
        }
    }, [currentUser]);

    // Save cart to DB on change
    useEffect(() => {
        if (currentUser && cart.length > 0) {
            const saveCart = async () => {
                await supabase
                    .from('cart')
                    .upsert({ user_id: currentUser.id, items: cart }, { onConflict: 'user_id' });
            };
            saveCart();
        }
    }, [cart, currentUser]);

    return (
        <ShopContext.Provider value={{
            products, setProducts,
            banners, setBanners,
            announcements, setAnnouncements,
            categories, setCategories,
            cart, addToCart, removeFromCart, updateCartQuantity,
            orders, placeOrder, deleteOrder,
            currentUser, loading,
            aboutData, setAboutData,
            addProduct, updateProduct, removeProduct,
            addCategory, updateCategory, removeCategory,
            collections, addCollection, updateCollection, removeCollection,
            addBanner, updateBanner, deleteBanner,
            addAnnouncement, updateAnnouncement, deleteAnnouncement,
            updateAboutData,
            socialGallery, addSocialImage, deleteSocialImage,
            register, login, logout, resetPassword, updatePassword,
            allProfiles, fetchCustomers
        }}>
            {children}
        </ShopContext.Provider>
    );
};

export const useShop = () => useContext(ShopContext);
