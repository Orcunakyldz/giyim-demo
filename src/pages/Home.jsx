import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import HeroSlider from '../components/HeroSlider';
import ProductGrid from '../components/ProductGrid';
import { Truck, RotateCcw, ShieldCheck, Instagram, MessageCircle } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="home-page">
        <HeroSlider />

        <section className="features-section">
          <div className="section-container">
            <div className="features-grid">
              <div className="feature-item">
                <Truck className="feature-icon" size={32} />
                <div>
                  <h3>Hızlı Kargo</h3>
                  <p>Tüm Türkiye'ye 24 Saatte Kargo</p>
                </div>
              </div>
              <div className="feature-item">
                <RotateCcw className="feature-icon" size={32} />
                <div>
                  <h3>Kolay İade</h3>
                  <p>14 Gün Şartsız İade İmkanı</p>
                </div>
              </div>
              <div className="feature-item">
                <ShieldCheck className="feature-icon" size={32} />
                <div>
                  <h3>Güvenli Ödeme</h3>
                  <p>256-bit SSL Güvenli Altyapı</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="categories-section">
          <div className="section-container">
            <div className="cat-grid">
              <div className="cat-card tayt">
                <div className="cat-info">
                  <h3>TAYT</h3>
                  <p>Toparlayıcı Etki & Maksimum Konfor</p>
                  <button className="cat-btn" onClick={() => navigate('/shop?cat=Tayt')}>Koleksiyonu Gör</button>
                </div>
              </div>
              <div className="cat-card t-shirt">
                <div className="cat-info">
                  <h3>TİŞÖRT</h3>
                  <p>Nefes Alan Kumaş & Terletmez Teknoloji</p>
                  <button className="cat-btn" onClick={() => navigate('/shop?cat=Tişört')}>Koleksiyonu Gör</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ProductGrid />

        <section className="social-section">
          <div className="section-container">
            <div className="social-header">
              <Instagram size={64} style={{ marginBottom: '2rem' }} />
              <h2>Takipte Kalın</h2>
              <p>En yeni kombinler ve indirimler için bizi Instagram'da takip edin.</p>
            </div>
            <div className="insta-grid">
              <div className="insta-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1548691905-57c36cc8d93f?q=80&w=1469&auto=format&fit=crop')" }}></div>
              <div className="insta-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?q=80&w=1572&auto=format&fit=crop')" }}></div>
              <div className="insta-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1374&auto=format&fit=crop')" }}></div>
              <div className="insta-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?q=80&w=1373&auto=format&fit=crop')" }}></div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Home;
