import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import MainLayout from '../components/MainLayout';

const Shop = () => {
    const { products, categories: shopCategories, loading } = useShop();
    const [searchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('cat') || 'Hepsi');
    const [selectedGender, setSelectedGender] = useState('female');
    const [sortOrder, setSortOrder] = useState('default');

    useEffect(() => {
        const cat = searchParams.get('cat');
        const gen = searchParams.get('gender');
        if (cat) setSelectedCategory(cat);
        if (gen) setSelectedGender(gen);
    }, [searchParams]);

    if (loading) {
        return (
            <MainLayout>
                <div className="section-container" style={{ padding: '10rem 0', textAlign: 'center', minHeight: '60vh' }}>
                    <div className="loading-spinner">Yükleniyor...</div>
                </div>
            </MainLayout>
        );
    }

    const categories = ['Hepsi', ...(shopCategories || [])];

    const filteredProducts = (products || [])
        .filter(p => {
            if (!p) return false;
            const collectionParam = searchParams.get('collection');
            const collectionMatch = !collectionParam || p.collection === collectionParam;
            const categoryMatch = selectedCategory === 'Hepsi' || p.category === selectedCategory;
            const genderMatch = p.gender === 'unisex' || p.gender === selectedGender;
            return categoryMatch && genderMatch && collectionMatch;
        })
        .sort((a, b) => {
            const priceA = (a.price || 0) * (1 - (a.discount || 0) / 100);
            const priceB = (b.price || 0) * (1 - (b.discount || 0) / 100);
            if (sortOrder === 'low-high') return priceA - priceB;
            if (sortOrder === 'high-low') return priceB - priceA;
            return 0;
        });

    return (
        <MainLayout>
            <div className="shop-page">
                <div className="section-container">
                    <header className="shop-header">
                        <h1 className="section-title">Mağaza</h1>
                        <div className="sort-bar">
                            <div className="sort-options">
                                <span>Sırala:</span>
                                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                                    <option value="default">Önerilen</option>
                                    <option value="low-high">En Düşük Fiyat</option>
                                    <option value="high-low">En Yüksek Fiyat</option>
                                </select>
                            </div>
                        </div>
                    </header>

                    <div className="shop-layout sidebar-left">
                        <aside className="shop-sidebar">
                            <div className="sidebar-section">
                                <h3 className="gender-header" style={{ cursor: 'pointer', color: selectedGender === 'female' ? 'var(--accent)' : 'inherit' }} onClick={() => setSelectedGender('female')}>KADIN</h3>
                                <div className="category-links">
                                    <button
                                        className={selectedCategory === 'Hepsi' && selectedGender === 'female' ? 'active' : ''}
                                        onClick={() => { setSelectedCategory('Hepsi'); setSelectedGender('female'); }}
                                    >
                                        Tümü
                                    </button>
                                    {Array.from(new Set((shopCategories || [])
                                        .filter(c => c.gender === 'female' || c.gender === 'unisex')
                                        .map(c => c.name)))
                                        .map(catName => (
                                            <button
                                                key={`women-${catName}`}
                                                className={selectedCategory === catName && selectedGender === 'female' ? 'active' : ''}
                                                onClick={() => { setSelectedCategory(catName); setSelectedGender('female'); }}
                                            >
                                                {catName}
                                            </button>
                                        ))}
                                </div>

                                <h3 className="gender-header" style={{ marginTop: '3rem', cursor: 'pointer', color: selectedGender === 'male' ? 'var(--accent)' : 'inherit' }} onClick={() => setSelectedGender('male')}>ERKEK</h3>
                                <div className="category-links">
                                    <button
                                        className={selectedCategory === 'Hepsi' && selectedGender === 'male' ? 'active' : ''}
                                        onClick={() => { setSelectedCategory('Hepsi'); setSelectedGender('male'); }}
                                    >
                                        Tümü
                                    </button>
                                    {Array.from(new Set((shopCategories || [])
                                        .filter(c => c.gender === 'male' || c.gender === 'unisex')
                                        .map(c => c.name)))
                                        .map(catName => (
                                            <button
                                                key={`men-${catName}`}
                                                className={selectedCategory === catName && selectedGender === 'male' ? 'active' : ''}
                                                onClick={() => { setSelectedCategory(catName); setSelectedGender('male'); }}
                                            >
                                                {catName}
                                            </button>
                                        ))}
                                </div>
                            </div>
                        </aside>

                        <main className="shop-main">
                            {filteredProducts.length === 0 ? (
                                <div className="no-products" style={{ textAlign: 'center', padding: '5rem 0' }}>
                                    <p>Bu kategoride ürün bulunamadı.</p>
                                    <button className="glow-btn" onClick={() => { setSelectedCategory('Hepsi'); setSelectedGender('female'); }}>Tümünü Gör</button>
                                </div>
                            ) : (
                                <div className="grid grid-small">
                                    {filteredProducts.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Shop;
