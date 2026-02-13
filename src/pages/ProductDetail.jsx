import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import MainLayout from '../components/MainLayout';
import { ChevronLeft, ShoppingCart, Zap, MessageSquare, Star, Trash2, X } from 'lucide-react';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, addToCart, loading, reviews, addReview, deleteReview, currentUser } = useShop();
    const [selectedSize, setSelectedSize] = useState('M');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState({
        name: '',
        surname: '',
        title: '',
        comment: '',
        rating: 5
    });

    const product = products?.find(p => String(p.id) === id);
    const productReviews = reviews?.filter(r => String(r.product_id) === id) || [];
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
                    <div className="reviews-section">
                        <div className="reviews-header">
                            <div>
                                <h2>Müşteri Değerlendirmeleri</h2>
                                <div className="avg-rating-large">
                                    <div className="stars">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star
                                                key={star}
                                                size={24}
                                                fill={star <= (productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length || 0) ? "var(--rating-gold)" : "none"}
                                                color={star <= (productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length || 0) ? "var(--rating-gold)" : "#ccc"}
                                            />
                                        ))}
                                    </div>
                                    <span>{productReviews.length > 0 ? (productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length).toFixed(1) : "0.0"} / 5 ({productReviews.length} Yorum)</span>
                                </div>
                            </div>
                            <button className="glow-btn-cyan" onClick={() => setShowReviewForm(true)}>
                                <MessageSquare size={18} /> Yorum Yap
                            </button>
                        </div>

                        {showReviewForm && (
                            <div className="review-modal-overlay">
                                <div className="review-modal glass">
                                    <div className="modal-header">
                                        <h3>Değerlendirmenizi Paylaşın</h3>
                                        <button onClick={() => setShowReviewForm(false)}><X size={24} /></button>
                                    </div>
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        const { error } = await addReview({
                                            ...newReview,
                                            product_id: product.id,
                                            user_id: currentUser?.id || null
                                        });
                                        if (!error) {
                                            setShowReviewForm(false);
                                            setNewReview({ name: '', surname: '', title: '', comment: '', rating: 5 });
                                        }
                                    }}>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>İsim</label>
                                                <input type="text" required value={newReview.name} onChange={e => setNewReview({ ...newReview, name: e.target.value })} />
                                            </div>
                                            <div className="form-group">
                                                <label>Soyisim</label>
                                                <input type="text" required value={newReview.surname} onChange={e => setNewReview({ ...newReview, surname: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Başlık</label>
                                            <input type="text" required value={newReview.title} onChange={e => setNewReview({ ...newReview, title: e.target.value })} placeholder="Örn: Harika kumaş kalitesi!" />
                                        </div>
                                        <div className="form-group">
                                            <label>Puanınız</label>
                                            <div className="star-rating-selector">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                                    >
                                                        <Star
                                                            size={32}
                                                            fill={star <= newReview.rating ? "var(--rating-gold)" : "none"}
                                                            color={star <= newReview.rating ? "var(--rating-gold)" : "#ccc"}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Yorumunuz</label>
                                            <textarea rows={4} required value={newReview.comment} onChange={e => setNewReview({ ...newReview, comment: e.target.value })} />
                                        </div>
                                        <button type="submit" className="glow-btn-cyan full-btn" style={{ marginTop: '1rem' }}>Gönder</button>
                                    </form>
                                </div>
                            </div>
                        )}

                        <div className="reviews-list">
                            {productReviews.length === 0 ? (
                                <p className="no-reviews">Öncelikli yorum yapan siz olun! Bu ürün için henüz değerlendirme yapılmamış.</p>
                            ) : (
                                productReviews.map((review) => (
                                    <div key={review.id} className="review-card glass">
                                        <div className="review-card-header">
                                            <div className="user-info">
                                                <strong>{review.name} {review.surname[0]}.</strong>
                                                <div className="stars">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <Star
                                                            key={star}
                                                            size={14}
                                                            fill={star <= review.rating ? "var(--rating-gold)" : "none"}
                                                            color={star <= review.rating ? "var(--rating-gold)" : "#ccc"}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="review-date">{new Date(review.created_at).toLocaleDateString('tr-TR')}</span>
                                        </div>
                                        <h4 className="review-title">{review.title}</h4>
                                        <p className="review-text">{review.comment}</p>
                                        {(currentUser?.id === review.user_id || currentUser?.profile?.role === 'admin') && (
                                            <button
                                                className="delete-review-btn"
                                                onClick={() => {
                                                    if (window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
                                                        deleteReview(review.id);
                                                    }
                                                }}
                                            >
                                                <Trash2 size={16} /> Sil
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ProductDetail;
