import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import MainLayout from '../components/MainLayout';
import { ChevronLeft, ShoppingCart, Zap } from 'lucide-react';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, addToCart, loading } = useShop();
    const [selectedSize, setSelectedSize] = useState('M');

    const product = products?.find(p => String(p.id) === id);
    const sizes = ['S', 'M', 'L', 'XL'];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    // Set a default available size if current one is out of stock
    useEffect(() => {
        if (product?.size_stock && (product.size_stock[selectedSize] || 0) === 0) {
            const firstAvailable = sizes.find(s => (product.size_stock[s] || 0) > 0);
            if (firstAvailable) setSelectedSize(firstAvailable);
        }
    }, [product]);

    if (loading) {
        return (
            <MainLayout>
                <div className="section-container" style={{ padding: '10rem 0', textAlign: 'center', minHeight: '60vh' }}>
                    <div className="loading-spinner">Ürün Yükleniyor...</div>
                </div>
            </MainLayout>
        );
    }

    if (!product) {
        return (
            <MainLayout>
                <div className="section-container" style={{ padding: '10rem 0', textAlign: 'center', minHeight: '60vh' }}>
                    <h2>Ürün bulunamadı.</h2>
                    <button className="glow-btn" onClick={() => navigate('/shop')} style={{ marginTop: '1rem' }}>Mağazaya Dön</button>
                </div>
            </MainLayout>
        );
    }

    const discountedPrice = (product.discount || 0) > 0
        ? (product.price * (100 - product.discount)) / 100
        : product.price;

    return (
        <MainLayout>
            <div className="product-detail-page">
                <div className="section-container">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <ChevronLeft size={20} /> Geri Dön
                    </button>

                    <div className="detail-layout">
                        <div className="detail-gallery">
                            {(product.images && product.images.length > 0 ? product.images : [product.image]).map((img, idx) => (
                                <div key={idx} className="gallery-item">
                                    <img
                                        src={img}
                                        alt={`${product.name} - ${idx + 1}`}
                                    />
                                    {idx === 0 && (product.discount || 0) > 0 && <div className="discount-badge">-%{product.discount}</div>}
                                </div>
                            ))}
                        </div>

                        <div className="detail-info-sticky">
                            <span className="detail-category">{product.category}</span>
                            <h1 className="detail-title">{product.name}</h1>

                            <div className="detail-price-box">
                                {(product.discount || 0) > 0 && <span className="detail-old-price">{product.price} TL</span>}
                                <span className="detail-current-price">{discountedPrice.toFixed(0)} TL</span>
                            </div>

                            <div className="size-selector">
                                <span className="selector-label">BEDEN SEÇ: {selectedSize}</span>
                                <div className="size-buttons">
                                    {sizes.map(size => {
                                        const isOutOfStock = (product.size_stock?.[size] || 0) === 0;
                                        return (
                                            <button
                                                key={size}
                                                className={`size-btn ${selectedSize === size ? 'active' : ''} ${isOutOfStock ? 'out-of-stock' : ''}`}
                                                onClick={() => setSelectedSize(size)}
                                                disabled={isOutOfStock}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <p className="detail-desc">
                                Giyim Sports'un en yeni koleksiyonundan, performans ve şıklığı bir araya getiren özel tasarım.
                                Nefes alan kumaş teknolojisi ve maksimum konfor ile antrenmanlarınızda sizi destekler.
                            </p>

                            {Object.values(product.size_stock || {}).reduce((a, b) => a + b, 0) <= 10 && Object.values(product.size_stock || {}).reduce((a, b) => a + b, 0) > 0 && (
                                <div className="stock-warning" style={{ color: '#d32f2f', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>⚠️</span> Acele Et! Toplam {Object.values(product.size_stock || {}).reduce((a, b) => a + b, 0)} adet kaldı, tükeniyor!
                                </div>
                            )}

                            <div className="detail-actions">
                                <button
                                    className="glow-btn full-btn"
                                    onClick={() => addToCart(product, selectedSize)}
                                    disabled={(product.size_stock?.[selectedSize] || 0) === 0}
                                >
                                    {(product.size_stock?.[selectedSize] || 0) === 0 ? 'STOKTA YOK' : <><ShoppingCart size={20} /> Sepete Ekle</>}
                                </button>
                                <button
                                    className="glow-btn quick-buy-btn full-btn"
                                    onClick={() => { addToCart(product, selectedSize); navigate('/checkout'); }}
                                    disabled={(product.size_stock?.[selectedSize] || 0) === 0}
                                >
                                    {(product.size_stock?.[selectedSize] || 0) === 0 ? 'STOKTA YOK' : <><Zap size={20} /> Hızlı Al</>}
                                </button>
                            </div>

                            <div className="detail-features">
                                <div className="feature-small">✓ Ücretsiz Kargo</div>
                                <div className="feature-small">✓ 14 Gün İade Garantisi</div>
                                <div className="feature-small">✓ %100 Orijinal Ürün</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ProductDetail;
