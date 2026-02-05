import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, User, Package, ChevronRight, Home, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const MobileMenu = ({ isOpen, onClose }) => {
    const { categories: shopCategories = [], currentUser, logout } = useShop();
    const navigate = useNavigate();

    // Dynamic Collection Logic: Pull from both categories table and products for a robust sync
    const { products = [] } = useShop();

    // 1. Get all unique categories from products to handle ones not in the categories table
    const categoriesFromProducts = products.reduce((acc, p) => {
        if (p.category && !acc.some(cat => cat.name === p.category)) {
            acc.push({ name: p.category, gender: p.gender || 'unisex' });
        }
        return acc;
    }, []);

    // 2. Combine with official categories table data
    const combinedCategories = [...shopCategories];
    categoriesFromProducts.forEach(prodCat => {
        if (!combinedCategories.some(c => c.name.toLowerCase() === prodCat.name.toLowerCase())) {
            combinedCategories.push(prodCat);
        }
    });

    // 3. Group by Gender
    const womenCats = combinedCategories.filter(c => c.gender === 'female' || c.gender === 'unisex');
    const menCats = combinedCategories.filter(c => c.gender === 'male' || c.gender === 'unisex');

    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleLinkClick = (path) => {
        navigate(path);
        onClose();
    };

    const handleCategoryClick = (cat, gender) => {
        navigate(`/shop?cat=${cat}&gender=${gender}`);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="mobile-menu-overlay"
                    />
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="mobile-menu"
                    >
                        <div className="mobile-menu-header">
                            <Link to="/" className="logo" onClick={onClose}>GIYIM<span>.</span></Link>
                            <button onClick={onClose} style={{ background: 'none', border: 'none' }}><X size={28} /></button>
                        </div>

                        <nav className="mobile-nav-links">
                            <button onClick={() => handleLinkClick('/')}><Home size={24} /> Ana Sayfa</button>
                            <button onClick={() => handleLinkClick('/shop')}><ShoppingBag size={24} /> Mağaza</button>
                            <button onClick={() => handleLinkClick('/collections')}><Package size={24} /> Koleksiyonlar</button>

                            {currentUser ? (
                                <button onClick={() => handleLinkClick('/account')}><User size={24} /> Hesabım</button>
                            ) : (
                                <button onClick={() => handleLinkClick('/auth')}><User size={24} /> Giriş Yap</button>
                            )}
                        </nav>

                        <div className="mobile-menu-section">
                            <h3>KADIN KATEGORİLERİ</h3>
                            <div className="mobile-cat-list">
                                <button className="mobile-cat-item" onClick={() => handleCategoryClick('Hepsi', 'female')}>Tümü</button>
                                {womenCats.map(cat => (
                                    <button key={`w-${cat.id || cat.name}`} className="mobile-cat-item" onClick={() => handleCategoryClick(cat.name, 'female')}>
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mobile-menu-section" style={{ marginTop: '2rem', paddingTop: '2rem' }}>
                            <h3>ERKEK KATEGORİLERİ</h3>
                            <div className="mobile-cat-list">
                                <button className="mobile-cat-item" onClick={() => handleCategoryClick('Hepsi', 'male')}>Tümü</button>
                                {menCats.map(cat => (
                                    <button key={`m-${cat.id || cat.name}`} className="mobile-cat-item" onClick={() => handleCategoryClick(cat.name, 'male')}>
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {currentUser && (
                            <div className="mobile-menu-section" style={{ marginTop: 'auto', borderTop: 'none', paddingTop: 0 }}>
                                <button onClick={() => { logout(); onClose(); navigate('/'); }} style={{ color: '#ff4d4d', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <X size={20} /> ÇIKIŞ YAP
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MobileMenu;
