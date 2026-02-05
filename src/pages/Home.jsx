import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import MainLayout from '../components/MainLayout';
import HeroSlider from '../components/HeroSlider';
import ProductGrid from '../components/ProductGrid';
import { Truck, RotateCcw, ShieldCheck, Instagram, MessageCircle } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { collections, products, socialGallery } = useShop();

  // Featured Collections from dedicated collections table
  const featuredCollections = collections?.filter(c => c.show_on_home) || [];

  return (
    <MainLayout>
      <div className="home-page">
        <HeroSlider />

        {featuredCollections.length > 0 && (
          <section className="categories-section">
            <div className="section-container">
              <div className="section-title-wrapper">
                <h2 className="section-title">KOLEKSİYONLAR</h2>
                <div className="title-accent"></div>
              </div>
              <div className="cat-grid-asymmetric">
                {featuredCollections.map((cat, index) => (
                  <div
                    key={cat.id || index}
                    className={`cat-card dynamic-card ${index % 3 === 0 ? 'large' : 'small'}`}
                    style={{ backgroundImage: `url(${cat.image || 'https://images.unsplash.com/photo-1571244837341-38c44240a5fa'})` }}
                    onClick={() => navigate(`/shop?collection=${cat.name}`)}
                  >
                    <div className="cat-overlay"></div>
                    <div className="cat-info-v2">
                      <h3>{cat.name}</h3>
                      <p>{cat.description || 'Yeni Sezon Keşfet'}</p>
                      <button className="glow-btn-cyan">KOLEKSİYONU KEŞFET</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="product-grid-section">
          <div className="section-container">
            <div className="presentation-layout">
              <div className="presentation-board glass" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1470&auto=format&fit=crop')" }}>
                <div className="board-content">
                  <h2>YENİ SEZON</h2>
                  <p>Keşfetmeye Hazır Mısın?</p>
                  <button className="glow-btn" onClick={() => navigate('/shop')}>ŞİMDİ AL</button>
                </div>
              </div>
              <div className="grid-content">
                <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
                  <h2 className="section-title">EN ÇOK SATANLAR</h2>
                  <div className="title-accent" style={{ margin: '0' }}></div>
                </div>
                <ProductGrid limit={4} />
              </div>
            </div>
          </div>
        </section>

        <section className="social-section">
          <div className="section-container">
            <div className="section-title-wrapper">
              <h2 className="section-title">@GIYIMSPORTS</h2>
              <div className="title-accent"></div>
            </div>
            <div className="insta-gallery">
              {socialGallery && socialGallery.length > 0 ? (
                socialGallery.slice(0, 4).map((item, idx) => (
                  <div key={item.id || idx} className="insta-item" style={{ backgroundImage: `url(${item.image})` }}></div>
                ))
              ) : (
                <>
                  <div className="insta-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1548691905-57c36cc8d93f?q=80&w=1469&auto=format&fit=crop')" }}></div>
                  <div className="insta-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?q=80&w=1572&auto=format&fit=crop')" }}></div>
                  <div className="insta-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1374&auto=format&fit=crop')" }}></div>
                  <div className="insta-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?q=80&w=1373&auto=format&fit=crop')" }}></div>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="section-container">
            <div className="features-grid">
              <div className="feature-item glass">
                <Truck className="feature-icon" size={32} />
                <div>
                  <h3>Hızlı Kargo</h3>
                  <p>Tüm Türkiye'ye 24 Saatte Kargo</p>
                </div>
              </div>
              <div className="feature-item glass">
                <RotateCcw className="feature-icon" size={32} />
                <div>
                  <h3>Kolay İade</h3>
                  <p>14 Gün Şartsız İade İmkanı</p>
                </div>
              </div>
              <div className="feature-item glass">
                <ShieldCheck className="feature-icon" size={32} />
                <div>
                  <h3>Güvenli Ödeme</h3>
                  <p>256-bit SSL Güvenli Altyapı</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Home;
