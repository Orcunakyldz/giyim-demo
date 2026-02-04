import React from 'react';
import { useShop } from '../context/ShopContext';
import MainLayout from '../components/MainLayout';
import { Star, Instagram, Heart, Award, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
    const { aboutData } = useShop();

    if (!aboutData) return <div className="loading-screen">Yükleniyor...</div>;

    const { hero = {}, story = {}, testimonials = [], instagram = [], gallery = [] } = aboutData || {};

    return (
        <MainLayout>
            <div className="about-page">
                {/* Hero Section */}
                <section className="about-hero" style={{
                    background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${hero?.image || ''}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>
                    <div className="section-container">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="about-hero-content"
                        >
                            <h1>{hero?.title || 'Hakkımızda'}<span>.</span></h1>
                            <p>{hero?.subtitle || ''}</p>
                        </motion.div>
                    </div>
                </section>

                {/* Brand Story */}
                <section className="brand-story section-container">
                    <div className="story-grid">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="story-image"
                            style={{ backgroundImage: `url('${story?.image || ''}')` }}
                        />
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="story-text"
                        >
                            <h2>{story?.title || 'Marka Hikayemiz'}</h2>
                            <p>{story?.text || 'Lorem ipsum dolor sit amet...'}</p>
                            <ul className="brand-values">
                                <li><Heart size={20} /> <span>Sürdürülebilir Üretim</span></li>
                                <li><Award size={20} /> <span>Premium Kalite</span></li>
                                <li><ShieldCheck size={20} /> <span>Maksimum Konfor</span></li>
                            </ul>
                        </motion.div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="testimonials section-container">
                    <div className="section-header">
                        <h2>MÜŞTERİ YORUMLARI</h2>
                        <p>Binlerce mutlu sporcunun arasına siz de katılın.</p>
                    </div>
                    <div className="testimonials-grid">
                        {(testimonials || []).map((t, i) => (
                            <motion.div
                                key={t?.id || i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="testimonial-card glass"
                            >
                                <div className="t-image">
                                    <img src={t?.image || '/images/t1.png'} alt={t?.name || 'Müşteri'} />
                                </div>
                                <div className="t-stars">
                                    {[...Array(Number(t?.rating) || 5)].map((_, i) => (
                                        <Star key={i} size={14} fill="currentColor" />
                                    ))}
                                </div>
                                <p className="t-comment">"{t?.comment || ''}"</p>
                                <h4 className="t-name">{t?.name || 'Misafir'}</h4>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Gallery Section */}
                <section className="insta-feed section-container">
                    <div className="insta-header">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                            <span style={{ fontSize: '2rem' }}>📸</span>
                            <h2>GALERİ</h2>
                            <p>Anlarımız ve Atmosferimiz</p>
                        </div>
                    </div>
                    <div className="insta-gallery">
                        {(gallery || instagram || []).map((item, i) => {
                            const imgSrc = typeof item === 'string' ? item : item?.image;
                            const caption = typeof item === 'string' ? '' : item?.caption;

                            return (
                                <div key={i} className="insta-item" style={{ backgroundImage: `url('${imgSrc || ''}')`, position: 'relative', overflow: 'hidden' }}>
                                    {caption && (
                                        <div className="gallery-caption" style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            background: 'rgba(0,0,0,0.7)',
                                            color: '#fff',
                                            padding: '0.5rem',
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            textAlign: 'center'
                                        }}>
                                            {caption}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </MainLayout>
    );
};

export default About;
