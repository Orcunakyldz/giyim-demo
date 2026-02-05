import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import MainLayout from '../components/MainLayout';

const Collections = () => {
    const { collections, loading } = useShop();
    const navigate = useNavigate();

    if (loading) {
        return (
            <MainLayout>
                <div className="section-container" style={{ padding: '10rem 0', textAlign: 'center', minHeight: '60vh' }}>
                    <div className="loading-spinner">Yükleniyor...</div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="collections-page">
                <div className="section-container">
                    <header className="page-header" style={{ marginBottom: '4rem', textAlign: 'center' }}>
                        <h1 className="section-title">KOLEKSİYONLAR</h1>
                        <div className="title-accent" style={{ margin: '0 auto 1.5rem auto' }}></div>
                        <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                            Giyim Sports'un özenle seçilmiş, yüksek performans ve stil odaklı koleksiyonlarını keşfedin.
                        </p>
                    </header>

                    <div className="collections-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '3rem' }}>
                        {collections?.length > 0 ? (
                            collections.map((cat, idx) => (
                                <div
                                    key={cat.id || idx}
                                    className="collection-card dynamic-card"
                                    onClick={() => navigate(`/shop?collection=${cat.name}`)}
                                    style={{
                                        position: 'relative',
                                        height: '500px',
                                        backgroundImage: `url(${cat.image || 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1470&auto=format&fit=crop'})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        border: '1px solid var(--border)'
                                    }}
                                >
                                    <div className="cat-overlay" style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
                                    }}></div>
                                    <div className="cat-info-v2" style={{
                                        position: 'absolute',
                                        bottom: '3rem',
                                        left: '3rem',
                                        right: '3rem'
                                    }}>
                                        <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.8 }}>
                                            {cat.gender === 'female' ? 'KADIN' : cat.gender === 'male' ? 'ERKEK' : 'UNISEX'} KOLLEKSİYONU
                                        </span>
                                        <h2 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 950, marginBottom: '1rem' }}>{cat.name}</h2>
                                        <p style={{ color: '#ccc', marginBottom: '2rem', maxWidth: '400px' }}>{cat.description || 'Yeni sezonun en özel parçalarını yakından inceleyin.'}</p>
                                        <button className="glow-btn" style={{ marginTop: '2rem', padding: '1rem 3rem', letterSpacing: '2px' }}>KOLEKSİYONU KEŞFET</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '5rem' }}>
                                <p>Henüz aktif koleksiyon bulunmamaktadır.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Collections;
