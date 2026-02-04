import React from 'react';
import { Instagram, MessageCircle } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="section-container">
                <div className="footer-content">
                    <div className="footer-info">
                        <h2 className="logo">GIYIM<span>.</span></h2>
                        <p>Türkiye'nin en sevilen butik spor giyim mağazası.</p>
                        <div className="social-links">
                            <Instagram size={24} />
                            <MessageCircle size={24} />
                        </div>
                    </div>
                    <div className="footer-cta">
                        <h3>Yardıma mı ihtiyacın var?</h3>
                        <p>Müşteri hizmetlerimiz WhatsApp'ta seni bekliyor.</p>
                        <button className="glow-btn wa-footer-btn" onClick={() => window.open('https://wa.me/905000000000', '_blank')}>
                            <MessageCircle size={20} /> WhatsApp Destek Hattı
                        </button>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 GIYIM SPORTS. Tüm Hakları Saklıdır.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
